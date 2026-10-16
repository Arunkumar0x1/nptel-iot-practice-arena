import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, QuizConfig, UserAnswers, QuizResult } from '../types/quiz';
import { prepareQuizQuestions } from '../utils/shuffle';
import { calculateQuizResult } from '../utils/scoring';
import { saveQuizAttempt } from '../utils/storage';

interface UseQuizProps {
  initialQuestions: Question[];
  config: QuizConfig;
  onFinish?: (result: QuizResult) => void;
}

export function useQuiz({ initialQuestions, config, onFinish }: UseQuizProps) {
  const [questions] = useState<Question[]>(() =>
    prepareQuizQuestions(initialQuestions, config.shuffleQuestions, config.shuffleOptions)
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const totalSeconds = config.timed ? config.timeLimitMinutes * 60 : 0;
  const [remainingSeconds, setRemainingSeconds] = useState<number>(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());
  const submittedRef = useRef<boolean>(false);

  const currentQuestion: Question | undefined = questions[currentIndex];

  const answeredCount = Object.values(userAnswers).filter((ans) => ans && ans.length > 0).length;
  const unansweredCount = questions.length - answeredCount;

  const submitTest = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setIsSubmitted(true);
    setShowSubmitModal(false);

    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const result = calculateQuizResult(questions, userAnswers, config, timeSpentSeconds);
    saveQuizAttempt(result);

    if (onFinish) {
      onFinish(result);
    }
  }, [questions, userAnswers, config, onFinish]);

  useEffect(() => {
    if (!config.timed || isSubmitted) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [config.timed, isSubmitted, submitTest]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < questions.length - 1 ? prev + 1 : prev));
  }, [questions.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  }, [questions.length]);

  const selectOption = useCallback(
    (questionId: string, optionId: string, type: Question['type']) => {
      if (isSubmitted) return;

      setUserAnswers((prev) => {
        const currentAns = prev[questionId] || [];

        if (type === 'MSQ') {
          const exists = currentAns.includes(optionId);
          const nextAns = exists
            ? currentAns.filter((id) => id !== optionId)
            : [...currentAns, optionId];
          return {
            ...prev,
            [questionId]: nextAns,
          };
        } else {
          return {
            ...prev,
            [questionId]: [optionId],
          };
        }
      });
    },
    [isSubmitted]
  );

  const clearAnswer = useCallback(
    (questionId: string) => {
      if (isSubmitted) return;
      setUserAnswers((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    },
    [isSubmitted]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, showSubmitModal]);

  return {
    questions,
    currentIndex,
    currentQuestion,
    userAnswers,
    isSubmitted,
    showSubmitModal,
    setShowSubmitModal,
    remainingSeconds,
    answeredCount,
    unansweredCount,
    selectOption,
    clearAnswer,
    goToNext,
    goToPrevious,
    goToIndex,
    submitTest,
  };
}
