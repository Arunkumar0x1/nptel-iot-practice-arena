import React from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  unansweredCount,
}) => {
  const percentComplete = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
            Question
          </span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-white">
            {currentIndex + 1} <span className="text-xs font-medium text-slate-500">/ {totalQuestions}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{answeredCount} Answered</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{unansweredCount} Left</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
    </div>
  );
};
