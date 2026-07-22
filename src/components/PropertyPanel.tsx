import React, { useState, useEffect } from 'react';
import type { CircuitNode, Wire } from '../types/logic';
import { generateTruthTableForNode } from '../engine/TruthTable';
import { generateAmplifierWaveform, AMPLIFIER_SPECS } from '../engine/AmplifierEngine';
import { Trash2, Copy, X, Table, Radio } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: CircuitNode | null;
  selectedWire: Wire | null;
  onUpdateNode: (updatedNode: CircuitNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteWire: (wireId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onOpenTruthTableModal: () => void;
  onOpenWaveformModal: () => void;
  onClose: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedWire,
  onUpdateNode,
  onDeleteNode,
  onDeleteWire,
  onDuplicateNode,
  onOpenTruthTableModal,
  onOpenWaveformModal,
  onClose,
}) => {
  if (!selectedNode && !selectedWire) return null;

  const [ampAnimOffset, setAmpAnimOffset] = useState(0);

  // Live animation loop for inline amplifier sine wave
  useEffect(() => {
    if (selectedNode && selectedNode.type.startsWith('AMP_')) {
      const timer = setInterval(() => {
        setAmpAnimOffset((prev) => (prev + 15) % 1000);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [selectedNode?.type]);

  const truthTableData = selectedNode && selectedNode.type !== 'TEXT_NOTE' && !selectedNode.type.startsWith('AMP_') ? generateTruthTableForNode(selectedNode) : null;
  const isAmplifier = selectedNode && selectedNode.type.startsWith('AMP_');
  const ampSpecs = isAmplifier ? AMPLIFIER_SPECS[selectedNode.type] : null;

  return (
    <aside
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '70px',
        right: '20px',
        width: '290px',
        maxHeight: 'calc(100vh - 90px)',
        overflowY: 'auto',
        borderRadius: '12px',
        padding: '16px',
        zIndex: 45,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {selectedNode ? 'Inspector' : 'Wire Properties'}
        </h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Selected Node Properties */}
      {selectedNode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Label input */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Label Name
            </label>
            <input
              type="text"
              value={selectedNode.label}
              onChange={(e) => onUpdateNode({ ...selectedNode, label: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* POWER AMPLIFIER INLINE SINE WAVE COMPARISON */}
          {isAmplifier && ampSpecs && (
            <div style={{ background: '#020617', borderRadius: '10px', padding: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: ampSpecs.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Radio size={14} /> {ampSpecs.name}
                </span>
                <button
                  onClick={onOpenWaveformModal}
                  style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Full Studio
                </button>
              </div>

              {/* Inline Mini Sine Wave Canvas */}
              <div style={{ height: '90px', width: '100%', background: '#090d16', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                <svg width="100%" height="90" viewBox="0 0 250 90">
                  <line x1="0" y1="45" x2="250" y2="45" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                  {(() => {
                    const gainVal = selectedNode.state.gain || 1.8;
                    const pts = generateAmplifierWaveform(selectedNode.type, 100, 2, gainVal, ampAnimOffset);

                    const inPath = pts.map((p: any, idx: number) => `${idx === 0 ? 'M' : 'L'} ${idx * 2.5} ${45 - p.vIn * 22}`).join(' ');
                    const outPath = pts.map((p: any, idx: number) => `${idx === 0 ? 'M' : 'L'} ${idx * 2.5} ${45 - (p.vOut / (gainVal * 1.2)) * 30}`).join(' ');

                    return (
                      <>
                        <path d={inPath} fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.7} />
                        <path d={outPath} fill="none" stroke={ampSpecs.color} strokeWidth="2.5" />
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Specs Details */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>θ Conduction: <strong style={{ color: 'var(--text-primary)' }}>{ampSpecs.conductionAngle}</strong></div>
                <div>η Efficiency: <strong style={{ color: 'var(--accent-emerald)' }}>{ampSpecs.typicalEfficiency}</strong></div>
              </div>

              {/* Gain Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  <span>Gain (Av):</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>{selectedNode.state.gain || 1.8}x</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4.0}
                  step={0.1}
                  value={selectedNode.state.gain || 1.8}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      state: { ...selectedNode.state, gain: Number(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          {/* Gate input count (for AND, OR, NAND, NOR, XOR, XNOR) */}
          {['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].includes(selectedNode.type) && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Inputs Count
              </label>
              <select
                value={selectedNode.inputs.length}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  const updatedInputs = [];
                  for (let i = 0; i < count; i++) {
                    const step = 100 / (count + 1);
                    updatedInputs.push({
                      id: `in_${i}`,
                      name: `In ${i + 1}`,
                      type: 'input' as const,
                      value: 0 as const,
                      relativeX: 0,
                      relativeY: Math.round(step * (i + 1)),
                    });
                  }
                  onUpdateNode({
                    ...selectedNode,
                    inputs: updatedInputs,
                    state: { ...selectedNode.state, numInputs: count },
                  });
                }}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              >
                <option value={2}>2 Inputs</option>
                <option value={3}>3 Inputs</option>
                <option value={4}>4 Inputs</option>
              </select>
            </div>
          )}

          {/* Clock Frequency */}
          {['CLOCK', 'SINE_GEN'].includes(selectedNode.type) && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Frequency (Hz)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={selectedNode.state.frequency || 1}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, frequency: Number(e.target.value) },
                  })
                }
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Custom Color for Lightbulb / LED */}
          {['LIGHT_BULB', 'LED_PROBE'].includes(selectedNode.type) && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Glow Color
              </label>
              <input
                type="color"
                value={selectedNode.state.customColor || (selectedNode.type === 'LIGHT_BULB' ? '#f59e0b' : '#10b981')}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, customColor: e.target.value },
                  })
                }
                style={{
                  width: '100%',
                  height: '34px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                }}
              />
            </div>
          )}

          {/* Text Note Edit */}
          {selectedNode.type === 'TEXT_NOTE' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Note Content
              </label>
              <textarea
                rows={4}
                value={selectedNode.state.text || ''}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, text: e.target.value },
                  })
                }
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          )}

          {/* Inline Real-Time Truth Table Box */}
          {truthTableData && truthTableData.rows.length > 0 && (
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  <Table size={14} /> Real-Time Truth Table
                </div>
                <button
                  onClick={onOpenTruthTableModal}
                  title="Expand Fullscreen Truth Table"
                  style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Expand
                </button>
              </div>

              <div style={{ maxHeight: '160px', overflowY: 'auto', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                      {truthTableData.inputNames.map((n, i) => (
                        <th key={`in_${i}`} style={{ padding: '4px', color: 'var(--text-muted)' }}>{n}</th>
                      ))}
                      {truthTableData.outputNames.map((n, i) => (
                        <th key={`out_${i}`} style={{ padding: '4px', color: 'var(--accent-emerald)' }}>{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {truthTableData.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        style={{
                          background: row.isActive ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                          borderBottom: '1px solid var(--border-color)',
                          fontWeight: row.isActive ? 700 : 400,
                        }}
                      >
                        {row.inputs.map((iv, i) => (
                          <td key={`v_in_${i}`} style={{ padding: '4px', color: iv.value === 1 ? 'var(--signal-high)' : 'var(--text-muted)' }}>
                            {iv.value}
                          </td>
                        ))}
                        {row.outputs.map((ov, i) => (
                          <td key={`v_out_${i}`} style={{ padding: '4px', color: ov.value === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                            {ov.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={() => onDuplicateNode(selectedNode.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Copy size={14} /> Duplicate
            </button>

            <button
              onClick={() => onDeleteNode(selectedNode.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(244,63,94,0.3)',
                background: 'rgba(244,63,94,0.15)',
                color: 'var(--accent-rose)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Selected Wire Properties */}
      {selectedWire && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Status: <span style={{ color: selectedWire.signal === 1 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 600 }}>{selectedWire.signal === 1 ? 'HIGH (1)' : 'LOW (0)'}</span>
          </div>
          <button
            onClick={() => onDeleteWire(selectedWire.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(244,63,94,0.3)',
              background: 'rgba(244,63,94,0.15)',
              color: 'var(--accent-rose)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} /> Delete Wire
          </button>
        </div>
      )}
    </aside>
  );
};
