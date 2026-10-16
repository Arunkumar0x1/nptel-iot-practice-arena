import React, { useEffect } from 'react';
import type { QuizResult } from '../types/quiz';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Target,
  RotateCcw,
  BookOpen,
  ArrowRight,
  BarChart3,
  Award,
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
        particleCount: 120,
        spread: 80,
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

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Performance Card */}
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] p-8 sm:p-10 shadow-sm overflow-hidden text-center transition-colors">
        {/* Subtle decorative glow */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isMastered ? 'bg-emerald-500' : isPassed ? 'bg-cyan-500' : 'bg-amber-500'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Award className="w-3.5 h-3.5 text-cyan-500" />
            <span>
              {result.mode === 'combined'
                ? 'Combined 12-Week Examination'
                : result.mode === 'retake_incorrect'
                ? 'Targeted Practice Review'
                : `Week ${result.week} Practice Assignment`}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            {isMastered
              ? 'Outstanding Mastery!'
              : isPassed
              ? 'Great Effort!'
              : 'Keep Practicing & Reinforce!'}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            You scored <strong className="text-slate-900 dark:text-white font-bold">{result.score}</strong> marks out of{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{result.maxMarks}</strong> possible marks. Detailed explanations, answer keys, and module citations are now available for review.
          </p>

          {/* Radial SVG Gauge */}
          <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={isMastered ? '#10b981' : isPassed ? '#06b6d4' : '#f59e0b'}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {result.percentage}
                <span className="text-2xl text-cyan-500 font-bold">%</span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {result.score}/{result.maxMarks} Marks
              </span>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-2xl">
            {/* Correct */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-1" />
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                {result.correctCount}
              </div>
              <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                Correct
              </div>
            </div>

            {/* Incorrect */}
            <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 flex flex-col items-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mb-1" />
              <div className="text-2xl font-black text-red-700 dark:text-red-300 font-mono">
                {result.incorrectCount}
              </div>
              <div className="text-[11px] font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">
                Incorrect
              </div>
            </div>

            {/* Skipped */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <HelpCircle className="w-5 h-5 text-slate-500 dark:text-slate-400 mb-1" />
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300 font-mono">
                {result.unansweredCount}
              </div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Skipped
              </div>
            </div>

            {/* Accuracy */}
            <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 flex flex-col items-center">
              <Target className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-1" />
              <div className="text-2xl font-black text-cyan-700 dark:text-cyan-300 font-mono">
                {result.accuracy}%
              </div>
              <div className="text-[11px] font-bold text-cyan-800 dark:text-cyan-400 uppercase tracking-wider">
                Accuracy
              </div>
            </div>
          </div>

          {result.timeTakenSeconds !== undefined && (
            <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Time Taken: {formatSeconds(result.timeTakenSeconds)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Week-wise Breakdown for Combined 12-Week Test */}
      {result.weekScores && (
        <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              12-Week Performance Diagnostic
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Detailed breakdown of your performance across each of the 12 course modules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {Object.entries(result.weekScores).map(([weekNum, scoreItem]) => {
              const pct = scoreItem.percentage;
              return (
                <div
                  key={weekNum}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                      Week {weekNum}
                    </span>
                    <span
                      className={`text-xs font-mono font-extrabold ${
                        pct >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : pct >= 50
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {scoreItem.score} / {scoreItem.total} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
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

      {/* Action Hub */}
      <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onReviewAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review All Answers</span>
          </button>

          {(result.incorrectCount > 0 || result.unansweredCount > 0) && (
            <button
              onClick={onReviewIncorrect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            >
              <span>Review Missed ({result.incorrectCount + result.unansweredCount})</span>
            </button>
          )}

          {result.incorrectCount > 0 && onRetakeIncorrect && (
            <button
              onClick={onRetakeIncorrect}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Missed Only</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeAll}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Full Test</span>
          </button>

          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white transition cursor-pointer"
          >
            <span>Home Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
