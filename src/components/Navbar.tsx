import React, { useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Undo2,
  Redo2,
  Camera,
  Layers,
  Volume2,
  VolumeX,
  Table,
  Activity,
} from 'lucide-react';
import { PRESET_CIRCUITS } from '../engine/Presets';

interface NavbarProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onStep: () => void;
  onReset: () => void;
  clockSpeed: number;
  onClockSpeedChange: (speed: number) => void;
  onLoadPreset: (presetId: string) => void;
  onClearCanvas: () => void;
  onExportJson: () => void;
  onImportJson: (json: string) => void;
  onExportPng: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  snapToGrid: boolean;
  onToggleSnapGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTruthTable: () => void;
  onOpenWaveform: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isRunning,
  onToggleRun,
  onStep,
  onReset,
  clockSpeed,
  onClockSpeedChange,
  onLoadPreset,
  onClearCanvas,
  onExportJson,
  onImportJson,
  onExportPng,
  theme,
  onToggleTheme,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  snapToGrid,
  onToggleSnapGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isMuted,
  onToggleMute,
  onOpenTruthTable,
  onOpenWaveform,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          onImportJson(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="glass-panel" style={{ height: '60px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, borderBottom: '1px solid var(--border-color)' }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)' }}>
          <Layers size={20} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Logic.ly Simulator
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interactive Digital Logic & Amplifier Playground</span>
        </div>
      </div>

      {/* Center Controls: Playback & Simulation Speed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
        <button
          onClick={onToggleRun}
          title={isRunning ? 'Pause Simulation' : 'Run Simulation'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '16px',
            border: 'none',
            background: isRunning ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: isRunning ? '0 0 10px rgba(244, 63, 94, 0.4)' : '0 0 10px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s',
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Pause' : 'Run'}</span>
        </button>

        <button
          onClick={onStep}
          disabled={isRunning}
          title="Step Single Clock Tick"
          style={{
            padding: '6px 10px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            color: isRunning ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          <SkipForward size={16} />
        </button>

        <button
          onClick={onReset}
          title="Reset Circuit Signals"
          style={{
            padding: '6px 10px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={16} />
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 4px' }} />

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Freq: {clockSpeed}Hz</span>
          <input
            type="range"
            min={1}
            max={20}
            value={clockSpeed}
            onChange={(e) => onClockSpeedChange(Number(e.target.value))}
            style={{ width: '70px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Presets & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Preset selector */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              onLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="" disabled>
            📂 Load Sample Circuit...
          </option>
          {PRESET_CIRCUITS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Waveform / Amplifier Studio Button */}
        <button
          onClick={onOpenWaveform}
          title="Open Waveform & Amplifier Studio"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--accent-violet)',
            background: 'rgba(139, 92, 246, 0.15)',
            color: 'var(--accent-violet)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Activity size={16} />
          <span>Waveforms</span>
        </button>

        {/* Truth Table Button */}
        <button
          onClick={onOpenTruthTable}
          title="Open Real-Time Truth Table"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--accent-cyan)',
            background: 'rgba(56, 189, 248, 0.15)',
            color: 'var(--accent-cyan)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Table size={16} />
          <span>Truth Table</span>
        </button>

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-card)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              color: canUndo ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: canUndo ? 'pointer' : 'not-allowed',
              borderRadius: '6px',
            }}
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{
              padding: '6px',
              border: 'none',
              background: 'transparent',
              color: canRedo ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: canRedo ? 'pointer' : 'not-allowed',
              borderRadius: '6px',
            }}
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-card)', padding: '2px 6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button onClick={onZoomOut} title="Zoom Out" style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ZoomOut size={16} />
          </button>
          <span style={{ fontSize: '0.78rem', minWidth: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} title="Zoom In" style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ZoomIn size={16} />
          </button>
          <button onClick={onZoomFit} title="Fit Canvas" style={{ padding: '6px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Snap Grid */}
        <button
          onClick={onToggleSnapGrid}
          title={snapToGrid ? 'Snap to Grid ON' : 'Snap to Grid OFF'}
          style={{
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: snapToGrid ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
            color: snapToGrid ? 'var(--accent-cyan)' : 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <Grid size={16} />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          style={{
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            color: isMuted ? 'var(--accent-rose)' : 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* File Actions */}
        <button onClick={onExportJson} title="Export Circuit JSON" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Download size={16} />
        </button>

        <button onClick={() => fileInputRef.current?.click()} title="Import Circuit JSON" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Upload size={16} />
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />

        <button onClick={onExportPng} title="Export High-Res PNG Image" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Camera size={16} />
        </button>

        <button onClick={onClearCanvas} title="Clear Canvas" style={{ padding: '6px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.15)', color: 'var(--accent-rose)', cursor: 'pointer' }}>
          <Trash2 size={16} />
        </button>

        {/* Theme Toggle */}
        <button onClick={onToggleTheme} title="Toggle Theme" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#8b5cf6" />}
        </button>
      </div>
    </header>
  );
};
