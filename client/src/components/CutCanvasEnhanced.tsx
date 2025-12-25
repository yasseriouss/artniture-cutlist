import React, { useRef, useEffect } from 'react';
import type { OptimizationResult, CutLayout, CutPosition } from '@/lib/optimizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CutCanvasEnhancedProps {
  result: OptimizationResult | null;
  activeLayout: number;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6',
];

export function CutCanvasEnhanced({ result, activeLayout }: CutCanvasEnhancedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!result || !canvasRef.current || activeLayout >= result.layouts.length) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = result.layouts[activeLayout];
    const stock = result.stocks.find((s) => s.id === layout.stockId);
    if (!stock) return;

    // Calculate scale to fit canvas
    const padding = 40;
    const maxWidth = canvas.width - padding * 2;
    const maxHeight = canvas.height - padding * 2;
    const scaleX = maxWidth / stock.length;
    const scaleY = maxHeight / stock.width;
    const scale = Math.min(scaleX, scaleY, 1);

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stock outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, stock.length * scale, stock.width * scale);

    // Draw grid
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= stock.length; i += 100) {
      const x = padding + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + stock.width * scale);
      ctx.stroke();
    }
    for (let i = 0; i <= stock.width; i += 100) {
      const y = padding + i * scale;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + stock.length * scale, y);
      ctx.stroke();
    }

    // Draw pieces
    layout.positions.forEach((pos, index) => {
      const x = padding + pos.x * scale;
      const y = padding + pos.y * scale;
      const w = pos.width * scale;
      const h = pos.height * scale;

      // Draw piece rectangle
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fillRect(x, y, w, h);

      // Draw piece border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      // Draw edge banding with thickness visualization
      if (pos.edgeBand && pos.edgeBand.thickness > 0) {
        const bandThickness = Math.max(2, pos.edgeBand.thickness * scale * 0.5);
        ctx.fillStyle = '#FF9800';
        ctx.globalAlpha = 0.7;

        // Top
        if (pos.edgeBand.sides.top > 0) {
          ctx.fillRect(x, y, w, bandThickness);
        }
        // Bottom
        if (pos.edgeBand.sides.bottom > 0) {
          ctx.fillRect(x, y + h - bandThickness, w, bandThickness);
        }
        // Left
        if (pos.edgeBand.sides.left > 0) {
          ctx.fillRect(x, y, bandThickness, h);
        }
        // Right
        if (pos.edgeBand.sides.right > 0) {
          ctx.fillRect(x + w - bandThickness, y, bandThickness, h);
        }

        // Draw edge band label
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FF6600';
        ctx.font = `${Math.max(7, 8 * scale)}px Arial`;
        ctx.textAlign = 'left';
        if (pos.edgeBand.sides.top > 0) {
          ctx.fillText(`${pos.edgeBand.name}(${pos.edgeBand.thickness}mm)`, x + 2, y + bandThickness - 2);
        }
      }

      // Draw groove with location and width visualization
      if (pos.groove?.enabled && pos.groove.width > 0) {
        ctx.strokeStyle = '#0066CC';
        ctx.lineWidth = Math.max(2, pos.groove.width * scale * 0.4);
        ctx.setLineDash([5, 5]);

        if (pos.groove.direction === 'horizontal') {
          const grooveY = y + (pos.groove.offset || h / 2) * scale;
          ctx.beginPath();
          ctx.moveTo(x, grooveY);
          ctx.lineTo(x + w, grooveY);
          ctx.stroke();
          
          // Draw groove label
          ctx.setLineDash([]);
          ctx.fillStyle = '#0066CC';
          ctx.font = `${Math.max(7, 8 * scale)}px Arial`;
          ctx.textAlign = 'left';
          ctx.fillText(`H:${pos.groove.width}mm`, x + 2, grooveY - 3);
        } else {
          const grooveX = x + (pos.groove.offset || w / 2) * scale;
          ctx.beginPath();
          ctx.moveTo(grooveX, y);
          ctx.lineTo(grooveX, y + h);
          ctx.stroke();
          
          // Draw groove label
          ctx.setLineDash([]);
          ctx.fillStyle = '#0066CC';
          ctx.font = `${Math.max(7, 8 * scale)}px Arial`;
          ctx.textAlign = 'left';
          ctx.fillText(`V:${pos.groove.width}mm`, grooveX + 2, y + 10);
        }

        ctx.setLineDash([]);
      }

      // Draw label
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${Math.max(10, 12 * scale)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelX = x + w / 2;
      const labelY = y + h / 2;
      ctx.fillText(pos.label || `Piece ${index + 1}`, labelX, labelY - 10);
      ctx.font = `${Math.max(8, 10 * scale)}px Arial`;
      ctx.fillText(`${pos.width}×${pos.height}`, labelX, labelY + 10);
    });

    // Draw waste area
    ctx.fillStyle = '#CCCCCC';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(padding, padding, stock.length * scale, stock.width * scale);
    ctx.globalAlpha = 1;

    // Draw utilization info
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Utilization: ${layout.utilizationRate.toFixed(1)}% | Waste: ${layout.wasteArea.toFixed(0)} units²`,
      padding,
      canvas.height - 10
    );
  }, [result, activeLayout]);

  if (!result) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Layout Visualization</CardTitle>
          <CardDescription>Run optimization to see the cutting layout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-slate-50 rounded flex items-center justify-center text-slate-500">
            No layout to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-base">
          Layout Visualization - {result.layouts.length > 0 ? `Sheet ${activeLayout + 1} of ${result.layouts.length}` : 'No layouts'}
        </CardTitle>
        <CardDescription>
          Utilization: {result.averageUtilization.toFixed(1)}% | Total Waste: {result.totalWaste.toFixed(0)} units²
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-slate-300 rounded bg-white overflow-auto">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full"
          />
        </div>
        <div className="mt-4 text-sm text-slate-600">
          <p><strong>Legend:</strong></p>
          <p>🟠 Orange borders = Edge banding | 🔵 Blue dashed = Grooves</p>
          <p>Each piece shows dimensions and label for identification</p>
        </div>
      </CardContent>
    </Card>
  );
}
