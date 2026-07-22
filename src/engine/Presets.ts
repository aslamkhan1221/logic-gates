import type { CircuitData } from '../types/logic';
import { createDefaultPortsForNode } from './GateLogic';

export interface PresetCircuit {
  id: string;
  name: string;
  description: string;
  data: CircuitData;
}

export const PRESET_CIRCUITS: PresetCircuit[] = [
  {
    id: 'basic_gates',
    name: 'Basic Logic Gates Overview',
    description: 'Explore AND, OR, XOR, and NOT logic gates connected to interactive switches and light bulbs.',
    data: {
      version: 1,
      nodes: [
        // Switches
        {
          id: 'sw_1',
          type: 'SWITCH',
          label: 'Input A',
          x: 100,
          y: 120,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('SWITCH'),
          state: { value: 1 },
        },
        {
          id: 'sw_2',
          type: 'SWITCH',
          label: 'Input B',
          x: 100,
          y: 220,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('SWITCH'),
          state: { value: 0 },
        },

        // Gates
        {
          id: 'gate_and',
          type: 'AND',
          label: 'AND Gate',
          x: 300,
          y: 100,
          width: 90,
          height: 70,
          ...createDefaultPortsForNode('AND'),
          state: {},
        },
        {
          id: 'gate_or',
          type: 'OR',
          label: 'OR Gate',
          x: 300,
          y: 220,
          width: 90,
          height: 70,
          ...createDefaultPortsForNode('OR'),
          state: {},
        },
        {
          id: 'gate_xor',
          type: 'XOR',
          label: 'XOR Gate',
          x: 300,
          y: 340,
          width: 90,
          height: 70,
          ...createDefaultPortsForNode('XOR'),
          state: {},
        },
        {
          id: 'gate_not',
          type: 'NOT',
          label: 'NOT Gate',
          x: 300,
          y: 460,
          width: 80,
          height: 60,
          ...createDefaultPortsForNode('NOT'),
          state: {},
        },

        // Bulbs
        {
          id: 'bulb_and',
          type: 'LIGHT_BULB',
          label: 'A AND B',
          x: 520,
          y: 100,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('LIGHT_BULB'),
          state: { value: 0 },
        },
        {
          id: 'bulb_or',
          type: 'LIGHT_BULB',
          label: 'A OR B',
          x: 520,
          y: 220,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('LIGHT_BULB'),
          state: { value: 0 },
        },
        {
          id: 'bulb_xor',
          type: 'LIGHT_BULB',
          label: 'A XOR B',
          x: 520,
          y: 340,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('LIGHT_BULB'),
          state: { value: 0 },
        },
        {
          id: 'bulb_not',
          type: 'LIGHT_BULB',
          label: 'NOT A',
          x: 520,
          y: 455,
          width: 70,
          height: 70,
          ...createDefaultPortsForNode('LIGHT_BULB'),
          state: { value: 0 },
        },

        // Note
        {
          id: 'note_1',
          type: 'TEXT_NOTE',
          label: 'Instructions',
          x: 100,
          y: 340,
          width: 170,
          height: 180,
          inputs: [],
          outputs: [],
          state: { text: '💡 **Try It!**\nClick the toggle switches on the left to change inputs A and B and watch signals flow live.' },
        },
      ],
      wires: [
        { id: 'w1', fromNodeId: 'sw_1', fromPortId: 'out_0', toNodeId: 'gate_and', toPortId: 'in_0', signal: 1 },
        { id: 'w2', fromNodeId: 'sw_2', fromPortId: 'out_0', toNodeId: 'gate_and', toPortId: 'in_1', signal: 0 },

        { id: 'w3', fromNodeId: 'sw_1', fromPortId: 'out_0', toNodeId: 'gate_or', toPortId: 'in_0', signal: 1 },
        { id: 'w4', fromNodeId: 'sw_2', fromPortId: 'out_0', toNodeId: 'gate_or', toPortId: 'in_1', signal: 0 },

        { id: 'w5', fromNodeId: 'sw_1', fromPortId: 'out_0', toNodeId: 'gate_xor', toPortId: 'in_0', signal: 1 },
        { id: 'w6', fromNodeId: 'sw_2', fromPortId: 'out_0', toNodeId: 'gate_xor', toPortId: 'in_1', signal: 0 },

        { id: 'w7', fromNodeId: 'sw_1', fromPortId: 'out_0', toNodeId: 'gate_not', toPortId: 'in_0', signal: 1 },

        { id: 'w8', fromNodeId: 'gate_and', fromPortId: 'out_0', toNodeId: 'bulb_and', toPortId: 'in_0', signal: 0 },
        { id: 'w9', fromNodeId: 'gate_or', fromPortId: 'out_0', toNodeId: 'bulb_or', toPortId: 'in_0', signal: 1 },
        { id: 'w10', fromNodeId: 'gate_xor', fromPortId: 'out_0', toNodeId: 'bulb_xor', toPortId: 'in_0', signal: 1 },
        { id: 'w11', fromNodeId: 'gate_not', fromPortId: 'out_0', toNodeId: 'bulb_not', toPortId: 'in_0', signal: 0 },
      ],
    },
  },
  {
    id: 'power_amplifiers',
    name: 'Power Amplifiers Studio (Class A, B, AB, C, D)',
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

        {
          id: 'note_amp',
          type: 'TEXT_NOTE',
          label: 'Amplifier Info',
          x: 80,
          y: 100,
          width: 150,
          height: 120,
          inputs: [],
          outputs: [],
          state: { text: '📻 **Power Amplifiers**\nSelect any amplifier block to view its real-time Input vs Output sine wave comparison or click **Waveforms**!' },
        },
      ],
      wires: [
        { id: 'w_a', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_a', toPortId: 'in_sig', signal: 1 },
        { id: 'w_b', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_b', toPortId: 'in_sig', signal: 1 },
        { id: 'w_ab', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_ab', toPortId: 'in_sig', signal: 1 },
        { id: 'w_c', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_c', toPortId: 'in_sig', signal: 1 },
        { id: 'w_d', fromNodeId: 'sine_gen_1', fromPortId: 'out_0', toNodeId: 'amp_d', toPortId: 'in_sig', signal: 1 },
      ],
    },
  },
  {
    id: 'full_adder',
    name: '1-Bit Full Adder Circuit',
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

        { id: 'bulb_sum', type: 'LIGHT_BULB', label: 'SUM Output', x: 620, y: 180, width: 70, height: 70, ...createDefaultPortsForNode('LIGHT_BULB'), state: { value: 0 } },
        { id: 'bulb_cout', type: 'LIGHT_BULB', label: 'CARRY Output', x: 740, y: 300, width: 70, height: 70, ...createDefaultPortsForNode('LIGHT_BULB'), state: { value: 0 } },
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

        { id: 'w11', fromNodeId: 'xor_2', fromPortId: 'out_0', toNodeId: 'bulb_sum', toPortId: 'in_0', signal: 0 },
        { id: 'w12', fromNodeId: 'or_1', fromPortId: 'out_0', toNodeId: 'bulb_cout', toPortId: 'in_0', signal: 1 },
      ],
    },
  },
  {
    id: 'counter_7seg',
    name: '4-Bit Binary Counter & 7-Segment Display',
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

        { id: 'led_0', type: 'LED_PROBE', label: '2⁰', x: 250, y: 280, width: 60, height: 60, ...createDefaultPortsForNode('LED_PROBE'), state: { value: 0 } },
        { id: 'led_1', type: 'LED_PROBE', label: '2¹', x: 410, y: 280, width: 60, height: 60, ...createDefaultPortsForNode('LED_PROBE'), state: { value: 0 } },
        { id: 'led_2', type: 'LED_PROBE', label: '2²', x: 570, y: 280, width: 60, height: 60, ...createDefaultPortsForNode('LED_PROBE'), state: { value: 0 } },
        { id: 'led_3', type: 'LED_PROBE', label: '2³', x: 730, y: 280, width: 60, height: 60, ...createDefaultPortsForNode('LED_PROBE'), state: { value: 0 } },
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

        { id: 'w_l0', fromNodeId: 't_0', fromPortId: 'out_q', toNodeId: 'led_0', toPortId: 'in_0', signal: 0 },
        { id: 'w_l1', fromNodeId: 't_1', fromPortId: 'out_q', toNodeId: 'led_1', toPortId: 'in_0', signal: 0 },
        { id: 'w_l2', fromNodeId: 't_2', fromPortId: 'out_q', toNodeId: 'led_2', toPortId: 'in_0', signal: 0 },
        { id: 'w_l3', fromNodeId: 't_3', fromPortId: 'out_q', toNodeId: 'led_3', toPortId: 'in_0', signal: 0 },
      ],
    },
  },
];
