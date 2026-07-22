import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { CircuitNode, Wire, NodeType, CircuitData } from './types/logic';
import { COMPONENT_METADATA, createDefaultPortsForNode } from './engine/GateLogic';
import { propagateCircuit, tickClockNodes } from './engine/CircuitEvaluator';
import { PRESET_CIRCUITS } from './engine/Presets';
import { soundFx } from './components/AudioSynth';
import { Navbar } from './components/Navbar';
import { Palette } from './components/Palette';
import { Canvas } from './components/Canvas';
import { PropertyPanel } from './components/PropertyPanel';
import { TruthTableModal } from './components/TruthTableModal';
import { AmplifierLabModal } from './components/AmplifierLabModal';
import { ToastContainer, type ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Load initial preset circuit
  const initialPreset = PRESET_CIRCUITS[0];

  const [nodes, setNodes] = useState<CircuitNode[]>(initialPreset.data.nodes);
  const [wires, setWires] = useState<Wire[]>(initialPreset.data.wires);

  // Undo / Redo history stack
  const [history, setHistory] = useState<CircuitData[]>([initialPreset.data]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selection states
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<CircuitNode[]>([]);

  // Modal states
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);
  const [isWaveformOpen, setIsWaveformOpen] = useState(false);

  // Simulation controls
  const [isRunning, setIsRunning] = useState(true);
  const [clockSpeed, setClockSpeed] = useState(2); // Hz
  const [isMuted, setIsMuted] = useState(false);

  // Canvas viewport
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Push state to undo history
  const pushHistory = useCallback(
    (newNodes: CircuitNode[], newWires: Wire[]) => {
      const currentData: CircuitData = { version: 1, nodes: newNodes, wires: newWires };
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, currentData];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Real-time circuit propagation loop
  useEffect(() => {
    const res = propagateCircuit(nodes, wires);
    if (res.hasChanged) {
      setNodes(res.nodes);
      setWires(res.wires);

      // Check audio buzzers
      res.nodes.forEach((n) => {
        if (n.type === 'BUZZER') {
          soundFx.setBuzzerState(n.id, n.state.value === 1);
        }
      });
    }
  }, [nodes, wires]);

  // Clock tick interval timer
  const lastClockTickRef = useRef<number>(Date.now());
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = 1000 / clockSpeed;
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastClockTickRef.current >= intervalMs) {
        lastClockTickRef.current = now;
        const tickRes = tickClockNodes(nodes);
        if (tickRes.ticked) {
          const evalRes = propagateCircuit(tickRes.nodes, wires);
          setNodes(evalRes.nodes);
          setWires(evalRes.wires);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isRunning, clockSpeed, nodes, wires]);

  // Handle Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevData = history[prevIndex];
      setNodes(prevData.nodes);
      setWires(prevData.wires);
      setHistoryIndex(prevIndex);
      setSelectedNodeIds([]);
      setSelectedWireId(null);
    }
  };

  // Handle Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextData = history[nextIndex];
      setNodes(nextData.nodes);
      setWires(nextData.wires);
      setHistoryIndex(nextIndex);
      setSelectedNodeIds([]);
      setSelectedWireId(null);
    }
  };

  // Calculate centered spawn coordinates for Palette click addition
  const getSpawnCoords = () => {
    const viewportWidth = (window.innerWidth || 1200) - 260;
    const viewportHeight = (window.innerHeight || 800) - 60;
    const centerX = (-pan.x + viewportWidth / 2) / zoom;
    const centerY = (-pan.y + viewportHeight / 2) / zoom;

    const stagger = (nodes.length % 6) * 35;
    const posX = Math.round((centerX + stagger) / 10) * 10;
    const posY = Math.round((centerY + stagger) / 10) * 10;

    return { x: posX, y: posY };
  };

  // Node & Wire Mutations
  const handleAddNode = (type: NodeType, posX?: number, posY?: number) => {
    const meta = COMPONENT_METADATA.find((m) => m.type === type);
    const id = `${type.toLowerCase()}_${Date.now()}`;
    const ports = createDefaultPortsForNode(type);

    let spawnX = posX;
    let spawnY = posY;

    if (spawnX === undefined || spawnY === undefined) {
      const defaultCoords = getSpawnCoords();
      spawnX = defaultCoords.x;
      spawnY = defaultCoords.y;
    }

    const newNode: CircuitNode = {
      id,
      type,
      label: meta?.label || type,
      x: spawnX,
      y: spawnY,
      width: meta?.defaultWidth || 80,
      height: meta?.defaultHeight || 70,
      inputs: ports.inputs,
      outputs: ports.outputs,
      state: { value: 0, frequency: 1, gain: 1.8 },
    };

    const nextNodes = [...nodes, newNode];
    const res = propagateCircuit(nextNodes, wires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
    setSelectedNodeIds([newNode.id]);
    setSelectedWireId(null);
  };

  const handleUpdateNodes = (updatedNodes: CircuitNode[]) => {
    const res = propagateCircuit(updatedNodes, wires);
    setNodes(res.nodes);
    setWires(res.wires);
  };

  const handleUpdateNodeState = (nodeId: string, stateUpdate: any) => {
    const nextNodes = nodes.map((n) => {
      if (n.id === nodeId) {
        return { ...n, state: { ...n.state, ...stateUpdate } };
      }
      return n;
    });
    const res = propagateCircuit(nextNodes, wires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextWires = wires.filter((w) => w.fromNodeId !== nodeId && w.toNodeId !== nodeId);
    const res = propagateCircuit(nextNodes, nextWires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
    setSelectedNodeIds([]);
    soundFx.setBuzzerState(nodeId, false);
  };

  const handleDuplicateNode = (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;

    const newId = `${target.type.toLowerCase()}_${Date.now()}`;
    const newNode: CircuitNode = {
      ...target,
      id: newId,
      x: target.x + 40,
      y: target.y + 40,
      inputs: target.inputs.map((p) => ({ ...p })),
      outputs: target.outputs.map((p) => ({ ...p })),
    };

    const nextNodes = [...nodes, newNode];
    const res = propagateCircuit(nextNodes, wires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
    setSelectedNodeIds([newId]);
  };

  const handleAddWire = (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => {
    const exists = wires.some(
      (w) => w.fromNodeId === fromNodeId && w.fromPortId === fromPortId && w.toNodeId === toNodeId && w.toPortId === toPortId
    );
    if (exists) return;

    const filteredWires = wires.filter((w) => !(w.toNodeId === toNodeId && w.toPortId === toPortId));

    const newWire: Wire = {
      id: `w_${Date.now()}`,
      fromNodeId,
      fromPortId,
      toNodeId,
      toPortId,
      signal: 0,
    };

    const nextWires = [...filteredWires, newWire];
    const res = propagateCircuit(nodes, nextWires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
  };

  const handleDeleteWire = (wireId: string) => {
    const nextWires = wires.filter((w) => w.id !== wireId);
    const res = propagateCircuit(nodes, nextWires);
    setNodes(res.nodes);
    setWires(res.wires);
    pushHistory(res.nodes, res.wires);
    setSelectedWireId(null);
  };

  const handleSelectNode = (nodeId: string | null, multiSelect: boolean) => {
    if (nodeId === null) {
      setSelectedNodeIds([]);
      return;
    }
    if (multiSelect) {
      setSelectedNodeIds((prev) => (prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]));
    } else {
      setSelectedNodeIds([nodeId]);
    }
    setSelectedWireId(null);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.length > 0) {
          selectedNodeIds.forEach((id) => handleDeleteNode(id));
        } else if (selectedWireId) {
          handleDeleteWire(selectedWireId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedNodeIds.length > 0) {
          const copied = nodes.filter((n) => selectedNodeIds.includes(n.id));
          setClipboard(copied);
          addToast('info', `Copied ${copied.length} component(s)`);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (clipboard.length > 0) {
          const idMap = new Map<string, string>();
          const pastedNodes: CircuitNode[] = clipboard.map((orig) => {
            const newId = `${orig.type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            idMap.set(orig.id, newId);
            return {
              ...orig,
              id: newId,
              x: orig.x + 50,
              y: orig.y + 50,
            };
          });

          const nextNodes = [...nodes, ...pastedNodes];
          const res = propagateCircuit(nextNodes, wires);
          setNodes(res.nodes);
          setWires(res.wires);
          pushHistory(res.nodes, res.wires);
          setSelectedNodeIds(pastedNodes.map((n) => n.id));
          addToast('success', `Pasted ${pastedNodes.length} component(s)`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, selectedWireId, nodes, wires, clipboard, historyIndex]);

  // Load Preset Circuit
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_CIRCUITS.find((p) => p.id === presetId);
    if (preset) {
      soundFx.stopAllBuzzers();
      const res = propagateCircuit(preset.data.nodes, preset.data.wires);
      setNodes(res.nodes);
      setWires(res.wires);
      setHistory([{ version: 1, nodes: res.nodes, wires: res.wires }]);
      setHistoryIndex(0);
      setSelectedNodeIds([]);
      setSelectedWireId(null);
      addToast('success', `Loaded ${preset.name}`);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    soundFx.stopAllBuzzers();
    setNodes([]);
    setWires([]);
    pushHistory([], []);
    setSelectedNodeIds([]);
    setSelectedWireId(null);
    addToast('info', 'Canvas cleared');
  };

  // Export JSON
  const handleExportJson = () => {
    const data: CircuitData = { version: 1, nodes, wires };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Circuit JSON exported!');
  };

  // Import JSON
  const handleImportJson = (jsonStr: string) => {
    try {
      const data: CircuitData = JSON.parse(jsonStr);
      if (Array.isArray(data.nodes) && Array.isArray(data.wires)) {
        soundFx.stopAllBuzzers();
        const res = propagateCircuit(data.nodes, data.wires);
        setNodes(res.nodes);
        setWires(res.wires);
        pushHistory(res.nodes, res.wires);
        addToast('success', 'Circuit imported successfully');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    } catch {
      addToast('error', 'Invalid circuit JSON file format');
    }
  };

  // Export PNG Screenshot
  const handleExportPng = () => {
    const svgEl = document.querySelector('svg');
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f1f5f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `logic_circuit_${Date.now()}.png`;
        a.click();
        addToast('success', 'Captured PNG Image!');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeIds[0]) || null;
  const selectedWire = wires.find((w) => w.id === selectedWireId) || null;

  return (
    <div data-theme={theme} style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <Navbar
        isRunning={isRunning}
        onToggleRun={() => setIsRunning(!isRunning)}
        onStep={() => {
          const tickRes = tickClockNodes(nodes);
          const evalRes = propagateCircuit(tickRes.nodes, wires);
          setNodes(evalRes.nodes);
          setWires(evalRes.wires);
        }}
        onReset={() => {
          const res = propagateCircuit(nodes, wires);
          setNodes(res.nodes);
          setWires(res.wires);
        }}
        clockSpeed={clockSpeed}
        onClockSpeedChange={setClockSpeed}
        onLoadPreset={handleLoadPreset}
        onClearCanvas={handleClearCanvas}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onExportPng={handleExportPng}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.15))}
        onZoomFit={() => {
          setZoom(1);
          setPan({ x: 40, y: 40 });
        }}
        snapToGrid={snapToGrid}
        onToggleSnapGrid={() => setSnapToGrid(!snapToGrid)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isMuted={isMuted}
        onToggleMute={() => {
          const nextMute = !isMuted;
          setIsMuted(nextMute);
          soundFx.setMuted(nextMute);
        }}
        onOpenTruthTable={() => setIsTruthTableOpen(true)}
        onOpenWaveform={() => setIsWaveformOpen(true)}
      />

      {/* Main Workspace Area */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Component Palette Sidebar */}
        <Palette onAddNode={(type) => handleAddNode(type)} />

        {/* Canvas Workspace */}
        <Canvas
          nodes={nodes}
          wires={wires}
          selectedNodeIds={selectedNodeIds}
          selectedWireId={selectedWireId}
          onSelectNode={handleSelectNode}
          onSelectWire={(wId) => {
            setSelectedWireId(wId);
            setSelectedNodeIds([]);
          }}
          onSelectMultiple={(nodeIds) => {
            setSelectedNodeIds(nodeIds);
            setSelectedWireId(null);
          }}
          onUpdateNodes={handleUpdateNodes}
          onAddWire={handleAddWire}
          onDeleteWire={handleDeleteWire}
          onAddNodeAt={handleAddNode}
          onUpdateNodeState={handleUpdateNodeState}
          zoom={zoom}
          pan={pan}
          onPanChange={setPan}
          snapToGrid={snapToGrid}
        />

        {/* Property Inspector Panel */}
        <PropertyPanel
          selectedNode={selectedNode}
          selectedWire={selectedWire}
          onUpdateNode={(updated) => {
            const nextNodes = nodes.map((n) => (n.id === updated.id ? updated : n));
            const res = propagateCircuit(nextNodes, wires);
            setNodes(res.nodes);
            setWires(res.wires);
            pushHistory(res.nodes, res.wires);
          }}
          onDeleteNode={handleDeleteNode}
          onDeleteWire={handleDeleteWire}
          onDuplicateNode={handleDuplicateNode}
          onOpenTruthTableModal={() => setIsTruthTableOpen(true)}
          onOpenWaveformModal={() => setIsWaveformOpen(true)}
          onClose={() => {
            setSelectedNodeIds([]);
            setSelectedWireId(null);
          }}
        />
      </div>

      {/* Real-Time Truth Table Modal */}
      {isTruthTableOpen && (
        <TruthTableModal
          nodes={nodes}
          selectedNodeId={selectedNodeIds[0] || null}
          onClose={() => setIsTruthTableOpen(false)}
        />
      )}

      {/* Real-Time Power Amplifiers Practical Lab & Waveform Studio Modal */}
      {isWaveformOpen && (
        <AmplifierLabModal
          nodes={nodes}
          selectedNodeId={selectedNodeIds[0] || null}
          onClose={() => setIsWaveformOpen(false)}
        />
      )}

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
