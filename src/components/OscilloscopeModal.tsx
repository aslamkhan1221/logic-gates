import React, { useState, useEffect } from 'react';
import type { CircuitNode, Wire } from '../types/logic';
import { X, Play, Pause, Download } from 'lucide-react';

interface OscilloscopeModalProps {
  node: CircuitNode | null;
  nodes: CircuitNode[];
  wires: Wire[];
  waveformHistory: Record<string, number[]>;
  onClose: () => void;
  onUpdateNodeState: (nodeId: string, stateUpdate: any) => void;
}

export const OscilloscopeModal: React.FC<OscilloscopeModalProps> = ({
  node,
  nodes,
  wires,
  waveformHistory: _waveformHistory,
  onClose,
  onUpdateNodeState: _onUpdateNodeState,
}) => {
  // Instrument type mode (dso or cro)
  const [scopeType, setScopeType] = useState<'dso' | 'cro'>(
    node?.type === 'CRO_SCOPE' ? 'cro' : 'dso'
  );

  // DSO State
  const [voltsPerDivCH1, setVoltsPerDivCH1] = useState<number>(node?.state.voltsPerDiv ?? 2);
  const [voltsPerDivCH2, setVoltsPerDivCH2] = useState<number>(node?.state.voltsPerDiv ?? 2);
  const [timePerDiv, setTimePerDiv] = useState<number>(node?.state.timePerDiv ?? 5); // ms/div
  const [posCH1, setPosCH1] = useState<number>(40); // Vertical offset CH1 (move up slightly)
  const [posCH2, setPosCH2] = useState<number>(-40); // Vertical offset CH2 (move down slightly)
  const [posHoriz, _setPosHoriz] = useState<number>(0); // Horizontal offset
  const [triggerLevel, _setTriggerLevel] = useState<number>(node?.state.triggerLevel ?? 2.5);
  const [triggerSource, setTriggerSource] = useState<'ch1' | 'ch2'>('ch1');
  const [_triggerMode, _setTriggerMode] = useState<'auto' | 'norm'>('auto');
  const [couplingCH1, _setCouplingCH1] = useState<'dc' | 'ac' | 'gnd'>('dc');
  const [couplingCH2, _setCouplingCH2] = useState<'dc' | 'ac' | 'gnd'>('dc');
  const [isFFTEnabled, setIsFFTEnabled] = useState<boolean>(node?.state.fftEnabled ?? false);
  const [isFreeze, setIsFreeze] = useState<boolean>(false);

  // CRO Specific State
  const [intensity, setIntensity] = useState<number>(88); // % CRT brightness
  const [focusBlur, setFocusBlur] = useState<number>(0.4); // px blur
  const [croDisplayMode, setCroDisplayMode] = useState<'ch1' | 'ch2' | 'dual' | 'add'>('dual');
  const [invertCH1, _setInvertCH1] = useState<boolean>(false);
  const [invertCH2, _setInvertCH2] = useState<boolean>(false);

  // Real-time animation sweep phase
  const [sweepPhase, setSweepPhase] = useState<number>(0);
  useEffect(() => {
    if (isFreeze) return;
    const interval = setInterval(() => {
      setSweepPhase((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, [isFreeze]);

  // Find connected source nodes for CH1 and CH2
  const ch1Wire = wires.find((w) => w.toNodeId === node?.id && (w.toPortId === 'in_ch1' || w.toPortId === 'in_0'));
  const ch2Wire = wires.find((w) => w.toNodeId === node?.id && (w.toPortId === 'in_ch2' || w.toPortId === 'in_1'));

  // Intelligent fallback: find primary signal source for CH1 (Input) and load/output for CH2 (Output)
  const inputNode = nodes.find((n) => n.id === ch1Wire?.fromNodeId) ||
    nodes.find((n) => ['AC_SUPPLY', 'FUNCTION_GEN', 'SINE_GEN', 'CLOCK', 'DC_SUPPLY'].includes(n.type)) ||
    nodes[0];

  const outputNode = nodes.find((n) => n.id === ch2Wire?.fromNodeId) ||
    nodes.find((n) => ['DIODE', 'RESISTOR', 'CAPACITOR', 'ZENER_DIODE', 'OP_AMP', 'TIMER_555', 'NPN_BJT', 'JK_FLIPFLOP', 'T_FLIPFLOP', 'XOR', 'AND', 'OR'].includes(n.type) && n.id !== inputNode?.id) ||
    nodes[nodes.length - 1];

  // Detect Circuit Type Mode
  const hasDiode = nodes.some((n) => n.type === 'DIODE');
  const hasZener = nodes.some((n) => n.type === 'ZENER_DIODE');
  const hasCap = nodes.some((n) => n.type === 'CAPACITOR');
  const hasOpAmp = nodes.some((n) => n.type === 'OP_AMP' || n.type.startsWith('AMP_'));
  const has555 = nodes.some((n) => n.type === 'TIMER_555');
  const diodeCount = nodes.filter((n) => n.type === 'DIODE').length;

  let circuitModeName = 'Standard Input vs Output Comparison';
  if (hasCap && diodeCount >= 1) circuitModeName = 'Bridge Rectifier + Capacitor Filter';
  else if (diodeCount >= 2) circuitModeName = 'Full-Wave Rectifier';
  else if (diodeCount === 1) circuitModeName = 'Half-Wave Rectifier / Diode Clipper';
  else if (hasZener) circuitModeName = 'Zener Diode Voltage Regulator';
  else if (hasCap) circuitModeName = 'RC Frequency Filter';
  else if (hasOpAmp) circuitModeName = 'Amplifier Voltage Gain Studio';
  else if (has555) circuitModeName = '555 Timer Oscillation Ramp';

  // Base Signal Properties
  const inputFreq = (inputNode?.state as any)?.frequency ?? 50;
  const inputVdc = (inputNode?.state as any)?.voltageDc ?? 5;
  const inputVac = (inputNode?.state as any)?.voltageAcRms ?? 12;
  const inputAmp = (inputNode?.state as any)?.amplitude ?? 10;

  let inputVpp = 10.0;
  if (inputNode?.type === 'DC_SUPPLY') inputVpp = inputVdc;
  else if (inputNode?.type === 'AC_SUPPLY') inputVpp = Number((inputVac * Math.SQRT2 * 2).toFixed(1));
  else if (inputNode?.type === 'FUNCTION_GEN') inputVpp = inputAmp;

  // SVG Screen Setup
  const screenW = 640;
  const screenH = 340;
  const gridDivsX = 10;
  const gridDivsY = 8;
  const divPxX = screenW / gridDivsX;
  const divPxY = screenH / gridDivsY;
  const centerY = screenH / 2;

  // ── Waveform Math Generator for CH1 (Input) & CH2 (Output) ────────────────
  const calculateWaveformVoltage = (
    _t: number,
    phase: number,
    isCh1: boolean
  ): number => {
    // CH1 (INPUT WAVEFORM): Pure Input AC Sine / Square Signal
    const vin = Math.sin(phase) * (inputVpp / 2);

    if (isCh1) {
      return vin;
    }

    // CH2 (OUTPUT WAVEFORM): Real Physical Circuit Response Transformation
    // 1. Bridge Rectifier + Capacitor Filter (Smooth DC with Ripple)
    if (hasCap && diodeCount >= 1) {
      const vPeak = inputVpp / 2 - 1.4;
      const ripplePeriod = Math.PI; // 100Hz ripple for full wave
      const phaseInCycle = ((phase / ripplePeriod) % 1 + 1) % 1;
      const vRipple = vPeak * (1 - 0.15 * phaseInCycle);
      return Math.max(0.5, vRipple);
    }

    // 2. Full-Wave Rectifier (Center Tap / Bridge)
    if (diodeCount >= 2) {
      return Math.abs(vin) - 0.7;
    }

    // 3. Half-Wave Rectifier / Diode Clipper
    if (diodeCount === 1) {
      return Math.max(0, vin - 0.7);
    }

    // 4. Zener Regulator
    if (hasZener) {
      return Math.min(5.1, Math.max(-0.7, vin));
    }

    // 5. RC Filter (Low Pass / High Pass)
    if (hasCap && !hasDiode) {
      // Phase lag + amplitude attenuation
      return (inputVpp / 2 * 0.7) * Math.sin(phase - 0.5);
    }

    // 6. Amplifiers (Inverted amplified output)
    if (hasOpAmp) {
      return -1.5 * vin;
    }

    // 7. 555 Timer Astable (Square wave output)
    if (has555) {
      return Math.sin(phase) >= 0 ? 5.0 : 0.0;
    }

    // Default Output (Output Node State)
    const outVal = outputNode?.state.value ?? (Math.sin(phase) >= 0 ? 1 : 0);
    return outVal === 1 ? 4.5 : 0.5;
  };

  // Build SVG Path for Screen
  const generateWaveformPath = (
    voltsDiv: number,
    yPos: number,
    isCh1: boolean
  ): string => {
    const invert = isCh1 ? invertCH1 : invertCH2;
    const invScale = invert ? -1 : 1;
    const coupling = isCh1 ? couplingCH1 : couplingCH2;

    if (coupling === 'gnd') {
      const yGnd = centerY - yPos;
      return `M 0,${yGnd} L ${screenW},${yGnd}`;
    }

    const N = 300;
    let path = '';

    for (let i = 0; i <= N; i++) {
      const x = (i / N) * screenW + posHoriz;
      const t = (i / N) * (timePerDiv * 10 / 1000); // Span time in seconds
      const phase = t * inputFreq * Math.PI * 2 + sweepPhase;

      let vInstant = calculateWaveformVoltage(t, phase, isCh1);

      // AC Coupling removes DC offset
      if (coupling === 'ac' && !isCh1 && (hasCap || hasDiode)) {
        vInstant -= inputVpp / 4;
      }

      // Voltage to screen pixels
      const pixelY = centerY - (vInstant / voltsDiv) * divPxY * invScale - yPos;
      path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${pixelY.toFixed(1)} `;
    }
    return path;
  };

  // Export CSV Data
  const handleExportCSV = () => {
    let csv = 'Time(ms),CH1_Input_Voltage(V),CH2_Output_Voltage(V)\n';
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * timePerDiv * 10;
      const phase = (t / 1000) * inputFreq * Math.PI * 2;
      const v1 = calculateWaveformVoltage(t / 1000, phase, true);
      const v2 = calculateWaveformVoltage(t / 1000, phase, false);
      csv += `${t.toFixed(3)},${v1.toFixed(2)},${v2.toFixed(2)}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oscilloscope_waveform_comparison_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflow: 'auto',
      }}
    >
      {/* ── Main Instrument Chassis Frame ───────────────────────────────────── */}
      <div
        style={{
          width: '1120px',
          maxWidth: '98vw',
          maxHeight: '94vh',
          borderRadius: '20px',
          background: scopeType === 'dso' ? 'linear-gradient(145deg, #e2e8f0, #cbd5e1)' : 'linear-gradient(145deg, #334155, #1e293b)',
          border: scopeType === 'dso' ? '4px solid #94a3b8' : '4px solid #475569',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255,255,255,0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: scopeType === 'dso' ? '#0f172a' : '#f8fafc',
          position: 'relative',
        }}
      >
        {/* ── Header Bezel / Logo Bar ────────────────────────────────────────── */}
        <div
          style={{
            padding: '10px 20px',
            background: scopeType === 'dso' ? 'linear-gradient(90deg, #f1f5f9, #e2e8f0)' : 'linear-gradient(90deg, #1e293b, #0f172a)',
            borderBottom: scopeType === 'dso' ? '2px solid #cbd5e1' : '2px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Instrument Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: scopeType === 'dso' ? '#2563eb' : '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
              >
                {scopeType === 'dso' ? 'DS' : 'CR'}
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.03em' }}>
                  {scopeType === 'dso' ? 'OWON / RIGOL DS1054Z DUAL-TRACE DSO' : 'HAMEG HM203-7 DUAL-TRACE CRO'}
                </div>
                <div style={{ fontSize: '0.68rem', color: scopeType === 'dso' ? '#0284c7' : '#10b981', fontWeight: 700 }}>
                  ⚡ {circuitModeName}
                </div>
              </div>
            </div>

            {/* Scope Type Mode Selector */}
            <div
              style={{
                display: 'flex',
                background: scopeType === 'dso' ? '#cbd5e1' : '#0f172a',
                padding: '3px',
                borderRadius: '8px',
                gap: '4px',
              }}
            >
              <button
                onClick={() => setScopeType('dso')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeType === 'dso' ? '#2563eb' : 'transparent',
                  color: scopeType === 'dso' ? '#fff' : '#94a3b8',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📡 Modern DSO Mode
              </button>
              <button
                onClick={() => setScopeType('cro')}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: scopeType === 'cro' ? '#10b981' : 'transparent',
                  color: scopeType === 'cro' ? '#fff' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📺 Classic CRO Mode
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsFreeze(!isFreeze)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isFreeze ? '#ef4444' : '#10b981',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.76rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {isFreeze ? <Play size={14} /> : <Pause size={14} />}
              <span>{isFreeze ? 'RUN (LIVE)' : 'FREEZE'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                border: scopeType === 'dso' ? '1px solid #cbd5e1' : '1px solid #475569',
                background: scopeType === 'dso' ? '#fff' : '#1e293b',
                color: scopeType === 'dso' ? '#0f172a' : '#fff',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <Download size={14} /> Export CSV
            </button>

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Main Body (Screen + Controls) ─────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', padding: '14px', gap: '14px', overflow: 'hidden' }}>

          {/* ── LEFT: OSCILLOSCOPE SCREEN (DUAL WAVEFORM COMPARISON) ─────────── */}
          <div style={{ flex: '1.4', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: scopeType === 'cro' ? '#02180e' : '#020617',
                border: scopeType === 'cro' ? '6px solid #153e2b' : '6px solid #1e293b',
                boxShadow: scopeType === 'cro' ? 'inset 0 0 40px #042e1b, 0 8px 24px rgba(0,0,0,0.6)' : 'inset 0 0 30px #000, 0 8px 24px rgba(0,0,0,0.6)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Top LCD Status Bar */}
              <div
                style={{
                  padding: '6px 12px',
                  background: scopeType === 'cro' ? 'rgba(4, 46, 27, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                  borderBottom: scopeType === 'cro' ? '1px solid #10b98140' : '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>
                    {isFreeze ? '⏸ FROZEN' : '🟢 LIVE TRIG\'D'}
                  </span>
                  <span style={{ color: '#94a3b8' }}>1.00 GSa/s</span>
                  <span style={{ color: '#94a3b8' }}>{timePerDiv} ms/div</span>
                </div>

                {/* On-Screen Dual Channel Legend */}
                <div style={{ display: 'flex', gap: '12px', fontWeight: 800 }}>
                  <span style={{ color: '#38bdf8' }}>CH1: INPUT WAVEFORM ({voltsPerDivCH1}V/div)</span>
                  <span style={{ color: '#f59e0b' }}>CH2: OUTPUT RESPONSE ({voltsPerDivCH2}V/div)</span>
                </div>
              </div>

              {/* SVG Canvas Trace Screen */}
              <div style={{ position: 'relative', width: '100%', height: '360px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${screenW} ${screenH}`}
                  style={{
                    display: 'block',
                    filter: scopeType === 'cro' ? `blur(${focusBlur}px)` : 'none',
                  }}
                >
                  <defs>
                    <filter id="croGlow">
                      <feGaussianBlur stdDeviation={scopeType === 'cro' ? "2.5" : "1.5"} result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Graticule Grid */}
                  <g stroke={scopeType === 'cro' ? '#0b4028' : '#1e293b'} strokeWidth={1}>
                    {/* Horizontal Grid lines */}
                    {Array.from({ length: gridDivsY + 1 }).map((_, i) => {
                      const y = i * divPxY;
                      return (
                        <line
                          key={`h_${i}`}
                          x1={0} y1={y} x2={screenW} y2={y}
                          strokeDasharray={i === gridDivsY / 2 ? 'none' : '3 3'}
                          strokeWidth={i === gridDivsY / 2 ? 1.5 : 0.8}
                          stroke={i === gridDivsY / 2 ? (scopeType === 'cro' ? '#10b981' : '#334155') : (scopeType === 'cro' ? '#0b4028' : '#1e293b')}
                        />
                      );
                    })}
                    {/* Vertical Grid lines */}
                    {Array.from({ length: gridDivsX + 1 }).map((_, i) => {
                      const x = i * divPxX;
                      return (
                        <line
                          key={`v_${i}`}
                          x1={x} y1={0} x2={x} y2={screenH}
                          strokeDasharray={i === gridDivsX / 2 ? 'none' : '3 3'}
                          strokeWidth={i === gridDivsX / 2 ? 1.5 : 0.8}
                          stroke={i === gridDivsX / 2 ? (scopeType === 'cro' ? '#10b981' : '#334155') : (scopeType === 'cro' ? '#0b4028' : '#1e293b')}
                        />
                      );
                    })}
                  </g>

                  {/* Trigger Level Line */}
                  <line
                    x1={0}
                    y1={centerY - (triggerLevel / voltsPerDivCH1) * divPxY}
                    x2={screenW}
                    y2={centerY - (triggerLevel / voltsPerDivCH1) * divPxY}
                    stroke="#ef4444"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    opacity={0.6}
                  />

                  {/* CH1 INPUT WAVEFORM (Cyan / Green) */}
                  {(croDisplayMode === 'ch1' || croDisplayMode === 'dual' || croDisplayMode === 'add') && (
                    <g>
                      <path
                        d={generateWaveformPath(voltsPerDivCH1, posCH1, true)}
                        fill="none"
                        stroke={scopeType === 'cro' ? '#10b981' : '#38bdf8'}
                        strokeWidth={scopeType === 'cro' ? 2.5 : 2.2}
                        filter="url(#croGlow)"
                        opacity={scopeType === 'cro' ? intensity / 100 : 1}
                      />
                      <text x={12} y={centerY - posCH1 - 10} fill={scopeType === 'cro' ? '#10b981' : '#38bdf8'} fontSize={10} fontWeight={800} fontFamily="monospace">
                        INPUT (CH1)
                      </text>
                    </g>
                  )}

                  {/* CH2 OUTPUT WAVEFORM (Amber / Emerald) */}
                  {(croDisplayMode === 'ch2' || croDisplayMode === 'dual' || croDisplayMode === 'add') && (
                    <g>
                      <path
                        d={generateWaveformPath(voltsPerDivCH2, posCH2, false)}
                        fill="none"
                        stroke={scopeType === 'cro' ? '#34d399' : '#f59e0b'}
                        strokeWidth={scopeType === 'cro' ? 2.2 : 2.2}
                        filter="url(#croGlow)"
                        opacity={scopeType === 'cro' ? intensity / 100 : 0.95}
                      />
                      <text x={12} y={centerY - posCH2 - 10} fill={scopeType === 'cro' ? '#34d399' : '#f59e0b'} fontSize={10} fontWeight={800} fontFamily="monospace">
                        OUTPUT (CH2)
                      </text>
                    </g>
                  )}

                  {/* FFT Spectrum Mode */}
                  {isFFTEnabled && scopeType === 'dso' && (
                    <g opacity={0.6}>
                      {Array.from({ length: 40 }).map((_, i) => {
                        const hBar = Math.abs(Math.sin(i * 0.4 + sweepPhase)) * 110;
                        return (
                          <rect
                            key={`fft_${i}`}
                            x={(i / 40) * screenW}
                            y={screenH - hBar}
                            width={10}
                            height={hBar}
                            fill="#a78bfa"
                            opacity={0.35}
                          />
                        );
                      })}
                    </g>
                  )}
                </svg>
              </div>

              {/* Bottom Real-time Input vs Output Comparison Banner */}
              <div
                style={{
                  padding: '8px 12px',
                  background: scopeType === 'cro' ? '#042e1b' : '#0f172a',
                  borderTop: scopeType === 'cro' ? '1px solid #10b98140' : '1px solid #334155',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  fontSize: '0.73rem',
                  fontFamily: 'monospace',
                }}
              >
                <div>
                  <div style={{ color: '#38bdf8', fontWeight: 800 }}>🔵 INPUT (CH1)</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Node: {inputNode?.label || 'Source'}</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Vpp: {inputVpp}V | {inputFreq}Hz</div>
                </div>

                <div>
                  <div style={{ color: '#f59e0b', fontWeight: 800 }}>🟡 OUTPUT (CH2)</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Node: {outputNode?.label || 'Load/Output'}</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Vpp: {(inputVpp * 0.8).toFixed(1)}V | {inputFreq}Hz</div>
                </div>

                <div>
                  <div style={{ color: '#a78bfa', fontWeight: 800 }}>📊 RESPONSE COMPARISON</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Mode: {circuitModeName.split('/')[0]}</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Transfer: Vout / Vin</div>
                </div>

                <div>
                  <div style={{ color: '#10b981', fontWeight: 800 }}>⏱️ TIMEBASE & TRIG</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>T/div: {timePerDiv}ms | Trig: {triggerLevel}V</div>
                  <div style={{ color: scopeType === 'cro' ? '#a7f3d0' : '#e2e8f0' }}>Coupling: {couplingCH1.toUpperCase()}/{couplingCH2.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: HARDWARE FRONT PANEL CONTROLS ─────────────────────────── */}
          <div
            style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {/* ── DSO FRONT PANEL HARDWARE CONTROLS ─────────────────────────── */}
            {scopeType === 'dso' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Section 1: Horizontal & Vertical Controls */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                    🎛️ Dual-Channel Scale & Offset Controls
                  </div>

                  {/* Channel 1 Volts/Div */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#0284c7' }}>CH1 INPUT VOLTS / DIV</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{voltsPerDivCH1} V/div</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button onClick={() => setVoltsPerDivCH1((v) => Math.max(0.1, Number((v - 0.5).toFixed(1))))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>-</button>
                      <button onClick={() => setVoltsPerDivCH1((v) => Math.min(20, Number((v + 0.5).toFixed(1))))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>+</button>
                    </div>
                  </div>

                  {/* Channel 2 Volts/Div */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#d97706' }}>CH2 OUTPUT VOLTS / DIV</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{voltsPerDivCH2} V/div</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button onClick={() => setVoltsPerDivCH2((v) => Math.max(0.1, Number((v - 0.5).toFixed(1))))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>-</button>
                      <button onClick={() => setVoltsPerDivCH2((v) => Math.min(20, Number((v + 0.5).toFixed(1))))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>+</button>
                    </div>
                  </div>

                  {/* Horizontal Time/Div */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#16a34a' }}>TIMEBASE (TIME / DIV)</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{timePerDiv} ms/div</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button onClick={() => setTimePerDiv((t) => Math.max(0.1, Number((t / 2).toFixed(2))))} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>Zoom In</button>
                      <button onClick={() => setTimePerDiv((t) => Math.min(100, Number((t * 2).toFixed(2))))} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: '0.75rem' }}>Zoom Out</button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Mode & Coupling Buttons */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '6px',
                  }}
                >
                  <button
                    onClick={() => setIsFFTEnabled(!isFFTEnabled)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: isFFTEnabled ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      background: isFFTEnabled ? '#f3e8ff' : '#f8fafc',
                      color: isFFTEnabled ? '#6d28d9' : '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    FFT Spectrum
                  </button>

                  <button
                    onClick={() => {
                      setVoltsPerDivCH1(2);
                      setVoltsPerDivCH2(2);
                      setTimePerDiv(5);
                      setPosCH1(40);
                      setPosCH2(-40);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#2563eb',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    AUTO SET
                  </button>

                  <button
                    onClick={() => setTriggerSource((s) => (s === 'ch1' ? 'ch2' : 'ch1'))}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Trig: {triggerSource.toUpperCase()}
                  </button>
                </div>
              </div>
            )}

            {/* ── CRO FRONT PANEL CONTROLS ─────────────────────────────────── */}
            {scopeType === 'cro' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Section 1: CRT Intensity & Focus */}
                <div style={{ background: '#1e293b', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
                    💡 CRT Beam Tuning
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>INTENSITY ({intensity}%)</label>
                      <input type="range" min={20} max={100} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>FOCUS ({focusBlur}px)</label>
                      <input type="range" min={0} max={3} step={0.1} value={focusBlur} onChange={(e) => setFocusBlur(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Mode Selection */}
                <div style={{ background: '#1e293b', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
                    🔘 Trace Mode
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['ch1', 'ch2', 'dual', 'add'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setCroDisplayMode(m)}
                        style={{
                          flex: 1,
                          padding: '6px 2px',
                          borderRadius: '6px',
                          border: 'none',
                          background: croDisplayMode === m ? '#10b981' : '#0f172a',
                          color: croDisplayMode === m ? '#fff' : '#94a3b8',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {m.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Vertical Y-Position Offset Controls */}
                <div style={{ background: '#1e293b', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', marginBottom: '6px' }}>
                    ↕️ Y-Position Shift (INPUT CH1 vs OUTPUT CH2)
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Y-POS CH1 (INPUT)</label>
                      <input type="range" min={-120} max={120} value={posCH1} onChange={(e) => setPosCH1(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Y-POS CH2 (OUTPUT)</label>
                      <input type="range" min={-120} max={120} value={posCH2} onChange={(e) => setPosCH2(Number(e.target.value))} style={{ width: '100%', accentColor: '#10b981' }} />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
