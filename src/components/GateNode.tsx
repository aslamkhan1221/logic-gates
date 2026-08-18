import React from 'react';
import type { CircuitNode, Port } from '../types/logic';
import { soundFx } from './AudioSynth';

interface GateNodeProps {
  node: CircuitNode;
  isSelected: boolean;
  onSelectNode: (nodeId: string, multiSelect: boolean) => void;
  onNodeMouseDown: (nodeId: string, e: React.MouseEvent | React.TouchEvent) => void;
  onStartWire: (nodeId: string, portId: string) => void;
  onCompleteWire: (nodeId: string, portId: string) => void;
  onUpdateNodeState: (nodeId: string, stateUpdate: any) => void;
  hoveredPort: { nodeId: string; portId: string; isOutput: boolean } | null;
  onPortHover: (port: { nodeId: string; portId: string; isOutput: boolean } | null) => void;
}

export const GateNode: React.FC<GateNodeProps> = ({
  node,
  isSelected,
  onNodeMouseDown,
  onStartWire,
  onCompleteWire,
  onUpdateNodeState,
  hoveredPort,
  onPortHover,
}) => {
  const { id, type, label, x, y, width, height, inputs, outputs, state } = node;

  const handleNodePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onNodeMouseDown(id, e);
  };

  // Toggle switch action
  const handleToggleSwitch = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (type === 'SWITCH') {
      const newVal = state.value === 1 ? 0 : 1;
      soundFx.playToggleSound(newVal === 1);
      onUpdateNodeState(id, { value: newVal });
    }
  };

  // Push button action
  const handleButtonDown = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (type === 'BUTTON') {
      soundFx.playToggleSound(true);
      onUpdateNodeState(id, { value: 1 });
    }
  };

  const handleButtonUp = (e: React.SyntheticEvent) => {
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

    const handlePortTrigger = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      if (isOutput) {
        onStartWire(id, port.id);
      } else {
        onCompleteWire(id, port.id);
      }
    };

    return (
      <g
        key={port.id}
        transform={`translate(${portX}, ${portY})`}
        style={{ cursor: 'pointer', touchAction: 'none' }}
        onPointerDown={handlePortTrigger}
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
        <circle r={18} fill="transparent" />

        {/* Hover Highlight Ring */}
        {isHovered && (
          <circle r={12} fill="rgba(56, 189, 248, 0.25)" stroke={isOutput ? 'var(--accent-cyan)' : 'var(--accent-emerald)'} strokeWidth={2.5} />
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
          <g transform="translate(10, 10)" onClick={handleToggleSwitch} style={{ cursor: 'pointer' }}>
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
          <g transform="translate(10, 10)" onPointerDown={handleButtonDown} onPointerUp={handleButtonUp} style={{ cursor: 'pointer' }}>
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

      case 'RESISTOR':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={6} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={1.5} />
            <path d="M 10,20 L 20,20 L 25,10 L 35,30 L 45,10 L 55,30 L 60,20 L 70,20" fill="none" stroke="#f59e0b" strokeWidth={2.5} />
            <text x={(width - 10) / 2} y={38} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontWeight={600}>
              {state.resistance ?? 1000}Ω
            </text>
          </g>
        );

      case 'CAPACITOR':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={6} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={1.5} />
            <line x1={10} y1={20} x2={32} y2={20} stroke="#38bdf8" strokeWidth={2.5} />
            <line x1={32} y1={8} x2={32} y2={32} stroke="#38bdf8" strokeWidth={3} />
            <line x1={38} y1={8} x2={38} y2={32} stroke="#38bdf8" strokeWidth={3} />
            <line x1={38} y1={20} x2={60} y2={20} stroke="#38bdf8" strokeWidth={2.5} />
            <text x={(width - 10) / 2} y={38} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontWeight={600}>
              {state.capacitance ?? 10}µF
            </text>
          </g>
        );

      case 'DIODE':
      case 'ZENER_DIODE':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={6} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={1.5} />
            <polygon points="25,10 50,20 25,30" fill="#f43f5e" />
            <line x1={50} y1={8} x2={50} y2={32} stroke="#f43f5e" strokeWidth={3} />
            {type === 'ZENER_DIODE' && <path d="M 46,8 L 50,8 M 50,32 L 54,32" stroke="#f43f5e" strokeWidth={2.5} fill="none" />}
          </g>
        );

      case 'NPN_BJT':
      case 'PNP_BJT':
      case 'MOSFET_N':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={8} fill="var(--bg-card)" stroke="var(--border-highlight)" strokeWidth={1.5} />
            <circle cx={40} cy={35} r={22} fill="none" stroke="var(--accent-cyan)" strokeWidth={1.8} />
            <line x1={25} y1={22} x2={25} y2={48} stroke="var(--text-primary)" strokeWidth={3} />
            <line x1={25} y1={28} x2={45} y2={18} stroke="var(--text-primary)" strokeWidth={2} />
            <line x1={25} y1={42} x2={45} y2={52} stroke="var(--text-primary)" strokeWidth={2} />
            <text x={40} y={68} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontWeight={700}>
              {type}
            </text>
          </g>
        );

      case 'OP_AMP':
        return (
          <g transform="translate(5, 5)">
            <polygon points="10,5 90,40 10,75" fill="var(--bg-card)" stroke="var(--accent-cyan)" strokeWidth={2} />
            <text x={20} y={28} fill="var(--accent-emerald)" fontSize={14} fontWeight={800}>+</text>
            <text x={20} y={62} fill="var(--accent-rose)" fontSize={14} fontWeight={800}>-</text>
            <text x={42} y={44} fill="var(--text-muted)" fontSize={10} fontWeight={700}>741</text>
          </g>
        );

      case 'TIMER_555':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={8} fill="#020617" stroke="var(--accent-amber)" strokeWidth={2} />
            <circle cx={15} cy={12} r={4} fill="var(--accent-amber)" />
            <text x={(width - 10) / 2} y={50} textAnchor="middle" fill="var(--accent-amber)" fontSize={13} fontWeight={800}>
              NE555
            </text>
            <text x={(width - 10) / 2} y={70} textAnchor="middle" fill="var(--text-muted)" fontSize={9}>
              TIMER IC
            </text>
          </g>
        );

      case 'OSCILLOSCOPE_PROBE':
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={8} fill="#0f172a" stroke="var(--accent-cyan)" strokeWidth={2} />
            <path d="M 12,30 L 25,15 L 38,45 L 55,30" fill="none" stroke="var(--accent-cyan)" strokeWidth={2.5} />
            <text x={(width - 10) / 2} y={54} textAnchor="middle" fill="var(--accent-cyan)" fontSize={9} fontWeight={700}>
              PROBE
            </text>
          </g>
        );

      case 'DC_SUPPLY': {
        const vdc = state.voltageDc ?? 5;
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={10} fill="#020617" stroke="#f59e0b" strokeWidth={2.5} />
            {/* DC symbol */}
            <text x={(width - 10) / 2} y={28} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight={800}>DC SUPPLY</text>
            <line x1={12} y1={38} x2={58} y2={38} stroke="#f59e0b" strokeWidth={2.5} />
            <line x1={20} y1={45} x2={50} y2={45} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" />
            <text x={(width - 10) / 2} y={62} textAnchor="middle" fill="#facc15" fontSize={16} fontWeight={900}>{vdc}V</text>
          </g>
        );
      }

      case 'AC_SUPPLY': {
        const vrms = state.voltageAcRms ?? 12;
        const freq = state.frequency ?? 50;
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={width - 10} height={height - 10} rx={10} fill="#020617" stroke="#f43f5e" strokeWidth={2.5} />
            <text x={(width - 10) / 2} y={20} textAnchor="middle" fill="#f43f5e" fontSize={10} fontWeight={800}>AC SUPPLY</text>
            {/* AC Sine wave icon */}
            <path
              d={`M 10,${(height - 10) / 2} C 18,${(height - 10) / 2 - 18} 26,${(height - 10) / 2 - 18} 34,${(height - 10) / 2} C 42,${(height - 10) / 2 + 18} 50,${(height - 10) / 2 + 18} 58,${(height - 10) / 2} C 66,${(height - 10) / 2 - 18} 74,${(height - 10) / 2 - 18} 82,${(height - 10) / 2}`}
              fill="none" stroke="#f43f5e" strokeWidth={2.5}
            />
            <text x={(width - 10) / 2} y={(height - 10) - 6} textAnchor="middle" fill="#f87171" fontSize={10} fontWeight={700}>{vrms}V RMS  {freq}Hz</text>
          </g>
        );
      }

      case 'FUNCTION_GEN': {
        const waveType = state.waveType ?? 'sine';
        const fFreq = state.frequency ?? 1000;
        const amp = state.amplitude ?? 5;
        // Waveform preview paths
        const w = width - 10;
        const h = height - 10;
        const mid = h / 2;
        const waveColors: Record<string, string> = { sine: '#38bdf8', square: '#10b981', triangle: '#f59e0b', sawtooth: '#a78bfa' };
        const wColor = waveColors[waveType] || '#38bdf8';
        let wavePath = '';
        if (waveType === 'sine') {
          wavePath = `M 10,${mid} C 20,${mid - 20} 28,${mid - 20} 38,${mid} C 48,${mid + 20} 56,${mid + 20} 66,${mid} C 76,${mid - 20} 84,${mid - 20} 100,${mid}`;
        } else if (waveType === 'square') {
          wavePath = `M 10,${mid - 16} L 10,${mid - 16} L 30,${mid - 16} L 30,${mid + 16} L 60,${mid + 16} L 60,${mid - 16} L 100,${mid - 16}`;
        } else if (waveType === 'triangle') {
          wavePath = `M 10,${mid} L 30,${mid - 20} L 60,${mid + 20} L 90,${mid - 20} L 110,${mid}`;
        } else {
          wavePath = `M 10,${mid - 16} L 40,${mid + 16} L 40,${mid - 16} L 70,${mid + 16} L 70,${mid - 16} L 100,${mid + 16}`;
        }
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={w} height={h} rx={10} fill="#020617" stroke={wColor} strokeWidth={2.5} />
            <text x={w / 2} y={16} textAnchor="middle" fill={wColor} fontSize={10} fontWeight={800}>FUNC GEN</text>
            <path d={wavePath} fill="none" stroke={wColor} strokeWidth={2.5} />
            <text x={w / 2} y={h - 6} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight={600}>{waveType.toUpperCase()}  {amp}Vpp  {fFreq >= 1000 ? `${(fFreq/1000).toFixed(1)}kHz` : `${fFreq}Hz`}</text>
          </g>
        );
      }

      case 'CRO_SCOPE': {
        const ch1Val = state.internalState?.ch1 ?? 0;
        const ch2Val = state.internalState?.ch2 ?? 0;
        const w = width - 10;
        const h = height - 10;
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={w} height={h} rx={10} fill="#020617" stroke="#38bdf8" strokeWidth={2.5} />
            <text x={w / 2} y={14} textAnchor="middle" fill="#38bdf8" fontSize={9} fontWeight={800}>CRO OSCILLOSCOPE</text>
            {/* Screen area */}
            <rect x={8} y={18} width={w - 16} height={h - 32} rx={4} fill="#050d1a" stroke="#1e3a5f" strokeWidth={1} />
            {/* Grid lines */}
            <line x1={8} y1={18 + (h - 32) / 2} x2={w - 8} y2={18 + (h - 32) / 2} stroke="#1e3a5f" strokeWidth={1} strokeDasharray="4 4" />
            {/* CH1 trace */}
            <line x1={12} y1={ch1Val === 1 ? 24 : 18 + (h - 32) * 0.6} x2={w - 12} y2={ch1Val === 1 ? 24 : 18 + (h - 32) * 0.6} stroke="#38bdf8" strokeWidth={2.5} />
            {/* CH2 trace */}
            <line x1={12} y1={ch2Val === 1 ? 18 + (h - 32) * 0.3 : 18 + (h - 32) * 0.8} x2={w - 12} y2={ch2Val === 1 ? 18 + (h - 32) * 0.3 : 18 + (h - 32) * 0.8} stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" />
            <text x={8 + 4} y={h - 4} fill="#38bdf8" fontSize={7} fontWeight={700}>CH1</text>
            <text x={8 + 24} y={h - 4} fill="#10b981" fontSize={7} fontWeight={700}>CH2</text>
          </g>
        );
      }

      case 'DSO_SCOPE': {
        const ch1Val = state.internalState?.ch1 ?? 0;
        const ch2Val = state.internalState?.ch2 ?? 0;
        const triggered = state.internalState?.triggered ?? false;
        const w = width - 10;
        const h = height - 10;
        return (
          <g transform="translate(5, 5)">
            <rect x={0} y={0} width={w} height={h} rx={10} fill="#020617" stroke="#a78bfa" strokeWidth={2.5} />
            <text x={w / 2} y={14} textAnchor="middle" fill="#a78bfa" fontSize={9} fontWeight={800}>DSO — DIGITAL STORAGE</text>
            {/* Screen */}
            <rect x={8} y={18} width={w - 16} height={h - 36} rx={4} fill="#05031a" stroke="#3b1d80" strokeWidth={1} />
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((frac, i) => (
              <line key={i} x1={8} y1={18 + (h - 36) * frac} x2={w - 8} y2={18 + (h - 36) * frac} stroke="#1e1b40" strokeWidth={1} strokeDasharray="3 3" />
            ))}
            {/* CH1 trace */}
            <path
              d={`M 12,${ch1Val === 1 ? 22 : 18 + (h - 36) * 0.7} L ${w / 2 - 4},${ch1Val === 1 ? 22 : 18 + (h - 36) * 0.7} L ${w / 2 - 4},${ch1Val === 1 ? 18 + (h - 36) * 0.7 : 22} L ${w - 12},${ch1Val === 1 ? 18 + (h - 36) * 0.7 : 22}`}
              fill="none" stroke="#38bdf8" strokeWidth={2}
            />
            {/* CH2 trace */}
            <path
              d={`M 12,${ch2Val === 1 ? 18 + (h - 36) * 0.25 : 18 + (h - 36) * 0.6} L ${w / 2 - 4},${ch2Val === 1 ? 18 + (h - 36) * 0.25 : 18 + (h - 36) * 0.6} L ${w / 2 - 4},${ch2Val === 1 ? 18 + (h - 36) * 0.6 : 18 + (h - 36) * 0.25} L ${w - 12},${ch2Val === 1 ? 18 + (h - 36) * 0.6 : 18 + (h - 36) * 0.25}`}
              fill="none" stroke="#f59e0b" strokeWidth={1.8}
            />
            <text x={8 + 4} y={h - 8} fill="#38bdf8" fontSize={7} fontWeight={700}>CH1</text>
            <text x={8 + 24} y={h - 8} fill="#f59e0b" fontSize={7} fontWeight={700}>CH2</text>
            <text x={w - 8} y={h - 8} textAnchor="end" fill={triggered ? '#10b981' : '#64748b'} fontSize={7} fontWeight={700}>{triggered ? 'TRIG ✓' : 'TRIG --'}</text>
            {/* FFT badge */}
            {state.fftEnabled && (
              <text x={w / 2} y={h - 8} textAnchor="middle" fill="#a78bfa" fontSize={7} fontWeight={700}>FFT ON</text>
            )}
          </g>
        );
      }

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

  const isRacing = !!node.state.isRacing || !!node.state.internalState?.isRacing;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onPointerDown={handleNodePointerDown}
      style={{ cursor: 'move', touchAction: 'none' }}
    >
      {/* Race-Around Alert Badge Overlay */}
      {isRacing && (
        <g transform={`translate(${width / 2 - 60}, -24)`}>
          <rect x={0} y={0} width={120} height={20} rx={6} fill="#ef4444" />
          <text x={60} y={14} textAnchor="middle" fill="#ffffff" fontSize={9} fontWeight={800} className="pulse">
            ⚡ RACE AROUND!
          </text>
        </g>
      )}

      {/* Node Selection Outline */}
      {isSelected && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={10}
          fill="none"
          stroke={isRacing ? '#ef4444' : 'var(--accent-cyan)'}
          strokeWidth={2.5}
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
          fill={isRacing ? '#ef4444' : 'var(--text-secondary)'}
          fontSize={11}
          fontWeight={isRacing ? 800 : 600}
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