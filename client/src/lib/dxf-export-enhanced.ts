/**
 * Enhanced DXF Export Utility for Artniture Cutlist
 * Generates DXF (Drawing Exchange Format) files with support for:
 * - Edge banding visualization
 * - Groove lines
 * - Piece labels
 * - Dimensions
 */

import type { OptimizationResult, CutLayout, CutPosition } from './optimizer';

/**
 * Generate a comprehensive DXF file from optimization results
 */
export function generateDXF(result: OptimizationResult): string {
  let dxf = '';

  // DXF Header
  dxf += generateDXFHeader();

  // DXF Entities Section
  dxf += '  0\nSECTION\n  2\nENTITIES\n';

  // Draw each layout
  result.layouts.forEach((layout, layoutIndex) => {
    dxf += generateLayoutEntities(layout, layoutIndex, result);
  });

  // End sections
  dxf += '  0\nENDSEC\n  0\nEOF\n';

  return dxf;
}

/**
 * Generate DXF header section
 */
function generateDXFHeader(): string {
  return `  0
SECTION
  2
HEADER
  9
$ACADVER
  1
AC1021
  9
$EXTMIN
 10
0.0
 20
0.0
  9
$EXTMAX
 10
10000.0
 20
10000.0
  0
ENDSEC
  0
SECTION
  2
TABLES
  0
TABLE
  2
LAYER
 70
10
  0
LAYER
  2
0
 70
0
 62
7
  6
CONTINUOUS
  0
LAYER
  2
EDGE_BANDS
 70
0
 62
30
  6
CONTINUOUS
  0
LAYER
  2
GROOVES
 70
0
 62
5
  6
DASHED
  0
LAYER
  2
LABELS
 70
0
 62
7
  6
CONTINUOUS
  0
ENDTAB
  0
ENDTAB
  0
ENDSEC
`;
}

/**
 * Generate DXF entities for a layout
 */
function generateLayoutEntities(layout: CutLayout, layoutIndex: number, result: OptimizationResult): string {
  let entities = '';
  const stock = result.stocks.find((s) => s.id === layout.stockId);

  if (!stock) return entities;

  // Draw stock boundary
  entities += generateDXFRectangle(0, 0, stock.length, stock.width, '0', 'STOCK_BOUNDARY');

  // Draw each cut piece
  layout.positions.forEach((pos, index) => {
    // Draw piece rectangle
    entities += generateDXFRectangle(pos.x, pos.y, pos.width, pos.height, '0', `PIECE_${index}`);

    // Draw edge banding if present
    if (pos.edgeBand) {
      entities += generateEdgeBandingDXF(pos);
    }

    // Draw groove if present
    if (pos.groove?.enabled) {
      entities += generateGrooveDXF(pos);
    }

    // Draw label
    entities += generateDXFText(
      pos.x + pos.width / 2,
      pos.y + pos.height / 2,
      pos.label || `Piece ${index + 1}`,
      'LABELS'
    );

    // Draw dimensions
    entities += generateDXFDimension(
      pos.x,
      pos.y,
      pos.width,
      pos.height,
      `DIM_${index}`
    );
  });

  return entities;
}

/**
 * Generate DXF rectangle (4 lines forming a rectangle)
 */
function generateDXFRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  layer: string,
  name: string
): string {
  let rect = '';

  // Bottom line
  rect += `  0
LINE
  8
${layer}
 10
${x}
 20
${y}
 11
${x + width}
 21
${y}
`;

  // Right line
  rect += `  0
LINE
  8
${layer}
 10
${x + width}
 20
${y}
 11
${x + width}
 21
${y + height}
`;

  // Top line
  rect += `  0
LINE
  8
${layer}
 10
${x + width}
 20
${y + height}
 11
${x}
 21
${y + height}
`;

  // Left line
  rect += `  0
LINE
  8
${layer}
 10
${x}
 20
${y + height}
 11
${x}
 21
${y}
`;

  return rect;
}

/**
 * Generate DXF text label
 */
function generateDXFText(x: number, y: number, text: string, layer: string): string {
  return `  0
TEXT
  8
${layer}
 10
${x}
 20
${y}
 40
2.5
  1
${text}
  7
STANDARD
`;
}

/**
 * Generate DXF dimension line
 */
function generateDXFDimension(x: number, y: number, width: number, height: number, name: string): string {
  let dim = '';

  // Width dimension
  dim += `  0
LINE
  8
0
 10
${x}
 20
${y - 5}
 11
${x + width}
 21
${y - 5}
`;

  // Height dimension
  dim += `  0
LINE
  8
0
 10
${x - 5}
 20
${y}
 11
${x - 5}
 21
${y + height}
`;

  return dim;
}

/**
 * Generate DXF entities for edge banding
 */
function generateEdgeBandingDXF(pos: any): string {
  let entities = '';
  const band = pos.edgeBand;
  if (!band) return entities;

  const thickness = band.thickness * 0.5; // Scale for visualization

  // Top edge band
  if (band.sides.top > 0) {
    entities += generateDXFRectangle(pos.x, pos.y, pos.width, thickness, 'EDGE_BANDS', 'TOP_BAND');
  }

  // Bottom edge band
  if (band.sides.bottom > 0) {
    entities += generateDXFRectangle(pos.x, pos.y + pos.height - thickness, pos.width, thickness, 'EDGE_BANDS', 'BOTTOM_BAND');
  }

  // Left edge band
  if (band.sides.left > 0) {
    entities += generateDXFRectangle(pos.x, pos.y, thickness, pos.height, 'EDGE_BANDS', 'LEFT_BAND');
  }

  // Right edge band
  if (band.sides.right > 0) {
    entities += generateDXFRectangle(pos.x + pos.width - thickness, pos.y, thickness, pos.height, 'EDGE_BANDS', 'RIGHT_BAND');
  }

  return entities;
}

/**
 * Generate DXF entities for groove
 */
function generateGrooveDXF(pos: any): string {
  let entities = '';
  const groove = pos.groove;
  if (!groove?.enabled) return entities;

  if (groove.direction === 'horizontal') {
    const grooveY = pos.y + (groove.offset || 0);
    entities += `  0
LINE
  8
GROOVES
 10
${pos.x}
 20
${grooveY}
 11
${pos.x + pos.width}
 21
${grooveY}
`;
  } else {
    const grooveX = pos.x + (groove.offset || 0);
    entities += `  0
LINE
  8
GROOVES
 10
${grooveX}
 20
${pos.y}
 11
${grooveX}
 21
${pos.y + pos.height}
`;
  }

  return entities;
}

/**
 * Export DXF file
 */
export function exportDXFFile(result: OptimizationResult, filename: string = 'artniture-cutlist.dxf'): void {
  const dxfContent = generateDXF(result);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dxfContent));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
