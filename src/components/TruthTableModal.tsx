import React, { useState } from 'react';
import type { CircuitNode } from '../types/logic';
import { generateTruthTableForNode, type TruthTableData } from '../engine/TruthTable';
import { COMPONENT_METADATA } from '../engine/GateLogic';
import { Table, X, Zap, Code } from 'lucide-react';

interface TruthTableModalProps {
  nodes: CircuitNode[];
  selectedNodeId: string | null;
  onClose: () => void;
}

export const TruthTableModal: React.FC<TruthTableModalProps> = ({ nodes, selectedNodeId, onClose }) => {
  const gates = nodes.filter((n) => n.type !== 'TEXT_NOTE');
  const defaultId = selectedNodeId && gates.some((g) => g.id === selectedNodeId) ? selectedNodeId : gates[0]?.id || '';
  const [activeNodeId, setActiveNodeId] = useState<string>(defaultId);

  const currentNode = gates.find((g) => g.id === activeNodeId);
  const tableData: TruthTableData | null = currentNode ? generateTruthTableForNode(currentNode) : null;
  const meta = currentNode ? COMPONENT_METADATA.find((m) => m.type === currentNode.type) : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '85vh',
          borderRadius: '16px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
              <Table size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Real-Time Truth Table (Inputs vs Output)
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Live evaluation matrix for selected gate component
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Gate Selector Dropdown & Boolean Expression Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Select Component
            </label>
            <select
              value={activeNodeId}
              onChange={(e) => setActiveNodeId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {gates.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label} ({g.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Boolean Algebra Formula
            </label>
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={14} />
              <span>{tableData?.expression || 'Y = f(Inputs)'}</span>
            </div>
          </div>
        </div>

        {/* Gate Description Banner */}
        {meta && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 <strong style={{ color: 'var(--text-primary)' }}>{meta.label}:</strong> {meta.description}
          </div>
        )}

        {/* Truth Table Display (INPUTS vs OUTPUT) */}
        {tableData ? (
          <div style={{ flex: 1, overflowY: 'auto', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
              <thead>
                {/* Super Header: INPUTS vs OUTPUT */}
                <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
                  <th colSpan={tableData.inputNames.length || 1} style={{ padding: '6px', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: '2px solid var(--border-color)' }}>
                    ─── INPUTS ───
                  </th>
                  <th colSpan={tableData.outputNames.length || 1} style={{ padding: '6px', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', borderRight: '2px solid var(--border-color)' }}>
                    ─── OUTPUT ───
                  </th>
                  <th style={{ padding: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                    STATE
                  </th>
                </tr>
                {/* Sub Header: Individual Port Names */}
                <tr style={{ background: 'var(--bg-card)', borderBottom: '2px solid var(--border-color)' }}>
                  {tableData.inputNames.map((name, i) => (
                    <th key={`in_${i}`} style={{ padding: '8px 12px', color: 'var(--text-primary)', fontWeight: 600, borderRight: i === tableData.inputNames.length - 1 ? '2px solid var(--border-color)' : '1px solid var(--border-color)' }}>
                      {name}
                    </th>
                  ))}
                  {tableData.outputNames.map((name, i) => (
                    <th key={`out_${i}`} style={{ padding: '8px 12px', color: 'var(--accent-emerald)', fontWeight: 700, borderRight: i === tableData.outputNames.length - 1 ? '2px solid var(--border-color)' : '1px solid var(--border-color)' }}>
                      {name}
                    </th>
                  ))}
                  <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Live Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    style={{
                      background: row.isActive ? 'rgba(56, 189, 248, 0.2)' : rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'all 0.15s ease',
                      fontWeight: row.isActive ? 700 : 400,
                    }}
                  >
                    {/* Input Values */}
                    {row.inputs.map((inVal, i) => (
                      <td
                        key={`val_in_${i}`}
                        style={{
                          padding: '10px 14px',
                          borderRight: i === row.inputs.length - 1 ? '2px solid var(--border-color)' : '1px solid var(--border-color)',
                          color: inVal.value === 1 ? 'var(--signal-high)' : 'var(--text-muted)',
                        }}
                      >
                        {inVal.value}
                      </td>
                    ))}

                    {/* Output Values */}
                    {row.outputs.map((outVal, i) => (
                      <td
                        key={`val_out_${i}`}
                        style={{
                          padding: '10px 14px',
                          borderRight: i === row.outputs.length - 1 ? '2px solid var(--border-color)' : '1px solid var(--border-color)',
                          color: outVal.value === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                        }}
                      >
                        {outVal.value}
                      </td>
                    ))}

                    {/* Active State Badge */}
                    <td style={{ padding: '10px 14px' }}>
                      {row.isActive ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '12px', background: 'var(--accent-cyan)', color: '#0f172a', fontSize: '0.72rem', fontWeight: 700, boxShadow: '0 0 10px rgba(56,189,248,0.5)' }}>
                          <Zap size={12} fill="#0f172a" /> Active State
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No components available on canvas to generate a truth table.
          </div>
        )}
      </div>
    </div>
  );
};
