import React from 'react';
import type { Wire, CircuitNode } from '../types/logic';

interface WireRendererProps {
  wires: Wire[];
  nodes: CircuitNode[];
  selectedWireId: string | null;
  onSelectWire: (wireId: string | null) => void;
  onDeleteWire: (wireId: string) => void;
  draftWire: { fromNodeId: string; fromPortId: string; currentX: number; currentY: number } | null;
}

export function getPortAbsoluteCoords(node: CircuitNode, portId: string, isOutput: boolean): { x: number; y: number } | null {
  const ports = isOutput ? node.outputs : node.inputs;
  const port = ports.find((p) => p.id === portId);
  if (!port) return null;

  const x = node.x + (node.width * port.relativeX) / 100;
  const y = node.y + (node.height * port.relativeY) / 100;
  return { x, y };
}

export function createBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.abs(x2 - x1);
  const controlDist = Math.max(30, dx * 0.5);

  const cx1 = x1 + controlDist;
  const cy1 = y1;
  const cx2 = x2 - controlDist;
  const cy2 = y2;

  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

export const WireRenderer: React.FC<WireRendererProps> = ({
  wires,
  nodes,
  selectedWireId,
  onSelectWire,
  onDeleteWire,
  draftWire,
}) => {
  const nodeMap = new Map<string, CircuitNode>(nodes.map((n) => [n.id, n]));

  return (
    <g className="wires-layer">
      {/* Defined Wires */}
      {wires.map((wire) => {
        const fromNode = nodeMap.get(wire.fromNodeId);
        const toNode = nodeMap.get(wire.toNodeId);

        if (!fromNode || !toNode) return null;

        const start = getPortAbsoluteCoords(fromNode, wire.fromPortId, true);
        const end = getPortAbsoluteCoords(toNode, wire.toPortId, false);

        if (!start || !end) return null;

        const pathData = createBezierPath(start.x, start.y, end.x, end.y);
        const isHigh = wire.signal === 1;
        const isSelected = selectedWireId === wire.id;

        const strokeColor = isHigh ? 'var(--signal-high)' : 'var(--signal-low)';

        return (
          <g key={wire.id} style={{ cursor: 'pointer' }}>
            {/* Wide invisible hit-target for easy click selection */}
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteWire(wire.id);
              }}
            />

            {/* Glowing outer aura for HIGH signal */}
            {isHigh && (
              <path
                d={pathData}
                fill="none"
                stroke="rgba(56, 189, 248, 0.4)"
                strokeWidth={9}
                strokeLinecap="round"
                style={{ filter: 'blur(4px)' }}
              />
            )}

            {/* Selection Outline */}
            {isSelected && (
              <path
                d={pathData}
                fill="none"
                stroke="var(--accent-amber)"
                strokeWidth={7}
                strokeLinecap="round"
              />
            )}

            {/* Main Wire Stroke */}
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth={3}
              strokeLinecap="round"
              className={isHigh ? 'pulse-wire' : undefined}
            />
          </g>
        );
      })}

      {/* Draft Wire while dragging */}
      {draftWire && (() => {
        const fromNode = nodeMap.get(draftWire.fromNodeId);
        if (!fromNode) return null;
        const start = getPortAbsoluteCoords(fromNode, draftWire.fromPortId, true);
        if (!start) return null;

        const pathData = createBezierPath(start.x, start.y, draftWire.currentX, draftWire.currentY);

        return (
          <g key="draft-wire" style={{ pointerEvents: 'none' }}>
            <path
              d={pathData}
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth={3}
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            <circle cx={draftWire.currentX} cy={draftWire.currentY} r={6} fill="var(--accent-cyan)" />
          </g>
        );
      })()}
    </g>
  );
};
