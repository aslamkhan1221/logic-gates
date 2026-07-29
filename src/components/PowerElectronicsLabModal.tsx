import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Zap, Gauge, Eye, Monitor } from 'lucide-react';

export interface PowerElectronicsLabModalProps {
  onClose: () => void;
}

export interface APECircuit {
  id: string;
  name: string;
  category: 'rectifiers' | 'choppers' | 'inverters' | 'ac_controllers' | 'industrial';
  description: string;
  formulaVdc: string;
  formulaI: string;
  formulaB: string;
  defaultAlpha: number; // firing angle in degrees
  defaultDuty: number;  // duty cycle 0-1
  defaultVs: number;    // input voltage
  defaultFreq: number;  // input frequency Hz
  defaultR: number;     // ohms
  defaultL: number;     // mH
  turnsRatio?: number;  // transformer N1:N2
}

export const APE_CIRCUITS: APECircuit[] = [
  // ── 1-11: CONTROLLED RECTIFIERS ──────────────────────────────────────────
  {
    id: 'ape_1',
    name: '1. 1-Phase Half-Wave Controlled Rectifier (R Load)',
    category: 'rectifiers',
    description: 'Uses a single Thyristor (SCR) to control half-cycle power delivered to a resistive load. Output voltage varies with firing angle α.',
    formulaVdc: 'V_dc = (V_m / (2π)) * (1 + cos(α))',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_max = (L * I_peak) / (N * A)',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 100,
    defaultL: 0,
  },
  {
    id: 'ape_2',
    name: '2. 1-Phase Half-Wave Controlled Rectifier (RL Load)',
    category: 'rectifiers',
    description: 'Inductive load maintains current flow past 180° until extinction angle β. Output voltage goes negative during inductive discharge.',
    formulaVdc: 'V_dc = (V_m / (2π)) * (cos(α) - cos(β))',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B(t) = (μ_0 * μ_r * N * i(t)) / l_c',
    defaultAlpha: 30,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 50,
    defaultL: 150,
  },
  {
    id: 'ape_3',
    name: '3. 1-Phase Half-Wave Controlled Rectifier (RL + Freewheeling Diode)',
    category: 'rectifiers',
    description: 'Freewheeling Diode (FWD) conducts during negative half-cycle, preventing output voltage from turning negative and restoring continuous current.',
    formulaVdc: 'V_dc = (V_m / (2π)) * (1 + cos(α))',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B(t) = (L * i_fwd(t)) / (N * A)',
    defaultAlpha: 60,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 40,
    defaultL: 200,
  },
  {
    id: 'ape_4',
    name: '4. 1-Phase Center-Tapped Full-Wave Controlled Rectifier',
    category: 'rectifiers',
    description: 'Uses center-tapped transformer and 2 SCRs to rectify both half-cycles into DC voltage.',
    formulaVdc: 'V_dc = (V_m / π) * cos(α)',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'Φ_core = (V_s / (4.44 * f * N_p))',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 60,
    defaultL: 100,
  },
  {
    id: 'ape_5',
    name: '5. 1-Phase Full-Wave Fully-Controlled Bridge Converter (R Load)',
    category: 'rectifiers',
    description: 'Uses 4 Thyristors (T1-T4) operated in pairs (T1,T2 and T3,T4) to deliver full-wave controlled DC voltage.',
    formulaVdc: 'V_dc = (2 * V_m / π) * cos(α)',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_ripple = (ΔI * L) / (N * A)',
    defaultAlpha: 30,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 50,
    defaultL: 0,
  },
  {
    id: 'ape_6',
    name: '6. 1-Phase Full-Wave Fully-Controlled Bridge Converter (RL Load)',
    category: 'rectifiers',
    description: 'Continuous conduction mode for highly inductive RL load. Can operate in rectification mode (α < 90°) or inversion mode (α > 90°).',
    formulaVdc: 'V_dc = (2 * V_m / π) * cos(α)',
    formulaI: 'I_dc = (V_dc - E) / R',
    formulaB: 'B(t) = (μ_0 * N * I_dc) / l_g',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 20,
    defaultL: 300,
  },
  {
    id: 'ape_7',
    name: '7. 1-Phase Half-Controlled Semi-Converter (2 SCR + 2 Diodes)',
    category: 'rectifiers',
    description: 'Cost-effective bridge converter using 2 Thyristors and 2 Diodes. Provides freewheeling action naturally without negative voltage dips.',
    formulaVdc: 'V_dc = (V_m / π) * (1 + cos(α))',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_avg = (L * I_dc) / (N * A)',
    defaultAlpha: 60,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 40,
    defaultL: 180,
  },
  {
    id: 'ape_8',
    name: '8. 3-Phase Half-Wave Uncontrolled Diode Rectifier',
    category: 'rectifiers',
    description: 'Uses 3 Diodes connected to 3-phase AC supply. Output ripple frequency is 3 × f (150 Hz).',
    formulaVdc: 'V_dc = 1.17 * V_ph_rms',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_phase = (μ * N * I_ph) / l',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 415,
    defaultFreq: 50,
    defaultR: 100,
    defaultL: 50,
  },
  {
    id: 'ape_9',
    name: '9. 3-Phase Half-Wave Controlled Converter (3 SCRs)',
    category: 'rectifiers',
    description: '3 SCRs triggered sequentially at 120° intervals. Firing angle α ranges from 0° to 150°.',
    formulaVdc: 'V_dc = (3 * √3 * V_m / (2π)) * cos(α)',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_core = (L * I_rms) / (N * A)',
    defaultAlpha: 30,
    defaultDuty: 0.5,
    defaultVs: 415,
    defaultFreq: 50,
    defaultR: 50,
    defaultL: 100,
  },
  {
    id: 'ape_10',
    name: '10. 3-Phase Full-Wave 6-Pulse Fully Controlled SCR Bridge',
    category: 'rectifiers',
    description: 'Standard industrial converter using 6 SCRs triggered in sequence (T1-T6). Low output voltage ripple at 6 × f (300 Hz).',
    formulaVdc: 'V_dc = (3 * V_mL / π) * cos(α)',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_dc = (L * I_dc) / (N * A)',
    defaultAlpha: 30,
    defaultDuty: 0.5,
    defaultVs: 415,
    defaultFreq: 50,
    defaultR: 30,
    defaultL: 200,
  },
  {
    id: 'ape_11',
    name: '11. 3-Phase Semi-Converter (3 SCRs + 3 Diodes)',
    category: 'rectifiers',
    description: 'Half-controlled 3-phase bridge converter providing continuous single-quadrant DC power with free-wheeling action.',
    formulaVdc: 'V_dc = (3 * V_mL / (2π)) * (1 + cos(α))',
    formulaI: 'I_dc = V_dc / R',
    formulaB: 'B_avg = (L * I_dc) / (N * A)',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 415,
    defaultFreq: 50,
    defaultR: 40,
    defaultL: 150,
  },

  // ── 12-19: DC-DC CHOPPERS ────────────────────────────────────────────────
  {
    id: 'ape_12',
    name: '12. Buck Converter (Step-Down DC Chopper)',
    category: 'choppers',
    description: 'Steps down DC input voltage using high-frequency PWM switch, inductor L, diode D, and filter capacitor C.',
    formulaVdc: 'V_out = D * V_in',
    formulaI: 'I_out = V_out / R',
    formulaB: 'B_max = (L * I_pk) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.6,
    defaultVs: 100,
    defaultFreq: 20000,
    defaultR: 10,
    defaultL: 2, // 2mH
  },
  {
    id: 'ape_13',
    name: '13. Boost Converter (Step-Up DC Chopper)',
    category: 'choppers',
    description: 'Stores energy in inductor during switch ON time and boosts output DC voltage above input voltage during OFF time.',
    formulaVdc: 'V_out = V_in / (1 - D)',
    formulaI: 'I_out = V_out / R',
    formulaB: 'B_chg = (V_in * t_on) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 48,
    defaultFreq: 25000,
    defaultR: 50,
    defaultL: 5,
  },
  {
    id: 'ape_14',
    name: '14. Buck-Boost Converter (Inverting Chopper)',
    category: 'choppers',
    description: 'Produces inverted output voltage that can be higher or lower in magnitude than the DC input voltage depending on duty cycle D.',
    formulaVdc: 'V_out = -V_in * (D / (1 - D))',
    formulaI: 'I_out = |V_out| / R',
    formulaB: 'B_max = (L * I_peak) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.4,
    defaultVs: 60,
    defaultFreq: 30000,
    defaultR: 20,
    defaultL: 3,
  },
  {
    id: 'ape_15',
    name: '15. Class A Self-Commutated Resonant Chopper',
    category: 'choppers',
    description: 'Uses series LC resonant circuit to turn off the main Thyristor naturally when resonant current drops to zero.',
    formulaVdc: 'V_out = D * V_in',
    formulaI: 'I_pk = V_in / √(L/C)',
    formulaB: 'B_res = (L * I_pk) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.3,
    defaultVs: 100,
    defaultFreq: 1000,
    defaultR: 15,
    defaultL: 10,
  },
  {
    id: 'ape_16',
    name: '16. Class B Morgan Chopper (Resonant Commutation)',
    category: 'choppers',
    description: 'Uses saturable reactor LC circuit for forced commutation of the main SCR.',
    formulaVdc: 'V_out = (t_on / T) * V_in',
    formulaI: 'I_out = V_out / R',
    formulaB: 'B_sat = 1.6 Tesla (Ferrite Core)',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 110,
    defaultFreq: 500,
    defaultR: 12,
    defaultL: 8,
  },
  {
    id: 'ape_17',
    name: '17. Class C Two-Quadrant Chopper (First & Second Quadrant)',
    category: 'choppers',
    description: 'Combines Class A and Class B choppers. Current can flow in positive or negative direction (regenerative braking).',
    formulaVdc: 'V_out = D * V_in',
    formulaI: 'I_avg = (V_out - E_back) / R',
    formulaB: 'B(t) = (L * i(t)) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 200,
    defaultFreq: 5000,
    defaultR: 8,
    defaultL: 15,
  },
  {
    id: 'ape_18',
    name: '18. Class D Two-Quadrant Reversible Voltage Chopper',
    category: 'choppers',
    description: 'Voltage can be positive or negative, but current always flows into the load. Used in DC motor speed control.',
    formulaVdc: 'V_out = (2D - 1) * V_in',
    formulaI: 'I_out = V_out / R',
    formulaB: 'B_core = (L * I_out) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.7,
    defaultVs: 220,
    defaultFreq: 2000,
    defaultR: 10,
    defaultL: 20,
  },
  {
    id: 'ape_19',
    name: '19. Class E Four-Quadrant H-Bridge Chopper',
    category: 'choppers',
    description: 'Full 4-quadrant operation: Voltage and current can both be positive or negative. Drives DC motor in forward/reverse motoring and braking.',
    formulaVdc: 'V_out = (2D - 1) * V_in',
    formulaI: 'I_out = (V_out - E_mot) / R',
    formulaB: 'B_flux = (L * I_arm) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.75,
    defaultVs: 300,
    defaultFreq: 10000,
    defaultR: 5,
    defaultL: 25,
  },

  // ── 20-24: INVERTERS (DC TO AC) ──────────────────────────────────────────
  {
    id: 'ape_20',
    name: '20. 1-Phase Half-Bridge Parallel Inverter (IGBT)',
    category: 'inverters',
    description: 'Uses 2 IGBT switches and center-tapped DC supply to generate AC square-wave output across the load.',
    formulaVdc: 'V_rms = V_dc / 2',
    formulaI: 'I_rms = V_rms / Z',
    formulaB: 'B_trans = (V_dc * T) / (4 * N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 200,
    defaultFreq: 50,
    defaultR: 20,
    defaultL: 30,
  },
  {
    id: 'ape_21',
    name: '21. 1-Phase Full-Bridge Inverter (Square Wave)',
    category: 'inverters',
    description: 'Uses 4 IGBT switches (S1-S4) to convert DC to AC. Peak AC output voltage equals full DC input voltage Vdc.',
    formulaVdc: 'V_rms = V_dc',
    formulaI: 'I_rms = V_dc / √(R² + (2πfL)²)',
    formulaB: 'B_peak = (V_dc / (4 * f * N * A))',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 300,
    defaultFreq: 50,
    defaultR: 15,
    defaultL: 40,
  },
  {
    id: 'ape_22',
    name: '22. 1-Phase Sinusoidal PWM (SPWM) Inverter',
    category: 'inverters',
    description: 'Compares sine reference wave with high-frequency triangular carrier wave to generate PWM pulses that synthesize low-harmonic AC sine wave.',
    formulaVdc: 'V_1_rms = m_a * (V_dc / √2)',
    formulaI: 'I_1_rms = V_1_rms / Z_1',
    formulaB: 'B_filter = (L * I_peak) / (N * A)',
    defaultAlpha: 0,
    defaultDuty: 0.8,
    defaultVs: 400,
    defaultFreq: 50,
    defaultR: 10,
    defaultL: 15,
  },
  {
    id: 'ape_23',
    name: '23. 3-Phase Inverter (180° Conduction Mode)',
    category: 'inverters',
    description: 'Each switch conducts for 180°. At any instant, 3 switches are ON. Phase voltage has 6-step waveform with 60° steps.',
    formulaVdc: 'V_ph_rms = (√2 / 3) * V_dc',
    formulaI: 'I_ph = V_ph_rms / Z',
    formulaB: 'B_stator = (μ * N * I_ph) / l',
    defaultAlpha: 0,
    defaultDuty: 0.5,
    defaultVs: 600,
    defaultFreq: 50,
    defaultR: 25,
    defaultL: 50,
  },
  {
    id: 'ape_24',
    name: '24. 3-Phase Inverter (120° Conduction Mode)',
    category: 'inverters',
    description: 'Each switch conducts for 120°. At any instant, only 2 switches are ON. Eliminates shoot-through overlap risks between upper and lower switches.',
    formulaVdc: 'V_ph_rms = (1 / √6) * V_dc',
    formulaI: 'I_ph = V_ph_rms / Z',
    formulaB: 'B_stator = (μ * N * I_ph) / l',
    defaultAlpha: 0,
    defaultDuty: 0.333,
    defaultVs: 600,
    defaultFreq: 50,
    defaultR: 25,
    defaultL: 50,
  },

  // ── 25-28: CYCLOCONVERTERS & AC CONTROLLERS ──────────────────────────────
  {
    id: 'ape_25',
    name: '25. 1-Phase Center-Tapped Step-Down Cycloconverter (50Hz to 16.6Hz)',
    category: 'ac_controllers',
    description: 'Converts fixed 50 Hz AC supply directly to lower 16.6 Hz AC output without intermediate DC link using Positive & Negative SCR groups.',
    formulaVdc: 'f_out = f_in / 3',
    formulaI: 'I_out = V_out_rms / Z',
    formulaB: 'B_trans = (V_s / (4.44 * f_in * N * A))',
    defaultAlpha: 30,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 20,
    defaultL: 60,
  },
  {
    id: 'ape_26',
    name: '26. 1-Phase Bridge Type Cycloconverter',
    category: 'ac_controllers',
    description: 'Uses 8 SCRs arranged in two anti-parallel bridge converters (P-Bridge and N-Bridge) to synthesize variable frequency AC power.',
    formulaVdc: 'V_out_rms = V_in * √(1/π * (π - α + sin(2α)/2))',
    formulaI: 'I_out = V_out_rms / Z',
    formulaB: 'B_core = (L * I_pk) / (N * A)',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 15,
    defaultL: 80,
  },
  {
    id: 'ape_27',
    name: '27. AC Voltage Controller (TRIAC / Antiparallel SCR ON-OFF Control)',
    category: 'ac_controllers',
    description: 'Integral Cycle Control (ON-OFF Control): Connects supply to load for N cycles and turns off for M cycles to regulate RMS voltage.',
    formulaVdc: 'V_rms = V_s * √(N / (N + M))',
    formulaI: 'I_rms = V_rms / R',
    formulaB: 'B_burst = (μ * N_turn * I_rms) / l',
    defaultAlpha: 0,
    defaultDuty: 0.6,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 30,
    defaultL: 0,
  },
  {
    id: 'ape_28',
    name: '28. AC Voltage Controller (Phase Angle Control with R-L Load)',
    category: 'ac_controllers',
    description: 'Varies firing angle α in both positive and negative half-cycles to smoothly regulate AC output RMS voltage and power.',
    formulaVdc: 'V_rms = V_s * √(1/π * (π - α + sin(2α)/2))',
    formulaI: 'I_rms = V_rms / √(R² + (2πfL)²)',
    formulaB: 'B(t) = (L * i(t)) / (N * A)',
    defaultAlpha: 60,
    defaultDuty: 0.5,
    defaultVs: 230,
    defaultFreq: 50,
    defaultR: 25,
    defaultL: 100,
  },

  // ── 29-30: INDUSTRIAL POWER ELECTRONICS ──────────────────────────────────
  {
    id: 'ape_29',
    name: '29. UJT Relaxation Oscillator Firing Circuit for SCR Phase Control',
    category: 'industrial',
    description: 'Unijunction Transistor (UJT) triggers SCR at precise firing angle α determined by RC charging time constant τ = R_v * C.',
    formulaVdc: 'α = ω * R_v * C * ln(1 / (1 - η))',
    formulaI: 'I_peak_pulse = (V_bb - V_v) / R_b1',
    formulaB: 'B_pulse_trans = (V_pulse * t_w) / (N * A)',
    defaultAlpha: 45,
    defaultDuty: 0.5,
    defaultVs: 24,
    defaultFreq: 50,
    defaultR: 1000,
    defaultL: 0,
  },
  {
    id: 'ape_30',
    name: '30. SMPS Flyback Converter (Ferrite Transformer & B-Field Core)',
    category: 'industrial',
    description: 'Isolated DC-DC converter storing energy in high-frequency Ferrite Core Transformer magnetic field during MOSFET ON time and transferring it during OFF time.',
    formulaVdc: 'V_out = V_in * (N_s / N_p) * (D / (1 - D))',
    formulaI: 'I_out = V_out / R',
    formulaB: 'B_max = (L_p * I_p_pk) / (N_p * A_core)',
    defaultAlpha: 0,
    defaultDuty: 0.45,
    defaultVs: 310, // 230V AC rectified
    defaultFreq: 100000, // 100 kHz SMPS
    defaultR: 5,
    defaultL: 0.5, // 0.5mH primary
  },
];

interface APESchematicProps {
  circuit: APECircuit;
  Vs: number;
  freq: number;
  alpha: number;
  duty: number;
  R: number;
  L: number;
  B_Tesla: number;
  simTime: number;
  isRunning: boolean;
  isConductionPositive: boolean;
  isConductionNegative: boolean;
}

const APESchematicSVG: React.FC<APESchematicProps> = ({
  circuit, Vs, freq, alpha, duty, R, L, B_Tesla, simTime, isRunning, isConductionPositive, isConductionNegative
}) => {
  const id = circuit.id;
  const dashOffset = isRunning ? -simTime * 35 : 0;
  const activeStroke = "#10b981";
  const inactiveStroke = "#38bdf8";

  // Virtual Operation Status Message
  const getOpStatus = () => {
    if (!isRunning) return '⏸️ Virtual Circuit Simulation Paused — Press PLAY to observe operation';
    if (id.includes('ape_12') || id.includes('ape_13') || id.includes('ape_14')) {
      return isConductionPositive
        ? `⚡ MOSFET ON (Duty D=${(duty*100).toFixed(0)}%) — Energy Storing in Inductor L=${L}mH`
        : `⚡ MOSFET OFF — Inductor Freewheeling Energy to Load R=${R}Ω`;
    }
    if (id.includes('ape_18') || id.includes('ape_19')) {
      return `⚡ 4-Quadrant DC Motor Rotating (${(duty * 1500).toFixed(0)} RPM) — ${isConductionPositive ? 'Forward Motoring' : 'Regenerative Braking'}`;
    }
    if (id.includes('ape_20') || id.includes('ape_21') || id.includes('ape_22') || id.includes('ape_23') || id.includes('ape_24')) {
      return `⚡ Inverter Synthesizing AC Output (${freq} Hz) — Switches Triggered in ${id.includes('ape_23') ? '180°' : '120°'} Sequence`;
    }
    return isConductionPositive
      ? `⚡ Positive Half-Cycle: Thyristor Triggered at α=${alpha}° — Current Flowing Forward`
      : isConductionNegative
      ? `⚡ Negative Half-Cycle / Freewheeling Mode: Diode Conducting`
      : `⚡ SCR Off (Awaiting Gate Trigger Pulse α=${alpha}°)`;
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 700 380">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* ── Virtual Operation Status Bar ── */}
      <g transform="translate(15, 25)">
        <rect x="0" y="0" width="670" height="26" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" rx="6" />
        <circle cx="15" cy="13" r="5" fill={isRunning ? '#10b981' : '#ef4444'} filter={isRunning ? 'url(#glow)' : undefined} />
        <text x="28" y="17" fill={isRunning ? '#38bdf8' : '#94a3b8'} fontSize="11" fontWeight="800">
          {getOpStatus()}
        </text>
      </g>

      {/* ── CIRCUIT 1: 1-Phase HW SCR (R Load) ── */}
      {id === 'ape_1' && (
        <g>
          {/* AC Supply */}
          <g transform="translate(80, 190)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-45" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">AC Supply ({Vs}V, {freq}Hz)</text>
            {/* Dynamic Voltage Polarity (+ / -) */}
            <text x="-38" y="-12" fill={isConductionPositive ? '#10b981' : '#ef4444'} fontSize="14" fontWeight="900">
              {isConductionPositive ? '(+) Polarity' : '(-) Polarity'}
            </text>
          </g>

          {/* Current Flow Direction Wires & Arrows */}
          <line x1="80" y1="162" x2="80" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="90" x2="220" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="218" x2="80" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={-dashOffset} />
          <line x1="80" y1="290" x2="540" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrow Indicators */}
          {isRunning && isConductionPositive && (
            <g fill="#10b981">
              {/* Top forward current arrow */}
              <polygon points="170,86 182,90 170,94" filter="url(#glow)" />
              <text x="140" y="80" fill="#10b981" fontSize="11" fontWeight="900">I_ac →</text>
              {/* Load downward current arrow */}
              <polygon points="536,130 540,142 544,130" filter="url(#glow)" />
              <text x="550" y="135" fill="#10b981" fontSize="11" fontWeight="900">I_load ↓</text>
              {/* Return leftward current arrow */}
              <polygon points="320,286 308,290 320,294" filter="url(#glow)" />
              <text x="325" y="310" fill="#10b981" fontSize="11" fontWeight="900">← I_return</text>
            </g>
          )}

          {/* SCR T1 */}
          <g transform="translate(260, 90)">
            <polygon points="-15,-15 -15,15 15,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <line x1="15" y1="-15" x2="15" y2="15" stroke="#10b981" strokeWidth="2.5" />
            <line x1="0" y1="8" x2="-10" y2="24" stroke={isRunning && isConductionPositive ? '#f59e0b' : '#64748b'} strokeWidth="2.5" />
            <text x="-15" y="-22" fill="#10b981" fontSize="12" fontWeight="800">SCR T1 {isConductionPositive ? '(ON)' : '(OFF)'}</text>
            <text x="-35" y="38" fill="#f59e0b" fontSize="10" fontWeight="700">Gate Pulse (α={alpha}°)</text>
          </g>
          <line x1="275" y1="90" x2="540" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="540" y1="90" x2="540" y2="160" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Instantaneous Voltage Drop Indicator */}
          <g transform="translate(400, 50)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_out = {isConductionPositive ? (Vs * 1.414 * Math.sin(simTime)).toFixed(1) : '0.0'} V
            </text>
          </g>

          {/* Resistive Load R */}
          <g transform="translate(540, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke={isConductionPositive ? '#f59e0b' : '#334155'} strokeWidth="2.5" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Load R = {R} Ω</text>
            <text x="24" y="22" fill="#94a3b8" fontSize="10">{isConductionPositive ? '⚡ Current Flowing' : 'Idle'}</text>
          </g>
          <line x1="540" y1="220" x2="540" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 2: 1-Phase HW SCR (RL Load) ── */}
      {id === 'ape_2' && (
        <g>
          <g transform="translate(80, 190)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-45" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">AC Supply ({Vs}V, {freq}Hz)</text>
            <text x="-38" y="-12" fill={isConductionPositive ? '#10b981' : '#ef4444'} fontSize="14" fontWeight="900">
              {isConductionPositive ? '(+) Polarity' : '(-) Polarity'}
            </text>
          </g>
          <line x1="80" y1="162" x2="80" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="90" x2="220" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="218" x2="80" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={-dashOffset} />
          <line x1="80" y1="290" x2="560" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && isConductionPositive && (
            <g fill="#10b981">
              <polygon points="170,86 182,90 170,94" filter="url(#glow)" />
              <text x="140" y="80" fill="#10b981" fontSize="11" fontWeight="900">I_ac →</text>
              <polygon points="556,130 560,142 564,130" filter="url(#glow)" />
              <text x="570" y="135" fill="#10b981" fontSize="11" fontWeight="900">I_load ↓</text>
              <polygon points="320,286 308,290 320,294" filter="url(#glow)" />
              <text x="325" y="310" fill="#10b981" fontSize="11" fontWeight="900">← I_return</text>
            </g>
          )}

          {/* SCR T1 */}
          <g transform="translate(250, 90)">
            <polygon points="-15,-15 -15,15 15,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <line x1="15" y1="-15" x2="15" y2="15" stroke="#10b981" strokeWidth="2.5" />
            <line x1="0" y1="8" x2="-10" y2="24" stroke={isRunning && isConductionPositive ? '#f59e0b' : '#64748b'} strokeWidth="2.5" />
            <text x="-15" y="-22" fill="#10b981" fontSize="12" fontWeight="800">SCR T1 {isConductionPositive ? '(ON)' : '(OFF)'}</text>
            <text x="-35" y="38" fill="#f59e0b" fontSize="10" fontWeight="700">Gate Pulse (α={alpha}°)</text>
          </g>

          {/* Series Inductor L */}
          <g transform="translate(360, 90)">
            <text x="-10" y="-28" fill="#a78bfa" fontSize="11" fontWeight="800">Inductor L = {L} mH</text>
            <rect x="-10" y="-16" width="70" height="10" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
            <path d="M 0 0 C 10 -14, 20 -14, 20 0 C 30 -14, 40 -14, 40 0 C 50 -14, 60 -14, 60 0" fill="none" stroke="#a78bfa" strokeWidth="3" />
            <text x="75" y="4" fill="#c084fc" fontSize="10" fontWeight="700">B={B_Tesla.toFixed(2)}T</text>
          </g>

          <line x1="265" y1="90" x2="360" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="420" y1="90" x2="560" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="560" y1="90" x2="560" y2="160" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(480, 50)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_out = {isConductionPositive ? (Vs * 1.414 * Math.sin(simTime)).toFixed(1) : '0.0'} V
            </text>
          </g>

          {/* Resistive Load R */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke={isConductionPositive ? '#f59e0b' : '#334155'} strokeWidth="2.5" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Load R = {R} Ω</text>
            <text x="24" y="22" fill="#94a3b8" fontSize="10">{isConductionPositive ? '⚡ Current Flowing' : 'Idle'}</text>
          </g>
          <line x1="560" y1="220" x2="560" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 3: 1-Phase HW SCR (RL + Freewheeling Diode) ── */}
      {id === 'ape_3' && (
        <g>
          <g transform="translate(80, 190)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-45" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">AC Supply ({Vs}V)</text>
          </g>
          <line x1="80" y1="162" x2="80" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="90" x2="200" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="218" x2="80" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="80" y1="290" x2="580" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              {isConductionPositive && <polygon points="150,86 162,90 150,94" filter="url(#glow)" />}
              {isConductionNegative && <polygon points="356,230 360,242 364,230" fill="#38bdf8" filter="url(#glow)" />}
              <polygon points="576,130 580,142 584,130" filter="url(#glow)" />
              <text x="590" y="135" fill="#10b981" fontSize="11" fontWeight="900">I_load ↓</text>
            </g>
          )}

          {/* SCR T1 */}
          <g transform="translate(230, 90)">
            <polygon points="-15,-15 -15,15 15,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <line x1="15" y1="-15" x2="15" y2="15" stroke="#10b981" strokeWidth="2.5" />
            <line x1="0" y1="8" x2="-10" y2="24" stroke={isConductionPositive ? '#f59e0b' : '#64748b'} strokeWidth="2" />
            <text x="-15" y="-22" fill="#10b981" fontSize="12" fontWeight="800">SCR T1 {isConductionPositive ? '(ON)' : '(OFF)'}</text>
          </g>

          {/* Freewheeling Diode (FWD) shunted */}
          <g transform="translate(360, 190)">
            <polygon points="-12,12 12,12 0,-12" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#38bdf8" strokeWidth="2.5" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="18" y="4" fill="#38bdf8" fontSize="11" fontWeight="800">FWD {isConductionNegative ? '(ON-Freewheeling)' : '(OFF)'}</text>
          </g>
          <line x1="360" y1="90" x2="360" y2="178" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning && isConductionNegative ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="360" y1="202" x2="360" y2="290" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning && isConductionNegative ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Series L and R */}
          <g transform="translate(420, 90)">
            <text x="0" y="-26" fill="#a78bfa" fontSize="11" fontWeight="800">Inductor L = {L} mH</text>
            <rect x="0" y="-16" width="60" height="10" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
            <path d="M 5 0 C 15 -14, 25 -14, 25 0 C 35 -14, 45 -14, 45 0 C 55 -14, 65 -14, 65 0" fill="none" stroke="#a78bfa" strokeWidth="3" />
          </g>

          <line x1="245" y1="90" x2="420" y2="90" stroke={isRunning ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="480" y1="90" x2="580" y2="90" stroke={isRunning ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="580" y1="90" x2="580" y2="160" stroke={isRunning ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(490, 50)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_out = {(Vs * 1.414 * Math.abs(Math.sin(simTime))).toFixed(1)} V
            </text>
          </g>

          {/* Load R */}
          <g transform="translate(580, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke={isRunning ? '#f59e0b' : '#334155'} strokeWidth="2.5" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Load R = {R} Ω</text>
          </g>
          <line x1="580" y1="220" x2="580" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 4: 1-Phase Center-Tapped FW Controlled Rectifier ── */}
      {id === 'ape_4' && (
        <g>
          {/* Center Tapped Transformer */}
          <g transform="translate(140, 190)">
            <rect x="-40" y="-70" width="25" height="140" fill="none" stroke="#38bdf8" strokeWidth="2" rx="4" />
            <path d="M -40 -60 Q -20 -50 -40 -40 Q -20 -30 -40 -20 Q -20 -10 -40 0 Q -20 10 -40 20 Q -20 30 -40 40 Q -20 50 -40 60" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="-5" y1="-75" x2="-5" y2="75" stroke="#94a3b8" strokeWidth="3" />
            <line x1="5" y1="-75" x2="5" y2="75" stroke="#94a3b8" strokeWidth="3" />
            <rect x="15" y="-70" width="25" height="140" fill="none" stroke="#38bdf8" strokeWidth="2" rx="4" />
            <path d="M 40 -60 Q 20 -50 40 -40 Q 20 -30 40 -20 Q 20 -10 40 0 Q 20 10 40 20 Q 20 30 40 40 Q 20 50 40 60" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="40" cy="0" r="4" fill="#f59e0b" />
            <text x="48" y="4" fill="#f59e0b" fontSize="11" fontWeight="800">Center Tap (CT)</text>
            <text x="-65" y="95" fill="#94a3b8" fontSize="11" fontWeight="700">Center-Tapped Transformer</text>
          </g>

          <line x1="180" y1="130" x2="300" y2="130" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="180" y1="250" x2="300" y2="250" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionNegative ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="180" y1="190" x2="480" y2="190" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />

          {/* Current Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              {isConductionPositive && <polygon points="240,126 252,130 240,134" filter="url(#glow)" />}
              {isConductionNegative && <polygon points="240,246 252,250 240,254" filter="url(#glow)" />}
              <polygon points="516,186 528,190 516,194" filter="url(#glow)" />
              <text x="500" y="180" fill="#10b981" fontSize="11" fontWeight="900">I_dc →</text>
            </g>
          )}

          {/* SCR T1 Upper */}
          <g transform="translate(330, 130)">
            <polygon points="-15,-15 -15,15 15,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <line x1="15" y1="-15" x2="15" y2="15" stroke="#10b981" strokeWidth="2.5" />
            <text x="-15" y="-22" fill="#10b981" fontSize="12" fontWeight="800">SCR T1 {isConductionPositive ? '(ON)' : '(OFF)'}</text>
          </g>

          {/* SCR T2 Lower */}
          <g transform="translate(330, 250)">
            <polygon points="-15,-15 -15,15 15,0" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <line x1="15" y1="-15" x2="15" y2="15" stroke="#10b981" strokeWidth="2.5" />
            <text x="-15" y="32" fill="#10b981" fontSize="12" fontWeight="800">SCR T2 {isConductionNegative ? '(ON)' : '(OFF)'}</text>
          </g>

          <line x1="345" y1="130" x2="480" y2="130" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionPositive ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="345" y1="250" x2="480" y2="250" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning && isConductionNegative ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="480" y1="130" x2="480" y2="250" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="480" y1="190" x2="560" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(530, 140)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_dc = {(Vs * 0.9 * Math.cos((alpha * Math.PI)/180)).toFixed(1)} V
            </text>
          </g>

          {/* Load R */}
          <g transform="translate(600, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Load R = {R} Ω</text>
          </g>
        </g>
      )}

      {/* ── CIRCUIT 5 & 6: 1-Phase Full-Wave Bridge Converter (R & RL Load) ── */}
      {(id === 'ape_5' || id === 'ape_6') && (
        <g>
          {/* AC Supply */}
          <g transform="translate(60, 190)">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -12 0 Q -6 -12 0 0 T 12 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-40" y="45" fill="#94a3b8" fontSize="11" fontWeight="700">AC Supply ({Vs}V)</text>
          </g>
          <line x1="60" y1="164" x2="60" y2="140" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="140" x2="220" y2="140" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="216" x2="60" y2="240" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="240" x2="340" y2="240" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              <polygon points="410,56 422,60 410,64" filter="url(#glow)" />
              <text x="380" y="50" fill="#10b981" fontSize="11" fontWeight="900">I_dc →</text>
              <polygon points="516,130 520,142 524,130" filter="url(#glow)" />
              <text x="530" y="135" fill="#10b981" fontSize="11" fontWeight="900">I_load ↓</text>
              <polygon points="320,316 308,320 320,324" filter="url(#glow)" />
              <text x="325" y="340" fill="#10b981" fontSize="11" fontWeight="900">← I_return</text>
            </g>
          )}

          {/* 4 SCRs Bridge */}
          <g transform="translate(220, 110)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <text x="-25" y="-18" fill="#10b981" fontSize="11" fontWeight="800">T1 {isConductionPositive ? '(ON)' : ''}</text>
          </g>
          <g transform="translate(220, 270)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <text x="-25" y="28" fill="#10b981" fontSize="11" fontWeight="800">T4 {isConductionNegative ? '(ON)' : ''}</text>
          </g>
          <g transform="translate(340, 110)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <text x="18" y="-18" fill="#10b981" fontSize="11" fontWeight="800">T3 {isConductionNegative ? '(ON)' : ''}</text>
          </g>
          <g transform="translate(340, 270)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <text x="18" y="28" fill="#10b981" fontSize="11" fontWeight="800">T2 {isConductionPositive ? '(ON)' : ''}</text>
          </g>

          <line x1="220" y1="60" x2="520" y2="60" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="220" y1="320" x2="520" y2="320" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />
          <line x1="220" y1="60" x2="220" y2="320" stroke="#38bdf8" strokeWidth="2" />
          <line x1="340" y1="60" x2="340" y2="320" stroke="#38bdf8" strokeWidth="2" />

          {/* Inductor L if ape_6 */}
          {id === 'ape_6' && (
            <g transform="translate(410, 60)">
              <rect x="0" y="-14" width="60" height="10" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
              <path d="M 5 0 C 15 -14, 25 -14, 25 0 C 35 -14, 45 -14, 45 0 C 55 -14, 65 -14, 65 0" fill="none" stroke="#a78bfa" strokeWidth="2.5" />
              <text x="5" y="-22" fill="#a78bfa" fontSize="11" fontWeight="800">Inductor L={L}mH</text>
            </g>
          )}

          {/* Voltage Meter */}
          <g transform="translate(450, 20)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_dc = {(Vs * 0.9 * Math.cos((alpha * Math.PI)/180)).toFixed(1)} V
            </text>
          </g>

          {/* Load R */}
          <g transform="translate(520, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">DC Load R = {R} Ω</text>
          </g>
          <line x1="520" y1="60" x2="520" y2="160" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="520" y1="220" x2="520" y2="320" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 7: 1-Phase Half-Controlled Semi-Converter ── */}
      {id === 'ape_7' && (
        <g>
          <g transform="translate(60, 190)">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -12 0 Q -6 -12 0 0 T 12 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-40" y="45" fill="#94a3b8" fontSize="11" fontWeight="700">AC Supply ({Vs}V)</text>
          </g>
          <line x1="60" y1="164" x2="60" y2="140" stroke="#38bdf8" strokeWidth="2" />
          <line x1="60" y1="140" x2="220" y2="140" stroke="#38bdf8" strokeWidth="2" />
          <line x1="60" y1="216" x2="60" y2="240" stroke="#38bdf8" strokeWidth="2" />
          <line x1="60" y1="240" x2="340" y2="240" stroke="#38bdf8" strokeWidth="2" />

          {/* Top Arm: 2 SCRs (T1, T3) */}
          <g transform="translate(220, 110)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" />
            <text x="-25" y="-18" fill="#10b981" fontSize="11" fontWeight="800">SCR T1</text>
          </g>
          <g transform="translate(340, 110)">
            <polygon points="-12,-12 -12,12 12,0" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="rotate(-90)" />
            <text x="18" y="-18" fill="#10b981" fontSize="11" fontWeight="800">SCR T3</text>
          </g>

          {/* Bottom Arm: 2 Diodes (D2, D4) */}
          <g transform="translate(220, 270)">
            <polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" transform="rotate(-90)" />
            <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#38bdf8" strokeWidth="2" transform="rotate(-90)" />
            <text x="-35" y="28" fill="#38bdf8" fontSize="11" fontWeight="800">Diode D4</text>
          </g>
          <g transform="translate(340, 270)">
            <polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" transform="rotate(-90)" />
            <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#38bdf8" strokeWidth="2" transform="rotate(-90)" />
            <text x="18" y="28" fill="#38bdf8" fontSize="11" fontWeight="800">Diode D2</text>
          </g>

          <line x1="220" y1="60" x2="520" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="220" y1="320" x2="520" y2="320" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="220" y1="60" x2="220" y2="320" stroke="#38bdf8" strokeWidth="2" />
          <line x1="340" y1="60" x2="340" y2="320" stroke="#38bdf8" strokeWidth="2" />

          {/* Load R */}
          <g transform="translate(520, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Load R = {R} Ω</text>
          </g>
          <line x1="520" y1="60" x2="520" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="520" y1="220" x2="520" y2="320" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUITS 8, 9, 10, 11: 3-Phase Rectifier Series ── */}
      {(id === 'ape_8' || id === 'ape_9' || id === 'ape_10' || id === 'ape_11') && (
        <g>
          {/* 3-Phase Input Terminals */}
          <g transform="translate(60, 100)"><circle cx="0" cy="0" r="16" fill="#991b1b" stroke="#ef4444" strokeWidth="2" /><text x="-4" y="4" fill="#fff" fontSize="11" fontWeight="800">R</text></g>
          <g transform="translate(60, 190)"><circle cx="0" cy="0" r="16" fill="#854d0e" stroke="#eab308" strokeWidth="2" /><text x="-4" y="4" fill="#fff" fontSize="11" fontWeight="800">Y</text></g>
          <g transform="translate(60, 280)"><circle cx="0" cy="0" r="16" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" /><text x="-4" y="4" fill="#fff" fontSize="11" fontWeight="800">B</text></g>
          <text x="35" y="325" fill="#94a3b8" fontSize="11" fontWeight="700">3-Phase AC Supply ({Vs}V)</text>

          <line x1="76" y1="100" x2="220" y2="100" stroke="#ef4444" strokeWidth="2" />
          <line x1="76" y1="190" x2="280" y2="190" stroke="#eab308" strokeWidth="2" />
          <line x1="76" y1="280" x2="340" y2="280" stroke="#3b82f6" strokeWidth="2" />

          {/* 6 Leg Bridge Top / Bottom */}
          <g transform="translate(220, 110)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="-18" fill="#10b981" fontSize="10" fontWeight="800">T1</text></g>
          <g transform="translate(220, 270)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="28" fill="#10b981" fontSize="10" fontWeight="800">T4</text></g>

          <g transform="translate(280, 110)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="-18" fill="#10b981" fontSize="10" fontWeight="800">T3</text></g>
          <g transform="translate(280, 270)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="28" fill="#10b981" fontSize="10" fontWeight="800">T6</text></g>

          <g transform="translate(340, 110)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="-18" fill="#10b981" fontSize="10" fontWeight="800">T5</text></g>
          <g transform="translate(340, 270)"><polygon points="-12,-12 -12,12 12,0" fill="#1e293b" stroke="#10b981" strokeWidth="2" transform="rotate(-90)" /><text x="-25" y="28" fill="#10b981" fontSize="10" fontWeight="800">T2</text></g>

          <line x1="220" y1="50" x2="520" y2="50" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="220" y1="330" x2="520" y2="330" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Load */}
          <g transform="translate(520, 190)">
            <rect x="-15" y="-30" width="30" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#f59e0b" fontSize="12" fontWeight="800">3-Phase DC Load (R={R}Ω)</text>
          </g>
          <line x1="520" y1="50" x2="520" y2="160" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="520" y1="220" x2="520" y2="330" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 12: Buck Converter ── */}
      {id === 'ape_12' && (
        <g>
          <g transform="translate(70, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Source ({Vs}V)</text>
          </g>
          <line x1="70" y1="155" x2="70" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="90" x2="200" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="225" x2="70" y2="290" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="290" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />

          {/* MOSFET Switch */}
          <g transform="translate(240, 90)">
            <rect x="-20" y="-18" width="40" height="36" fill={isRunning ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" rx="4" />
            <text x="-14" y="5" fill="#fff" fontSize="11" fontWeight="900">MOSFET</text>
            <text x="-25" y="-24" fill="#38bdf8" fontSize="10" fontWeight="800">Buck Switch (Duty D={(duty*100).toFixed(0)}%)</text>
          </g>

          {/* Freewheeling Diode */}
          <g transform="translate(360, 190)">
            <polygon points="-12,12 12,12 0,-12" fill="#38bdf8" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="-12" y1="-12" x2="12" y2="-12" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="18" y="4" fill="#38bdf8" fontSize="10" fontWeight="700">FWD Diode</text>
          </g>
          <line x1="360" y1="90" x2="360" y2="178" stroke="#10b981" strokeWidth="2" />
          <line x1="360" y1="202" x2="360" y2="290" stroke="#10b981" strokeWidth="2" />

          {/* Series Choke L */}
          <g transform="translate(430, 90)">
            <text x="0" y="-26" fill="#a78bfa" fontSize="11" fontWeight="800">Buck Choke L ({L}mH)</text>
            <rect x="0" y="-16" width="60" height="10" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
            <path d="M 5 0 C 15 -14, 25 -14, 25 0 C 35 -14, 45 -14, 45 0 C 55 -14, 65 -14, 65 0" fill="none" stroke="#a78bfa" strokeWidth="3" />
          </g>

          <line x1="260" y1="90" x2="430" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="490" y1="90" x2="560" y2="90" stroke="#10b981" strokeWidth="2.5" />

          {/* Step Down Load R */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Step-Down Load R={R}Ω</text>
          </g>
          <line x1="560" y1="90" x2="560" y2="160" stroke="#10b981" strokeWidth="2.5" />
          <line x1="560" y1="220" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 13: Boost Converter ── */}
      {id === 'ape_13' && (
        <g>
          <g transform="translate(70, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Source ({Vs}V)</text>
          </g>
          <line x1="70" y1="155" x2="70" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="90" x2="160" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="225" x2="70" y2="290" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="290" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />

          {/* Energy Storage Inductor L FIRST */}
          <g transform="translate(160, 90)">
            <text x="0" y="-26" fill="#a78bfa" fontSize="11" fontWeight="800">Boost Inductor L ({L}mH)</text>
            <rect x="0" y="-16" width="70" height="10" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
            <path d="M 5 0 C 15 -14, 25 -14, 25 0 C 35 -14, 45 -14, 45 0 C 55 -14, 65 -14, 65 0" fill="none" stroke="#a78bfa" strokeWidth="3" />
          </g>

          {/* Shunt MOSFET Switch */}
          <g transform="translate(340, 190)">
            <rect x="-20" y="-18" width="40" height="36" fill={isRunning ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" rx="4" />
            <text x="-12" y="5" fill="#fff" fontSize="11" fontWeight="900">SW</text>
          </g>
          <line x1="340" y1="90" x2="340" y2="172" stroke="#10b981" strokeWidth="2" />
          <line x1="340" y1="208" x2="340" y2="290" stroke="#10b981" strokeWidth="2" />

          {/* Series Diode D */}
          <g transform="translate(440, 90)">
            <polygon points="-12,-12 -12,12 12,0" fill="#38bdf8" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="12" y1="-12" x2="12" y2="12" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-20" y="-20" fill="#38bdf8" fontSize="10" fontWeight="700">Diode D</text>
          </g>

          <line x1="230" y1="90" x2="428" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="452" y1="90" x2="560" y2="90" stroke="#10b981" strokeWidth="2.5" />

          {/* Boosted Output Load */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Boosted Load R={R}Ω</text>
          </g>
          <line x1="560" y1="90" x2="560" y2="160" stroke="#10b981" strokeWidth="2.5" />
          <line x1="560" y1="220" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 14: Buck-Boost Inverting Chopper ── */}
      {id === 'ape_14' && (
        <g>
          <g transform="translate(70, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Source ({Vs}V)</text>
          </g>
          <line x1="70" y1="155" x2="70" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="90" x2="200" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="225" x2="70" y2="290" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="290" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />

          {/* Series MOSFET */}
          <g transform="translate(240, 90)">
            <rect x="-20" y="-18" width="40" height="36" fill={isRunning ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" rx="4" />
            <text x="-14" y="5" fill="#fff" fontSize="11" fontWeight="900">MOSFET</text>
          </g>

          {/* Inductor L shunted to GND */}
          <g transform="translate(360, 190)">
            <rect x="-8" y="-35" width="16" height="70" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="1.5" rx="3" />
            <text x="18" y="4" fill="#a78bfa" fontSize="11" fontWeight="800">Inductor L ({L}mH)</text>
          </g>
          <line x1="360" y1="90" x2="360" y2="155" stroke="#10b981" strokeWidth="2" />
          <line x1="360" y1="225" x2="360" y2="290" stroke="#10b981" strokeWidth="2" />

          {/* Reversed Diode D for inverted polarity */}
          <g transform="translate(460, 90)">
            <polygon points="12,-12 12,12 -12,0" fill="#ef4444" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="-12" y1="-12" x2="-12" y2="12" stroke="#ef4444" strokeWidth="2.5" />
            <text x="-25" y="-20" fill="#ef4444" fontSize="10" fontWeight="800">Inverting Diode</text>
          </g>

          <line x1="260" y1="90" x2="472" y2="90" stroke="#10b981" strokeWidth="2.5" />
          <line x1="448" y1="90" x2="560" y2="90" stroke="#10b981" strokeWidth="2.5" />

          {/* Inverted Output Load R */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#ef4444" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#ef4444" fontSize="13" fontWeight="800">Inverted Load (-Vout)</text>
          </g>
          <line x1="560" y1="90" x2="560" y2="160" stroke="#10b981" strokeWidth="2.5" />
          <line x1="560" y1="220" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUITS 15 & 16: Class A / Class B Commutated Resonant Choppers ── */}
      {(id === 'ape_15' || id === 'ape_16') && (
        <g>
          <g transform="translate(70, 190)"><rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" /><text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Supply ({Vs}V)</text></g>
          <line x1="70" y1="155" x2="70" y2="90" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="70" y1="90" x2="180" y2="90" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="70" y1="225" x2="70" y2="290" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="290" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              <polygon points="140,86 152,90 140,94" filter="url(#glow)" />
              <polygon points="450,86 462,90 450,94" filter="url(#glow)" />
              <polygon points="556,130 560,142 564,130" filter="url(#glow)" />
              <text x="570" y="135" fill="#10b981" fontSize="11" fontWeight="900">I_out ↓</text>
            </g>
          )}

          {/* Main SCR T1 */}
          <g transform="translate(220, 90)">
            <polygon points="-15,-15 -15,15 15,0" fill={isRunning ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2.5" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="-25" y="-22" fill="#10b981" fontSize="11" fontWeight="800">Main SCR T1 {isRunning ? '(ON)' : ''}</text>
          </g>

          {/* LC Resonant Commutation Tank */}
          <g transform="translate(350, 90)">
            <rect x="-35" y="-22" width="70" height="44" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" rx="4" />
            <text x="-28" y="-4" fill="#a78bfa" fontSize="10" fontWeight="800">Resonant LC</text>
            <text x="-30" y="12" fill="#c084fc" fontSize="9">Tank (L={L}mH)</text>
          </g>

          <line x1="235" y1="90" x2="315" y2="90" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="385" y1="90" x2="560" y2="90" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(480, 50)">
            <rect x="-45" y="-12" width="90" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-38" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_out = {(duty * Vs).toFixed(1)} V
            </text>
          </g>

          {/* Output Load */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="12" fontWeight="800">Load R = {R} Ω</text>
          </g>
          <line x1="560" y1="90" x2="560" y2="160" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="560" y1="220" x2="560" y2="290" stroke="#10b981" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUITS 17, 18, 19: Multi-Quadrant Choppers & H-Bridge Motor ── */}
      {(id === 'ape_17' || id === 'ape_18' || id === 'ape_19') && (
        <g>
          <g transform="translate(60, 190)">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            <text x="-16" y="5" fill="#10b981" fontSize="12" fontWeight="900">DC {Vs}V</text>
          </g>
          <line x1="60" y1="164" x2="60" y2="60" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="60" x2="380" y2="60" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="216" x2="60" y2="320" stroke="#10b981" strokeWidth="2.5" />
          <line x1="60" y1="320" x2="380" y2="320" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              <polygon points="140,56 152,60 140,64" filter="url(#glow)" />
              <polygon points="245,186 257,190 245,194" filter="url(#glow)" />
              <text x="235" y="180" fill="#10b981" fontSize="11" fontWeight="900">I_arm →</text>
            </g>
          )}

          {/* H-Bridge 4 Switches */}
          <g transform="translate(220, 110)"><rect x="-18" y="-18" width="36" height="36" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-8" y="4" fill="#fff" fontSize="11" fontWeight="800">CH1</text></g>
          <g transform="translate(220, 270)"><rect x="-18" y="-18" width="36" height="36" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-8" y="4" fill="#fff" fontSize="11" fontWeight="800">CH2</text></g>
          <g transform="translate(380, 110)"><rect x="-18" y="-18" width="36" height="36" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-8" y="4" fill="#fff" fontSize="11" fontWeight="800">CH3</text></g>
          <g transform="translate(380, 270)"><rect x="-18" y="-18" width="36" height="36" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-8" y="4" fill="#fff" fontSize="11" fontWeight="800">CH4</text></g>

          <line x1="220" y1="60" x2="220" y2="320" stroke="#10b981" strokeWidth="2" />
          <line x1="380" y1="60" x2="380" y2="320" stroke="#10b981" strokeWidth="2" />

          {/* DC Armature Motor Load with Animated Rotating Shaft */}
          <g transform="translate(300, 190)">
            <circle cx="0" cy="0" r="30" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" filter={isRunning ? 'url(#glow)' : undefined} />
            <g transform={isRunning ? `rotate(${simTime * 360})` : undefined}>
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#f59e0b" strokeWidth="2.5" />
              <line x1="0" y1="-16" x2="0" y2="16" stroke="#f59e0b" strokeWidth="2.5" />
            </g>
            <text x="-16" y="5" fill="#fff" fontSize="11" fontWeight="900">M</text>
            <text x="-35" y="45" fill="#94a3b8" fontSize="10" fontWeight="700">4-Quadrant DC Motor</text>
          </g>
          <line x1="220" y1="190" x2="270" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="330" y1="190" x2="380" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
        </g>
      )}

      {/* ── CIRCUITS 20, 21, 22: Single-Phase Inverters (Half / Full / SPWM) ── */}
      {(id === 'ape_20' || id === 'ape_21' || id === 'ape_22') && (
        <g>
          <g transform="translate(60, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-35" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Bus ({Vs}V)</text>
          </g>
          <line x1="60" y1="155" x2="60" y2="70" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="70" x2="400" y2="70" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="225" x2="60" y2="310" stroke="#10b981" strokeWidth="2.5" />
          <line x1="60" y1="310" x2="400" y2="310" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              <polygon points="140,66 152,70 140,74" filter="url(#glow)" />
              <polygon points="270,186 282,190 270,194" filter="url(#glow)" />
              <text x="260" y="180" fill="#10b981" fontSize="11" fontWeight="900">I_ac →</text>
            </g>
          )}

          {/* 4 IGBT Switches */}
          <g transform="translate(240, 120)"><rect x="-20" y="-18" width="40" height="36" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-12" y="4" fill="#fff" fontSize="11" fontWeight="800">Q1</text></g>
          <g transform="translate(240, 260)"><rect x="-20" y="-18" width="40" height="36" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-12" y="4" fill="#fff" fontSize="11" fontWeight="800">Q4</text></g>
          <g transform="translate(400, 120)"><rect x="-20" y="-18" width="40" height="36" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-12" y="4" fill="#fff" fontSize="11" fontWeight="800">Q3</text></g>
          <g transform="translate(400, 260)"><rect x="-20" y="-18" width="40" height="36" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-12" y="4" fill="#fff" fontSize="11" fontWeight="800">Q2</text></g>

          <line x1="240" y1="70" x2="240" y2="310" stroke="#10b981" strokeWidth="2" />
          <line x1="400" y1="70" x2="400" y2="310" stroke="#10b981" strokeWidth="2" />

          {/* AC Output Load in Center */}
          <g transform="translate(320, 190)">
            <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" filter={isRunning ? 'url(#glow)' : undefined} />
            <path d="M -10 0 Q -5 -10 0 0 T 10 0" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <text x="-25" y="42" fill="#38bdf8" fontSize="11" fontWeight="800">AC Output ({freq}Hz)</text>
          </g>
          <line x1="240" y1="190" x2="296" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="344" y1="190" x2="400" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
        </g>
      )}

      {/* ── CIRCUITS 23 & 24: 3-Phase Inverter (180° / 120° Mode) ── */}
      {(id === 'ape_23' || id === 'ape_24') && (
        <g>
          <g transform="translate(50, 190)"><rect x="-20" y="-35" width="40" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" /><text x="-35" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Bus</text></g>
          <line x1="50" y1="155" x2="50" y2="60" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="50" y1="60" x2="400" y2="60" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="50" y1="225" x2="50" y2="320" stroke="#10b981" strokeWidth="2.5" />
          <line x1="50" y1="320" x2="400" y2="320" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g fill="#10b981">
              <polygon points="120,56 132,60 120,64" filter="url(#glow)" />
              <polygon points="460,171 472,175 460,179" fill="#ef4444" filter="url(#glow)" />
              <polygon points="460,186 472,190 460,194" fill="#eab308" filter="url(#glow)" />
              <polygon points="460,201 472,205 460,209" fill="#3b82f6" filter="url(#glow)" />
            </g>
          )}

          {/* 6 IGBT Legs (R, Y, B phases) */}
          <g transform="translate(200, 110)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q1</text></g>
          <g transform="translate(200, 270)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q4</text></g>
          <g transform="translate(300, 110)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q3</text></g>
          <g transform="translate(300, 270)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q6</text></g>
          <g transform="translate(400, 110)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q5</text></g>
          <g transform="translate(400, 270)"><rect x="-16" y="-16" width="32" height="32" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} /><text x="-6" y="4" fill="#fff" fontSize="10" fontWeight="900">Q2</text></g>

          <line x1="200" y1="60" x2="200" y2="320" stroke="#10b981" strokeWidth="2" />
          <line x1="300" y1="60" x2="300" y2="320" stroke="#10b981" strokeWidth="2" />
          <line x1="400" y1="60" x2="400" y2="320" stroke="#10b981" strokeWidth="2" />

          {/* 3 Phase Motor Load */}
          <g transform="translate(560, 190)">
            <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" filter={isRunning ? 'url(#glow)' : undefined} />
            <g transform={isRunning ? `rotate(${simTime * 360})` : undefined}>
              <line x1="-16" y1="0" x2="16" y2="0" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="0" y1="-16" x2="0" y2="16" stroke="#38bdf8" strokeWidth="2.5" />
            </g>
            <text x="-22" y="5" fill="#38bdf8" fontSize="13" fontWeight="900">3-PHASE</text>
            <text x="-22" y="20" fill="#38bdf8" fontSize="11" fontWeight="800">MOTOR</text>
            <text x="-45" y="50" fill="#a78bfa" fontSize="10" fontWeight="800">
              {id === 'ape_23' ? '180° Conduction Mode' : '120° Conduction Mode'}
            </text>
          </g>

          <line x1="200" y1="190" x2="528" y2="175" stroke="#ef4444" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="300" y1="190" x2="528" y2="190" stroke="#eab308" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="400" y1="190" x2="528" y2="205" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
        </g>
      )}

      {/* ── CIRCUITS 25 & 26: Cycloconverters ── */}
      {(id === 'ape_25' || id === 'ape_26') && (
        <g>
          <g transform="translate(60, 190)">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -12 0 Q -6 -12 0 0 T 12 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-40" y="45" fill="#94a3b8" fontSize="11" fontWeight="700">50Hz Supply</text>
          </g>
          <line x1="60" y1="164" x2="60" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="90" x2="200" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="216" x2="60" y2="290" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="60" y1="290" x2="200" y2="290" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g>
              {isConductionPositive && <polygon points="120,86 132,90 120,94" fill="#10b981" filter="url(#glow)" />}
              {isConductionNegative && <polygon points="120,286 132,290 120,294" fill="#ef4444" filter="url(#glow)" />}
              <polygon points="400,106 412,110 400,114" fill="#10b981" filter="url(#glow)" />
              <text x="380" y="100" fill="#f59e0b" fontSize="11" fontWeight="900">I_16.6Hz →</text>
            </g>
          )}

          {/* Positive Converter Group */}
          <g transform="translate(260, 110)">
            <rect x="-35" y="-22" width="70" height="44" fill={isConductionPositive ? '#10b981' : '#0f172a'} stroke="#10b981" strokeWidth="2" rx="4" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <text x="-26" y="4" fill={isConductionPositive ? '#fff' : '#10b981'} fontSize="11" fontWeight="800">P-Group SCRs</text>
          </g>

          {/* Negative Converter Group */}
          <g transform="translate(260, 270)">
            <rect x="-35" y="-22" width="70" height="44" fill={isConductionNegative ? '#ef4444' : '#0f172a'} stroke="#ef4444" strokeWidth="2" rx="4" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <text x="-28" y="4" fill={isConductionNegative ? '#fff' : '#ef4444'} fontSize="11" fontWeight="800">N-Group SCRs</text>
          </g>

          <line x1="200" y1="90" x2="225" y2="110" stroke="#38bdf8" strokeWidth="2" />
          <line x1="200" y1="290" x2="225" y2="270" stroke="#38bdf8" strokeWidth="2" />

          <line x1="295" y1="110" x2="480" y2="110" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="295" y1="270" x2="480" y2="270" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Low Frequency AC Load Output */}
          <g transform="translate(560, 190)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" filter={isRunning ? 'url(#glow)' : undefined} />
            <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="-35" y="46" fill="#f59e0b" fontSize="12" fontWeight="800">f_out = 16.6 Hz</text>
          </g>
          <line x1="480" y1="110" x2="480" y2="270" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="480" y1="190" x2="532" y2="190" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
        </g>
      )}

      {/* ── CIRCUITS 27 & 28: AC Voltage Controllers (TRIAC / Phase Angle) ── */}
      {(id === 'ape_27' || id === 'ape_28') && (
        <g>
          <g transform="translate(80, 190)">
            <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
            <path d="M -14 0 Q -7 -14 0 0 T 14 0" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <text x="-45" y="48" fill="#94a3b8" fontSize="11" fontWeight="700">AC Input ({Vs}V)</text>
          </g>
          <line x1="80" y1="162" x2="80" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="90" x2="240" y2="90" stroke={isConductionPositive ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="218" x2="80" y2="290" stroke={isConductionNegative ? activeStroke : inactiveStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="290" x2="560" y2="290" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g>
              {isConductionPositive && <polygon points="170,86 182,90 170,94" fill="#10b981" filter="url(#glow)" />}
              {isConductionNegative && <polygon points="170,286 182,290 170,294" fill="#ef4444" filter="url(#glow)" />}
              <polygon points="410,86 422,90 410,94" fill={isConductionPositive ? '#10b981' : '#ef4444'} filter="url(#glow)" />
              <text x="378" y="78" fill="#10b981" fontSize="11" fontWeight="900">I_ac →</text>
            </g>
          )}

          {/* Anti-Parallel SCRs or TRIAC */}
          <g transform="translate(280, 90)">
            <polygon points="-14,-14 -14,14 14,0" fill={isConductionPositive ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" filter={isConductionPositive ? 'url(#glow)' : undefined} />
            <polygon points="14,-14 14,14 -14,0" fill={isConductionNegative ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" transform="translate(0, 22)" filter={isConductionNegative ? 'url(#glow)' : undefined} />
            <text x="-25" y="-22" fill="#10b981" fontSize="12" fontWeight="800">
              {id === 'ape_27' ? 'TRIAC Switch' : 'Anti-Parallel SCR Pair'}
            </text>
          </g>

          <line x1="294" y1="90" x2="560" y2="90" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="560" y1="90" x2="560" y2="160" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(450, 48)">
            <rect x="-50" y="-12" width="100" height="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" rx="4" />
            <text x="-44" y="3" fill="#38bdf8" fontSize="10" fontWeight="800">
              V_rms = {(Vs * Math.sqrt(0.5 + (Math.PI - (alpha * Math.PI / 180)) / (2 * Math.PI))).toFixed(1)} V
            </text>
          </g>

          {/* Variable Voltage Load */}
          <g transform="translate(560, 190)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="24" y="5" fill="#f59e0b" fontSize="13" fontWeight="800">Regulated AC Load</text>
            <text x="24" y="22" fill="#94a3b8" fontSize="10">α = {alpha}° Phase Control</text>
          </g>
          <line x1="560" y1="220" x2="560" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* ── CIRCUIT 29: UJT Relaxation Oscillator Trigger Circuit ── */}
      {id === 'ape_29' && (
        <g>
          <g transform="translate(80, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">DC Vbb ({Vs}V)</text>
          </g>
          <line x1="80" y1="155" x2="80" y2="80" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="80" x2="480" y2="80" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="80" y1="225" x2="80" y2="300" stroke="#10b981" strokeWidth="2.5" />
          <line x1="80" y1="300" x2="480" y2="300" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g>
              <polygon points="140,76 152,80 140,84" fill="#10b981" filter="url(#glow)" />
              <text x="130" y="70" fill="#10b981" fontSize="10" fontWeight="900">I_bb →</text>
              <polygon points="240,186 252,190 240,194" fill="#a78bfa" filter="url(#glow)" />
              <text x="225" y="180" fill="#a78bfa" fontSize="10" fontWeight="900">I_E →</text>
            </g>
          )}

          {/* Timing Resistors R_E & Capacitor C_E */}
          <g transform="translate(200, 140)">
            <rect x="-10" y="-20" width="20" height="40" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="2" />
            <text x="-25" y="-26" fill="#f59e0b" fontSize="10" fontWeight="700">R_E (Timing)</text>
          </g>
          <g transform="translate(200, 240)">
            <line x1="-15" y1="-5" x2="15" y2="-5" stroke={isRunning ? '#38bdf8' : '#475569'} strokeWidth="3" />
            <line x1="-15" y1="5" x2="15" y2="5" stroke={isRunning ? '#38bdf8' : '#475569'} strokeWidth="3" />
            <text x="-20" y="24" fill="#38bdf8" fontSize="10" fontWeight="700">C_E {isRunning ? '(Charging)' : 'Capacitor'}</text>
          </g>
          <line x1="200" y1="80" x2="200" y2="120" stroke={activeStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="200" y1="160" x2="200" y2="235" stroke={activeStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="200" y1="245" x2="200" y2="300" stroke="#10b981" strokeWidth="2" />

          {/* UJT Symbol (2N2646) */}
          <g transform="translate(320, 190)">
            <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#a78bfa" strokeWidth="2.5" filter={isRunning ? 'url(#glow)' : undefined} />
            <line x1="-24" y1="0" x2="-8" y2="0" stroke="#a78bfa" strokeWidth="2.5" />
            <line x1="0" y1="-24" x2="0" y2="24" stroke="#a78bfa" strokeWidth="2.5" />
            <polygon points="-8,-4 -8,4 2,0" fill="#a78bfa" />
            <text x="-18" y="-30" fill="#a78bfa" fontSize="12" fontWeight="800">UJT 2N2646 {isRunning ? '(FIRING)' : ''}</text>
          </g>
          <line x1="200" y1="190" x2="296" y2="190" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="320" y1="80" x2="320" y2="166" stroke={activeStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="320" y1="214" x2="320" y2="300" stroke="#10b981" strokeWidth="2" />

          {/* Pulse Transformer Trigger Output */}
          <g transform="translate(480, 190)">
            <rect x="-24" y="-30" width="48" height="60" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="-20" y="-4" fill="#f59e0b" fontSize="10" fontWeight="800">Pulse</text>
            <text x="-22" y="12" fill="#f59e0b" fontSize="10" fontWeight="800">Trans.</text>
            <text x="30" y="4" fill={isRunning ? '#10b981' : '#94a3b8'} fontSize="11" fontWeight="800">→ SCR Gate Pulse (α={alpha}°)</text>
          </g>
        </g>
      )}

      {/* ── CIRCUIT 30: SMPS Flyback Converter ── */}
      {id === 'ape_30' && (
        <g>
          {/* DC Input from Bridge Rectifier */}
          <g transform="translate(70, 190)">
            <rect x="-24" y="-35" width="48" height="70" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="6" />
            <text x="-40" y="52" fill="#94a3b8" fontSize="11" fontWeight="700">Rectified DC ({Vs}V)</text>
          </g>
          <line x1="70" y1="155" x2="70" y2="80" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="70" y1="80" x2="220" y2="80" stroke={activeStroke} strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="70" y1="225" x2="70" y2="300" stroke="#10b981" strokeWidth="2.5" />
          <line x1="70" y1="300" x2="560" y2="300" stroke="#10b981" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={-dashOffset} />

          {/* Current Flow Direction Arrows */}
          {isRunning && (
            <g>
              <polygon points="140,76 152,80 140,84" fill="#10b981" filter="url(#glow)" />
              <text x="128" y="70" fill="#10b981" fontSize="10" fontWeight="900">I_pri →</text>
              <polygon points="450,96 462,100 450,104" fill="#f59e0b" filter="url(#glow)" />
              <text x="438" y="90" fill="#f59e0b" fontSize="10" fontWeight="900">I_sec →</text>
            </g>
          )}

          {/* High-Frequency Ferrite Flyback Transformer */}
          <g transform="translate(240, 140)">
            <rect x="-15" y="-50" width="30" height="100" fill="url(#coreGrad)" stroke="#a78bfa" strokeWidth="2" rx="4" />
            <text x="-35" y="-58" fill="#a78bfa" fontSize="11" fontWeight="800">Ferrite Core Transformer</text>
            {/* Primary Np */}
            <path d="M -15 -40 Q -30 -30 -15 -20 Q -30 -10 -15 0 Q -30 10 -15 20 Q -30 30 -15 40" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="-32" cy="-40" r="3" fill="#38bdf8" />
            {/* Secondary Ns */}
            <path d="M 15 -40 Q 30 -30 15 -20 Q 30 -10 15 0 Q 30 10 15 20 Q 30 30 15 40" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="32" cy="40" r="3" fill="#f59e0b" />
          </g>

          {/* High-Speed PWM Switch MOSFET */}
          <g transform="translate(225, 230)">
            <rect x="-18" y="-18" width="36" height="36" fill={isRunning ? '#10b981' : '#1e293b'} stroke="#10b981" strokeWidth="2" rx="4" filter={isRunning ? 'url(#glow)' : undefined} />
            <text x="-12" y="4" fill="#fff" fontSize="10" fontWeight="900">SW {isRunning ? '(ON)' : '(OFF)'}</text>
            <text x="-65" y="4" fill="#38bdf8" fontSize="9" fontWeight="800">100kHz PWM</text>
          </g>
          <line x1="225" y1="180" x2="225" y2="212" stroke={activeStroke} strokeWidth="2" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="225" y1="248" x2="225" y2="300" stroke="#10b981" strokeWidth="2" />

          {/* Output Ultra-Fast Diode D */}
          <g transform="translate(380, 100)">
            <polygon points="-12,-12 -12,12 12,0" fill={isRunning ? '#f59e0b' : '#1e293b'} stroke="#f59e0b" strokeWidth="2.5" filter={isRunning ? 'url(#glow)' : undefined} />
            <line x1="12" y1="-12" x2="12" y2="12" stroke="#f59e0b" strokeWidth="2.5" />
            <text x="-20" y="-20" fill="#f59e0b" fontSize="10" fontWeight="700">Fast Diode {isRunning ? '(ON)' : ''}</text>
          </g>
          <line x1="255" y1="100" x2="368" y2="100" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />
          <line x1="392" y1="100" x2="560" y2="100" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray={isRunning ? "6 4" : undefined} strokeDashoffset={dashOffset} />

          {/* Voltage Meter */}
          <g transform="translate(480, 55)">
            <rect x="-48" y="-12" width="96" height="22" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" rx="4" />
            <text x="-42" y="3" fill="#10b981" fontSize="10" fontWeight="800">
              V_out = {(Vs * (duty / Math.max(0.01, 1 - duty))).toFixed(1)} V
            </text>
          </g>

          {/* Filter Capacitor C & Output Load R */}
          <g transform="translate(560, 200)">
            <rect x="-14" y="-30" width="28" height="60" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" rx="4" />
            <text x="24" y="5" fill="#10b981" fontSize="13" fontWeight="800">Isolated DC Load R={R}Ω</text>
          </g>
          <line x1="560" y1="100" x2="560" y2="170" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="560" y1="230" x2="560" y2="300" stroke="#f59e0b" strokeWidth="2.5" />
        </g>
      )}
    </svg>
  );
};

export const PowerElectronicsLabModal: React.FC<PowerElectronicsLabModalProps> = ({ onClose }) => {
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>('ape_1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'schematic' | 'waveforms' | 'parameters' | 'theory'>('schematic');

  // Circuit Operating Parameters State
  const circuit = APE_CIRCUITS.find(c => c.id === selectedCircuitId) || APE_CIRCUITS[0];

  const [alpha, setAlpha] = useState<number>(circuit.defaultAlpha);
  const [duty, setDuty] = useState<number>(circuit.defaultDuty);
  const [Vs, setVs] = useState<number>(circuit.defaultVs);
  const [freq, setFreq] = useState<number>(circuit.defaultFreq);
  const [R, setR] = useState<number>(circuit.defaultR);
  const [L, setL] = useState<number>(circuit.defaultL); // in mH

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simTime, setSimTime] = useState<number>(0);

  // Update defaults when switching circuits
  useEffect(() => {
    setAlpha(circuit.defaultAlpha);
    setDuty(circuit.defaultDuty);
    setVs(circuit.defaultVs);
    setFreq(circuit.defaultFreq);
    setR(circuit.defaultR);
    setL(circuit.defaultL);
  }, [selectedCircuitId]);

  // Animation Loop for live current flow & pulse timing
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSimTime(prev => (prev + 0.02) % (Math.PI * 4));
    }, 30);
    return () => clearInterval(interval);
  }, [isRunning]);

  // ── MATH CALCULATIONS & PARAMETERS EVALUATION ────────────────────────────
  const alphaRad = (alpha * Math.PI) / 180;
  const Vm = Vs * Math.SQRT2;
  const L_henry = L / 1000;
  const omega = 2 * Math.PI * freq;
  const XL = omega * L_henry;
  const Z = Math.sqrt(R * R + XL * XL);
  const phi = Math.atan2(XL, R); // Impedance angle

  // Calculated Vdc, Vrms, Idc, Irms, B_field
  let Vdc = 0;
  let Vrms = 0;

  if (circuit.category === 'rectifiers') {
    if (circuit.id === 'ape_1') {
      Vdc = (Vm / (2 * Math.PI)) * (1 + Math.cos(alphaRad));
      Vrms = (Vm / 2) * Math.sqrt(1 - alpha / 180 + Math.sin(2 * alphaRad) / (2 * Math.PI));
    } else if (circuit.id === 'ape_2') {
      const betaRad = Math.min(Math.PI * 1.2, alphaRad + Math.PI * 0.8);
      Vdc = (Vm / (2 * Math.PI)) * (Math.cos(alphaRad) - Math.cos(betaRad));
      Vrms = Vdc * 1.25;
    } else if (circuit.id === 'ape_3' || circuit.id === 'ape_7') {
      Vdc = (Vm / Math.PI) * (1 + Math.cos(alphaRad));
      Vrms = Vdc * 1.15;
    } else if (circuit.id === 'ape_4' || circuit.id === 'ape_5' || circuit.id === 'ape_6') {
      Vdc = (2 * Vm / Math.PI) * Math.cos(alphaRad);
      Vrms = Vm * Math.sqrt(0.5 + (Math.sin(2 * alphaRad) / (2 * Math.PI)));
    } else if (circuit.id === 'ape_8') {
      Vdc = 1.17 * Vs;
      Vrms = 1.19 * Vs;
    } else if (circuit.id === 'ape_9') {
      Vdc = (3 * Math.SQRT2 * Vs / (2 * Math.PI)) * Math.cos(alphaRad);
      Vrms = Vdc * 1.08;
    } else if (circuit.id === 'ape_10') {
      Vdc = (3 * Math.SQRT2 * Vs / Math.PI) * Math.cos(alphaRad);
      Vrms = Math.abs(Vdc) * 1.02;
    } else if (circuit.id === 'ape_11') {
      Vdc = (3 * Math.SQRT2 * Vs / (2 * Math.PI)) * (1 + Math.cos(alphaRad));
      Vrms = Vdc * 1.05;
    }
  } else if (circuit.category === 'choppers') {
    if (circuit.id === 'ape_12' || circuit.id === 'ape_15' || circuit.id === 'ape_16' || circuit.id === 'ape_17') {
      Vdc = duty * Vs;
      Vrms = Math.sqrt(duty) * Vs;
    } else if (circuit.id === 'ape_13') {
      Vdc = Vs / Math.max(0.05, 1 - duty);
      Vrms = Vdc * 0.98;
    } else if (circuit.id === 'ape_14') {
      Vdc = -Vs * (duty / Math.max(0.05, 1 - duty));
      Vrms = Math.abs(Vdc);
    } else if (circuit.id === 'ape_18' || circuit.id === 'ape_19') {
      Vdc = (2 * duty - 1) * Vs;
      Vrms = Math.abs(Vdc) * 1.1;
    }
  } else if (circuit.category === 'inverters') {
    if (circuit.id === 'ape_20') {
      Vdc = Vs / 2;
      Vrms = Vs / 2;
    } else if (circuit.id === 'ape_21') {
      Vdc = Vs;
      Vrms = Vs;
    } else if (circuit.id === 'ape_22') {
      Vdc = duty * (Vs / Math.SQRT2);
      Vrms = Vdc;
    } else if (circuit.id === 'ape_23') {
      Vdc = (Math.SQRT2 / 3) * Vs;
      Vrms = 0.47 * Vs;
    } else if (circuit.id === 'ape_24') {
      Vdc = (1 / Math.sqrt(6)) * Vs;
      Vrms = 0.41 * Vs;
    }
  } else {
    Vdc = (Vs * (1 - alpha / 180));
    Vrms = Vs * Math.sqrt(Math.max(0, 1 - alpha / 180 + Math.sin(2 * alphaRad) / (2 * Math.PI)));
  }

  const Idc = Math.max(0, Vdc / R);
  const Irms = Math.max(0.01, (Vrms / Math.max(1, Z)));
  const Ipeak = Irms * Math.SQRT2;

  // Magnetic Field Calculations (Inductor / Transformer Core B-Field)
  // B = (μ_0 * μ_r * N * I) / l  or  B = (L * I) / (N * A)
  const N_turns = 200; // turns
  const CoreArea = 0.002; // m² (20 cm²)
  const B_Tesla = L_henry > 0 ? (L_henry * Ipeak) / (N_turns * CoreArea) : (0.4 * Irms); // Tesla
  const H_AmpTurnsPerMeter = (N_turns * Irms) / 0.15; // A/m
  const StoredEnergyJoules = 0.5 * L_henry * Irms * Irms; // 1/2 L I²

  // SCR Conduction State Animation
  const isConductionPositive = Math.sin(simTime) > Math.sin(alphaRad - 0.2);
  const isConductionNegative = Math.sin(simTime + Math.PI) > Math.sin(alphaRad - 0.2);

  // Filter Circuits by Category
  const filteredCircuits = APE_CIRCUITS.filter(c =>
    selectedCategory === 'all' ? true : c.category === selectedCategory
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* ── Main Outer Chassis ────────────────────────────────────────────── */}
      <div
        style={{
          width: '1380px',
          maxWidth: '98vw',
          height: '92vh',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          border: '2px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), inset 0 1px 2px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ── Header Title Bar ────────────────────────────────────────────── */}
        <div
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.5)',
              }}
            >
              <Zap size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.02em', color: '#f8fafc' }}>
                MSBTE ADVANCED POWER ELECTRONICS VIRTUAL LABORATORY
              </div>
              <div style={{ fontSize: '0.72rem', color: '#818cf8', fontWeight: 700, letterSpacing: '0.05em' }}>
                30 PRACTICAL CURRICULUM CIRCUITS · SCHEMATICS · B-FIELD DYNAMICS · REAL WAVEFORMS
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isRunning ? '#ef4444' : '#10b981',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              <span>{isRunning ? 'FREEZE SIM' : 'RUN LIVE'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Main Body Grid ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── LEFT SIDEBAR: 30 CIRCUIT SELECTOR LIST ────────────────────── */}
          <div
            style={{
              width: '320px',
              background: '#090d16',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Category Filter Pills */}
            <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All 30' },
                { id: 'rectifiers', label: 'SCR Rectifiers' },
                { id: 'choppers', label: 'DC Choppers' },
                { id: 'inverters', label: 'Inverters' },
                { id: 'ac_controllers', label: 'AC Control' },
                { id: 'industrial', label: 'Industrial' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: selectedCategory === cat.id ? '#4f46e5' : '#1e293b',
                    color: selectedCategory === cat.id ? '#fff' : '#94a3b8',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Circuit Item List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filteredCircuits.map(item => {
                const isSelected = item.id === selectedCircuitId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCircuitId(item.id)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                      background: isSelected ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.15))' : 'rgba(255,255,255,0.02)',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: isSelected ? '#818cf8' : '#e2e8f0', lineHeight: 1.3 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.64rem', color: '#64748b', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CENTER / RIGHT CONTENT WORKSPACE ───────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a', overflow: 'hidden' }}>

            {/* Sub-Header Tabs */}
            <div style={{ padding: '8px 16px', background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'schematic', label: '⚡ Actual MSBTE Circuit Schematic & B-Field', icon: Eye },
                  { id: 'waveforms', label: '📊 Dual-Channel Oscilloscope & Field Waveforms', icon: Monitor },
                  { id: 'parameters', label: '📐 Electrical & Magnetic Parameter Calculations', icon: Gauge },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: isActive ? '1px solid #6366f1' : '1px solid transparent',
                        background: isActive ? '#312e81' : 'transparent',
                        color: isActive ? '#a5b4fc' : '#94a3b8',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Firing Angle Quick Indicator */}
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                Mode: {circuit.category.toUpperCase()} | Firing Angle α: {alpha}° | Duty D: {(duty * 100).toFixed(0)}%
              </div>
            </div>

            {/* Main Display Area */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* ── TAB 1: SCHEMATIC DIAGRAM & MAGNETIC FIELD ANIMATION ────── */}
              {activeTab === 'schematic' && (
                <div style={{ display: 'flex', gap: '16px', height: '100%', minHeight: '440px' }}>

                  {/* Left: SVG Diagram Frame */}
                  <div style={{ flex: 2, background: '#050b14', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#818cf8', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>MSBTE DIPLOMA STANDARD CIRCUIT DIAGRAM</span>
                      <span style={{ fontSize: '0.7rem', color: '#10b981' }}>🟢 VIRTUAL CURRENT & B-FIELD FLUX ANIMATION LIVE</span>
                    </div>

                    {/* Dynamic SVG Schematic Canvas for Selected Circuit */}
                    <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '340px' }}>
                      <APESchematicSVG
                        circuit={circuit}
                        Vs={Vs}
                        freq={freq}
                        alpha={alpha}
                        duty={duty}
                        R={R}
                        L={L}
                        B_Tesla={B_Tesla}
                        simTime={simTime}
                        isRunning={isRunning}
                        isConductionPositive={isConductionPositive}
                        isConductionNegative={isConductionNegative}
                      />
                    </div>

                    {/* Operational Summary Banner */}
                    <div style={{ background: '#090d16', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                      <div><strong style={{ color: '#38bdf8' }}>Supply Vs:</strong> {Vs}V RMS</div>
                      <div><strong style={{ color: '#10b981' }}>SCR Conduction:</strong> {isConductionPositive ? 'CONDUCTING (ON)' : 'BLOCKING (OFF)'}</div>
                      <div><strong style={{ color: '#c084fc' }}>Magnetic Flux B:</strong> {B_Tesla.toFixed(3)} Tesla</div>
                      <div><strong style={{ color: '#f59e0b' }}>Vdc Output:</strong> {Vdc.toFixed(1)} V</div>
                    </div>
                  </div>

                  {/* Right: Live Interactive Controls Panel */}
                  <div style={{ flex: 1, background: '#050b14', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase' }}>
                      🎛️ CIRCUIT PARAMETER CONTROLS
                    </div>

                    {/* Firing Angle Slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Firing Angle α (Degrees)</span>
                        <span style={{ color: '#f59e0b', fontWeight: 900 }}>{alpha}°</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={180}
                        value={alpha}
                        onChange={e => setAlpha(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#f59e0b' }}
                      />
                    </div>

                    {/* Duty Cycle Slider (For Choppers) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>PWM Duty Cycle D</span>
                        <span style={{ color: '#38bdf8', fontWeight: 900 }}>{(duty * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.05}
                        max={0.95}
                        step={0.01}
                        value={duty}
                        onChange={e => setDuty(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#38bdf8' }}
                      />
                    </div>

                    {/* Supply Voltage */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Input Voltage Vs (V)</span>
                        <span style={{ color: '#10b981', fontWeight: 900 }}>{Vs} V</span>
                      </div>
                      <input
                        type="range"
                        min={12}
                        max={600}
                        value={Vs}
                        onChange={e => setVs(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#10b981' }}
                      />
                    </div>

                    {/* Resistance R */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Load Resistance R (Ω)</span>
                        <span style={{ color: '#e0e7ff', fontWeight: 900 }}>{R} Ω</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={500}
                        value={R}
                        onChange={e => setR(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#6366f1' }}
                      />
                    </div>

                    {/* Inductance L */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                        <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Load Inductance L (mH)</span>
                        <span style={{ color: '#c084fc', fontWeight: 900 }}>{L} mH</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={500}
                        value={L}
                        onChange={e => setL(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#a855f7' }}
                      />
                    </div>

                    {/* Formulas Card */}
                    <div style={{ marginTop: 'auto', background: '#090d16', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase' }}>
                        📚 MSBTE TEXTBOOK FORMULAS
                      </div>
                      <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{circuit.formulaVdc}</div>
                        <div>{circuit.formulaI}</div>
                        <div style={{ color: '#c084fc' }}>{circuit.formulaB}</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ── TAB 2: OSCILLOSCOPE WAVEFORMS ────────────────────────────── */}
              {activeTab === 'waveforms' && (
                <div style={{ background: '#020617', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#38bdf8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>DUAL-CHANNEL OSCILLOSCOPE: INPUT vs RECTIFIED/CHOPPED WAVEFORM</span>
                    <span style={{ color: '#c084fc' }}>PURPLE: MAGNETIC FLUX B(t) DYNAMICS</span>
                  </div>

                  {/* SVG Oscilloscope Trace Canvas */}
                  <div style={{ height: '360px', width: '100%', background: '#000000', borderRadius: '12px', border: '2px solid #0f172a', position: 'relative', overflow: 'hidden' }}>
                    <svg width="100%" height="100%" viewBox="0 0 800 360">
                      {/* Graticule Lines */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line key={`h_${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#1e293b" strokeDasharray="3 3" />
                      ))}
                      {Array.from({ length: 17 }).map((_, i) => (
                        <line key={`v_${i}`} x1={i * 50} y1="0" x2={i * 50} y2="360" stroke="#1e293b" strokeDasharray="3 3" />
                      ))}

                      {/* Zero Volt Center Reference Axis */}
                      <line x1="0" y1="180" x2="800" y2="180" stroke="#334155" strokeWidth="1.5" />

                      {/* 1. Input AC Voltage Trace (Cyan) */}
                      <path
                        d={Array.from({ length: 400 }).reduce<string>((acc, _, i) => {
                          const x = (i / 400) * 800;
                          const t = (i / 400) * Math.PI * 4 + simTime;
                          const y = 180 - Math.sin(t) * 90;
                          return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '')}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2"
                        opacity={0.8}
                      />

                      {/* 2. Output Voltage Trace (Amber / Green) */}
                      <path
                        d={Array.from({ length: 400 }).reduce<string>((acc, _, i) => {
                          const x = (i / 400) * 800;
                          const t = (i / 400) * Math.PI * 4 + simTime;
                          const phaseInCycle = ((t / (Math.PI * 2)) % 1 + 1) % 1;

                          let vInstant = Math.sin(t);
                          if (circuit.category === 'rectifiers') {
                            if (phaseInCycle < (alpha / 360) || phaseInCycle > 0.5) {
                              vInstant = 0; // Cut off by SCR firing angle
                            }
                          } else if (circuit.category === 'choppers') {
                            vInstant = (phaseInCycle % 0.2) < (duty * 0.2) ? 1.2 : 0;
                          }

                          const y = 180 - vInstant * 90;
                          return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '')}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />

                      {/* 3. Magnetic Field B(t) Trace (Purple) */}
                      <path
                        d={Array.from({ length: 400 }).reduce<string>((acc, _, i) => {
                          const x = (i / 400) * 800;
                          const t = (i / 400) * Math.PI * 4 + simTime;
                          const bInstant = Math.abs(Math.sin(t - phi)) * (B_Tesla / 2);
                          const y = 300 - bInstant * 60;
                          return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '')}
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />
                    </svg>
                  </div>

                  {/* Waveform Legend */}
                  <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '0.76rem', fontWeight: 800 }}>
                    <span style={{ color: '#38bdf8' }}>🔵 CH1: Input Voltage Vin(t)</span>
                    <span style={{ color: '#f59e0b' }}>🟡 CH2: Rectified/Chopped Vout(t)</span>
                    <span style={{ color: '#c084fc' }}>🟣 B-Field: Magnetic Flux Density B(t)</span>
                  </div>
                </div>
              )}

              {/* ── TAB 3: ELECTRICAL & MAGNETIC CALCULATIONS ───────────────── */}
              {activeTab === 'parameters' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

                  {/* Card 1: Voltage Parameters */}
                  <div style={{ background: '#050b14', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>⚡ VOLTAGE PARAMETERS</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Average DC Voltage (Vdc):</span>
                      <strong style={{ color: '#f8fafc' }}>{Vdc.toFixed(2)} V</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>RMS Voltage (Vrms):</span>
                      <strong style={{ color: '#f8fafc' }}>{Vrms.toFixed(2)} V</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Peak Voltage (Vm):</span>
                      <strong style={{ color: '#f8fafc' }}>{Vm.toFixed(2)} V</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Ripple Factor (RF):</span>
                      <strong style={{ color: '#f59e0b' }}>{Vdc > 0 ? Math.sqrt(Math.max(0, (Vrms/Vdc)**2 - 1)).toFixed(3) : 'N/A'}</strong>
                    </div>
                  </div>

                  {/* Card 2: Current & Impedance */}
                  <div style={{ background: '#050b14', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>🔌 CURRENT & IMPEDANCE</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>DC Current (Idc):</span>
                      <strong style={{ color: '#f8fafc' }}>{Idc.toFixed(2)} A</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>RMS Current (Irms):</span>
                      <strong style={{ color: '#f8fafc' }}>{Irms.toFixed(2)} A</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Total Impedance (Z):</span>
                      <strong style={{ color: '#f8fafc' }}>{Z.toFixed(2)} Ω</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Phase Shift (ϕ):</span>
                      <strong style={{ color: '#10b981' }}>{(phi * 180 / Math.PI).toFixed(1)}°</strong>
                    </div>
                  </div>

                  {/* Card 3: Magnetic Field & Core Energy */}
                  <div style={{ background: '#050b14', borderRadius: '16px', border: '1px solid #1e293b', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#c084fc', textTransform: 'uppercase' }}>🧲 MAGNETIC FIELD (B-FIELD)</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Flux Density (B):</span>
                      <strong style={{ color: '#c084fc' }}>{B_Tesla.toFixed(4)} Tesla</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Field Intensity (H):</span>
                      <strong style={{ color: '#f8fafc' }}>{H_AmpTurnsPerMeter.toFixed(1)} A/m</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Stored Magnetic Energy:</span>
                      <strong style={{ color: '#f8fafc' }}>{(StoredEnergyJoules * 1000).toFixed(2)} mJ</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#94a3b8' }}>Core Material:</span>
                      <strong style={{ color: '#a78bfa' }}>Ferrite / Silicon Steel</strong>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
