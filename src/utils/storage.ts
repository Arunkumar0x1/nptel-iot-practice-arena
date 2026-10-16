import type { QuizResult, WeekStats, OverallStats, QuizConfig } from '../types/quiz';

const STORAGE_KEYS = {
  HISTORY: 'nptel_iot_practice_history_v1',
  THEME: 'nptel_iot_theme_v1',
  CONFIG_PREFS: 'nptel_iot_config_prefs_v1',
};

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    console.error('Error reading theme from localStorage', e);
  }
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Error saving theme to localStorage', e);
  }
}

export function getStoredConfigPrefs(): Partial<QuizConfig> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG_PREFS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading config prefs', e);
  }
  return {
    shuffleQuestions: false,
    shuffleOptions: false,
    timed: false,
    timeLimitMinutes: 15,
  };
}

export function saveStoredConfigPrefs(prefs: Partial<QuizConfig>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG_PREFS, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving config prefs', e);
  }
}

export function getStoredHistory(): QuizResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading history', e);
  }
  return [];
}

export function saveQuizAttempt(result: QuizResult): void {
  try {
    const current = getStoredHistory();
    const updated = [result, ...current];
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.error('Error saving attempt to history', e);
  }
}

export function clearStoredHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Error clearing history', e);
  }
}

export function calculateWeekStats(history: QuizResult[]): Record<number, WeekStats> {
  const stats: Record<number, WeekStats> = {};

  for (let w = 1; w <= 12; w++) {
    stats[w] = {
      week: w,
      totalQuestions: 15,
      attemptsCount: 0,
      bestScore: undefined,
      bestPercentage: undefined,
      lastAttemptDate: undefined,
    };
  }

  for (const item of history) {
    if (item.mode === 'week' && item.week && item.week >= 1 && item.week <= 12) {
      const w = item.week;
      stats[w].attemptsCount++;
      if (stats[w].bestScore === undefined || item.score > (stats[w].bestScore ?? 0)) {
        stats[w].bestScore = item.score;
        stats[w].bestPercentage = item.percentage;
      }
      if (!stats[w].lastAttemptDate) {
        stats[w].lastAttemptDate = item.date;
      }
    }
  }

  return stats;
}

export function calculateOverallStats(history: QuizResult[]): OverallStats {
  if (history.length === 0) {
    return {
      totalAttempts: 0,
      totalQuestionsAttempted: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      averageScorePercentage: 0,
    };
  }

  let totalQuestionsAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let percentageSum = 0;
  let bestCombined: { score: number; total: number; percentage: number } | undefined = undefined;

  for (const h of history) {
    totalCorrect += h.correctCount;
    totalIncorrect += h.incorrectCount;
    totalQuestionsAttempted += h.correctCount + h.incorrectCount;
    percentageSum += h.percentage;

    if (h.mode === 'combined') {
      if (!bestCombined || h.score > bestCombined.score) {
        bestCombined = {
          score: h.score,
          total: h.totalQuestions,
          percentage: h.percentage,
        };
      }
    }
  }

  return {
    totalAttempts: history.length,
    totalQuestionsAttempted,
    totalCorrect,
    totalIncorrect,
    averageScorePercentage: Math.round((percentageSum / history.length) * 10) / 10,
    bestCombinedScore: bestCombined,
  };
}
