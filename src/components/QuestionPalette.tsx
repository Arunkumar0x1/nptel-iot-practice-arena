import React, { useState } from 'react';
import type { Question, UserAnswers, FlaggedQuestions } from '../types/quiz';
import { LayoutGrid, ChevronDown, ChevronUp, Flag, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: UserAnswers;
  flaggedQuestions?: FlaggedQuestions;
  onSelectIndex: (index: number) => void;
  onJumpToNextUnanswered?: () => void;
  isCombined?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  userAnswers,
  flaggedQuestions = {},
  onSelectIndex,
  onJumpToNextUnanswered,
  isCombined = false,
}) => {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'flagged' | 'answered'>('all');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Filter by week (for combined) AND status
  const filteredIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => (selectedWeekFilter === 'all' ? true : q.week === selectedWeekFilter))
    .filter(({ q }) => {
      const isAnswered = Array.isArray(userAnswers[q.id]) && userAnswers[q.id].length > 0;
      const isFlagged = Boolean(flaggedQuestions[q.id]);

      if (statusFilter === 'answered') return isAnswered;
      if (statusFilter === 'unanswered') return !isAnswered;
      if (statusFilter === 'flagged') return isFlagged;
      return true;
    });

  const totalAnswered = Object.values(userAnswers).filter((ans) => ans && ans.length > 0).length;
  const totalFlagged = Object.values(flaggedQuestions).filter(Boolean).length;
  const totalUnanswered = questions.length - totalAnswered;

  return (
    <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Question Palette
          </h4>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sm:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          aria-label="Toggle Question Palette"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Status summary pills */}
          <div className="grid grid-cols-3 gap-1.5 mb-3.5 text-center">
            <button
              onClick={() => setStatusFilter(statusFilter === 'answered' ? 'all' : 'answered')}
              className={`p-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer flex flex-col items-center ${
                statusFilter === 'answered'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{totalAnswered}</span>
              </div>
              <span className="text-[10px] opacity-75">Answered</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'flagged' ? 'all' : 'flagged')}
              className={`p-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer flex flex-col items-center ${
                statusFilter === 'flagged'
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-amber-600 dark:text-amber-400">
                <Flag className="w-3.5 h-3.5" />
                <span>{totalFlagged}</span>
              </div>
              <span className="text-[10px] opacity-75">Flagged</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'unanswered' ? 'all' : 'unanswered')}
              className={`p-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer flex flex-col items-center ${
                statusFilter === 'unanswered'
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs text-slate-700 dark:text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>{totalUnanswered}</span>
              </div>
              <span className="text-[10px] opacity-75">Left</span>
            </button>
          </div>

          {/* Quick jump to next unanswered */}
          {totalUnanswered > 0 && onJumpToNextUnanswered && (
            <button
              onClick={onJumpToNextUnanswered}
              className="w-full mb-3 px-3 py-1.5 rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/60 dark:bg-cyan-950/30 text-cyan-800 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/50 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Jump to Next Unanswered</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Week Selector in Combined Mode */}
          {isCombined && (
            <div className="mb-3 space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Week
              </label>
              <select
                value={selectedWeekFilter}
                onChange={(e) => setSelectedWeekFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All 12 Weeks (180 Questions)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Week {w} (Questions {(w - 1) * 15 + 1} - {w * 15})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
            {filteredIndices.map(({ q, idx }) => {
              const isAnswered = Array.isArray(userAnswers[q.id]) && userAnswers[q.id].length > 0;
              const isFlagged = Boolean(flaggedQuestions[q.id]);
              const isCurrent = currentIndex === idx;

              let btnStyle =
                'h-9 rounded-xl text-xs font-mono font-bold border transition-all relative flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ';

              if (isCurrent) {
                btnStyle +=
                  'border-cyan-500 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30 scale-105 z-10 ring-2 ring-cyan-300 dark:ring-cyan-700';
              } else if (isFlagged) {
                btnStyle +=
                  'border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 hover:bg-amber-100';
              } else if (isAnswered) {
                btnStyle +=
                  'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100';
              } else {
                btnStyle +=
                  'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={btnStyle}
                  title={`Question ${idx + 1} • ${
                    isFlagged ? 'Flagged for Review' : isAnswered ? 'Answered' : 'Unanswered'
                  }`}
                >
                  <span>{idx + 1}</span>

                  {/* Corner indicator dots */}
                  {isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900"></span>
                  )}
                  {isAnswered && !isFlagged && !isCurrent && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Legend */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-600"></span>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
              <span>Flagged</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
