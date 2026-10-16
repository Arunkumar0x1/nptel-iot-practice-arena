import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, X } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  totalQuestions,
  answeredCount,
  unansweredCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Ready to submit your test?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Once submitted, your final score will be computed and all answers, explanations, and lecture references will be unlocked.
        </p>

        {/* Breakdown Card */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Questions:</span>
            <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">Questions Attempted:</span>
            </div>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{answeredCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span className="font-medium">Unanswered:</span>
            </div>
            <span className={`font-bold ${hasUnanswered ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {unansweredCount}
            </span>
          </div>
        </div>

        {hasUnanswered && (
          <div className="p-3 mb-6 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
            <strong>Notice:</strong> You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. Unanswered questions receive 0 marks.
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition"
          >
            Return to Test
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md transition"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
  );
};
