import React, { useState } from 'react';
import type { QuizConfig } from '../types/quiz';
import { X, Shuffle, Clock, CheckSquare, Layers, Sparkles } from 'lucide-react';
import { saveStoredConfigPrefs } from '../utils/storage';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  initialMode: 'week' | 'combined';
  initialWeek?: number;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  initialMode,
  initialWeek = 1,
}) => {
  const [mode, setMode] = useState<'week' | 'combined'>(initialMode);
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [timed, setTimed] = useState<boolean>(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(mode === 'combined' ? 120 : 15);

  if (!isOpen) return null;

  const totalQuestions = mode === 'combined' ? 180 : 15;
  const maxMarks = totalQuestions;

  const handleStart = () => {
    const config: QuizConfig = {
      mode,
      week: mode === 'week' ? selectedWeek : undefined,
      shuffleQuestions,
      shuffleOptions,
      timed,
      timeLimitMinutes: timed ? Math.max(1, timeLimitMinutes) : 0,
    };
    saveStoredConfigPrefs({
      shuffleQuestions,
      shuffleOptions,
      timed,
      timeLimitMinutes,
    });
    onStartQuiz(config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Configure Examination</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize practice parameters and testing conditions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Practice Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('week');
                  setTimeLimitMinutes(15);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                  mode === 'week'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-900/30 text-blue-950 dark:text-blue-100'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Week Practice</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">15 questions per week</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('combined');
                  setTimeLimitMinutes(120);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                  mode === 'combined'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-900/30 text-indigo-950 dark:text-indigo-100'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Combined Test</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">All 180 questions</span>
              </button>
            </div>
          </div>

          {/* Week Selection dropdown (if in week mode) */}
          {mode === 'week' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Week (1 to 12)
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Week {w} (15 Questions)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Shuffling Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Randomization
            </label>

            {/* Shuffle Questions */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <Shuffle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Shuffle Question Order</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Randomize sequence of questions</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Shuffle Options */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Shuffle Answer Options</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Randomize option order per question</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Examination Timer
            </label>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Enable Countdown Timer</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Auto-submits when time reaches 0
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timed}
                    onChange={(e) => setTimed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {timed && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Duration (Minutes):</span>
                  <div className="flex items-center gap-2">
                    {[10, 15, 20, 30].map((mins) => (
                      mode === 'week' ? (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setTimeLimitMinutes(mins)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                            timeLimitMinutes === mins
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {mins}m
                        </button>
                      ) : null
                    ))}
                    {mode === 'combined' && [60, 90, 120, 180].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTimeLimitMinutes(mins)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
                          timeLimitMinutes === mins
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-2 py-1 text-xs text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Summary banner */}
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <span>
              Total: <strong>{totalQuestions} questions</strong>
            </span>
            <span>
              Max Marks: <strong>{maxMarks} marks</strong>
            </span>
            <span>
              Answers Hidden: <strong>Until Submit</strong>
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer"
          >
            Start Test Now
          </button>
        </div>
      </div>
    </div>
  );
};
