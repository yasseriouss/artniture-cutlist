/**
 * PDF Export for Cutting List Table
 * Generates a detailed PDF report of the cutting list with all fields
 */

import type { CutPiece, StockPiece } from './optimizer';

/**
 * Generate a detailed cutting list report
 */
export function generateCuttingListReport(cuts: CutPiece[], stocks: StockPiece[]): string {
  let report = '';

  // Header
  report += '╔════════════════════════════════════════════════════════════════════════════════════╗\n';
  report += '║                    ARTNITURE CUTLIST - CUTTING LIST REPORT                        ║\n';
  report += '╚════════════════════════════════════════════════════════════════════════════════════╝\n\n';

  // Summary
  report += 'SUMMARY\n';
  report += '═══════════════════════════════════════════════════════════════════════════════════\n';
  report += `Total Cut Pieces: ${cuts.length}\n`;
  report += `Total Pieces to Cut: ${cuts.reduce((sum, c) => sum + c.quantity, 0)}\n`;
  report += `Total Stock Pieces: ${stocks.length}\n`;
  report += `Report Generated: ${new Date().toLocaleString()}\n\n`;

  // Cutting List Table
  report += 'CUTTING LIST - PIECES\n';
  report += '═══════════════════════════════════════════════════════════════════════════════════\n';
  report += '┌──┬────────┬───────┬────────┬──────────┬─────────┬────────┬──────────┬───────────┐\n';
  report += '│# │ Length │ Width │ Qty    │ Material │ Texture │ Label  │ EdgeBand │ Groove    │\n';
  report += '├──┼────────┼───────┼────────┼──────────┼─────────┼────────┼──────────┼───────────┤\n';

  cuts.forEach((cut, idx) => {
    const id = String(idx + 1).padEnd(2);
    const length = String(cut.length).padEnd(6);
    const width = String(cut.width).padEnd(5);
    const qty = String(cut.quantity).padEnd(6);
    const material = cut.material.padEnd(8);
    const texture = (cut.texture || '-').substring(0, 7).padEnd(7);
    const label = (cut.label || '-').substring(0, 6).padEnd(6);
    
    let edgeBandStr = '-';
    if (cut.edgeBand && cut.edgeBand.thickness > 0) {
      const sides = [];
      if (cut.edgeBand.sides.top) sides.push('T');
      if (cut.edgeBand.sides.right) sides.push('R');
      if (cut.edgeBand.sides.bottom) sides.push('B');
      if (cut.edgeBand.sides.left) sides.push('L');
      edgeBandStr = `${cut.edgeBand.name}(${cut.edgeBand.thickness}mm)[${sides.join(',')}]`;
    }
    edgeBandStr = edgeBandStr.substring(0, 8).padEnd(8);

    let grooveStr = '-';
    if (cut.groove?.enabled) {
      grooveStr = `${cut.groove.direction.charAt(0).toUpperCase()}(${cut.groove.width}mm)`;
    }
    grooveStr = grooveStr.substring(0, 9).padEnd(9);

    report += `│${id}│ ${length} │ ${width} │ ${qty} │ ${material} │ ${texture} │ ${label} │ ${edgeBandStr} │ ${grooveStr} │\n`;
  });

  report += '└──┴────────┴───────┴────────┴──────────┴─────────┴────────┴──────────┴───────────┘\n\n';

  // Edge Banding Details
  const piecesWithBanding = cuts.filter((c) => c.edgeBand && c.edgeBand.thickness > 0);
  if (piecesWithBanding.length > 0) {
    report += 'EDGE BANDING DETAILS\n';
    report += '═══════════════════════════════════════════════════════════════════════════════════\n';
    report += '┌──────────────┬───────────┬─────┬─────┬─────────┬──────────┬──────────────────┐\n';
    report += '│ Material     │ Thickness │ Top │ Bot │ Left    │ Right    │ Pieces           │\n';
    report += '├──────────────┼───────────┼─────┼─────┼─────────┼──────────┼──────────────────┤\n';

    const bandGroups = new Map<string, { thickness: number; sides: any; count: number }>();
    piecesWithBanding.forEach((cut) => {
      if (cut.edgeBand) {
        const key = `${cut.edgeBand.name}-${cut.edgeBand.thickness}`;
        if (!bandGroups.has(key)) {
          bandGroups.set(key, { thickness: cut.edgeBand.thickness, sides: cut.edgeBand.sides, count: 0 });
        }
        const group = bandGroups.get(key)!;
        group.count += cut.quantity;
      }
    });

    bandGroups.forEach((group, key) => {
      const [name] = key.split('-');
      const material = name.padEnd(12);
      const thickness = String(group.thickness).padEnd(9);
      const top = group.sides.top ? 'Yes' : 'No';
      const bot = group.sides.bottom ? 'Yes' : 'No';
      const left = group.sides.left ? 'Yes' : 'No';
      const right = group.sides.right ? 'Yes' : 'No';
      const pieces = String(group.count).padEnd(16);
      report += `│ ${material} │ ${thickness} │ ${top.padEnd(3)} │ ${bot.padEnd(3)} │ ${left.padEnd(7)} │ ${right.padEnd(8)} │ ${pieces} │\n`;
    });

    report += '└──────────────┴───────────┴─────┴─────┴─────────┴──────────┴──────────────────┘\n\n';
  }

  // Groove Details
  const piecesWithGroove = cuts.filter((c) => c.groove?.enabled);
  if (piecesWithGroove.length > 0) {
    report += 'GROOVE SPECIFICATIONS\n';
    report += '═══════════════════════════════════════════════════════════════════════════════════\n';
    report += '┌──────────────┬───────┬──────────────┬─────────┬──────────────────┐\n';
    report += '│ Piece        │ Width │ Direction    │ Offset  │ Quantity         │\n';
    report += '├──────────────┼───────┼──────────────┼─────────┼──────────────────┤\n';

    piecesWithGroove.forEach((cut) => {
      if (cut.groove?.enabled) {
        const piece = (cut.label || `Piece ${cut.id}`).substring(0, 12).padEnd(12);
        const width = String(cut.groove.width).padEnd(5);
        const direction = cut.groove.direction.padEnd(12);
        const offset = String(cut.groove.offset || 0).padEnd(7);
        const qty = String(cut.quantity).padEnd(16);
        report += `│ ${piece} │ ${width} │ ${direction} │ ${offset} │ ${qty} │\n`;
      }
    });

    report += '└──────────────┴───────┴──────────────┴─────────┴──────────────────┘\n\n';
  }

  // Stock Pieces Table
  report += 'STOCK PIECES\n';
  report += '═══════════════════════════════════════════════════════════════════════════════════\n';
  report += '┌────────┬───────┬────────┬──────────┬─────────┬────────┬────────┐\n';
  report += '│ Length │ Width │ Qty    │ Material │ Texture │ Label  │ Price  │\n';
  report += '├────────┼───────┼────────┼──────────┼─────────┼────────┼────────┤\n';

  stocks.forEach((stock) => {
    const length = String(stock.length).padEnd(6);
    const width = String(stock.width).padEnd(5);
    const qty = String(stock.quantity).padEnd(6);
    const material = stock.material.padEnd(8);
    const texture = (stock.texture || '-').substring(0, 7).padEnd(7);
    const label = (stock.label || '-').substring(0, 6).padEnd(6);
    const price = String(stock.price || 0).padEnd(6);
    report += `│ ${length} │ ${width} │ ${qty} │ ${material} │ ${texture} │ ${label} │ ${price} │\n`;
  });

  report += '└────────┴───────┴────────┴──────────┴─────────┴────────┴────────┘\n\n';

  // Footer
  report += '═══════════════════════════════════════════════════════════════════════════════════\n';
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += 'Artniture Cutlist - Professional Cutting List Optimizer\n';
  report += '═══════════════════════════════════════════════════════════════════════════════════\n';

  return report;
}

/**
 * Export cutting list as text file
 */
export function exportCuttingListPDF(cuts: CutPiece[], stocks: StockPiece[], filename: string = 'artniture-cutting-list.txt'): void {
  const reportContent = generateCuttingListReport(cuts, stocks);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
