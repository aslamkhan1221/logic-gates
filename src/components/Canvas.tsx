import React, { useRef, useState, useEffect } from 'react';
import type { CircuitNode, Wire, NodeType, Port } from '../types/logic';
import { WireRenderer, getPortAbsoluteCoords } from './WireRenderer';
import { GateNode } from './GateNode';
import { COMPONENT_METADATA } from '../engine/GateLogic';
import { soundFx } from './AudioSynth';

interface CanvasProps {
  nodes: CircuitNode[];
  wires: Wire[];
  selectedNodeIds: string[];
  selectedWireId: string | null;
  onSelectNode: (nodeId: string | null, multiSelect: boolean) => void;
  onSelectWire: (wireId: string | null) => void;
  onSelectMultiple: (nodeIds: string[]) => void;
  onUpdateNodes: (nodes: CircuitNode[]) => void;
  onAddWire: (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => void;
  onDeleteWire: (wireId: string) => void;
  onAddNodeAt: (type: NodeType, x: number, y: number) => void;
  onUpdateNodeState: (nodeId: string, stateUpdate: any) => void;
  zoom: number;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  snapToGrid: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  nodes,
  wires,
  selectedNodeIds,
  selectedWireId,
  onSelectNode,
  onSelectWire,
  onSelectMultiple,
  onUpdateNodes,
  onAddWire,
  onDeleteWire,
  onAddNodeAt,
  onUpdateNodeState,
  zoom,
  pan,
  onPanChange,
  snapToGrid,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Wire draft state
  const [draftWire, setDraftWire] = useState<{
    fromNodeId: string;
    fromPortId: string;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Hovered port
  const [hoveredPort, setHoveredPort] = useState<{ nodeId: string; portId: string; isOutput: boolean } | null>(null);

  // Pan / Drag State
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node Dragging state
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Rubberband Box Selection
  const [boxSelectStart, setBoxSelectStart] = useState<{ x: number; y: number } | null>(null);
  const [boxSelectCurrent, setBoxSelectCurrent] = useState<{ x: number; y: number } | null>(null);

  // Track touch drag distance to distinguish tap-to-connect from drag-to-connect
  const dragDistanceRef = useRef<number>(0);

  // Refs for state inside global event listeners
  const draftWireRef = useRef(draftWire);
  draftWireRef.current = draftWire;

  const hoveredPortRef = useRef(hoveredPort);
  hoveredPortRef.current = hoveredPort;

  // Screen coords to canvas coords
  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  // Helper to find any port near canvas coordinates (with generous 32px touch radius for mobile fingers)
  const findPortAtCoords = (
    canvasX: number,
    canvasY: number,
    targetIsOutput?: boolean
  ): { nodeId: string; portId: string; isOutput: boolean; portX: number; portY: number } | null => {
    const TOUCH_HIT_RADIUS = 32; // Canvas coordinate hit radius for mobile touch wire connection
    let closest: { nodeId: string; portId: string; isOutput: boolean; portX: number; portY: number; dist: number } | null = null;

    for (const node of nodes) {
      const checkPorts = (ports: Port[], isOutput: boolean) => {
        for (const port of ports) {
          const px = node.x + (node.width * port.relativeX) / 100;
          const py = node.y + (node.height * port.relativeY) / 100;
          const dist = Math.hypot(canvasX - px, canvasY - py);
          if (dist <= TOUCH_HIT_RADIUS && (!closest || dist < closest.dist)) {
            closest = { nodeId: node.id, portId: port.id, isOutput, portX: px, portY: py, dist };
          }
        }
      };

      if (targetIsOutput === undefined || targetIsOutput === false) {
        checkPorts(node.inputs, false);
      }
      if (targetIsOutput === undefined || targetIsOutput === true) {
        checkPorts(node.outputs, true);
      }
    }

    return closest;
  };

  // Handle clicking or touching a node
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const isMultiKey = 'shiftKey' in e ? e.shiftKey || e.ctrlKey || e.metaKey : false;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    if (!selectedNodeIds.includes(nodeId)) {
      onSelectNode(nodeId, isMultiKey);
    }

    setIsDraggingNode(true);
    setDragStartPos(getCanvasCoords(clientX, clientY));
  };

  // Start wire from output port
  const handleStartWire = (nodeId: string, portId: string) => {
    dragDistanceRef.current = 0;
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const coords = getPortAbsoluteCoords(node, portId, true);
      if (coords) {
        setDraftWire({
          fromNodeId: nodeId,
          fromPortId: portId,
          currentX: coords.x,
          currentY: coords.y,
        });
      }
    }
  };

  // Complete wire to input port
  const handleCompleteWire = (toNodeId: string, toPortId: string) => {
    if (draftWireRef.current) {
      if (draftWireRef.current.fromNodeId !== toNodeId) {
        onAddWire(draftWireRef.current.fromNodeId, draftWireRef.current.fromPortId, toNodeId, toPortId);
        soundFx.playConnectSound();
      }
      setDraftWire(null);
      setHoveredPort(null);
    }
  };

  // Global Mouse & Touch Events for smooth dragging & wire completion
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      const coords = getCanvasCoords(clientX, clientY);

      // Wire draft updating (Mobile touch & Desktop mouse)
      if (draftWireRef.current) {
        dragDistanceRef.current += 1;
        let targetX = coords.x;
        let targetY = coords.y;

        // Search for nearest input port near touch/mouse coords
        const nearbyInputPort = findPortAtCoords(coords.x, coords.y, false);

        if (nearbyInputPort && nearbyInputPort.nodeId !== draftWireRef.current.fromNodeId) {
          setHoveredPort({ nodeId: nearbyInputPort.nodeId, portId: nearbyInputPort.portId, isOutput: false });
          targetX = nearbyInputPort.portX;
          targetY = nearbyInputPort.portY;
        } else {
          if (hoveredPortRef.current && !hoveredPortRef.current.isOutput) {
            const hNode = nodes.find((n) => n.id === hoveredPortRef.current?.nodeId);
            if (hNode) {
              const portCoords = getPortAbsoluteCoords(hNode, hoveredPortRef.current.portId, false);
              if (portCoords) {
                targetX = portCoords.x;
                targetY = portCoords.y;
              }
            }
          } else {
            setHoveredPort(null);
          }
        }

        setDraftWire((prev) => (prev ? { ...prev, currentX: targetX, currentY: targetY } : null));
      }

      // Panning canvas
      if (isPanning) {
        onPanChange({
          x: clientX - panStart.x,
          y: clientY - panStart.y,
        });
      }

      // Rubberband box selecting
      if (boxSelectStart) {
        setBoxSelectCurrent(coords);
      }

      // Dragging selected nodes
      if (isDraggingNode && selectedNodeIds.length > 0) {
        const dx = coords.x - dragStartPos.x;
        const dy = coords.y - dragStartPos.y;
        setDragStartPos(coords);

        const GRID_SIZE = 10;

        const nextNodes = nodes.map((node) => {
          if (selectedNodeIds.includes(node.id)) {
            let newX = node.x + dx;
            let newY = node.y + dy;
            if (snapToGrid) {
              newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
              newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }
            return { ...node, x: newX, y: newY };
          }
          return node;
        });

        onUpdateNodes(nextNodes);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = (e?: MouseEvent | TouchEvent) => {
      setIsPanning(false);
      setIsDraggingNode(false);

      if (draftWireRef.current) {
        let endClientX = 0;
        let endClientY = 0;
        let hasEndCoords = false;

        if (e && 'changedTouches' in e && e.changedTouches.length > 0) {
          endClientX = e.changedTouches[0].clientX;
          endClientY = e.changedTouches[0].clientY;
          hasEndCoords = true;
        } else if (e && 'clientX' in e) {
          endClientX = (e as MouseEvent).clientX;
          endClientY = (e as MouseEvent).clientY;
          hasEndCoords = true;
        }

        let targetInputPort = hoveredPortRef.current && !hoveredPortRef.current.isOutput ? hoveredPortRef.current : null;

        if (!targetInputPort && hasEndCoords) {
          const canvasCoords = getCanvasCoords(endClientX, endClientY);
          const nearby = findPortAtCoords(canvasCoords.x, canvasCoords.y, false);
          if (nearby && nearby.nodeId !== draftWireRef.current.fromNodeId) {
            targetInputPort = nearby;
          }
        }

        if (targetInputPort && targetInputPort.nodeId !== draftWireRef.current.fromNodeId) {
          onAddWire(draftWireRef.current.fromNodeId, draftWireRef.current.fromPortId, targetInputPort.nodeId, targetInputPort.portId);
          soundFx.playConnectSound();
          setDraftWire(null);
          setHoveredPort(null);
        } else if (dragDistanceRef.current > 5) {
          // If dragged in empty space, cancel draft wire
          setDraftWire(null);
          setHoveredPort(null);
        }
        // If dragDistance <= 5 (single tap mode), KEEP draft wire active for tap 2!
      }
      dragDistanceRef.current = 0;

      if (boxSelectStart && boxSelectCurrent) {
        const minX = Math.min(boxSelectStart.x, boxSelectCurrent.x);
        const maxX = Math.max(boxSelectStart.x, boxSelectCurrent.x);
        const minY = Math.min(boxSelectStart.y, boxSelectCurrent.y);
        const maxY = Math.max(boxSelectStart.y, boxSelectCurrent.y);

        const enclosedIds = nodes
          .filter((n) => n.x >= minX && n.x + n.width <= maxX && n.y >= minY && n.y + n.height <= maxY)
          .map((n) => n.id);

        if (enclosedIds.length > 0) {
          onSelectMultiple(enclosedIds);
        }

        setBoxSelectStart(null);
        setBoxSelectCurrent(null);
      }
    };

    if (isPanning || isDraggingNode || draftWire || boxSelectStart) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [
    isPanning,
    isDraggingNode,
    draftWire,
    boxSelectStart,
    boxSelectCurrent,
    hoveredPort,
    panStart,
    dragStartPos,
    selectedNodeIds,
    nodes,
    zoom,
    pan,
    snapToGrid,
  ]);

  // Canvas Mouse / Touch Down
  const handleStart = (clientX: number, clientY: number, target: EventTarget, button: number = 0) => {
    if (target === containerRef.current || (target as HTMLElement).tagName === 'svg') {
      onSelectNode(null, false);
      onSelectWire(null);
      if (draftWireRef.current) {
        setDraftWire(null);
        setHoveredPort(null);
      }

      if (button === 1 || button === 4) {
        setIsPanning(true);
        setPanStart({ x: clientX - pan.x, y: clientY - pan.y });
      } else if (button === 0) {
        const coords = getCanvasCoords(clientX, clientY);
        setBoxSelectStart(coords);
        setBoxSelectCurrent(coords);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    handleStart(e.clientX, e.clientY, e.target, e.button);
  };

  // HTML5 Drag and drop from palette
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/logic-type') as NodeType;
    if (nodeType) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      const meta = COMPONENT_METADATA.find((m) => m.type === nodeType);
      let posX = coords.x - (meta?.defaultWidth ?? 70) / 2;
      let posY = coords.y - (meta?.defaultHeight ?? 70) / 2;

      if (snapToGrid) {
        posX = Math.round(posX / 10) * 10;
        posY = Math.round(posY / 10) * 10;
      }

      onAddNodeAt(nodeType, posX, posY);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'default',
        touchAction: 'none',
        background:
          'radial-gradient(circle, var(--border-color) 1px, transparent 1px) 0 0 / 24px 24px var(--bg-main)',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          overflow: 'visible',
        }}
      >
        {/* Wires Layer */}
        <WireRenderer
          wires={wires}
          nodes={nodes}
          selectedWireId={selectedWireId}
          onSelectWire={onSelectWire}
          onDeleteWire={onDeleteWire}
          draftWire={draftWire}
        />

        {/* Nodes Layer */}
        <g className="nodes-layer">
          {nodes.map((node) => (
            <GateNode
              key={node.id}
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              onSelectNode={onSelectNode}
              onNodeMouseDown={handleNodeMouseDown}
              onStartWire={handleStartWire}
              onCompleteWire={handleCompleteWire}
              onUpdateNodeState={onUpdateNodeState}
              hoveredPort={hoveredPort}
              onPortHover={setHoveredPort}
            />
          ))}
        </g>

        {/* Box Selection Overlay */}
        {boxSelectStart && boxSelectCurrent && (
          <rect
            x={Math.min(boxSelectStart.x, boxSelectCurrent.x)}
            y={Math.min(boxSelectStart.y, boxSelectCurrent.y)}
            width={Math.abs(boxSelectCurrent.x - boxSelectStart.x)}
            height={Math.abs(boxSelectCurrent.y - boxSelectStart.y)}
            fill="rgba(56, 189, 248, 0.12)"
            stroke="var(--accent-cyan)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        )}
      </svg>
    </div>
  );
};
