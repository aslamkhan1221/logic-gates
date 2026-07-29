import type { CircuitData } from '../types/logic';
import { createDefaultPortsForNode } from './GateLogic';

export interface PresetCircuit {
  id: string;
  name: string;
  description: string;
  data: CircuitData;
}

export const PRESET_CIRCUITS: PresetCircuit[] = [
  // 1. JK FLIP-FLOP RACE-AROUND
  {
    id: 'race_around_jk',
    name: '⚡ 1. JK Flip-Flop Race-Around Condition Experiment',
    description: 'Demonstrates Level-Triggered JK Flip-Flop Race-Around Condition (J=1, K=1, CLK=1) vs Master-Slave Race-Free operation.',
    data: {
      version: 1,
      nodes: [
        { id: 'vcc_j', type: 'CONST_HIGH', label: 'J Input (1)', x: 60, y: 120, width: 60, height: 60, ...createDefaultPortsForNode('CONST_HIGH'), state: { value: 1 } },
        { id: 'vcc_k', type: 'CONST_HIGH', label: 'K Input (1)', x: 60, y: 260, width: 60, height: 60, ...createDefaultPortsForNode('CONST_HIGH'), state: { value: 1 } },
        { id: 'clk_race', type: 'CONST_HIGH', label: 'CLK High (1)', x: 60, y: 190, width: 60, height: 60, ...createDefaultPortsForNode('CONST_HIGH'), state: { value: 1 } },
        { id: 'jk_racing', type: 'JK_FLIPFLOP', label: 'Level-Triggered JK (RACING)', x: 240, y: 140, width: 120, height: 100, ...createDefaultPortsForNode('JK_FLIPFLOP'), state: { triggerMode: 'level', isRacing: true } },
        { id: 'cro_1', type: 'CRO_SCOPE', label: 'CRO Oscilloscope', x: 440, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1, timePerDiv: 1 } },
        { id: 'note_race', type: 'TEXT_NOTE', label: 'Race Condition Explanation', x: 620, y: 120, width: 220, height: 180, inputs: [], outputs: [], state: { text: '⚡ **RACE-AROUND CONDITION LAB**\n\nWhen J=1, K=1, and Clock pulse is HIGH (1) for duration $t_p > \\Delta t$ (propagation delay), output Q toggles repeatedly, causing rapid high-frequency oscillation!\n\n💡 Click CRO to inspect rapid toggle waveform.' } },
      ],
      wires: [
        { id: 'w_j', fromNodeId: 'vcc_j', fromPortId: 'out_0', toNodeId: 'jk_racing', toPortId: 'in_j', signal: 1 },
        { id: 'w_clk', fromNodeId: 'clk_race', fromPortId: 'out_0', toNodeId: 'jk_racing', toPortId: 'in_clk', signal: 1 },
        { id: 'w_k', fromNodeId: 'vcc_k', fromPortId: 'out_0', toNodeId: 'jk_racing', toPortId: 'in_k', signal: 1 },
        { id: 'w_cro_1', fromNodeId: 'jk_racing', fromPortId: 'out_q', toNodeId: 'cro_1', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_cro_2', fromNodeId: 'jk_racing', fromPortId: 'out_qbar', toNodeId: 'cro_1', toPortId: 'in_ch2', signal: 0 },
      ],
    },
  },

  // 2. HALF WAVE RECTIFIER
  {
    id: 'half_wave_rectifier',
    name: '🔌 2. Half-Wave Rectifier Circuit',
    description: 'Converts AC voltage into pulsating DC by allowing only positive half-cycles to pass through a PN Junction Diode.',
    data: {
      version: 1,
      nodes: [
        { id: 'ac_src', type: 'AC_SUPPLY', label: 'AC Power Supply (12V/50Hz)', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('AC_SUPPLY'), state: { voltageAcRms: 12, frequency: 50 } },
        { id: 'diode_1', type: 'DIODE', label: '1N4007 Diode', x: 220, y: 150, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'res_load', type: 'RESISTOR', label: 'Load Resistor (1kΩ)', x: 360, y: 180, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: { resistance: 1000 } },
        { id: 'cro_hw', type: 'CRO_SCOPE', label: 'CRO Scope (Input vs Rectified)', x: 500, y: 150, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 2, timePerDiv: 5 } },
        { id: 'note_hw', type: 'TEXT_NOTE', label: 'Half-Wave Info', x: 670, y: 140, width: 200, height: 160, inputs: [], outputs: [], state: { text: '🔌 **HALF-WAVE RECTIFIER**\n- Positive half-cycle: Diode forward-biased → Conducts\n- Negative half-cycle: Diode reverse-biased → Blocks\n- Efficiency η = 40.6%' } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'ac_src', fromPortId: 'out_live', toNodeId: 'diode_1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'diode_1', fromPortId: 'out_0', toNodeId: 'res_load', toPortId: 'in_0', signal: 1 },
        { id: 'w_ch1', fromNodeId: 'ac_src', fromPortId: 'out_live', toNodeId: 'cro_hw', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_ch2', fromNodeId: 'diode_1', fromPortId: 'out_0', toNodeId: 'cro_hw', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 3. FULL WAVE CENTER TAPPED RECTIFIER
  {
    id: 'full_wave_rectifier',
    name: '⚡ 3. Full-Wave Center-Tapped Rectifier Circuit',
    description: 'Uses two diodes with center-tapped transformer configuration to rectify both positive and negative AC half-cycles.',
    data: {
      version: 1,
      nodes: [
        { id: 'ac_src', type: 'AC_SUPPLY', label: 'AC Center Tap Supply', x: 60, y: 180, width: 90, height: 80, ...createDefaultPortsForNode('AC_SUPPLY'), state: { voltageAcRms: 12, frequency: 50 } },
        { id: 'd1', type: 'DIODE', label: 'Diode D1', x: 220, y: 120, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'd2', type: 'DIODE', label: 'Diode D2', x: 220, y: 240, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'r_load', type: 'RESISTOR', label: 'Load Resistor', x: 360, y: 180, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'dso_fw', type: 'DSO_SCOPE', label: 'DSO Scope (Full-Wave)', x: 500, y: 160, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 2, timePerDiv: 5 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'ac_src', fromPortId: 'out_live', toNodeId: 'd1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'ac_src', fromPortId: 'out_neutral', toNodeId: 'd2', toPortId: 'in_0', signal: 0 },
        { id: 'w3', fromNodeId: 'd1', fromPortId: 'out_0', toNodeId: 'r_load', toPortId: 'in_0', signal: 1 },
        { id: 'w4', fromNodeId: 'd2', fromPortId: 'out_0', toNodeId: 'r_load', toPortId: 'in_0', signal: 0 },
        { id: 'w_ch1', fromNodeId: 'ac_src', fromPortId: 'out_live', toNodeId: 'dso_fw', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_ch2', fromNodeId: 'd1', fromPortId: 'out_0', toNodeId: 'dso_fw', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 4. FULL WAVE BRIDGE RECTIFIER
  {
    id: 'bridge_rectifier',
    name: '🌁 4. Full-Wave Bridge Rectifier Circuit',
    description: 'Four-diode bridge network providing full-wave rectification without requiring center-tapped transformer.',
    data: {
      version: 1,
      nodes: [
        { id: 'ac_gen', type: 'FUNCTION_GEN', label: 'Function Gen (Sine 50Hz)', x: 60, y: 180, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 50, amplitude: 10 } },
        { id: 'd_b1', type: 'DIODE', label: 'D1', x: 200, y: 120, width: 70, height: 50, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'd_b2', type: 'DIODE', label: 'D2', x: 200, y: 240, width: 70, height: 50, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'r_l', type: 'RESISTOR', label: 'Load (1kΩ)', x: 330, y: 180, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'dso_br', type: 'DSO_SCOPE', label: 'DSO Scope', x: 470, y: 160, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 2, timePerDiv: 5 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'ac_gen', fromPortId: 'out_sig', toNodeId: 'd_b1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'd_b1', fromPortId: 'out_0', toNodeId: 'r_l', toPortId: 'in_0', signal: 1 },
        { id: 'w_ch1', fromNodeId: 'ac_gen', fromPortId: 'out_sig', toNodeId: 'dso_br', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_ch2', fromNodeId: 'r_l', fromPortId: 'out_0', toNodeId: 'dso_br', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 5. BRIDGE RECTIFIER WITH CAPACITOR FILTER
  {
    id: 'bridge_rectifier_cap',
    name: '🔋 5. Bridge Rectifier with Capacitor Smoothing Filter',
    description: 'Adds a parallel reservoir filter capacitor across load resistor to smooth pulsating DC into steady DC output with low ripple voltage.',
    data: {
      version: 1,
      nodes: [
        { id: 'ac_in', type: 'AC_SUPPLY', label: 'AC Supply 12V', x: 60, y: 180, width: 90, height: 80, ...createDefaultPortsForNode('AC_SUPPLY'), state: { voltageAcRms: 12 } },
        { id: 'diode', type: 'DIODE', label: 'Rectifier Diode', x: 200, y: 170, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'cap_filter', type: 'CAPACITOR', label: 'Filter Cap (100µF)', x: 320, y: 170, width: 80, height: 60, ...createDefaultPortsForNode('CAPACITOR'), state: { capacitance: 0.0001 } },
        { id: 'res_load', type: 'RESISTOR', label: 'Load (1kΩ)', x: 440, y: 170, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'cro_cap', type: 'CRO_SCOPE', label: 'CRO Ripple Display', x: 580, y: 150, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1, timePerDiv: 5 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'ac_in', fromPortId: 'out_live', toNodeId: 'diode', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'diode', fromPortId: 'out_0', toNodeId: 'cap_filter', toPortId: 'in_0', signal: 1 },
        { id: 'w3', fromNodeId: 'cap_filter', fromPortId: 'out_0', toNodeId: 'res_load', toPortId: 'in_0', signal: 1 },
        { id: 'w_c1', fromNodeId: 'ac_in', fromPortId: 'out_live', toNodeId: 'cro_cap', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_c2', fromNodeId: 'res_load', fromPortId: 'out_0', toNodeId: 'cro_cap', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 6. POSITIVE CLIPPER
  {
    id: 'positive_clipper',
    name: '✂️ 6. Positive Diode Clipper Circuit',
    description: 'Clips or removes the positive half of input AC waveform above threshold voltage.',
    data: {
      version: 1,
      nodes: [
        { id: 'fg_clip', type: 'FUNCTION_GEN', label: 'Sine Wave Gen', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 50, amplitude: 5 } },
        { id: 'r_s', type: 'RESISTOR', label: 'Series Resistor', x: 200, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'd_clip', type: 'DIODE', label: 'Shunt Diode', x: 320, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'cro_clip', type: 'CRO_SCOPE', label: 'CRO (Clipped Output)', x: 460, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1, timePerDiv: 5 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'fg_clip', fromPortId: 'out_sig', toNodeId: 'r_s', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'r_s', fromPortId: 'out_0', toNodeId: 'd_clip', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'fg_clip', fromPortId: 'out_sig', toNodeId: 'cro_clip', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'd_clip', fromPortId: 'out_0', toNodeId: 'cro_clip', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 7. POSITIVE CLAMPER
  {
    id: 'positive_clamper',
    name: '⬆️ 7. Positive Diode Clamper Circuit',
    description: 'Shifts entire AC signal vertically upward so the negative peak rests at 0V reference.',
    data: {
      version: 1,
      nodes: [
        { id: 'fg_clamp', type: 'FUNCTION_GEN', label: 'AC Input (Sine)', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 50, amplitude: 5 } },
        { id: 'cap_c', type: 'CAPACITOR', label: 'Clamping Cap', x: 200, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('CAPACITOR'), state: {} },
        { id: 'd_clamp', type: 'DIODE', label: 'Clamping Diode', x: 320, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('DIODE'), state: {} },
        { id: 'dso_clamp', type: 'DSO_SCOPE', label: 'DSO Clamper Shift', x: 460, y: 140, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 1, timePerDiv: 5 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'fg_clamp', fromPortId: 'out_sig', toNodeId: 'cap_c', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'cap_c', fromPortId: 'out_0', toNodeId: 'd_clamp', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'fg_clamp', fromPortId: 'out_sig', toNodeId: 'dso_clamp', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'd_clamp', fromPortId: 'out_0', toNodeId: 'dso_clamp', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 8. ZENER VOLTAGE REGULATOR
  {
    id: 'zener_regulator',
    name: '🛡️ 8. Zener Diode Voltage Regulator Circuit',
    description: 'Regulates fluctuating DC input voltage into stable constant output voltage using reverse-breakdown Zener diode.',
    data: {
      version: 1,
      nodes: [
        { id: 'dc_unreg', type: 'DC_SUPPLY', label: 'Unregulated DC Input', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('DC_SUPPLY'), state: { voltageDc: 12 } },
        { id: 'r_limit', type: 'RESISTOR', label: 'Current Limiter R_S', x: 200, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'zener_d', type: 'ZENER_DIODE', label: '5.1V Zener Diode', x: 320, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('ZENER_DIODE'), state: { vZener: 5.1 } },
        { id: 'dso_zener', type: 'DSO_SCOPE', label: 'DSO Regulator Probe', x: 460, y: 140, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'dc_unreg', fromPortId: 'out_pos', toNodeId: 'r_limit', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'r_limit', fromPortId: 'out_0', toNodeId: 'zener_d', toPortId: 'in_0', signal: 1 },
        { id: 'w_ch1', fromNodeId: 'dc_unreg', fromPortId: 'out_pos', toNodeId: 'dso_zener', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_ch2', fromNodeId: 'zener_d', fromPortId: 'out_0', toNodeId: 'dso_zener', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 9. RC LOW PASS FILTER
  {
    id: 'rc_low_pass',
    name: '📉 9. RC Low-Pass Filter Circuit',
    description: 'Passes low frequency signals while attenuating high frequencies above cutoff frequency fc = 1 / (2πRC).',
    data: {
      version: 1,
      nodes: [
        { id: 'gen_ac', type: 'FUNCTION_GEN', label: 'Function Gen (High Freq)', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 5000, amplitude: 5 } },
        { id: 'r_lpf', type: 'RESISTOR', label: 'Resistor R (1kΩ)', x: 200, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: { resistance: 1000 } },
        { id: 'c_lpf', type: 'CAPACITOR', label: 'Capacitor C (0.1µF)', x: 320, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('CAPACITOR'), state: {} },
        { id: 'cro_lpf', type: 'CRO_SCOPE', label: 'CRO Filter Waveform', x: 460, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1, timePerDiv: 0.2 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'gen_ac', fromPortId: 'out_sig', toNodeId: 'r_lpf', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'r_lpf', fromPortId: 'out_0', toNodeId: 'c_lpf', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'gen_ac', fromPortId: 'out_sig', toNodeId: 'cro_lpf', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'c_lpf', fromPortId: 'out_0', toNodeId: 'cro_lpf', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 10. RC HIGH PASS FILTER
  {
    id: 'rc_high_pass',
    name: '📈 10. RC High-Pass Filter Circuit',
    description: 'Blocks DC and low frequencies while passing high frequency AC signals.',
    data: {
      version: 1,
      nodes: [
        { id: 'gen_hp', type: 'FUNCTION_GEN', label: 'Function Gen (AC + DC)', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 1000, amplitude: 5, offsetV: 2 } },
        { id: 'c_hpf', type: 'CAPACITOR', label: 'Blocking Cap C', x: 200, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('CAPACITOR'), state: {} },
        { id: 'r_hpf', type: 'RESISTOR', label: 'Shunt Resistor R', x: 320, y: 160, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'dso_hpf', type: 'DSO_SCOPE', label: 'DSO High Pass Output', x: 460, y: 140, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'gen_hp', fromPortId: 'out_sig', toNodeId: 'c_hpf', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'c_hpf', fromPortId: 'out_0', toNodeId: 'r_hpf', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'gen_hp', fromPortId: 'out_sig', toNodeId: 'dso_hpf', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'r_hpf', fromPortId: 'out_0', toNodeId: 'dso_hpf', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 11. RLC RESONANT CIRCUIT
  {
    id: 'rlc_resonant',
    name: '🌊 11. RLC Resonant Tank Circuit',
    description: 'Series RLC resonant circuit producing peak output amplitude at resonance frequency fr = 1 / (2π√LC).',
    data: {
      version: 1,
      nodes: [
        { id: 'gen_rlc', type: 'FUNCTION_GEN', label: 'Resonant Sweep Gen', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 1000 } },
        { id: 'r_1', type: 'RESISTOR', label: 'Resistor R', x: 190, y: 160, width: 70, height: 50, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'l_1', type: 'INDUCTOR', label: 'Inductor L', x: 280, y: 160, width: 70, height: 50, ...createDefaultPortsForNode('INDUCTOR'), state: {} },
        { id: 'c_1', type: 'CAPACITOR', label: 'Capacitor C', x: 370, y: 160, width: 70, height: 50, ...createDefaultPortsForNode('CAPACITOR'), state: {} },
        { id: 'cro_rlc', type: 'CRO_SCOPE', label: 'CRO Resonance Probe', x: 480, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'gen_rlc', fromPortId: 'out_sig', toNodeId: 'r_1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'r_1', fromPortId: 'out_0', toNodeId: 'l_1', toPortId: 'in_0', signal: 1 },
        { id: 'w3', fromNodeId: 'l_1', fromPortId: 'out_0', toNodeId: 'c_1', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'gen_rlc', fromPortId: 'out_sig', toNodeId: 'cro_rlc', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'c_1', fromPortId: 'out_0', toNodeId: 'cro_rlc', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 12. BJT COMMON EMITTER AMPLIFIER
  {
    id: 'bjt_ce_amplifier',
    name: '🎤 12. BJT Common Emitter Amplifier Circuit',
    description: 'Small-signal AC voltage amplifier using NPN BJT with 180° output phase inversion.',
    data: {
      version: 1,
      nodes: [
        { id: 'fg_bjt', type: 'FUNCTION_GEN', label: 'Mic Input AC', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 1000, amplitude: 1 } },
        { id: 'bjt_1', type: 'NPN_BJT', label: 'NPN BJT (BC547)', x: 220, y: 150, width: 90, height: 80, ...createDefaultPortsForNode('NPN_BJT'), state: {} },
        { id: 'r_c', type: 'RESISTOR', label: 'Collector Resistor R_C', x: 350, y: 150, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'cro_ce', type: 'CRO_SCOPE', label: 'CRO Amp Waveform', x: 470, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'fg_bjt', fromPortId: 'out_sig', toNodeId: 'bjt_1', toPortId: 'in_b', signal: 1 },
        { id: 'w2', fromNodeId: 'bjt_1', fromPortId: 'out_e', toNodeId: 'r_c', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'fg_bjt', fromPortId: 'out_sig', toNodeId: 'cro_ce', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'r_c', fromPortId: 'out_0', toNodeId: 'cro_ce', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 13. OPAMP INVERTING AMPLIFIER
  {
    id: 'opamp_inverting',
    name: '➕ 13. Op-Amp Inverting Amplifier Circuit',
    description: 'Operational amplifier with negative feedback producing inverted gain Av = -R2/R1.',
    data: {
      version: 1,
      nodes: [
        { id: 'fg_op', type: 'FUNCTION_GEN', label: 'Input Signal Vin', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 1000, amplitude: 2 } },
        { id: 'op_1', type: 'OP_AMP', label: 'LM741 Op-Amp', x: 220, y: 140, width: 100, height: 90, ...createDefaultPortsForNode('OP_AMP'), state: {} },
        { id: 'r_fb', type: 'RESISTOR', label: 'Feedback R_F (10kΩ)', x: 360, y: 140, width: 80, height: 60, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'dso_op', type: 'DSO_SCOPE', label: 'DSO Gain Display', x: 480, y: 140, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'fg_op', fromPortId: 'out_sig', toNodeId: 'op_1', toPortId: 'in_neg', signal: 1 },
        { id: 'w2', fromNodeId: 'op_1', fromPortId: 'out_0', toNodeId: 'r_fb', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'fg_op', fromPortId: 'out_sig', toNodeId: 'dso_op', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'op_1', fromPortId: 'out_0', toNodeId: 'dso_op', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 14. OPAMP NON INVERTING AMPLIFIER
  {
    id: 'opamp_non_inverting',
    name: '✖️ 14. Op-Amp Non-Inverting Amplifier Circuit',
    description: 'Non-inverting amplifier with gain Av = 1 + (R2/R1), maintaining input phase alignment.',
    data: {
      version: 1,
      nodes: [
        { id: 'fg_non', type: 'FUNCTION_GEN', label: 'Input Signal Vin', x: 60, y: 160, width: 90, height: 80, ...createDefaultPortsForNode('FUNCTION_GEN'), state: { waveType: 'sine', frequency: 1000, amplitude: 2 } },
        { id: 'op_non', type: 'OP_AMP', label: 'LM741 Non-Inverting', x: 220, y: 140, width: 100, height: 90, ...createDefaultPortsForNode('OP_AMP'), state: {} },
        { id: 'cro_non', type: 'CRO_SCOPE', label: 'CRO Scope', x: 380, y: 140, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'fg_non', fromPortId: 'out_sig', toNodeId: 'op_non', toPortId: 'in_pos', signal: 1 },
        { id: 'wc1', fromNodeId: 'fg_non', fromPortId: 'out_sig', toNodeId: 'cro_non', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'op_non', fromPortId: 'out_0', toNodeId: 'cro_non', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 15. 555 TIMER ASTABLE MULTIVIBRATOR
  {
    id: 'timer_555_astable',
    name: '⏱️ 15. 555 Timer Astable Multivibrator',
    description: 'Generates continuous square wave oscillations with RC charging ramp waveform.',
    data: {
      version: 1,
      nodes: [
        { id: 'timer_1', type: 'TIMER_555', label: '555 Timer IC', x: 200, y: 140, width: 110, height: 100, ...createDefaultPortsForNode('TIMER_555'), state: {} },
        { id: 'r_a', type: 'RESISTOR', label: 'Resistor R_A', x: 60, y: 120, width: 70, height: 50, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'r_b', type: 'RESISTOR', label: 'Resistor R_B', x: 60, y: 200, width: 70, height: 50, ...createDefaultPortsForNode('RESISTOR'), state: {} },
        { id: 'dso_555', type: 'DSO_SCOPE', label: 'DSO Output Waveform', x: 360, y: 140, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: { voltsPerDiv: 1 } },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'r_a', fromPortId: 'out_0', toNodeId: 'timer_1', toPortId: 'in_trig', signal: 1 },
        { id: 'w2', fromNodeId: 'r_b', fromPortId: 'out_0', toNodeId: 'timer_1', toPortId: 'in_thresh', signal: 1 },
        { id: 'wc1', fromNodeId: 'timer_1', fromPortId: 'out_0', toNodeId: 'dso_555', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'timer_1', fromPortId: 'out_dis', toNodeId: 'dso_555', toPortId: 'in_ch2', signal: 0 },
      ],
    },
  },

  // 16. POWER AMPLIFIERS STUDIO
  {
    id: 'power_amplifiers',
    name: '📻 16. Power Amplifiers Studio (Class A, B, AB, C, D)',
    description: 'Compare input sine wave vs output wave for Class A, B, AB, C, and D power amplifiers.',
    data: {
      version: 1,
      nodes: [
        { id: 'sine_gen_1', type: 'SINE_GEN', label: 'AC Sine Generator', x: 80, y: 250, width: 80, height: 70, ...createDefaultPortsForNode('SINE_GEN'), state: { frequency: 2 } },
        { id: 'amp_a', type: 'AMP_CLASS_A', label: 'Class A Amp (360°)', x: 260, y: 100, width: 120, height: 90, ...createDefaultPortsForNode('AMP_CLASS_A'), state: { gain: 1.8 } },
        { id: 'amp_b', type: 'AMP_CLASS_B', label: 'Class B Amp (180°)', x: 260, y: 220, width: 120, height: 90, ...createDefaultPortsForNode('AMP_CLASS_B'), state: { gain: 1.8 } },
        { id: 'amp_ab', type: 'AMP_CLASS_AB', label: 'Class AB Amp (220°)', x: 260, y: 340, width: 120, height: 90, ...createDefaultPortsForNode('AMP_CLASS_AB'), state: { gain: 1.8 } },
        { id: 'amp_c', type: 'AMP_CLASS_C', label: 'Class C Amp (<120°)', x: 440, y: 160, width: 120, height: 90, ...createDefaultPortsForNode('AMP_CLASS_C'), state: { gain: 1.8 } },
        { id: 'amp_d', type: 'AMP_CLASS_D', label: 'Class D Amp (PWM)', x: 440, y: 300, width: 130, height: 90, ...createDefaultPortsForNode('AMP_CLASS_D'), state: { gain: 1.8 } },
        { id: 'cro_amp', type: 'CRO_SCOPE', label: 'CRO Scope', x: 610, y: 200, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w_a', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_a', toPortId: 'in_sig', signal: 1 },
        { id: 'w_b', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_b', toPortId: 'in_sig', signal: 1 },
        { id: 'w_ab', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_ab', toPortId: 'in_sig', signal: 1 },
        { id: 'w_c', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_c', toPortId: 'in_sig', signal: 1 },
        { id: 'w_d', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_d', toPortId: 'in_sig', signal: 1 },
        { id: 'w_cro1', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'cro_amp', toPortId: 'in_ch1', signal: 1 },
        { id: 'w_cro2', fromNodeId: 'amp_a', fromPortId: 'out_sig', toNodeId: 'cro_amp', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 17. 1-BIT FULL ADDER
  {
    id: 'full_adder',
    name: '🔢 17. 1-Bit Full Adder Circuit',
    description: 'Full adder constructed using XOR, AND, and OR gates to sum A, B, and Carry In.',
    data: {
      version: 1,
      nodes: [
        { id: 'sw_a', type: 'SWITCH', label: 'Input A', x: 80, y: 120, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'sw_b', type: 'SWITCH', label: 'Input B', x: 80, y: 220, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'sw_cin', type: 'SWITCH', label: 'Carry In', x: 80, y: 340, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 0 } },
        { id: 'xor_1', type: 'XOR', label: 'XOR 1', x: 260, y: 150, width: 90, height: 70, ...createDefaultPortsForNode('XOR'), state: {} },
        { id: 'xor_2', type: 'XOR', label: 'XOR 2 (Sum)', x: 440, y: 180, width: 90, height: 70, ...createDefaultPortsForNode('XOR'), state: {} },
        { id: 'and_1', type: 'AND', label: 'AND 1', x: 260, y: 280, width: 90, height: 70, ...createDefaultPortsForNode('AND'), state: {} },
        { id: 'and_2', type: 'AND', label: 'AND 2', x: 440, y: 320, width: 90, height: 70, ...createDefaultPortsForNode('AND'), state: {} },
        { id: 'or_1', type: 'OR', label: 'OR (Carry Out)', x: 580, y: 300, width: 90, height: 70, ...createDefaultPortsForNode('OR'), state: {} },
        { id: 'cro_adder', type: 'CRO_SCOPE', label: 'CRO Probe', x: 700, y: 200, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'sw_a', fromPortId: 'out_0', toNodeId: 'xor_1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'sw_b', fromPortId: 'out_0', toNodeId: 'xor_1', toPortId: 'in_1', signal: 1 },
        { id: 'w3', fromNodeId: 'sw_a', fromPortId: 'out_0', toNodeId: 'and_1', toPortId: 'in_0', signal: 1 },
        { id: 'w4', fromNodeId: 'sw_b', fromPortId: 'out_0', toNodeId: 'and_1', toPortId: 'in_1', signal: 1 },
        { id: 'w5', fromNodeId: 'xor_1', fromPortId: 'out_0', toNodeId: 'xor_2', toPortId: 'in_0', signal: 0 },
        { id: 'w6', fromNodeId: 'sw_cin', fromPortId: 'out_0', toNodeId: 'xor_2', toPortId: 'in_1', signal: 0 },
        { id: 'w7', fromNodeId: 'xor_1', fromPortId: 'out_0', toNodeId: 'and_2', toPortId: 'in_0', signal: 0 },
        { id: 'w8', fromNodeId: 'sw_cin', fromPortId: 'out_0', toNodeId: 'and_2', toPortId: 'in_1', signal: 0 },
        { id: 'w9', fromNodeId: 'and_1', fromPortId: 'out_0', toNodeId: 'or_1', toPortId: 'in_0', signal: 1 },
        { id: 'w10', fromNodeId: 'and_2', fromPortId: 'out_0', toNodeId: 'or_1', toPortId: 'in_1', signal: 0 },
        { id: 'wc1', fromNodeId: 'xor_2', fromPortId: 'out_0', toNodeId: 'cro_adder', toPortId: 'in_ch1', signal: 0 },
        { id: 'wc2', fromNodeId: 'or_1', fromPortId: 'out_0', toNodeId: 'cro_adder', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 18. 1-BIT HALF ADDER
  {
    id: 'half_adder',
    name: '🔢 18. 1-Bit Half Adder Circuit',
    description: 'Computes sum (XOR) and carry out (AND) for two binary inputs A and B.',
    data: {
      version: 1,
      nodes: [
        { id: 'sw_a', type: 'SWITCH', label: 'Input A', x: 80, y: 120, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'sw_b', type: 'SWITCH', label: 'Input B', x: 80, y: 240, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'xor_ha', type: 'XOR', label: 'XOR (SUM)', x: 240, y: 120, width: 90, height: 70, ...createDefaultPortsForNode('XOR'), state: {} },
        { id: 'and_ha', type: 'AND', label: 'AND (CARRY)', x: 240, y: 240, width: 90, height: 70, ...createDefaultPortsForNode('AND'), state: {} },
        { id: 'cro_ha', type: 'CRO_SCOPE', label: 'CRO Scope', x: 400, y: 180, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'sw_a', fromPortId: 'out_0', toNodeId: 'xor_ha', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'sw_b', fromPortId: 'out_0', toNodeId: 'xor_ha', toPortId: 'in_1', signal: 1 },
        { id: 'w3', fromNodeId: 'sw_a', fromPortId: 'out_0', toNodeId: 'and_ha', toPortId: 'in_0', signal: 1 },
        { id: 'w4', fromNodeId: 'sw_b', fromPortId: 'out_0', toNodeId: 'and_ha', toPortId: 'in_1', signal: 1 },
        { id: 'wc1', fromNodeId: 'xor_ha', fromPortId: 'out_0', toNodeId: 'cro_ha', toPortId: 'in_ch1', signal: 0 },
        { id: 'wc2', fromNodeId: 'and_ha', fromPortId: 'out_0', toNodeId: 'cro_ha', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 19. 4:1 MULTIPLEXER
  {
    id: 'mux_41',
    name: '🔀 19. 4:1 Multiplexer (MUX) Circuit',
    description: 'Routes one of four data inputs (I0-I3) to single output Y based on select lines S0 and S1.',
    data: {
      version: 1,
      nodes: [
        { id: 'clk_data', type: 'CLOCK', label: 'Data Pulse (1Hz)', x: 60, y: 180, width: 70, height: 70, ...createDefaultPortsForNode('CLOCK'), state: { value: 1 } },
        { id: 'mux_ic', type: 'MUX_21', label: '2:1 MUX Block', x: 220, y: 160, width: 110, height: 90, ...createDefaultPortsForNode('MUX_21'), state: {} },
        { id: 'dso_mux', type: 'DSO_SCOPE', label: 'DSO Scope', x: 380, y: 150, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'clk_data', fromPortId: 'out_0', toNodeId: 'mux_ic', toPortId: 'in_0', signal: 1 },
        { id: 'wc1', fromNodeId: 'clk_data', fromPortId: 'out_0', toNodeId: 'dso_mux', toPortId: 'in_ch1', signal: 1 },
        { id: 'wc2', fromNodeId: 'mux_ic', fromPortId: 'out_0', toNodeId: 'dso_mux', toPortId: 'in_ch2', signal: 1 },
      ],
    },
  },

  // 20. 4-BIT BINARY COUNTER & 7-SEGMENT DISPLAY
  {
    id: 'counter_7seg',
    name: '🔢 20. 4-Bit Binary Counter & 7-Segment Display',
    description: 'Oscillating clock driving 4 T-Flip-Flops to count from 0 to 15 (0-F) on a 7-segment hex display.',
    data: {
      version: 1,
      nodes: [
        { id: 'clk_1', type: 'CLOCK', label: 'Clock (1Hz)', x: 80, y: 200, width: 70, height: 70, ...createDefaultPortsForNode('CLOCK'), state: { value: 0 } },
        { id: 'high_const', type: 'CONST_HIGH', label: 'VCC (1)', x: 80, y: 100, width: 60, height: 60, ...createDefaultPortsForNode('CONST_HIGH'), state: { value: 1 } },
        { id: 't_0', type: 'T_FLIPFLOP', label: 'Bit 0 (1)', x: 220, y: 150, width: 110, height: 90, ...createDefaultPortsForNode('T_FLIPFLOP'), state: {} },
        { id: 't_1', type: 'T_FLIPFLOP', label: 'Bit 1 (2)', x: 380, y: 150, width: 110, height: 90, ...createDefaultPortsForNode('T_FLIPFLOP'), state: {} },
        { id: 't_2', type: 'T_FLIPFLOP', label: 'Bit 2 (4)', x: 540, y: 150, width: 110, height: 90, ...createDefaultPortsForNode('T_FLIPFLOP'), state: {} },
        { id: 't_3', type: 'T_FLIPFLOP', label: 'Bit 3 (8)', x: 700, y: 150, width: 110, height: 90, ...createDefaultPortsForNode('T_FLIPFLOP'), state: {} },
        { id: 'hex_display', type: 'HEX_DISPLAY', label: 'Hex Counter', x: 880, y: 130, width: 110, height: 130, ...createDefaultPortsForNode('HEX_DISPLAY'), state: {} },
        { id: 'dso_cnt', type: 'DSO_SCOPE', label: 'DSO Scope', x: 880, y: 290, width: 160, height: 120, ...createDefaultPortsForNode('DSO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w_h0', fromNodeId: 'high_const', fromPortId: 'out_0', toNodeId: 't_0', toPortId: 'in_t', signal: 1 },
        { id: 'w_h1', fromNodeId: 'high_const', fromPortId: 'out_0', toNodeId: 't_1', toPortId: 'in_t', signal: 1 },
        { id: 'w_h2', fromNodeId: 'high_const', fromPortId: 'out_0', toNodeId: 't_2', toPortId: 'in_t', signal: 1 },
        { id: 'w_h3', fromNodeId: 'high_const', fromPortId: 'out_0', toNodeId: 't_3', toPortId: 'in_t', signal: 1 },
        { id: 'w_c0', fromNodeId: 'clk_1', fromPortId: 'out_0', toNodeId: 't_0', toPortId: 'in_clk', signal: 0 },
        { id: 'w_c1', fromNodeId: 't_0', fromPortId: 'out_qbar', toNodeId: 't_1', toPortId: 'in_clk', signal: 1 },
        { id: 'w_c2', fromNodeId: 't_1', fromPortId: 'out_qbar', toNodeId: 't_2', toPortId: 'in_clk', signal: 1 },
        { id: 'w_c3', fromNodeId: 't_2', fromPortId: 'out_qbar', toNodeId: 't_3', toPortId: 'in_clk', signal: 1 },
        { id: 'w_d0', fromNodeId: 't_0', fromPortId: 'out_q', toNodeId: 'hex_display', toPortId: 'in_0', signal: 0 },
        { id: 'w_d1', fromNodeId: 't_1', fromPortId: 'out_q', toNodeId: 'hex_display', toPortId: 'in_1', signal: 0 },
        { id: 'w_d2', fromNodeId: 't_2', fromPortId: 'out_q', toNodeId: 'hex_display', toPortId: 'in_2', signal: 0 },
        { id: 'w_d3', fromNodeId: 't_3', fromPortId: 'out_q', toNodeId: 'hex_display', toPortId: 'in_3', signal: 0 },
        { id: 'wc1', fromNodeId: 'clk_1', fromPortId: 'out_0', toNodeId: 'dso_cnt', toPortId: 'in_ch1', signal: 0 },
        { id: 'wc2', fromNodeId: 't_0', fromPortId: 'out_q', toNodeId: 'dso_cnt', toPortId: 'in_ch2', signal: 0 },
      ],
    },
  },

  // 21. MASTER SLAVE JK FLIP FLOP
  {
    id: 'master_slave_jk',
    name: '🛡️ 21. Master-Slave JK Flip-Flop (Race-Free Operation)',
    description: 'Uses two cascaded flip-flops to isolate input toggling during clock pulse, preventing race-around condition.',
    data: {
      version: 1,
      nodes: [
        { id: 'vcc_1', type: 'CONST_HIGH', label: 'J=1, K=1', x: 60, y: 160, width: 60, height: 60, ...createDefaultPortsForNode('CONST_HIGH'), state: { value: 1 } },
        { id: 'clk_ms', type: 'CLOCK', label: 'Clock (2Hz)', x: 60, y: 260, width: 70, height: 70, ...createDefaultPortsForNode('CLOCK'), state: { value: 0 } },
        { id: 'jk_ms', type: 'JK_FLIPFLOP', label: 'Master-Slave JK', x: 220, y: 160, width: 120, height: 100, ...createDefaultPortsForNode('JK_FLIPFLOP'), state: { triggerMode: 'master_slave' } },
        { id: 'cro_ms', type: 'CRO_SCOPE', label: 'CRO Scope (Clean Square)', x: 420, y: 150, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'vcc_1', fromPortId: 'out_0', toNodeId: 'jk_ms', toPortId: 'in_j', signal: 1 },
        { id: 'w2', fromNodeId: 'vcc_1', fromPortId: 'out_0', toNodeId: 'jk_ms', toPortId: 'in_k', signal: 1 },
        { id: 'w3', fromNodeId: 'clk_ms', fromPortId: 'out_0', toNodeId: 'jk_ms', toPortId: 'in_clk', signal: 0 },
        { id: 'wc1', fromNodeId: 'clk_ms', fromPortId: 'out_0', toNodeId: 'cro_ms', toPortId: 'in_ch1', signal: 0 },
        { id: 'wc2', fromNodeId: 'jk_ms', fromPortId: 'out_q', toNodeId: 'cro_ms', toPortId: 'in_ch2', signal: 0 },
      ],
    },
  },

  // 22. 2-BIT BINARY COMPARATOR
  {
    id: 'comparator_2bit',
    name: '⚖️ 22. 2-Bit Binary Magnitude Comparator',
    description: 'Compares two 2-bit numbers A and B to output A > B, A = B, or A < B signals.',
    data: {
      version: 1,
      nodes: [
        { id: 'sw_a1', type: 'SWITCH', label: 'A1', x: 60, y: 100, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'sw_a0', type: 'SWITCH', label: 'A0', x: 60, y: 180, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 0 } },
        { id: 'sw_b1', type: 'SWITCH', label: 'B1', x: 60, y: 280, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 0 } },
        { id: 'sw_b0', type: 'SWITCH', label: 'B0', x: 60, y: 360, width: 70, height: 70, ...createDefaultPortsForNode('SWITCH'), state: { value: 1 } },
        { id: 'gate_xor1', type: 'XNOR', label: 'A1 XNOR B1', x: 220, y: 140, width: 90, height: 70, ...createDefaultPortsForNode('XNOR'), state: {} },
        { id: 'gate_xor0', type: 'XNOR', label: 'A0 XNOR B0', x: 220, y: 300, width: 90, height: 70, ...createDefaultPortsForNode('XNOR'), state: {} },
        { id: 'gate_and_eq', type: 'AND', label: 'A == B', x: 380, y: 220, width: 90, height: 70, ...createDefaultPortsForNode('AND'), state: {} },
        { id: 'cro_comp', type: 'CRO_SCOPE', label: 'CRO Scope', x: 530, y: 200, width: 140, height: 110, ...createDefaultPortsForNode('CRO_SCOPE'), state: {} },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'sw_a1', fromPortId: 'out_0', toNodeId: 'gate_xor1', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'sw_b1', fromPortId: 'out_0', toNodeId: 'gate_xor1', toPortId: 'in_1', signal: 0 },
        { id: 'w3', fromNodeId: 'sw_a0', fromPortId: 'out_0', toNodeId: 'gate_xor0', toPortId: 'in_0', signal: 0 },
        { id: 'w4', fromNodeId: 'sw_b0', fromPortId: 'out_0', toNodeId: 'gate_xor0', toPortId: 'in_1', signal: 1 },
        { id: 'w5', fromNodeId: 'gate_xor1', fromPortId: 'out_0', toNodeId: 'gate_and_eq', toPortId: 'in_0', signal: 0 },
        { id: 'w6', fromNodeId: 'gate_xor0', fromPortId: 'out_0', toNodeId: 'gate_and_eq', toPortId: 'in_1', signal: 0 },
        { id: 'wc1', fromNodeId: 'gate_and_eq', fromPortId: 'out_0', toNodeId: 'cro_comp', toPortId: 'in_ch1', signal: 0 },
      ],
    },
  },
];
