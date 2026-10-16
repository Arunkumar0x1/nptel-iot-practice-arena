import React, { useState } from 'react';
import type { QuizConfig } from '../types/quiz';
import { X, Shuffle, Clock, CheckSquare, Layers, Sparkles, Play } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c1322] rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850/40">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Configure Examination
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize testing conditions, randomization, and timers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mode Switcher */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Examination Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('week');
                  setTimeLimitMinutes(15);
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                  mode === 'week'
                    ? 'border-blue-600 dark:border-cyan-500 bg-blue-50/70 dark:bg-cyan-950/30 text-blue-950 dark:text-cyan-100 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>Week Practice</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">15 questions per week</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('combined');
                  setTimeLimitMinutes(120);
                }}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition cursor-pointer ${
                  mode === 'combined'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>12-Week Combined</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">All 180 questions</span>
              </button>
            </div>
          </div>

          {/* Week Selection dropdown */}
          {mode === 'week' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Module (Week 1 to 12)
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Week {w} (15 Questions • 15 Marks)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Shuffling Options */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Randomization & Integrity
            </label>

            {/* Shuffle Questions */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Shuffle Question Order</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Randomize question presentation</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {/* Shuffle Options */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Shuffle Answer Options</div>
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
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Examination Timer
            </label>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Enable Countdown Timer</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Auto-submits test when timer expires
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
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              {timed && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Duration:
                  </span>
                  <div className="flex items-center gap-2">
                    {mode === 'week' &&
                      [10, 15, 20, 30].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setTimeLimitMinutes(mins)}
                          className={`px-3 py-1 text-xs rounded-xl font-bold transition cursor-pointer ${
                            timeLimitMinutes === mins
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                    {mode === 'combined' &&
                      [60, 90, 120, 180].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setTimeLimitMinutes(mins)}
                          className={`px-3 py-1 text-xs rounded-xl font-bold transition cursor-pointer ${
                            timeLimitMinutes === mins
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {mins}m
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam conditions banner */}
          <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between font-mono">
            <span>
              Total: <strong>{totalQuestions} Qs</strong>
            </span>
            <span>
              Marks: <strong>{maxMarks}</strong>
            </span>
            <span>
              Answers: <strong>Hidden until submit</strong>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-md shadow-blue-900/30 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Test Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
