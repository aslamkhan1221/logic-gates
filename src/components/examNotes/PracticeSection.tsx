import React, { useState } from 'react';
import { CONVERSION_CATEGORIES, PRACTICE_PROBLEMS_BANK } from '../../data/practiceData';
import { CheckCircle, Layers, Sparkles } from 'lucide-react';

export const PracticeSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<string, boolean | null>>({});
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(0);

  // Filter problems by Category and Chapter
  const filteredProblems = PRACTICE_PROBLEMS_BANK.filter(p => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchChap = selectedChapter === 'all' || p.chapterId === selectedChapter;
    return matchCat && matchChap;
  });

  const handleCheckAnswer = (probId: string, expected: string) => {
    const rawInput = userInputs[probId] || '';
    const cleanInput = rawInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanExpected = expected.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const isCorrect = cleanInput === cleanExpected;
    setCheckedResults(prev => ({ ...prev, [probId]: isCorrect }));

    if (isCorrect && checkedResults[probId] !== true) {
      setScore(prev => prev + 10);
    }
  };

  const handleToggleSolution = (probId: string) => {
    setShowSolutions(prev => ({ ...prev, [probId]: !prev[probId] }));
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 24px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(2, 132, 199, 0.15))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', fontSize: '0.75rem', fontWeight: 900, color: '#34d399', marginBottom: '12px' }}>
            <Sparkles size={14} /> CHAPTER-WISE EXERCISE BANK
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📝 Practice & Exercise Hub
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', lineHeight: 1.6 }}>
            Master number system conversions with 10 worked step-by-step examples for every conversion type (Decimal, Binary, Octal, Hex, BCD, Excess-3, Gray Code).
          </p>
        </div>

        {/* Score Counter */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1.5px solid #10b981',
          borderRadius: '16px',
          padding: '16px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase' }}>Practice Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>{score} pts</div>
        </div>
      </div>

      {/* Chapter Filter Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          📖 Select Syllabus Chapter:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { id: 'all', name: 'All Chapters' },
            { id: 'dt-chap-1-1', name: 'Chap 1.1 Number Systems' },
            { id: 'dt-chap-1-2', name: 'Chap 1.2 Binary Arithmetic' },
            { id: 'dt-chap-1-3', name: 'Chap 1.3 Complements' },
            { id: 'dt-chap-1-4', name: 'Chap 1.4 Digital Codes' },
            { id: 'dt-chap-1-5', name: 'Chap 1.5 BCD Arithmetic' },
          ].map(chap => (
            <button
              key={chap.id}
              onClick={() => setSelectedChapter(chap.id)}
              style={{
                padding: '6px 14px', borderRadius: '10px', border: 'none',
                background: selectedChapter === chap.id ? '#0284c7' : 'rgba(255,255,255,0.06)',
                color: selectedChapter === chap.id ? '#fff' : '#cbd5e1',
                fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
              }}
            >
              {chap.name}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Categories Pill Filter */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} /> Select Conversion Type (10 Examples Each):
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px', borderRadius: '12px', border: 'none',
              background: selectedCategory === 'all' ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: selectedCategory === 'all' ? '#fff' : '#cbd5e1',
              fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
            }}
          >
            All Categories ({PRACTICE_PROBLEMS_BANK.length})
          </button>

          {CONVERSION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px', borderRadius: '12px', border: 'none',
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === cat.id ? '#fff' : '#94a3b8',
                fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {cat.icon} {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredProblems.map((prob, idx) => {
          const result = checkedResults[prob.id];
          const isSolved = showSolutions[prob.id];

          return (
            <div
              key={prob.id}
              style={{
                background: 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.95))',
                border: result === true ? '1.5px solid #10b981' : result === false ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                    {prob.categoryName}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px',
                    background: prob.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : prob.difficulty === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                    color: prob.difficulty === 'Easy' ? '#34d399' : prob.difficulty === 'Medium' ? '#fbbf24' : '#f87171',
                  }}>
                    {prob.difficulty}
                  </span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
                  #{idx + 1}. {prob.problem}
                </div>

                {/* User Input & Check Answer */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    placeholder="Enter answer (e.g. 1101)"
                    value={userInputs[prob.id] || ''}
                    onChange={(e) => setUserInputs(prev => ({ ...prev, [prob.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer(prob.id, prob.expectedAnswer)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleCheckAnswer(prob.id, prob.expectedAnswer)}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                      fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
                    }}
                  >
                    Check
                  </button>
                </div>

                {/* Feedback Result Banner */}
                {result === true && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Correct! +10 Points
                  </div>
                )}
                {result === false && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171', marginBottom: '12px' }}>
                    ❌ Incorrect. Try again or reveal solution below!
                  </div>
                )}
              </div>

              {/* Toggle Solution */}
              <div>
                <button
                  onClick={() => handleToggleSolution(prob.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: isSolved ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                    color: isSolved ? '#fff' : '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {isSolved ? 'Hide Solution' : 'Show Step-by-Step Solution'}
                </button>

                {isSolved && (
                  <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Step-by-Step Solution:
                    </div>
                    <ul style={{ margin: '0 0 8px 0', paddingLeft: '16px', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {prob.solutionSteps.map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                    </ul>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#34d399' }}>
                      Final Answer: {prob.expectedAnswer}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
