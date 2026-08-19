import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  File,
  FileSpreadsheet,
  FileCode,
  FileImage,
  FileArchive,
  Trash2,
  Edit3,
  Download,
  Eye,
  Check,
  X,
  Search,
  Plus,
  FolderUp,
  Sparkles,
  BookOpen,
  Tag,
  AlertCircle,
  Layers,
  ChevronDown
} from 'lucide-react';
import type { Subject } from '../../types/examNotes';
import { getAllSubjects, addCustomSubject } from '../../utils/subjectStorage';

export interface UploadedNoteFile {
  id: string;
  serialNo: number;
  subjectId: string;
  subjectName: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  uploadDate: string;
  dataUrl?: string;
  mimeType?: string;
}

interface Props {
  className?: string;
  activeSubjectId?: string;
  onSubjectSelect?: (subjectId: string) => void;
  onSubjectsUpdated?: () => void;
}

const STORAGE_KEY = 'logic_gates_uploaded_notes_v2';

export const UploadedNotesManager: React.FC<Props> = ({
  activeSubjectId,
  onSubjectSelect,
  onSubjectsUpdated,
}) => {
  // Available subjects (default + custom)
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>(() => getAllSubjects());

  // Currently selected subject for uploads
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() => {
    if (activeSubjectId) return activeSubjectId;
    const subs = getAllSubjects();
    return subs[0]?.id || 'digital-technique';
  });

  // Keep selectedSubjectId synced if activeSubjectId prop changes
  useEffect(() => {
    if (activeSubjectId) {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  // Load uploaded notes from localStorage
  const [notesList, setNotesList] = useState<UploadedNoteFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to load notes from localStorage:', err);
    }
    // Default initial sample notes
    return [
      {
        id: 'sample-1',
        serialNo: 1,
        subjectId: 'analog-electronics',
        subjectName: 'Analog Electronics',
        title: 'Power Amplifiers (Unit I) Formula Sheet',
        fileName: 'Unit1_Power_Amps_Formulas.pdf',
        fileType: 'PDF',
        fileSizeFormatted: '1.2 MB',
        fileSizeBytes: 1250000,
        uploadDate: '19 Aug 2026, 09:30 AM',
        dataUrl: '',
        mimeType: 'application/pdf',
      },
      {
        id: 'sample-2',
        serialNo: 2,
        subjectId: 'analog-electronics',
        subjectName: 'Analog Electronics',
        title: 'Op-Amp IC-741 Pinout & Characteristic Diagram',
        fileName: 'IC741_Pinout_Diagram.png',
        fileType: 'PNG',
        fileSizeFormatted: '450 KB',
        fileSizeBytes: 460800,
        uploadDate: '19 Aug 2026, 10:15 AM',
        dataUrl: '',
        mimeType: 'image/png',
      },
      {
        id: 'sample-3',
        serialNo: 3,
        subjectId: 'digital-technique',
        subjectName: 'Digital Technique',
        title: 'Boolean Algebra & De Morgan Theorems Summary',
        fileName: 'Boolean_Algebra_Summary.docx',
        fileType: 'DOCX',
        fileSizeFormatted: '820 KB',
        fileSizeBytes: 839680,
        uploadDate: '19 Aug 2026, 10:45 AM',
        dataUrl: '',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ];
  });

  // New Subject creation form states
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  // Upload form states
  const [customTitle, setCustomTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync available subjects
  const refreshSubjects = () => {
    const updated = getAllSubjects();
    setAvailableSubjects(updated);
    if (onSubjectsUpdated) onSubjectsUpdated();
  };

  // Save notes list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notesList));
    } catch (err) {
      console.warn('LocalStorage quota exceeded or unavailable:', err);
    }
  }, [notesList]);

  // Format file size utility
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Get file format extension badge
  const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    if (parts.length > 1) {
      return parts.pop()!.toUpperCase();
    }
    return 'FILE';
  };

  // Handle Creating a New Custom Subject
  const handleCreateSubject = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSubjectName.trim()) return;

    const created = addCustomSubject(newSubjectName.trim(), newSubjectCode.trim());
    refreshSubjects();
    setSelectedSubjectId(created.id);
    setNewSubjectName('');
    setNewSubjectCode('');
    setIsCreatingSubject(false);
  };

  // Handle uploading files for the selected subject
  const handleFilesUpload = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    // Find selected subject details
    const activeSubj = availableSubjects.find((s) => s.id === selectedSubjectId) || availableSubjects[0];
    const targetSubjId = activeSubj?.id || 'digital-technique';
    const targetSubjName = activeSubj?.name || 'General Subject';

    Array.from(files).forEach((file, index) => {
      const ext = getFileExtension(file.name);
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Title fallback
      let titleName = customTitle.trim();
      if (!titleName) {
        titleName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      } else if (files.length > 1) {
        titleName = `${titleName} (${index + 1})`;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        const newNote: UploadedNoteFile = {
          id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          serialNo: 0,
          subjectId: targetSubjId,
          subjectName: targetSubjName,
          title: titleName,
          fileName: file.name,
          fileType: ext,
          fileSizeFormatted: formatFileSize(file.size),
          fileSizeBytes: file.size,
          uploadDate: timeStr,
          dataUrl: dataUrl,
          mimeType: file.type,
        };

        setNotesList((prev) => {
          const updated = [newNote, ...prev];
          // Re-index serial numbers 1, 2, 3...
          return updated.map((item, idx) => ({ ...item, serialNo: idx + 1 }));
        });
      };

      reader.readAsDataURL(file);
    });

    setCustomTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesUpload(e.target.files);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    setNotesList((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      return filtered.map((item, idx) => ({ ...item, serialNo: idx + 1 }));
    });
  };

  // Clear all notes
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all uploaded notes?')) {
      setNotesList([]);
    }
  };

  // Save inline title edit
  const handleSaveTitle = (id: string) => {
    if (!editingTitleText.trim()) return;
    setNotesList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: editingTitleText.trim() } : n))
    );
    setEditingId(null);
  };

  // File type styling
  const getFileTypeStyle = (ext: string) => {
    const extension = ext.toUpperCase();
    if (['PDF'].includes(extension)) {
      return { icon: <FileText size={18} color="#ef4444" />, bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#fca5a5' };
    }
    if (['DOC', 'DOCX', 'TXT', 'MD', 'RTF'].includes(extension)) {
      return { icon: <FileText size={18} color="#3b82f6" />, bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#93c5fd' };
    }
    if (['XLS', 'XLSX', 'CSV'].includes(extension)) {
      return { icon: <FileSpreadsheet size={18} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#6ee7b7' };
    }
    if (['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(extension)) {
      return { icon: <FileImage size={18} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fcd34d' };
    }
    if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(extension)) {
      return { icon: <FileArchive size={18} color="#a855f7" />, bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#d8b4fe' };
    }
    if (['CPP', 'C', 'PY', 'JS', 'TS', 'TSX', 'JSX', 'HTML', 'CSS', 'JSON', 'JAVA'].includes(extension)) {
      return { icon: <FileCode size={18} color="#06b6d4" />, bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4', text: '#67e8f9' };
    }
    return { icon: <File size={18} color="#94a3b8" />, bg: 'rgba(148, 163, 184, 0.15)', border: '#94a3b8', text: '#cbd5e1' };
  };

  // Filter notes based on subject and search query
  const filteredNotes = notesList.filter((note) => {
    const matchesSubject = filterSubjectId === 'all' || note.subjectId === filterSubjectId;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.fileType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const activeSubject = availableSubjects.find((s) => s.id === selectedSubjectId);

  return (
    <div
      style={{
        background: '#0f172a',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '28px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '20px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              fontSize: '0.72rem',
              fontWeight: 900,
              color: '#38bdf8',
              marginBottom: '8px',
            }}
          >
            <FolderUp size={14} /> SUBJECT-BASED FILE UPLOADER
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
            📁 Uploaded Notes (Serial-Wise List)
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
            Select or create a subject, upload notes in any format, and notes will auto-add to the selected subject.
          </p>
        </div>

        {notesList.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={15} /> Clear All ({notesList.length})
          </button>
        )}
      </div>

      {/* Upload Form Box */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '18px',
          border: '1px dashed ' + (isDragOver ? '#38bdf8' : 'rgba(255,255,255,0.2)'),
          padding: '24px',
          marginBottom: '28px',
          transition: 'all 0.3s ease',
          backgroundColor: isDragOver ? 'rgba(56, 189, 248, 0.08)' : 'rgba(30, 41, 59, 0.6)',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Subject Dropdown & New Subject Creator Bar */}
        <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* 1. SELECT SUBJECT DROPDOWN */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 900, color: '#38bdf8', marginBottom: '8px' }}>
              <Layers size={16} /> Select Target Subject for Uploaded Notes:
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  if (e.target.value === 'CREATE_NEW') {
                    setIsCreatingSubject(true);
                  } else {
                    setSelectedSubjectId(e.target.value);
                    if (onSubjectSelect) onSubjectSelect(e.target.value);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '12px 36px 12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #38bdf8',
                  background: 'rgba(15, 23, 42, 0.95)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                {availableSubjects.map((subj) => (
                  <option key={subj.id} value={subj.id} style={{ background: '#0f172a', color: '#fff' }}>
                    {subj.icon} {subj.name} ({subj.code}) {subj.isCustom ? '⭐ Custom' : ''}
                  </option>
                ))}
                <option value="CREATE_NEW" style={{ background: '#0284c7', color: '#fff', fontWeight: 900 }}>
                  ➕ + Create New Subject...
                </option>
              </select>
              <ChevronDown size={18} color="#38bdf8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* 2. CUSTOM NOTES TITLE INPUT */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
              📝 Custom Notes Title (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Unit 1 Power Amplifiers Formula Sheet..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* INLINE NEW SUBJECT CREATOR FORM */}
        {isCreatingSubject && (
          <form
            onSubmit={handleCreateSubject}
            style={{
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid #0284c7',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Create New Subject:
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Subject Name (e.g. Control Systems, Microcontrollers)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                autoFocus
                required
                style={{
                  flex: 2,
                  minWidth: '220px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
              <input
                type="text"
                placeholder="Code (e.g. CS-401)"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: '0.88rem',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} /> Add Subject
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingSubject(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Drag & Drop Visual Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            textAlign: 'center',
            padding: '24px 16px',
            borderRadius: '14px',
            background: 'rgba(15, 23, 42, 0.5)',
            cursor: 'pointer',
            border: '1px dashed rgba(255,255,255,0.2)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="*"
            multiple
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />

          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.3)',
            }}
          >
            <FolderUp size={26} />
          </div>

          <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
            Click or Drag & Drop files to upload for{' '}
            <span style={{ color: '#38bdf8', textDecoration: 'underline' }}>
              {activeSubject?.name || 'Selected Subject'}
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Supports ALL formats: <span style={{ color: '#ef4444' }}>PDF</span>, <span style={{ color: '#3b82f6' }}>DOCX</span>, <span style={{ color: '#f59e0b' }}>PNG/JPG</span>, <span style={{ color: '#10b981' }}>TXT/MD</span>, <span style={{ color: '#a855f7' }}>ZIP</span>, <span style={{ color: '#06b6d4' }}>Code</span> & more!
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Subject Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8' }}>Filter Notes:</span>
          <button
            onClick={() => setFilterSubjectId('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: filterSubjectId === 'all' ? '#0284c7' : 'rgba(255,255,255,0.06)',
              color: filterSubjectId === 'all' ? '#fff' : '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            All Subjects ({notesList.length})
          </button>

          {availableSubjects.map((s) => {
            const count = notesList.filter((n) => n.subjectId === s.id).length;
            const isSel = filterSubjectId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setFilterSubjectId(s.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: isSel ? `1px solid ${s.color}` : 'none',
                  background: isSel ? `${s.color}35` : 'rgba(255,255,255,0.06)',
                  color: isSel ? '#fff' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{s.icon}</span>
                <span>{s.name} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#fff',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Serial-Wise Table / List Display */}
      {filteredNotes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'rgba(30, 41, 59, 0.3)',
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.1)',
            color: '#94a3b8',
          }}
        >
          <AlertCircle size={32} style={{ marginBottom: '8px', opacity: 0.6 }} />
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>No uploaded notes found</div>
          <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
            Upload your PDF, DOCX, image, or text notes for{' '}
            <span style={{ color: '#38bdf8' }}>{activeSubject?.name || 'this subject'}</span> using the box above.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotes.map((note) => {
            const styleInfo = getFileTypeStyle(note.fileType);
            const isEditing = editingId === note.id;

            return (
              <div
                key={note.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                }}
              >
                {/* 1. Serial Number Badge */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  #{note.serialNo}
                </div>

                {/* 2. File Format Icon & Badge */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: styleInfo.bg,
                    border: `1px solid ${styleInfo.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {styleInfo.icon}
                </div>

                {/* 3. Notes Title & Details */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        autoFocus
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #38bdf8',
                          background: '#0f172a',
                          color: '#fff',
                          fontSize: '0.92rem',
                          fontWeight: 700,
                          width: '100%',
                        }}
                      />
                      <button
                        onClick={() => handleSaveTitle(note.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: '#64748b',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: '#f8fafc',
                          lineHeight: 1.3,
                        }}
                      >
                        {note.title}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditingTitleText(note.title);
                        }}
                        title="Rename note"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.76rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                    {/* Subject Tag */}
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        fontWeight: 900,
                        fontSize: '0.7rem',
                      }}
                    >
                      📘 {note.subjectName}
                    </span>
                    <span>•</span>
                    <span>📄 {note.fileName}</span>
                    <span>•</span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: styleInfo.bg,
                        color: styleInfo.text,
                        fontWeight: 900,
                        fontSize: '0.68rem',
                      }}
                    >
                      {note.fileType}
                    </span>
                    <span>•</span>
                    <span>{note.fileSizeFormatted}</span>
                    <span>•</span>
                    <span>🕒 {note.uploadDate}</span>
                  </div>
                </div>

                {/* 4. Actions: View, Download & Delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {note.dataUrl && (
                    <a
                      href={note.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View / Open File"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} /> View
                    </a>
                  )}

                  {note.dataUrl && (
                    <a
                      href={note.dataUrl}
                      download={note.fileName}
                      title="Download File"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#6ee7b7',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Download size={14} /> Download
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete Note"
                    style={{
                      padding: '9px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
