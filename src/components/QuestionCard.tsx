import React from 'react';
import type { Question } from '../types/quiz';
import { ChevronLeft, ChevronRight, CheckSquare, RotateCcw, Send } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOptionIds: string[];
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
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[460px]">
      <div>
        {/* Question Header Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
              Week {question.week} • Q{question.number}
            </span>

            {isMSQ ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>MSQ (Select all that apply)</span>
              </span>
            ) : question.type === 'TF' ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                True / False
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                Single Choice (MCQ)
              </span>
            )}
          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {question.marks} Mark
          </div>
        </div>

        {/* Question Statement */}
        <div className="text-slate-900 dark:text-slate-100 text-base sm:text-lg font-medium leading-relaxed mb-6">
          {question.question}
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-950 dark:text-blue-50 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/60 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-${
                    isMSQ ? 'md' : 'full'
                  } border flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {option.id.toUpperCase()}
                </div>

                <div className="text-sm sm:text-base leading-normal pt-0.5 font-normal">
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Footer Controls */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
        <div>
          {hasSelection && (
            <button
              type="button"
              onClick={onClearAnswer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Choice</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border transition cursor-pointer ${
              isFirst
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 text-slate-400'
                : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
