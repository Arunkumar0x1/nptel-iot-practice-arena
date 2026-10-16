import React from 'react';
import type { QuizResult } from '../types/quiz';
import { X, History, Trash2, Calendar, ArrowRight } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  history: QuizResult[];
  onClose: () => void;
  onClearHistory: () => void;
  onSelectAttempt?: (result: QuizResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onClearHistory,
  onSelectAttempt,
}) => {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all practice history? This cannot be undone.')) {
      onClearHistory();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Practice History</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {history.length} completed attempt{history.length !== 1 ? 's' : ''} stored locally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                title="Clear all saved history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No attempts yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Complete a week practice or combined test and your score breakdown will appear here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const isHigh = item.percentage >= 80;
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-750/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        {item.mode === 'combined'
                          ? 'Combined 12-Week Test'
                          : item.mode === 'retake_incorrect'
                          ? 'Retake Missed'
                          : `Week ${item.week} Practice`}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3 pt-1">
                      <span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{item.correctCount}</strong> correct
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-red-600 dark:text-red-400 font-bold">{item.incorrectCount}</strong> incorrect
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-500 font-bold">{item.unansweredCount}</strong> skipped
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div
                        className={`text-lg font-black ${
                          isHigh
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : item.percentage >= 50
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.score} / {item.maxMarks}
                        <span className="text-xs font-medium ml-1">({item.percentage}%)</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Accuracy: {item.accuracy}%
                      </div>
                    </div>

                    {onSelectAttempt && (
                      <button
                        onClick={() => {
                          onSelectAttempt(item);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Data stored locally in your browser LocalStorage</span>
          <span>No cloud synchronization needed</span>
        </div>
      </div>
    </div>
  );
};
