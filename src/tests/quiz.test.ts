import { describe, it, expect } from 'vitest';
import questionsDataRaw from '../data/questions.json';
import type { Question, QuizConfig, UserAnswers } from '../types/quiz';
import { isQuestionCorrect, calculateQuizResult } from '../utils/scoring';
import { prepareQuizQuestions, shuffleArray } from '../utils/shuffle';
import { calculateWeekStats, calculateOverallStats } from '../utils/storage';

const allQuestions = questionsDataRaw as Question[];

describe('Question Bank Validation', () => {
  it('contains exactly 180 questions across 12 weeks', () => {
    expect(allQuestions.length).toBe(180);
  });

  it('contains exactly 15 questions for each of the 12 weeks', () => {
    for (let w = 1; w <= 12; w++) {
      const weekQs = allQuestions.filter((q) => q.week === w);
      expect(weekQs.length).toBe(15);
      const numbers = weekQs.map((q) => q.number).sort((a, b) => a - b);
      expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    }
  });

  it('has strictly unique question IDs', () => {
    const ids = allQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(180);
  });

  it('every question has valid options, correct answers, explanation, and reference', () => {
    for (const q of allQuestions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctAnswers.length).toBeGreaterThanOrEqual(1);
      const optIds = q.options.map((o) => o.id);
      for (const ca of q.correctAnswers) {
        expect(optIds).toContain(ca);
      }
      expect(q.explanation.trim().length).toBeGreaterThan(0);
      expect(q.lectureReference.trim().length).toBeGreaterThan(0);
      expect(q.marks).toBe(1);
    }
  });

  it('correctly categorizes MCQ, MSQ, and True/False types', () => {
    const msqs = allQuestions.filter((q) => q.type === 'MSQ');
    const tfs = allQuestions.filter((q) => q.type === 'TF');
    const mcqs = allQuestions.filter((q) => q.type === 'MCQ');

    expect(msqs.length).toBe(11);
    expect(tfs.length).toBe(19);
    expect(mcqs.length).toBe(150);
    expect(msqs.length + tfs.length + mcqs.length).toBe(180);
  });
});

describe('Shuffling & Question Selection', () => {
  it('preserves sequential order when shuffling is OFF', () => {
    const week1 = allQuestions.filter((q) => q.week === 1);
    const prepared = prepareQuizQuestions(week1, false, false);

    expect(prepared.map((q) => q.id)).toEqual(week1.map((q) => q.id));
    expect(prepared[0].options.map((o) => o.id)).toEqual(week1[0].options.map((o) => o.id));
  });

  it('randomizes question order when question shuffling is ON while preserving all questions', () => {
    const week1 = allQuestions.filter((q) => q.week === 1);
    const prepared = prepareQuizQuestions(week1, true, false);

    expect(prepared.length).toBe(15);
    const originalIds = new Set(week1.map((q) => q.id));
    const preparedIds = new Set(prepared.map((q) => q.id));
    expect(preparedIds).toEqual(originalIds);
  });

  it('option shuffling randomizes option order but preserves option IDs and valid matching', () => {
    const sampleQ = allQuestions.find((q) => q.options.length === 4)!;
    const prepared = prepareQuizQuestions([sampleQ], false, true);

    expect(prepared[0].options.length).toBe(4);
    const origOptIds = sampleQ.options.map((o) => o.id).sort();
    const shuffledOptIds = prepared[0].options.map((o) => o.id).sort();
    expect(shuffledOptIds).toEqual(origOptIds);
  });

  it('Fisher-Yates shuffle produces a permutation without data loss', () => {
    const sample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffled = shuffleArray(sample);
    expect(shuffled.length).toBe(sample.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(sample);
  });
});

describe('Scoring Engine', () => {
  it('awards 1 mark for correct single choice MCQ', () => {
    const q = allQuestions[0];
    expect(isQuestionCorrect(q, ['b'])).toBe(true);
    expect(isQuestionCorrect(q, ['a'])).toBe(false);
    expect(isQuestionCorrect(q, [])).toBe(false);
    expect(isQuestionCorrect(q, undefined)).toBe(false);
  });

  it('awards 1 mark for MSQ only on exact set match (no partial credit)', () => {
    const msq = allQuestions.find((q) => q.id === 'week1-q2')!;
    expect(isQuestionCorrect(msq, ['a', 'b', 'c'])).toBe(true);
    expect(isQuestionCorrect(msq, ['c', 'a', 'b'])).toBe(true);
    expect(isQuestionCorrect(msq, ['a', 'b'])).toBe(false);
    expect(isQuestionCorrect(msq, ['a', 'b', 'c', 'd'])).toBe(false);
  });

  it('calculates full quiz score, percentage, and accuracy accurately', () => {
    const week1 = allQuestions.filter((q) => q.week === 1);
    const config: QuizConfig = {
      mode: 'week',
      week: 1,
      shuffleQuestions: false,
      shuffleOptions: false,
      timed: false,
      timeLimitMinutes: 15,
    };

    const userAnswers: UserAnswers = {};
    for (let i = 0; i < 10; i++) {
      userAnswers[week1[i].id] = [...week1[i].correctAnswers];
    }
    for (let i = 10; i < 13; i++) {
      userAnswers[week1[i].id] = ['wrong-id'];
    }

    const result = calculateQuizResult(week1, userAnswers, config, 300);

    expect(result.totalQuestions).toBe(15);
    expect(result.maxMarks).toBe(15);
    expect(result.score).toBe(10);
    expect(result.correctCount).toBe(10);
    expect(result.incorrectCount).toBe(3);
    expect(result.unansweredCount).toBe(2);
    expect(result.percentage).toBe(66.7);
    expect(result.accuracy).toBe(76.9);
  });

  it('handles edge case when zero questions are attempted (no division by zero)', () => {
    const week1 = allQuestions.filter((q) => q.week === 1);
    const config: QuizConfig = {
      mode: 'week',
      week: 1,
      shuffleQuestions: false,
      shuffleOptions: false,
      timed: false,
      timeLimitMinutes: 15,
    };

    const result = calculateQuizResult(week1, {}, config);
    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.accuracy).toBe(0);
    expect(result.unansweredCount).toBe(15);
    expect(result.correctCount).toBe(0);
    expect(result.incorrectCount).toBe(0);
  });

  it('calculates week-wise performance breakdown in combined tests', () => {
    const config: QuizConfig = {
      mode: 'combined',
      shuffleQuestions: false,
      shuffleOptions: false,
      timed: false,
      timeLimitMinutes: 120,
    };

    const userAnswers: UserAnswers = {};
    for (const q of allQuestions) {
      if (q.week === 1 || q.week === 2) {
        userAnswers[q.id] = [...q.correctAnswers];
      }
    }

    const result = calculateQuizResult(allQuestions, userAnswers, config);
    expect(result.totalQuestions).toBe(180);
    expect(result.score).toBe(30);
    expect(result.weekScores).toBeDefined();
    expect(result.weekScores![1].score).toBe(15);
    expect(result.weekScores![1].percentage).toBe(100);
    expect(result.weekScores![2].score).toBe(15);
    expect(result.weekScores![2].percentage).toBe(100);
    expect(result.weekScores![3].score).toBe(0);
    expect(result.weekScores![3].percentage).toBe(0);
  });
});

describe('Practice History & Statistics Derivation', () => {
  it('correctly computes week stats and best score', () => {
    const mockHistory = [
      {
        id: '1',
        date: '2026-10-16T10:00:00Z',
        mode: 'week' as const,
        week: 1,
        totalQuestions: 15,
        maxMarks: 15,
        score: 12,
        percentage: 80,
        correctCount: 12,
        incorrectCount: 3,
        unansweredCount: 0,
        accuracy: 80,
        userAnswers: {},
        questionIds: [],
      },
      {
        id: '2',
        date: '2026-10-16T11:00:00Z',
        mode: 'week' as const,
        week: 1,
        totalQuestions: 15,
        maxMarks: 15,
        score: 14,
        percentage: 93.3,
        correctCount: 14,
        incorrectCount: 1,
        unansweredCount: 0,
        accuracy: 93.3,
        userAnswers: {},
        questionIds: [],
      },
    ];

    const weekStats = calculateWeekStats(mockHistory);
    expect(weekStats[1].attemptsCount).toBe(2);
    expect(weekStats[1].bestScore).toBe(14);
    expect(weekStats[1].bestPercentage).toBe(93.3);
    expect(weekStats[2].attemptsCount).toBe(0);
    expect(weekStats[2].bestScore).toBeUndefined();

    const overall = calculateOverallStats(mockHistory);
    expect(overall.totalAttempts).toBe(2);
    expect(overall.totalCorrect).toBe(26);
    expect(overall.totalIncorrect).toBe(4);
  });
});
