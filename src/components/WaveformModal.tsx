import React, { useState, useEffect } from 'react';
import type { CircuitNode, NodeType } from '../types/logic';
import { generateAmplifierWaveform, AMPLIFIER_SPECS, type WaveformPoint } from '../engine/AmplifierEngine';
import { Activity, X, Sliders, Play, Pause, BarChart2 } from 'lucide-react';

interface WaveformModalProps {
  nodes: CircuitNode[];
  selectedNodeId: string | null;
  onClose: () => void;
}

export const WaveformModal: React.FC<WaveformModalProps> = ({ nodes, onClose }) => {
  const [activeTab, setActiveTab] = useState<'amplifier' | 'oscilloscope'>('amplifier');

  // Amplifier Studio States
  const [selectedAmpType, setSelectedAmpType] = useState<string>('AMP_CLASS_A');
  const [gain, setGain] = useState<number>(1.8);
  const [freqHz, setFreqHz] = useState<number>(2);
  const [isLiveAnim, setIsLiveAnim] = useState<boolean>(true);
  const [animOffset, setAnimOffset] = useState<number>(0);

  // Live Sine Wave Animation Loop
  useEffect(() => {
    if (!isLiveAnim) return;

    const timer = setInterval(() => {
      setAnimOffset((prev) => (prev + 15) % 1000);
    }, 40);

    return () => clearInterval(timer);
  }, [isLiveAnim]);

  const currentSpecs = AMPLIFIER_SPECS[selectedAmpType] || AMPLIFIER_SPECS['AMP_CLASS_A'];
  const wavePoints: WaveformPoint[] = generateAmplifierWaveform(selectedAmpType as NodeType, 180, freqHz, gain, animOffset);

  // Helper to map (time, vVal) to SVG canvas coordinates
  const width = 540;
  const height = 220;
  const padding = 30;

  const mapPointToSvg = (p: WaveformPoint, key: 'vIn' | 'vOut' | 'pwmVal') => {
    const val = p[key] ?? 0;
    const x = padding + ((p.time % (2000 / freqHz)) / (2000 / freqHz)) * (width - 2 * padding);
    const y = height / 2 - (val / (gain * 1.5)) * (height / 2 - padding);
    return { x, y };
  };

  // Build SVG path strings
  const buildSvgPath = (key: 'vIn' | 'vOut' | 'pwmVal') => {
    return wavePoints
      .map((p, idx) => {
        const { x, y } = mapPointToSvg(p, key);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
              <Activity size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Real-Time Waveform & Power Amplifier Studio
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Sine wave input vs output analysis & Oscilloscope waveform performance
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('amplifier')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'amplifier' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'amplifier' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={16} /> Power Amplifier Studio (Class A, B, AB, C, D)
          </button>

          <button
            onClick={() => setActiveTab('oscilloscope')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'oscilloscope' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'oscilloscope' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Activity size={16} /> Oscilloscope / Logic Analyzer
          </button>
        </div>

        {/* TAB 1: POWER AMPLIFIER COMPARISON STUDIO */}
        {activeTab === 'amplifier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
            {/* Amplifier Class Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {Object.values(AMPLIFIER_SPECS).map((spec: any) => (
                <button
                  key={spec.type}
                  onClick={() => setSelectedAmpType(spec.type)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: selectedAmpType === spec.type ? 700 : 500,
                    border: `1px solid ${selectedAmpType === spec.type ? spec.color : 'var(--border-color)'}`,
                    background: selectedAmpType === spec.type ? `${spec.color}25` : 'var(--bg-card)',
                    color: selectedAmpType === spec.type ? spec.color : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {spec.name}
                </button>
              ))}
            </div>

            {/* Oscilloscope Screen SVG Graph */}
            <div style={{ borderRadius: '12px', background: '#020617', border: '1px solid var(--border-color)', padding: '12px', position: 'relative' }}>
              {/* Graph Legend Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>── Input Sine Wave (Vin)</span>
                  <span style={{ color: currentSpecs.color, fontWeight: 700 }}>━━ Output Wave (Vout)</span>
                  {selectedAmpType === 'AMP_CLASS_D' && (
                    <span style={{ color: '#8b5cf6', fontWeight: 600 }}>┄ High-Freq PWM</span>
                  )}
                </div>

                <button
                  onClick={() => setIsLiveAnim(!isLiveAnim)}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {isLiveAnim ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isLiveAnim ? 'Freeze Wave' : 'Live Sweep'}</span>
                </button>
              </div>

              {/* Oscilloscope Grid Canvas */}
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Background Oscilloscope Grid Lines */}
                <g stroke="#1e293b" strokeWidth={1} strokeDasharray="4 4">
                  <line x1={padding} y1={padding} x2={width - padding} y2={padding} />
                  <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#334155" strokeWidth={1.5} strokeDasharray="none" />
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />

                  {Array.from({ length: 9 }).map((_, i) => {
                    const vx = padding + (i * (width - 2 * padding)) / 8;
                    return <line key={i} x1={vx} y1={padding} x2={vx} y2={height - padding} />;
                  })}
                </g>

                {/* Class D PWM switching pulses */}
                {selectedAmpType === 'AMP_CLASS_D' && (
                  <path d={buildSvgPath('pwmVal')} fill="none" stroke="#8b5cf6" strokeWidth={1.2} opacity={0.6} />
                )}

                {/* Input Sine Wave Path (Cyan) */}
                <path d={buildSvgPath('vIn')} fill="none" stroke="var(--accent-cyan)" strokeWidth={2} strokeDasharray="6 4" opacity={0.8} />

                {/* Output Wave Path (Amplifier Specific Color) */}
                <path d={buildSvgPath('vOut')} fill="none" stroke={currentSpecs.color} strokeWidth={3.2} strokeLinecap="round" />
              </svg>
            </div>

            {/* Controls & Real-Time Specifications Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Controls Panel */}
              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={16} color="var(--accent-cyan)" /> Signal Parameters
                </div>

                {/* Gain Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Voltage Gain (Av):</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{gain}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={4.0}
                    step={0.1}
                    value={gain}
                    onChange={(e) => setGain(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>

                {/* Frequency Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Input Frequency (Fin):</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{freqHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={freqHz}
                    onChange={(e) => setFreqHz(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Performance Comparison Specifications */}
              <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentSpecs.color }}>
                  {currentSpecs.name} Performance Metrics
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Conduction Angle (θ):</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentSpecs.conductionAngle}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Theoretical Efficiency (η):</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{currentSpecs.typicalEfficiency}</span>
                </div>

                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '4px' }}>
                  {currentSpecs.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL CIRCUIT OSCILLOSCOPE */}
        {activeTab === 'oscilloscope' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
            <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              ⚡ <strong style={{ color: 'var(--text-primary)' }}>Live Probes:</strong> Tracking signal levels over time for all active components on canvas.
            </div>

            {/* Oscilloscope Probe Channels */}
            <div style={{ borderRadius: '12px', background: '#020617', border: '1px solid var(--border-color)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {nodes
                .filter((n) => n.type !== 'TEXT_NOTE')
                .slice(0, 4)
                .map((node, channelIdx) => {
                  const colors = ['#38bdf8', '#10b981', '#f59e0b', '#f43f5e'];
                  const channelColor = colors[channelIdx % colors.length];
                  const activeSignal = node.outputs[0]?.value ?? node.inputs[0]?.value ?? 0;

                  return (
                    <div key={node.id} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78rem' }}>
                        <span style={{ color: channelColor, fontWeight: 700 }}>
                          CH{channelIdx + 1}: {node.label} ({node.type})
                        </span>
                        <span style={{ color: activeSignal === 1 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {activeSignal === 1 ? 'HIGH (1)' : 'LOW (0)'}
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '30px', background: '#0f172a', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                        <svg width="100%" height="30">
                          <line
                            x1="0"
                            y1={activeSignal === 1 ? 8 : 22}
                            x2="100%"
                            y2={activeSignal === 1 ? 8 : 22}
                            stroke={channelColor}
                            strokeWidth={2.5}
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
