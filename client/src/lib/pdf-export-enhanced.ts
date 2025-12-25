/**
 * Enhanced PDF Export Utility for Artniture Cutlist
 * Generates comprehensive PDF reports with:
 * - Cutting list summary
 * - Layout details
 * - Edge banding specifications
 * - Groove information
 */

import type { OptimizationResult } from './optimizer';

/**
 * Generate a comprehensive PDF report
 */
export function generatePDFReport(result: OptimizationResult): string {
  let report = '';

  // Header
  report += '╔════════════════════════════════════════════════════════════════╗\n';
  report += '║           ARTNITURE CUTLIST - OPTIMIZATION REPORT             ║\n';
  report += '╚════════════════════════════════════════════════════════════════╝\n\n';

  // Summary Statistics
  report += '═══════════════════════════════════════════════════════════════\n';
  report += 'SUMMARY STATISTICS\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += `Total Stock Pieces Used:        ${result.totalStockUsed}\n`;
  report += `Total Cuts Needed:              ${result.totalCutsNeeded}\n`;
  report += `Cuts Successfully Placed:       ${result.cutsPlaced}\n`;
  report += `Average Material Utilization:   ${result.averageUtilization.toFixed(2)}%\n`;
  report += `Total Waste Material:           ${result.totalWaste.toFixed(2)} units²\n`;
  report += `Number of Layouts:              ${result.layouts.length}\n\n`;

  // Cut Pieces List
  report += '═══════════════════════════════════════════════════════════════\n';
  report += 'CUT PIECES SPECIFICATION\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '┌─────┬────────┬───────┬──────────┬──────────┬─────────────────┐\n';
  report += '│ ID  │ Length │ Width │ Quantity │ Material │ Customer        │\n';
  report += '├─────┼────────┼───────┼──────────┼──────────┼─────────────────┤\n';

  result.cuts.forEach((cut, idx) => {
    const id = String(idx + 1).padEnd(3);
    const length = String(cut.length).padEnd(6);
    const width = String(cut.width).padEnd(5);
    const qty = String(cut.quantity).padEnd(8);
    const material = cut.material.padEnd(8);
    const customer = (cut.customerName || 'N/A').substring(0, 15).padEnd(15);
    report += `│ ${id} │ ${length} │ ${width} │ ${qty} │ ${material} │ ${customer} │\n`;
  });

  report += '└─────┴────────┴───────┴──────────┴──────────┴─────────────────┘\n\n';

  // Edge Banding Details
  const piecesWithBanding = result.cuts.filter((c) => c.edgeBand);
  if (piecesWithBanding.length > 0) {
    report += '═══════════════════════════════════════════════════════════════\n';
    report += 'EDGE BANDING SPECIFICATIONS\n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += '┌──────────────┬───────────┬─────┬─────┬─────────┬──────────┐\n';
    report += '│ Material     │ Thickness │ Top │ Bot │ Left    │ Right    │\n';
    report += '├──────────────┼───────────┼─────┼─────┼─────────┼──────────┤\n';

    piecesWithBanding.forEach((cut) => {
      if (cut.edgeBand) {
        const material = cut.edgeBand.name.padEnd(12);
        const thickness = String(cut.edgeBand.thickness).padEnd(9);
        const top = cut.edgeBand.sides.top > 0 ? 'Yes' : 'No';
        const bot = cut.edgeBand.sides.bottom > 0 ? 'Yes' : 'No';
        const left = cut.edgeBand.sides.left > 0 ? 'Yes' : 'No';
        const right = cut.edgeBand.sides.right > 0 ? 'Yes' : 'No';
        report += `│ ${material} │ ${thickness} │ ${top.padEnd(3)} │ ${bot.padEnd(3)} │ ${left.padEnd(7)} │ ${right.padEnd(8)} │\n`;
      }
    });

    report += '└──────────────┴───────────┴─────┴─────┴─────────┴──────────┘\n\n';
  }

  // Groove Details
  const piecesWithGroove = result.cuts.filter((c) => c.groove?.enabled);
  if (piecesWithGroove.length > 0) {
    report += '═══════════════════════════════════════════════════════════════\n';
    report += 'GROOVE SPECIFICATIONS\n';
    report += '═══════════════════════════════════════════════════════════════\n';
    report += '┌──────────────┬───────┬──────────────┬─────────┐\n';
    report += '│ Piece        │ Width │ Direction    │ Offset  │\n';
    report += '├──────────────┼───────┼──────────────┼─────────┤\n';

    piecesWithGroove.forEach((cut) => {
      if (cut.groove?.enabled) {
        const piece = (cut.label || 'Piece').padEnd(12);
        const width = String(cut.groove.width).padEnd(5);
        const direction = cut.groove.direction.padEnd(12);
        const offset = String(cut.groove.offset || 0).padEnd(7);
        report += `│ ${piece} │ ${width} │ ${direction} │ ${offset} │\n`;
      }
    });

    report += '└──────────────┴───────┴──────────────┴─────────┘\n\n';
  }

  // Stock Pieces List
  report += '═══════════════════════════════════════════════════════════════\n';
  report += 'STOCK PIECES SPECIFICATION\n';
  report += '═══════════════════════════════════════════════════════════════\n';
  report += '┌────────┬───────┬──────────┬──────────┬───────┐\n';
  report += '│ Length │ Width │ Quantity │ Material │ Price │\n';
  report += '├────────┼───────┼──────────┼──────────┼───────┤\n';

  result.stocks.forEach((stock) => {
    const length = String(stock.length).padEnd(6);
    const width = String(stock.width).padEnd(5);
    const qty = String(stock.quantity).padEnd(8);
    const material = stock.material.padEnd(8);
    const price = String(stock.price).padEnd(5);
    report += `│ ${length} │ ${width} │ ${qty} │ ${material} │ ${price} │\n`;
  });

  report += '└────────┴───────┴──────────┴──────────┴───────┘\n\n';

  // Layout Details
  report += '═══════════════════════════════════════════════════════════════\n';
  report += 'LAYOUT DETAILS\n';
  report += '═══════════════════════════════════════════════════════════════\n';

  result.layouts.forEach((layout, idx) => {
    report += `\nLayout ${idx + 1}:\n`;
    report += `  Utilization Rate:  ${layout.utilizationRate.toFixed(2)}%\n`;
    report += `  Waste Area:        ${layout.wasteArea.toFixed(2)} units²\n`;
    report += `  Pieces Placed:     ${layout.positions.length}\n`;

    report += '  Pieces in this layout:\n';
    layout.positions.forEach((pos, pidx) => {
      report += `    ${pidx + 1}. ${pos.label || `Piece ${pidx + 1}`} (${pos.width}×${pos.height}) at (${pos.x}, ${pos.y})\n`;
    });
  });

  report += '\n═══════════════════════════════════════════════════════════════\n';
  report += `Report Generated: ${new Date().toLocaleString()}\n`;
  report += '═══════════════════════════════════════════════════════════════\n';

  return report;
}

/**
 * Export PDF report as text file
 */
export function exportPDFReport(result: OptimizationResult, filename: string = 'artniture-cutlist-report.txt'): void {
  const reportContent = generatePDFReport(result);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
