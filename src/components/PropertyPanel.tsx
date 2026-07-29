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
  onOpenOscilloscopeModal?: (nodeId: string) => void;
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
  onOpenOscilloscopeModal,
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

          {/* FLIP-FLOP RACE-AROUND CONDITION CONTROLS */}
          {['JK_FLIPFLOP', 'T_FLIPFLOP'].includes(selectedNode.type) && (
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚡ Trigger Mode & Race Condition
              </label>

              <select
                value={selectedNode.state.triggerMode || 'level'}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, triggerMode: e.target.value as 'level' | 'master_slave' },
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
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="level">Level-Triggered (Enables Race-Around)</option>
                <option value="master_slave">Master-Slave / Edge (Race-Free)</option>
              </select>

              {(selectedNode.state.triggerMode || 'level') === 'level' ? (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                  ⚠️ <strong style={{ color: '#f59e0b' }}>Level-Triggered:</strong> When J=1, K=1, CLK=1 and pulse width $t_p &gt; \Delta t$, output Q continuously toggles causing <strong style={{ color: '#ef4444' }}>Race-Around Condition</strong>.
                </div>
              ) : (
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', lineHeight: '1.3' }}>
                  ✅ <strong style={{ color: 'var(--accent-emerald)' }}>Master-Slave:</strong> Toggles once per clock edge, eliminating race-around condition.
                </div>
              )}

              {selectedNode.state.isRacing && (
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '6px', padding: '6px 8px', color: '#ef4444', fontSize: '0.74rem', fontWeight: 700 }}>
                  ⚡ RACE AROUND ACTIVE! Output oscillating at high frequency.
                </div>
              )}
            </div>
          )}

          {/* DISCRETE & PASSIVE ELECTRONICS CONTROLS */}
          {selectedNode.type === 'RESISTOR' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Resistance (Ohms Ω)
              </label>
              <input
                type="number"
                min={10}
                max={1000000}
                step={100}
                value={selectedNode.state.resistance ?? 1000}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, resistance: Number(e.target.value) },
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

          {selectedNode.type === 'CAPACITOR' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Capacitance (µF)
              </label>
              <input
                type="number"
                min={0.1}
                max={10000}
                step={1}
                value={selectedNode.state.capacitance ?? 10}
                onChange={(e) =>
                  onUpdateNode({
                    ...selectedNode,
                    state: { ...selectedNode.state, capacitance: Number(e.target.value) },
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

          {/* DC POWER SUPPLY CONTROLS */}
          {selectedNode.type === 'DC_SUPPLY' && (
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid #f59e0b55', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}>⚡ DC Power Supply (Variable)</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                <span>Output Voltage (V):</span>
                <span style={{ color: '#facc15', fontWeight: 700 }}>{selectedNode.state.voltageDc ?? 5} V</span>
              </div>
              <input
                type="range" min={0} max={30} step={0.5}
                value={selectedNode.state.voltageDc ?? 5}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, voltageDc: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                <span>0 V</span><span>15 V</span><span>30 V</span>
              </div>
            </div>
          )}

          {/* AC POWER SUPPLY CONTROLS */}
          {selectedNode.type === 'AC_SUPPLY' && (
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid #f43f5e55', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f43f5e' }}>⚡ AC Power Supply (Variable)</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                <span>RMS Voltage:</span>
                <span style={{ color: '#f87171', fontWeight: 700 }}>{selectedNode.state.voltageAcRms ?? 12} V RMS</span>
              </div>
              <input
                type="range" min={0} max={24} step={0.5}
                value={selectedNode.state.voltageAcRms ?? 12}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, voltageAcRms: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px', marginTop: '4px' }}>
                <span>Frequency:</span>
                <span style={{ color: '#f87171', fontWeight: 700 }}>{selectedNode.state.frequency ?? 50} Hz</span>
              </div>
              <input
                type="range" min={1} max={1000} step={1}
                value={selectedNode.state.frequency ?? 50}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, frequency: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }}
              />
            </div>
          )}

          {/* FUNCTION GENERATOR CONTROLS */}
          {selectedNode.type === 'FUNCTION_GEN' && (
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>〰 Function Generator</label>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Waveform Type</label>
                <select
                  value={selectedNode.state.waveType ?? 'sine'}
                  onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, waveType: e.target.value as any } })}
                  style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                >
                  <option value="sine">Sine Wave</option>
                  <option value="square">Square Wave</option>
                  <option value="triangle">Triangle Wave</option>
                  <option value="sawtooth">Sawtooth Wave</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Frequency:</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedNode.state.frequency ?? 1000} Hz</span>
              </div>
              <input
                type="range" min={1} max={100000} step={100}
                value={selectedNode.state.frequency ?? 1000}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, frequency: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Amplitude (Vpp):</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedNode.state.amplitude ?? 5} Vpp</span>
              </div>
              <input
                type="range" min={0.1} max={20} step={0.1}
                value={selectedNode.state.amplitude ?? 5}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, amplitude: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>DC Offset (V):</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedNode.state.offsetV ?? 0} V</span>
              </div>
              <input
                type="range" min={-10} max={10} step={0.1}
                value={selectedNode.state.offsetV ?? 0}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, offsetV: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
            </div>
          )}

          {/* CRO OSCILLOSCOPE CONTROLS */}
          {selectedNode.type === 'CRO_SCOPE' && (
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid #38bdf855', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>📺 CRO — Cathode Ray Oscilloscope</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>V/div:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedNode.state.voltsPerDiv ?? 1} V/div</span>
              </div>
              <input
                type="range" min={0.1} max={10} step={0.1}
                value={selectedNode.state.voltsPerDiv ?? 1}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, voltsPerDiv: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Time/div (ms):</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{selectedNode.state.timePerDiv ?? 1} ms/div</span>
              </div>
              <input
                type="range" min={0.1} max={100} step={0.1}
                value={selectedNode.state.timePerDiv ?? 1}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, timePerDiv: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                CH1: <strong style={{ color: '#38bdf8' }}>{selectedNode.state.internalState?.ch1 === 1 ? '5.0V (HIGH)' : '0.0V (LOW)'}</strong>{'  '}
                CH2: <strong style={{ color: '#10b981' }}>{selectedNode.state.internalState?.ch2 === 1 ? '5.0V (HIGH)' : '0.0V (LOW)'}</strong>
              </div>
              <button
                onClick={() => onOpenOscilloscopeModal?.(selectedNode.id)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '6px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                }}
              >
                📺 Open Full Front Panel Instrument
              </button>
            </div>
          )}

          {/* DSO OSCILLOSCOPE CONTROLS */}
          {selectedNode.type === 'DSO_SCOPE' && (
            <div style={{ background: 'rgba(30,41,59,0.5)', padding: '10px', borderRadius: '8px', border: '1px solid #a78bfa55', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a78bfa' }}>📡 DSO — Digital Storage Oscilloscope</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>V/div:</span>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{selectedNode.state.voltsPerDiv ?? 1} V/div</span>
              </div>
              <input
                type="range" min={0.1} max={10} step={0.1}
                value={selectedNode.state.voltsPerDiv ?? 1}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, voltsPerDiv: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Time/div (ms):</span>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{selectedNode.state.timePerDiv ?? 1} ms/div</span>
              </div>
              <input
                type="range" min={0.1} max={100} step={0.1}
                value={selectedNode.state.timePerDiv ?? 1}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, timePerDiv: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Trigger Level (V):</span>
                <span style={{ color: '#a78bfa', fontWeight: 700 }}>{selectedNode.state.triggerLevel ?? 2.5} V</span>
              </div>
              <input
                type="range" min={0} max={5} step={0.1}
                value={selectedNode.state.triggerLevel ?? 2.5}
                onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, triggerLevel: Number(e.target.value) } })}
                style={{ width: '100%', accentColor: '#a78bfa', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flex: 1 }}>FFT Analysis Mode</label>
                <input
                  type="checkbox"
                  checked={!!selectedNode.state.fftEnabled}
                  onChange={(e) => onUpdateNode({ ...selectedNode, state: { ...selectedNode.state, fftEnabled: e.target.checked } })}
                  style={{ accentColor: '#a78bfa', width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                CH1: <strong style={{ color: '#38bdf8' }}>{selectedNode.state.internalState?.ch1 === 1 ? '5.0V' : '0.0V'}</strong>{'  '}
                CH2: <strong style={{ color: '#f59e0b' }}>{selectedNode.state.internalState?.ch2 === 1 ? '5.0V' : '0.0V'}</strong>{'  '}
                Trigger: <strong style={{ color: selectedNode.state.internalState?.triggered ? '#10b981' : '#64748b' }}>{selectedNode.state.internalState?.triggered ? 'ARMED ✓' : 'WAITING'}</strong>
              </div>
              <button
                onClick={() => onOpenOscilloscopeModal?.(selectedNode.id)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '6px',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                }}
              >
                📡 Open Full Front Panel Instrument
              </button>
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
