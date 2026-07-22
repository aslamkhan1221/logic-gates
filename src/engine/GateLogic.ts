import type { CircuitNode, NodeType, Port, ComponentMeta, SignalState } from '../types/logic';

export const COMPONENT_METADATA: ComponentMeta[] = [
  // Inputs
  {
    type: 'SWITCH',
    label: 'Toggle Switch',
    category: 'inputs',
    description: 'Interactive switch to toggle signal HIGH (1) or LOW (0).',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultInputs: 0,
    iconName: 'ToggleRight',
  },
  {
    type: 'BUTTON',
    label: 'Push Button',
    category: 'inputs',
    description: 'Momentary button (HIGH while pressed, LOW when released).',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultInputs: 0,
    iconName: 'CircleDot',
  },
  {
    type: 'CONST_HIGH',
    label: 'Constant High (1)',
    category: 'inputs',
    description: 'Always outputs HIGH (1) signal.',
    defaultWidth: 60,
    defaultHeight: 60,
    defaultInputs: 0,
    iconName: 'ArrowUpCircle',
  },
  {
    type: 'CONST_LOW',
    label: 'Constant Low (0)',
    category: 'inputs',
    description: 'Always outputs LOW (0) signal.',
    defaultWidth: 60,
    defaultHeight: 60,
    defaultInputs: 0,
    iconName: 'ArrowDownCircle',
  },
  {
    type: 'CLOCK',
    label: 'Clock Generator',
    category: 'inputs',
    description: 'Oscillates square wave signal automatically at configurable frequency.',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultInputs: 0,
    iconName: 'Activity',
  },
  {
    type: 'SINE_GEN',
    label: 'AC Sine Wave Generator',
    category: 'inputs',
    description: 'Generates analog sine wave signal for amplifier testing.',
    defaultWidth: 80,
    defaultHeight: 70,
    defaultInputs: 0,
    iconName: 'Activity',
  },

  // Power Amplifiers
  {
    type: 'AMP_CLASS_A',
    label: 'Class A Amplifier',
    category: 'amplifiers',
    description: 'Conduction Angle: 360°. Full continuous 360° sine wave amplification with zero crossover distortion.',
    defaultWidth: 120,
    defaultHeight: 90,
    defaultInputs: 1,
    iconName: 'Radio',
  },
  {
    type: 'AMP_CLASS_B',
    label: 'Class B Amplifier',
    category: 'amplifiers',
    description: 'Conduction Angle: 180°. Push-pull pair amplifying half cycles (180°) with crossover distortion near 0V.',
    defaultWidth: 120,
    defaultHeight: 90,
    defaultInputs: 1,
    iconName: 'Radio',
  },
  {
    type: 'AMP_CLASS_AB',
    label: 'Class AB Amplifier',
    category: 'amplifiers',
    description: 'Conduction Angle: 200°-220°. Biased push-pull pair providing high efficiency without crossover distortion.',
    defaultWidth: 120,
    defaultHeight: 90,
    defaultInputs: 1,
    iconName: 'Radio',
  },
  {
    type: 'AMP_CLASS_C',
    label: 'Class C Amplifier',
    category: 'amplifiers',
    description: 'Conduction Angle: < 120°. Short conduction pulses for RF power applications with tuned LC tank filter.',
    defaultWidth: 120,
    defaultHeight: 90,
    defaultInputs: 1,
    iconName: 'Radio',
  },
  {
    type: 'AMP_CLASS_D',
    label: 'Class D Switching Amp',
    category: 'amplifiers',
    description: 'Conduction Angle: 360° PWM. Ultra-high efficiency switching amplifier using Pulse Width Modulation.',
    defaultWidth: 130,
    defaultHeight: 90,
    defaultInputs: 1,
    iconName: 'Radio',
  },

  // Gates
  {
    type: 'BUFFER',
    label: 'Buffer Gate',
    category: 'gates',
    description: 'Passes input signal through unchanged.',
    defaultWidth: 80,
    defaultHeight: 60,
    defaultInputs: 1,
    iconName: 'FastForward',
  },
  {
    type: 'NOT',
    label: 'NOT Gate (Inverter)',
    category: 'gates',
    description: 'Inverts signal: HIGH becomes LOW, LOW becomes HIGH.',
    defaultWidth: 80,
    defaultHeight: 60,
    defaultInputs: 1,
    iconName: 'RotateCcw',
  },
  {
    type: 'AND',
    label: 'AND Gate',
    category: 'gates',
    description: 'Outputs HIGH if ALL inputs are HIGH.',
    defaultWidth: 90,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'Layers',
  },
  {
    type: 'OR',
    label: 'OR Gate',
    category: 'gates',
    description: 'Outputs HIGH if AT LEAST ONE input is HIGH.',
    defaultWidth: 90,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'GitMerge',
  },
  {
    type: 'NAND',
    label: 'NAND Gate',
    category: 'gates',
    description: 'Outputs LOW only if ALL inputs are HIGH.',
    defaultWidth: 95,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'Minimize2',
  },
  {
    type: 'NOR',
    label: 'NOR Gate',
    category: 'gates',
    description: 'Outputs HIGH only if ALL inputs are LOW.',
    defaultWidth: 95,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'Disc',
  },
  {
    type: 'XOR',
    label: 'XOR Gate',
    category: 'gates',
    description: 'Outputs HIGH if inputs are DIFFERENT (odd number of HIGHs).',
    defaultWidth: 90,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'Zap',
  },
  {
    type: 'XNOR',
    label: 'XNOR Gate',
    category: 'gates',
    description: 'Outputs HIGH if inputs are EQUAL (even number of HIGHs).',
    defaultWidth: 95,
    defaultHeight: 70,
    defaultInputs: 2,
    iconName: 'Shield',
  },

  // Outputs
  {
    type: 'LIGHT_BULB',
    label: 'Light Bulb',
    category: 'outputs',
    description: 'Glows brightly when receiving a HIGH signal.',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultInputs: 1,
    iconName: 'Lightbulb',
  },
  {
    type: 'LED_PROBE',
    label: 'LED / Signal Probe',
    category: 'outputs',
    description: 'Displays 0 or 1 with glowing indicator.',
    defaultWidth: 60,
    defaultHeight: 60,
    defaultInputs: 1,
    iconName: 'Radio',
  },
  {
    type: 'HEX_DISPLAY',
    label: '7-Segment Hex Display',
    category: 'outputs',
    description: '4-bit binary input decoded into 0-9, A-F digit display.',
    defaultWidth: 100,
    defaultHeight: 120,
    defaultInputs: 4,
    iconName: 'Tv',
  },
  {
    type: 'BUZZER',
    label: 'Audio Buzzer',
    category: 'outputs',
    description: 'Emits audio tone when signal is HIGH.',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultInputs: 1,
    iconName: 'Volume2',
  },

  // ICs / Sequential
  {
    type: 'SR_LATCH',
    label: 'SR Latch',
    category: 'ics',
    description: 'Set-Reset Memory Latch with S and R control lines.',
    defaultWidth: 110,
    defaultHeight: 90,
    defaultInputs: 2,
    iconName: 'Box',
  },
  {
    type: 'D_FLIPFLOP',
    label: 'D Flip-Flop',
    category: 'ics',
    description: 'Data Flip-Flop. Captures D state on CLK rising edge.',
    defaultWidth: 110,
    defaultHeight: 90,
    defaultInputs: 2,
    iconName: 'Cpu',
  },
  {
    type: 'JK_FLIPFLOP',
    label: 'JK Flip-Flop',
    category: 'ics',
    description: 'Universal Flip-Flop with Set, Reset, and Toggle capabilities.',
    defaultWidth: 110,
    defaultHeight: 100,
    defaultInputs: 3,
    iconName: 'Cpu',
  },
  {
    type: 'T_FLIPFLOP',
    label: 'T Flip-Flop',
    category: 'ics',
    description: 'Toggle Flip-Flop. Toggles output on CLK rising edge when T=1.',
    defaultWidth: 110,
    defaultHeight: 90,
    defaultInputs: 2,
    iconName: 'Cpu',
  },
  {
    type: 'MUX_21',
    label: '2-to-1 Multiplexer',
    category: 'ics',
    description: 'Selects between 2 input data lines based on 1 Select line.',
    defaultWidth: 100,
    defaultHeight: 100,
    defaultInputs: 3,
    iconName: 'Sliders',
  },
  {
    type: 'DEMUX_12',
    label: '1-to-2 Demultiplexer',
    category: 'ics',
    description: 'Routes 1 input data line to 1 of 2 output lines based on Select line.',
    defaultWidth: 100,
    defaultHeight: 100,
    defaultInputs: 2,
    iconName: 'Split',
  },
  {
    type: 'HALF_ADDER',
    label: 'Half Adder',
    category: 'ics',
    description: 'Adds 2 single-bit inputs A & B (SUM and CARRY out).',
    defaultWidth: 110,
    defaultHeight: 90,
    defaultInputs: 2,
    iconName: 'PlusSquare',
  },
  {
    type: 'FULL_ADDER',
    label: 'Full Adder',
    category: 'ics',
    description: 'Adds A, B, and Carry In to produce SUM and Carry Out.',
    defaultWidth: 120,
    defaultHeight: 110,
    defaultInputs: 3,
    iconName: 'Grid',
  },

  // Annotation
  {
    type: 'TEXT_NOTE',
    label: 'Text Annotation',
    category: 'annotations',
    description: 'Sticky text note for labeling circuit diagrams.',
    defaultWidth: 160,
    defaultHeight: 80,
    defaultInputs: 0,
    iconName: 'FileText',
  },
];

// Helper to create ports for nodes
export function createDefaultPortsForNode(type: NodeType, numInputsOverride?: number): { inputs: Port[]; outputs: Port[] } {
  const meta = COMPONENT_METADATA.find((m) => m.type === type);
  const numInputs = numInputsOverride ?? meta?.defaultInputs ?? 0;

  const inputs: Port[] = [];
  const outputs: Port[] = [];

  switch (type) {
    case 'SWITCH':
    case 'BUTTON':
    case 'CONST_HIGH':
    case 'CONST_LOW':
    case 'CLOCK':
    case 'SINE_GEN':
      outputs.push({ id: 'out_0', name: 'OUT', type: 'output', value: 0, relativeX: 100, relativeY: 50 });
      break;

    case 'AMP_CLASS_A':
    case 'AMP_CLASS_B':
    case 'AMP_CLASS_AB':
    case 'AMP_CLASS_C':
    case 'AMP_CLASS_D':
      inputs.push({ id: 'in_sig', name: 'VIN', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      outputs.push({ id: 'out_sig', name: 'VOUT', type: 'output', value: 0, relativeX: 100, relativeY: 50 });
      break;

    case 'BUFFER':
    case 'NOT':
      inputs.push({ id: 'in_0', name: 'IN', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      outputs.push({ id: 'out_0', name: 'OUT', type: 'output', value: 0, relativeX: 100, relativeY: 50 });
      break;

    case 'AND':
    case 'OR':
    case 'NAND':
    case 'NOR':
    case 'XOR':
    case 'XNOR':
      for (let i = 0; i < numInputs; i++) {
        const step = 100 / (numInputs + 1);
        inputs.push({
          id: `in_${i}`,
          name: `In ${i + 1}`,
          type: 'input',
          value: 0,
          relativeX: 0,
          relativeY: Math.round(step * (i + 1)),
        });
      }
      outputs.push({ id: 'out_0', name: 'OUT', type: 'output', value: 0, relativeX: 100, relativeY: 50 });
      break;

    case 'LIGHT_BULB':
    case 'LED_PROBE':
    case 'BUZZER':
      inputs.push({ id: 'in_0', name: 'IN', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      break;

    case 'HEX_DISPLAY':
      for (let i = 0; i < 4; i++) {
        const step = 100 / 5;
        inputs.push({
          id: `in_${i}`,
          name: `D${i}`,
          type: 'input',
          value: 0,
          relativeX: 0,
          relativeY: Math.round(step * (i + 1)),
        });
      }
      break;

    case 'SR_LATCH':
      inputs.push({ id: 'in_s', name: 'S', type: 'input', value: 0, relativeX: 0, relativeY: 30 });
      inputs.push({ id: 'in_r', name: 'R', type: 'input', value: 0, relativeX: 0, relativeY: 70 });
      outputs.push({ id: 'out_q', name: 'Q', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_qbar', name: 'Q\'', type: 'output', value: 1, relativeX: 100, relativeY: 70 });
      break;

    case 'D_FLIPFLOP':
      inputs.push({ id: 'in_d', name: 'D', type: 'input', value: 0, relativeX: 0, relativeY: 30 });
      inputs.push({ id: 'in_clk', name: 'CLK', type: 'input', value: 0, relativeX: 0, relativeY: 70 });
      outputs.push({ id: 'out_q', name: 'Q', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_qbar', name: 'Q\'', type: 'output', value: 1, relativeX: 100, relativeY: 70 });
      break;

    case 'JK_FLIPFLOP':
      inputs.push({ id: 'in_j', name: 'J', type: 'input', value: 0, relativeX: 0, relativeY: 25 });
      inputs.push({ id: 'in_clk', name: 'CLK', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      inputs.push({ id: 'in_k', name: 'K', type: 'input', value: 0, relativeX: 0, relativeY: 75 });
      outputs.push({ id: 'out_q', name: 'Q', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_qbar', name: 'Q\'', type: 'output', value: 1, relativeX: 100, relativeY: 70 });
      break;

    case 'T_FLIPFLOP':
      inputs.push({ id: 'in_t', name: 'T', type: 'input', value: 0, relativeX: 0, relativeY: 30 });
      inputs.push({ id: 'in_clk', name: 'CLK', type: 'input', value: 0, relativeX: 0, relativeY: 70 });
      outputs.push({ id: 'out_q', name: 'Q', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_qbar', name: 'Q\'', type: 'output', value: 1, relativeX: 100, relativeY: 70 });
      break;

    case 'MUX_21':
      inputs.push({ id: 'in_0', name: 'I0', type: 'input', value: 0, relativeX: 0, relativeY: 25 });
      inputs.push({ id: 'in_1', name: 'I1', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      inputs.push({ id: 'in_sel', name: 'SEL', type: 'input', value: 0, relativeX: 50, relativeY: 100 });
      outputs.push({ id: 'out_0', name: 'OUT', type: 'output', value: 0, relativeX: 100, relativeY: 50 });
      break;

    case 'DEMUX_12':
      inputs.push({ id: 'in_0', name: 'IN', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      inputs.push({ id: 'in_sel', name: 'SEL', type: 'input', value: 0, relativeX: 50, relativeY: 100 });
      outputs.push({ id: 'out_0', name: 'O0', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_1', name: 'O1', type: 'output', value: 0, relativeX: 100, relativeY: 70 });
      break;

    case 'HALF_ADDER':
      inputs.push({ id: 'in_a', name: 'A', type: 'input', value: 0, relativeX: 0, relativeY: 30 });
      inputs.push({ id: 'in_b', name: 'B', type: 'input', value: 0, relativeX: 0, relativeY: 70 });
      outputs.push({ id: 'out_sum', name: 'SUM', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_carry', name: 'COUT', type: 'output', value: 0, relativeX: 100, relativeY: 70 });
      break;

    case 'FULL_ADDER':
      inputs.push({ id: 'in_a', name: 'A', type: 'input', value: 0, relativeX: 0, relativeY: 25 });
      inputs.push({ id: 'in_b', name: 'B', type: 'input', value: 0, relativeX: 0, relativeY: 50 });
      inputs.push({ id: 'in_cin', name: 'CIN', type: 'input', value: 0, relativeX: 0, relativeY: 75 });
      outputs.push({ id: 'out_sum', name: 'SUM', type: 'output', value: 0, relativeX: 100, relativeY: 30 });
      outputs.push({ id: 'out_carry', name: 'COUT', type: 'output', value: 0, relativeX: 100, relativeY: 70 });
      break;

    case 'TEXT_NOTE':
      break;
  }

  return { inputs, outputs };
}

export function evaluateNodeLogic(node: CircuitNode): {
  outputs: Record<string, SignalState>;
  newInternalState?: Record<string, any>;
  nodeStateValue?: SignalState;
} {
  const getIn = (id: string): SignalState => {
    const p = node.inputs.find((i) => i.id === id);
    return p ? p.value : 0;
  };

  const inputsList = node.inputs.map((i) => (i.value === 1 ? 1 : 0));
  const outputs: Record<string, SignalState> = {};
  const currentInternal = node.state.internalState || {};
  let nextInternal = { ...currentInternal };
  let nodeStateVal = node.state.value;

  switch (node.type) {
    case 'SWITCH':
    case 'BUTTON':
    case 'CLOCK':
    case 'SINE_GEN':
      outputs['out_0'] = node.state.value === 1 ? 1 : 0;
      break;

    case 'AMP_CLASS_A':
    case 'AMP_CLASS_B':
    case 'AMP_CLASS_AB':
    case 'AMP_CLASS_C':
    case 'AMP_CLASS_D':
      // Passes high/low signal or tracks analog wave
      outputs['out_sig'] = getIn('in_sig') === 1 ? 1 : 0;
      break;

    case 'CONST_HIGH':
      outputs['out_0'] = 1;
      break;

    case 'CONST_LOW':
      outputs['out_0'] = 0;
      break;

    case 'BUFFER':
      outputs['out_0'] = getIn('in_0') === 1 ? 1 : 0;
      break;

    case 'NOT':
      outputs['out_0'] = getIn('in_0') === 1 ? 0 : 1;
      break;

    case 'AND': {
      const allHigh = inputsList.length > 0 && inputsList.every((v) => v === 1);
      outputs['out_0'] = allHigh ? 1 : 0;
      break;
    }

    case 'OR': {
      const anyHigh = inputsList.some((v) => v === 1);
      outputs['out_0'] = anyHigh ? 1 : 0;
      break;
    }

    case 'NAND': {
      const allHigh = inputsList.length > 0 && inputsList.every((v) => v === 1);
      outputs['out_0'] = allHigh ? 0 : 1;
      break;
    }

    case 'NOR': {
      const anyHigh = inputsList.some((v) => v === 1);
      outputs['out_0'] = anyHigh ? 0 : 1;
      break;
    }

    case 'XOR': {
      const countHigh = inputsList.filter((v) => v === 1).length;
      outputs['out_0'] = countHigh % 2 === 1 ? 1 : 0;
      break;
    }

    case 'XNOR': {
      const countHigh = inputsList.filter((v) => v === 1).length;
      outputs['out_0'] = countHigh % 2 === 0 ? 1 : 0;
      break;
    }

    case 'LIGHT_BULB':
    case 'LED_PROBE':
    case 'BUZZER':
      nodeStateVal = getIn('in_0') === 1 ? 1 : 0;
      break;

    case 'HEX_DISPLAY': {
      const d0 = getIn('in_0') === 1 ? 1 : 0;
      const d1 = getIn('in_1') === 1 ? 1 : 0;
      const d2 = getIn('in_2') === 1 ? 1 : 0;
      const d3 = getIn('in_3') === 1 ? 1 : 0;
      const hexVal = d0 + d1 * 2 + d2 * 4 + d3 * 8;
      nextInternal.hexVal = hexVal;
      break;
    }

    case 'SR_LATCH': {
      const s = getIn('in_s') === 1 ? 1 : 0;
      const r = getIn('in_r') === 1 ? 1 : 0;
      let q = currentInternal.Q ?? 0;

      if (s === 1 && r === 0) {
        q = 1;
      } else if (s === 0 && r === 1) {
        q = 0;
      } else if (s === 1 && r === 1) {
        q = 0;
      }

      nextInternal.Q = q;
      outputs['out_q'] = q;
      outputs['out_qbar'] = q === 1 ? 0 : 1;
      break;
    }

    case 'D_FLIPFLOP': {
      const d = getIn('in_d') === 1 ? 1 : 0;
      const clk = getIn('in_clk') === 1 ? 1 : 0;
      const prevClk = currentInternal.prevClk ?? 0;
      let q = currentInternal.Q ?? 0;

      if (prevClk === 0 && clk === 1) {
        q = d;
      }

      nextInternal.prevClk = clk;
      nextInternal.Q = q;
      outputs['out_q'] = q;
      outputs['out_qbar'] = q === 1 ? 0 : 1;
      break;
    }

    case 'JK_FLIPFLOP': {
      const j = getIn('in_j') === 1 ? 1 : 0;
      const k = getIn('in_k') === 1 ? 1 : 0;
      const clk = getIn('in_clk') === 1 ? 1 : 0;
      const prevClk = currentInternal.prevClk ?? 0;
      let q = currentInternal.Q ?? 0;

      if (prevClk === 0 && clk === 1) {
        if (j === 1 && k === 0) q = 1;
        else if (j === 0 && k === 1) q = 0;
        else if (j === 1 && k === 1) q = q === 1 ? 0 : 1;
      }

      nextInternal.prevClk = clk;
      nextInternal.Q = q;
      outputs['out_q'] = q;
      outputs['out_qbar'] = q === 1 ? 0 : 1;
      break;
    }

    case 'T_FLIPFLOP': {
      const t = getIn('in_t') === 1 ? 1 : 0;
      const clk = getIn('in_clk') === 1 ? 1 : 0;
      const prevClk = currentInternal.prevClk ?? 0;
      let q = currentInternal.Q ?? 0;

      if (prevClk === 0 && clk === 1 && t === 1) {
        q = q === 1 ? 0 : 1;
      }

      nextInternal.prevClk = clk;
      nextInternal.Q = q;
      outputs['out_q'] = q;
      outputs['out_qbar'] = q === 1 ? 0 : 1;
      break;
    }

    case 'MUX_21': {
      const i0 = getIn('in_0') === 1 ? 1 : 0;
      const i1 = getIn('in_1') === 1 ? 1 : 0;
      const sel = getIn('in_sel') === 1 ? 1 : 0;
      outputs['out_0'] = sel === 1 ? i1 : i0;
      break;
    }

    case 'DEMUX_12': {
      const inVal = getIn('in_0') === 1 ? 1 : 0;
      const sel = getIn('in_sel') === 1 ? 1 : 0;
      outputs['out_0'] = sel === 0 ? inVal : 0;
      outputs['out_1'] = sel === 1 ? inVal : 0;
      break;
    }

    case 'HALF_ADDER': {
      const a = getIn('in_a') === 1 ? 1 : 0;
      const b = getIn('in_b') === 1 ? 1 : 0;
      outputs['out_sum'] = a !== b ? 1 : 0;
      outputs['out_carry'] = a === 1 && b === 1 ? 1 : 0;
      break;
    }

    case 'FULL_ADDER': {
      const a = getIn('in_a') === 1 ? 1 : 0;
      const b = getIn('in_b') === 1 ? 1 : 0;
      const cin = getIn('in_cin') === 1 ? 1 : 0;
      const sum = (a ^ b ^ cin) === 1 ? 1 : 0;
      const cout = (a & b) || (cin & (a ^ b)) ? 1 : 0;
      outputs['out_sum'] = sum;
      outputs['out_carry'] = cout;
      break;
    }

    case 'TEXT_NOTE':
      break;
  }

  return { outputs, newInternalState: nextInternal, nodeStateValue: nodeStateVal };
}
