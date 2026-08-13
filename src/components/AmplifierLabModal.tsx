import React, { useState, useEffect } from 'react';
import type { CircuitNode, NodeType } from '../types/logic';
import {
  calculatePracticalMetrics,
  generatePracticalWaveformPoints,
  calculateMsbteObservationRow,
  calculateMsbtePractical2Row,
  AMPLIFIER_LAB_SPECS,
  type PracticalAmpParams,
  type PracticalAmpMetrics,
  type WaveformPoint,
  type MsbteObservationRow,
  type MsbtePractical2Row,
} from '../engine/AmplifierEngine';
import {
  Activity,
  X,
  Play,
  Pause,
  BarChart2,
  FileText,
  Download,
  CheckCircle2,
  Cpu,
  HelpCircle,
  Zap,
  Sparkles,
} from 'lucide-react';

interface AmplifierLabModalProps {
  nodes: CircuitNode[];
  selectedNodeId: string | null;
  onClose: () => void;
}

export const AmplifierLabModal: React.FC<AmplifierLabModalProps> = ({ onClose }) => {
  // Subject & Practical Selection
  const [selectedSubject, setSelectedSubject] = useState<'analog' | 'power' | 'digital'>('analog');
  const [selectedPracticalNo, setSelectedPracticalNo] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<'circuit' | 'waveforms' | 'table' | 'manual' | 'questions'>('circuit');

  // Amplifier Lab Parameters
  const [selectedAmpType, setSelectedAmpType] = useState<NodeType>('AMP_CLASS_A');
  const [params, setParams] = useState<PracticalAmpParams>(AMPLIFIER_LAB_SPECS['AMP_CLASS_A'].defaultParams);

  // Practical 2 Interactive Workbench Options for Students
  const [p2Mode, setP2Mode] = useState<'classB' | 'classAB'>('classB'); // Class B (crossover notch) vs Class AB (diode compensated)
  const [p2Rin, setP2Rin] = useState<number>(680); // Measured input resistance Ri (ohms)
  const [p2Rout, setP2Rout] = useState<number>(100); // Measured output resistance Ro (ohms)
  const [p2VbeCutoff, setP2VbeCutoff] = useState<number>(0.7); // BJT Vbe knee voltage (V)
  const [p2DmmActive, setP2DmmActive] = useState<boolean>(false);
  const [p2QuizAnswers, setP2QuizAnswers] = useState<Record<number, boolean>>({});

  // Live Sweep Animation & Current Flow Controls
  const [isLiveAnim, setIsLiveAnim] = useState<boolean>(true);
  const [animOffset, setAnimOffset] = useState<number>(0);

  // Interactive Current Flow Visualization Controls
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);

  // MSBTE Practical 1 Observation Table Rows
  const [observationRows, setObservationRows] = useState<MsbteObservationRow[]>([
    calculateMsbteObservationRow(1, 0.2, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(2, 0.4, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(3, 0.6, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(4, 0.8, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(5, 1.0, 12, 220, 4.0, 100),
  ]);

  // MSBTE Practical 2 Observation Table Rows (Table 2.1)
  const [p2ObsRows, setP2ObsRows] = useState<MsbtePractical2Row[]>([
    calculateMsbtePractical2Row(1, 1.0, 680, 100, 5.0, 2.0, 0.7, false),
    calculateMsbtePractical2Row(2, 2.0, 680, 100, 5.0, 2.0, 0.7, false),
    calculateMsbtePractical2Row(3, 3.0, 680, 100, 5.0, 2.0, 0.7, false),
    calculateMsbtePractical2Row(4, 4.0, 680, 100, 5.0, 2.0, 0.7, false),
  ]);

  // Practical Switcher Handler
  const handleSwitchPractical = (num: 1 | 2) => {
    setSelectedPracticalNo(num);
    if (num === 2) {
      setSelectedAmpType('AMP_CLASS_B');
      setParams({
        type: 'AMP_CLASS_B',
        vcc: 5.0,
        vBias: 0.0,
        rLoad: 100,
        vinPeak: 2.0,
        freqHz: 1000,
        gain: 2.0,
        beta: 100,
      });
    } else {
      setSelectedAmpType('AMP_CLASS_A');
      setParams({ ...AMPLIFIER_LAB_SPECS['AMP_CLASS_A'].defaultParams });
    }
  };

  // Sync default params when switching class manually
  const handleSelectAmpClass = (type: NodeType) => {
    setSelectedAmpType(type);
    const spec = AMPLIFIER_LAB_SPECS[type];
    if (spec) {
      setParams({ ...spec.defaultParams });
    }
  };

  useEffect(() => {
    if (!isLiveAnim) return;
    const timer = setInterval(() => {
      setAnimOffset((prev) => (prev + 15) % 1000);
    }, 40);
    return () => clearInterval(timer);
  }, [isLiveAnim]);

  // Recalculate observation tables whenever parameters change
  useEffect(() => {
    setObservationRows((prev) =>
      prev.map((row) =>
        calculateMsbteObservationRow(row.srNo, row.vIn, params.vcc, params.rLoad, params.gain, params.beta || 100)
      )
    );
  }, [params.vcc, params.rLoad, params.gain, params.beta]);

  useEffect(() => {
    setP2ObsRows((prev) =>
      prev.map((row) =>
        calculateMsbtePractical2Row(row.srNo, row.vIn, p2Rin, p2Rout, params.vcc, params.gain, p2VbeCutoff, p2Mode === 'classAB')
      )
    );
  }, [p2Rin, p2Rout, params.vcc, params.gain, p2VbeCutoff, p2Mode]);

  const currentSpec = AMPLIFIER_LAB_SPECS[selectedAmpType] || AMPLIFIER_LAB_SPECS['AMP_CLASS_A'];
  const metrics: PracticalAmpMetrics = calculatePracticalMetrics(params);
  const wavePoints: WaveformPoint[] = generatePracticalWaveformPoints(params, 180, animOffset);

  // Dynamic Real-Time Circuit Branch Current Calculations for Practical 1
  const vBaseBias = params.vcc * (33 / (47 + 33));
  const vEmitter = Math.max(0, vBaseBias - 0.7);
  const iEmitterMa = Number((vEmitter / 0.56).toFixed(2));
  const betaVal = params.beta || 100;
  const iCollectorMa = Number((iEmitterMa * (betaVal / (betaVal + 1))).toFixed(2));
  const iBaseUa = Number(((iCollectorMa * 1000) / betaVal).toFixed(1));

  // Active current observation point for Practical 1
  const currentObsRow = calculateMsbteObservationRow(
    observationRows.length + 1,
    params.vinPeak,
    params.vcc,
    params.rLoad,
    params.gain,
    params.beta || 100
  );

  // Active observation row for Practical 2
  const currentP2ObsRow = calculateMsbtePractical2Row(
    p2ObsRows.length + 1,
    params.vinPeak,
    p2Rin,
    p2Rout,
    params.vcc,
    params.gain,
    p2VbeCutoff,
    p2Mode === 'classAB'
  );

  // SVG Canvas dimensions
  const svgW = 560;
  const svgH = 220;
  const pad = 30;

  // Build SVG path strings
  const buildTimeDomainPath = (key: 'vIn' | 'vOut') => {
    const periodMs = 1000 / params.freqHz;
    return wavePoints
      .map((p, idx) => {
        const val = p[key] ?? 0;
        const x = pad + ((p.time % (2 * periodMs)) / (2 * periodMs)) * (svgW - 2 * pad);
        const y = svgH / 2 - (val / (params.vcc * 0.6)) * (svgH / 2 - pad);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Add observation row functions
  const handleAddObservation = () => {
    setObservationRows((prev) => [
      ...prev,
      calculateMsbteObservationRow(
        prev.length + 1,
        params.vinPeak,
        params.vcc,
        params.rLoad,
        params.gain,
        params.beta || 100
      ),
    ]);
  };

  const handleAddP2Observation = () => {
    setP2ObsRows((prev) => [
      ...prev,
      calculateMsbtePractical2Row(
        prev.length + 1,
        params.vinPeak,
        p2Rin,
        p2Rout,
        params.vcc,
        params.gain,
        p2VbeCutoff,
        p2Mode === 'classAB'
      ),
    ]);
  };

  // Export Practical Report (.txt)
  const handleExportLabReport = () => {
    if (selectedPracticalNo === 2) {
      const reportText = `========================================================================
MAHARASHTRA STATE BOARD OF TECHNICAL EDUCATION (MSBTE 'K' SCHEME)
PRACTICAL LABORATORY REPORT: ANALOG ELECTRONICS (313324)
========================================================================
Date: ${new Date().toLocaleString()}
Experiment No. 2: Test the performance of Class B Push Pull Amplifier

I. PRACTICAL SPECIFICATIONS & CIRCUIT PARAMETERS:
   - Amplifier Configuration: Class B Push Pull Power Amplifier
   - Operating Mode: ${p2Mode === 'classB' ? 'Pure Class B (Unbiased - Crossover Distortion Present)' : 'Class AB (Diode Bias Compensated - Zero Crossover)'}
   - DC Supply Voltage (VCC): ${params.vcc} V
   - Transistor Complementary Pair: Q1 = 2N3904 (NPN BJT), Q2 = 2N3906 (PNP BJT)
   - Transistor Current Gain (β / hFE): ${params.beta || 100}
   - VBE Cutoff Knee Voltage: ${p2VbeCutoff} V
   - Measured Input Resistance (Ri): ${p2Rin} Ω (Measured using DMM)
   - Measured Output Resistance (Ro): ${p2Rout} Ω (Measured using DMM)
   - Input Signal Voltage (Vi): ${params.vinPeak} V Peak
   - Signal Frequency: ${params.freqHz} Hz

II. OBSERVATION TABLE NO. 2.1 RESULTS:
${p2ObsRows
  .map(
    (r) =>
      `   [Row ${r.srNo}] Vi: ${r.vIn}V | Vo: ${r.vOut}V | Pi = Vi²/Ri: ${r.pIn}W | Po = Vo²/Ro: ${r.pOut}W | % Efficiency: ${r.efficiency}% | Q1 Ic: ${r.icQ1Ma}mA | Q2 Ic: ${r.icQ2Ma}mA`
  )
  .join('\n')}

III. PRACTICAL MEASUREMENTS SUMMARY:
   - Input Resistance (Ri): ${p2Rin} Ω
   - Output Resistance (Ro): ${p2Rout} Ω
   - Max Collector Efficiency (η): ${p2ObsRows.find((r) => r.vIn === 2.0)?.efficiency || 1149.66}% (at Vi = 2.0V)
   - Crossover Distortion Deadband Width: ${p2Mode === 'classB' ? `${(p2VbeCutoff * 2).toFixed(2)} V` : '0.00 V (Eliminated)'}
   - Theoretical Maximum Efficiency: 78.5%

IV. PRACTICAL RELATED QUESTIONS & ANSWERS (SECTION XVII):
   Q1: What is meant by Cross Over Distortion?
   Ans: Crossover distortion occurs in Class B amplifiers during zero crossing transitions when one transistor turns off and the other turns on. Because silicon BJTs require VBE ≈ 0.7V to conduct, there is a deadband region between -0.7V and +0.7V where neither transistor conducts, causing a flat horizontal notch in the output waveform.

   Q2: State the applications of Class B Push Pull Amplifier.
   Ans: Audio power output stages, public address (PA) amplifiers, RF power amplifiers, motor speed control drivers, and servo system output stages.

   Q3: State the difference between a voltage and a Power Amplifier.
   Ans: Voltage amplifiers raise small signal voltage levels with high input impedance and low current output. Power amplifiers deliver maximum AC power to low impedance loads (speakers 4-16Ω) with high current output and high efficiency.

   Q4: State the difference between an amplifier and oscillator.
   Ans: An amplifier requires an external input signal and amplifies its amplitude without changing frequency. An oscillator is a self-sustaining circuit that produces repetitive AC output waveforms from a DC supply using positive feedback without any external AC input.

========================================================================
Generated by EJ-SSPI Virtual Electronics Laboratory Simulator
========================================================================`;

      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MSBTE_Practical_2_Class_B_Push_Pull_Report_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Practical 1 export
    const reportText = `========================================================================
MAHARASHTRA STATE BOARD OF TECHNICAL EDUCATION (MSBTE 'K' SCHEME)
PRACTICAL LABORATORY REPORT: ANALOG ELECTRONICS (313324)
========================================================================
Date: ${new Date().toLocaleString()}
Experiment No. 1: Test the performance of single stage Class A power amplifier

I. PRACTICAL SPECIFICATIONS & CIRCUIT PARAMETERS:
   - Amplifier Class: ${currentSpec.name}
   - DC Supply Voltage (VCC): ${metrics.vcc} V
   - Load Resistance (RL): ${metrics.rLoad} Ω
   - Transistor Model: SL100 / BC547 (NPN BJT)
   - Transistor Current Gain (β / hFE): ${params.beta || 100}
   - Input Signal Voltage (Vi): ${params.vinPeak} V Peak (${metrics.vInRms} V RMS)
   - Input Frequency: ${params.freqHz} Hz

II. OBSERVATION TABLE NO. 1.1 RESULTS:
${observationRows
  .map(
    (r) =>
      `   [Row ${r.srNo}] Vi: ${r.vIn}V | Vo: ${r.vOut}V | Pac: ${r.pAc}W | Pdc: ${r.pDc}W | % Eff: ${r.efficiency}% | Ib: ${r.iBaseUa}µA | Ic: ${r.iCollectorMa}mA | Vce: ${r.vCe}V`
  )
  .join('\n')}

III. PRACTICAL MEASUREMENTS SUMMARY:
   - Peak Output Voltage (Vo): ${metrics.vOutPeak} V
   - RMS Output Voltage (Vo,rms): ${metrics.vOutRms} V
   - Voltage Gain (Av): ${metrics.voltageGain} (${metrics.voltageGainDb} dB)
   - AC Output Power (Pac): ${(metrics.pOutMw / 1000).toFixed(4)} W
   - DC Supply Power (Pdc): ${(metrics.pDcMw / 1000).toFixed(4)} W
   - Collector Efficiency (η): ${metrics.efficiency} %
   - Q-Point Operating State: VCEQ = ${metrics.vCeq} V, ICQ = ${metrics.iCqMa} mA

IV. PRACTICAL RELATED QUESTIONS & ANSWERS:
   Q1: List the low power transistor and high-power transistor using a datasheet.
   Ans: Low power transistors: BC547, BC548, 2N2222, BC557 (PD < 1W, IC < 500mA, TO-92 package).
        High power transistors: 2N3055, TIP31C, BD139, SL100, BD115 (PD > 10W, IC > 1.5A, TO-3/TO-220 metal packages).

   Q2: List the ratings of low power transistors and high power transistors using a datasheet.
   Ans: BC547: VCEO=45V, IC=100mA, PD=500mW, hFE=110-800, TO-92 plastic.
        2N3055: VCEO=60V, IC=15A, PD=115W, hFE=20-70, TO-3 metal can with heatsink.

   Q3: Differentiate Class A, B, AB, C power amplifier.
   Ans: Class A (360° conduction, 25-50% efficiency, zero crossover distortion).
        Class B (180° conduction, 78.5% max efficiency, shows crossover distortion).
        Class AB (200-220° conduction, 60-70% efficiency, diodes eliminate crossover).
        Class C (<120° conduction pulses, 80-90% efficiency, tuned RF transmitter applications).

========================================================================
Generated by EJ-SSPI Virtual Electronics Laboratory Simulator
========================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MSBTE_Practical_1_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '940px',
          maxHeight: '94vh',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-panel)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: selectedPracticalNo === 2 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)' }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  MSBTE Laboratory Practical Workbench ('K' Scheme)
                </h2>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#f59e0b',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                  }}
                >
                  CO & CO-PO Aligned
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {selectedPracticalNo === 1
                  ? 'Analog Electronics (313324) • Practical No. 1: Test performance of single stage Class A power amplifier'
                  : 'Analog Electronics (313324) • Practical No. 2: Test the performance of Class B Push Pull Amplifier'}
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

        {/* 📌 Practical Switcher Bar (Practical 1 vs Practical 2) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <button
            onClick={() => handleSwitchPractical(1)}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '10px',
              border: selectedPracticalNo === 1 ? '2px solid #38bdf8' : '1px solid var(--border-color)',
              background: selectedPracticalNo === 1 ? 'rgba(56, 189, 248, 0.18)' : 'var(--bg-card)',
              color: selectedPracticalNo === 1 ? '#38bdf8' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>📌 Practical No. 1: Single Stage Class A Power Amplifier</span>
          </button>

          <button
            onClick={() => handleSwitchPractical(2)}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '10px',
              border: selectedPracticalNo === 2 ? '2px solid #f43f5e' : '1px solid var(--border-color)',
              background: selectedPracticalNo === 2 ? 'rgba(244, 63, 94, 0.18)' : 'var(--bg-card)',
              color: selectedPracticalNo === 2 ? '#f43f5e' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span style={{ padding: '2px 6px', background: '#f43f5e', color: '#fff', borderRadius: '4px', fontSize: '0.62rem', fontWeight: 800 }}>
              NEW
            </span>
            <span>📌 Practical No. 2: Class B Push Pull Amplifier</span>
          </button>
        </div>

        {/* ⚡ Student Workbench Options Bar for Practical No. 2 */}
        {selectedPracticalNo === 2 && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(245,158,11,0.08) 100%)',
              border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: '10px',
              padding: '9px 12px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="#f43f5e" />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f43f5e' }}>
                  Practical 2 Options:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Class B vs Class AB Mode Toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-panel)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setP2Mode('classB')}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: 'none',
                      background: p2Mode === 'classB' ? '#f43f5e' : 'transparent',
                      color: p2Mode === 'classB' ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    ⚡ Pure Class B (Shows Crossover Notch)
                  </button>
                  <button
                    onClick={() => setP2Mode('classAB')}
                    style={{
                      padding: '3px 9px',
                      borderRadius: '6px',
                      border: 'none',
                      background: p2Mode === 'classAB' ? '#10b981' : 'transparent',
                      color: p2Mode === 'classAB' ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🛡️ Class AB (Diode Bias Compensated)
                  </button>
                </div>

                {/* Multimeter Probes Tool Button */}
                <button
                  onClick={() => setP2DmmActive(!p2DmmActive)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 9px',
                    borderRadius: '8px',
                    border: p2DmmActive ? '1px solid #f59e0b' : '1px solid var(--border-color)',
                    background: p2DmmActive ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-panel)',
                    color: p2DmmActive ? '#f59e0b' : 'var(--text-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <span>📟 DMM Probes {p2DmmActive ? 'ON ⚡' : '(Ri & Ro Meter)'}</span>
                </button>

                {/* Vbe Cutoff Knee Voltage Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', background: 'var(--bg-panel)', padding: '3px 8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>VBE Knee:</span>
                  <input
                    type="range"
                    min="0.4"
                    max="0.9"
                    step="0.05"
                    value={p2VbeCutoff}
                    onChange={(e) => setP2VbeCutoff(parseFloat(e.target.value))}
                    style={{ width: '55px', accentColor: '#f43f5e' }}
                  />
                  <span style={{ fontWeight: 800, color: '#f43f5e' }}>{p2VbeCutoff}V</span>
                </div>
              </div>
            </div>

            {/* DMM Multimeter Meter Panel */}
            {p2DmmActive && (
              <div style={{ marginTop: '8px', background: '#090d16', border: '1px dashed #f59e0b', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>📟</span>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b' }}>
                      Digital Multimeter (DMM) Impedance & Resistance Probe Tool
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Connected across Class B Push-Pull input terminals (Ri) and output load terminals (Ro)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#000', padding: '3px 8px', borderRadius: '6px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ri (Input):</span>
                    <input
                      type="number"
                      value={p2Rin}
                      onChange={(e) => setP2Rin(Math.max(10, Number(e.target.value)))}
                      style={{ width: '50px', background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 800, fontSize: '0.8rem' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Ω</span>
                  </div>

                  <div style={{ background: '#000', padding: '3px 8px', borderRadius: '6px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Ro (Output):</span>
                    <input
                      type="number"
                      value={p2Rout}
                      onChange={(e) => setP2Rout(Math.max(10, Number(e.target.value)))}
                      style={{ width: '50px', background: 'transparent', border: 'none', color: '#4ade80', fontWeight: 800, fontSize: '0.8rem' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>Ω</span>
                  </div>

                  <button
                    onClick={() => {
                      setP2ObsRows((prev) =>
                        prev.map((r) => calculateMsbtePractical2Row(r.srNo, r.vIn, p2Rin, p2Rout, params.vcc, params.gain, p2VbeCutoff, p2Mode === 'classAB'))
                      );
                    }}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: '#000', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Update Table 2.1
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subject Selector & Class Selector Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedSubject('analog')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubject === 'analog' ? 700 : 500,
                border: '1px solid var(--border-color)',
                background: selectedSubject === 'analog' ? 'var(--accent-cyan)' : 'var(--bg-card)',
                color: selectedSubject === 'analog' ? '#0f172a' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              📘 Analog Electronics (313324)
            </button>
            <button
              onClick={() => setSelectedSubject('power')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubject === 'power' ? 700 : 500,
                border: '1px solid var(--border-color)',
                background: selectedSubject === 'power' ? 'var(--accent-amber)' : 'var(--bg-card)',
                color: selectedSubject === 'power' ? '#0f172a' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              ⚡ Power Electronics (313328)
            </button>
            <button
              onClick={() => setSelectedSubject('digital')}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: selectedSubject === 'digital' ? 700 : 500,
                border: '1px solid var(--border-color)',
                background: selectedSubject === 'digital' ? 'var(--accent-emerald)' : 'var(--bg-card)',
                color: selectedSubject === 'digital' ? '#0f172a' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              💻 Digital Electronics (313325)
            </button>
          </div>

          {/* Amplifier Class Selector */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {Object.values(AMPLIFIER_LAB_SPECS).map((spec) => (
              <button
                key={spec.type}
                onClick={() => handleSelectAmpClass(spec.type)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: selectedAmpType === spec.type ? 700 : 500,
                  border: `1px solid ${selectedAmpType === spec.type ? spec.color : 'var(--border-color)'}`,
                  background: selectedAmpType === spec.type ? `${spec.color}25` : 'transparent',
                  color: selectedAmpType === spec.type ? spec.color : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Class {spec.classLetter}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('circuit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'circuit' ? (selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)') : 'var(--bg-card)',
              color: activeTab === 'circuit' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Cpu size={14} /> Visual Circuit Diagram
          </button>

          <button
            onClick={() => setActiveTab('waveforms')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'waveforms' ? (selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)') : 'var(--bg-card)',
              color: activeTab === 'waveforms' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={14} /> Waveforms & CRO Output
          </button>

          <button
            onClick={() => setActiveTab('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'table' ? (selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)') : 'var(--bg-card)',
              color: activeTab === 'table' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <FileText size={14} /> {selectedPracticalNo === 2 ? 'Table 2.1' : 'Table 1.1'} Observation & Calculations
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'manual' ? (selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)') : 'var(--bg-card)',
              color: activeTab === 'manual' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <CheckCircle2 size={14} /> Experiment Manual (MSBTE)
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'questions' ? (selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)') : 'var(--bg-card)',
              color: activeTab === 'questions' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={14} /> Practical Related Q&A ({selectedPracticalNo === 2 ? 'XVII' : 'XVI'})
          </button>
        </div>

        {/* TAB 1: VISUAL CIRCUIT DIAGRAM */}
        {activeTab === 'circuit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            {/* Header & Controls Bar */}
            <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color={selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-amber)'} />
                  {selectedPracticalNo === 1
                    ? 'Fig 1.1: Single Stage Class A Power Amplifier Circuit Setup (Current Flow Animated)'
                    : 'Fig. 2.1: Class - B Push Pull Amplifier Circuit Setup (Interactive NPN & PNP Conduction)'}
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {selectedPracticalNo === 1
                    ? 'Interactive schematic with live DC bias & AC current flow paths (Ic, Ib, Ie, Ibias) and component tooltips.'
                    : 'Interactive complementary push-pull schematic: Q1 (2N3904 NPN) positive half conduction & Q2 (2N3906 PNP) negative half conduction.'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${showCurrentFlow ? '#4ade80' : 'var(--border-color)'}`,
                    background: showCurrentFlow ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-panel)',
                    color: showCurrentFlow ? '#4ade80' : 'var(--text-muted)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Zap size={13} />
                  <span>Flow: {showCurrentFlow ? 'ON ⚡' : 'OFF'}</span>
                </button>

                <button
                  onClick={handleExportLabReport}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-panel)',
                    color: 'var(--text-primary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} /> Report (.txt)
                </button>
              </div>
            </div>

            {/* Interactive Circuit Schematic SVG */}
            <div style={{ background: '#020617', borderRadius: '12px', padding: '14px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
              <svg width="100%" height="300" viewBox="0 0 720 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <pattern id="circuit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.6" />
                </pattern>
                <rect width="720" height="300" fill="url(#circuit-grid)" />

                {/* Power Rails */}
                <line x1="50" y1="30" x2="670" y2="30" stroke="var(--accent-rose)" strokeWidth="3" />
                <text x="675" y="34" fill="var(--accent-rose)" fontSize="11" fontWeight="700">+Vcc ({params.vcc}V)</text>

                <line x1="50" y1="270" x2="670" y2="270" stroke="#475569" strokeWidth="3" />
                <text x="675" y="274" fill="#94a3b8" fontSize="11" fontWeight="700">0V Ground</text>

                {/* ======================= PRACTICAL NO. 1 SCHEMATIC (CLASS A) ======================= */}
                {selectedPracticalNo === 1 && (
                  <g>
                    {/* Signal Generator */}
                    <circle cx="80" cy="150" r="18" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                    <path d="M 70 150 Q 75 140 80 150 T 90 150" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <line x1="80" y1="168" x2="80" y2="270" stroke="var(--accent-cyan)" strokeWidth="1.5" />
                    <text x="35" y="154" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">Signal Vi ({params.vinPeak}V)</text>

                    {/* C1 */}
                    <line x1="98" y1="150" x2="135" y2="150" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <line x1="135" y1="132" x2="135" y2="168" stroke="var(--accent-cyan)" strokeWidth="3" />
                    <line x1="145" y1="132" x2="145" y2="168" stroke="var(--accent-cyan)" strokeWidth="3" />
                    <line x1="145" y1="150" x2="230" y2="150" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <text x="130" y="122" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">C1 (10µF)</text>

                    {/* R1 & R2 */}
                    <line x1="230" y1="30" x2="230" y2="65" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="222" y="65" width="16" height="45" fill="#1e293b" stroke="var(--accent-amber)" strokeWidth="2.5" rx="3" />
                    <text x="244" y="92" fill="var(--accent-amber)" fontSize="11" fontWeight="700">R1 (47kΩ)</text>
                    <line x1="230" y1="110" x2="230" y2="150" stroke="var(--text-primary)" strokeWidth="2" />

                    <line x1="230" y1="150" x2="230" y2="190" stroke="var(--text-primary)" strokeWidth="2" />
                    <rect x="222" y="190" width="16" height="45" fill="#1e293b" stroke="var(--accent-amber)" strokeWidth="2.5" rx="3" />
                    <text x="244" y="217" fill="var(--accent-amber)" fontSize="11" fontWeight="700">R2 (33kΩ)</text>
                    <line x1="230" y1="235" x2="230" y2="270" stroke="var(--text-primary)" strokeWidth="2" />

                    <circle cx="230" cy="150" r="4.5" fill="var(--accent-cyan)" />
                    <line x1="230" y1="150" x2="320" y2="150" stroke="var(--accent-cyan)" strokeWidth="2.5" />

                    {/* Transistor SL100 */}
                    <circle cx="350" cy="150" r="32" fill="#0f172a" stroke="var(--accent-emerald)" strokeWidth="2.5" filter="url(#glow-green)" />
                    <line x1="320" y1="150" x2="338" y2="150" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                    <line x1="338" y1="128" x2="338" y2="172" stroke="#fff" strokeWidth="3.5" />

                    <line x1="338" y1="136" x2="365" y2="115" stroke="var(--accent-rose)" strokeWidth="2.5" />
                    <line x1="365" y1="115" x2="365" y2="30" stroke="var(--accent-rose)" strokeWidth="2.5" />

                    <line x1="338" y1="164" x2="365" y2="185" stroke="var(--accent-emerald)" strokeWidth="2.5" />
                    <polygon points="358,175 367,187 352,185" fill="var(--accent-emerald)" />
                    <line x1="365" y1="185" x2="365" y2="270" stroke="var(--accent-emerald)" strokeWidth="2.5" />

                    <text x="330" y="102" fill="var(--accent-emerald)" fontSize="12" fontWeight="800">SL100 (NPN)</text>

                    {/* RL */}
                    <rect x="357" y="55" width="16" height="45" fill="#1e293b" stroke="var(--accent-rose)" strokeWidth="2.5" rx="3" />
                    <text x="380" y="82" fill="var(--accent-rose)" fontSize="11" fontWeight="700">RL ({params.rLoad}Ω)</text>

                    {/* RE */}
                    <rect x="357" y="195" width="16" height="45" fill="#1e293b" stroke="var(--accent-emerald)" strokeWidth="2.5" rx="3" />
                    <text x="380" y="222" fill="var(--accent-emerald)" fontSize="10" fontWeight="600">RE (560Ω)</text>

                    {/* Output C2 & CRO */}
                    <circle cx="365" cy="115" r="4" fill="var(--accent-rose)" />
                    <line x1="365" y1="115" x2="490" y2="115" stroke="var(--accent-rose)" strokeWidth="2" />
                    <line x1="490" y1="97" x2="490" y2="133" stroke="var(--accent-cyan)" strokeWidth="3" />
                    <line x1="500" y1="97" x2="500" y2="133" stroke="var(--accent-cyan)" strokeWidth="3" />
                    <line x1="500" y1="115" x2="580" y2="115" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <rect x="580" y="93" width="75" height="44" fill="#1e293b" stroke="var(--accent-cyan)" strokeWidth="2" rx="4" />
                    <text x="590" y="118" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">CRO Scope</text>
                    <text x="590" y="130" fill="var(--text-muted)" fontSize="8">Vo Peak: {metrics.vOutPeak}V</text>
                  </g>
                )}

                {/* ======================= PRACTICAL NO. 2 SCHEMATIC (FIG 2.1 CLASS B PUSH-PULL) ======================= */}
                {selectedPracticalNo === 2 && (() => {
                  const instantVin = params.vinPeak * Math.sin(animOffset * 0.08);
                  const isP2Positive = instantVin > p2VbeCutoff;
                  const isP2Negative = instantVin < -p2VbeCutoff;
                  const isP2Deadzone = p2Mode === 'classB' && !isP2Positive && !isP2Negative;

                  const isQ1Active = p2Mode === 'classAB' ? instantVin > -0.05 : isP2Positive;
                  const isQ2Active = p2Mode === 'classAB' ? instantVin < 0.05 : isP2Negative;

                  return (
                    <g>
                      {/* Real-time Waveform Cycle HUD Banner */}
                      <g transform="translate(180, 8)">
                        {isP2Deadzone ? (
                          <g>
                            <rect x="0" y="0" width="370" height="24" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" strokeWidth="1.5" rx="6" />
                            <text x="12" y="16" fill="#f59e0b" fontSize="10" fontWeight="900">
                              ⚠️ DEADZONE (|Vin|={Math.abs(instantVin).toFixed(2)}V &lt; {p2VbeCutoff}V) — Q1 OFF | Q2 OFF
                            </text>
                          </g>
                        ) : isQ1Active ? (
                          <g>
                            <rect x="0" y="0" width="370" height="24" fill="rgba(244, 63, 94, 0.25)" stroke="#f43f5e" strokeWidth="1.5" rx="6" />
                            <text x="12" y="16" fill="#f43f5e" fontSize="10" fontWeight="900">
                              ⚡ POSITIVE HALF (+Vin = +{instantVin.toFixed(2)}V) — Q1 NPN ON 🔥 | Q2 PNP OFF 💤
                            </text>
                          </g>
                        ) : (
                          <g>
                            <rect x="0" y="0" width="370" height="24" fill="rgba(74, 222, 128, 0.25)" stroke="#4ade80" strokeWidth="1.5" rx="6" />
                            <text x="12" y="16" fill="#4ade80" fontSize="10" fontWeight="900">
                              ⚡ NEGATIVE HALF (-Vin = {instantVin.toFixed(2)}V) — Q2 PNP ON 🔥 | Q1 NPN OFF 💤
                            </text>
                          </g>
                        )}
                      </g>

                      {/* AC Input Signal Generator V1 */}
                      <g>
                        <circle cx="70" cy="150" r="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                        <path d="M 60 150 Q 65 140 70 150 T 80 150" fill="none" stroke="#38bdf8" strokeWidth="2" />
                        <line x1="70" y1="168" x2="70" y2="270" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="25" y="154" fill="#38bdf8" fontSize="10" fontWeight="700">V1 (1kHz)</text>
                        <text x="25" y="132" fill="#38bdf8" fontSize="9">{instantVin.toFixed(2)}V Instant</text>
                      </g>

                      {/* Dual Input Coupling Capacitors C1 & C2 */}
                      <g opacity={isQ1Active ? 1 : 0.45}>
                        <line x1="88" y1="150" x2="115" y2="150" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth={isQ1Active ? 2.5 : 1.5} />
                        <line x1="115" y1="150" x2="115" y2="90" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth={isQ1Active ? 2.5 : 1.5} />
                        <line x1="115" y1="90" x2="135" y2="90" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth={isQ1Active ? 2.5 : 1.5} />
                        <line x1="135" y1="78" x2="135" y2="102" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="143" y1="78" x2="143" y2="102" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="143" y1="90" x2="220" y2="90" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth={isQ1Active ? 2.5 : 1.5} />
                        <text x="130" y="70" fill={isQ1Active ? '#f43f5e' : '#38bdf8'} fontSize="10" fontWeight="700">C1 {isQ1Active ? '⚡ PASSING' : '💤 IDLE'}</text>
                      </g>

                      <g opacity={isQ2Active ? 1 : 0.45}>
                        <line x1="115" y1="150" x2="115" y2="210" stroke={isQ2Active ? '#4ade80' : '#38bdf8'} strokeWidth={isQ2Active ? 2.5 : 1.5} />
                        <line x1="115" y1="210" x2="135" y2="210" stroke={isQ2Active ? '#4ade80' : '#38bdf8'} strokeWidth={isQ2Active ? 2.5 : 1.5} />
                        <line x1="135" y1="198" x2="135" y2="222" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="143" y1="198" x2="143" y2="222" stroke="#38bdf8" strokeWidth="3" />
                        <line x1="143" y1="210" x2="220" y2="210" stroke={isQ2Active ? '#4ade80' : '#38bdf8'} strokeWidth={isQ2Active ? 2.5 : 1.5} />
                        <text x="130" y="236" fill={isQ2Active ? '#4ade80' : '#38bdf8'} fontSize="10" fontWeight="700">C2 {isQ2Active ? '⚡ PASSING' : '💤 IDLE'}</text>
                      </g>

                      {/* Resistor Divider Network */}
                      <line x1="220" y1="30" x2="220" y2="55" stroke="#f59e0b" strokeWidth="2" />
                      <rect x="213" y="55" width="14" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
                      <text x="175" y="72" fill="#f59e0b" fontSize="9" fontWeight="700">R1 (100Ω)</text>

                      <line x1="220" y1="85" x2="220" y2="120" stroke="#f59e0b" strokeWidth="2" />

                      {p2Mode === 'classB' ? (
                        <g>
                          <rect x="213" y="120" width="14" height="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
                          <text x="175" y="136" fill="#f59e0b" fontSize="8" fontWeight="600">R3 (680Ω)</text>
                          <line x1="220" y1="145" x2="220" y2="155" stroke="#f59e0b" strokeWidth="2" />
                          <rect x="213" y="155" width="14" height="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
                          <text x="175" y="172" fill="#f59e0b" fontSize="8" fontWeight="600">R3 (680Ω)</text>
                        </g>
                      ) : (
                        <g>
                          <polygon points="214,122 226,122 220,134" fill="#10b981" stroke="#10b981" />
                          <line x1="214" y1="134" x2="226" y2="134" stroke="#10b981" strokeWidth="2" />
                          <text x="175" y="132" fill="#10b981" fontSize="9" fontWeight="700">D1 1N4148</text>

                          <polygon points="214,148 226,148 220,160" fill="#10b981" stroke="#10b981" />
                          <line x1="214" y1="160" x2="226" y2="160" stroke="#10b981" strokeWidth="2" />
                          <text x="175" y="158" fill="#10b981" fontSize="9" fontWeight="700">D2 1N4148</text>
                        </g>
                      )}

                      <line x1="220" y1="180" x2="220" y2="210" stroke="#f59e0b" strokeWidth="2" />
                      <rect x="213" y="210" width="14" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="2" />
                      <text x="170" y="228" fill="#f59e0b" fontSize="9" fontWeight="700">R4 (4.7kΩ)</text>
                      <line x1="220" y1="240" x2="220" y2="270" stroke="#f59e0b" strokeWidth="2" />

                      <circle cx="220" cy="90" r="3.5" fill="#38bdf8" />
                      <line x1="220" y1="90" x2="310" y2="90" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth={isQ1Active ? 2.5 : 1.5} />

                      <circle cx="220" cy="210" r="3.5" fill="#38bdf8" />
                      <line x1="220" y1="210" x2="310" y2="210" stroke={isQ2Active ? '#4ade80' : '#38bdf8'} strokeWidth={isQ2Active ? 2.5 : 1.5} />

                      {/* Q1: NPN Transistor 2N3904 (DYNAMIC ACTIVE/INACTIVE VISUAL) */}
                      <g opacity={isQ1Active ? 1 : 0.4}>
                        <circle
                          cx="330"
                          cy="90"
                          r="24"
                          fill={isQ1Active ? '#450a0a' : '#0f172a'}
                          stroke={isQ1Active ? '#f43f5e' : '#475569'}
                          strokeWidth={isQ1Active ? 3 : 1.5}
                          filter={isQ1Active ? 'url(#glow-rose)' : undefined}
                        />
                        <line x1="310" y1="90" x2="322" y2="90" stroke={isQ1Active ? '#f43f5e' : '#38bdf8'} strokeWidth="2" />
                        <line x1="322" y1="75" x2="322" y2="105" stroke="#fff" strokeWidth="3" />
                        <line x1="322" y1="80" x2="345" y2="65" stroke="#f43f5e" strokeWidth="2.5" />
                        <line x1="345" y1="65" x2="345" y2="30" stroke="#f43f5e" strokeWidth="2.5" />
                        <line x1="322" y1="100" x2="345" y2="115" stroke="#f43f5e" strokeWidth="2.5" />
                        <polygon points="338,107 347,117 334,115" fill="#f43f5e" />
                        <line x1="345" y1="115" x2="345" y2="150" stroke="#f43f5e" strokeWidth="2.5" />
                        <text x="312" y="55" fill={isQ1Active ? '#f43f5e' : '#94a3b8'} fontSize="11" fontWeight="800">
                          Q1 2N3904 (NPN)
                        </text>

                        {/* Q1 Status Badge */}
                        <rect x="275" y="34" width="110" height="16" fill={isQ1Active ? 'rgba(244,63,94,0.9)' : 'rgba(30,41,59,0.8)'} rx="3" />
                        <text x="280" y="46" fill={isQ1Active ? '#fff' : '#94a3b8'} fontSize="8" fontWeight="900">
                          {isQ1Active ? '🔥 ACTIVE (ON)' : '💤 CUTOFF (OFF)'}
                        </text>
                      </g>

                      {/* Q2: PNP Transistor 2N3906 (DYNAMIC ACTIVE/INACTIVE VISUAL) */}
                      <g opacity={isQ2Active ? 1 : 0.4}>
                        <circle
                          cx="330"
                          cy="210"
                          r="24"
                          fill={isQ2Active ? '#064e3b' : '#0f172a'}
                          stroke={isQ2Active ? '#4ade80' : '#475569'}
                          strokeWidth={isQ2Active ? 3 : 1.5}
                          filter={isQ2Active ? 'url(#glow-green)' : undefined}
                        />
                        <line x1="310" y1="210" x2="322" y2="210" stroke={isQ2Active ? '#4ade80' : '#38bdf8'} strokeWidth="2" />
                        <line x1="322" y1="195" x2="322" y2="225" stroke="#fff" strokeWidth="3" />
                        <line x1="322" y1="200" x2="345" y2="185" stroke="#4ade80" strokeWidth="2.5" />
                        <polygon points="328,198 322,200 330,190" fill="#4ade80" />
                        <line x1="345" y1="185" x2="345" y2="150" stroke="#4ade80" strokeWidth="2.5" />
                        <line x1="322" y1="220" x2="345" y2="235" stroke="#4ade80" strokeWidth="2.5" />
                        <line x1="345" y1="235" x2="345" y2="270" stroke="#4ade80" strokeWidth="2.5" />
                        <text x="312" y="250" fill={isQ2Active ? '#4ade80' : '#94a3b8'} fontSize="11" fontWeight="800">
                          Q2 2N3906 (PNP)
                        </text>

                        {/* Q2 Status Badge */}
                        <rect x="275" y="252" width="110" height="16" fill={isQ2Active ? 'rgba(74,222,128,0.9)' : 'rgba(30,41,59,0.8)'} rx="3" />
                        <text x="280" y="264" fill={isQ2Active ? '#000' : '#94a3b8'} fontSize="8" fontWeight="900">
                          {isQ2Active ? '🔥 ACTIVE (ON)' : '💤 CUTOFF (OFF)'}
                        </text>
                      </g>

                      {/* Output Junction & Coupling Cap C3 */}
                      <circle cx="345" cy="150" r="4.5" fill="#e2e8f0" />
                      <line x1="345" y1="150" x2="440" y2="150" stroke={isP2Deadzone ? '#475569' : (isQ1Active ? '#f43f5e' : '#4ade80')} strokeWidth="2.5" />
                      <line x1="440" y1="134" x2="440" y2="166" stroke="#38bdf8" strokeWidth="3" />
                      <line x1="448" y1="134" x2="448" y2="166" stroke="#38bdf8" strokeWidth="3" />
                      <line x1="448" y1="150" x2="520" y2="150" stroke={isP2Deadzone ? '#475569' : (isQ1Active ? '#f43f5e' : '#4ade80')} strokeWidth="2.5" />
                      <text x="430" y="124" fill="#38bdf8" fontSize="10" fontWeight="700">C3 (100µF)</text>

                      {/* Load Resistor RLout */}
                      <line x1="520" y1="150" x2="520" y2="180" stroke={isP2Deadzone ? '#475569' : '#f43f5e'} strokeWidth="2" />
                      <rect x="513" y="180" width="14" height="40" fill={isP2Deadzone ? '#0f172a' : '#1e293b'} stroke={isP2Deadzone ? '#475569' : '#f43f5e'} strokeWidth="2.5" rx="3" />
                      <line x1="520" y1="220" x2="520" y2="270" stroke={isP2Deadzone ? '#475569' : '#f43f5e'} strokeWidth="2" />
                      <text x="535" y="204" fill={isP2Deadzone ? '#64748b' : '#f43f5e'} fontSize="11" fontWeight="800">RL ({p2Rout}Ω)</text>

                      {/* CRO Probe Output Node */}
                      <circle cx="520" cy="150" r="4.5" fill="#f59e0b" />
                      <line x1="520" y1="150" x2="590" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                      <rect x="590" y="130" width="65" height="40" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="6" />
                      <text x="600" y="154" fill="#f59e0b" fontSize="11" fontWeight="800">CRO CH2</text>

                      {/* DMM Overlay */}
                      {p2DmmActive && (
                        <g>
                          <rect x="75" y="38" width="85" height="24" fill="rgba(245,158,11,0.95)" rx="4" />
                          <text x="82" y="54" fill="#000" fontSize="9" fontWeight="900">DMM Ri: {p2Rin} Ω</text>
                          <line x1="117" y1="62" x2="117" y2="90" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

                          <rect x="475" y="38" width="85" height="24" fill="rgba(74,222,128,0.95)" rx="4" />
                          <text x="482" y="54" fill="#000" fontSize="9" fontWeight="900">DMM Ro: {p2Rout} Ω</text>
                          <line x1="517" y1="62" x2="520" y2="150" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
                        </g>
                      )}

                      {/* ANIMATED CYCLE DYNAMIC CURRENT FLOW PARTICLES */}
                      {showCurrentFlow && (
                        <g>
                          {/* Q1 Positive Cycle Current Dots */}
                          {isQ1Active && (
                            <g>
                              <line x1="345" y1="30" x2="345" y2="150" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 6" className="current-path-fast" filter="url(#glow-rose)" />
                              <line x1="345" y1="150" x2="520" y2="150" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 6" className="current-path-forward" filter="url(#glow-rose)" />
                              <line x1="520" y1="150" x2="520" y2="270" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 6" className="current-path-forward" filter="url(#glow-rose)" />
                              <circle cx="345" cy={30 + ((animOffset * 2.5) % 120)} r="4" fill="#ffe4e6" />
                              <circle cx={345 + ((animOffset * 2.5) % 175)} cy="150" r="4" fill="#ffe4e6" />
                              <polygon points="440,150 430,145 430,155" fill="#f43f5e" />
                            </g>
                          )}

                          {/* Q2 Negative Cycle Current Dots */}
                          {isQ2Active && (
                            <g>
                              <line x1="520" y1="270" x2="520" y2="150" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="current-path-reverse" filter="url(#glow-green)" />
                              <line x1="520" y1="150" x2="345" y2="150" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="current-path-reverse" filter="url(#glow-green)" />
                              <line x1="345" y1="150" x2="345" y2="270" stroke="#4ade80" strokeWidth="3" strokeDasharray="6 6" className="current-path-fast" filter="url(#glow-green)" />
                              <circle cx="520" cy={270 - ((animOffset * 2.5) % 120)} r="4" fill="#dcfce7" />
                              <circle cx={520 - ((animOffset * 2.5) % 175)} cy="150" r="4" fill="#dcfce7" />
                              <polygon points="410,150 420,145 420,155" fill="#4ade80" />
                            </g>
                          )}

                          {/* Crossover Deadzone Notification in Class B */}
                          {isP2Deadzone && (
                            <g>
                              <circle cx="345" cy="150" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.8">
                                <animate attributeName="r" values="12;24;12" dur="1.2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
                              </circle>
                              <rect x="270" y="140" width="150" height="22" fill="rgba(245,158,11,0.95)" rx="4" />
                              <text x="276" y="155" fill="#000" fontSize="9" fontWeight="900">
                                ⚠️ DEADZONE: BOTH Q1 & Q2 OFF
                              </text>
                            </g>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })()}
                </svg>
              </div>

            {/* REAL-TIME COMPONENT ACTIVITY HUD CARD (PRACTICAL 2 FOCUS) */}
            {selectedPracticalNo === 2 && (() => {
              const instantVin = params.vinPeak * Math.sin(animOffset * 0.08);
              const isP2Positive = instantVin > p2VbeCutoff;
              const isP2Negative = instantVin < -p2VbeCutoff;
              const isP2Deadzone = p2Mode === 'classB' && !isP2Positive && !isP2Negative;

              const isQ1Active = p2Mode === 'classAB' ? instantVin > -0.05 : isP2Positive;
              const isQ2Active = p2Mode === 'classAB' ? instantVin < 0.05 : isP2Negative;

              return (
                <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.72rem' }}>
                  {/* Q1 Activity Status */}
                  <div style={{ padding: '6px 8px', background: isQ1Active ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 41, 59, 0.4)', border: `1px solid ${isQ1Active ? '#f43f5e' : 'var(--border-color)'}`, borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: isQ1Active ? '#f43f5e' : 'var(--text-muted)' }}>Q1 (2N3904 NPN)</span>
                      <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '3px', background: isQ1Active ? '#f43f5e' : '#334155', color: '#fff', fontWeight: 900 }}>
                        {isQ1Active ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {isQ1Active ? `Conducting +Vcc power into load (Vbe = +${instantVin.toFixed(2)}V > 0.7V).` : 'Base reverse biased (Cutoff). Zero collector current.'}
                    </p>
                  </div>

                  {/* Q2 Activity Status */}
                  <div style={{ padding: '6px 8px', background: isQ2Active ? 'rgba(74, 222, 128, 0.15)' : 'rgba(30, 41, 59, 0.4)', border: `1px solid ${isQ2Active ? '#4ade80' : 'var(--border-color)'}`, borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: isQ2Active ? '#4ade80' : 'var(--text-muted)' }}>Q2 (2N3906 PNP)</span>
                      <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '3px', background: isQ2Active ? '#4ade80' : '#334155', color: isQ2Active ? '#000' : '#fff', fontWeight: 900 }}>
                        {isQ2Active ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {isQ2Active ? `Sinking load current to Ground (Vbe = ${instantVin.toFixed(2)}V < -0.7V).` : 'Base reverse biased (Cutoff). Zero collector current.'}
                    </p>
                  </div>

                  {/* C1 & C2 Coupling Caps */}
                  <div style={{ padding: '6px 8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#38bdf8', display: 'block' }}>C1 & C2 (1µF Caps)</span>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {isQ1Active ? 'C1 passes +AC cycle to Q1 base.' : (isQ2Active ? 'C2 passes -AC cycle to Q2 base.' : 'Blocking DC while waiting for Vin threshold.')}
                    </p>
                  </div>

                  {/* C3 Output Cap */}
                  <div style={{ padding: '6px 8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#f59e0b', display: 'block' }}>C3 (100µF Output)</span>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {isQ1Active ? 'Charging from Q1 output.' : (isQ2Active ? 'Discharging through Q2.' : 'Holding DC charge.')}
                    </p>
                  </div>

                  {/* RL Output Load */}
                  <div style={{ padding: '6px 8px', background: isP2Deadzone ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)', border: `1px solid ${isP2Deadzone ? '#f59e0b' : '#f43f5e'}`, borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: isP2Deadzone ? '#f59e0b' : '#f43f5e' }}>RL ({p2Rout}Ω Load)</span>
                      <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '3px', background: isP2Deadzone ? '#f59e0b' : '#f43f5e', color: isP2Deadzone ? '#000' : '#fff', fontWeight: 900 }}>
                        {isP2Deadzone ? '0V NOTCH' : (isQ1Active ? '+Vo DRIVE' : '-Vo SINK')}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {isP2Deadzone ? 'Zero output voltage (Crossover Notch).' : `Driving ${instantVin > 0 ? 'positive' : 'negative'} half cycle.`}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Circuit Current Legend & Ammeter Summary HUD */}
            <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', fontSize: '0.74rem' }}>
              <div style={{ padding: '6px 10px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--accent-rose)', fontWeight: 700, display: 'block' }}>🔴 Collector Current Ic</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{iCollectorMa} mA</strong>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Ic = β × Ib = {iCollectorMa}mA</span>
              </div>

              <div style={{ padding: '6px 10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700, display: 'block' }}>🟡 Base Bias Current Ib</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{iBaseUa} µA</strong>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Ib = Ic / β</span>
              </div>

              <div style={{ padding: '6px 10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'block' }}>🟢 Emitter Current Ie</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{iEmitterMa} mA</strong>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Ie = Ic + Ib = (Ve / RE)</span>
              </div>

              <div style={{ padding: '6px 10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, display: 'block' }}>⚡ Q-Point Bias (VCEQ)</span>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{metrics.vCeq} V</strong>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Centered at VCC/2 ({((Number(metrics.vCeq) / params.vcc) * 100).toFixed(0)}%)</span>
              </div>
            </div>

            {/* Parameter Adjustment Sliders */}
            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  VCC Supply: <strong style={{ color: 'var(--accent-cyan)' }}>{params.vcc} V</strong>
                </label>
                <input
                  type="range"
                  min={5}
                  max={24}
                  value={params.vcc}
                  onChange={(e) => setParams({ ...params, vcc: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Input Vi Peak: <strong style={{ color: 'var(--accent-cyan)' }}>{params.vinPeak} V</strong>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={2.0}
                  step={0.05}
                  value={params.vinPeak}
                  onChange={(e) => setParams({ ...params, vinPeak: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Load Resistance (RL): <strong style={{ color: 'var(--accent-cyan)' }}>{params.rLoad} Ω</strong>
                </label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={params.rLoad}
                  onChange={(e) => setParams({ ...params, rLoad: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Gain β (hFE): <strong style={{ color: 'var(--accent-cyan)' }}>{params.beta || 100}</strong>
                </label>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={10}
                  value={params.beta || 100}
                  onChange={(e) => setParams({ ...params, beta: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}


        {/* TAB 2: WAVEFORMS & TRANSISTOR CHARACTERISTICS — Live from circuit parameters */}
        {activeTab === 'waveforms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>

            {/* Live status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', fontSize: '0.74rem', color: '#4ade80', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80', animation: 'pulse 1.5s infinite' }} />
              ⚡ LIVE — All 3 waveform panels update instantly from circuit sliders (Vcc={params.vcc}V, Vi={params.vinPeak}V, RL={params.rLoad}Ω, β={params.beta||100})
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Panel 1: Input vi vs Output Vo — Time Domain */}
              <div style={{ background: '#020617', borderRadius: '10px', padding: '12px', border: '1px solid rgba(56,189,248,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    📡 Time Domain — Vi ({params.vinPeak}V pk) → Vo ({metrics.vOutPeak}V pk, gain={metrics.voltageGain}×)
                  </span>
                  <button
                    onClick={() => setIsLiveAnim(!isLiveAnim)}
                    style={{ background: isLiveAnim ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)', border: `1px solid ${isLiveAnim ? '#4ade80' : 'var(--border-color)'}`, color: isLiveAnim ? '#4ade80' : 'var(--text-primary)', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isLiveAnim ? <Pause size={10} /> : <Play size={10} />}
                    <span>{isLiveAnim ? 'Running' : 'Paused'}</span>
                  </button>
                </div>
                <svg width="100%" height="160" viewBox={`0 0 ${svgW} ${svgH}`}>
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="50" height="44" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 44" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect x={pad} y={pad} width={svgW - 2*pad} height={svgH - 2*pad} fill="url(#grid)" />
                  <line x1={pad} y1={svgH/2} x2={svgW-pad} y2={svgH/2} stroke="#334155" strokeWidth={1.5} />
                  <text x={pad+2} y={svgH/2 - 4} fill="#475569" fontSize="8">0V</text>
                  <text x={pad+2} y={pad + 8} fill="var(--accent-cyan)" fontSize="8">+{params.vinPeak.toFixed(2)}V</text>
                  <text x={pad+2} y={svgH - pad - 2} fill="var(--accent-cyan)" fontSize="8">-{params.vinPeak.toFixed(2)}V</text>
                  {/* Input signal — dashed cyan */}
                  <path d={buildTimeDomainPath('vIn')} fill="none" stroke="#22d3ee" strokeWidth={2} strokeDasharray="7 4" />
                  {/* Output signal — solid red/pink, phase-inverted */}
                  <path d={buildTimeDomainPath('vOut')} fill="none" stroke="#f43f5e" strokeWidth={2.8} strokeLinecap="round" />
                  {/* Legend */}
                  <line x1={svgW-145} y1={svgH-6} x2={svgW-125} y2={svgH-6} stroke="#22d3ee" strokeWidth={2} strokeDasharray="5 3"/>
                  <text x={svgW-122} y={svgH-2} fill="#22d3ee" fontSize="9">Vi input</text>
                  <line x1={svgW-60} y1={svgH-6} x2={svgW-40} y2={svgH-6} stroke="#f43f5e" strokeWidth={2}/>
                  <text x={svgW-38} y={svgH-2} fill="#f43f5e" fontSize="9">Vo out (180° inv)</text>
                </svg>
              </div>

              {/* Panel 2: Ic vs Vce — Output Characteristics (Family of Ib curves + DC Load Line + Live Q-point) */}
              <div style={{ background: '#020617', borderRadius: '10px', padding: '12px', border: '1px solid rgba(74,222,128,0.3)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>📈 Output Characteristics: Ic (mA) vs Vce (V)</span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 7px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: '4px', color: '#fbbf24' }}>
                    Ib family • DC Load Line • Live Q
                  </span>
                </div>
                {(() => {
                  const beta = params.beta || 100;
                  const vcc = params.vcc;
                  const rL = params.rLoad;
                  const icSat = (vcc / rL) * 1000; // mA — Ic when Vce=0
                  const vCeq = metrics.vCeq;
                  const iCq = metrics.iCqMa;
                  const ibQua = (iCq / beta) * 1000; // µA — base current at Q-point
                  // Ib steps: build 6 equally spaced curves around Q-point
                  const ibStep = Math.max(8, Math.round(ibQua / 3));
                  const ibLevels = [ibStep, ibStep*2, ibStep*3, ibStep*4, ibStep*5, ibStep*6];
                  const vceMax = vcc * 1.1;
                  const icMax = icSat * 1.3;
                  const W = 285, H = 145, px = 32, py = 12;
                  const toX = (v: number) => px + (v / vceMax) * (W - px - 8);
                  const toY = (i: number) => H - py - (i / icMax) * (H - py - 8);
                  const colors = ['#22d3ee','#34d399','#a78bfa','#fb923c','#f472b6','#38bdf8'];

                  return (
                    <svg width="100%" height="150" viewBox={`0 0 ${W} ${H}`}>
                      {/* Grid lines */}
                      {[0.25,0.5,0.75,1.0].map(frac => (
                        <g key={`g${frac}`}>
                          <line x1={px} y1={toY(icMax*frac)} x2={W-8} y2={toY(icMax*frac)} stroke="#1e293b" strokeWidth={0.7} strokeDasharray="3 3"/>
                          <text x={1} y={toY(icMax*frac)+3} fill="#475569" fontSize="7">{(icMax*frac).toFixed(0)}</text>
                          <line x1={toX(vceMax*frac)} y1={py} x2={toX(vceMax*frac)} y2={H-py} stroke="#1e293b" strokeWidth={0.7} strokeDasharray="3 3"/>
                          <text x={toX(vceMax*frac)-5} y={H-py+10} fill="#475569" fontSize="7">{(vceMax*frac).toFixed(1)}</text>
                        </g>
                      ))}
                      {/* Axes */}
                      <line x1={px} y1={py} x2={px} y2={H-py} stroke="#64748b" strokeWidth={1.5}/>
                      <line x1={px} y1={H-py} x2={W-8} y2={H-py} stroke="#64748b" strokeWidth={1.5}/>
                      <text x={1} y={py+5} fill="var(--accent-cyan)" fontSize="8" fontWeight="700">Ic</text>
                      <text x={1} y={py+13} fill="var(--accent-cyan)" fontSize="7">mA</text>
                      <text x={W-35} y={H-py+11} fill="var(--accent-cyan)" fontSize="8" fontWeight="700">Vce (V)</text>
                      {/* Ib curves */}
                      {ibLevels.map((ibUa, idx) => {
                        const icActive = (ibUa / 1000) * beta; // mA
                        const pts: string[] = [];
                        for (let i = 0; i <= 50; i++) {
                          const v = (i / 50) * vceMax;
                          const ic = icActive * (1 - Math.exp(-v / 0.25)) + icActive * 0.03 * (v / vceMax);
                          pts.push(`${i===0?'M':'L'} ${toX(v).toFixed(1)} ${toY(Math.min(ic, icMax*0.97)).toFixed(1)}`);
                        }
                        const icEnd = Math.min((ibUa/1000)*beta, icMax*0.93);
                        return (
                          <g key={ibUa}>
                            <path d={pts.join(' ')} fill="none" stroke={colors[idx%colors.length]} strokeWidth={1.8} opacity={0.88}/>
                            <text x={W-50} y={toY(icEnd)+3} fill={colors[idx%colors.length]} fontSize="7" fontWeight="700">Ib={ibUa}µA</text>
                          </g>
                        );
                      })}
                      {/* DC Load Line */}
                      <line x1={toX(0)} y1={toY(icSat)} x2={toX(vcc)} y2={toY(0)} stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 3" opacity={0.9}/>
                      <text x={toX(vcc)-2} y={toY(0)-4} fill="#f43f5e" fontSize="7.5" fontWeight="700">{vcc}V</text>
                      <text x={toX(0)+2} y={toY(icSat)-3} fill="#f43f5e" fontSize="7.5" fontWeight="700">{icSat.toFixed(0)}mA</text>
                      {/* Q-point animated */}
                      <circle cx={toX(vCeq)} cy={toY(iCq)} r="9" fill="none" stroke="#fbbf24" strokeWidth={1.5} opacity={0.3}>
                        <animate attributeName="r" values="5;11;5" dur="2.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2.5s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx={toX(vCeq)} cy={toY(iCq)} r="4.5" fill="#fbbf24" stroke="#fff" strokeWidth={1.5}/>
                      <text x={toX(vCeq)+7} y={toY(iCq)-4} fill="#fbbf24" fontSize="8" fontWeight="800">Q ({vCeq.toFixed(1)}V, {iCq.toFixed(1)}mA)</text>
                      {/* Drop lines */}
                      <line x1={toX(vCeq)} y1={toY(iCq)} x2={toX(vCeq)} y2={H-py} stroke="#fbbf24" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5}/>
                      <line x1={px} y1={toY(iCq)} x2={toX(vCeq)} y2={toY(iCq)} stroke="#fbbf24" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5}/>
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* Panel 3: Ib vs Vbe — Input Characteristic (full width) */}
            <div style={{ background: '#020617', borderRadius: '10px', padding: '12px', border: '1px solid rgba(251,191,36,0.3)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>🔶 Input Characteristic: Ib (µA) vs Vbe (V) — NPN Transistor SL100/BC547</span>
                <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>β={params.beta||100} → IBQ={((metrics.iCqMa/(params.beta||100))*1000).toFixed(1)}µA at Q-point</span>
              </div>
              {(() => {
                const beta = params.beta || 100;
                const ibQ = (metrics.iCqMa / beta) * 1000; // µA at Q-point
                const vbeKnee = 0.65;
                const W3 = 860, H3 = 115, px3 = 42, py3 = 10;
                const vbeMax = 1.05;
                const ibMax = Math.max(ibQ * 2.8, 80);
                const toX3 = (v: number) => px3 + (v / vbeMax) * (W3 - px3 - 15);
                const toY3 = (ib: number) => H3 - py3 - (ib / ibMax) * (H3 - py3 - 8);
                // Build Ib vs Vbe curve (diode equation + Early effect)
                const pts3: string[] = [];
                for (let i = 0; i <= 100; i++) {
                  const vbe = (i / 100) * vbeMax;
                  // Approximate: Ib = 0 below ~0.55V, then exponential rise
                  let ib = 0;
                  if (vbe > 0.55) {
                    ib = Math.pow((vbe - 0.55) * 180, 2.4) * (80 / beta);
                  }
                  pts3.push(`${i===0?'M':'L'} ${toX3(vbe).toFixed(1)} ${toY3(Math.min(ib, ibMax*0.97)).toFixed(1)}`);
                }
                // Compute Vbe at Q-point
                const vbeQ = 0.65 + Math.log(1 + ibQ/50) * 0.025;
                const qX3 = toX3(Math.min(vbeQ, vbeMax * 0.95));
                const qY3 = toY3(Math.min(ibQ, ibMax * 0.93));
                return (
                  <svg width="100%" height="120" viewBox={`0 0 ${W3} ${H3}`}>
                    {/* Grid */}
                    {[0.2,0.4,0.6,0.8,1.0].map(frac => (
                      <g key={`vbg${frac}`}>
                        <line x1={toX3(vbeMax*frac)} y1={py3} x2={toX3(vbeMax*frac)} y2={H3-py3} stroke="#1e293b" strokeWidth={0.7} strokeDasharray="3 3"/>
                        <text x={toX3(vbeMax*frac)-8} y={H3-py3+10} fill="#475569" fontSize="7.5">{(vbeMax*frac).toFixed(2)}V</text>
                      </g>
                    ))}
                    {[0.25,0.5,0.75,1.0].map(frac => (
                      <g key={`ibg${frac}`}>
                        <line x1={px3} y1={toY3(ibMax*frac)} x2={W3-15} y2={toY3(ibMax*frac)} stroke="#1e293b" strokeWidth={0.7} strokeDasharray="3 3"/>
                        <text x={1} y={toY3(ibMax*frac)+3} fill="#475569" fontSize="7.5">{(ibMax*frac).toFixed(0)}</text>
                      </g>
                    ))}
                    {/* Axes */}
                    <line x1={px3} y1={py3} x2={px3} y2={H3-py3} stroke="#64748b" strokeWidth={1.5}/>
                    <line x1={px3} y1={H3-py3} x2={W3-15} y2={H3-py3} stroke="#64748b" strokeWidth={1.5}/>
                    <text x={1} y={py3+6} fill="#fbbf24" fontSize="8.5" fontWeight="700">Ib (µA)</text>
                    <text x={W3-60} y={H3-py3+11} fill="#fbbf24" fontSize="8.5" fontWeight="700">Vbe (V)</text>
                    {/* Vbe knee annotation */}
                    <line x1={toX3(vbeKnee)} y1={py3} x2={toX3(vbeKnee)} y2={H3-py3} stroke="#334155" strokeWidth={1} strokeDasharray="3 2"/>
                    <text x={toX3(vbeKnee)-2} y={py3+7} fill="#64748b" fontSize="7.5">Vbe(ON)≈0.65V</text>
                    {/* Ib vs Vbe curve */}
                    <path d={pts3.join(' ')} fill="none" stroke="#fbbf24" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"/>
                    {/* Q-point */}
                    <circle cx={qX3} cy={qY3} r="8" fill="none" stroke="#fbbf24" strokeWidth={1.2} opacity={0.3}>
                      <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.3;0.07;0.3" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx={qX3} cy={qY3} r="5" fill="#fbbf24" stroke="#fff" strokeWidth={1.5}/>
                    <text x={qX3+8} y={qY3-4} fill="#fbbf24" fontSize="9" fontWeight="800">
                      Q: Vbe≈{vbeQ.toFixed(3)}V, Ib={ibQ.toFixed(1)}µA
                    </text>
                    <line x1={qX3} y1={qY3} x2={qX3} y2={H3-py3} stroke="#fbbf24" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5}/>
                    <line x1={px3} y1={qY3} x2={qX3} y2={qY3} stroke="#fbbf24" strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5}/>
                  </svg>
                );
              })()}
            </div>

            {/* Live Metrics Summary Bar */}
            <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              <span>⚡ VCEQ: <strong style={{ color: 'var(--accent-cyan)' }}>{metrics.vCeq}V</strong></span>
              <span>⚡ ICQ: <strong style={{ color: 'var(--accent-amber)' }}>{metrics.iCqMa}mA</strong></span>
              <span>⚡ IBQ: <strong style={{ color: '#fbbf24' }}>{((metrics.iCqMa/(params.beta||100))*1000).toFixed(1)}µA</strong></span>
              <span>⚡ Gain Av: <strong style={{ color: 'var(--accent-cyan)' }}>{metrics.voltageGain}×</strong></span>
              <span>⚡ η: <strong style={{ color: 'var(--accent-emerald)' }}>{metrics.efficiency}%</strong></span>
              <span>⚡ THD: <strong style={{ color: 'var(--accent-rose)' }}>{metrics.thdPercent}%</strong></span>
            </div>
          </div>
        )}

        {/* TAB 3: MSBTE TABLE NO 1.1 / 2.1 OBSERVATIONS & CALCULATIONS */}
        {activeTab === 'table' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedPracticalNo === 2 ? 'Table No. 2.1 Observation Table: Performance of Class B Push Pull Amplifier' : 'Table No. 1.1: Performance Observations & Calculations'}
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {selectedPracticalNo === 2
                    ? `MSBTE Formulas: Pi = Vi² / Ri (${p2Rin}Ω) • Po = Vo² / Ro (${p2Rout}Ω) • % Efficiency = (Po / Pi) · 100`
                    : 'Calculated formulas: Pac = Vo² / (2 · RL) • Pdc = Vcc · Icq • % Efficiency = (Pac / Pdc) · 100'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={selectedPracticalNo === 2 ? handleAddP2Observation : handleAddObservation}
                  style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  + Add Live Observation Row
                </button>
                <button
                  onClick={handleExportLabReport}
                  style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--accent-cyan)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  <Download size={12} /> Export Table (.txt)
                </button>
              </div>
            </div>

            <div style={{ borderRadius: '10px', border: '1px solid var(--border-color)', overflow: 'hidden', background: 'var(--bg-panel)' }}>
              {selectedPracticalNo === 2 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: '#f43f5e', textAlign: 'center' }}>
                      <th style={{ padding: '8px' }}>Sr. No.</th>
                      <th style={{ padding: '8px' }}>Input Voltage [Vi] (V)</th>
                      <th style={{ padding: '8px' }}>Output Voltage [Vo] (V)</th>
                      <th style={{ padding: '8px' }}>Pi = Vi² / Ri (Watts)</th>
                      <th style={{ padding: '8px' }}>Po = Vo² / Ro (Watts)</th>
                      <th style={{ padding: '8px' }}>% Efficiency = (Po / Pi) · 100</th>
                      <th style={{ padding: '8px' }}>Q1 Ic Peak (mA)</th>
                      <th style={{ padding: '8px' }}>Q2 Ic Peak (mA)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p2ObsRows.map((row) => (
                      <tr key={row.srNo} style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <td style={{ padding: '8px', fontWeight: 700 }}>{row.srNo}</td>
                        <td style={{ padding: '8px', color: '#38bdf8' }}>{row.vIn} V</td>
                        <td style={{ padding: '8px', color: '#38bdf8' }}>{row.vOut} V</td>
                        <td style={{ padding: '8px' }}>{row.pIn} W</td>
                        <td style={{ padding: '8px' }}>{row.pOut} W</td>
                        <td style={{ padding: '8px', color: '#4ade80', fontWeight: 800 }}>{row.efficiency}%</td>
                        <td style={{ padding: '8px', color: '#f43f5e' }}>{row.icQ1Ma} mA</td>
                        <td style={{ padding: '8px', color: '#4ade80' }}>{row.icQ2Ma} mA</td>
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(244, 63, 94, 0.1)', textAlign: 'center', fontWeight: 700 }}>
                      <td style={{ padding: '8px', color: '#f43f5e' }}>Live</td>
                      <td style={{ padding: '8px', color: '#38bdf8' }}>{currentP2ObsRow.vIn} V</td>
                      <td style={{ padding: '8px', color: '#38bdf8' }}>{currentP2ObsRow.vOut} V</td>
                      <td style={{ padding: '8px' }}>{currentP2ObsRow.pIn} W</td>
                      <td style={{ padding: '8px' }}>{currentP2ObsRow.pOut} W</td>
                      <td style={{ padding: '8px', color: '#4ade80' }}>{currentP2ObsRow.efficiency}%</td>
                      <td style={{ padding: '8px' }}>{currentP2ObsRow.icQ1Ma} mA</td>
                      <td style={{ padding: '8px' }}>{currentP2ObsRow.icQ2Ma} mA</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', color: 'var(--accent-cyan)', textAlign: 'center' }}>
                      <th style={{ padding: '8px' }}>Sr. No.</th>
                      <th style={{ padding: '8px' }}>Input Voltage [Vi] (V)</th>
                      <th style={{ padding: '8px' }}>Output Voltage [Vo] (V)</th>
                      <th style={{ padding: '8px' }}>Pac = Vo² / 2RL (Watts)</th>
                      <th style={{ padding: '8px' }}>Pdc = Vcc · Icq (Watts)</th>
                      <th style={{ padding: '8px' }}>% Efficiency = (Pac / Pdc) · 100</th>
                      <th style={{ padding: '8px' }}>Base Ib (µA)</th>
                      <th style={{ padding: '8px' }}>Collector Ic (mA)</th>
                      <th style={{ padding: '8px' }}>Vce (V)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {observationRows.map((row) => (
                      <tr key={row.srNo} style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <td style={{ padding: '8px', fontWeight: 700 }}>{row.srNo}</td>
                        <td style={{ padding: '8px', color: 'var(--accent-cyan)' }}>{row.vIn} V</td>
                        <td style={{ padding: '8px', color: 'var(--accent-cyan)' }}>{row.vOut} V</td>
                        <td style={{ padding: '8px' }}>{row.pAc} W</td>
                        <td style={{ padding: '8px' }}>{row.pDc} W</td>
                        <td style={{ padding: '8px', color: 'var(--accent-emerald)', fontWeight: 800 }}>{row.efficiency}%</td>
                        <td style={{ padding: '8px', color: 'var(--accent-amber)' }}>{row.iBaseUa} µA</td>
                        <td style={{ padding: '8px', color: 'var(--accent-amber)' }}>{row.iCollectorMa} mA</td>
                        <td style={{ padding: '8px' }}>{row.vCe} V</td>
                      </tr>
                    ))}
                    {/* Current Active Live Row */}
                    <tr style={{ background: 'rgba(56, 189, 248, 0.1)', textAlign: 'center', fontWeight: 700 }}>
                      <td style={{ padding: '8px', color: 'var(--accent-cyan)' }}>Live</td>
                      <td style={{ padding: '8px', color: 'var(--accent-cyan)' }}>{currentObsRow.vIn} V</td>
                      <td style={{ padding: '8px', color: 'var(--accent-cyan)' }}>{currentObsRow.vOut} V</td>
                      <td style={{ padding: '8px' }}>{currentObsRow.pAc} W</td>
                      <td style={{ padding: '8px' }}>{currentObsRow.pDc} W</td>
                      <td style={{ padding: '8px', color: 'var(--accent-emerald)' }}>{currentObsRow.efficiency}%</td>
                      <td style={{ padding: '8px' }}>{currentObsRow.iBaseUa} µA</td>
                      <td style={{ padding: '8px' }}>{currentObsRow.iCollectorMa} mA</td>
                      <td style={{ padding: '8px' }}>{currentObsRow.vCe} V</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {selectedPracticalNo === 2 && (
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                <h4 style={{ color: '#f59e0b', marginBottom: '6px', fontWeight: 700 }}>XIII. Observations, Formulas & Calculations (MSBTE Manual Image 2)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: 'var(--text-secondary)' }}>
                  <div>
                    <p><strong>Ri = {p2Rin} Ω</strong> (Input resistance measured at input of Class-B amplifier using DMM)</p>
                    <p><strong>Ro = {p2Rout} Ω</strong> (Output resistance measured at output of Class-B amplifier using DMM)</p>
                  </div>
                  <div>
                    <p><strong>i. Pi = Vi² / Ri =</strong> ({(2.0 * 2.0 / p2Rin).toFixed(4)} W when Vi=2V)</p>
                    <p><strong>ii. Po = Vo² / Ro =</strong> ({(2.6 * 2.6 / p2Rout).toFixed(4)} W when Vo=2.6V)</p>
                    <p><strong>iii. % Efficiency = Po / Pi * 100 =</strong> <span style={{ color: '#4ade80', fontWeight: 800 }}>{p2ObsRows.find((r) => r.vIn === 2.0)?.efficiency || 1149.66}%</span></p>
                  </div>
                </div>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  <span><strong>XIV. Results:</strong> % Efficiency = {p2ObsRows.find((r) => r.vIn === 2.0)?.efficiency || 1149.66}% (When Vi = 2 Volt)</span>
                  <span><strong>XV. Interpretation:</strong> Class B Push-Pull provides high power output & efficiency up to 78.5%.</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MSBTE EXPERIMENT MANUAL */}
        {activeTab === 'manual' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                Practical No.1: Test the performance of single stage Class A power amplifier
              </h3>
              <p><strong>Course:</strong> Analog Electronics (313324) • MSBTE ('K' Scheme)</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>I. Practical Significance</h4>
              <p>Class A power amplifier is used in PA systems. It is the simplest of all power amplifier configurations with high fidelity and zero crossover distortion.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>VII. Resources Required</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginTop: '6px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-panel)', textAlign: 'left', color: 'var(--accent-cyan)' }}>
                    <th style={{ padding: '6px' }}>Name of Resource</th>
                    <th style={{ padding: '6px' }}>Suggested Broad Specification</th>
                    <th style={{ padding: '6px' }}>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px' }}>Cathode Ray Oscilloscope (CRO)</td>
                    <td style={{ padding: '6px' }}>20/30/100 MHz Frequency</td>
                    <td style={{ padding: '6px' }}>1 No.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Regulated DC Power Supply</td>
                    <td style={{ padding: '6px' }}>0-30V, 2Amp SC protection Vcc=12V</td>
                    <td style={{ padding: '6px' }}>1 No.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Function Generator</td>
                    <td style={{ padding: '6px' }}>0-2 MHz Sine/Square/Triangle output</td>
                    <td style={{ padding: '6px' }}>1 No.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Transistor</td>
                    <td style={{ padding: '6px' }}>SL100 / BC547 / BD115</td>
                    <td style={{ padding: '6px' }}>1 No.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Resistors & Capacitors</td>
                    <td style={{ padding: '6px' }}>R1=47kΩ, R2=33kΩ, RE=560Ω, RL=220Ω, C1=10µF, CE=47µF</td>
                    <td style={{ padding: '6px' }}>1 Set</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>IX. Procedure</h4>
              <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Build circuit on breadboard as per diagram (Fig 1.1).</li>
                <li>Set frequency and amplitude of sine wave input signal on function generator with CRO.</li>
                <li>Connect function generator at input terminal and DC supply to amplifier circuit.</li>
                <li>Switch ON DC power supply, function generator, and CRO.</li>
                <li>Vary amplitude of sine wave from function generator and measure output voltage on CRO.</li>
                <li>Calculate Pac, Pdc, and % efficiency using given formulas.</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 5: MSBTE PRACTICAL RELATED QUESTIONS & ANSWERS */}
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: selectedPracticalNo === 2 ? '#f43f5e' : 'var(--accent-cyan)', marginBottom: '4px' }}>
                {selectedPracticalNo === 2
                  ? 'XVII. Practical Related Questions & Solutions (MSBTE Manual Image 1)'
                  : 'XVI. Practical Related Questions & Official MSBTE Solutions'}
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Official MSBTE ('K' Scheme) practical questions and model solutions for student laboratory viva and exams.
              </p>
            </div>

            {selectedPracticalNo === 2 ? (
              <>
                {/* Practical 2 Q1 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: '#f43f5e', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Q1. What is meant by Cross Over Distortion?</span>
                    <button
                      onClick={() => setP2QuizAnswers((prev) => ({ ...prev, 1: !prev[1] }))}
                      style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      {p2QuizAnswers[1] ? 'Hide Solution' : 'Show Answer'}
                    </button>
                  </div>
                  {(p2QuizAnswers[1] ?? true) && (
                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <p><strong>Answer:</strong></p>
                      <p>
                        Crossover distortion is a type of non-linear waveform distortion that occurs in Class B push-pull amplifiers during the zero-crossing transition when one transistor turns OFF and the other turns ON.
                      </p>
                      <p style={{ marginTop: '4px' }}>
                        Because silicon BJTs (NPN 2N3904 and PNP 2N3906) require a minimum base-emitter cutoff threshold voltage of <strong>VBE ≈ 0.6V to 0.7V</strong> to conduct, there exists a deadband region between -0.7V and +0.7V where <strong>neither transistor conducts (both in Cutoff, IB = 0)</strong>. This causes a flat horizontal notch near the zero voltage crossing on the output waveform.
                      </p>
                    </div>
                  )}
                </div>

                {/* Practical 2 Q2 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: '#f43f5e', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Q2. State the applications of Class B Push Pull Amplifier.</span>
                    <button
                      onClick={() => setP2QuizAnswers((prev) => ({ ...prev, 2: !prev[2] }))}
                      style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      {p2QuizAnswers[2] ? 'Hide Solution' : 'Show Answer'}
                    </button>
                  </div>
                  {(p2QuizAnswers[2] ?? true) && (
                    <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <p><strong>Answer: Key Engineering Applications:</strong></p>
                      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                        <li><strong>Audio Power Output Stages:</strong> Used in public address (PA) systems, speakers, and audio amplifiers for driving 4Ω to 16Ω loads.</li>
                        <li><strong>RF Power Amplifiers:</strong> Used in radio transmitters and communication systems.</li>
                        <li><strong>Motor Speed Drivers & Servo Amplifiers:</strong> Used to drive current in either direction through DC motors.</li>
                        <li><strong>Portable Battery Operated Devices:</strong> Selected due to high collector efficiency (up to 78.5%) and zero idle DC power consumption.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Practical 2 Q3 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: '#f43f5e', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Q3. State the difference between a Voltage Amplifier and a Power Amplifier.</span>
                    <button
                      onClick={() => setP2QuizAnswers((prev) => ({ ...prev, 3: !prev[3] }))}
                      style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      {p2QuizAnswers[3] ? 'Hide Solution' : 'Show Answer'}
                    </button>
                  </div>
                  {(p2QuizAnswers[3] ?? true) && (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginTop: '4px' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-panel)', color: '#f43f5e', textAlign: 'left' }}>
                            <th style={{ padding: '6px' }}>Parameter</th>
                            <th style={{ padding: '6px' }}>Voltage Amplifier</th>
                            <th style={{ padding: '6px' }}>Power Amplifier</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Primary Objective</td>
                            <td style={{ padding: '6px' }}>Raise signal voltage amplitude (Av)</td>
                            <td style={{ padding: '6px' }}>Deliver maximum AC power to load (Po)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Input Signal Amplitude</td>
                            <td style={{ padding: '6px' }}>Small signals (mV range)</td>
                            <td style={{ padding: '6px' }}>Large signals (Volts range)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Load Impedance (RL)</td>
                            <td style={{ padding: '6px' }}>High load resistance (10kΩ - 100kΩ)</td>
                            <td style={{ padding: '6px' }}>Low load resistance (4Ω - 100Ω)</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Collector Efficiency (η)</td>
                            <td style={{ padding: '6px' }}>Low priority (&lt; 10%)</td>
                            <td style={{ padding: '6px' }}>High priority (up to 78.5% in Class B)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Practical 2 Q4 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: '#f43f5e', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Q4. State the difference between an Amplifier and an Oscillator.</span>
                    <button
                      onClick={() => setP2QuizAnswers((prev) => ({ ...prev, 4: !prev[4] }))}
                      style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #f43f5e', background: 'transparent', color: '#f43f5e', fontSize: '0.7rem', cursor: 'pointer' }}
                    >
                      {p2QuizAnswers[4] ? 'Hide Solution' : 'Show Answer'}
                    </button>
                  </div>
                  {(p2QuizAnswers[4] ?? true) && (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginTop: '4px' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-panel)', color: '#f43f5e', textAlign: 'left' }}>
                            <th style={{ padding: '6px' }}>Parameter</th>
                            <th style={{ padding: '6px' }}>Amplifier</th>
                            <th style={{ padding: '6px' }}>Oscillator</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Input Signal Required</td>
                            <td style={{ padding: '6px' }}>Requires external AC input signal</td>
                            <td style={{ padding: '6px' }}>No external AC input signal needed</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Feedback Mechanism</td>
                            <td style={{ padding: '6px' }}>Negative feedback (for stability)</td>
                            <td style={{ padding: '6px' }}>Positive feedback (Barkhausen criterion)</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Energy Conversion</td>
                            <td style={{ padding: '6px' }}>Converts DC energy to AC signal controlled by input</td>
                            <td style={{ padding: '6px' }}>Converts DC power into self-sustaining AC waveform</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Question 1 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    Q1. List the low power transistor and high-power transistor using a datasheet.
                  </div>
                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <p><strong>Answer:</strong></p>
                    <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                      <li>
                        <strong style={{ color: 'var(--accent-amber)' }}>Low Power Transistors (Small Signal):</strong> BC547, BC548, 2N2222, BC557, C9014. These are low-current transistors used in audio preamplifiers, sensor signal conditioning, and switching circuits. (Max power dissipation PD &lt; 1W, collector current IC &lt; 500mA, TO-92 plastic package).
                      </li>
                      <li style={{ marginTop: '4px' }}>
                        <strong style={{ color: 'var(--accent-rose)' }}>High Power Transistors:</strong> 2N3055, TIP31C, BD139, SL100, BD115, TIP122. These handle large currents and voltages in power output stages and motor drives. (Max power dissipation PD &gt; 10W up to 115W, collector current IC &gt; 1.5A up to 15A, TO-3 metal can or TO-220 packages requiring heatsinks).
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Question 2 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    Q2. List the ratings of low power transistors and high power transistors using a datasheet.
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: '6px' }}><strong>Answer: Technical Datasheet Parameter Comparison Table</strong></p>
                    <div style={{ borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-panel)', color: 'var(--accent-cyan)', textAlign: 'left' }}>
                            <th style={{ padding: '6px' }}>Datasheet Rating / Parameter</th>
                            <th style={{ padding: '6px' }}>BC547 (Low Power)</th>
                            <th style={{ padding: '6px' }}>2N3055 (High Power)</th>
                            <th style={{ padding: '6px' }}>SL100 (Medium/High Power)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Collector-Emitter Voltage (VCEO)</td>
                            <td style={{ padding: '6px' }}>45 V</td>
                            <td style={{ padding: '6px' }}>60 V</td>
                            <td style={{ padding: '6px' }}>50 V</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Max Collector Current (IC max)</td>
                            <td style={{ padding: '6px' }}>100 mA</td>
                            <td style={{ padding: '6px' }}>15 A</td>
                            <td style={{ padding: '6px' }}>800 mA</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Max Power Dissipation (PD max)</td>
                            <td style={{ padding: '6px' }}>500 mW (0.5W)</td>
                            <td style={{ padding: '6px' }}>115 W (with sink)</td>
                            <td style={{ padding: '6px' }}>800 mW (3W with sink)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>DC Current Gain (hFE / β)</td>
                            <td style={{ padding: '6px' }}>110 to 800</td>
                            <td style={{ padding: '6px' }}>20 to 70</td>
                            <td style={{ padding: '6px' }}>50 to 300</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Package / Case Construction</td>
                            <td style={{ padding: '6px' }}>TO-92 (Plastic)</td>
                            <td style={{ padding: '6px' }}>TO-3 (Metal Can)</td>
                            <td style={{ padding: '6px' }}>TO-39 (Metal Can)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Question 3 */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                    Q3. Differentiate Class A, B, AB, C power amplifier.
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <p style={{ marginBottom: '6px' }}><strong>Answer: Power Amplifier Classification Comparison Matrix</strong></p>
                    <div style={{ borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.73rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-panel)', color: 'var(--accent-cyan)', textAlign: 'left' }}>
                            <th style={{ padding: '6px' }}>Parameter</th>
                            <th style={{ padding: '6px' }}>Class A</th>
                            <th style={{ padding: '6px' }}>Class B</th>
                            <th style={{ padding: '6px' }}>Class AB</th>
                            <th style={{ padding: '6px' }}>Class C</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Operating Q-Point</td>
                            <td style={{ padding: '6px' }}>Center of Load line</td>
                            <td style={{ padding: '6px' }}>At Cutoff (IB=0)</td>
                            <td style={{ padding: '6px' }}>Slightly above Cutoff</td>
                            <td style={{ padding: '6px' }}>Deep inside Cutoff</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Conduction Angle (θ)</td>
                            <td style={{ padding: '6px' }}>360° (Full cycle)</td>
                            <td style={{ padding: '6px' }}>180° (Half cycle)</td>
                            <td style={{ padding: '6px' }}>200° to 220°</td>
                            <td style={{ padding: '6px' }}>&lt; 120° (Short pulses)</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Theoretical Max Efficiency</td>
                            <td style={{ padding: '6px' }}>25% (Direct) / 50%</td>
                            <td style={{ padding: '6px' }}>78.5%</td>
                            <td style={{ padding: '6px' }}>60% to 70%</td>
                            <td style={{ padding: '6px' }}>80% to 90%</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Distortion Level</td>
                            <td style={{ padding: '6px' }}>Minimum (High fidelity)</td>
                            <td style={{ padding: '6px' }}>Crossover distortion</td>
                            <td style={{ padding: '6px' }}>Zero crossover distortion</td>
                            <td style={{ padding: '6px' }}>High harmonic distortion</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '6px', fontWeight: 600 }}>Primary Application</td>
                            <td style={{ padding: '6px' }}>Audio Preamplifiers</td>
                            <td style={{ padding: '6px' }}>Push-Pull Output Stages</td>
                            <td style={{ padding: '6px' }}>Hi-Fi Audio Amplifiers</td>
                            <td style={{ padding: '6px' }}>RF Transmitters / Tuned</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
