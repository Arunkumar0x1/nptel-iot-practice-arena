import React from 'react';
import { Sun, Moon, History, FileCheck, BookOpen } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onGoHome: () => void;
  onOpenHistory: () => void;
  onOpenReport: () => void;
  isInQuiz?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onGoHome,
  onOpenHistory,
  onOpenReport,
  isInQuiz = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            if (isInQuiz) {
              if (window.confirm('Are you sure you want to exit the current test? Your progress will be lost.')) {
                onGoHome();
              }
            } else {
              onGoHome();
            }
          }}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">
                NPTEL IoT Arena
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-900/80 text-blue-200 border border-blue-700/50 rounded-full">
                IIT Kharagpur
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Practise. Improve. Master IoT.</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer"
            title="Question Bank Validation Report"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">180 Questions Verified</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition cursor-pointer"
            title="Practice History"
          >
            <History className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
