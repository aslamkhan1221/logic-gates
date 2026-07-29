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
  Tv,
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
  onOpenTruthTable?: () => void;
  onOpenWaveform?: () => void;
  onOpenOscilloscopePanel?: () => void;
  onOpenAPELab?: () => void;
  onOpenExamNotes?: () => void;
  activeTab?: string;
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
  onOpenTruthTable: _onOpenTruthTable,
  onOpenWaveform: _onOpenWaveform,
  onOpenOscilloscopePanel,
  onOpenAPELab,
  onOpenExamNotes,
  activeTab,
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
    <header
      className="glass-panel"
      style={{
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        zIndex: 50,
        borderBottom: '1px solid var(--border-color)',
        gap: '4px',
        rowGap: '4px',
        minHeight: '48px',
      }}
    >
      {/* 1. Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(56, 189, 248, 0.4)',
            flexShrink: 0,
          }}
        >
          <Layers size={15} color="#fff" />
        </div>
        <span style={{ fontSize: '0.68rem', color: 'var(--text)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          Shri Shivaji Polytechnic
        </span>
      </div>

      {/* 2. Simulation Speed & Run Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-card)',
          padding: '3px 8px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onToggleRun}
          title={isRunning ? 'Pause Simulation' : 'Run Simulation'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 12px',
            borderRadius: '14px',
            border: 'none',
            background: isRunning ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            boxShadow: isRunning ? '0 0 8px rgba(244, 63, 94, 0.4)' : '0 0 8px rgba(16, 185, 129, 0.4)',
          }}
        >
          {isRunning ? <Pause size={14} /> : <Play size={10} />}
          <span>{isRunning ? 'Pause' : 'Run'}</span>
        </button>

        <button
          onClick={onStep}
          disabled={isRunning}
          title="Step Clock"
          style={{
            padding: '5px 8px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            color: isRunning ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          <SkipForward size={14} />
        </button>

        <button
          onClick={onReset}
          title="Reset Circuit"
          style={{
            padding: '5px 8px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
        </button>

        <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 2px' }} />

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <span>{clockSpeed}Hz</span>
          <input
            type="range"
            min={1}
            max={20}
            value={clockSpeed}
            onChange={(e) => onClockSpeedChange(Number(e.target.value))}
            style={{ width: '55px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 3. Preset Circuits Selector */}
      <div style={{ flexShrink: 0 }}>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          style={{
            maxWidth: '170px',
            padding: '5px 8px',
            borderRadius: '8px',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
            cursor: 'pointer',
            outline: 'none',
            textOverflow: 'ellipsis',
          }}
        >
          <option value="" disabled>
            📂 Load Circuit...
          </option>
          {PRESET_CIRCUITS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Action Modals & Utility Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {/* ── APE Lab button commented out as per user request ───────────────
        <button
          onClick={onOpenAPELab}
          title="Open MSBTE 30 Advanced Power Electronics Lab Circuits"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '8px',
            border: '1px solid #a855f7',
            background: 'rgba(168, 85, 247, 0.2)',
            color: '#c084fc',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Zap size={13} color="#e9d5ff" />
          <span>⚡ APE Lab</span>
        </button>
        ─────────────────────────────────────────────────────────────────── */}

        {/* 📋 Practical List Button — replaces APE Lab in navbar */}
        <button
          onClick={onOpenAPELab}
          title="Open MSBTE K-Scheme Subject-wise Practical List"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid #22d3ee',
            background: 'linear-gradient(135deg, rgba(34,211,238,0.18) 0%, rgba(56,189,248,0.12) 100%)',
            color: '#22d3ee',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(34,211,238,0.25)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>📋</span>
          <span>ATE Practicals</span>
        </button>

        {/* 📚 Exam Notes ⭐ Button */}
        {onOpenExamNotes && (
          <button
            onClick={onOpenExamNotes}
            title="Open Exam Notes (Visual Learning Mode)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: activeTab === 'exam-notes' ? '1px solid #f59e0b' : '1px solid #0284c7',
              background: activeTab === 'exam-notes'
                ? 'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.2) 100%)'
                : 'linear-gradient(135deg, rgba(2,132,199,0.25) 0%, rgba(56,189,248,0.15) 100%)',
              color: activeTab === 'exam-notes' ? '#fbbf24' : '#38bdf8',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(56,189,248,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>📚</span>
            <span>Exam Notes ⭐</span>
          </button>
        )}

        {/* DSO / CRO Hardware Panel Button - icon only */}
        <button
          onClick={onOpenOscilloscopePanel}
          title="Open Hardware DSO / CRO Front Panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '8px',
            border: '1px solid #38bdf8',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Tv size={13} />
          <span>DSO</span>
        </button>

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-card)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{
              padding: '5px',
              border: 'none',
              background: 'transparent',
              color: canUndo ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{
              padding: '5px',
              border: 'none',
              background: 'transparent',
              color: canRedo ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-card)', padding: '2px 4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button onClick={onZoomOut} title="Zoom Out" style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '0.72rem', minWidth: '35px', textAlign: 'center', color: 'var(--text-secondary)' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} title="Zoom In" style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ZoomIn size={14} />
          </button>
          <button onClick={onZoomFit} title="Fit Canvas" style={{ padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Maximize2 size={14} />
          </button>
        </div>

        {/* Toolbar Icons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={onToggleSnapGrid}
            title={snapToGrid ? 'Snap to Grid ON' : 'Snap to Grid OFF'}
            style={{
              padding: '5px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: snapToGrid ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-card)',
              color: snapToGrid ? 'var(--accent-cyan)' : 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            <Grid size={14} />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            style={{
              padding: '5px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: isMuted ? 'var(--accent-rose)' : 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button onClick={onExportJson} title="Export JSON" style={{ padding: '5px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Download size={14} />
          </button>

          <button onClick={() => fileInputRef.current?.click()} title="Import JSON" style={{ padding: '5px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Upload size={14} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />

          <button onClick={onExportPng} title="Export PNG" style={{ padding: '5px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Camera size={14} />
          </button>

          <button onClick={onClearCanvas} title="Clear Canvas" style={{ padding: '5px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.15)', color: 'var(--accent-rose)', cursor: 'pointer' }}>
            <Trash2 size={14} />
          </button>

          <button onClick={onToggleTheme} title="Toggle Theme" style={{ padding: '5px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#8b5cf6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
