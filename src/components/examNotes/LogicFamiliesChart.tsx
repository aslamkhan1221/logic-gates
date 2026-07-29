import React, { useState } from 'react';
import type { LogicFamilySpec } from '../../types/examNotes';
import { Zap, ShieldAlert, Cpu, Gauge, Radio, Layers } from 'lucide-react';

interface Props {
  families: LogicFamilySpec[];
}

export const LogicFamiliesChart: React.FC<Props> = ({ families }) => {
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(0);
  const active = families[selectedFamilyIndex];

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.9))',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: '#f8fafc',
      margin: '20px 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Cpu size={20} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>⚡ Logic Families Animated Visualizer</h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>Interactive hardware parameters, specs comparison & trade-offs</p>
          </div>
        </div>

        {/* Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {families.map((fam, idx) => (
            <button
              key={fam.name}
              onClick={() => setSelectedFamilyIndex(idx)}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                border: 'none',
                background: selectedFamilyIndex === idx ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: selectedFamilyIndex === idx ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedFamilyIndex === idx ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
              }}
            >
              {fam.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Key Specs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Gauge size={12} color="#38bdf8" /> Noise Margin
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>{active.noiseMargin}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={12} color="#f59e0b" /> Power Dissipation
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>{active.powerDissipation}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Radio size={12} color="#a855f7" /> Prop Delay (Speed)
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>{active.propagationDelay}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={12} color="#10b981" /> Fan-Out
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>{active.fanOut}</div>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '10px 14px' }}>Parameter</th>
              {families.map(f => (
                <th key={f.name} style={{ padding: '10px 14px', color: f.name === active.name ? '#6366f1' : '#cbd5e1', fontWeight: 800 }}>{f.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>Noise Margin</td>
              {families.map(f => <td key={f.name} style={{ padding: '10px 14px' }}>{f.noiseMargin}</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>Power / Gate</td>
              {families.map(f => <td key={f.name} style={{ padding: '10px 14px' }}>{f.powerPerGate}</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>Prop Delay</td>
              {families.map(f => <td key={f.name} style={{ padding: '10px 14px' }}>{f.propagationDelay}</td>)}
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>Fan Out</td>
              {families.map(f => <td key={f.name} style={{ padding: '10px 14px' }}>{f.fanOut}</td>)}
            </tr>
            <tr>
              <td style={{ padding: '10px 14px', fontWeight: 700, color: '#94a3b8' }}>Supply Voltage</td>
              {families.map(f => <td key={f.name} style={{ padding: '10px 14px' }}>{f.supplyVoltage}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Advantages & Disadvantages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '14px' }}>
          <div style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✓ Key Advantages ({active.name})
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {active.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
          </ul>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '14px', padding: '14px' }}>
          <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} /> Disadvantages & Limitations
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {active.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
