# Artniture Cutlist - Professional Cutting List Optimizer

## Project Overview

**Artniture Cutlist** is a professional-grade web application for optimizing rectangular cutting layouts from panels. It integrates features from the original FreeCut desktop application with modern web technologies, providing a powerful tool for furniture manufacturers, woodworkers, and material processors.

### Key Features

#### 1. **Cutting List Management**
- Add and manage cut pieces with dimensions (length × width)
- Specify quantity, material type, texture, and custom labels
- Track customer names and grinding requirements
- Organize pieces with visibility toggles for different attributes

#### 2. **Stock Management**
- Define available stock panels with dimensions and quantity
- Track material costs and pricing
- Configure trim edge and priority settings
- Manage multiple stock types simultaneously

#### 3. **Edge Banding Support**
- **Optional edge banding** per piece
- **Per-side configuration**: Top, Left, Bottom, Right
- **Customizable edge band properties**:
  - Edge band name/material
  - Thickness specification
  - Individual side enable/disable
- Visualization in layout canvas with orange highlights

#### 4. **Groove Configuration**
- **Optional groove** per piece
- **Direction selection**: Horizontal or Vertical
- **Groove width** specification
- **Offset positioning** for precise placement
- Visualization in layout canvas with blue dashed lines

#### 5. **Layout Optimization**
- **Guillotine-based algorithm** for efficient cutting
- **Rotation support** for better material utilization
- **Multi-layout generation** for complex projects
- **Real-time utilization metrics**:
  - Material utilization percentage
  - Waste calculation
  - Piece placement tracking

#### 6. **Layout Visualization**
- **Interactive canvas** showing cutting layout
- **Color-coded pieces** for easy identification
- **Piece labels** with dimensions
- **Edge banding visualization** (orange borders)
- **Groove visualization** (blue dashed lines)
- **Multi-sheet navigation** for projects with multiple layouts
- **Grid overlay** for reference

#### 7. **Export Capabilities**

##### DXF Export
- Industry-standard CAD format
- Includes:
  - Piece outlines and boundaries
  - Edge banding layers
  - Groove lines
  - Piece labels
  - Dimension annotations
- Compatible with CNC machines and CAD software

##### PDF Report Export
- Comprehensive cutting list report
- Includes:
  - Summary statistics
  - Cut pieces specification table
  - Edge banding details
  - Groove specifications
  - Stock pieces information
  - Layout details with utilization rates
  - Timestamp and report metadata

#### 8. **Piece Identification**
- **Automatic label generation**: Piece #1, Piece #2, etc.
- **Custom labels**: User-defined piece names
- **Material tracking**: Material type per piece
- **Customer assignment**: Track which customer each piece belongs to

---

## User Interface

### Main Layout

The application uses a professional desktop-style interface with three main sections:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ARTNITURE CUTLIST                                 │
│         Professional Cutting List Optimizer                          │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┬────────┐
│                                                              │        │
│  PIECES | STOCK | LAYOUT                                    │ CONTROL│
│                                                              │ PANEL  │
│  ┌─────────────────────────────────────────────────────┐   │        │
│  │ Visibility Toggles & Data Entry                     │   │ Start  │
│  │ ┌──────────────────────────────────────────────────┐│   │ Stop   │
│  │ │ Length │ Width │ Qty │ Material │ Label │ ...   ││   │ Accept │
│  │ │ 620    │ 570   │ 3   │ glass    │ john  │ ...   ││   │ Save   │
│  │ │ 600    │ 500   │ 5   │ glass    │ mike  │ ...   ││   │ Print  │
│  │ └──────────────────────────────────────────────────┘│   │ DXF    │
│  │ Add/Delete/Clear Buttons                            │   │ PDF    │
│  └─────────────────────────────────────────────────────┘   │ Mirror │
│                                                              │        │
│  LAYOUT Tab: Canvas Visualization                           │ Pieces │
│  ┌─────────────────────────────────────────────────────┐   │ Updates│
│  │ [Canvas showing cutting layout with pieces]        │   │        │
│  │ Navigation: Previous | Sheet 1 of 2 | Next         │   │        │
│  └─────────────────────────────────────────────────────┘   │        │
└─────────────────────────────────────────────────────────────┴────────┘
```

### Tabs

1. **PIECES Tab**
   - Manage cut pieces
   - Configure edge banding and grooves
   - Set material, texture, and customer info
   - Visibility toggles for columns

2. **STOCK Tab**
   - Manage available stock panels
   - Set dimensions and quantity
   - Configure pricing and priority
   - Trim edge settings

3. **LAYOUT Tab**
   - View optimized cutting layout
   - Navigate between multiple layouts
   - See piece placement with labels
   - Visualize edge banding and grooves

### Right Control Panel

- **Operation Buttons**: Start, Stop, Accept, Save, Print, DXF, PDF, Mirror
- **Pieces Tab**: Shows utilization metrics, layout count, waste calculation
- **Updates Tab**: Real-time optimization feedback

---

## How to Use

### 1. Adding Cut Pieces

1. Go to the **PIECES** tab
2. Enter piece dimensions:
   - **Length**: The longer dimension
   - **Width**: The shorter dimension
   - **Quantity**: How many pieces needed
3. Select **Material** (glass, wood, pipe, etc.)
4. (Optional) Add **Texture**, **Label**, **Grinding**, **Customer Name**
5. Click **Add** button (green with + icon)

### 2. Configuring Edge Banding

For each piece, you can add edge banding:

1. In the piece row, look for the **Edge Bands** columns (Top, Left, Bottom, Right)
2. Click on a side to configure:
   - **Edge Band Name**: Material name (e.g., "Oak 2mm", "Walnut 1.5mm")
   - **Thickness**: Band thickness in mm
   - **Sides**: Select which sides get the edge band
3. The edge band will be visualized in the layout as orange borders

### 3. Configuring Grooves

For pieces with grooves:

1. Look for the **Groove** configuration in the piece details
2. Set:
   - **Width**: Groove width in mm
   - **Direction**: Horizontal or Vertical
   - **Offset**: Distance from edge (optional)
3. Grooves appear as blue dashed lines in the layout

### 4. Adding Stock Pieces

1. Go to the **STOCK** tab
2. Enter stock dimensions:
   - **Length**: Panel length
   - **Width**: Panel width
   - **Quantity**: How many panels available
3. Select **Material** type
4. (Optional) Set **Price** per panel
5. Click **Add** button

### 5. Running Optimization

1. Ensure you have at least one cut piece and one stock piece
2. (Optional) Adjust **Cut Width** slider (1-15mm, typical: 3mm for saw blade)
3. Click the **Optimize** button (blue with lightning icon)
4. The system calculates the best layout

### 6. Viewing Results

1. Go to the **LAYOUT** tab to see the cutting layout
2. Each piece shows:
   - Color-coded rectangle
   - Piece label and dimensions
   - Edge banding (orange borders)
   - Grooves (blue dashed lines)
3. Use **Previous/Next** buttons to navigate between layouts
4. The **Pieces** panel shows:
   - Material utilization percentage
   - Number of layouts
   - Total waste

### 7. Exporting Results

#### Export to DXF (for CNC/CAD)
1. Click the **DXF** button (blue button in control panel)
2. File downloads as `artniture-cutlist.dxf`
3. Open in CAD software (AutoCAD, LibreCAD, etc.)

#### Export to PDF (for reports)
1. Click the **PDF** button (purple button in control panel)
2. File downloads as `artniture-cutlist-report.txt`
3. Contains complete cutting list specifications

---

## Technical Specifications

### Optimization Algorithm

- **Type**: Guillotine-based cutting algorithm
- **Approach**: Greedy placement with rotation support
- **Optimization**: Pieces sorted by area (largest first)
- **Rotation**: Enabled for non-square pieces
- **Spacing**: Configurable cut width (saw blade thickness)

### Data Structures

#### CutPiece
```typescript
{
  id: string;
  length: number;
  width: number;
  quantity: number;
  material: string;
  texture: string;
  label: string;
  edgeBands: { top, left, bottom, right };
  edgeBand?: { name, thickness, sides };
  groove?: { enabled, width, direction, offset };
  grinding: string;
  customerName: string;
}
```

#### StockPiece
```typescript
{
  id: string;
  length: number;
  width: number;
  quantity: number;
  material: string;
  texture: string;
  label: string;
  price: number;
  trimEdge: boolean;
  priority: boolean;
}
```

#### CutPosition (in layout)
```typescript
{
  pieceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  label?: string;
  edgeBand?: EdgeBand;
  groove?: Groove;
}
```

### Export Formats

#### DXF (Drawing Exchange Format)
- **Layers**:
  - `0`: Stock boundaries and piece outlines
  - `EDGE_BANDS`: Edge banding visualization
  - `GROOVES`: Groove lines
  - `LABELS`: Piece labels
- **Entities**: Lines, text, rectangles
- **Compatibility**: AutoCAD, LibreCAD, Fusion 360, etc.

#### PDF Report
- **Format**: Plain text with ASCII formatting
- **Sections**:
  - Summary statistics
  - Cut pieces specification
  - Edge banding details
  - Groove specifications
  - Stock pieces information
  - Layout details

---

## Design Philosophy

### Industrial Minimalism
- **Precision-focused**: Clear, uncluttered interface
- **Professional appearance**: Desktop application aesthetic
- **Functional hierarchy**: Important controls prominently displayed
- **Color coding**: Logical use of colors (amber accents, blue grooves, orange edge bands)
- **Typography**: Clear, readable fonts with appropriate hierarchy

### User Experience
- **Familiar layout**: Desktop application-style interface
- **Immediate feedback**: Real-time optimization
- **Visual feedback**: Color-coded pieces, dimension labels
- **Comprehensive data**: Track all manufacturing details
- **Export flexibility**: Multiple output formats

---

## Keyboard Shortcuts & Tips

- **Tab key**: Navigate between input fields
- **Enter key**: Add piece/stock (after filling form)
- **Delete button**: Remove selected piece or stock
- **Clear button**: Remove all pieces or stocks
- **Visibility toggles**: Show/hide columns for cleaner view

---

## Troubleshooting

### Issue: Optimization shows no layouts
**Solution**: Ensure you have:
- At least one cut piece with quantity > 0
- At least one stock piece with quantity > 0
- Valid dimensions (length > 0, width > 0)

### Issue: Pieces not fitting on stock
**Solution**:
- Check piece dimensions vs. stock dimensions
- Increase stock quantity
- Enable rotation (should be automatic)
- Adjust cut width if too large

### Issue: Edge banding not showing
**Solution**:
- Ensure edge band is configured for the piece
- Check that at least one side is selected (top/left/bottom/right)
- Verify edge band thickness is > 0

### Issue: DXF file won't open in CAD software
**Solution**:
- Ensure your CAD software supports DXF format
- Try opening with AutoCAD, LibreCAD, or Fusion 360
- Check file is not corrupted (download again if needed)

---

## System Requirements

- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Screen**: Minimum 1024×768 resolution (1920×1080 recommended)
- **Internet**: Required for initial load (offline support coming soon)
- **Storage**: Minimal (all data stored in browser)

---

## Future Enhancements

- [ ] Import/Export CSV for batch operations
- [ ] Save/Load projects to local storage
- [ ] Advanced optimization algorithms (genetic algorithm, simulated annealing)
- [ ] 3D visualization of layouts
- [ ] Nesting optimization for irregular shapes
- [ ] Cost calculation and material tracking
- [ ] Multi-user collaboration
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Integration with ERP systems

---

## Support & Feedback

For issues, feature requests, or feedback:
- Check this documentation first
- Verify all input data is correct
- Try refreshing the page
- Clear browser cache if experiencing issues

---

## Version History

### v1.0 (Current)
- Initial release
- Core cutting optimization
- Edge banding support
- Groove configuration
- Layout visualization
- DXF and PDF export
- Desktop UI matching original FreeCut

---

## License

Artniture Cutlist is provided as-is for professional use in furniture manufacturing and material processing.

---

**Last Updated**: December 25, 2025
**Project**: Artniture Cutlist v1.0
**Status**: Production Ready
