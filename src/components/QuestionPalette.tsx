import React, { useState } from 'react';
import type { Question, UserAnswers } from '../types/quiz';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: UserAnswers;
  onSelectIndex: (index: number) => void;
  isCombined?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onSelectIndex,
  isCombined = false,
}) => {
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const filteredIndices = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => (selectedWeekFilter === 'all' ? true : q.week === selectedWeekFilter));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Question Palette
          </h4>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="sm:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Toggle Question Palette"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {isCombined && (
            <div className="mb-3">
              <select
                value={selectedWeekFilter}
                onChange={(e) => setSelectedWeekFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Show All 12 Weeks (180)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Week {w} (Questions {(w - 1) * 15 + 1} - {w * 15})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-1.5 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
            {filteredIndices.map(({ q, idx }) => {
              const isAnswered = Array.isArray(userAnswers[q.id]) && userAnswers[q.id].length > 0;
              const isCurrent = currentIndex === idx;

              let btnClasses = 'border text-xs font-semibold rounded-lg flex items-center justify-center h-8 transition relative cursor-pointer ';

              if (isCurrent) {
                btnClasses += 'border-blue-600 bg-blue-600 text-white shadow-xs scale-105 z-10 ring-2 ring-blue-300 dark:ring-blue-900';
              } else if (isAnswered) {
                btnClasses += 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100';
              } else {
                btnClasses += 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={btnClasses}
                  title={`Question ${idx + 1} (${q.type}) - ${isAnswered ? 'Answered' : 'Unanswered'}`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered && !isCurrent && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-3 gap-1 text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600"></span>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700"></span>
              <span>Unanswered</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
