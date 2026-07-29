import React, { useState } from 'react';
import type { Topic, Unit } from '../../types/examNotes';
import { SUBJECTS, DIGITAL_TECHNIQUE_UNITS, ANALOG_ELECTRONICS_UNITS, ALL_EXAM_NOTES_UNITS } from '../../data/examNotesData';
import { TopicViewer } from './TopicViewer';
import { AITutorBot } from './AITutorBot';
import { Search, BookOpen, Sparkles, ArrowRight, RefreshCw, CheckCircle, Layers } from 'lucide-react';

interface Props {
  completedTopicIds: string[];
  bookmarkedTopicIds: string[];
  onToggleBookmark: (topicId: string) => void;
  onMarkCompleted: (topicId: string) => void;
  notes: any[];
  onAddNote: (topicId: string, text: string) => void;
}

export const ExamNotesHome: React.FC<Props> = ({
  completedTopicIds,
  bookmarkedTopicIds,
  onToggleBookmark,
  onMarkCompleted,
  notes,
  onAddNote,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<'digital-technique' | 'analog-electronics'>('digital-technique');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'bookmarked' | 'revision'>('all');

  // Active subject's units
  const activeSubject = SUBJECTS.find(s => s.id === selectedSubjectId) || SUBJECTS[0];
  const activeUnits: Unit[] = selectedSubjectId === 'digital-technique' ? DIGITAL_TECHNIQUE_UNITS : ANALOG_ELECTRONICS_UNITS;

  // Flatten all topics across all subjects for global search & lookup
  const allTopics: Topic[] = ALL_EXAM_NOTES_UNITS.flatMap(u => u.chapters.flatMap(c => c.topics));
  const activeSubjectTopics: Topic[] = activeUnits.flatMap(u => u.chapters.flatMap(c => c.topics));

  // Filtered topics based on active subject or search
  const filteredTopics = (searchQuery.trim() !== '' ? allTopics : activeSubjectTopics).filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.badge.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'bookmarked') return matchesSearch && bookmarkedTopicIds.includes(t.id);
    if (filterTab === 'revision') return matchesSearch && !completedTopicIds.includes(t.id);
    return matchesSearch;
  });

  const selectedTopic = allTopics.find(t => t.id === selectedTopicId);

  // If a topic is selected, render TopicViewer
  if (selectedTopic) {
    return (
      <TopicViewer
        topic={selectedTopic}
        onBack={() => setSelectedTopicId(null)}
        isBookmarked={bookmarkedTopicIds.includes(selectedTopic.id)}
        onToggleBookmark={onToggleBookmark}
        isCompleted={completedTopicIds.includes(selectedTopic.id)}
        onMarkCompleted={onMarkCompleted}
        notes={notes}
        onAddNote={onAddNote}
      />
    );
  }

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
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(99, 102, 241, 0.15))',
        border: '1px solid rgba(56, 189, 248, 0.3)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8', marginBottom: '12px' }}>
            <Sparkles size={14} /> VISUAL LEARNING MODE
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📚 Exam Notes ({activeSubject.name})
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', lineHeight: 1.6 }}>
            {activeSubject.description}
          </p>
        </div>

        {/* Search Input & Filter Tabs */}
        <div style={{ width: '320px', maxWidth: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search topics, codes, gates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(15,23,42,0.8)',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'bookmarked', 'revision'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filterTab === tab ? '#0284c7' : 'rgba(255,255,255,0.06)',
                  color: filterTab === tab ? '#fff' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUBJECT SELECTION BAR */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} /> Select Subject for Exam Notes:
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {SUBJECTS.map(subj => {
            const isSelected = selectedSubjectId === subj.id;
            return (
              <div
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id as any)}
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  background: isSelected ? subj.gradient : 'rgba(30,41,59,0.7)',
                  border: isSelected ? `2px solid ${subj.color}` : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? `0 10px 30px ${subj.color}40` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', flexShrink: 0,
                }}>
                  {subj.icon}
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? '#fff' : '#94a3b8' }}>
                    {subj.code} · {subj.badge}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
                    {subj.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Revision Generator Bar */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RefreshCw size={18} color="#f59e0b" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Smart Revision Generator ({activeSubject.name}):</span>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Recommended topics for today</span>
        </div>
        <button
          onClick={() => {
            const uncompleted = activeSubjectTopics.filter(t => !completedTopicIds.includes(t.id));
            const pick = uncompleted[0] || activeSubjectTopics[0];
            if (pick) setSelectedTopicId(pick.id);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#fff',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Start Today's Revision →
        </button>
      </div>

      {/* SEARCH RESULTS VIEW (if search input exists) */}
      {searchQuery.trim() !== '' ? (
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>Search Results ({filteredTopics.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredTopics.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                style={{
                  background: 'rgba(30,41,59,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>{t.badge}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>{t.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>{t.description}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* HOMEPAGE UNIT CARDS FOR ACTIVE SUBJECT */
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={22} color={activeSubject.color} /> {activeSubject.name} Curriculum Units
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {activeUnits.map(unit => {
              const unitTopics = unit.chapters.flatMap(c => c.topics);
              const completedCount = unitTopics.filter(t => completedTopicIds.includes(t.id)).length;
              const progressPercent = Math.round((completedCount / (unitTopics.length || 1)) * 100);

              return (
                <div
                  key={unit.id}
                  style={{
                    background: 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.95))',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Floating Icon */}
                  <div style={{
                    position: 'absolute', top: '24px', right: '24px',
                    fontSize: '2.5rem', opacity: 0.85,
                  }}>
                    {unit.icon}
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {unit.unitNumber}
                  </div>

                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                    {unit.title}
                  </h3>

                  <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {unit.subtitle}
                  </p>

                  {/* Progress Indicator */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                      <span>{unitTopics.length} Topics</span>
                      <span>Progress {progressPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: unit.colorGradient, transition: 'width 0.4s' }} />
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1' }}>
                      ⏱️ ~45 mins total
                    </span>
                    <span style={{ padding: '3px 10px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', fontSize: '0.72rem', fontWeight: 800, color: '#34d399' }}>
                      ⭐ High Weightage
                    </span>
                  </div>

                  {/* Chapters List Accordion */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {unit.chapters.map(chap => (
                      <div key={chap.id} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                          {chap.title}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {chap.topics.map(t => (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTopicId(t.id)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                width: '100%', padding: '6px 10px', borderRadius: '8px', border: 'none',
                                background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontSize: '0.78rem',
                                fontWeight: 700, textAlign: 'left', cursor: 'pointer',
                              }}
                            >
                              <span>{t.title}</span>
                              {completedTopicIds.includes(t.id) && <CheckCircle size={14} color="#34d399" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Start Learning Button */}
                  <button
                    onClick={() => setSelectedTopicId(unit.chapters[0].topics[0].id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: unit.colorGradient,
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(2,132,199,0.4)',
                    }}
                  >
                    Start Learning {unit.unitNumber} <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating AI Electronics Tutor Assistant Bot */}
      <AITutorBot />
    </div>
  );
};
