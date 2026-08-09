import React, { useState, useEffect } from 'react';
import type { CircuitNode, NodeType } from '../types/logic';
import {
  calculatePracticalMetrics,
  generatePracticalWaveformPoints,
  calculateMsbteObservationRow,
  AMPLIFIER_LAB_SPECS,
  type PracticalAmpParams,
  type PracticalAmpMetrics,
  type WaveformPoint,
  type MsbteObservationRow,
} from '../engine/AmplifierEngine';
import { Activity, X, Play, Pause, BarChart2, FileText, Download, CheckCircle2, Cpu, HelpCircle, Zap, RefreshCw, Layers, Info } from 'lucide-react';

interface AmplifierLabModalProps {
  nodes: CircuitNode[];
  selectedNodeId: string | null;
  onClose: () => void;
}

export const AmplifierLabModal: React.FC<AmplifierLabModalProps> = ({ onClose }) => {
  // Subject & Practical Selection
  const [selectedSubject, setSelectedSubject] = useState<'analog' | 'power' | 'digital'>('analog');
  const [activeTab, setActiveTab] = useState<'circuit' | 'waveforms' | 'table' | 'manual' | 'questions'>('circuit');

  // Amplifier Lab Parameters
  const [selectedAmpType, setSelectedAmpType] = useState<NodeType>('AMP_CLASS_A');
  const [params, setParams] = useState<PracticalAmpParams>(AMPLIFIER_LAB_SPECS['AMP_CLASS_A'].defaultParams);

  // Live Sweep Animation & Current Flow Controls
  const [isLiveAnim, setIsLiveAnim] = useState<boolean>(true);
  const [animOffset, setAnimOffset] = useState<number>(0);

  // Interactive Current Flow Visualization Controls
  const [showCurrentFlow, setShowCurrentFlow] = useState<boolean>(true);
  const [currentFlowType, setCurrentFlowType] = useState<'conventional' | 'electron'>('conventional');
  const [currentPathFilter, setCurrentPathFilter] = useState<'all' | 'collector' | 'base' | 'emitter' | 'bias' | 'ac'>('all');
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);

  // MSBTE Observation Table Rows

  const [observationRows, setObservationRows] = useState<MsbteObservationRow[]>([
    calculateMsbteObservationRow(1, 0.2, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(2, 0.4, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(3, 0.6, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(4, 0.8, 12, 220, 4.0, 100),
    calculateMsbteObservationRow(5, 1.0, 12, 220, 4.0, 100),
  ]);

  // Sync default params when switching class
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

  // Recalculate observation table whenever VCC or Load Resistance changes
  useEffect(() => {
    setObservationRows((prev) =>
      prev.map((row) =>
        calculateMsbteObservationRow(row.srNo, row.vIn, params.vcc, params.rLoad, params.gain, params.beta || 100)
      )
    );
  }, [params.vcc, params.rLoad, params.gain, params.beta]);

  const currentSpec = AMPLIFIER_LAB_SPECS[selectedAmpType] || AMPLIFIER_LAB_SPECS['AMP_CLASS_A'];
  const metrics: PracticalAmpMetrics = calculatePracticalMetrics(params);
  const wavePoints: WaveformPoint[] = generatePracticalWaveformPoints(params, 180, animOffset);

  // Dynamic Real-Time Circuit Branch Current Calculations for Visual Schematic
  const vBaseBias = params.vcc * (33 / (47 + 33)); // Voltage divider output (~0.4125 * VCC)
  const vEmitter = Math.max(0, vBaseBias - 0.7);
  const iEmitterMa = Number((vEmitter / 0.56).toFixed(2)); // RE = 560Ω -> 0.56kΩ
  const betaVal = params.beta || 100;
  const iCollectorMa = Number((iEmitterMa * (betaVal / (betaVal + 1))).toFixed(2));
  const iBaseUa = Number(((iCollectorMa * 1000) / betaVal).toFixed(1));
  const iBiasMa = Number(((params.vcc - vBaseBias) / 47).toFixed(2));
  const vCeqVal = Math.max(0.2, params.vcc - (iCollectorMa / 1000) * params.rLoad - vEmitter).toFixed(2);

  // Active current observation point
  const currentObsRow = calculateMsbteObservationRow(
    observationRows.length + 1,
    params.vinPeak,
    params.vcc,
    params.rLoad,
    params.gain,
    params.beta || 100
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

  // Add observation row function
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

  // Export Practical Report (.txt)
  const handleExportLabReport = () => {
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
          maxWidth: '920px',
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
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
              <Activity size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Analog Electronics (313324) • Practical No. 1: Test performance of single stage Class A power amplifier
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

        {/* Subject Selector & Amplifier Class Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedSubject('analog')}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
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
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
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
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
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
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
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
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'circuit' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'circuit' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Cpu size={15} /> Visual Circuit Diagram
          </button>

          <button
            onClick={() => setActiveTab('waveforms')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'waveforms' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'waveforms' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <BarChart2 size={15} /> Waveforms & Output Characteristics
          </button>

          <button
            onClick={() => setActiveTab('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'table' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'table' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <FileText size={15} /> Table 1.1 Observation & Calculations
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'manual' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'manual' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <CheckCircle2 size={15} /> Experiment Manual (MSBTE)
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'questions' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'questions' ? '#0f172a' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <HelpCircle size={15} /> Questions & Answers (XVI)
          </button>
        </div>

        {/* TAB 1: VISUAL CIRCUIT DIAGRAM (FIG 1.1) */}
        {activeTab === 'circuit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {/* Header & Controls Bar */}
            <div style={{ background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="var(--accent-amber)" />
                  Fig 1.1: Single Stage Class A Power Amplifier Circuit Setup (Current Flow Animated)
                </span>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Interactive schematic with live DC bias & AC current flow paths (Ic, Ib, Ie, Ibias), component tooltips, and ammeter readouts.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowCurrentFlow(!showCurrentFlow)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${showCurrentFlow ? '#4ade80' : 'var(--border-color)'}`,
                    background: showCurrentFlow ? 'rgba(74, 222, 128, 0.15)' : 'var(--bg-panel)',
                    color: showCurrentFlow ? '#4ade80' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Zap size={14} />
                  <span>Current Flow: {showCurrentFlow ? 'ON ⚡' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setCurrentFlowType(currentFlowType === 'conventional' ? 'electron' : 'conventional')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--accent-cyan)',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} />
                  <span>{currentFlowType === 'conventional' ? '🔴 Conventional (+→−)' : '⚛️ Electron Flow (−→+)'}</span>
                </button>

                <button
                  onClick={handleExportLabReport}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-panel)',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} /> Report (.txt)
                </button>
              </div>
            </div>

            {/* Current Path Filter Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', padding: '6px 10px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.74rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={13} /> Highlight Path:
              </span>
              <button
                onClick={() => setCurrentPathFilter('all')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: currentPathFilter === 'all' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                  background: currentPathFilter === 'all' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: currentPathFilter === 'all' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🌟 All Paths
              </button>
              <button
                onClick={() => setCurrentPathFilter('collector')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: currentPathFilter === 'collector' ? '1px solid var(--accent-rose)' : '1px solid transparent',
                  background: currentPathFilter === 'collector' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                  color: currentPathFilter === 'collector' ? 'var(--accent-rose)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🔴 Collector Ic ({iCollectorMa} mA)
              </button>
              <button
                onClick={() => setCurrentPathFilter('base')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: currentPathFilter === 'base' ? '1px solid var(--accent-amber)' : '1px solid transparent',
                  background: currentPathFilter === 'base' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  color: currentPathFilter === 'base' ? 'var(--accent-amber)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🟡 Base Bias Ib ({iBaseUa} µA)
              </button>
              <button
                onClick={() => setCurrentPathFilter('emitter')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: currentPathFilter === 'emitter' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                  background: currentPathFilter === 'emitter' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: currentPathFilter === 'emitter' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🟢 Emitter Ie ({iEmitterMa} mA)
              </button>
              <button
                onClick={() => setCurrentPathFilter('ac')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: currentPathFilter === 'ac' ? '1px solid #38bdf8' : '1px solid transparent',
                  background: currentPathFilter === 'ac' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: currentPathFilter === 'ac' ? '#38bdf8' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🔵 AC Signal Vi/Vo
              </button>
            </div>

            {/* Interactive Circuit Schematic SVG with Animated Current Flow */}
            <div style={{ background: '#020617', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', minHeight: '310px' }}>
              <svg width="100%" height="310" viewBox="0 0 720 310" preserveAspectRatio="xMidYMid meet">
                {/* SVG Definitions for Gradients, Markers & Effects */}
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
                  <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Background Pattern */}
                <pattern id="circuit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.6" />
                </pattern>
                <rect width="720" height="310" fill="url(#circuit-grid)" />

                {/* Power Rails */}
                <line x1="60" y1="35" x2="660" y2="35" stroke="var(--accent-rose)" strokeWidth="3" />
                <text x="670" y="39" fill="var(--accent-rose)" fontSize="12" fontWeight="700">+Vcc ({params.vcc}V)</text>

                <line x1="60" y1="270" x2="660" y2="270" stroke="#475569" strokeWidth="3" />
                <text x="670" y="274" fill="#94a3b8" fontSize="12" fontWeight="700">0V Ground</text>

                {/* ======================= CLASS A SCHEMATIC (DEFAULT PRACTICAL 1) ======================= */}
                {selectedAmpType === 'AMP_CLASS_A' && (
                  <g>
                    {/* Input AC Signal Generator */}
                    <g
                      onMouseEnter={() => setHoveredComponent('vi')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="80" cy="150" r="18" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                      <path d="M 70 150 Q 75 140 80 150 T 90 150" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
                      <line x1="80" y1="168" x2="80" y2="270" stroke="var(--accent-cyan)" strokeWidth="1.5" />
                      <text x="35" y="154" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">Signal Vi ({params.vinPeak}V)</text>
                    </g>

                    {/* Coupling Capacitor C1 */}
                    <g
                      onMouseEnter={() => setHoveredComponent('c1')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1="98" y1="150" x2="135" y2="150" stroke="var(--accent-cyan)" strokeWidth="2" />
                      <line x1="135" y1="132" x2="135" y2="168" stroke="var(--accent-cyan)" strokeWidth="3" />
                      <line x1="145" y1="132" x2="145" y2="168" stroke="var(--accent-cyan)" strokeWidth="3" />
                      <line x1="145" y1="150" x2="230" y2="150" stroke="var(--accent-cyan)" strokeWidth="2" />
                      <text x="130" y="122" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">C1 (10µF)</text>
                    </g>

                    {/* Voltage Divider Resistors R1 & R2 */}
                    <g
                      onMouseEnter={() => setHoveredComponent('r1')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1="230" y1="35" x2="230" y2="65" stroke="var(--text-primary)" strokeWidth="2" />
                      <rect x="222" y="65" width="16" height="45" fill="#1e293b" stroke="var(--accent-amber)" strokeWidth="2.5" rx="3" />
                      <text x="244" y="92" fill="var(--accent-amber)" fontSize="11" fontWeight="700">R1 (47kΩ)</text>
                      <line x1="230" y1="110" x2="230" y2="150" stroke="var(--text-primary)" strokeWidth="2" />
                    </g>

                    <g
                      onMouseEnter={() => setHoveredComponent('r2')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1="230" y1="150" x2="230" y2="190" stroke="var(--text-primary)" strokeWidth="2" />
                      <rect x="222" y="190" width="16" height="45" fill="#1e293b" stroke="var(--accent-amber)" strokeWidth="2.5" rx="3" />
                      <text x="244" y="217" fill="var(--accent-amber)" fontSize="11" fontWeight="700">R2 (33kΩ)</text>
                      <line x1="230" y1="235" x2="230" y2="270" stroke="var(--text-primary)" strokeWidth="2" />
                    </g>

                    {/* Base Node Junction */}
                    <circle cx="230" cy="150" r="4.5" fill="var(--accent-cyan)" />
                    <line x1="230" y1="150" x2="320" y2="150" stroke="var(--accent-cyan)" strokeWidth="2.5" />

                    {/* NPN BJT Transistor SL100 */}
                    <g
                      onMouseEnter={() => setHoveredComponent('transistor')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="350" cy="150" r="32" fill="#0f172a" stroke="var(--accent-emerald)" strokeWidth="2.5" filter="url(#glow-green)" />
                      <line x1="320" y1="150" x2="338" y2="150" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                      <line x1="338" y1="128" x2="338" y2="172" stroke="#fff" strokeWidth="3.5" />

                      {/* Collector Leg */}
                      <line x1="338" y1="136" x2="365" y2="115" stroke="var(--accent-rose)" strokeWidth="2.5" />
                      <line x1="365" y1="115" x2="365" y2="35" stroke="var(--accent-rose)" strokeWidth="2.5" />

                      {/* Emitter Leg with Arrow */}
                      <line x1="338" y1="164" x2="365" y2="185" stroke="var(--accent-emerald)" strokeWidth="2.5" />
                      <polygon points="358,175 367,187 352,185" fill="var(--accent-emerald)" />
                      <line x1="365" y1="185" x2="365" y2="270" stroke="var(--accent-emerald)" strokeWidth="2.5" />

                      <text x="330" y="102" fill="var(--accent-emerald)" fontSize="12" fontWeight="800">SL100 (NPN)</text>
                    </g>

                    {/* Collector Load Resistor RL */}
                    <g
                      onMouseEnter={() => setHoveredComponent('rl')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect x="357" y="55" width="16" height="45" fill="#1e293b" stroke="var(--accent-rose)" strokeWidth="2.5" rx="3" />
                      <text x="380" y="82" fill="var(--accent-rose)" fontSize="11" fontWeight="700">RL ({params.rLoad}Ω)</text>
                    </g>

                    {/* Emitter Stabilization Resistor RE & Bypass Capacitor CE */}
                    <g
                      onMouseEnter={() => setHoveredComponent('re')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect x="357" y="195" width="16" height="45" fill="#1e293b" stroke="var(--accent-emerald)" strokeWidth="2.5" rx="3" />
                      <text x="380" y="222" fill="var(--accent-emerald)" fontSize="10" fontWeight="600">RE (560Ω)</text>
                    </g>

                    {/* Emitter Bypass Capacitor CE (Parallel to RE) */}
                    <g
                      onMouseEnter={() => setHoveredComponent('ce')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <line x1="365" y1="188" x2="420" y2="188" stroke="var(--accent-emerald)" strokeWidth="1.5" />
                      <line x1="420" y1="188" x2="420" y2="212" stroke="var(--accent-emerald)" strokeWidth="1.5" />
                      <line x1="410" y1="212" x2="430" y2="212" stroke="var(--accent-emerald)" strokeWidth="2.5" />
                      <line x1="410" y1="224" x2="430" y2="224" stroke="var(--accent-emerald)" strokeWidth="2.5" />
                      <line x1="420" y1="224" x2="420" y2="270" stroke="var(--accent-emerald)" strokeWidth="1.5" />
                      <line x1="365" y1="250" x2="420" y2="250" stroke="var(--accent-emerald)" strokeWidth="1.5" />
                      <text x="435" y="222" fill="var(--accent-emerald)" fontSize="9" fontWeight="600">CE (100µF)</text>
                    </g>

                    {/* Collector Node to Output Coupling Cap C2 */}
                    <g
                      onMouseEnter={() => setHoveredComponent('c2')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="365" cy="115" r="4.5" fill="var(--accent-rose)" />
                      <line x1="365" y1="115" x2="480" y2="115" stroke="var(--accent-rose)" strokeWidth="2.5" />

                      {/* Output Coupling Capacitor C2 */}
                      <line x1="480" y1="98" x2="480" y2="132" stroke="var(--accent-rose)" strokeWidth="3" />
                      <line x1="490" y1="98" x2="490" y2="132" stroke="var(--accent-rose)" strokeWidth="3" />
                      <line x1="490" y1="115" x2="580" y2="115" stroke="var(--accent-rose)" strokeWidth="2.5" />
                      <text x="475" y="90" fill="var(--accent-rose)" fontSize="11" fontWeight="700">C2 (10µF)</text>
                    </g>

                    {/* Output Load Terminal & Signal Vo */}
                    <g
                      onMouseEnter={() => setHoveredComponent('vo')}
                      onMouseLeave={() => setHoveredComponent(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="580" cy="115" r="4.5" fill="var(--accent-rose)" />
                      <line x1="580" y1="115" x2="580" y2="160" stroke="var(--accent-rose)" strokeWidth="2" />
                      <rect x="572" y="160" width="16" height="45" fill="#1e293b" stroke="var(--accent-rose)" strokeWidth="2" rx="3" />
                      <line x1="580" y1="205" x2="580" y2="270" stroke="var(--accent-rose)" strokeWidth="2" />
                      <text x="595" y="187" fill="var(--accent-rose)" fontSize="10">RL load</text>
                      <text x="590" y="120" fill="var(--accent-rose)" fontSize="12" fontWeight="800">Vo ({metrics.vOutPeak}V pk)</text>
                    </g>

                    {/* ======================= ANIMATED CURRENT FLOW OVERLAY PATHS ======================= */}
                    {showCurrentFlow && (
                      <g>
                        {/* 1. Collector Current Ic (Top Vcc -> RL -> Transistor Collector -> Emitter) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'collector') && (
                          <g>
                            <line
                              x1="365"
                              y1="35"
                              x2="365"
                              y2="150"
                              stroke="var(--accent-rose)"
                              strokeWidth="3.5"
                              strokeDasharray="6 6"
                              className={currentFlowType === 'conventional' ? 'current-path-fast' : 'current-path-reverse'}
                              filter="url(#glow-rose)"
                            />
                            {/* Moving Particles along Collector path */}
                            <circle cx="365" cy={35 + ((animOffset * 2) % 115)} r="3.5" fill="#ffe4e6" />
                            <circle cx="365" cy={35 + (((animOffset * 2) + 55) % 115)} r="3.5" fill="#ffe4e6" />
                            {/* Current direction arrow */}
                            <polygon
                              points={currentFlowType === 'conventional' ? '365,85 360,75 370,75' : '365,75 360,85 370,85'}
                              fill="var(--accent-rose)"
                            />
                          </g>
                        )}

                        {/* 2. Voltage Divider Bias Current Ibias (Vcc -> R1 -> Node -> R2 -> Ground) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'bias') && (
                          <g>
                            <line
                              x1="230"
                              y1="35"
                              x2="230"
                              y2="270"
                              stroke="var(--accent-amber)"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              className={currentFlowType === 'conventional' ? 'current-path-forward' : 'current-path-reverse'}
                              filter="url(#glow-amber)"
                            />
                            <circle cx="230" cy={35 + ((animOffset * 1.5) % 235)} r="3" fill="#fef3c7" />
                            <polygon
                              points={currentFlowType === 'conventional' ? '230,135 225,125 235,125' : '230,125 225,135 235,135'}
                              fill="var(--accent-amber)"
                            />
                          </g>
                        )}

                        {/* 3. Base Current Ib (Node -> Base Terminal) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'base' || currentPathFilter === 'bias') && (
                          <g>
                            <line
                              x1="230"
                              y1="150"
                              x2="338"
                              y2="150"
                              stroke="var(--accent-amber)"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              className={currentFlowType === 'conventional' ? 'current-path-forward' : 'current-path-reverse'}
                              filter="url(#glow-amber)"
                            />
                            <circle cx={230 + ((animOffset * 1.2) % 108)} cy="150" r="3" fill="#fff7ed" />
                            <polygon
                              points={currentFlowType === 'conventional' ? '290,150 280,145 280,155' : '280,150 290,145 290,155'}
                              fill="var(--accent-amber)"
                            />
                          </g>
                        )}

                        {/* 4. Emitter Current Ie (Transistor Emitter -> RE/CE -> Ground) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'emitter' || currentPathFilter === 'collector') && (
                          <g>
                            <line
                              x1="365"
                              y1="150"
                              x2="365"
                              y2="270"
                              stroke="var(--accent-emerald)"
                              strokeWidth="3.5"
                              strokeDasharray="6 6"
                              className={currentFlowType === 'conventional' ? 'current-path-fast' : 'current-path-reverse'}
                              filter="url(#glow-green)"
                            />
                            <circle cx="365" cy={150 + ((animOffset * 2) % 120)} r="3.5" fill="#dcfce7" />
                            <polygon
                              points={currentFlowType === 'conventional' ? '365,210 360,200 370,200' : '365,200 360,210 370,210'}
                              fill="var(--accent-emerald)"
                            />
                          </g>
                        )}

                        {/* 5. AC Input Signal Current (Vi -> C1 -> Base Node) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'ac') && (
                          <g>
                            <line
                              x1="80"
                              y1="150"
                              x2="230"
                              y2="150"
                              stroke="var(--accent-cyan)"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              className="current-path-forward"
                              filter="url(#glow-cyan)"
                            />
                            <circle cx={80 + ((animOffset * 2.5) % 150)} cy="150" r="3.5" fill="#e0f2fe" />
                          </g>
                        )}

                        {/* 6. AC Output Signal Current (Collector Node -> C2 -> Vo Load) */}
                        {(currentPathFilter === 'all' || currentPathFilter === 'ac') && (
                          <g>
                            <line
                              x1="365"
                              y1="115"
                              x2="580"
                              y2="115"
                              stroke="#38bdf8"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                              className="current-path-forward"
                              filter="url(#glow-cyan)"
                            />
                            <circle cx={365 + ((animOffset * 2.5) % 215)} cy="115" r="3.5" fill="#e0f2fe" />
                            <polygon points="450,115 440,110 440,120" fill="#38bdf8" />
                          </g>
                        )}
                      </g>
                    )}

                    {/* Live Ammeter Badges on Visual Circuit Diagram */}
                    {/* Collector Ammeter Badge */}
                    <g transform="translate(415, 55)">
                      <rect x="0" y="0" width="85" height="22" fill="#1e1b4b" stroke="var(--accent-rose)" strokeWidth="1.5" rx="5" />
                      <text x="6" y="15" fill="var(--accent-rose)" fontSize="10" fontWeight="800">🔴 Ic = {iCollectorMa} mA</text>
                    </g>

                    {/* Base Ammeter Badge */}
                    <g transform="translate(245, 158)">
                      <rect x="0" y="0" width="80" height="20" fill="#2e1065" stroke="var(--accent-amber)" strokeWidth="1.5" rx="5" />
                      <text x="5" y="14" fill="var(--accent-amber)" fontSize="9.5" fontWeight="800">🟡 Ib = {iBaseUa} µA</text>
                    </g>

                    {/* Emitter Ammeter Badge */}
                    <g transform="translate(440, 235)">
                      <rect x="0" y="0" width="85" height="22" fill="#064e3b" stroke="var(--accent-emerald)" strokeWidth="1.5" rx="5" />
                      <text x="6" y="15" fill="var(--accent-emerald)" fontSize="10" fontWeight="800">🟢 Ie = {iEmitterMa} mA</text>
                    </g>

                    {/* Bias Divider Ammeter Badge */}
                    <g transform="translate(135, 55)">
                      <rect x="0" y="0" width="85" height="20" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" rx="5" />
                      <text x="5" y="14" fill="#a5b4fc" fontSize="9" fontWeight="800">⚡ Ibias = {iBiasMa} mA</text>
                    </g>

                    {/* Q-Point Collector-Emitter Voltage Badge */}
                    <g transform="translate(320, 195)">
                      <rect x="0" y="0" width="90" height="18" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="1" rx="4" />
                      <text x="5" y="13" fill="var(--accent-cyan)" fontSize="9" fontWeight="700">VCEQ = {vCeqVal} V</text>
                    </g>
                  </g>
                )}

                {/* ======================= CLASS B PUSH-PULL SCHEMATIC ======================= */}
                {selectedAmpType === 'AMP_CLASS_B' && (
                  <g>
                    <text x="220" y="25" fill="var(--accent-rose)" fontSize="12" fontWeight="700">Class B Push-Pull (NPN SL100 + PNP SK100)</text>

                    {/* Input Signal Line */}
                    <circle cx="80" cy="150" r="16" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <text x="45" y="154" fill="var(--accent-cyan)" fontSize="10">Vi ({params.vinPeak}V)</text>
                    <line x1="96" y1="150" x2="220" y2="150" stroke="var(--accent-cyan)" strokeWidth="2" />

                    {/* Splitter to NPN & PNP Base */}
                    <circle cx="220" cy="150" r="4" fill="var(--accent-cyan)" />
                    <line x1="220" y1="150" x2="220" y2="90" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <line x1="220" y1="150" x2="220" y2="210" stroke="var(--accent-cyan)" strokeWidth="2" />

                    {/* Upper NPN Transistor (Positive Half Cycle) */}
                    <circle cx="300" cy="90" r="24" fill="#0f172a" stroke="var(--accent-rose)" strokeWidth="2" />
                    <line x1="220" y1="90" x2="288" y2="90" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <text x="290" y="60" fill="var(--accent-rose)" fontSize="11" fontWeight="700">NPN (Upper 180°)</text>

                    {/* Lower PNP Transistor (Negative Half Cycle) */}
                    <circle cx="300" cy="210" r="24" fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <line x1="220" y1="210" x2="288" y2="210" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <text x="290" y="245" fill="var(--accent-cyan)" fontSize="11" fontWeight="700">PNP (Lower 180°)</text>

                    {/* Output Junction to Load */}
                    <line x1="324" y1="90" x2="420" y2="90" stroke="var(--accent-rose)" strokeWidth="2" />
                    <line x1="324" y1="210" x2="420" y2="210" stroke="var(--accent-cyan)" strokeWidth="2" />
                    <line x1="420" y1="90" x2="420" y2="210" stroke="var(--text-primary)" strokeWidth="2" />
                    <circle cx="420" cy="150" r="4" fill="var(--accent-rose)" />
                    <line x1="420" y1="150" x2="560" y2="150" stroke="var(--accent-rose)" strokeWidth="2.5" />
                    <text x="570" y="155" fill="var(--accent-rose)" fontSize="12" fontWeight="700">Vo ({metrics.vOutPeak}V)</text>

                    {/* Current Flow Overlay for Push-Pull */}
                    {showCurrentFlow && (
                      <g>
                        {/* Positive Half Cycle NPN current */}
                        <line x1="324" y1="90" x2="420" y2="90" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 5" className="current-path-forward" />
                        {/* Negative Half Cycle PNP current */}
                        <line x1="420" y1="210" x2="324" y2="210" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 5" className="current-path-reverse" />
                        <rect x="430" y="125" width="130" height="20" fill="#0f172a" stroke="var(--accent-amber)" strokeWidth="1" rx="4" />
                        <text x="435" y="139" fill="var(--accent-amber)" fontSize="9" fontWeight="700">⚡ Crossover Distortion Zone</text>
                      </g>
                    )}
                  </g>
                )}

                {/* ======================= CLASS AB SCHEMATIC ======================= */}
                {selectedAmpType === 'AMP_CLASS_AB' && (
                  <g>
                    <text x="220" y="25" fill="var(--accent-emerald)" fontSize="12" fontWeight="700">Class AB Diode-Biased Push-Pull (No Crossover)</text>
                    <rect x="210" y="120" width="20" height="20" fill="#1e293b" stroke="var(--accent-emerald)" strokeWidth="1.5" rx="3" />
                    <text x="214" y="134" fill="var(--accent-emerald)" fontSize="10">D1</text>
                    <rect x="210" y="155" width="20" height="20" fill="#1e293b" stroke="var(--accent-emerald)" strokeWidth="1.5" rx="3" />
                    <text x="214" y="169" fill="var(--accent-emerald)" fontSize="10">D2</text>

                    {/* Diode Pre-bias Current Path */}
                    {showCurrentFlow && (
                      <g>
                        <line x1="220" y1="35" x2="220" y2="270" stroke="var(--accent-emerald)" strokeWidth="2.5" strokeDasharray="5 5" className="current-path-forward" />
                        <rect x="430" y="125" width="140" height="20" fill="#064e3b" stroke="#10b981" strokeWidth="1" rx="4" />
                        <text x="435" y="139" fill="#34d399" fontSize="9" fontWeight="700">✅ 2×Vbe Pre-bias Eliminates Crossover</text>
                      </g>
                    )}
                  </g>
                )}

                {/* ======================= CLASS C TUNED SCHEMATIC ======================= */}
                {selectedAmpType === 'AMP_CLASS_C' && (
                  <g>
                    <text x="220" y="25" fill="var(--accent-violet)" fontSize="12" fontWeight="700">Class C RF Power Amplifier with LC Tank Resonator</text>
                    {/* LC Tank Circuit in Collector */}
                    <rect x="340" y="55" width="20" height="40" fill="#1e293b" stroke="var(--accent-violet)" strokeWidth="2" rx="3" />
                    <text x="345" y="79" fill="var(--accent-violet)" fontSize="10">L1</text>
                    <line x1="380" y1="55" x2="380" y2="95" stroke="var(--accent-violet)" strokeWidth="2" />
                    <line x1="375" y1="70" x2="385" y2="70" stroke="var(--accent-violet)" strokeWidth="2" />
                    <line x1="375" y1="76" x2="385" y2="76" stroke="var(--accent-violet)" strokeWidth="2" />
                    <text x="390" y="76" fill="var(--accent-violet)" fontSize="10">CT</text>

                    {showCurrentFlow && (
                      <g>
                        <line x1="350" y1="35" x2="350" y2="135" stroke="var(--accent-violet)" strokeWidth="3" strokeDasharray="4 4" className="current-path-fast" />
                        <rect x="430" y="125" width="140" height="20" fill="#2e1065" stroke="#a855f7" strokeWidth="1" rx="4" />
                        <text x="435" y="139" fill="#c084fc" fontSize="9" fontWeight="700">⚡ Conduction Pulse &lt;180° (&gt;80% Eff)</text>
                      </g>
                    )}
                  </g>
                )}

                {/* ======================= CLASS D PWM SCHEMATIC ======================= */}
                {selectedAmpType === 'AMP_CLASS_D' && (
                  <g>
                    <text x="220" y="25" fill="var(--accent-amber)" fontSize="12" fontWeight="700">Class D PWM Switching Bridge + LC Low-Pass Filter</text>
                    <rect x="260" y="125" width="60" height="50" fill="#1e293b" stroke="var(--accent-amber)" strokeWidth="2" rx="5" />
                    <text x="268" y="155" fill="var(--accent-amber)" fontSize="11" fontWeight="700">PWM FET</text>
                    <text x="340" y="155" fill="#38bdf8" fontSize="11">→ LC Filter →</text>

                    {showCurrentFlow && (
                      <g>
                        <line x1="320" y1="150" x2="440" y2="150" stroke="var(--accent-amber)" strokeWidth="3.5" strokeDasharray="3 3" className="current-path-fast" />
                        <rect x="440" y="125" width="130" height="20" fill="#451a03" stroke="#f59e0b" strokeWidth="1" rx="4" />
                        <text x="445" y="139" fill="#fbbf24" fontSize="9" fontWeight="700">⚡ High Frequency PWM (&gt;90% Eff)</text>
                      </g>
                    )}
                  </g>
                )}
              </svg>


              {/* Component Hover Details Card Tooltip */}
              {hoveredComponent && (
                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem' }}>
                  <Info size={16} color="var(--accent-cyan)" />
                  <div>
                    {hoveredComponent === 'r1' && (
                      <span><strong>R1 (47kΩ Upper Bias Resistor):</strong> Forms voltage divider with R2. Drops VCC to supply DC base current (Ib = {iBaseUa}µA) to establish Class A Q-point.</span>
                    )}
                    {hoveredComponent === 'r2' && (
                      <span><strong>R2 (33kΩ Lower Bias Resistor):</strong> Sets DC Base Voltage VB = {vBaseBias.toFixed(2)}V. Ensures Q-point stays centered at Vcc/2 for maximum undistorted swing.</span>
                    )}
                    {hoveredComponent === 'transistor' && (
                      <span><strong>SL100 NPN Power Transistor:</strong> Operating Q-Point: Ic = {iCollectorMa}mA, Ib = {iBaseUa}µA, VCEQ = {vCeqVal}V. Conducts continuously for full 360° cycle with zero crossover distortion.</span>
                    )}
                    {hoveredComponent === 'rl' && (
                      <span><strong>RL ({params.rLoad}Ω Collector Load Resistor):</strong> Converts collector current fluctuations (Ic) into amplified output signal voltage Vo = {metrics.vOutPeak}V.</span>
                    )}
                    {hoveredComponent === 're' && (
                      <span><strong>RE (560Ω Emitter Stabilization Resistor):</strong> Provides negative DC feedback to stabilize Q-point against temperature variation and prevent thermal runaway.</span>
                    )}
                    {hoveredComponent === 'ce' && (
                      <span><strong>CE (100µF Emitter Bypass Capacitor):</strong> Bypasses AC signal around RE to ground, preventing AC negative feedback and preserving high voltage gain (Av = {metrics.voltageGain}×).</span>
                    )}
                    {hoveredComponent === 'c1' && (
                      <span><strong>C1 (10µF Input Coupling Capacitor):</strong> Blocks DC voltage from the signal source while passing AC audio signal to the transistor base.</span>
                    )}
                    {hoveredComponent === 'c2' && (
                      <span><strong>C2 (10µF Output Coupling Capacitor):</strong> Blocks DC collector voltage (VCE) while passing amplified AC signal (Vo = {metrics.vOutPeak}V) to the load.</span>
                    )}
                    {hoveredComponent === 'vi' && (
                      <span><strong>Vi (Input AC Signal Source):</strong> Peak AC input voltage = {params.vinPeak}V at {params.freqHz}Hz frequency.</span>
                    )}
                    {hoveredComponent === 'vo' && (
                      <span><strong>Vo (Amplified Output Signal):</strong> Peak AC output voltage = {metrics.vOutPeak}V peak ({metrics.vOutRms}V RMS), AC Power = {metrics.pOutMw}mW.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{vCeqVal} V</strong>
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block' }}>Centered at VCC/2 ({((Number(vCeqVal) / params.vcc) * 100).toFixed(0)}%)</span>
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

        {/* TAB 3: MSBTE TABLE NO 1.1 OBSERVATIONS & CALCULATIONS */}
        {activeTab === 'table' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Table No. 1.1: Performance Observations & Calculations
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Calculated formulas: Pac = Vo² / (2 · RL) • Pdc = Vcc · Icq • % Efficiency = (Pac / Pdc) · 100
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={handleAddObservation}
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
            </div>
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

        {/* TAB 5: MSBTE PRACTICAL RELATED QUESTIONS & ANSWERS (SECTION XVI) */}
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', fontSize: '0.8rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                XVI. Practical Related Questions & Official MSBTE Solutions
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Comprehensive datasheet parameters and technical answers from Maharashtra State Board of Technical Education ('K' Scheme).
              </p>
            </div>

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
          </div>
        )}
      </div>
    </div>
  );
};
