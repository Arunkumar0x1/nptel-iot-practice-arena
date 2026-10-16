import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  remainingSeconds: number;
}

export const Timer: React.FC<TimerProps> = ({ remainingSeconds }) => {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isUrgent = remainingSeconds <= 120; // 2 minutes or less

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const formattedTime =
    hours > 0
      ? `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
      : `${formatNumber(minutes)}:${formatNumber(seconds)}`;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
        isUrgent
          ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 animate-pulse shadow-xs'
          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
      }`}
      role="timer"
      aria-live="polite"
      title={isUrgent ? 'Less than 2 minutes remaining!' : 'Time Remaining'}
    >
      {isUrgent ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
      <span>{formattedTime}</span>
    </div>
  );
};
