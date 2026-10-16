export type QuestionType = 'MCQ' | 'MSQ' | 'TF';

export interface Option {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
}

export interface Question {
  id: string;
  week: number;
  number: number;
  type: QuestionType;
  question: string;
  options: Option[];
  correctAnswers: string[];
  explanation: string;
  lectureReference: string;
  marks: number;
}

export interface QuizConfig {
  mode: 'week' | 'combined' | 'retake_incorrect';
  week?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timed: boolean;
  timeLimitMinutes: number;
}

export type UserAnswers = Record<string, string[]>; // questionId -> selected option ids
export type FlaggedQuestions = Record<string, boolean>; // questionId -> isFlagged

export interface QuizResult {
  id: string;
  date: string;
  mode: 'week' | 'combined' | 'retake_incorrect';
  week?: number;
  totalQuestions: number;
  maxMarks: number;
  score: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  timeTakenSeconds?: number;
  weekScores?: Record<number, { score: number; total: number; percentage: number }>;
  userAnswers: UserAnswers;
  questionIds: string[]; // order of questions in this attempt
}

export type WeekStatus = 'not_started' | 'in_progress' | 'completed';

export interface WeekStats {
  week: number;
  totalQuestions: number;
  attemptsCount: number;
  bestScore?: number;
  bestPercentage?: number;
  latestScore?: number;
  latestPercentage?: number;
  lastAttemptDate?: string;
  status: WeekStatus;
}

export interface OverallStats {
  totalAttempts: number;
  totalQuestionsAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  averageScorePercentage: number;
  masteredWeeksCount: number; // weeks with bestScore >= 80%
  overallReadinessPercentage: number; // curriculum mastery percentage
  bestCombinedScore?: { score: number; total: number; percentage: number };
}
