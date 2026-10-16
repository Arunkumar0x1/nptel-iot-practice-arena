import React from 'react';
import type { WeekStats } from '../types/quiz';
import { Play, Settings2, Trophy, Clock } from 'lucide-react';

interface WeekCardProps {
  week: number;
  title: string;
  topicSummary: string;
  tags?: string[];
  stats?: WeekStats;
  onQuickStart: (week: number) => void;
  onConfigure: (week: number) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  week,
  title,
  topicSummary,
  tags = [],
  stats,
  onQuickStart,
  onConfigure,
}) => {
  const status = stats?.status || 'not_started';
  const hasAttempted = (stats?.attemptsCount ?? 0) > 0;
  const bestScore = stats?.bestScore;
  const bestPercentage = stats?.bestPercentage ?? 0;

  // Visual status styling
  let statusBadge = (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Not Started
    </span>
  );

  let borderHighlight = 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/40';

  if (status === 'completed') {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
        <Trophy className="w-3 h-3 text-emerald-500" />
        Mastered ({bestScore}/15 • {bestPercentage}%)
      </span>
    );
    borderHighlight = 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400';
  } else if (status === 'in_progress') {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
        <Clock className="w-3 h-3 text-amber-500" />
        In Progress ({bestScore}/15 • {bestPercentage}%)
      </span>
    );
    borderHighlight = 'border-amber-200 dark:border-amber-900/60 hover:border-amber-400';
  }

  return (
    <div
      className={`relative rounded-3xl border bg-white dark:bg-[#0c1322] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group ${borderHighlight}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80">
              {week.toString().padStart(2, '0')}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Week {week}
            </span>
          </div>
          <div>{statusBadge}</div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>

        {/* Topic Summary */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {topicSummary}
        </p>

        {/* Topic Chips */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Progress Mini Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
            <span>15 Questions • 15 Marks</span>
            <span className="font-semibold">
              {hasAttempted
                ? `${stats?.attemptsCount} attempt${(stats?.attemptsCount ?? 0) > 1 ? 's' : ''}`
                : 'Not attempted'}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : status === 'in_progress'
                  ? 'bg-gradient-to-r from-amber-500 to-cyan-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              style={{ width: `${Math.max(5, bestPercentage)}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onQuickStart(week)}
            className="col-span-4 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 active:from-blue-700 active:to-cyan-700 rounded-xl shadow-md shadow-blue-900/20 hover:scale-[1.01] transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{hasAttempted ? 'Practice Again' : 'Start Practice'}</span>
          </button>

          <button
            onClick={() => onConfigure(week)}
            className="col-span-1 flex items-center justify-center p-2.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer"
            title={`Configure Week ${week} practice (timer, shuffling)`}
            aria-label={`Configure Week ${week}`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
