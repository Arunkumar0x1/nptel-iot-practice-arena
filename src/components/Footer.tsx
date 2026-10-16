import React from 'react';
import { ShieldCheck, HardDrive, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">NPTEL IoT Practice Arena</span>
            <span className="text-slate-600">|</span>
            <span>Introduction to Internet of Things — IIT Kharagpur</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Offline Ready • LocalStorage Only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>No External Logins or Trackers</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center text-slate-500">
          Based on verified course assignments (Weeks 1 to 12). Designed for self-study and examination readiness.
        </div>
      </div>
    </footer>
  );
};
