import React, { useState } from 'react';
import type { Question, QuizConfig, QuizResult } from '../types/quiz';
import { useQuiz } from '../hooks/useQuiz';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionPalette } from '../components/QuestionPalette';
import { QuizProgress } from '../components/QuizProgress';
import { Timer } from '../components/Timer';
import { SubmitConfirmationModal } from '../components/SubmitConfirmationModal';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { DetailedReview } from '../components/DetailedReview';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';

interface QuizPageProps {
  questions: Question[];
  config: QuizConfig;
  allQuestionsPool: Question[];
  onExitQuiz: () => void;
  onRetake: (config: QuizConfig, customQuestions?: Question[]) => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({
  questions: initialQuizQuestions,
  config,
  allQuestionsPool,
  onExitQuiz,
  onRetake,
}) => {
  const [activeView, setActiveView] = useState<'taking' | 'results' | 'review'>('taking');
  const [completedResult, setCompletedResult] = useState<QuizResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect'>('all');

  const {
    questions,
    currentIndex,
    currentQuestion,
    userAnswers,
    flaggedQuestions,
    showSubmitModal,
    setShowSubmitModal,
    remainingSeconds,
    answeredCount,
    flaggedCount,
    unansweredCount,
    selectOption,
    clearAnswer,
    toggleFlag,
    goToNext,
    goToPrevious,
    goToIndex,
    goToNextUnanswered,
    submitTest,
  } = useQuiz({
    initialQuestions: initialQuizQuestions,
    config,
    onFinish: (result) => {
      setCompletedResult(result);
      setActiveView('results');
    },
  });

  const isCombined = config.mode === 'combined';
  const title =
    config.mode === 'combined'
      ? 'Combined 12-Week Examination'
      : config.mode === 'retake_incorrect'
      ? 'Targeted Practice Review'
      : `Week ${config.week} Practice Assignment`;

  const handleRetakeIncorrect = () => {
    if (!completedResult) return;
    const missedIds = new Set<string>();

    for (const q of questions) {
      const uAns = completedResult.userAnswers[q.id];
      if (!uAns || uAns.length === 0) {
        missedIds.add(q.id);
      } else {
        const sortedU = [...uAns].sort().join(',');
        const sortedC = [...q.correctAnswers].sort().join(',');
        if (sortedU !== sortedC) {
          missedIds.add(q.id);
        }
      }
    }

    const missedQuestions = allQuestionsPool.filter((q) => missedIds.has(q.id));
    if (missedQuestions.length === 0) {
      alert('You answered all questions correctly in this attempt! No missed questions to retake.');
      return;
    }

    onRetake(
      {
        ...config,
        mode: 'retake_incorrect',
        timeLimitMinutes: Math.ceil(missedQuestions.length * 1.5),
      },
      missedQuestions
    );
  };

  if (activeView === 'results' && completedResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsDashboard
          result={completedResult}
          onReviewAll={() => {
            setReviewFilter('all');
            setActiveView('review');
          }}
          onReviewIncorrect={() => {
            setReviewFilter('incorrect');
            setActiveView('review');
          }}
          onRetakeIncorrect={completedResult.incorrectCount > 0 ? handleRetakeIncorrect : undefined}
          onRetakeAll={() => onRetake(config)}
          onReturnHome={onExitQuiz}
        />
      </div>
    );
  }

  if (activeView === 'review' && completedResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailedReview
          questions={questions}
          result={completedResult}
          initialFilter={reviewFilter}
          onBackToResults={() => setActiveView('results')}
          onReturnHome={onExitQuiz}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Test Navigation Bar */}
      <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to exit the current test? Your progress will be discarded.'
                )
              ) {
                onExitQuiz();
              }
            }}
            className="p-2.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            title="Exit Examination"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {title}
              </h2>
              {isCombined && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                  <Sparkles className="w-3 h-3" />
                  180 Questions Bank
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam mode • Answers and explanations remain hidden until submission
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {config.timed && <Timer remainingSeconds={remainingSeconds} />}

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700 shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Finish & Submit</span>
          </button>
        </div>
      </div>

      {/* Main Examination Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-8">
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              selectedOptionIds={userAnswers[currentQuestion.id] || []}
              isFlagged={Boolean(flaggedQuestions[currentQuestion.id])}
              onToggleFlag={() => toggleFlag(currentQuestion.id)}
              onSelectOption={(optId) =>
                selectOption(currentQuestion.id, optId, currentQuestion.type)
              }
              onClearAnswer={() => clearAnswer(currentQuestion.id)}
              onNext={goToNext}
              onPrevious={goToPrevious}
              onSubmit={() => setShowSubmitModal(true)}
            />
          )}
        </div>

        {/* Right Column: Progress & Question Palette */}
        <div className="lg:col-span-4 space-y-4">
          <QuizProgress
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            answeredCount={answeredCount}
            unansweredCount={unansweredCount}
          />

          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onSelectIndex={goToIndex}
            onJumpToNextUnanswered={goToNextUnanswered}
            isCombined={isCombined}
          />
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onConfirm={submitTest}
        onCancel={() => setShowSubmitModal(false)}
      />
    </div>
  );
};
