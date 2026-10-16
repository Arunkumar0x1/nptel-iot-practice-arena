import type { Question, Option } from '../types/quiz';

/**
 * Modern Fisher-Yates shuffle that produces an unbiased random permutation.
 * Creates a new array without mutating the original.
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Prepares questions for a quiz attempt based on configuration:
 * - Can shuffle question order
 * - Can shuffle option order per question (preserves option IDs so correctAnswers match accurately)
 */
export function prepareQuizQuestions(
  questions: Question[],
  shuffleQuestions: boolean,
  shuffleOptions: boolean
): Question[] {
  let processed = questions.map((q) => {
    if (!shuffleOptions) {
      return { ...q };
    }
    const shuffledOptions: Option[] = shuffleArray(q.options);
    return {
      ...q,
      options: shuffledOptions,
    };
  });

  if (shuffleQuestions) {
    processed = shuffleArray(processed);
  }

  return processed;
}
