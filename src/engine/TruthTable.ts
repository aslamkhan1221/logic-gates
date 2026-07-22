import type { CircuitNode, SignalState } from '../types/logic';
import { evaluateNodeLogic } from './GateLogic';

export interface TruthTableRow {
  inputs: { name: string; value: SignalState }[];
  outputs: { name: string; value: SignalState }[];
  isActive: boolean;
}

export interface TruthTableData {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  expression: string;
  inputNames: string[];
  outputNames: string[];
  rows: TruthTableRow[];
}

export function getBooleanExpression(type: string, inputNames: string[]): string {
  const a = inputNames[0] || 'A';
  const b = inputNames[1] || 'B';
  const c = inputNames[2] || 'C';

  switch (type) {
    case 'AND':
      return inputNames.length > 2 ? `Y = ${inputNames.join(' · ')}` : `Y = ${a} · ${b}`;
    case 'OR':
      return inputNames.length > 2 ? `Y = ${inputNames.join(' + ')}` : `Y = ${a} + ${b}`;
    case 'NOT':
      return `Y = ¬${a}`;
    case 'BUFFER':
      return `Y = ${a}`;
    case 'NAND':
      return `Y = ¬(${inputNames.join(' · ')})`;
    case 'NOR':
      return `Y = ¬(${inputNames.join(' + ')})`;
    case 'XOR':
      return `Y = ${a} ⊕ ${b}`;
    case 'XNOR':
      return `Y = ¬(${a} ⊕ ${b})`;
    case 'HALF_ADDER':
      return `SUM = ${a} ⊕ ${b}, COUT = ${a} · ${b}`;
    case 'FULL_ADDER':
      return `SUM = ${a} ⊕ ${b} ⊕ ${c}, COUT = (${a}·${b}) + ${c}·(${a}⊕${b})`;
    case 'MUX_21':
      return `OUT = (¬SEL · I0) + (SEL · I1)`;
    case 'DEMUX_12':
      return `O0 = ¬SEL · IN, O1 = SEL · IN`;
    case 'SR_LATCH':
      return `Q(next) = S + (¬R · Q)`;
    case 'D_FLIPFLOP':
      return `Q(next) = D (on CLK ↑)`;
    case 'JK_FLIPFLOP':
      return `Q(next) = (J · ¬Q) + (¬K · Q)`;
    case 'T_FLIPFLOP':
      return `Q(next) = T ⊕ Q (on CLK ↑)`;
    default:
      return `Y = f(${inputNames.join(', ')})`;
  }
}

/**
 * Generates full real-time Truth Table data for a given circuit node.
 */
export function generateTruthTableForNode(node: CircuitNode): TruthTableData {
  const inputNames = node.inputs.map((p) => p.name);
  const outputNames = node.outputs.map((p) => p.name);
  const expression = getBooleanExpression(node.type, inputNames);

  const numInputs = node.inputs.length;
  const rows: TruthTableRow[] = [];

  if (numInputs === 0) {
    const currentOutputs = node.outputs.map((outPort) => ({
      name: outPort.name,
      value: outPort.value,
    }));
    rows.push({
      inputs: [],
      outputs: currentOutputs,
      isActive: true,
    });
  } else {
    const totalCombinations = Math.pow(2, numInputs);

    for (let k = 0; k < totalCombinations; k++) {
      const inputVals: { name: string; value: SignalState }[] = [];
      let isRowActive = true;

      const dummyInputs = node.inputs.map((port, idx) => {
        const bitVal: SignalState = ((k >> (numInputs - 1 - idx)) & 1) as SignalState;
        inputVals.push({ name: port.name, value: bitVal });

        const liveVal = port.value === 1 ? 1 : 0;
        if (liveVal !== bitVal) {
          isRowActive = false;
        }

        return { ...port, value: bitVal };
      });

      const dummyNode: CircuitNode = {
        ...node,
        inputs: dummyInputs,
        outputs: node.outputs.map((p) => ({ ...p })),
        state: { ...node.state },
      };

      const evalRes = evaluateNodeLogic(dummyNode);

      const outputVals: { name: string; value: SignalState }[] = dummyNode.outputs.map((outPort) => ({
        name: outPort.name,
        value: evalRes.outputs[outPort.id] ?? 0,
      }));

      rows.push({
        inputs: inputVals,
        outputs: outputVals,
        isActive: isRowActive,
      });
    }
  }

  return {
    nodeId: node.id,
    nodeLabel: node.label,
    nodeType: node.type,
    expression,
    inputNames,
    outputNames,
    rows,
  };
}
