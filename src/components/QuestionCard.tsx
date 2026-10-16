import React from 'react';
import type { Question } from '../types/quiz';
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  CircleDot,
  ToggleLeft,
  RotateCcw,
  Flag,
  Send,
  HelpCircle,
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionIds: string[];
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  onSelectOption: (optionId: string) => void;
  onClearAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOptionIds = [],
  isFlagged = false,
  onToggleFlag,
  onSelectOption,
  onClearAnswer,
  onNext,
  onPrevious,
  onSubmit,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const hasSelection = selectedOptionIds.length > 0;
  const isMSQ = question.type === 'MSQ';

  return (
    <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[500px] transition-colors">
      <div>
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 font-mono">
              Week {question.week} • Q{question.number}
            </span>

            {isMSQ ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
                <span>Multiple Select (MSQ)</span>
              </span>
            ) : question.type === 'TF' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                <ToggleLeft className="w-3.5 h-3.5 text-teal-500" />
                <span>True / False</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <CircleDot className="w-3.5 h-3.5 text-blue-500" />
                <span>Single Choice (MCQ)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Flag for Review button */}
            {onToggleFlag && (
              <button
                type="button"
                onClick={onToggleFlag}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border ${
                  isFlagged
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title="Flag this question to review before submitting (Shortcut: F)"
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
              </button>
            )}

            <span className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-full border border-slate-200/80 dark:border-slate-700/60">
              {question.marks} Mark
            </span>
          </div>
        </div>

        {/* MSQ Instruction Note if applicable */}
        {isMSQ && (
          <div className="mb-5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex items-center gap-2.5 text-xs text-purple-900 dark:text-purple-200">
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>
              <strong>Multiple Select:</strong> Choose <em>all</em> options that apply. Marks are awarded only when the selected answer set exactly matches the key.
            </span>
          </div>
        )}

        {/* Question Statement */}
        <div className="text-slate-900 dark:text-slate-100 text-base sm:text-lg font-medium leading-relaxed mb-6">
          {question.question}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
          {question.options.map((option, idx) => {
            const isSelected = selectedOptionIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all duration-150 flex items-start gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 group ${
                  isSelected
                    ? 'border-cyan-600 dark:border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-50 ring-2 ring-cyan-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Letter indicator */}
                <div
                  className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-${
                    isMSQ ? 'lg' : 'full'
                  } border flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-cyan-600 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:border-slate-400'
                  }`}
                >
                  {option.id.toUpperCase()}
                </div>

                {/* Option text */}
                <div className="text-sm sm:text-base leading-normal pt-0.5 font-normal flex-1">
                  {option.text}
                </div>

                {/* Key hint */}
                <span className="hidden sm:inline-block text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-60 group-hover:opacity-100 transition-opacity">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Footer Controls */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Clear response button */}
        <div>
          {hasSelection && (
            <button
              type="button"
              onClick={onClearAnswer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Clear your answer choice (Shortcut: C)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Choice</span>
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition cursor-pointer ${
              isFirst
                ? 'opacity-35 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Previous Question (Shortcut: ←)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-md shadow-blue-900/20 hover:scale-[1.01] transition cursor-pointer"
              title="Next Question (Shortcut: →)"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 rounded-xl shadow-lg shadow-emerald-900/20 hover:scale-[1.01] transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Finish & Submit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
