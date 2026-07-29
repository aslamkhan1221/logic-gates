import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Zap } from 'lucide-react';

interface Props {
  initialGate?: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
}

export const GateSandboxCard: React.FC<Props> = ({ initialGate = 'AND' }) => {
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'>(initialGate);
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  const calculateOutput = (gate: string, a: number, b: number): number => {
    switch (gate) {
      case 'AND': return (a && b) ? 1 : 0;
      case 'OR': return (a || b) ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      case 'XOR': return (a !== b) ? 1 : 0;
      case 'XNOR': return (a === b) ? 1 : 0;
      default: return 0;
    }
  };

  const output = calculateOutput(selectedGate, inputA, inputB);
  const isSingleInput = selectedGate === 'NOT';

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.12), rgba(15, 23, 42, 0.95))',
      border: '1px solid rgba(99, 102, 241, 0.35)',
      borderRadius: '20px',
      padding: '24px',
      color: '#f8fafc',
      margin: '20px 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>⚡ Interactive Gate Switch Sandbox</h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Toggle inputs A & B to see current flow and LED output response</p>
          </div>
        </div>

        {/* Gate Selector Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as const).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGate(g)}
              style={{
                padding: '5px 12px',
                borderRadius: '8px',
                border: 'none',
                background: selectedGate === g ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.06)',
                color: selectedGate === g ? '#fff' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedGate === g ? '0 2px 10px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Inputs Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Input A Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#94a3b8' }}>Input A:</span>
            <button
              onClick={() => setInputA(inputA === 1 ? 0 : 1)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid ' + (inputA ? '#10b981' : '#64748b'),
                background: inputA ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                color: inputA ? '#34d399' : '#94a3b8',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {inputA ? <ToggleRight color="#34d399" size={18} /> : <ToggleLeft color="#94a3b8" size={18} />}
              {inputA ? 'HIGH (1)' : 'LOW (0)'}
            </button>
          </div>

          {/* Input B Switch (if dual input) */}
          {!isSingleInput && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#94a3b8' }}>Input B:</span>
              <button
                onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '10px',
                  border: '1px solid ' + (inputB ? '#10b981' : '#64748b'),
                  background: inputB ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                  color: inputB ? '#34d399' : '#94a3b8',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {inputB ? <ToggleRight color="#34d399" size={18} /> : <ToggleLeft color="#94a3b8" size={18} />}
                {inputB ? 'HIGH (1)' : 'LOW (0)'}
              </button>
            </div>
          )}
        </div>

        {/* Center SVG Gate Representation */}
        <div style={{ position: 'relative', width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="120" height="80" viewBox="0 0 120 80">
            {/* Input wires */}
            <line x1="10" y1="25" x2="40" y2="25" stroke={inputA ? '#10b981' : '#475569'} strokeWidth="4" strokeDasharray={inputA ? '4 2' : 'none'} />
            {!isSingleInput && (
              <line x1="10" y1="55" x2="40" y2="55" stroke={inputB ? '#10b981' : '#475569'} strokeWidth="4" strokeDasharray={inputB ? '4 2' : 'none'} />
            )}

            {/* Gate Body Shape */}
            <rect x="40" y="15" width="50" height="50" rx="8" fill="url(#gateGrad)" stroke="#6366f1" strokeWidth="2" />
            <text x="65" y="45" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="13">{selectedGate}</text>

            {/* Output wire */}
            <line x1="90" y1="40" x2="115" y2="40" stroke={output ? '#f59e0b' : '#475569'} strokeWidth="4" strokeDasharray={output ? '4 2' : 'none'} />

            <defs>
              <linearGradient id="gateGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Output LED Status */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Output LED</span>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: output
              ? 'radial-gradient(circle, #fde047 0%, #eab308 60%, #ca8a04 100%)'
              : '#334155',
            boxShadow: output ? '0 0 25px #fde047, 0 0 50px rgba(253,224,71,0.6)' : 'none',
            border: output ? '2px solid #fef08a' : '2px solid #475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}>
            <Zap size={22} color={output ? '#000' : '#64748b'} />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: output ? '#fde047' : '#64748b' }}>
            {output ? 'HIGH (1)' : 'LOW (0)'}
          </span>
        </div>
      </div>
    </div>
  );
};
