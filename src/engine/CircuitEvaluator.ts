import type { CircuitNode, Wire, SignalState } from '../types/logic';
import { evaluateNodeLogic } from './GateLogic';

export interface StepResult {
  nodes: CircuitNode[];
  wires: Wire[];
  hasChanged: boolean;
}

/**
 * Propagates wire values and updates all gate node outputs.
 * Uses an iterative fixed-point algorithm (max 15 passes) to evaluate combinational & feedback circuits cleanly.
 */
export function propagateCircuit(
  nodes: CircuitNode[],
  wires: Wire[]
): StepResult {
  // Create deep map of node input/output states to avoid unintended mutations
  let updatedNodes: CircuitNode[] = nodes.map((node) => ({
    ...node,
    inputs: node.inputs.map((p) => ({ ...p })),
    outputs: node.outputs.map((p) => ({ ...p })),
    state: {
      ...node.state,
      internalState: node.state.internalState ? { ...node.state.internalState } : undefined,
    },
  }));

  let updatedWires: Wire[] = wires.map((w) => ({ ...w }));

  let overallChanged = false;
  const MAX_ITERATIONS = 15;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    let iterationChanged = false;

    // Step 1: Propagate output port values to wires and connected input ports
    const portValueMap = new Map<string, SignalState>(); // key: `${nodeId}:${portId}` -> SignalState

    for (const node of updatedNodes) {
      for (const outPort of node.outputs) {
        portValueMap.set(`${node.id}:${outPort.id}`, outPort.value);
      }
    }

    // Update wires and target inputs
    for (let i = 0; i < updatedWires.length; i++) {
      const wire = updatedWires[i];
      const sourceVal = portValueMap.get(`${wire.fromNodeId}:${wire.fromPortId}`) ?? 0;

      if (wire.signal !== sourceVal) {
        updatedWires[i] = { ...wire, signal: sourceVal };
        iterationChanged = true;
      }

      // Find target node and port
      const targetNode = updatedNodes.find((n) => n.id === wire.toNodeId);
      if (targetNode) {
        const inPortIndex = targetNode.inputs.findIndex((p) => p.id === wire.toPortId);
        if (inPortIndex !== -1 && targetNode.inputs[inPortIndex].value !== sourceVal) {
          targetNode.inputs[inPortIndex].value = sourceVal;
          iterationChanged = true;
        }
      }
    }

    // Step 2: Evaluate logic for each node
    for (let i = 0; i < updatedNodes.length; i++) {
      const node = updatedNodes[i];
      const evalRes = evaluateNodeLogic(node);

      // Check outputs
      let nodeOutChanged = false;
      for (let j = 0; j < node.outputs.length; j++) {
        const outPort = node.outputs[j];
        const newSignal = evalRes.outputs[outPort.id] ?? 0;
        if (outPort.value !== newSignal) {
          outPort.value = newSignal;
          nodeOutChanged = true;
        }
      }

      // Check node state value (e.g., Light bulb glow state)
      if (evalRes.nodeStateValue !== undefined && node.state.value !== evalRes.nodeStateValue) {
        node.state.value = evalRes.nodeStateValue;
        nodeOutChanged = true;
      }

      // Check internal state
      if (evalRes.newInternalState) {
        node.state.internalState = evalRes.newInternalState;
        if (evalRes.newInternalState.isRacing !== undefined) {
          node.state.isRacing = evalRes.newInternalState.isRacing;
        }
      }

      if (nodeOutChanged) {
        iterationChanged = true;
      }
    }

    if (iterationChanged) {
      overallChanged = true;
    } else {
      // Reached steady state equilibrium
      break;
    }
  }

  return {
    nodes: updatedNodes,
    wires: updatedWires,
    hasChanged: overallChanged,
  };
}

/**
 * Executes clock ticks for CLOCK, AC_SUPPLY, FUNCTION_GEN, and SINE_GEN nodes.
 * Each oscillating source flips its state value on every tick, simulating
 * waveform generation at the configured frequency (frequency-relative to simulation speed).
 */
export function tickClockNodes(nodes: CircuitNode[]): { nodes: CircuitNode[]; ticked: boolean } {
  let ticked = false;
  const OSCILLATING_TYPES: string[] = ['CLOCK', 'AC_SUPPLY', 'FUNCTION_GEN', 'SINE_GEN'];

  const nextNodes = nodes.map((node) => {
    if (OSCILLATING_TYPES.includes(node.type)) {
      const currentVal = node.state.value ?? 0;
      const nextVal: SignalState = currentVal === 1 ? 0 : 1;
      ticked = true;
      return {
        ...node,
        state: {
          ...node.state,
          value: nextVal,
        },
      };
    }
    return node;
  });

  return { nodes: nextNodes, ticked };
}
