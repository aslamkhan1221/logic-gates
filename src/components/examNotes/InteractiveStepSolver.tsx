import React, { useState } from 'react';
import { RotateCcw, ArrowRight, CheckCircle, Calculator } from 'lucide-react';

interface Step {
  stepNum: number;
  calcStr: string;
  note: string;
  resultTag?: string;
}

export const InteractiveStepSolver: React.FC = () => {
  const [solverMode, setSolverMode] = useState<'dec-bin' | 'dec-oct' | 'dec-hex' | 'bin-gray' | 'bcd-add'>('dec-bin');
  const [inputValue, setInputValue] = useState<number>(25);
  const [binInput, setBinInput] = useState<string>('1011');
  const [bcdA, setBcdA] = useState<number>(7);
  const [bcdB, setBcdB] = useState<number>(6);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Mode 1: Decimal -> Binary
  const getDecBinSteps = (val: number): { steps: Step[]; answer: string } => {
    if (isNaN(val) || val <= 0) return { steps: [], answer: '0' };
    const steps: Step[] = [];
    let current = Math.floor(val);
    let rems: number[] = [];
    let num = 1;

    while (current > 0) {
      const q = Math.floor(current / 2);
      const r = current % 2;
      rems.push(r);
      steps.push({
        stepNum: num++,
        calcStr: `${current} ÷ 2 = ${q}`,
        note: `Remainder = ${r}`,
        resultTag: num === 2 ? 'LSB' : undefined,
      });
      current = q;
    }
    const answer = rems.reverse().join('') + '₂';
    return { steps, answer };
  };

  // Mode 2: Decimal -> Octal
  const getDecOctSteps = (val: number): { steps: Step[]; answer: string } => {
    if (isNaN(val) || val <= 0) return { steps: [], answer: '0' };
    const steps: Step[] = [];
    let current = Math.floor(val);
    let rems: number[] = [];
    let num = 1;

    while (current > 0) {
      const q = Math.floor(current / 8);
      const r = current % 8;
      rems.push(r);
      steps.push({
        stepNum: num++,
        calcStr: `${current} ÷ 8 = ${q}`,
        note: `Remainder = ${r}`,
      });
      current = q;
    }
    const answer = rems.reverse().join('') + '₈';
    return { steps, answer };
  };

  // Mode 3: Decimal -> Hexadecimal
  const getDecHexSteps = (val: number): { steps: Step[]; answer: string } => {
    if (isNaN(val) || val <= 0) return { steps: [], answer: '0' };
    const steps: Step[] = [];
    let current = Math.floor(val);
    const hexMap = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    let rems: string[] = [];
    let num = 1;

    while (current > 0) {
      const q = Math.floor(current / 16);
      const r = current % 16;
      rems.push(hexMap[r]);
      steps.push({
        stepNum: num++,
        calcStr: `${current} ÷ 16 = ${q}`,
        note: `Remainder = ${r} (${hexMap[r]})`,
      });
      current = q;
    }
    const answer = rems.reverse().join('') + '₁₆';
    return { steps, answer };
  };

  // Mode 4: Binary -> Gray Code
  const getBinGraySteps = (binStr: string): { steps: Step[]; answer: string } => {
    const clean = binStr.replace(/[^01]/g, '') || '0';
    const steps: Step[] = [];
    const gray: number[] = [];

    // G0 = B0
    gray.push(parseInt(clean[0], 10));
    steps.push({
      stepNum: 1,
      calcStr: `G₀ = B₀ = ${clean[0]}`,
      note: 'MSB of Gray Code is identical to MSB of Binary',
    });

    for (let i = 1; i < clean.length; i++) {
      const bPrev = parseInt(clean[i - 1], 10);
      const bCurr = parseInt(clean[i], 10);
      const gBit = bPrev ^ bCurr;
      gray.push(gBit);
      steps.push({
        stepNum: i + 1,
        calcStr: `G${i} = B${i - 1} ⊕ B${i} = ${bPrev} ⊕ ${bCurr} = ${gBit}`,
        note: 'XOR adjacent binary bits',
      });
    }

    const answer = gray.join('') + '_Gray';
    return { steps, answer };
  };

  // Mode 5: BCD Addition +6 Correction
  const getBcdAddSteps = (a: number, b: number): { steps: Step[]; answer: string } => {
    const sumDec = a + b;
    const binA = (a % 10).toString(2).padStart(4, '0');
    const binB = (b % 10).toString(2).padStart(4, '0');
    const rawSum = (a + b);
    const rawBinSum = rawSum.toString(2).padStart(4, '0');

    const steps: Step[] = [
      {
        stepNum: 1,
        calcStr: `Binary Add: ${binA}₂ (${a}) + ${binB}₂ (${b}) = ${rawBinSum}₂ (${rawSum})`,
        note: 'Standard 4-bit binary addition',
      },
    ];

    if (rawSum > 9) {
      const corrected = rawSum + 6;
      const correctedBin = corrected.toString(2).padStart(8, '0');
      steps.push({
        stepNum: 2,
        calcStr: `Sum ${rawSum} > 9 (Invalid BCD!) → Add +6 (0110₂)`,
        note: `Add 0110₂ correction factor to skip invalid 4-bit states 10 to 15`,
      });
      steps.push({
        stepNum: 3,
        calcStr: `${rawBinSum}₂ + 0110₂ = ${correctedBin}₂`,
        note: `Result split into 4-bit nibbles: ${correctedBin.slice(0, 4)} ${correctedBin.slice(4)}`,
      });
    } else {
      steps.push({
        stepNum: 2,
        calcStr: `Sum ${rawSum} ≤ 9 and No Carry → VALID BCD!`,
        note: 'No +6 correction required',
      });
    }

    const answer = `${sumDec}₁₀ (${(a + b).toString(2).padStart(8, '0')}_BCD)`;
    return { steps, answer };
  };

  let activeData: { steps: Step[]; answer: string };
  if (solverMode === 'dec-bin') activeData = getDecBinSteps(inputValue);
  else if (solverMode === 'dec-oct') activeData = getDecOctSteps(inputValue);
  else if (solverMode === 'dec-hex') activeData = getDecHexSteps(inputValue);
  else if (solverMode === 'bin-gray') activeData = getBinGraySteps(binInput);
  else activeData = getBcdAddSteps(bcdA, bcdB);

  const { steps, answer } = activeData;

  const handleReset = () => {
    setActiveStepIndex(0);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(2, 132, 199, 0.12), rgba(15, 23, 42, 0.95))',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '20px',
      padding: '24px',
      color: '#f8fafc',
      margin: '20px 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} /> Multi-Mode Step-by-Step Interactive Solver
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            Select conversion mode to visualize step-by-step algorithms live!
          </p>
        </div>

        {/* Solver Mode Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { id: 'dec-bin', label: 'Dec → Binary' },
            { id: 'dec-oct', label: 'Dec → Octal' },
            { id: 'dec-hex', label: 'Dec → Hex' },
            { id: 'bin-gray', label: 'Binary → Gray' },
            { id: 'bcd-add', label: 'BCD +6 Add' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setSolverMode(tab.id as any);
                setActiveStepIndex(0);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: solverMode === tab.id ? '#0284c7' : 'rgba(255,255,255,0.06)',
                color: solverMode === tab.id ? '#fff' : '#94a3b8',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-Specific Input Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {['dec-bin', 'dec-oct', 'dec-hex'].includes(solverMode) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1' }}>Decimal Value:</label>
            <input
              type="number"
              min="1"
              max="999"
              value={inputValue}
              onChange={(e) => {
                setInputValue(parseInt(e.target.value, 10) || 1);
                setActiveStepIndex(0);
              }}
              style={{
                width: '90px', padding: '6px 10px', borderRadius: '8px',
                border: '1px solid #38bdf8', background: '#0f172a', color: '#38bdf8',
                fontWeight: 800, fontSize: '0.95rem', textAlign: 'center',
              }}
            />
          </div>
        )}

        {solverMode === 'bin-gray' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1' }}>Binary Bits:</label>
            <input
              type="text"
              value={binInput}
              onChange={(e) => {
                setBinInput(e.target.value.replace(/[^01]/g, ''));
                setActiveStepIndex(0);
              }}
              style={{
                width: '120px', padding: '6px 10px', borderRadius: '8px',
                border: '1px solid #38bdf8', background: '#0f172a', color: '#38bdf8',
                fontWeight: 800, fontSize: '0.95rem', textAlign: 'center',
              }}
            />
          </div>
        )}

        {solverMode === 'bcd-add' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1' }}>BCD A (0-9):</label>
            <input
              type="number" min="0" max="9" value={bcdA}
              onChange={(e) => { setBcdA(parseInt(e.target.value, 10) || 0); setActiveStepIndex(0); }}
              style={{ width: '60px', padding: '6px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#38bdf8', fontWeight: 800, textAlign: 'center' }}
            />
            <span style={{ fontWeight: 900 }}>+</span>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1' }}>BCD B (0-9):</label>
            <input
              type="number" min="0" max="9" value={bcdB}
              onChange={(e) => { setBcdB(parseInt(e.target.value, 10) || 0); setActiveStepIndex(0); }}
              style={{ width: '60px', padding: '6px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#0f172a', color: '#38bdf8', fontWeight: 800, textAlign: 'center' }}
            />
          </div>
        )}

        <button
          onClick={handleReset}
          style={{
            padding: '6px 12px', borderRadius: '8px', border: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700,
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Animated Step Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {steps.slice(0, activeStepIndex + 1).map((s, idx) => {
          const isCurrent = idx === activeStepIndex;
          return (
            <div
              key={s.stepNum}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isCurrent
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(2, 132, 199, 0.15))'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isCurrent ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: isCurrent ? '#38bdf8' : 'rgba(255,255,255,0.1)',
                  color: isCurrent ? '#0f172a' : '#94a3b8',
                  fontWeight: 900, fontSize: '0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {s.stepNum}
                </span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                    {s.calcStr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.note}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Forward Controls & Final Result */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {activeStepIndex < steps.length - 1 && (
            <button
              onClick={() => setActiveStepIndex(prev => prev + 1)}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff',
                fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 4px 14px rgba(56,189,248,0.4)',
              }}
            >
              Step Forward <ArrowRight size={14} />
            </button>
          )}

          <button
            onClick={() => setActiveStepIndex(steps.length - 1)}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            Show All Steps
          </button>
        </div>

        {/* Final Answer Banner */}
        {activeStepIndex === steps.length - 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.15))',
            border: '1px solid #10b981', color: '#34d399', fontWeight: 800, fontSize: '0.9rem',
          }}>
            <CheckCircle size={18} color="#34d399" />
            <span>Result: <strong style={{ color: '#fff', fontSize: '1.05rem', letterSpacing: '0.05em' }}>{answer}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
