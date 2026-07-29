export type SignalState = 0 | 1 | null;

export type NodeType =
  // Inputs & Power Supplies
  | 'SWITCH'
  | 'BUTTON'
  | 'CONST_HIGH'
  | 'CONST_LOW'
  | 'CLOCK'
  | 'SINE_GEN'
  | 'LDR_SENSOR'
  | 'DC_SUPPLY'
  | 'AC_SUPPLY'
  | 'FUNCTION_GEN'
  // Logic Gates
  | 'BUFFER'
  | 'NOT'
  | 'AND'
  | 'OR'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  // Discrete Electronics & Passives
  | 'RESISTOR'
  | 'CAPACITOR'
  | 'INDUCTOR'
  | 'DIODE'
  | 'ZENER_DIODE'
  | 'NPN_BJT'
  | 'PNP_BJT'
  | 'MOSFET_N'
  // Integrated Circuits & Analog
  | 'SR_LATCH'
  | 'D_FLIPFLOP'
  | 'JK_FLIPFLOP'
  | 'T_FLIPFLOP'
  | 'MUX_21'
  | 'DEMUX_12'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  | 'OP_AMP'
  | 'TIMER_555'
  | 'TRI_STATE_BUFFER'
  | 'COUNTER_4BIT'
  | 'DECODER_24'
  | 'VOLTAGE_REGULATOR'
  // Power Amplifiers
  | 'AMP_CLASS_A'
  | 'AMP_CLASS_B'
  | 'AMP_CLASS_AB'
  | 'AMP_CLASS_C'
  | 'AMP_CLASS_D'
  // Outputs & Instruments
  | 'LIGHT_BULB'
  | 'LED_PROBE'
  | 'HEX_DISPLAY'
  | 'BUZZER'
  | 'OSCILLOSCOPE_PROBE'
  | 'CRO_SCOPE'
  | 'DSO_SCOPE'
  // Annotation
  | 'TEXT_NOTE';

export type Category = 'inputs' | 'gates' | 'discrete' | 'ics' | 'amplifiers' | 'outputs' | 'annotations';

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
  frequency?: number; // Hz for Clock / Sine Gen / Oscillators
  amplitude?: number; // V
  gain?: number; // Amplifier gain multiplier
  customColor?: string;
  numInputs?: number;
  text?: string;
  // Power Supply & Function Generator Specs
  voltageDc?: number; // 0 - 30V Variable DC
  voltageAcRms?: number; // 0 - 24V RMS Variable AC
  waveType?: 'sine' | 'square' | 'triangle' | 'sawtooth';
  offsetV?: number; // DC Offset Voltage
  // CRO & DSO Instrument Controls
  voltsPerDiv?: number;
  timePerDiv?: number;
  fftEnabled?: boolean;
  triggerLevel?: number;
  // Race condition & Flip-Flop configurations
  triggerMode?: 'level' | 'master_slave';
  isRacing?: boolean;
  propagationDelayNs?: number;
  // Electronic specs
  resistance?: number; // Ohms
  capacitance?: number; // uF
  inductance?: number; // mH
  vZener?: number; // V
  opAmpGain?: number;
  dutyCycle?: number; // %
  voltageV?: number; // V
  currentMa?: number; // mA
  powerMw?: number; // mW
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

