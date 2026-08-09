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
import { RealtimeCharacteristicsHUD } from './components/RealtimeCharacteristicsHUD';
import { TruthTableModal } from './components/TruthTableModal';
import { AmplifierLabModal } from './components/AmplifierLabModal';
import { OscilloscopeModal } from './components/OscilloscopeModal';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { ExamNotesSidebar, type NavTab } from './components/examNotes/ExamNotesSidebar';
import { ExamNotesHome } from './components/examNotes/ExamNotesHome';
import { PracticeSection } from './components/examNotes/PracticeSection';
import type { UserNote } from './types/examNotes';

export const App: React.FC = () => {
  // Navigation sidebar view state
  const [activeTab, setActiveTab] = useState<NavTab>('exam-notes');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Exam Notes User Progress & Persistence State
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(['topic-1-1-1']);
  const [bookmarkedTopicIds, setBookmarkedTopicIds] = useState<string[]>(['topic-1-3-1']);
  const [userNotes, setUserNotes] = useState<UserNote[]>([
    { id: '1', topicId: 'topic-1-1-1', text: 'Remember: Decimal to binary uses repeated division by 2. Always read remainders from MSB to LSB.', createdAt: 'Today' }
  ]);

  const handleToggleBookmark = (topicId: string) => {
    setBookmarkedTopicIds(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  const handleMarkCompleted = (topicId: string) => {
    setCompletedTopicIds(prev =>
      prev.includes(topicId) ? prev : [...prev, topicId]
    );
  };

  const handleAddNote = (topicId: string, text: string) => {
    const newNote: UserNote = {
      id: Date.now().toString(),
      topicId,
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUserNotes(prev => [newNote, ...prev]);
  };

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
  const [isOscilloscopeModalOpen, setIsOscilloscopeModalOpen] = useState(false);
  // APE Lab modal commented out — replaced by Practical List (opens AmplifierLabModal)
  // const [isAPELabOpen, setIsAPELabOpen] = useState(false);
  const [activeOscilloscopeNodeId, setActiveOscilloscopeNodeId] = useState<string | null>(null);

  // Creator profile popup
  const [activeProfile, setActiveProfile] = useState<number | null>(null); // index into TEAM_MEMBERS

  // ── Team data (defined inside component to avoid top-level constant) ─────────
  const TEAM_MEMBERS = [
    {
      initials: 'RK', name: 'VARAD PANDE', number: 1,
      color: '#6366f1', shadow: 'rgba(99,102,241,0.5)',
      branch: 'Electronics & Telecommunication Engineering -3K',
      role: 'Lead Developer & Circuit Engine Architect,Frontend Developer & Component Designer,Hardware Integration & Preset Circuit Expert',
      skills: ['React / TypeScript', 'Digital Logic Design', 'Circuit Simulation', 'UI/UX'],
      description: 'Designed the core circuit simulation engine and led the overall architecture of the Logic Gate Simulator. Responsible for gate propagation, waveform rendering, and the oscilloscope panel.',
      emoji: '🔬',
    },
    // {
    //   initials: 'N', name: 'NAVGHARE', number: 2,
    //   color: '#0ea5e9', shadow: 'rgba(14,165,233,0.5)',
    //   branch: 'Electronics & Telecommunication Engineering -3K',
    //   role: 'Frontend Developer & Component Designer',
    //   skills: ['Component Library', 'Canvas Rendering', 'CSS Animations', 'SVG Graphics', 'Digital Logic design, 'Waceform Generator''],
    //   description: 'Built the interactive drag-and-drop canvas, component palette sidebar, and wire routing system. Created the visual design language and all interactive UI components.',
    //   emoji: '🎨',
    // },
    // {
    //   initials: 'W', name: 'WAGHMARE', number: 3,
    //   color: '#10b981', shadow: 'rgba(16,185,129,0.5)',
    //   branch: 'Electronics & Telecommunication Engineering',
    //   role: 'Hardware Integration & Preset Circuit Expert',
    //   skills: ['Analog Electronics', 'Power Electronics', 'Circuit Analysis', 'Testing & QA'],
    //   description: 'Developed and validated 20+ preset circuit implementations including rectifiers, filters, amplifiers and timer circuits. Ensured simulation accuracy against real hardware behavior.',
    //   emoji: '⚡',
    // },
    // {
    //   initials: 'V', name: 'AARYA', number: 4,
    //   color: '#f59e0b', shadow: 'rgba(245,158,11,0.5)',
    //   branch: 'Electronics & Telecommunication Engineering',
    //   role: 'DSO/CRO Oscilloscope & Waveform Developer',
    //   skills: ['Signal Processing', 'Waveform Analysis', 'DSO Emulation', 'Data Visualization'],
    //   description: 'Implemented the full DSO/CRO oscilloscope front panel with dual-channel waveform display, CH1 input vs CH2 output comparison, FFT spectrum, and CSV export functionality.',
    //   emoji: '📡',
    // },
    // {
    //   initials: 'VP', name: 'Prof. Vijay Patil', number: 0,
    //   color: '#f59e0b', shadow: 'rgba(245,158,11,0.6)',
    //   branch: 'Department of Electronics Engineering',
    //   role: 'Faculty Guide & Project Mentor',
    //   skills: ['Power Electronics', 'Analog Circuits', 'Project Management', 'Academic Research'],
    //   description: 'Provided expert guidance, technical direction, and academic supervision throughout the project. Helped define the curriculum-aligned scope and ensured the simulator meets MSBTE K-scheme educational standards.',
    //   emoji: '🏅',
    // },
  ];

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

  // Rolling waveform signal history (nodeId → 0/1 samples, max 250)
  const WAVE_HISTORY_LEN = 250;
  const [waveformHistory, setWaveformHistory] = useState<Record<string, number[]>>({});

  // ── Stable refs so setInterval callbacks always read latest state ─────────
  const nodesRef = useRef(nodes);
  const wiresRef = useRef(wires);
  const isRunningRef = useRef(isRunning);
  const clockSpeedRef = useRef(clockSpeed);
  useEffect(() => { nodesRef.current = nodes; });
  useEffect(() => { wiresRef.current = wires; });
  useEffect(() => { isRunningRef.current = isRunning; });
  useEffect(() => { clockSpeedRef.current = clockSpeed; });

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

  // ── One-time mount: propagate the initial preset circuit to stable state ──
  useEffect(() => {
    const res = propagateCircuit(nodesRef.current, wiresRef.current);
    if (res.hasChanged) {
      setNodes(res.nodes);
      setWires(res.wires);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Clock tick + waveform sampling — single long-lived interval ───────────
  const lastClockTickRef = useRef<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      // Waveform history sample (every tick ~50ms ≈ 20fps)
      setWaveformHistory((prev) => {
        const next: Record<string, number[]> = {};
        for (const node of nodesRef.current) {
          if (node.type === 'TEXT_NOTE') continue;
          const raw = node.outputs[0]?.value ?? node.inputs[0]?.value ?? node.state.value;
          const sample = raw === 1 ? 1 : 0;
          const arr = prev[node.id] ?? [];
          next[node.id] = [...arr.slice(-(WAVE_HISTORY_LEN - 1)), sample];
        }
        return next;
      });

      // Clock tick (gated by isRunning + clockSpeed)
      if (!isRunningRef.current) return;
      const intervalMs = 1000 / clockSpeedRef.current;
      const now = Date.now();
      if (now - lastClockTickRef.current >= intervalMs) {
        lastClockTickRef.current = now;
        const tickRes = tickClockNodes(nodesRef.current);
        if (tickRes.ticked) {
          const evalRes = propagateCircuit(tickRes.nodes, wiresRef.current);
          // Update buzzer states
          evalRes.nodes.forEach((n) => {
            if (n.type === 'BUZZER') soundFx.setBuzzerState(n.id, n.state.value === 1);
          });
          setNodes(evalRes.nodes);
          setWires(evalRes.wires);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    const initialState = (() => {
      switch (type) {
        case 'DC_SUPPLY':
          return { value: 1 as const, voltageDc: 5, frequency: 1, gain: 1.8 };
        case 'AC_SUPPLY':
          return { value: 1 as const, voltageAcRms: 12, frequency: 50, gain: 1.8 };
        case 'FUNCTION_GEN':
          return { value: 0 as const, waveType: 'sine' as const, frequency: 1000, amplitude: 5, offsetV: 0, gain: 1.8 };
        case 'CRO_SCOPE':
          return { value: 0 as const, voltsPerDiv: 1, timePerDiv: 1, frequency: 1, gain: 1.8 };
        case 'DSO_SCOPE':
          return { value: 0 as const, voltsPerDiv: 1, timePerDiv: 1, triggerLevel: 2.5, fftEnabled: false, frequency: 1, gain: 1.8 };
        default:
          return { value: 0 as const, frequency: 1, gain: 1.8 };
      }
    })();

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
      state: initialState,
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
    const clickedNode = nodes.find((n) => n.id === nodeId);
    if (clickedNode && (clickedNode.type === 'CRO_SCOPE' || clickedNode.type === 'DSO_SCOPE')) {
      setActiveOscilloscopeNodeId(nodeId);
      setIsOscilloscopeModalOpen(true);
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
        onOpenOscilloscopePanel={() => setIsOscilloscopeModalOpen(true)}
        onOpenAPELab={() => setIsWaveformOpen(true)}
        onOpenExamNotes={() => setActiveTab('exam-notes')}
        activeTab={activeTab}
      />

      {/* ── Creator Credits Strip ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          height: '42px',
          background: theme === 'dark'
            ? 'linear-gradient(90deg, rgba(15,23,42,0.96) 0%, rgba(30,27,75,0.96) 50%, rgba(15,23,42,0.96) 100%)'
            : 'linear-gradient(90deg, rgba(241,245,249,0.98) 0%, rgba(224,231,255,0.98) 50%, rgba(241,245,249,0.98) 100%)',
          borderBottom: theme === 'dark'
            ? '1px solid rgba(99,102,241,0.25)'
            : '1px solid rgba(99,102,241,0.18)',
          boxShadow: theme === 'dark'
            ? '0 2px 12px rgba(0,0,0,0.35)'
            : '0 2px 8px rgba(99,102,241,0.08)',
          flexShrink: 0,
          zIndex: 40,
          gap: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative left accent line */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, #6366f1, #0ea5e9, #10b981, #f59e0b)',
          borderRadius: '0 2px 2px 0',
        }} />

        {/* Left: Project label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', flexShrink: 0 }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', fontWeight: 900, color: '#fff',
            boxShadow: '0 2px 6px rgba(99,102,241,0.4)',
          }}>
            LG
          </div>
          <div>
            <div style={{
              fontSize: '0.65rem', fontWeight: 800,
              color: theme === 'dark' ? '#f1f5f9' : '#1e1b4b',
              lineHeight: 1.1, letterSpacing: '0.02em',
            }}>
              Electronic and Tele-Communication Department
            </div>
            <div style={{
              fontSize: '0.55rem',
              color: theme === 'dark' ? '#6366f1' : '#4f46e5',
              fontWeight: 700, letterSpacing: '0.08em',
            }}>
              ADVANCED VIRTUAL ELECTRONICS LAB · SSPI
            </div>
          </div>
        </div>

        {/* Centre divider */}
        <div style={{ flex: 1, height: '1px', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.12)' }} />

        {/* Centre: Created By label */}
        <div style={{
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
          color: theme === 'dark' ? '#64748b' : '#94a3b8',
          textTransform: 'uppercase', flexShrink: 0,
        }}>
          Created by-<span style={{ color: theme === 'dark' ? '#6366f1' : '#4f46e5',fontSize: '0.65rem', fontWeight: 800, }}>EJ-3K</span>
        </div>

        {/* Team member avatars — clickable */}
        {TEAM_MEMBERS.slice(0, 4).map((member, idx) => (
          <div
            key={member.initials}
            onClick={() => setActiveProfile(idx)}
            title={`Click to view ${member.name}'s profile`}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '3px 9px 3px 4px',
              borderRadius: '20px',
              background: theme === 'dark' ? `${member.color}14` : `${member.color}12`,
              border: `1px solid ${member.color}30`,
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.18s',
              boxShadow: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${member.color}28`)}
            onMouseLeave={e => (e.currentTarget.style.background = theme === 'dark' ? `${member.color}14` : `${member.color}12`)}
          >
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${member.color}, ${member.color}aa)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '0.58rem', color: '#fff',
              boxShadow: `0 2px 8px ${member.shadow}`,
              flexShrink: 0,
              border: `2px solid ${member.color}50`,
            }}>
              {member.initials}
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: theme === 'dark' ? '#e2e8f0' : '#1e293b', whiteSpace: 'nowrap' }}>
              {member.name}
            </span>
            <span style={{ fontSize: '0.55rem', fontWeight: 800, color: member.color, background: `${member.color}20`, border: `1px solid ${member.color}40`, borderRadius: '4px', padding: '1px 4px' }}>
              #{idx + 1}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

        {/* Professor / Guide — clickable */}
        <div
          onClick={() => setActiveProfile(4)}
          title="Click to view Prof. Vijay Patil's profile"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '3px 10px 3px 5px',
            borderRadius: '20px',
            background: theme === 'dark' ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.28)',
            flexShrink: 0,
            cursor: 'pointer',
            transition: 'background 0.18s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = theme === 'dark' ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)')}
        >
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '0.6rem', color: '#fff',
            boxShadow: '0 2px 10px rgba(245,158,11,0.55)',
            flexShrink: 0, border: '2px solid rgba(245,158,11,0.4)',
          }}>
            VP
          </div>
          <div>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', color: '#f59e0b', textTransform: 'uppercase', lineHeight: 1 }}>Under Guidance</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: theme === 'dark' ? '#fcd34d' : '#92400e', lineHeight: 1.2 }}>Prof. Vijay Patil</div>
          </div>
          <span style={{ fontSize: '0.9rem', marginLeft: '2px' }}>🏅</span>
        </div>
      </div>

      {/* ── Profile Popup Modal ───────────────────────────────────────────────── */}
      {activeProfile !== null && (() => {
        const m = TEAM_MEMBERS[activeProfile];
        const isProf = activeProfile === 4;
        return (
          <div
            onClick={() => setActiveProfile(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 99999,
              background: 'rgba(5,8,20,0.75)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
              animation: 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '420px', maxWidth: '95vw',
                background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                border: `2px solid ${m.color}50`,
                borderRadius: '24px',
                boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${m.color}20`,
                overflow: 'hidden',
                fontFamily: 'Inter, system-ui, sans-serif',
                position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveProfile(null)}
                style={{
                  position: 'absolute', top: '14px', right: '14px',
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: 'none', background: 'rgba(255,255,255,0.1)',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2, fontWeight: 700,
                }}
              >
                ×
              </button>

              {/* Hero banner */}
              <div style={{
                height: '120px',
                background: `linear-gradient(135deg, ${m.color}60 0%, ${m.color}20 60%, transparent 100%)`,
                position: 'relative',
                display: 'flex', alignItems: 'flex-end',
                padding: '0 24px 0 24px',
              }}>
                {/* Large avatar */}
                <div style={{
                  position: 'absolute', bottom: '-36px', left: '24px',
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '1.6rem', color: '#fff',
                  boxShadow: `0 8px 30px ${m.shadow}, 0 0 0 4px #0f172a, 0 0 0 6px ${m.color}40`,
                  border: `3px solid ${m.color}80`,
                  zIndex: 1,
                }}>
                  {m.emoji}
                </div>
                {/* Top-right number badge */}
                {!isProf && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '24px',
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
                    color: m.color, textTransform: 'uppercase',
                  }}>
                    TEAM MEMBER #{m.number}
                  </div>
                )}
                {isProf && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '24px',
                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
                    color: m.color, textTransform: 'uppercase',
                  }}>
                    🏅 FACULTY GUIDE
                  </div>
                )}
              </div>

              {/* Content area */}
              <div style={{ padding: '52px 24px 24px 24px' }}>
                {/* Name */}
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', lineHeight: 1.1 }}>
                  {m.name}
                </div>
                {/* Role badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  marginTop: '8px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: `${m.color}20`,
                  border: `1px solid ${m.color}40`,
                  fontSize: '0.72rem', fontWeight: 700, color: m.color,
                }}>
                  {m.role}
                </div>

                {/* Info rows */}
                <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Branch */}
                  <div style={{
                    display: 'flex', gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>🎓</span>
                    <div>
                      <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Branch / Department</div>
                      <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 700, marginTop: '2px' }}>{m.branch}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>📋 Role in Project</div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.55 }}>{m.description}</div>
                  </div>

                  {/* Skills */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>🛠 Key Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {m.skills.map(skill => (
                        <span key={skill} style={{
                          fontSize: '0.68rem', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '10px',
                          background: `${m.color}18`,
                          border: `1px solid ${m.color}35`,
                          color: m.color,
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.62rem', color: '#334155' }}>
                  Shri Shivaji Polytechnic Institute · Advanced Electronics Lab
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Workspace Area */}
      <div className="app-main-workspace" style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Navigation Sidebar */}
        <ExamNotesSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* View Switcher Content Container */}
        <div className="app-view-container" style={{ flex: 1, display: 'flex', position: 'relative', overflowY: (activeTab === 'exam-notes' || activeTab === 'practice') ? 'auto' : 'hidden' }}>
          {activeTab === 'exam-notes' && (
            <ExamNotesHome
              completedTopicIds={completedTopicIds}
              bookmarkedTopicIds={bookmarkedTopicIds}
              onToggleBookmark={handleToggleBookmark}
              onMarkCompleted={handleMarkCompleted}
              notes={userNotes}
              onAddNote={handleAddNote}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeSection />
          )}

          {activeTab === 'simulator' && (
            <>
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

              {/* Real-Time Waveform & Characteristics HUD */}
              <RealtimeCharacteristicsHUD
                nodes={nodes}
                wires={wires}
                selectedNodeId={selectedNodeIds[0] || null}
                waveformHistory={waveformHistory}
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
                onOpenOscilloscopeModal={(nodeId) => {
                  setActiveOscilloscopeNodeId(nodeId);
                  setIsOscilloscopeModalOpen(true);
                }}
                onClose={() => {
                  setSelectedNodeIds([]);
                  setSelectedWireId(null);
                }}
              />
            </>
          )}

          {activeTab === 'iot-simulator' && (
            <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
              <iframe
                src="https://app.cirkitdesigner.com/project"
                title="IoT Circuit Designer & Simulator"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  flex: 1,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {activeTab === 'previous-papers' && (
            <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
              <iframe
                src="https://econtent.msbte.edu.in/question_papers/"
                title="MSBTE Previous Question Papers"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  flex: 1,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {(activeTab !== 'exam-notes' && activeTab !== 'simulator' && activeTab !== 'iot-simulator' && activeTab !== 'previous-papers') && (
            <div style={{
              flex: 1,
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f8fafc',
              textAlign: 'center',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', marginBottom: '16px',
                boxShadow: '0 8px 24px rgba(56,189,248,0.4)',
              }}>
                ⭐
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 10px 0', textTransform: 'capitalize' }}>
                {activeTab.replace('-', ' ')}
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '480px', lineHeight: 1.6, marginBottom: '24px' }}>
                Explore the interactive visual learning experience in <strong>Exam Notes ⭐</strong> or build custom digital logic circuits in the <strong>Simulator</strong>.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('exam-notes')}
                  style={{
                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                    color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(56,189,248,0.4)',
                  }}
                >
                  📚 Open Exam Notes ⭐
                </button>
                <button
                  onClick={() => setActiveTab('simulator')}
                  style={{
                    padding: '10px 20px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer',
                  }}
                >
                  ⚡ Open Circuit Simulator
                </button>
              </div>
            </div>
          )}
        </div>
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

      {/* Interactive DSO & CRO Oscilloscope Hardware Front Panel Modal */}
      {isOscilloscopeModalOpen && (
        <OscilloscopeModal
          node={nodes.find((n) => n.id === activeOscilloscopeNodeId) || nodes.find((n) => n.type === 'CRO_SCOPE' || n.type === 'DSO_SCOPE') || null}
          nodes={nodes}
          wires={wires}
          waveformHistory={waveformHistory}
          onClose={() => setIsOscilloscopeModalOpen(false)}
          onUpdateNodeState={handleUpdateNodeState}
        />
      )}

      {/* MSBTE 30 Advanced Power Electronics Virtual Laboratory Modal — commented out, replaced by Practical List */}
      {/* isAPELabOpen && (
        <PowerElectronicsLabModal
          onClose={() => setIsAPELabOpen(false)}
        />
      ) */}

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
