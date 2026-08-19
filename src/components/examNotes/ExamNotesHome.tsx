import React, { useState, useEffect } from 'react';
import type { Topic, Unit, Subject } from '../../types/examNotes';
import { SUBJECTS as DEFAULT_SUBJECTS, DIGITAL_TECHNIQUE_UNITS, ANALOG_ELECTRONICS_UNITS, ALL_EXAM_NOTES_UNITS } from '../../data/examNotesData';
import { getAllSubjects, addCustomSubject } from '../../utils/subjectStorage';
import { TopicViewer } from './TopicViewer';
import { AITutorBot } from './AITutorBot';
import { UploadedNotesManager } from './UploadedNotesManager';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Layers,
  FolderUp,
  ArrowLeft,
  Plus,
  Check,
  FileText
} from 'lucide-react';

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
  // Available subjects (default + custom from localStorage)
  const [allSubjectsList, setAllSubjectsList] = useState<Subject[]>(() => getAllSubjects());

  // Currently opened subject (null = viewing Subject List Hub)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Selected topic inside an active subject
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'bookmarked' | 'revision' | 'uploaded-notes'>('all');

  // New subject creator modal/form state
  const [isCreatingSubject, setIsCreatingSubject] = useState<boolean>(false);
  const [newSubjName, setNewSubjName] = useState<string>('');
  const [newSubjCode, setNewSubjCode] = useState<string>('');

  const refreshSubjectList = () => {
    setAllSubjectsList(getAllSubjects());
  };

  const handleCreateNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;
    const created = addCustomSubject(newSubjName.trim(), newSubjCode.trim());
    refreshSubjectList();
    setNewSubjName('');
    setNewSubjCode('');
    setIsCreatingSubject(false);
    // Auto-select newly created subject
    setSelectedSubjectId(created.id);
  };

  // Find active subject details
  const activeSubject = allSubjectsList.find((s) => s.id === selectedSubjectId);

  // Determine active units
  let activeUnits: Unit[] = [];
  if (selectedSubjectId === 'digital-technique') {
    activeUnits = DIGITAL_TECHNIQUE_UNITS;
  } else if (selectedSubjectId === 'analog-electronics') {
    activeUnits = ANALOG_ELECTRONICS_UNITS;
  } else if (activeSubject) {
    activeUnits = activeSubject.units || [];
  }

  // Flatten topics across all units
  const allTopics: Topic[] = ALL_EXAM_NOTES_UNITS.flatMap((u) => u.chapters.flatMap((c) => c.topics));
  const activeSubjectTopics: Topic[] = activeUnits.flatMap((u) => u.chapters.flatMap((c) => c.topics));

  // Filtered topics
  const filteredTopics = (searchQuery.trim() !== '' ? allTopics : activeSubjectTopics).filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.badge.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'bookmarked') return matchesSearch && bookmarkedTopicIds.includes(t.id);
    if (filterTab === 'revision') return matchesSearch && !completedTopicIds.includes(t.id);
    return matchesSearch;
  });

  const selectedTopic = allTopics.find((t) => t.id === selectedTopicId);

  // 1. TOPIC VIEW (If a topic is clicked inside a subject)
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

  // 2. SUBJECT SELECTION HUB VIEW (Initial view when no subject is selected)
  if (!selectedSubjectId) {
    return (
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '28px 24px',
          color: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Hub Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(99, 102, 241, 0.15))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                fontSize: '0.75rem',
                fontWeight: 900,
                color: '#38bdf8',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={14} /> SUBJECT EXAM NOTES HUB
            </div>
            <h1
              style={{
                margin: '0 0 8px 0',
                fontSize: '2.4rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              📚 Select Subject for Exam Notes
            </h1>
            <p style={{ margin: 0, fontSize: '0.98rem', color: '#94a3b8', maxWidth: '650px', lineHeight: 1.6 }}>
              Click on any subject below to open detailed exam notes, circuit schematics, derivations, and practice questions, or add custom subjects.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingSubject(!isCreatingSubject)}
            style={{
              padding: '12px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 900,
              cursor: 'pointer',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
            }}
          >
            <Plus size={18} /> Create New Subject
          </button>
        </div>

        {/* CREATE NEW SUBJECT FORM */}
        {isCreatingSubject && (
          <form
            onSubmit={handleCreateNewSubject}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #10b981',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 10px 30px rgba(16,185,129,0.2)',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#6ee7b7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} /> Add New Subject to Exam Notes
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                  Subject Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Microcontrollers, Control Systems, Power Electronics..."
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: '#0f172a',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                  Subject Code (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. MIC-401"
                  value={newSubjCode}
                  onChange={(e) => setNewSubjCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: '#0f172a',
                    color: '#fff',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} /> Save & Select Subject
              </button>

              <button
                type="button"
                onClick={() => setIsCreatingSubject(false)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* LIST OF SUBJECTS GRID */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={18} /> Available Subjects List ({allSubjectsList.length}):
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {allSubjectsList.map((subj) => {
              const unitCount = subj.units ? subj.units.length : 0;
              const topicCount = subj.units ? subj.units.flatMap((u) => u.chapters.flatMap((c) => c.topics)).length : 0;

              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubjectId(subj.id)}
                  style={{
                    padding: '28px',
                    borderRadius: '22px',
                    background: 'rgba(30,41,59,0.7)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = subj.color;
                    e.currentTarget.style.boxShadow = `0 16px 36px ${subj.color}35`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: subj.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        flexShrink: 0,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      {subj.icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: `${subj.color}25`,
                            color: subj.color,
                            border: `1px solid ${subj.color}40`,
                          }}
                        >
                          {subj.code}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800 }}>
                          {subj.badge}
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 0 6px 0' }}>
                        {subj.name}
                      </h2>

                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                        {subj.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                      {unitCount > 0 ? `📖 ${unitCount} Units · ${topicCount} Topics` : '📂 Custom Subject Notes'}
                    </div>

                    <button
                      style={{
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: subj.gradient,
                        color: '#fff',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      Open Exam Notes <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Multi-Format Notes Uploader */}
        <UploadedNotesManager onSubjectsUpdated={refreshSubjectList} />

        <AITutorBot />
      </div>
    );
  }

  // 3. SUBJECT EXAM NOTES VIEW (Opened when a subject is clicked)
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '28px 24px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Back Button & Active Subject Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedSubjectId(null)}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} /> Back to All Subjects List
        </button>

        {/* Subject Header Banner */}
        <div
          style={{
            background: activeSubject?.gradient || 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.75rem',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={14} /> ACTIVE SUBJECT NOTES
            </div>

            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.4rem', fontWeight: 900, color: '#fff' }}>
              {activeSubject?.icon} {activeSubject?.name} ({activeSubject?.code})
            </h1>

            <p style={{ margin: 0, fontSize: '0.98rem', color: 'rgba(255,255,255,0.9)', maxWidth: '650px', lineHeight: 1.6 }}>
              {activeSubject?.description}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ width: '320px', maxWidth: '100%' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search topics, formulas, schematics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(15,23,42,0.85)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['all', 'bookmarked', 'revision', 'uploaded-notes'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: filterTab === tab ? '#0f172a' : 'rgba(255,255,255,0.15)',
                    color: filterTab === tab ? '#38bdf8' : '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'uploaded-notes' ? '📁 Subject Uploads' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE SUBJECT UNITS & TOPICS */}
      {activeUnits.length > 0 && filterTab !== 'uploaded-notes' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', marginBottom: '40px' }}>
          {activeUnits.map((unit) => {
            const unitTopics = unit.chapters.flatMap((c) => c.topics);
            const visibleTopics = unitTopics.filter((t) => filteredTopics.some((ft) => ft.id === t.id));

            if (visibleTopics.length === 0 && searchQuery.trim() !== '') return null;

            return (
              <div
                key={unit.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '28px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: unit.colorGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                      }}
                    >
                      {unit.icon}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {unit.unitNumber} · {unit.topicsCount} Syllabus Topics
                      </div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '2px 0 0 0' }}>
                        {unit.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Chapters & Topics List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {unit.chapters.map((chap) => {
                    const chapTopics = chap.topics.filter((t) => filteredTopics.some((ft) => ft.id === t.id));
                    if (chapTopics.length === 0 && searchQuery.trim() !== '') return null;

                    return (
                      <div key={chap.id} style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 12px 0' }}>
                          {chap.title}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                          {chapTopics.map((topic) => {
                            const isDone = completedTopicIds.includes(topic.id);
                            const isMarked = bookmarkedTopicIds.includes(topic.id);

                            return (
                              <div
                                key={topic.id}
                                onClick={() => setSelectedTopicId(topic.id)}
                                style={{
                                  padding: '16px',
                                  borderRadius: '12px',
                                  background: 'rgba(30, 41, 59, 0.8)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  gap: '10px',
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                                      {topic.badge}
                                    </span>
                                    {isDone && <CheckCircle size={16} color="#10b981" />}
                                  </div>

                                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                                    {topic.title}
                                  </div>

                                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                                    {topic.description}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>
                                  <span>Study Time: {topic.estimatedTime}</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Read Notes <ArrowRight size={14} />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* SUBJECT-SPECIFIC UPLOADED NOTES MANAGER */}
      <div style={{ marginTop: '24px' }}>
        <UploadedNotesManager activeSubjectId={selectedSubjectId} onSubjectsUpdated={refreshSubjectList} />
      </div>

      <AITutorBot />
    </div>
  );
};
