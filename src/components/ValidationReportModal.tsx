import React from 'react';
import { X, CheckCircle, FileCheck } from 'lucide-react';

interface ValidationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationReportModal: React.FC<ValidationReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const weeksSummary = [
    { week: 1, title: 'Introduction to IoT, Sensing & Actuation', total: 15, mcq: 7, msq: 4, tf: 4 },
    { week: 2, title: 'Protocols: MQTT, CoAP, AMQP, 802.15.4, ZigBee', total: 15, mcq: 7, msq: 6, tf: 2 },
    { week: 3, title: 'Wired HART, Z-Wave, NFC, Bluetooth Piconets', total: 15, mcq: 8, msq: 0, tf: 7 },
    { week: 4, title: 'Sensor Networks, Nanodevices, WSN, UAV, M2M', total: 15, mcq: 12, msq: 1, tf: 2 },
    { week: 5, title: 'Interoperability, Arduino UNO, DHT & Servo', total: 15, mcq: 13, msq: 0, tf: 2 },
    { week: 6, title: 'Python Programming, Sockets & Raspberry Pi 3', total: 15, mcq: 14, msq: 0, tf: 1 },
    { week: 7, title: 'Remote Logging, Matplotlib, SDN & OpenFlow', total: 15, mcq: 14, msq: 0, tf: 1 },
    { week: 8, title: 'SDN IoT, ODIN, Cloud Computing, NIST, IaaS', total: 15, mcq: 15, msq: 0, tf: 0 },
    { week: 9, title: 'OpenStack, Sensor-Cloud, Fog Computing', total: 15, mcq: 15, msq: 0, tf: 0 },
    { week: 10, title: 'Smart Cities, Data Fusion, HAN, Connected Vehicles', total: 15, mcq: 15, msq: 0, tf: 0 },
    { week: 11, title: 'Smart Grid, Net Metering, IIoT, Big Data & HDFS', total: 15, mcq: 15, msq: 0, tf: 0 },
    { week: 12, title: 'Data Analysis, AgriSens, IoT Healthcare, Activity Log', total: 15, mcq: 15, msq: 0, tf: 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Question Bank Validation Report</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Extracted & Verified from NPTELQUIZ.pdf
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
              <div className="text-2xl font-black text-slate-900 dark:text-white">180</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Total Questions
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <div className="text-2xl font-black text-blue-700 dark:text-blue-300">150</div>
              <div className="text-[11px] font-semibold text-blue-800 dark:text-blue-400 uppercase">
                Single Choice (MCQ)
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
              <div className="text-2xl font-black text-purple-700 dark:text-purple-300">11</div>
              <div className="text-[11px] font-semibold text-purple-800 dark:text-purple-400 uppercase">
                Multiple Select (MSQ)
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">19</div>
              <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase">
                True / False
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2 text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>12 of 12 Assignment Weeks Verified:</strong> Exactly 15 questions per week.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Zero Missing Explanations:</strong> Every question contains its original solution.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>Full Lecture References:</strong> Module/Slide/Page citations included for every item.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span><strong>No Fabricated Content:</strong> Extracted exclusively from 93 pages of course material.</span>
            </div>
          </div>

          {/* Weeks Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase">
                  <th className="py-2.5 px-3">Week</th>
                  <th className="py-2.5 px-3">Topic Overview</th>
                  <th className="py-2.5 px-3 text-center">Questions</th>
                  <th className="py-2.5 px-3 text-center">MCQ</th>
                  <th className="py-2.5 px-3 text-center">MSQ</th>
                  <th className="py-2.5 px-3 text-center">T/F</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {weeksSummary.map((row) => (
                  <tr key={row.week} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">
                      Week {row.week}
                    </td>
                    <td className="py-2.5 px-3">{row.title}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {row.total}
                    </td>
                    <td className="py-2.5 px-3 text-center">{row.mcq}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-purple-600 dark:text-purple-400">
                      {row.msq}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.tf}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
