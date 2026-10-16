import React from 'react';
import { Sun, Moon, History, FileCheck, BookOpen, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-900/90 dark:bg-[#070d18]/90 backdrop-blur-md text-white border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            if (isInQuiz) {
              if (window.confirm('Are you sure you want to exit the current test? Your progress will be discarded.')) {
                onGoHome();
              }
            } else {
              onGoHome();
            }
          }}
          className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl p-1 transition cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" title="System Ready"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent group-hover:to-cyan-400 transition-colors">
                NPTEL IoT Arena
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 rounded-full tracking-wide">
                <Sparkles className="w-2.5 h-2.5" /> IIT Kharagpur
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Practise. Improve. Master IoT.</p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 rounded-xl transition cursor-pointer shadow-xs"
            title="Question Bank Validation Report"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">180 Questions Verified</span>
            <span className="md:hidden">180 Qs</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 rounded-xl transition cursor-pointer shadow-xs"
            title="Practice History"
          >
            <History className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/80 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer shadow-xs"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-300 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
