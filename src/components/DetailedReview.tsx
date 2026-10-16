import React, { useState } from 'react';
import type { Question, UserAnswers, QuizResult } from '../types/quiz';
import { isQuestionCorrect } from '../utils/scoring';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Compass,
  ArrowLeft,
  Home,
} from 'lucide-react';

interface DetailedReviewProps {
  questions: Question[];
  result: QuizResult;
  initialFilter?: 'all' | 'incorrect';
  onBackToResults: () => void;
  onReturnHome: () => void;
}

export const DetailedReview: React.FC<DetailedReviewProps> = ({
  questions,
  result,
  initialFilter = 'all',
  onBackToResults,
  onReturnHome,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>(initialFilter);
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);

  const userAnswers: UserAnswers = result.userAnswers;

  const filteredQuestions = questions.filter((q) => {
    const userAns = userAnswers[q.id];
    const isCorrect = isQuestionCorrect(q, userAns);
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  const activeQuestion = filteredQuestions[currentReviewIndex] || filteredQuestions[0];
  const actualIndexInFullList = activeQuestion
    ? questions.findIndex((q) => q.id === activeQuestion.id)
    : 0;

  if (!activeQuestion) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto">
        <p className="text-slate-600 dark:text-slate-300 mb-4">No questions match the current filter.</p>
        <button
          onClick={() => setFilter('all')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Show All Questions
        </button>
      </div>
    );
  }

  const selectedOptionIds = userAnswers[activeQuestion.id] || [];
  const isAttempted = selectedOptionIds.length > 0;
  const isCorrect = isQuestionCorrect(activeQuestion, selectedOptionIds);
  const correctOptionIds = activeQuestion.correctAnswers.map((a) => a.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Review Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToResults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Score Summary</span>
          </button>
          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentReviewIndex(0);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => {
              setFilter('incorrect');
              setCurrentReviewIndex(0);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === 'incorrect'
                ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
            }`}
          >
            Missed ({result.incorrectCount + result.unansweredCount})
          </button>
          <button
            onClick={() => {
              setFilter('correct');
              setCurrentReviewIndex(0);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              filter === 'correct'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            Correct ({result.correctCount})
          </button>
        </div>
      </div>

      {/* Quick Navigation Palette in Review Mode */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold">
          <span>Question Navigation ({filteredQuestions.length} shown)</span>
          <span>
            {currentReviewIndex + 1} of {filteredQuestions.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {filteredQuestions.map((q, idx) => {
            const userAns = userAnswers[q.id];
            const qCorrect = isQuestionCorrect(q, userAns);
            const qAttempted = userAns && userAns.length > 0;
            const isCur = idx === currentReviewIndex;

            let badgeClass = 'w-7 h-7 rounded-lg text-xs font-bold border flex items-center justify-center transition cursor-pointer ';

            if (isCur) {
              badgeClass += 'ring-2 ring-blue-500 scale-105 z-10 ';
            }

            if (!qAttempted) {
              badgeClass += 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300';
            } else if (qCorrect) {
              badgeClass += 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300';
            } else {
              badgeClass += 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentReviewIndex(idx)}
                className={badgeClass}
                title={`Q${idx + 1}: ${qCorrect ? 'Correct' : qAttempted ? 'Incorrect' : 'Unanswered'}`}
              >
                {actualIndexInFullList + 1 === questions.findIndex((x) => x.id === q.id) + 1
                  ? questions.findIndex((x) => x.id === q.id) + 1
                  : questions.findIndex((x) => x.id === q.id) + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Review Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
              Week {activeQuestion.week} • Q{activeQuestion.number}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {activeQuestion.type}
            </span>
          </div>

          {isCorrect ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct (+{activeQuestion.marks} mark)</span>
            </div>
          ) : isAttempted ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
              <XCircle className="w-4 h-4" />
              <span>Incorrect (0 marks)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Unanswered (0 marks)</span>
            </div>
          )}
        </div>

        <div className="text-slate-900 dark:text-white text-base sm:text-lg font-medium leading-relaxed mb-6">
          {activeQuestion.question}
        </div>

        <div className="space-y-3 mb-8">
          {activeQuestion.options.map((option) => {
            const isUserSelected = selectedOptionIds.includes(option.id);
            const isAnswerKey = correctOptionIds.includes(option.id.toLowerCase());

            let optStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300';
            let badgeStyle = 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
            let label = null;

            if (isAnswerKey && isUserSelected) {
              optStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              label = (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer (Your Choice)
                </span>
              );
            } else if (isAnswerKey && !isUserSelected) {
              optStyle = 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100 border-dashed';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
              label = (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer (Missed)
                </span>
              );
            } else if (!isAnswerKey && isUserSelected) {
              optStyle = 'border-red-400 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-100 ring-2 ring-red-500/20';
              badgeStyle = 'bg-red-600 text-white border-red-600';
              label = (
                <span className="text-[11px] font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Your Choice (Incorrect)
                </span>
              );
            }

            return (
              <div
                key={option.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${optStyle}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-${
                      activeQuestion.type === 'MSQ' ? 'md' : 'full'
                    } border flex items-center justify-center font-mono text-xs font-bold ${badgeStyle}`}
                  >
                    {option.id.toUpperCase()}
                  </div>
                  <div className="text-sm sm:text-base leading-normal">{option.text}</div>
                </div>

                {label && <div className="sm:text-right pl-9 sm:pl-0">{label}</div>}
              </div>
            );
          })}
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          {activeQuestion.explanation && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Detailed Solution</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          {activeQuestion.lectureReference && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Compass className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>
                <strong>Lecture Reference:</strong> {activeQuestion.lectureReference}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <button
            onClick={() => setCurrentReviewIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentReviewIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition cursor-pointer ${
              currentReviewIndex === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Question</span>
          </button>

          <span className="text-xs font-medium text-slate-500">
            {currentReviewIndex + 1} of {filteredQuestions.length}
          </span>

          <button
            onClick={() =>
              setCurrentReviewIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))
            }
            disabled={currentReviewIndex === filteredQuestions.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition cursor-pointer ${
              currentReviewIndex === filteredQuestions.length - 1
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
