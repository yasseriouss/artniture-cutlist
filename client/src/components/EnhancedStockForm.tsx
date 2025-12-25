import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { StockPiece } from '@/lib/optimizer';

interface EnhancedStockFormProps {
  newStock: Partial<StockPiece>;
  onStockChange: (stock: Partial<StockPiece>) => void;
  onAddStock: () => void;
}

export function EnhancedStockForm({ newStock, onStockChange, onAddStock }: EnhancedStockFormProps) {
  return (
    <Card className="p-4 bg-white border border-slate-300">
      <div className="space-y-3">
        {/* Row 1: Dimensions & Quantity */}
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="number"
            placeholder="Length"
            value={newStock.length || ''}
            onChange={(e) => onStockChange({ ...newStock, length: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Width"
            value={newStock.width || ''}
            onChange={(e) => onStockChange({ ...newStock, width: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Qty"
            value={newStock.quantity || ''}
            onChange={(e) => onStockChange({ ...newStock, quantity: parseInt(e.target.value) })}
          />
          <select
            className="border border-slate-300 rounded px-2 py-1 text-sm"
            value={newStock.material || 'glass'}
            onChange={(e) => onStockChange({ ...newStock, material: e.target.value })}
          >
            <option>glass</option>
            <option>wood</option>
            <option>plastic</option>
            <option>metal</option>
            <option>pipe</option>
          </select>
        </div>

        {/* Row 2: Texture, Label, Price */}
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="text"
            placeholder="Texture"
            value={newStock.texture || ''}
            onChange={(e) => onStockChange({ ...newStock, texture: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Label"
            value={newStock.label || ''}
            onChange={(e) => onStockChange({ ...newStock, label: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newStock.price || ''}
            onChange={(e) => onStockChange({ ...newStock, price: parseFloat(e.target.value) })}
          />
          <Button onClick={onAddStock} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
