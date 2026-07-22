import React from 'react';
import type { CircuitNode, Port } from '../types/logic';
import { soundFx } from './AudioSynth';

interface GateNodeProps {
  node: CircuitNode;
  isSelected: boolean;
  onSelectNode: (nodeId: string, multiSelect: boolean) => void;
  onNodeMouseDown: (nodeId: string, e: React.MouseEvent | React.TouchEvent) => void;
  onPortClick: (nodeId: string, portId: string, isOutput: boolean) => void;
  onUpdateNodeState: (nodeId: string, stateUpdate: any) => void;
  hoveredPort: { nodeId: string; portId: string; isOutput: boolean } | null;
  onPortHover: (port: { nodeId: string; portId: string; isOutput: boolean } | null) => void;
}

export const GateNode: React.FC<GateNodeProps> = ({
  node,
  isSelected,
  onNodeMouseDown,
  onPortClick,
  onUpdateNodeState,
  hoveredPort,
  onPortHover,
}) => {
  const { id, type, label, x, y, width, height, inputs, outputs, state } = node;

  const handleMouseDown = (e: React.MouseEvent) => {
    onNodeMouseDown(id, e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onNodeMouseDown(id, e);
  };

  // Toggle switch action
  const handleToggleSwitch = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (type === 'SWITCH') {
      const newVal = state.value === 1 ? 0 : 1;
      soundFx.playToggleSound(newVal === 1);
      onUpdateNodeState(id, { value: newVal });
    }
  };

  // Push button action
  const handleButtonDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (type === 'BUTTON') {
      soundFx.playToggleSound(true);
      onUpdateNodeState(id, { value: 1 });
    }
  };

  const handleButtonUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (type === 'BUTTON') {
      onUpdateNodeState(id, { value: 0 });
    }
  };

  // Render Port Pin Component
  const renderPort = (port: Port, isOutput: boolean) => {
    const portX = (width * port.relativeX) / 100;
    const portY = (height * port.relativeY) / 100;
    const isHigh = port.value === 1;
    const isHovered = hoveredPort?.nodeId === id && hoveredPort?.portId === port.id;

    const handlePortTrigger = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onPortClick(id, port.id, isOutput);
    };

    return (
      <g
        key={port.id}
        transform={`translate(${portX}, ${portY})`}
        style={{ cursor: 'pointer' }}
        onMouseDown={handlePortTrigger}
        onTouchStart={handlePortTrigger}
        onMouseUp={handlePortTrigger}
        onTouchEnd={handlePortTrigger}
        onMouseEnter={() => onPortHover({ nodeId: id, portId: port.id, isOutput })}
        onMouseLeave={() => onPortHover(null)}
      >
        {/* Port Pin Connection Line */}
        <line
          x1={isOutput ? -6 : 0}
          y1={0}
          x2={isOutput ? 0 : 6}
          y2={0}
          stroke={isHigh ? 'var(--signal-high)' : 'var(--signal-low)'}
          strokeWidth={2.5}
        />

        {/* Large Invisible Hit Target for Easy Touch/Click Radius */}
        <circle r={14} fill="transparent" />

        {/* Hover Highlight Ring */}
        {isHovered && (
          <circle r={11} fill="rgba(56, 189, 248, 0.2)" stroke={isOutput ? 'var(--accent-cyan)' : 'var(--accent-emerald)'} strokeWidth={2.5} />
        )}

        {/* Port Circle Target */}
        <circle
          r={6}
          fill={isHigh ? 'var(--signal-high)' : 'var(--bg-card)'}
          stroke={isHigh ? 'var(--signal-high)' : 'var(--border-highlight)'}
          strokeWidth={2}
          style={{ transition: 'all 0.15s ease' }}
        />

        {/* Port Label Tooltip */}
        <text
          x={isOutput ? 12 : -12}
          y={4}
          textAnchor={isOutput ? 'start' : 'end'}
          fill="var(--text-muted)"
          fontSize={10}
          fontWeight={500}
          style={{ pointerEvents: 'none' }}
        >
          {port.name}
        </text>
      </g>
    );
  };

  // Render Specific Visual Gate Graphic (IEEE Symbol)
  const renderGateShape = () => {
    switch (type) {
      case 'BUFFER':
      case 'NOT':
        return (
          <g>
            <polygon points="15,10 60,30 15,50" fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2.5} />
            {type === 'NOT' && <circle cx={65} cy={30} r={5} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2} />}
          </g>
        );

      case 'AND':
      case 'NAND':
        return (
          <g>
            <path
              d="M 15,10 L 45,10 C 65,10 65,60 45,60 L 15,60 Z"
              fill="var(--bg-card)"
              stroke="var(--border-highlight)"
              strokeWidth={2.5}
            />
            {type === 'NAND' && <circle cx={68} cy={35} r={5} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2} />}
          </g>
        );

      case 'OR':
      case 'NOR':
        return (
          <g>
            <path
              d="M 15,10 C 25,25 25,45 15,60 C 40,60 65,48 70,35 C 65,22 40,10 15,10 Z"
              fill="var(--bg-card)"
              stroke="var(--border-highlight)"
              strokeWidth={2.5}
            />
            {type === 'NOR' && <circle cx={75} cy={35} r={5} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2} />}
          </g>
        );

      case 'XOR':
      case 'XNOR':
        return (
          <g>
            <path d="M 10,10 C 20,25 20,45 10,60" fill="none" stroke="var(--border-highlight)" strokeWidth={2.5} />
            <path
              d="M 18,10 C 28,25 28,45 18,60 C 43,60 68,48 73,35 C 68,22 43,10 18,10 Z"
              fill="var(--bg-card)"
              stroke="var(--border-highlight)"
              strokeWidth={2.5}
            />
            {type === 'XNOR' && <circle cx={78} cy={35} r={5} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2} />}
          </g>
        );

      case 'SWITCH': {
        const isOn = state.value === 1;
        return (
          <g transform="translate(10, 10)" onClick={handleToggleSwitch} onTouchEnd={handleToggleSwitch} style={{ cursor: 'pointer' }}>
            <rect x={0} y={0} width={50} height={50} rx={12} fill={isOn ? 'var(--accent-emerald)' : 'var(--bg-card)'} stroke="var(--border-highlight)" strokeWidth={2} />
            <circle cx={25} cy={isOn ? 18 : 32} r={10} fill="#fff" style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            <text x={25} y={isOn ? 40 : 18} textAnchor="middle" fill={isOn ? '#fff' : 'var(--text-muted)'} fontSize={11} fontWeight={700}>
              {isOn ? '1' : '0'}
            </text>
          </g>
        );
      }

      case 'BUTTON': {
        const isPressed = state.value === 1;
        return (
          <g transform="translate(10, 10)" onMouseDown={handleButtonDown} onTouchStart={handleButtonDown} onMouseUp={handleButtonUp} onTouchEnd={handleButtonUp} style={{ cursor: 'pointer' }}>
            <circle cx={25} cy={25} r={22} fill={isPressed ? 'var(--accent-rose)' : 'var(--bg-card)'} stroke="var(--border-highlight)" strokeWidth={2} />
            <circle cx={25} cy={25} r={14} fill={isPressed ? '#fff' : 'var(--accent-rose)'} />
          </g>
        );
      }

      case 'CONST_HIGH':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={50} height={50} rx={10} fill="rgba(56, 189, 248, 0.15)" stroke="var(--accent-cyan)" strokeWidth={2.5} />
            <text x={25} y={33} textAnchor="middle" fill="var(--accent-cyan)" fontSize={24} fontWeight={800}>
              1
            </text>
          </g>
        );

      case 'CONST_LOW':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={50} height={50} rx={10} fill="rgba(71, 85, 105, 0.15)" stroke="var(--text-muted)" strokeWidth={2.5} />
            <text x={25} y={33} textAnchor="middle" fill="var(--text-muted)" fontSize={24} fontWeight={800}>
              0
            </text>
          </g>
        );

      case 'CLOCK': {
        const isHigh = state.value === 1;
        return (
          <g transform="translate(10, 10)">
            <rect x={0} y={0} width={50} height={50} rx={10} fill="var(--bg-card)" stroke={isHigh ? 'var(--accent-cyan)' : 'var(--border-highlight)'} strokeWidth={2} />
            <path
              d={isHigh ? 'M 10,35 L 25,35 L 25,15 L 40,15' : 'M 10,15 L 25,15 L 25,35 L 40,35'}
              fill="none"
              stroke={isHigh ? 'var(--accent-cyan)' : 'var(--text-secondary)'}
              strokeWidth={3}
            />
          </g>
        );
      }

      case 'LIGHT_BULB': {
        const isGlowing = state.value === 1;
        const bulbColor = state.customColor || '#f59e0b';
        return (
          <g transform="translate(10, 5)">
            <path
              d="M 25,5 C 13,5 10,18 15,28 L 18,36 L 32,36 L 35,28 C 40,18 37,5 25,5 Z"
              fill={isGlowing ? bulbColor : 'var(--bg-card)'}
              stroke="var(--border-highlight)"
              strokeWidth={2}
              className={isGlowing ? 'bulb-glowing' : undefined}
            />
            <rect x={18} y={36} width={14} height={8} fill="#64748b" rx={2} />
            <path d="M 20,44 L 30,44 L 25,49 Z" fill="#475569" />
          </g>
        );
      }

      case 'LED_PROBE': {
        const isHigh = state.value === 1;
        return (
          <g transform="translate(5, 5)">
            <circle cx={25} cy={25} r={20} fill={isHigh ? 'var(--accent-emerald)' : 'var(--bg-card)'} stroke="var(--border-highlight)" strokeWidth={2} />
            <text x={25} y={32} textAnchor="middle" fill={isHigh ? '#fff' : 'var(--text-muted)'} fontSize={18} fontWeight={700}>
              {isHigh ? '1' : '0'}
            </text>
          </g>
        );
      }

      case 'HEX_DISPLAY': {
        const val = state.internalState?.hexVal ?? 0;
        const hexStr = val.toString(16).toUpperCase();

        const SEGMENTS_MAP: Record<number, boolean[]> = {
          0: [true, true, true, true, true, true, false],
          1: [false, true, true, false, false, false, false],
          2: [true, true, false, true, true, false, true],
          3: [true, true, true, true, false, false, true],
          4: [false, true, true, false, false, true, true],
          5: [true, false, true, true, false, true, true],
          6: [true, false, true, true, true, true, true],
          7: [true, true, true, false, false, false, false],
          8: [true, true, true, true, true, true, true],
          9: [true, true, true, true, false, true, true],
          10: [true, true, true, false, true, true, true],
          11: [false, false, true, true, true, true, true],
          12: [true, false, false, true, true, true, false],
          13: [false, true, true, true, true, false, true],
          14: [true, false, false, true, true, true, true],
          15: [true, false, false, false, true, true, true],
        };

        const segs = SEGMENTS_MAP[val] || SEGMENTS_MAP[0];

        return (
          <g transform="translate(10, 10)">
            <rect x={0} y={0} width={80} height={100} rx={8} fill="#000" stroke="var(--border-highlight)" strokeWidth={2} />

            <g transform="translate(20, 15)">
              <line x1={5} y1={5} x2={35} y2={5} stroke={segs[0] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={35} y1={5} x2={35} y2={35} stroke={segs[1] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={35} y1={35} x2={35} y2={65} stroke={segs[2] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={5} y1={65} x2={35} y2={65} stroke={segs[3] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={5} y1={35} x2={5} y2={65} stroke={segs[4] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={5} y1={5} x2={5} y2={35} stroke={segs[5] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
              <line x1={5} y1={35} x2={35} y2={35} stroke={segs[6] ? '#f43f5e' : '#1e1e24'} strokeWidth={4} strokeLinecap="round" />
            </g>

            <text x={40} y={92} textAnchor="middle" fill="#64748b" fontSize={11} fontFamily="var(--font-mono)">
              0x{hexStr}
            </text>
          </g>
        );
      }

      case 'TEXT_NOTE':
        return (
          <g>
            <rect x={0} y={0} width={width} height={height} rx={8} fill="rgba(245, 158, 11, 0.15)" stroke="var(--accent-amber)" strokeWidth={1.5} />
            <foreignObject x={8} y={8} width={width - 16} height={height - 16}>
              <div style={{ width: '100%', height: '100%', fontSize: '0.78rem', color: 'var(--text-primary)', wordBreak: 'break-word', overflowY: 'auto' }}>
                {state.text || 'Double click or use property panel to edit text note.'}
              </div>
            </foreignObject>
          </g>
        );

      default:
        return (
          <g>
            <rect x={0} y={0} width={width} height={height} rx={8} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={2} />
            <text x={width / 2} y={height / 2 + 4} textAnchor="middle" fill="var(--text-primary)" fontSize={12} fontWeight={700}>
              {label}
            </text>
          </g>
        );
    }
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ cursor: 'move', touchAction: 'none' }}
    >
      {/* Node Selection Outline */}
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={10}
          fill="none"
          stroke="var(--accent-cyan)"
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      )}

      {/* Render Node Body Shape */}
      {renderGateShape()}

      {/* Node Label Below */}
      {type !== 'TEXT_NOTE' && (
        <text
          x={width / 2}
          y={height + 16}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={11}
          fontWeight={600}
          style={{ pointerEvents: 'none' }}
        >
          {label}
        </text>
      )}

      {/* Input Ports */}
      {inputs.map((port) => renderPort(port, false))}

      {/* Output Ports */}
      {outputs.map((port) => renderPort(port, true))}
    </g>
  );
};
