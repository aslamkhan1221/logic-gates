export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface MicroQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

export interface PracticeProblem {
  id: string;
  problem: string;
  solutionSteps: string[];
  finalAnswer: string;
}

export interface LogicFamilySpec {
  name: string;
  noiseMargin: string;
  powerDissipation: string;
  propagationDelay: string;
  fanIn: string;
  fanOut: string;
  clockFrequency: string;
  supplyVoltage: string;
  powerPerGate: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

export interface Topic {
  id: string;
  subjectId: 'digital-technique' | 'analog-electronics';
  unitId: string;
  chapterId: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  badge: string;
  conceptSummary: string;
  conceptAnimationType?: 'bit-flow' | 'conversion' | 'gate-flow' | 'complement' | 'family-chart' | 'boolean-diagram' | 'diode-flow' | 'bjt-flow' | 'opamp-flow';
  
  diagramSteps?: {
    label: string;
    description: string;
    subtext?: string;
  }[];

  stepByStepExamples?: {
    title: string;
    initialValue: string;
    steps: { stepNum: number; calculation: string; note: string }[];
    answer: string;
  }[];

  memoryTricks: {
    title: string;
    content: string;
    mnemonics?: string[];
  }[];

  realLifeExamples: {
    title: string;
    description: string;
    icon: string;
  }[];

  flashcards: Flashcard[];

  flowchartSteps?: {
    id: string;
    label: string;
    nextId?: string;
  }[];

  truthTable?: {
    inputs: string[];
    output: string;
    rows: { inputs: number[]; output: number; label?: string }[];
  };

  interactiveGate?: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

  logicFamiliesData?: LogicFamilySpec[];

  importantExamPoints: {
    definitions: string[];
    formulas: string[];
    theoremsRules: string[];
    expectedQuestions: string[];
  };

  commonMistakes: {
    wrong: string;
    correct: string;
    explanation: string;
  }[];

  quickRevision: {
    keyTakeaway: string;
    bulletPoints: string[];
  };

  practiceProblems: PracticeProblem[];

  animatedSummary: {
    concept: string;
    rule: string;
    example: string;
    examTip: string;
  };

  microQuiz: MicroQuizQuestion[];
}

export interface Chapter {
  id: string;
  subjectId: 'digital-technique' | 'analog-electronics';
  unitId: string;
  title: string;
  subtitle: string;
  topics: Topic[];
}

export interface Unit {
  id: string;
  subjectId: 'digital-technique' | 'analog-electronics';
  unitNumber: string; // e.g. 'Unit I' | 'Unit II'
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  colorGradient: string;
  topicsCount: number;
  chapters: Chapter[];
}

export interface Subject {
  id: 'digital-technique' | 'analog-electronics';
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  badge: string;
  units: Unit[];
}

export interface UserNote {
  id: string;
  topicId: string;
  text: string;
  createdAt: string;
}

export interface UserExamNotesState {
  completedTopicIds: string[];
  bookmarkedTopicIds: string[];
  notes: UserNote[];
  quizScores: Record<string, number>;
  studyTimeSeconds: number;
  revisionCount: number;
}
