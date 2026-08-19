import type { Subject } from '../types/examNotes';
import { SUBJECTS as DEFAULT_SUBJECTS } from '../data/examNotesData';

const CUSTOM_SUBJECTS_KEY = 'logic_gates_custom_subjects_v1';

export const getCustomSubjects = (): Subject[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_SUBJECTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load custom subjects from localStorage:', err);
  }
  return [];
};

export const saveCustomSubjects = (subjects: Subject[]) => {
  try {
    localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(subjects));
  } catch (err) {
    console.error('Failed to save custom subjects to localStorage:', err);
  }
};

export const getAllSubjects = (): Subject[] => {
  const custom = getCustomSubjects();
  return [...DEFAULT_SUBJECTS, ...custom];
};

export const addCustomSubject = (name: string, code?: string, description?: string): Subject => {
  const customList = getCustomSubjects();
  const id = 'subj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const subjectCode = code && code.trim() ? code.trim().toUpperCase() : 'CS-' + (100 + customList.length + 1);

  // Gradient palettes for user custom subjects
  const gradients = [
    'linear-gradient(135deg, #8b5cf6 0%, #d8b4fe 100%)',
    'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  ];

  const colors = ['#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f59e0b'];

  const colorIndex = customList.length % colors.length;

  const newSubject: Subject = {
    id,
    name: name.trim(),
    code: subjectCode,
    description: description && description.trim() ? description.trim() : `Custom notes and study materials for ${name.trim()}.`,
    icon: '📘',
    color: colors[colorIndex],
    gradient: gradients[colorIndex],
    badge: 'Custom Subject ⭐',
    units: [],
    isCustom: true,
  };

  const updated = [...customList, newSubject];
  saveCustomSubjects(updated);
  return newSubject;
};
