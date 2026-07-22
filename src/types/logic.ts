export type SignalState = 0 | 1 | null;

export type NodeType =
  // Inputs
  | 'SWITCH'
  | 'BUTTON'
  | 'CONST_HIGH'
  | 'CONST_LOW'
  | 'CLOCK'
  | 'SINE_GEN'
  // Logic Gates
  | 'BUFFER'
  | 'NOT'
  | 'AND'
  | 'OR'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  // Outputs
  | 'LIGHT_BULB'
  | 'LED_PROBE'
  | 'HEX_DISPLAY'
  | 'BUZZER'
  // ICs / Sequential
  | 'SR_LATCH'
  | 'D_FLIPFLOP'
  | 'JK_FLIPFLOP'
  | 'T_FLIPFLOP'
  | 'MUX_21'
  | 'DEMUX_12'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  // Power Amplifiers
  | 'AMP_CLASS_A'
  | 'AMP_CLASS_B'
  | 'AMP_CLASS_AB'
  | 'AMP_CLASS_C'
  | 'AMP_CLASS_D'
  // Annotation
  | 'TEXT_NOTE';

export type Category = 'inputs' | 'gates' | 'outputs' | 'ics' | 'amplifiers' | 'annotations';

export interface Port {
  id: string;
  name: string;
  type: 'input' | 'output';
  value: SignalState;
  relativeX: number;
  relativeY: number;
}

export interface NodeState {
  value?: SignalState;
  internalState?: Record<string, any>;
  frequency?: number; // Hz for Clock / Sine Gen
  amplitude?: number; // V
  gain?: number; // Amplifier gain multiplier
  customColor?: string;
  numInputs?: number;
  text?: string;
}

export interface CircuitNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: Port[];
  outputs: Port[];
  state: NodeState;
}

export interface Wire {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
  signal: SignalState;
}

export interface CircuitData {
  version: number;
  nodes: CircuitNode[];
  wires: Wire[];
}

export interface ComponentMeta {
  type: NodeType;
  label: string;
  category: Category;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultInputs: number;
  iconName: string;
}
