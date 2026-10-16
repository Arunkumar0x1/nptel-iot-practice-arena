import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Flag, X } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  unansweredCount,
  flaggedCount = 0,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;
  const hasFlagged = flaggedCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0e1626] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/70 flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/80">
            <AlertCircle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          Ready to submit your examination?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Once submitted, your final score will be recorded and all original answer keys, step-by-step explanations, and lecture citations will be unlocked.
        </p>

        {/* Audit Stats Grid */}
        <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 mb-5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Questions:</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono">{totalQuestions}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold">Attempted:</span>
            </div>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">{answeredCount}</span>
          </div>

          {hasFlagged && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Flag className="w-3.5 h-3.5" />
                <span className="font-semibold">Flagged for Review:</span>
              </div>
              <span className="font-extrabold text-amber-700 dark:text-amber-300 font-mono">{flaggedCount}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-semibold">Unanswered:</span>
            </div>
            <span className={`font-extrabold font-mono ${hasUnanswered ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {unansweredCount}
            </span>
          </div>
        </div>

        {/* Warning messages */}
        {hasUnanswered && (
          <div className="p-3 mb-5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300">
            <strong>Notice:</strong> You have {unansweredCount} unattempted {unansweredCount === 1 ? 'question' : 'questions'}. Unanswered questions receive 0 marks.
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition cursor-pointer"
          >
            Keep Reviewing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 rounded-xl shadow-md shadow-emerald-900/30 transition cursor-pointer"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};
