import React, { useState } from 'react';
import { Zap, Activity, Sliders } from 'lucide-react';

export type AnalogDiagramType =
  | 'power-amp-class-a'
  | 'power-amp-push-pull'
  | 'power-amp-transformerless'
  | 'power-amp-class-c'
  | 'heat-sink-thermal'
  | 'opamp-block-pinout'
  | 'opamp-open-closed-loop'
  | 'opamp-inverting-noninverting'
  | 'opamp-adder-subtractor'
  | 'opamp-integrator-differentiator'
  | 'sample-and-hold'
  | 'iv-vi-converters'
  | 'comparator-zcd'
  | 'schmitt-trigger'
  | 'window-peak-detector';

interface Props {
  type: AnalogDiagramType;
  title?: string;
}

export const AnalogCircuitDiagram: React.FC<Props> = ({ type, title }) => {
  const [activeTab, setActiveTab] = useState<'schematic' | 'waveforms' | 'equations'>('schematic');

  const renderSchematic = () => {
    switch (type) {
      case 'power-amp-class-a':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="30" fill="#38bdf8" textAnchor="middle" fontSize="16" fontWeight="bold">
              Single-Stage Class A Power Amplifier (Series-Fed & Transformer-Coupled)
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="310" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
              <text x="155" y="25" fill="#fbbf24" textAnchor="middle" fontSize="13" fontWeight="bold">Series-Fed Class A (ηmax = 25%)</text>
              <line x1="40" y1="45" x2="260" y2="45" stroke="#ef4444" strokeWidth="2.5" />
              <text x="265" y="49" fill="#ef4444" fontSize="12" fontWeight="bold">+VCC</text>
              <line x1="200" y1="45" x2="200" y2="70" stroke="#94a3b8" strokeWidth="2" />
              <rect x="190" y="70" width="20" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="3" />
              <text x="220" y="95" fill="#38bdf8" fontSize="11">RC</text>
              <line x1="200" y1="110" x2="200" y2="135" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="200" cy="155" r="22" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <line x1="185" y1="145" x2="185" y2="165" stroke="#fff" strokeWidth="3" />
              <line x1="185" y1="150" x2="200" y2="135" stroke="#fff" strokeWidth="2" />
              <line x1="185" y1="160" x2="200" y2="175" stroke="#fff" strokeWidth="2" />
              <polygon points="198,172 204,178 193,178" fill="#fff" />
              <text x="230" y="160" fill="#a855f7" fontSize="12" fontWeight="bold">Q1 (NPN)</text>
              <line x1="90" y1="45" x2="90" y2="70" stroke="#94a3b8" strokeWidth="2" />
              <rect x="80" y="70" width="20" height="35" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="55" y="90" fill="#cbd5e1" fontSize="10">R1</text>
              <line x1="90" y1="105" x2="90" y2="155" stroke="#94a3b8" strokeWidth="2" />
              <line x1="90" y1="155" x2="185" y2="155" stroke="#94a3b8" strokeWidth="2" />
              <rect x="80" y="170" width="20" height="35" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="55" y="190" fill="#cbd5e1" fontSize="10">R2</text>
              <line x1="90" y1="155" x2="90" y2="170" stroke="#94a3b8" strokeWidth="2" />
              <line x1="90" y1="205" x2="90" y2="245" stroke="#94a3b8" strokeWidth="2" />
              <line x1="200" y1="175" x2="200" y2="245" stroke="#94a3b8" strokeWidth="2" />
              <line x1="40" y1="245" x2="270" y2="245" stroke="#94a3b8" strokeWidth="2" />
              <text x="155" y="272" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">
                Conduction Angle = 360° | Pac = Vm²/2RL
              </text>
            </g>
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(168,85,247,0.3)" rx="10" />
              <text x="160" y="25" fill="#a855f7" textAnchor="middle" fontSize="13" fontWeight="bold">Transformer-Coupled Class A (ηmax = 50%)</text>
              <g transform="translate(180, 50)">
                <path d="M 0,0 Q -15,10 0,20 Q -15,30 0,40 Q -15,50 0,60" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="6" y1="0" x2="6" y2="60" stroke="#94a3b8" strokeWidth="2" />
                <line x1="10" y1="0" x2="10" y2="60" stroke="#94a3b8" strokeWidth="2" />
                <path d="M 16,0 Q 31,10 16,20 Q 31,30 16,40 Q 31,50 16,60" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="-25" y="35" fill="#f59e0b" fontSize="10">N1</text>
                <text x="38" y="35" fill="#38bdf8" fontSize="10">N2</text>
                <polygon points="80,-10 95,0 95,60 80,70" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
                <text x="102" y="35" fill="#34d399" fontSize="11" fontWeight="bold">RL (Speaker)</text>
              </g>
              <line x1="180" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="2" />
              <text x="30" y="45" fill="#ef4444" fontSize="11" fontWeight="bold">+VCC</text>
              <line x1="180" y1="110" x2="180" y2="135" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="180" cy="155" r="20" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <line x1="167" y1="145" x2="167" y2="165" stroke="#fff" strokeWidth="3" />
              <line x1="167" y1="150" x2="180" y2="135" stroke="#fff" strokeWidth="2" />
              <line x1="167" y1="160" x2="180" y2="175" stroke="#fff" strokeWidth="2" />
              <polygon points="178,172 184,178 173,178" fill="#fff" />
              <line x1="180" y1="175" x2="180" y2="245" stroke="#94a3b8" strokeWidth="2" />
              <text x="160" y="272" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">
                Reflected RL' = (N1/N2)² RL | ηmax = 50%
              </text>
            </g>
          </svg>
        );

      case 'power-amp-push-pull':
      case 'power-amp-transformerless':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Class B & Class AB Complementary Symmetry Transformer-Less Push-Pull Amplifier
            </text>
            <g transform="translate(150, 50)">
              <line x1="50" y1="30" x2="350" y2="30" stroke="#ef4444" strokeWidth="2.5" />
              <text x="360" y="34" fill="#ef4444" fontSize="12" fontWeight="bold">+VCC</text>
              <line x1="50" y1="250" x2="350" y2="250" stroke="#3b82f6" strokeWidth="2.5" />
              <text x="360" y="254" fill="#3b82f6" fontSize="12" fontWeight="bold">-VEE (or GND)</text>
              <line x1="250" y1="30" x2="250" y2="60" stroke="#ef4444" strokeWidth="2" />
              <circle cx="250" cy="80" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <line x1="237" y1="70" x2="237" y2="90" stroke="#fff" strokeWidth="3" />
              <line x1="237" y1="75" x2="250" y2="60" stroke="#fff" strokeWidth="2" />
              <line x1="237" y1="85" x2="250" y2="100" stroke="#fff" strokeWidth="2" />
              <polygon points="248,97 254,103 243,103" fill="#fff" />
              <text x="280" y="80" fill="#10b981" fontSize="12" fontWeight="bold">Q1 (NPN TIP31C)</text>
              <line x1="250" y1="250" x2="250" y2="220" stroke="#3b82f6" strokeWidth="2" />
              <circle cx="250" cy="200" r="20" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
              <line x1="237" y1="190" x2="237" y2="210" stroke="#fff" strokeWidth="3" />
              <line x1="237" y1="195" x2="250" y2="180" stroke="#fff" strokeWidth="2" />
              <line x1="237" y1="205" x2="250" y2="220" stroke="#fff" strokeWidth="2" />
              <polygon points="239,197 245,191 247,202" fill="#fff" />
              <text x="280" y="205" fill="#ec4899" fontSize="12" fontWeight="bold">Q2 (PNP TIP32C)</text>
              <line x1="250" y1="100" x2="250" y2="180" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="250" cy="140" r="4" fill="#f59e0b" />
              <line x1="250" y1="140" x2="330" y2="140" stroke="#f59e0b" strokeWidth="2" />
              <polygon points="330,125 345,140 345,180 330,195" fill="#1e293b" stroke="#34d399" strokeWidth="2" />
              <text x="355" y="160" fill="#34d399" fontSize="11" fontWeight="bold">RL (Speaker)</text>
              <g transform="translate(160, 100)">
                <polygon points="0,0 16,10 0,20" fill="#fbbf24" stroke="#fbbf24" />
                <line x1="16" y1="0" x2="16" y2="20" stroke="#fbbf24" strokeWidth="2" />
                <text x="-25" y="14" fill="#fbbf24" fontSize="10">D1</text>
              </g>
              <g transform="translate(160, 160)">
                <polygon points="0,0 16,10 0,20" fill="#fbbf24" stroke="#fbbf24" />
                <line x1="16" y1="0" x2="16" y2="20" stroke="#fbbf24" strokeWidth="2" />
                <text x="-25" y="14" fill="#fbbf24" fontSize="10">D2</text>
              </g>
              <text x="200" y="275" fill="#34d399" textAnchor="middle" fontSize="12" fontWeight="bold">
                Diodes D1 & D2 maintain 1.4V bias to eliminate Crossover Distortion (Class AB)
              </text>
            </g>
          </svg>
        );

      case 'power-amp-class-c':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Class C Tuned RF Power Amplifier Schematic & Waveforms
            </text>
            <g transform="translate(100, 50)">
              <rect x="0" y="0" width="500" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
              {/* Tuned LC Tank */}
              <line x1="250" y1="30" x2="250" y2="60" stroke="#ef4444" strokeWidth="2" />
              <text x="250" y="22" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">+VCC</text>
              <path d="M 230,60 Q 215,70 230,80 Q 215,90 230,100" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="205" y="80" fill="#f59e0b" fontSize="11">L</text>
              <line x1="270" y1="65" x2="270" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="276" y1="65" x2="276" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="285" y="80" fill="#38bdf8" fontSize="11">C</text>
              <circle cx="250" cy="140" r="20" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <line x1="237" y1="130" x2="237" y2="150" stroke="#fff" strokeWidth="3" />
              <line x1="237" y1="135" x2="250" y2="120" stroke="#fff" strokeWidth="2" />
              <line x1="237" y1="145" x2="250" y2="160" stroke="#fff" strokeWidth="2" />
              <polygon points="248,157 254,163 243,163" fill="#fff" />
              <text x="280" y="145" fill="#a855f7" fontSize="12" fontWeight="bold">Q1 (Class C)</text>
              <text x="250" y="250" fill="#34d399" textAnchor="middle" fontSize="12" fontWeight="bold">
                Conduction Angle θ &lt; 180° | Resonant Frequency fr = 1 / (2π√LC) | Efficiency &gt; 85%
              </text>
            </g>
          </svg>
        );

      case 'heat-sink-thermal':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Heat Sink Thermal Resistance Equivalent Circuit (Thermal Ohm's Law)
            </text>
            <g transform="translate(50, 60)">
              <rect x="0" y="0" width="600" height="250" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.3)" rx="10" />
              <text x="50" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold">TJ (Junction Temp)</text>
              <line x1="150" y1="45" x2="190" y2="45" stroke="#38bdf8" strokeWidth="2" />
              <rect x="190" y="32" width="60" height="25" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="220" y="48" fill="#38bdf8" fontSize="10" textAnchor="middle">θJC</text>
              <text x="280" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold">TC (Case)</text>
              <line x1="310" y1="45" x2="340" y2="45" stroke="#a855f7" strokeWidth="2" />
              <rect x="340" y="32" width="60" height="25" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
              <text x="370" y="48" fill="#a855f7" fontSize="10" textAnchor="middle">θCS</text>
              <text x="430" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold">TS (Sink)</text>
              <line x1="460" y1="45" x2="480" y2="45" stroke="#10b981" strokeWidth="2" />
              <rect x="480" y="32" width="60" height="25" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <text x="510" y="48" fill="#10b981" fontSize="10" textAnchor="middle">θSA</text>
              <text x="550" y="50" fill="#34d399" fontSize="12" fontWeight="bold">TA (Ambient)</text>
              <text x="300" y="160" fill="#fbbf24" textAnchor="middle" fontSize="14" fontWeight="bold">
                TJ - TA = PD × (θJC + θCS + θSA)
              </text>
              <text x="300" y="190" fill="#cbd5e1" textAnchor="middle" fontSize="11">
                Thermal Grease lowers θCS | Finned Aluminum Sink lowers θSA
              </text>
            </g>
          </svg>
        );

      case 'opamp-block-pinout':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              IC-741 Op-Amp Block Diagram & 8-Pin DIP Configuration
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="350" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
              <text x="175" y="24" fill="#fbbf24" textAnchor="middle" fontSize="13" fontWeight="bold">4-Stage Internal Architecture</text>
              <rect x="15" y="50" width="70" height="120" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="6" />
              <text x="50" y="95" fill="#38bdf8" textAnchor="middle" fontSize="10" fontWeight="bold">Input Diff</text>
              <text x="50" y="110" fill="#cbd5e1" textAnchor="middle" fontSize="9">Amp Stage</text>
              <rect x="100" y="50" width="70" height="120" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" rx="6" />
              <text x="135" y="95" fill="#a855f7" textAnchor="middle" fontSize="10" fontWeight="bold">Gain Stage</text>
              <rect x="185" y="50" width="70" height="120" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" rx="6" />
              <text x="220" y="95" fill="#f59e0b" textAnchor="middle" fontSize="10" fontWeight="bold">Level Shift</text>
              <rect x="270" y="50" width="65" height="120" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" rx="6" />
              <text x="302" y="95" fill="#10b981" textAnchor="middle" fontSize="10" fontWeight="bold">Push-Pull</text>
              <line x1="85" y1="110" x2="100" y2="110" stroke="#fff" strokeWidth="2" />
              <line x1="170" y1="110" x2="185" y2="110" stroke="#fff" strokeWidth="2" />
              <line x1="255" y1="110" x2="270" y2="110" stroke="#fff" strokeWidth="2" />
              <text x="175" y="210" fill="#e2e8f0" textAnchor="middle" fontSize="11">
                AVD = 2×10⁵ | Rin = 2MΩ | Rout = 75Ω | CMRR = 90dB
              </text>
            </g>
            <g transform="translate(410, 50)">
              <rect x="0" y="0" width="270" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(236,72,153,0.3)" rx="10" />
              <text x="135" y="24" fill="#ec4899" textAnchor="middle" fontSize="13" fontWeight="bold">IC-741 8-Pin DIP Layout</text>
              <rect x="75" y="45" width="120" height="200" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="8" />
              <path d="M 120,45 A 15,15 0 0,0 150,45" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              {[1, 2, 3, 4].map((pin, i) => (
                <g key={pin} transform={`translate(40, ${70 + i * 45})`}>
                  <rect x="0" y="0" width="35" height="12" fill="#94a3b8" rx="2" />
                  <text x="-5" y="10" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="end">
                    {pin === 1 ? 'Offset Null 1' : pin === 2 ? 'Inverting (V-)' : pin === 3 ? 'Non-Inv (V+)' : '-VEE (Pin 4)'}
                  </text>
                  <text x="18" y="9" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">{pin}</text>
                </g>
              ))}
              {[8, 7, 6, 5].map((pin, i) => (
                <g key={pin} transform={`translate(195, ${70 + i * 45})`}>
                  <rect x="0" y="0" width="35" height="12" fill="#94a3b8" rx="2" />
                  <text x="40" y="10" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="start">
                    {pin === 8 ? 'NC (Pin 8)' : pin === 7 ? '+VCC (Pin 7)' : pin === 6 ? 'Output (Pin 6)' : 'Offset Null 2'}
                  </text>
                  <text x="18" y="9" fill="#000" fontSize="9" fontWeight="bold" textAnchor="middle">{pin}</text>
                </g>
              ))}
            </g>
          </svg>
        );

      case 'opamp-inverting-noninverting':
      case 'opamp-open-closed-loop':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Inverting & Non-Inverting Op-Amp Closed Loop Configurations
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
              <text x="160" y="24" fill="#38bdf8" textAnchor="middle" fontSize="13" fontWeight="bold">Inverting Amplifier (180° Phase Shift)</text>
              <polygon points="140,80 140,180 230,130" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="150" y="105" fill="#f87171" fontSize="14" fontWeight="bold">-</text>
              <text x="150" y="160" fill="#34d399" fontSize="14" fontWeight="bold">+</text>
              <line x1="30" y1="100" x2="70" y2="100" stroke="#94a3b8" strokeWidth="2" />
              <rect x="70" y="92" width="35" height="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="87" y="104" fill="#38bdf8" fontSize="10" textAnchor="middle">Rin</text>
              <line x1="105" y1="100" x2="140" y2="100" stroke="#94a3b8" strokeWidth="2" />
              <text x="15" y="104" fill="#34d399" fontSize="11" fontWeight="bold">Vin</text>
              <line x1="120" y1="100" x2="120" y2="50" stroke="#94a3b8" strokeWidth="2" />
              <line x1="120" y1="50" x2="150" y2="50" stroke="#94a3b8" strokeWidth="2" />
              <rect x="150" y="42" width="40" height="16" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
              <text x="170" y="54" fill="#a855f7" fontSize="10" textAnchor="middle">Rf</text>
              <line x1="190" y1="50" x2="250" y2="50" stroke="#94a3b8" strokeWidth="2" />
              <line x1="250" y1="50" x2="250" y2="130" stroke="#94a3b8" strokeWidth="2" />
              <line x1="230" y1="130" x2="280" y2="130" stroke="#38bdf8" strokeWidth="2" />
              <text x="285" y="134" fill="#34d399" fontSize="11" fontWeight="bold">Vout</text>
              <text x="160" y="230" fill="#fbbf24" textAnchor="middle" fontSize="12" fontWeight="bold">
                Vout = - (Rf / Rin) × Vin
              </text>
            </g>
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(168,85,247,0.3)" rx="10" />
              <text x="160" y="24" fill="#a855f7" textAnchor="middle" fontSize="13" fontWeight="bold">Non-Inverting Amplifier (0° Phase Shift)</text>
              <polygon points="140,80 140,180 230,130" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
              <text x="150" y="105" fill="#f87171" fontSize="14" fontWeight="bold">-</text>
              <text x="150" y="160" fill="#34d399" fontSize="14" fontWeight="bold">+</text>
              <line x1="30" y1="155" x2="140" y2="155" stroke="#34d399" strokeWidth="2" />
              <text x="15" y="159" fill="#34d399" fontSize="11" fontWeight="bold">Vin</text>
              <line x1="230" y1="130" x2="280" y2="130" stroke="#a855f7" strokeWidth="2" />
              <text x="285" y="134" fill="#34d399" fontSize="11" fontWeight="bold">Vout</text>
              <text x="160" y="230" fill="#fbbf24" textAnchor="middle" fontSize="12" fontWeight="bold">
                Vout = (1 + Rf / R1) × Vin
              </text>
            </g>
          </svg>
        );

      case 'opamp-adder-subtractor':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Op-Amp Adder (Summing Amplifier) & Subtractor (Difference Amplifier)
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
              <text x="160" y="24" fill="#38bdf8" textAnchor="middle" fontSize="13" fontWeight="bold">Inverting Adder (Summing Amp)</text>
              <text x="160" y="230" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">
                Vout = - Rf [(V1/R1) + (V2/R2) + (V3/R3)]
              </text>
            </g>
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(168,85,247,0.3)" rx="10" />
              <text x="160" y="24" fill="#a855f7" textAnchor="middle" fontSize="13" fontWeight="bold">Subtractor (Difference Amp)</text>
              <text x="160" y="230" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">
                Vout = (Rf / R1) × (V2 - V1)
              </text>
            </g>
          </svg>
        );

      case 'opamp-integrator-differentiator':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Op-Amp Integrator & Differentiator Waveform Operations
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(16,185,129,0.3)" rx="10" />
              <text x="160" y="24" fill="#10b981" textAnchor="middle" fontSize="13" fontWeight="bold">Op-Amp Integrator Circuit</text>
              <rect x="20" y="200" width="280" height="65" fill="#0f172a" stroke="rgba(16,185,129,0.3)" rx="6" />
              <text x="30" y="220" fill="#fbbf24" fontSize="11" fontWeight="bold">Waveform Conversion:</text>
              <text x="30" y="240" fill="#cbd5e1" fontSize="10">Square Wave In ➔ Triangular Wave Out</text>
            </g>
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(239,68,68,0.3)" rx="10" />
              <text x="160" y="24" fill="#f87171" textAnchor="middle" fontSize="13" fontWeight="bold">Op-Amp Differentiator Circuit</text>
              <rect x="20" y="200" width="280" height="65" fill="#0f172a" stroke="rgba(239,68,68,0.3)" rx="6" />
              <text x="30" y="220" fill="#fbbf24" fontSize="11" fontWeight="bold">Waveform Conversion:</text>
              <text x="30" y="240" fill="#cbd5e1" fontSize="10">Triangular Wave In ➔ Square Wave Out</text>
            </g>
          </svg>
        );

      case 'schmitt-trigger':
        return (
          <svg viewBox="0 0 700 360" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="28" fill="#38bdf8" textAnchor="middle" fontSize="15" fontWeight="bold">
              Schmitt Trigger (Positive Feedback Comparator) & Hysteresis Loop
            </text>
            <g transform="translate(20, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(168,85,247,0.3)" rx="10" />
              <text x="160" y="24" fill="#a855f7" textAnchor="middle" fontSize="13" fontWeight="bold">Inverting Schmitt Trigger Schematic</text>
            </g>
            <g transform="translate(360, 50)">
              <rect x="0" y="0" width="320" height="280" fill="rgba(255,255,255,0.02)" stroke="rgba(245,158,11,0.3)" rx="10" />
              <text x="160" y="24" fill="#f59e0b" textAnchor="middle" fontSize="13" fontWeight="bold">Hysteresis Loop (Noise Immunity)</text>
              <text x="160" y="260" fill="#fbbf24" textAnchor="middle" fontSize="11" fontWeight="bold">
                VH = VUT - VLT = [2 R1 / (R1 + R2)] × Vsat
              </text>
            </g>
          </svg>
        );

      case 'comparator-zcd':
      case 'sample-and-hold':
      case 'iv-vi-converters':
      case 'window-peak-detector':
      default:
        return (
          <svg viewBox="0 0 700 320" style={{ width: '100%', height: 'auto', background: '#0b1329', borderRadius: '12px' }}>
            <text x="350" y="40" fill="#38bdf8" textAnchor="middle" fontSize="16" fontWeight="bold">
              {title || 'Circuit Schematic & Architectural Diagram'}
            </text>
            <rect x="50" y="60" width="600" height="220" fill="rgba(255,255,255,0.02)" stroke="rgba(56,189,248,0.3)" rx="10" />
            <circle cx="200" cy="170" r="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="200" y="175" fill="#38bdf8" textAnchor="middle" fontSize="14" fontWeight="bold">Op-Amp / Stage</text>
            <line x1="100" y1="170" x2="160" y2="170" stroke="#34d399" strokeWidth="2" />
            <text x="80" y="174" fill="#34d399" fontSize="12" fontWeight="bold">Vin</text>
            <line x1="240" y1="170" x2="300" y2="170" stroke="#f59e0b" strokeWidth="2" />
            <text x="320" y="174" fill="#f59e0b" fontSize="12" fontWeight="bold">Vout</text>
            <text x="480" y="140" fill="#a855f7" fontSize="12" fontWeight="bold">Precision Characteristics:</text>
            <text x="480" y="170" fill="#cbd5e1" fontSize="11">• Fast Response / High CMRR</text>
            <text x="480" y="195" fill="#cbd5e1" fontSize="11">• Low Offset & Noise Immunity</text>
          </svg>
        );
    }
  };

  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)',
      border: '1.5px solid rgba(56,189,248,0.3)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '28px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap color="#38bdf8" size={22} />
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8' }}>
            {title || 'Circuit Schematic & Architectural Diagram'}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {(['schematic', 'waveforms', 'equations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab ? '#0284c7' : 'rgba(255,255,255,0.06)',
                color: activeTab === tab ? '#fff' : '#94a3b8',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'schematic' && renderSchematic()}

      {activeTab === 'waveforms' && (
        <div style={{ padding: '20px', background: '#0b1329', borderRadius: '12px', color: '#e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, marginBottom: '10px' }}>
            <Activity size={18} /> Signal Waveform & Response Analysis
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Input and Output waveforms illustrate conduction angle, phase inversion, amplification scale, and switching behavior for this circuit topology.
          </p>
        </div>
      )}

      {activeTab === 'equations' && (
        <div style={{ padding: '20px', background: '#0b1329', borderRadius: '12px', color: '#e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800, marginBottom: '10px' }}>
            <Sliders size={18} /> Derivations & Key Governing Equations
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Mathematical relations govern the voltage gain, output power, power efficiency, cutoff frequency, and input/output impedances.
          </p>
        </div>
      )}
    </div>
  );
};
