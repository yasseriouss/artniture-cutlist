import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Download, Play, Square, CheckCircle, Save, Printer, FileJson, ArrowUpDown, ChevronLeft, ChevronRight, Copy, FileText } from 'lucide-react';
import type { CutPiece, StockPiece, OptimizationResult } from '@/lib/optimizer';
import { optimize } from '@/lib/optimizer';
import { exportDXFFile } from '@/lib/dxf-export-enhanced';
import { exportPDFReport } from '@/lib/pdf-export-enhanced';
import { CutCanvasEnhanced } from '@/components/CutCanvasEnhanced';
import { EnhancedCutForm } from '@/components/EnhancedCutForm';
import { EnhancedStockForm } from '@/components/EnhancedStockForm';
import { exportCuttingListPDF } from '@/lib/pdf-cutting-list';
import { nanoid } from 'nanoid';

/**
 * FreeCut Web - Desktop Application UI
 * 
 * Design Philosophy: Industrial Minimalism
 * - Table-based layout matching the original desktop application
 * - Right-side control panel with operation buttons
 * - Comprehensive data management for manufacturing
 */

export default function Home() {
  const [cuts, setCuts] = useState<CutPiece[]>([]);
  const [stocks, setStocks] = useState<StockPiece[]>([]);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [cutWidth, setCutWidth] = useState(3);
  const [activeLayout, setActiveLayout] = useState(0);

  // Visibility toggles
  const [showIndex, setShowIndex] = useState(true);
  const [showTexture, setShowTexture] = useState(true);
  const [showEdgeBands, setShowEdgeBands] = useState(true);
  const [showGrinding, setShowGrinding] = useState(true);
  const [showCustomer, setShowCustomer] = useState(true);

  // Stock visibility toggles
  const [showStockIndex, setShowStockIndex] = useState(true);
  const [showStockTexture, setShowStockTexture] = useState(true);
  const [showTrimEdge, setShowTrimEdge] = useState(false);
  const [showPriority, setShowPriority] = useState(false);

  // New cut piece form
  const [newCut, setNewCut] = useState<Partial<CutPiece>>({
    length: 0,
    width: 0,
    quantity: 1,
    material: 'glass',
    texture: '',
    label: '',
    edgeBands: { top: 0, left: 0, bottom: 0, right: 0 },
    edgeBand: { name: '', thickness: 0, sides: { top: 0, left: 0, bottom: 0, right: 0 } },
    groove: { enabled: false, width: 0, direction: 'horizontal' as const },
  });

  // New stock piece form
  const [newStock, setNewStock] = useState<Partial<StockPiece>>({
    length: 0,
    width: 0,
    quantity: 1,
    material: 'glass',
    texture: '',
    label: '',
    price: 0,
    trimEdge: false,
    priority: false,
  });

  const handleAddCut = () => {
    if (!newCut.length || !newCut.width) return;

    const cut: CutPiece = {
      id: nanoid(),
      length: newCut.length || 0,
      width: newCut.width || 0,
      quantity: newCut.quantity || 1,
      material: newCut.material || 'glass',
      texture: newCut.texture || '',
      label: newCut.label || '',
      edgeBands: newCut.edgeBands || { top: 0, left: 0, bottom: 0, right: 0 },
      edgeBand: newCut.edgeBand,
      groove: newCut.groove,
      grinding: '',
      customerName: '',
    };

    setCuts([...cuts, cut]);
    setNewCut({
      length: 0,
      width: 0,
      quantity: 1,
      material: 'glass',
      texture: '',
      label: '',
      edgeBands: { top: 0, left: 0, bottom: 0, right: 0 },
      edgeBand: { name: '', thickness: 0, sides: { top: 0, left: 0, bottom: 0, right: 0 } },
      groove: { enabled: false, width: 0, direction: 'horizontal' as const },
    });
  };

  const handleAddStock = () => {
    if (!newStock.length || !newStock.width) return;

    const stock: StockPiece = {
      id: nanoid(),
      length: newStock.length || 0,
      width: newStock.width || 0,
      quantity: newStock.quantity || 1,
      material: newStock.material || 'glass',
      texture: newStock.texture || '',
      label: newStock.label || '',
      price: newStock.price || 0,
      trimEdge: newStock.trimEdge || false,
      priority: newStock.priority || false,
    };

    setStocks([...stocks, stock]);
    setNewStock({
      length: 0,
      width: 0,
      quantity: 1,
      material: 'glass',
      texture: '',
      label: '',
      price: 0,
      trimEdge: false,
      priority: false,
    });
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const optimizationResult = optimize(stocks, cuts, cutWidth);
      setResult(optimizationResult);
      setIsOptimizing(false);
    }, 500);
  };

  const handleExportDXF = () => {
    if (!result) return;
    exportDXFFile(result, 'artniture-cutlist.dxf');
  };

  const handleExportPDF = () => {
    if (!result) return;
    exportPDFReport(result, 'artniture-cutlist-report.txt');
  };

  const handleExportCuttingList = () => {
    exportCuttingListPDF(cuts, stocks, 'artniture-cutting-list.txt');
  };

  const handleNavigateLayout = (direction: 'prev' | 'next') => {
    if (!result) return;
    if (direction === 'prev' && activeLayout > 0) {
      setActiveLayout(activeLayout - 1);
    } else if (direction === 'next' && activeLayout < result.layouts.length - 1) {
      setActiveLayout(activeLayout + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-300 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">ARTNITURE CUTLIST</h1>
          <div className="text-sm text-slate-600">Professional Cutting List Optimizer</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Tables */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="pieces" className="h-full">
            <TabsList className="w-full rounded-none border-b border-slate-300 bg-slate-50 p-0 h-auto">
              <TabsTrigger value="pieces" className="rounded-none border-r border-slate-300">
                PIECES
              </TabsTrigger>
              <TabsTrigger value="stock" className="rounded-none border-r border-slate-300">
                STOCK
              </TabsTrigger>
              <TabsTrigger value="layout" className="rounded-none">
                LAYOUT
              </TabsTrigger>
            </TabsList>

            {/* PIECES Table */}
            <TabsContent value="pieces" className="p-4 space-y-4">
              {/* Visibility Toggles */}
              <div className="flex gap-4 text-sm border-b border-slate-300 pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showIndex} onCheckedChange={(checked) => setShowIndex(checked === true)} />
                  <span>Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showTexture} onCheckedChange={(checked) => setShowTexture(checked === true)} />
                  <span>Texture</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showEdgeBands} onCheckedChange={(checked) => setShowEdgeBands(checked === true)} />
                  <span>Edge bands</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showGrinding} onCheckedChange={(checked) => setShowGrinding(checked === true)} />
                  <span>Grinding</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showCustomer} onCheckedChange={(checked) => setShowCustomer(checked === true)} />
                  <span>Customer name</span>
                </label>
              </div>

              {/* Pieces Table */}
              <div className="overflow-x-auto border border-slate-300 bg-white rounded">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold w-12">#</th>
                      {showIndex && <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Index</th>}
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Length</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Width</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Quantity</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Material</th>
                      {showTexture && <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Texture</th>}
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Label</th>
                      {showEdgeBands && (
                        <>
                          <th colSpan={4} className="border border-slate-300 px-2 py-2 text-center font-semibold">
                            Edge bands (Name)
                          </th>
                        </>
                      )}
                      {showGrinding && <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Grinding</th>}
                      {showCustomer && <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Customer name</th>}
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Action</th>
                    </tr>
                    {showEdgeBands && (
                      <tr className="bg-slate-50 border-b border-slate-300">
                        <th colSpan={showIndex ? 9 : 8}></th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">Top</th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">Left</th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">Bottom</th>
                        <th className="border border-slate-300 px-2 py-1 text-center text-xs">Right</th>
                        <th colSpan={showGrinding && showCustomer ? 3 : showGrinding || showCustomer ? 2 : 1}></th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {cuts.map((cut, idx) => (
                      <tr key={cut.id} className="border-b border-slate-300 hover:bg-slate-50">
                        <td className="border border-slate-300 px-2 py-2 text-center font-semibold bg-slate-50">
                          <Checkbox />
                        </td>
                        {showIndex && <td className="border border-slate-300 px-2 py-2">{idx + 1}</td>}
                        <td className="border border-slate-300 px-2 py-2">{cut.length}</td>
                        <td className="border border-slate-300 px-2 py-2">{cut.width}</td>
                        <td className="border border-slate-300 px-2 py-2">{cut.quantity}</td>
                        <td className="border border-slate-300 px-2 py-2">{cut.material}</td>
                        {showTexture && <td className="border border-slate-300 px-2 py-2">{cut.texture}</td>}
                        <td className="border border-slate-300 px-2 py-2">{cut.label}</td>
                        {showEdgeBands && (
                          <>
                            <td className="border border-slate-300 px-2 py-2 text-center">{cut.edgeBands.top}</td>
                            <td className="border border-slate-300 px-2 py-2 text-center">{cut.edgeBands.left}</td>
                            <td className="border border-slate-300 px-2 py-2 text-center">{cut.edgeBands.bottom}</td>
                            <td className="border border-slate-300 px-2 py-2 text-center">{cut.edgeBands.right}</td>
                          </>
                        )}
                        {showGrinding && <td className="border border-slate-300 px-2 py-2">{cut.grinding}</td>}
                        {showCustomer && <td className="border border-slate-300 px-2 py-2">{cut.customerName}</td>}
                        <td className="border border-slate-300 px-2 py-2 text-center flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              const newCut = { ...cut, id: nanoid() };
                              setCuts([...cuts, newCut]);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            title="Duplicate piece"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCuts(cuts.filter((c) => c.id !== cut.id))}
                            className="text-red-600 hover:text-red-700"
                            title="Delete piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Cut Form */}
              <EnhancedCutForm newCut={newCut} onCutChange={setNewCut} onAddCut={handleAddCut} />
            </TabsContent>

            {/* STOCK Table */}
            <TabsContent value="stock" className="p-4 space-y-4">
              {/* Visibility Toggles */}
              <div className="flex gap-4 text-sm border-b border-slate-300 pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showStockIndex} onCheckedChange={(checked) => setShowStockIndex(checked === true)} />
                  <span>Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showStockTexture} onCheckedChange={(checked) => setShowStockTexture(checked === true)} />
                  <span>Texture</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showTrimEdge} onCheckedChange={(checked) => setShowTrimEdge(checked === true)} />
                  <span>Trim the edge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={showPriority} onCheckedChange={(checked) => setShowPriority(checked === true)} />
                  <span>Priority</span>
                </label>
              </div>

              {/* Stock Table */}
              <div className="overflow-x-auto border border-slate-300 bg-white rounded">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Length</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Width</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Quantity</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Material</th>
                      {showStockTexture && <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Texture</th>}
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Label</th>
                      <th className="border border-slate-300 px-2 py-2 text-left font-semibold">Price</th>
                      <th className="border border-slate-300 px-2 py-2 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr key={stock.id} className="border-b border-slate-300 hover:bg-slate-50">
                        <td className="border border-slate-300 px-2 py-2">{stock.length}</td>
                        <td className="border border-slate-300 px-2 py-2">{stock.width}</td>
                        <td className="border border-slate-300 px-2 py-2">{stock.quantity}</td>
                        <td className="border border-slate-300 px-2 py-2">{stock.material}</td>
                        {showStockTexture && <td className="border border-slate-300 px-2 py-2">{stock.texture}</td>}
                        <td className="border border-slate-300 px-2 py-2">{stock.label}</td>
                        <td className="border border-slate-300 px-2 py-2">{stock.price}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center">
                          <button
                            onClick={() => setStocks(stocks.filter((s) => s.id !== stock.id))}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Stock Form */}
              <EnhancedStockForm newStock={newStock} onStockChange={setNewStock} onAddStock={handleAddStock} />
            </TabsContent>

            <TabsContent value="layout" className="p-4 space-y-4 overflow-auto">
              <CutCanvasEnhanced result={result} activeLayout={activeLayout} />
              {result && result.layouts.length > 1 && (
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => handleNavigateLayout('prev')} disabled={activeLayout === 0} variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm font-medium">Sheet {activeLayout + 1} of {result.layouts.length}</span>
                  <Button onClick={() => handleNavigateLayout('next')} disabled={activeLayout === result.layouts.length - 1} variant="outline" size="sm">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Control Panel */}
        <div className="w-48 bg-slate-200 border-l border-slate-300 flex flex-col overflow-hidden">
          {/* Buttons */}
          <div className="p-3 space-y-2 border-b border-slate-300">
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing || cuts.length === 0 || stocks.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <Play className="w-5 h-5" />
              <span className="text-xs">Start</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-1 h-auto py-3">
              <Square className="w-5 h-5" />
              <span className="text-xs">Stop</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-1 h-auto py-3">
              <CheckCircle className="w-5 h-5" />
              <span className="text-xs">Accept</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-1 h-auto py-3">
              <Save className="w-5 h-5" />
              <span className="text-xs">Save</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-1 h-auto py-3">
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </Button>
            <Button
              onClick={handleExportDXF}
              disabled={!result}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <FileJson className="w-5 h-5" />
              <span className="text-xs">DXF</span>
            </Button>
            <Button 
              onClick={handleExportCuttingList}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center gap-1 h-auto py-3"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">List</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-1 h-auto py-3">
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-xs">Mirror</span>
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pieces" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b border-slate-300 bg-slate-50 p-0 h-auto">
              <TabsTrigger value="pieces" className="rounded-none text-xs flex-1">
                Pieces
              </TabsTrigger>
              <TabsTrigger value="updates" className="rounded-none text-xs flex-1">
                Updates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pieces" className="flex-1 overflow-auto p-2 text-xs">
              {result && (
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded border border-slate-300">
                    <p className="font-semibold">Utilization</p>
                    <p className="text-lg font-bold text-green-600">{result.averageUtilization.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-300">
                    <p className="font-semibold">Layouts</p>
                    <p className="text-lg font-bold">{result.layouts.length}</p>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-300">
                    <p className="font-semibold">Cuts Placed</p>
                    <p className="text-lg font-bold">{result.cutsPlaced}/{result.totalCutsNeeded}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="updates" className="flex-1 overflow-auto p-2 text-xs">
              <p className="text-slate-600">No updates</p>
            </TabsContent>
          </Tabs>

          {/* Language & Settings */}
          <div className="p-2 border-t border-slate-300 text-xs text-center text-slate-600">
            <p>English</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateDXF(result: OptimizationResult): string {
  let dxf = '';

  // DXF Header
  dxf += `  0
SECTION
  2
HEADER
  9
$ACADVER
  1
AC1021
  0
ENDSEC
  0
SECTION
  2
ENTITIES
`;

  // Draw each layout
  result.layouts.forEach((layout, layoutIndex) => {
    layout.positions.forEach((pos, index) => {
      // Draw rectangle for each cut piece
      dxf += `  0
LINE
  8
0
 10
${pos.x}
 20
${pos.y}
 11
${pos.x + pos.width}
 21
${pos.y}
  0
LINE
  8
0
 10
${pos.x + pos.width}
 20
${pos.y}
 11
${pos.x + pos.width}
 21
${pos.y + pos.height}
  0
LINE
  8
0
 10
${pos.x + pos.width}
 20
${pos.y + pos.height}
 11
${pos.x}
 21
${pos.y + pos.height}
  0
LINE
  8
0
 10
${pos.x}
 20
${pos.y + pos.height}
 11
${pos.x}
 21
${pos.y}
`;
    });
  });

  dxf += `  0
ENDSEC
  0
EOF
`;

  return dxf;
}
