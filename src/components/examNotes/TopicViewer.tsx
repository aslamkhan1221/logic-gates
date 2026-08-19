import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Topic, UserNote } from '../../types/examNotes';
import { InteractiveStepSolver } from './InteractiveStepSolver';
import { GateSandboxCard } from './GateSandboxCard';
import { LogicFamiliesChart } from './LogicFamiliesChart';
import { AnalogCircuitDiagram } from './AnalogCircuitDiagram';
import { AITutorBot } from './AITutorBot';
import {
  Volume2, VolumeX, Bookmark, Printer,
  ArrowLeft, Lightbulb, AlertTriangle, Star,
  Sparkles, StickyNote, Award, X
} from 'lucide-react';

interface Props {
  topic: Topic;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (topicId: string) => void;
  isCompleted: boolean;
  onMarkCompleted: (topicId: string) => void;
  notes: UserNote[];
  onAddNote: (topicId: string, text: string) => void;
}

export const TopicViewer: React.FC<Props> = ({
  topic,
  onBack,
  isBookmarked,
  onToggleBookmark,
  isCompleted,
  onMarkCompleted,
  notes,
  onAddNote,
}) => {
  // Voice Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Flashcards flipped state
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Practice problem answer toggles
  const [showSolutions, setShowSolutions] = useState<Record<string, boolean>>({});

  // Sticky Notes drawer state
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState<boolean>(false);
  const [newNoteText, setNewNoteText] = useState<string>('');

  // Micro Quiz Modal state
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Truth table active row hover
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  // Handle Speech Synthesis
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [topic.id]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${topic.title}. ${topic.conceptSummary}. Key exam points: ${topic.importantExamPoints.definitions.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFlipCard = (cardId: string) => {
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleToggleSolution = (probId: string) => {
    setShowSolutions(prev => ({ ...prev, [probId]: !prev[probId] }));
  };

  const handleAddStickyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(topic.id, newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleQuizOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (!quizSubmitted) {
      setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    topic.microQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 4) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onMarkCompleted(topic.id);
    }
  };

  const topicNotes = notes.filter(n => n.topicId === topic.id);

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px',
      color: 'var(--text, #f8fafc)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)',
            color: '#cbd5e1',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Back to Exam Notes
        </button>

        {/* Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={toggleSpeech}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid ' + (isSpeaking ? '#38bdf8' : 'rgba(255,255,255,0.15)'),
              background: isSpeaking ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.06)',
              color: isSpeaking ? '#38bdf8' : '#cbd5e1',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {isSpeaking ? 'Stop Reading' : 'Voice Read'}
          </button>

          <button
            onClick={() => onToggleBookmark(topic.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid ' + (isBookmarked ? '#f59e0b' : 'rgba(255,255,255,0.15)'),
              background: isBookmarked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)',
              color: isBookmarked ? '#f59e0b' : '#cbd5e1',
              fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            <Bookmark size={16} fill={isBookmarked ? '#f59e0b' : 'none'} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          <button
            onClick={() => setIsNotesDrawerOpen(!isNotesDrawerOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            <StickyNote size={16} color="#fbbf24" />
            Sticky Notes ({topicNotes.length})
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#cbd5e1', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            <Printer size={16} /> Print / Export PDF
          </button>

          <button
            onClick={() => setIsQuizOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
            }}
          >
            <Award size={18} /> Take Micro-Quiz
          </button>
        </div>
      </div>

      {/* Topic Title Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{
            padding: '4px 12px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            fontSize: '0.72rem', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            {topic.badge}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>⏱️ {topic.estimatedTime}</span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 800, padding: '2px 10px', borderRadius: '10px',
            background: topic.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : topic.difficulty === 'Medium' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
            color: topic.difficulty === 'Easy' ? '#34d399' : topic.difficulty === 'Medium' ? '#fbbf24' : '#f87171',
          }}>
            {topic.difficulty}
          </span>
          {isCompleted && (
            <span style={{ padding: '2px 10px', borderRadius: '10px', background: 'rgba(16,185,129,0.25)', border: '1px solid #10b981', color: '#34d399', fontSize: '0.75rem', fontWeight: 900 }}>
              ✓ Completed
            </span>
          )}
        </div>

        <h1 style={{ margin: '0 0 12px 0', fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {topic.title}
        </h1>
        <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          {topic.description}
        </p>
      </div>

      {/* REQUIREMENT 1: Concept Card */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(56,189,248,0.1), rgba(15,23,42,0.9))',
        border: '1px solid rgba(56,189,248,0.3)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles color="#38bdf8" size={20} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>1. Concept Card</h3>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
          {topic.conceptSummary}
        </p>
      </div>

      {/* REQUIREMENT 2: Animated Diagram Steps / Flow */}
      {topic.diagramSteps && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>
            2. Animated Diagram & Flow Breakdown
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {topic.diagramSteps.map((step, idx) => (
              <div key={idx} style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '16px',
                padding: '16px',
                position: 'relative',
              }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#a855f7', textTransform: 'uppercase', marginBottom: '6px' }}>
                  STEP 0{idx + 1}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{step.description}</div>
                {step.subtext && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', fontStyle: 'italic' }}>{step.subtext}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUIREMENT 3: Step-by-Step Visualization Solver */}
      {topic.chapterId === 'chap-1-1' && <InteractiveStepSolver />}

      {/* REQUIREMENT 9: Interactive Gate Animation Sandbox */}
      {(topic.interactiveGate || topic.chapterId === 'chap-2-2') && (
        <GateSandboxCard initialGate={topic.interactiveGate || 'AND'} />
      )}

      {/* Logic Families Comparison Chart */}
      {topic.logicFamiliesData && <LogicFamiliesChart families={topic.logicFamiliesData} />}

      {/* Analog Circuit Diagram & Visual Schematic */}
      {topic.analogDiagramType && (
        <AnalogCircuitDiagram
          type={topic.analogDiagramType}
          title={`${topic.title} Circuit Schematic & Diagram`}
        />
      )}

      {/* REQUIREMENT 4: Memory Tricks */}
      {topic.memoryTricks.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          {topic.memoryTricks.map((trick, idx) => (
            <div key={idx} style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(15,23,42,0.9))',
              border: '1px solid #f59e0b',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 900, fontSize: '1.1rem', marginBottom: '10px' }}>
                <Lightbulb size={22} color="#fbbf24" /> 4. {trick.title}
              </div>
              <div style={{ fontSize: '0.92rem', color: '#fef08a', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 700 }}>
                {trick.content}
              </div>
              {trick.mnemonics && (
                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {trick.mnemonics.map((m, i) => (
                    <span key={i} style={{ padding: '4px 12px', borderRadius: '12px', background: 'rgba(245,158,11,0.25)', border: '1px solid #f59e0b', color: '#fff', fontSize: '0.78rem', fontWeight: 800 }}>
                      ⚡ {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REQUIREMENT 5: Real Life Examples */}
      {topic.realLifeExamples.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
            5. Real Life Applications & Engineering Use-Cases
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {topic.realLifeExamples.map((ex, i) => (
              <div key={i} style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '16px',
                padding: '18px',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{ex.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>{ex.title}</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>{ex.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REQUIREMENT 6: Interactive 3D Flip Flashcards */}
      {topic.flashcards.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800, color: '#ec4899' }}>
            6. Interactive 3D Flash Cards (Click to Flip 🔄)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {topic.flashcards.map(fc => {
              const isFlipped = flippedCards[fc.id];
              return (
                <div
                  key={fc.id}
                  onClick={() => handleFlipCard(fc.id)}
                  style={{
                    height: '140px',
                    perspective: '1000px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    padding: '20px',
                    background: isFlipped ? 'linear-gradient(135deg, #831843, #ec4899)' : 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: isFlipped ? '1.5px solid #f472b6' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.4s ease',
                    boxShadow: isFlipped ? '0 10px 25px rgba(236,72,153,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
                  }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: isFlipped ? '#fbcfe8' : '#94a3b8', marginBottom: '6px' }}>
                      {isFlipped ? 'ANSWER (BACK)' : 'QUESTION (CLICK TO FLIP)'}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>
                      {isFlipped ? fc.back : fc.front}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REQUIREMENT 8: Animated Truth Table */}
      {topic.truthTable && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
            8. Animated Truth Table (Hover Row to Highlight)
          </h3>
          <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                  {topic.truthTable.inputs.map((inp, idx) => (
                    <th key={idx} style={{ padding: '12px' }}>{inp}</th>
                  ))}
                  <th style={{ padding: '12px', color: '#38bdf8', fontWeight: 900 }}>{topic.truthTable.output}</th>
                </tr>
              </thead>
              <tbody>
                {topic.truthTable.rows.map((row, rIdx) => {
                  const isHovered = hoveredRowIndex === rIdx;
                  return (
                    <tr
                      key={rIdx}
                      onMouseEnter={() => setHoveredRowIndex(rIdx)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      style={{
                        background: isHovered ? 'rgba(56,189,248,0.2)' : rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      {row.inputs.map((val, cIdx) => (
                        <td key={cIdx} style={{ padding: '10px', fontWeight: 700 }}>{val}</td>
                      ))}
                      <td style={{ padding: '10px', fontWeight: 900, color: row.output ? '#34d399' : '#f87171' }}>
                        {row.output} {row.label ? `(${row.label})` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REQUIREMENT 10: Important Exam Points ⭐ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(15,23,42,0.95))',
        border: '1.5px solid #6366f1',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 900, fontSize: '1.2rem', marginBottom: '16px' }}>
          <Star fill="#818cf8" size={20} /> 10. ⭐ Important for Exam
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 800, color: '#c7d2fe', fontSize: '0.85rem', marginBottom: '6px' }}>📖 Definitions</div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#e0e7ff', lineHeight: 1.6 }}>
              {topic.importantExamPoints.definitions.map((def, i) => <li key={i}>{def}</li>)}
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#c7d2fe', fontSize: '0.85rem', marginBottom: '6px' }}>📐 Formulas & Rules</div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: '#e0e7ff', lineHeight: 1.6 }}>
              {topic.importantExamPoints.formulas.concat(topic.importantExamPoints.theoremsRules).map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 11: Common Mistakes ❌ */}
      {topic.commonMistakes.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1.5px solid #ef4444',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 900, fontSize: '1.1rem', marginBottom: '12px' }}>
            <AlertTriangle size={22} color="#f87171" /> 11. ❌ Common Student Exam Mistakes
          </div>
          {topic.commonMistakes.map((m, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ color: '#fca5a5', fontWeight: 800, fontSize: '0.88rem' }}>❌ Wrong: {m.wrong}</div>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '0.88rem', marginTop: '2px' }}>✓ Correct: {m.correct}</div>
              <div style={{ color: '#cbd5e1', fontSize: '0.8rem', marginTop: '4px' }}>💡 Reason: {m.explanation}</div>
            </div>
          ))}
        </div>
      )}

      {/* REQUIREMENT 12: Quick Revision Box */}
      <div style={{
        background: 'rgba(16,185,129,0.1)',
        border: '1px solid #10b981',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '28px',
      }}>
        <div style={{ color: '#34d399', fontWeight: 900, fontSize: '1.1rem', marginBottom: '8px' }}>
          ⚡ 12. Quick 1-Minute Revision Box
        </div>
        <p style={{ fontSize: '0.9rem', color: '#ecfdf5', fontWeight: 700, margin: '0 0 10px 0' }}>
          {topic.quickRevision.keyTakeaway}
        </p>
        <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: '#a7f3d0', lineHeight: 1.6 }}>
          {topic.quickRevision.bulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
        </ul>
      </div>

      {/* REQUIREMENT 13: Practice Solved Example & Try Yourself */}
      {topic.practiceProblems.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
            13. Practice Example & Try Yourself
          </h3>
          {topic.practiceProblems.map(p => (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '14px',
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '10px' }}>
                ✏️ Problem: {p.problem}
              </div>
              <button
                onClick={() => handleToggleSolution(p.id)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none',
                  background: showSolutions[p.id] ? 'rgba(255,255,255,0.15)' : '#f59e0b',
                  color: showSolutions[p.id] ? '#fff' : '#000',
                  fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer',
                }}
              >
                {showSolutions[p.id] ? 'Hide Answer' : 'Show Answer & Steps'}
              </button>

              {showSolutions[p.id] && (
                <div style={{ marginTop: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '6px' }}>Step-by-Step Solution:</div>
                  <ul style={{ margin: '0 0 10px 0', paddingLeft: '18px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {p.solutionSteps.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                  <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.9rem' }}>Final Answer: {p.finalAnswer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REQUIREMENT 14: Animated Summary */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(2,132,199,0.2), rgba(15,23,42,0.95))',
        border: '1.5px solid #0284c7',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>
          🏁 14. Animated Summary & Topic Flow
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 900 }}>CONCEPT</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>{topic.animatedSummary.concept}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: '#a855f7', fontWeight: 900 }}>RULE</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>{topic.animatedSummary.rule}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 900 }}>EXAMPLE</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>{topic.animatedSummary.example}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '0.68rem', color: '#f59e0b', fontWeight: 900 }}>EXAM TIP</div>
            <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>{topic.animatedSummary.examTip}</div>
          </div>
        </div>
      </div>

      {/* Sticky Notes Overlay Drawer */}
      {isNotesDrawerOpen && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '360px', maxWidth: '90vw',
          background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.15)', zIndex: 999,
          padding: '24px', boxShadow: '-10px 0 30px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StickyNote size={20} /> Personal Sticky Notes
            </h3>
            <button onClick={() => setIsNotesDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddStickyNote} style={{ marginBottom: '20px' }}>
            <textarea
              rows={3}
              placeholder="Write a personal study note..."
              value={newNoteText}
              onChange={e => setNewNoteText(e.target.value)}
              style={{
                width: '100%', padding: '10px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)',
                color: '#fff', fontSize: '0.82rem', resize: 'vertical', marginBottom: '8px',
              }}
            />
            <button type="submit" style={{
              width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
              background: '#f59e0b', color: '#000', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer',
            }}>
              + Add Note
            </button>
          </form>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topicNotes.map(n => (
              <div key={n.id} style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid #f59e0b', borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '0.82rem', color: '#fef08a', whiteSpace: 'pre-wrap' }}>{n.text}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '6px', textAlign: 'right' }}>{n.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Micro Quiz Modal */}
      {isQuizOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        }}>
          <div style={{
            width: '600px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto',
            background: '#0f172a', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '24px',
            padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 900, fontSize: '1.2rem' }}>
                <Award size={24} /> Topic Micro-Quiz (5 MCQs)
              </div>
              <button onClick={() => setIsQuizOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {topic.microQuiz.map((q, qIdx) => (
              <div key={q.id} style={{ marginBottom: '20px', padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>
                  Q{qIdx + 1}. {q.question}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctAnswer === oIdx;
                    let bg = 'rgba(255,255,255,0.06)';
                    let border = '1px solid rgba(255,255,255,0.1)';

                    if (quizSubmitted) {
                      if (isCorrect) { bg = 'rgba(16,185,129,0.25)'; border = '1.5px solid #10b981'; }
                      else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.25)'; border = '1.5px solid #ef4444'; }
                    } else if (isSelected) {
                      bg = 'rgba(56,189,248,0.2)'; border = '1.5px solid #38bdf8';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizOptionSelect(qIdx, oIdx)}
                        style={{
                          padding: '10px 14px', borderRadius: '10px', background: bg, border,
                          color: '#fff', fontWeight: 700, fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                    💡 Explanation: {q.explanation}
                  </div>
                )}
              </div>
            ))}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
                  fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                }}
              >
                Submit Quiz Answers
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16,185,129,0.15)', borderRadius: '16px', border: '1px solid #10b981' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>
                  Score: {quizScore} / {topic.microQuiz.length}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>
                  {quizScore >= 4 ? '🎉 Excellent! Topic marked as completed!' : 'Keep practicing to get 4+ marks!'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating AI Electronics Tutor Assistant Bot */}
      <AITutorBot />
    </div>
  );
};
