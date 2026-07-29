import React, { useState, useEffect } from 'react';
import type { CircuitNode, Wire } from '../types/logic';
import { Activity, Play, Pause, ChevronUp, ChevronDown, ShieldAlert } from 'lucide-react';

interface RealtimeHUDProps {
  nodes: CircuitNode[];
  wires: Wire[];
  selectedNodeId: string | null;
  waveformHistory?: Record<string, number[]>;
}

export const RealtimeCharacteristicsHUD: React.FC<RealtimeHUDProps> = ({ nodes, selectedNodeId }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'oscilloscope' | 'characteristics'>('oscilloscope');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [sweepOffset, setSweepOffset] = useState<number>(0);

  // Live real-time sweep animation loop
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setSweepOffset((prev) => (prev + 4) % 400);
    }, 40);
    return () => clearInterval(interval);
  }, [isLive]);

  // Filter components for measurement
  const printableNodes = nodes.filter((n) => n.type !== 'TEXT_NOTE');
  const racingNodes = nodes.filter((n) => n.state.isRacing);

  // SVG Charting Dimensions
  const chartWidth = 720;
  const chartHeight = 160;
  const padding = 20;

  // Calculate real-time characteristic specs for any node
  const calculateNodeSpecs = (node: CircuitNode) => {
    const isRacing = !!node.state.isRacing;
    const isHigh = node.outputs[0]?.value === 1 || node.inputs[0]?.value === 1 || node.state.value === 1;
    const voltageV = isRacing ? 2.5 : isHigh ? 5.0 : 0.0;
    const resistance = node.state.resistance ?? 1000;
    const currentMa = Number((voltageV / (resistance / 1000)).toFixed(2));
    const powerMw = Number((voltageV * currentMa).toFixed(2));
    const freqHz = isRacing ? 500000 : node.type === 'CLOCK' ? node.state.frequency ?? 2 : isHigh ? 1 : 0;
    const dutyCycle = isRacing ? 50 : isHigh ? 100 : 0;

    return {
      voltageV,
      currentMa,
      powerMw,
      freqHz,
      dutyCycle,
      isRacing,
      statusStr: isRacing
        ? '⚡ RACE-AROUND (Oscillating)'
        : isHigh
        ? 'HIGH (5.0V)'
        : 'LOW (0.0V)',
    };
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '270px',
        right: '340px',
        zIndex: 50,
        borderRadius: '14px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(15, 23, 42, 0.92)',
      }}
    >
      {/* Header Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
          background: 'rgba(30, 41, 59, 0.7)',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Activity size={16} /> Real-Time Circuit Waveform & Lab Characteristics
          </div>

          {racingNodes.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #ef4444',
                animation: 'pulse 1s infinite',
              }}
            >
              <ShieldAlert size={14} />
              <span>RACE AROUND DETECTED ({racingNodes.length} Flip-Flops)</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.6)', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setActiveTab('oscilloscope')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'oscilloscope' ? 'var(--accent-cyan)' : 'transparent',
                color: activeTab === 'oscilloscope' ? '#0f172a' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Live Oscilloscope
            </button>
            <button
              onClick={() => setActiveTab('characteristics')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'characteristics' ? 'var(--accent-cyan)' : 'transparent',
                color: activeTab === 'characteristics' ? '#0f172a' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Characteristics Table
            </button>
          </div>

          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            {isLive ? <Pause size={12} /> : <Play size={12} />}
            <span>{isLive ? 'Pause' : 'Sweep'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content Panel */}
      {isExpanded && (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
          {/* TAB 1: LIVE OSCILLOSCOPE */}
          {activeTab === 'oscilloscope' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ borderRadius: '10px', background: '#020617', border: '1px solid #1e293b', padding: '10px', position: 'relative' }}>
                {/* SVG Oscilloscope Display */}
                <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  {/* Grid Lines */}
                  <g stroke="#1e293b" strokeWidth={1} strokeDasharray="4 4">
                    <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#334155" strokeDasharray="none" />
                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} />
                    {Array.from({ length: 9 }).map((_, i) => {
                      const vx = padding + (i * (chartWidth - 2 * padding)) / 8;
                      return <line key={i} x1={vx} y1={padding} x2={vx} y2={chartHeight - padding} />;
                    })}
                  </g>

                  {/* Sweep Line */}
                  <line
                    x1={padding + (sweepOffset / 400) * (chartWidth - 2 * padding)}
                    y1={padding}
                    x2={padding + (sweepOffset / 400) * (chartWidth - 2 * padding)}
                    y2={chartHeight - padding}
                    stroke="rgba(56, 189, 248, 0.5)"
                    strokeWidth={2}
                  />

                  {/* Channel Traces */}
                  {printableNodes.slice(0, 4).map((node, chIdx) => {
                    const colors = ['#38bdf8', '#10b981', '#f59e0b', '#f43f5e'];
                    const color = colors[chIdx % colors.length];
                    const isSelected = node.id === selectedNodeId;
                    const specs = calculateNodeSpecs(node);
                    const chHeight = (chartHeight - 2 * padding) / 4;
                    const baseY = padding + chIdx * chHeight + chHeight / 2;

                    // Build Square / Racing wave path
                    const points: string[] = [];
                    const stepCount = 60;
                    for (let step = 0; step <= stepCount; step++) {
                      const px = padding + (step / stepCount) * (chartWidth - 2 * padding);
                      let isHigh = node.outputs[0]?.value === 1 || node.state.value === 1;

                      if (specs.isRacing) {
                        // High-frequency race-around toggle pattern
                        isHigh = (step + Math.floor(sweepOffset / 5)) % 2 === 0;
                      } else if (node.type === 'CLOCK') {
                        const period = 20;
                        isHigh = Math.floor((step + sweepOffset / 2) / period) % 2 === 0;
                      }

                      const py = isHigh ? baseY - chHeight * 0.35 : baseY + chHeight * 0.35;
                      points.push(`${step === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
                    }

                    return (
                      <g key={node.id}>
                        <path
                          d={points.join(' ')}
                          fill="none"
                          stroke={color}
                          strokeWidth={isSelected ? 3 : specs.isRacing ? 2.5 : 1.8}
                          opacity={specs.isRacing ? 1 : 0.85}
                        />
                        <text x={padding + 5} y={baseY - 4} fill={color} fontSize="10" fontWeight="bold">
                          CH{chIdx + 1}: {node.label} {specs.isRacing ? '⚡ RACING' : `(${specs.voltageV.toFixed(1)}V)`}
                        </text>
                      </g>
                    );
                  })}

                  {printableNodes.length === 0 && (
                    <text x={chartWidth / 2} y={chartHeight / 2} fill="#64748b" textAnchor="middle" fontSize="12">
                      Add components or flip-flops to the canvas to view real-time waveforms
                    </text>
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* TAB 2: REAL-TIME CHARACTERISTICS TABLE */}
          {activeTab === 'characteristics' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Component</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Type</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Voltage (V)</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Current (mA)</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Frequency (Hz)</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Duty Cycle</th>
                    <th style={{ textAlign: 'center', padding: '6px' }}>Power (mW)</th>
                    <th style={{ textAlign: 'right', padding: '6px' }}>Race / Operational State</th>
                  </tr>
                </thead>
                <tbody>
                  {printableNodes.map((node) => {
                    const specs = calculateNodeSpecs(node);
                    const isSelected = node.id === selectedNodeId;

                    return (
                      <tr
                        key={node.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.1)' : specs.isRacing ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '6px', fontWeight: 600 }}>{node.label}</td>
                        <td style={{ padding: '6px', color: 'var(--text-secondary)' }}>{node.type}</td>
                        <td style={{ padding: '6px', textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 600 }}>{specs.voltageV.toFixed(1)} V</td>
                        <td style={{ padding: '6px', textAlign: 'center' }}>{specs.currentMa} mA</td>
                        <td style={{ padding: '6px', textAlign: 'center' }}>{specs.freqHz > 1000 ? `${(specs.freqHz / 1000).toFixed(0)} kHz` : `${specs.freqHz} Hz`}</td>
                        <td style={{ padding: '6px', textAlign: 'center' }}>{specs.dutyCycle}%</td>
                        <td style={{ padding: '6px', textAlign: 'center', color: '#f59e0b' }}>{specs.powerMw} mW</td>
                        <td
                          style={{
                            padding: '6px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: specs.isRacing ? '#ef4444' : specs.voltageV > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)',
                          }}
                        >
                          {specs.statusStr}
                        </td>
                      </tr>
                    );
                  })}

                  {printableNodes.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No components placed on canvas. Drag components from library to simulate characteristics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
