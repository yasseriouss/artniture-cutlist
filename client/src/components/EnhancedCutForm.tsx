import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import type { CutPiece } from '@/lib/optimizer';

interface EnhancedCutFormProps {
  newCut: Partial<CutPiece>;
  onCutChange: (cut: Partial<CutPiece>) => void;
  onAddCut: () => void;
}

export function EnhancedCutForm({ newCut, onCutChange, onAddCut }: EnhancedCutFormProps) {
  return (
    <Card className="p-4 bg-white border border-slate-300">
      <div className="space-y-3">
        {/* Row 1: Dimensions & Material */}
        <div className="grid grid-cols-4 gap-2">
          <Input
            type="number"
            placeholder="Length"
            value={newCut.length || ''}
            onChange={(e) => onCutChange({ ...newCut, length: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Width"
            value={newCut.width || ''}
            onChange={(e) => onCutChange({ ...newCut, width: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Qty"
            value={newCut.quantity || ''}
            onChange={(e) => onCutChange({ ...newCut, quantity: parseInt(e.target.value) })}
          />
          <select
            className="border border-slate-300 rounded px-2 py-1 text-sm"
            value={newCut.material || 'glass'}
            onChange={(e) => onCutChange({ ...newCut, material: e.target.value })}
          >
            <option>glass</option>
            <option>wood</option>
            <option>plastic</option>
            <option>metal</option>
            <option>pipe</option>
          </select>
        </div>

        {/* Row 2: Texture & Label */}
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="text"
            placeholder="Texture"
            value={newCut.texture || ''}
            onChange={(e) => onCutChange({ ...newCut, texture: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Label"
            value={newCut.label || ''}
            onChange={(e) => onCutChange({ ...newCut, label: e.target.value })}
          />
          <Button onClick={onAddCut} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Row 3: Edge Band Name & Thickness */}
        <div className="grid grid-cols-4 gap-2 border-t border-slate-200 pt-2">
          <Input
            type="text"
            placeholder="Edge Band Name"
            value={newCut.edgeBand?.name || ''}
            onChange={(e) =>
              onCutChange({
                ...newCut,
                edgeBand: { ...newCut.edgeBand!, name: e.target.value },
              })
            }
          />
          <Input
            type="number"
            placeholder="Thickness (mm)"
            value={newCut.edgeBand?.thickness || ''}
            onChange={(e) =>
              onCutChange({
                ...newCut,
                edgeBand: { ...newCut.edgeBand!, thickness: parseFloat(e.target.value) },
              })
            }
          />
          <label className="flex items-center gap-1 text-xs">
            <Checkbox
              checked={newCut.edgeBand?.sides.top === 1}
              onCheckedChange={(c) =>
                onCutChange({
                  ...newCut,
                  edgeBand: {
                    ...newCut.edgeBand!,
                    sides: { ...newCut.edgeBand!.sides, top: c ? 1 : 0 },
                  },
                })
              }
            />
            Top
          </label>
          <label className="flex items-center gap-1 text-xs">
            <Checkbox
              checked={newCut.edgeBand?.sides.right === 1}
              onCheckedChange={(c) =>
                onCutChange({
                  ...newCut,
                  edgeBand: {
                    ...newCut.edgeBand!,
                    sides: { ...newCut.edgeBand!.sides, right: c ? 1 : 0 },
                  },
                })
              }
            />
            Right
          </label>
        </div>

        {/* Row 4: Edge Band Left & Bottom */}
        <div className="grid grid-cols-4 gap-2">
          <div />
          <div />
          <label className="flex items-center gap-1 text-xs">
            <Checkbox
              checked={newCut.edgeBand?.sides.left === 1}
              onCheckedChange={(c) =>
                onCutChange({
                  ...newCut,
                  edgeBand: {
                    ...newCut.edgeBand!,
                    sides: { ...newCut.edgeBand!.sides, left: c ? 1 : 0 },
                  },
                })
              }
            />
            Left
          </label>
          <label className="flex items-center gap-1 text-xs">
            <Checkbox
              checked={newCut.edgeBand?.sides.bottom === 1}
              onCheckedChange={(c) =>
                onCutChange({
                  ...newCut,
                  edgeBand: {
                    ...newCut.edgeBand!,
                    sides: { ...newCut.edgeBand!.sides, bottom: c ? 1 : 0 },
                  },
                })
              }
            />
            Bottom
          </label>
        </div>

        {/* Row 5: Groove Configuration */}
        <div className="grid grid-cols-4 gap-2 border-t border-slate-200 pt-2">
          <label className="flex items-center gap-1 text-xs">
            <Checkbox
              checked={newCut.groove?.enabled || false}
              onCheckedChange={(c) =>
                onCutChange({
                  ...newCut,
                  groove: { ...newCut.groove!, enabled: c as boolean },
                })
              }
            />
            Groove
          </label>
          <Input
            type="number"
            placeholder="Width (mm)"
            value={newCut.groove?.width || ''}
            onChange={(e) =>
              onCutChange({
                ...newCut,
                groove: { ...newCut.groove!, width: parseFloat(e.target.value) },
              })
            }
            disabled={!newCut.groove?.enabled}
          />
          <select
            className="border border-slate-300 rounded px-2 py-1 text-sm"
            value={newCut.groove?.direction || 'horizontal'}
            onChange={(e) =>
              onCutChange({
                ...newCut,
                groove: {
                  ...newCut.groove!,
                  direction: e.target.value as 'horizontal' | 'vertical',
                },
              })
            }
            disabled={!newCut.groove?.enabled}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <div />
        </div>
      </div>
    </Card>
  );
}
