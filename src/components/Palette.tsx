import React, { useState } from 'react';
import type { NodeType, Category } from '../types/logic';
import { COMPONENT_METADATA } from '../engine/GateLogic';
import {
  ToggleRight,
  CircleDot,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity,
  FastForward,
  RotateCcw,
  Layers,
  GitMerge,
  Minimize2,
  Disc,
  Zap,
  Shield,
  Lightbulb,
  Radio,
  Tv,
  Volume2,
  Box,
  Cpu,
  Sliders,
  Split,
  PlusSquare,
  Grid,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface PaletteProps {
  onAddNode: (type: NodeType) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ToggleRight: <ToggleRight size={18} />,
  CircleDot: <CircleDot size={18} />,
  ArrowUpCircle: <ArrowUpCircle size={18} />,
  ArrowDownCircle: <ArrowDownCircle size={18} />,
  Activity: <Activity size={18} />,
  FastForward: <FastForward size={18} />,
  RotateCcw: <RotateCcw size={18} />,
  Layers: <Layers size={18} />,
  GitMerge: <GitMerge size={18} />,
  Minimize2: <Minimize2 size={18} />,
  Disc: <Disc size={18} />,
  Zap: <Zap size={18} />,
  Shield: <Shield size={18} />,
  Lightbulb: <Lightbulb size={18} />,
  Radio: <Radio size={18} />,
  Tv: <Tv size={18} />,
  Volume2: <Volume2 size={18} />,
  Box: <Box size={18} />,
  Cpu: <Cpu size={18} />,
  Sliders: <Sliders size={18} />,
  Split: <Split size={18} />,
  PlusSquare: <PlusSquare size={18} />,
  Grid: <Grid size={18} />,
  FileText: <FileText size={18} />,
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'inputs', label: 'Input Controls' },
  { id: 'amplifiers', label: 'Power Amplifiers (Class A-D)' },
  { id: 'gates', label: 'Logic Gates' },
  { id: 'outputs', label: 'Outputs & Displays' },
  { id: 'ics', label: 'ICs & Memory Latches' },
  { id: 'annotations', label: 'Annotations' },
];

export const Palette: React.FC<PaletteProps> = ({ onAddNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    inputs: true,
    amplifiers: true,
    gates: true,
    outputs: true,
    ics: true,
    annotations: true,
  });

  // Mobile Drawer Toggle State
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/logic-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const filteredComponents = COMPONENT_METADATA.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 55,
          padding: '10px 16px',
          borderRadius: '24px',
          color: 'var(--accent-cyan)',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: '1px solid var(--accent-cyan)',
          cursor: 'pointer',
        }}
        id="mobile-palette-toggle"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        <span>{isMobileOpen ? 'Close Library' : 'Add Component'}</span>
      </button>

      {/* Palette Sidebar Container */}
      <aside
        className={`glass-panel ${isMobileOpen ? 'mobile-palette-drawer' : ''}`}
        style={{
          width: '250px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Search Bar */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-color)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Category List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          {CATEGORIES.map((cat) => {
            const catItems = filteredComponents.filter((item) => item.category === cat.id);
            if (catItems.length === 0) return null;
            const isExpanded = expandedCategories[cat.id] ?? true;

            return (
              <div key={cat.id} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '6px',
                  }}
                >
                  <span>{cat.label}</span>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {isExpanded && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', marginTop: '6px' }}>
                    {catItems.map((item) => (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        onClick={() => {
                          onAddNode(item.type);
                          setIsMobileOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          cursor: 'grab',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>
                          {ICON_MAP[item.iconName] || <Box size={18} />}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
