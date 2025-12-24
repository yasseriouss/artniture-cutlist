import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isValidDimension, isValidQuantity } from '@/lib/utils';
import { Trash2, Plus } from 'lucide-react';

interface InputFormProps {
  onAddStock: (stock: { width: number; height: number; quantity: number; pattern?: 'none' | 'horizontal' | 'vertical' }) => void;
  onAddCut: (cut: { width: number; height: number; quantity: number; pattern?: 'none' | 'horizontal' | 'vertical' }) => void;
  stockPieces: Array<{ id: string; width: number; height: number; quantity: number }>;
  cutPieces: Array<{ id: string; width: number; height: number; quantity: number }>;
  onRemoveStock: (id: string) => void;
  onRemoveCut: (id: string) => void;
}

export function InputForm({
  onAddStock,
  onAddCut,
  stockPieces,
  cutPieces,
  onRemoveStock,
  onRemoveCut,
}: InputFormProps) {
  const [stockWidth, setStockWidth] = useState('');
  const [stockHeight, setStockHeight] = useState('');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [stockPattern, setStockPattern] = useState('none');

  const [cutWidth, setCutWidth] = useState('');
  const [cutHeight, setCutHeight] = useState('');
  const [cutQuantity, setCutQuantity] = useState('1');
  const [cutPattern, setCutPattern] = useState('none');

  const handleAddStock = () => {
    if (!isValidDimension(stockWidth) || !isValidDimension(stockHeight) || !isValidQuantity(stockQuantity)) {
      return;
    }
    onAddStock({
      width: parseFloat(stockWidth),
      height: parseFloat(stockHeight),
      quantity: parseInt(stockQuantity, 10),
      pattern: stockPattern as 'none' | 'horizontal' | 'vertical',
    });
    setStockWidth('');
    setStockHeight('');
    setStockQuantity('1');
    setStockPattern('none');
  };

  const handleAddCut = () => {
    if (!isValidDimension(cutWidth) || !isValidDimension(cutHeight) || !isValidQuantity(cutQuantity)) {
      return;
    }
    onAddCut({
      width: parseFloat(cutWidth),
      height: parseFloat(cutHeight),
      quantity: parseInt(cutQuantity, 10),
      pattern: cutPattern as 'none' | 'horizontal' | 'vertical',
    });
    setCutWidth('');
    setCutHeight('');
    setCutQuantity('1');
    setCutPattern('none');
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stock">Stock Pieces</TabsTrigger>
          <TabsTrigger value="cut">Cut Pieces</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Stock Piece</CardTitle>
              <CardDescription>Define the dimensions of your panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock-width">Width (mm)</Label>
                  <Input
                    id="stock-width"
                    type="number"
                    placeholder="e.g., 2440"
                    value={stockWidth}
                    onChange={(e) => setStockWidth(e.target.value)}
                    min="1"
                    max="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-height">Height (mm)</Label>
                  <Input
                    id="stock-height"
                    type="number"
                    placeholder="e.g., 1220"
                    value={stockHeight}
                    onChange={(e) => setStockHeight(e.target.value)}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock-qty">Quantity</Label>
                  <Input
                    id="stock-qty"
                    type="number"
                    placeholder="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock-pattern">Pattern</Label>
                  <Select value={stockPattern} onValueChange={setStockPattern}>
                    <SelectTrigger id="stock-pattern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddStock} className="w-full bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock Piece
              </Button>
            </CardContent>
          </Card>

          {stockPieces.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Stock Pieces ({stockPieces.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stockPieces.map((piece) => (
                    <div key={piece.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-border">
                      <div className="text-sm">
                        <span className="font-semibold">{piece.width}×{piece.height}</span>
                        <span className="text-muted-foreground ml-2">×{piece.quantity}</span>
                      </div>
                      <button
                        onClick={() => onRemoveStock(piece.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cut" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Cut Piece</CardTitle>
              <CardDescription>Define the dimensions of pieces to cut</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cut-width">Width (mm)</Label>
                  <Input
                    id="cut-width"
                    type="number"
                    placeholder="e.g., 600"
                    value={cutWidth}
                    onChange={(e) => setCutWidth(e.target.value)}
                    min="1"
                    max="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cut-height">Height (mm)</Label>
                  <Input
                    id="cut-height"
                    type="number"
                    placeholder="e.g., 400"
                    value={cutHeight}
                    onChange={(e) => setCutHeight(e.target.value)}
                    min="1"
                    max="10000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cut-qty">Quantity</Label>
                  <Input
                    id="cut-qty"
                    type="number"
                    placeholder="1"
                    value={cutQuantity}
                    onChange={(e) => setCutQuantity(e.target.value)}
                    min="1"
                    max="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cut-pattern">Pattern</Label>
                  <Select value={cutPattern} onValueChange={setCutPattern}>
                    <SelectTrigger id="cut-pattern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddCut} className="w-full bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Cut Piece
              </Button>
            </CardContent>
          </Card>

          {cutPieces.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cut Pieces ({cutPieces.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cutPieces.map((piece) => (
                    <div key={piece.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-border">
                      <div className="text-sm">
                        <span className="font-semibold">{piece.width}×{piece.height}</span>
                        <span className="text-muted-foreground ml-2">×{piece.quantity}</span>
                      </div>
                      <button
                        onClick={() => onRemoveCut(piece.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
