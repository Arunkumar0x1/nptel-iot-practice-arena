import type { Question, UserAnswers, QuizResult, QuizConfig } from '../types/quiz';

/**
 * Checks if user answer exactly matches the question's correct answer set.
 */
export function isQuestionCorrect(question: Question, selectedOptionIds: string[] | undefined): boolean {
  if (!selectedOptionIds || selectedOptionIds.length === 0) {
    return false;
  }

  const sortedUser = [...selectedOptionIds].sort();
  const sortedCorrect = [...question.correctAnswers].sort();

  if (sortedUser.length !== sortedCorrect.length) {
    return false;
  }

  return sortedUser.every((val, index) => val.toLowerCase() === sortedCorrect[index].toLowerCase());
}

/**
 * Evaluates the quiz attempt and returns a complete QuizResult.
 */
export function calculateQuizResult(
  questions: Question[],
  userAnswers: UserAnswers,
  config: QuizConfig,
  timeTakenSeconds?: number
): QuizResult {
  const totalQuestions = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalScore = 0;
  let maxMarks = 0;

  const weekScores: Record<number, { score: number; total: number; percentage: number }> = {};

  for (const q of questions) {
    maxMarks += q.marks;
    const userAns = userAnswers[q.id];
    const isAttempted = Array.isArray(userAns) && userAns.length > 0;

    if (!weekScores[q.week]) {
      weekScores[q.week] = { score: 0, total: 0, percentage: 0 };
    }
    weekScores[q.week].total += q.marks;

    if (!isAttempted) {
      unansweredCount++;
    } else if (isQuestionCorrect(q, userAns)) {
      correctCount++;
      totalScore += q.marks;
      weekScores[q.week].score += q.marks;
    } else {
      incorrectCount++;
    }
  }

  for (const w of Object.keys(weekScores).map(Number)) {
    const item = weekScores[w];
    item.percentage = item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;
  }

  const percentage = maxMarks > 0 ? Math.round((totalScore / maxMarks) * 1000) / 10 : 0;
  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;

  return {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
    mode: config.mode,
    week: config.week,
    totalQuestions,
    maxMarks,
    score: totalScore,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    accuracy,
    timeTakenSeconds,
    weekScores: config.mode === 'combined' ? weekScores : undefined,
    userAnswers,
    questionIds: questions.map((q) => q.id),
  };
}
