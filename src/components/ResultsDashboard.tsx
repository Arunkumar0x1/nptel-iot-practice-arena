import React, { useEffect } from 'react';
import type { QuizResult } from '../types/quiz';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Target,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsDashboardProps {
  result: QuizResult;
  onReviewAll: () => void;
  onReviewIncorrect: () => void;
  onRetakeIncorrect?: () => void;
  onRetakeAll: () => void;
  onReturnHome: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onReviewAll,
  onReviewIncorrect,
  onRetakeIncorrect,
  onRetakeAll,
  onReturnHome,
}) => {
  useEffect(() => {
    if (result.percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.percentage]);

  const isMastered = result.percentage >= 80;
  const isPassed = result.percentage >= 50;

  const formatSeconds = (sec?: number) => {
    if (!sec) return 'Untimed';
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Score Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-8 shadow-sm text-center relative overflow-hidden">
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none ${
            isMastered ? 'bg-emerald-500' : isPassed ? 'bg-blue-500' : 'bg-amber-500'
          }`}
        />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
            {result.mode === 'combined'
              ? 'Combined 12-Week Examination'
              : result.mode === 'retake_incorrect'
              ? 'Retake Review Test'
              : `Week ${result.week} Practice Assignment`}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {isMastered ? 'Outstanding Performance!' : isPassed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            You scored {result.score} out of {result.maxMarks} questions. Detailed explanations and lecture citations are now unlocked.
          </p>

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {result.percentage}
              <span className="text-3xl text-blue-600 dark:text-blue-400 font-bold">%</span>
            </div>
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {result.score} / {result.maxMarks} Marks Obtained
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {result.correctCount}
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Correct
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 flex flex-col items-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mb-1" />
              <div className="text-2xl font-black text-red-700 dark:text-red-300">
                {result.incorrectCount}
              </div>
              <div className="text-[11px] font-semibold text-red-800 dark:text-red-400 uppercase tracking-wider">
                Incorrect
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 mb-1" />
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                {result.unansweredCount}
              </div>
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Skipped
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 flex flex-col items-center">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
                {result.accuracy}%
              </div>
              <div className="text-[11px] font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                Accuracy
              </div>
            </div>
          </div>

          {result.timeTakenSeconds !== undefined && (
            <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Time taken: {formatSeconds(result.timeTakenSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {result.weekScores && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Week-wise Performance Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Detailed breakdown of your results across all 12 weeks of the curriculum.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(result.weekScores).map(([weekNum, scoreItem]) => {
              const pct = scoreItem.percentage;
              return (
                <div
                  key={weekNum}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-750/50 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Week {weekNum}
                    </span>
                    <span
                      className={`text-xs font-extrabold ${
                        pct >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : pct >= 50
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {scoreItem.score} / {scoreItem.total} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onReviewAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review All Answers</span>
          </button>

          {(result.incorrectCount > 0 || result.unansweredCount > 0) && (
            <button
              onClick={onReviewIncorrect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            >
              <span>Review Missed ({result.incorrectCount + result.unansweredCount})</span>
            </button>
          )}

          {result.incorrectCount > 0 && onRetakeIncorrect && (
            <button
              onClick={onRetakeIncorrect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Missed Questions</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Entire Test</span>
          </button>

          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white transition cursor-pointer"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
