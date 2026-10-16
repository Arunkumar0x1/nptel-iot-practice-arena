import React from 'react';
import type { WeekStats } from '../types/quiz';
import { Play, Settings2, CheckCircle2 } from 'lucide-react';

interface WeekCardProps {
  week: number;
  title: string;
  topicSummary: string;
  stats?: WeekStats;
  onQuickStart: (week: number) => void;
  onConfigure: (week: number) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  week,
  title,
  topicSummary,
  stats,
  onQuickStart,
  onConfigure,
}) => {
  const hasAttempted = (stats?.attemptsCount ?? 0) > 0;
  const bestScore = stats?.bestScore;
  const bestPercentage = stats?.bestPercentage;

  const isMastered = bestPercentage !== undefined && bestPercentage >= 80;

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span>Week {week}</span>
          </div>

          {hasAttempted && (
            <div
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                isMastered
                  ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {bestScore}/15 ({bestPercentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Week Title & Summary */}
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {topicSummary}
        </p>
      </div>

      <div>
        {/* Metadata info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/60 mb-4">
          <span>15 Questions • 15 Marks</span>
          <span>{hasAttempted ? `${stats?.attemptsCount} attempt${(stats?.attemptsCount ?? 0) > 1 ? 's' : ''}` : 'Untested'}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onQuickStart(week)}
            className="col-span-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice</span>
          </button>
          <button
            onClick={() => onConfigure(week)}
            className="col-span-1 flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:white bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition cursor-pointer"
            title={`Configure Week ${week} practice (timer, shuffling)`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
