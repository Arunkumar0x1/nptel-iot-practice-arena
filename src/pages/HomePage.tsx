import React from 'react';
import type { QuizResult, WeekStats, OverallStats } from '../types/quiz';
import { WeekCard } from '../components/WeekCard';
import {
  Sparkles,
  Layers,
  Award,
  Target,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';

interface HomePageProps {
  onStartWeekQuick: (week: number) => void;
  onConfigureWeek: (week: number) => void;
  onStartCombined: () => void;
  weekStats: Record<number, WeekStats>;
  overallStats: OverallStats;
  recentHistory: QuizResult[];
  onOpenHistory: () => void;
  onSelectAttempt: (result: QuizResult) => void;
}

const WEEK_METADATA: Record<number, { title: string; topics: string }> = {
  1: {
    title: 'Introduction to IoT & Sensing',
    topics: 'ITU Report 2005, Smart Dust, M2M vs IoT, Web of Things, Sensor characteristics & Hysteresis, Hydraulic & SMP actuators',
  },
  2: {
    title: 'IoT Protocols & Standards',
    topics: 'MQTT topics & wildcards, SMQTT stages, CoAP over UDP, AMQP components & frames, IEEE 802.15.4, ZigBee, 6LoWPAN, RFID',
  },
  3: {
    title: 'Wireless Technologies & Sensors',
    topics: 'Wired HART, Z-Wave frequencies & Healing, Dumb sensor behavior, Channel Blacklisting, NFC principles, Bluetooth Piconets',
  },
  4: {
    title: 'Sensor Networks & M2M',
    topics: 'Agricultural Intrusion Detection (AID), Nanodevice communication, Sensing coverage vs connectivity, Data mules, UAVs, SCADA vs M2M',
  },
  5: {
    title: 'Interoperability & Arduino',
    topics: 'Syntactic interoperability, Universal Middleware Bridge (UMB), Arduino UNO specs, sketches, random(), DHT sensor, Servo motors',
  },
  6: {
    title: 'Python & Raspberry Pi 3',
    topics: 'Python data types & exceptions, Sockets, Raspberry Pi 3 Model B GPIOs, Raspbian OS, CSI camera raspistill, DHT auto-cooling relay',
  },
  7: {
    title: 'Remote Logging & SDN Basics',
    topics: 'UDP sensor logging, Datalog.txt, Matplotlib real-time ion(), SDN vs traditional switches, OpenFlow origin, Northbound/Southbound APIs, SDN-WISE',
  },
  8: {
    title: 'Software-Defined IoT & Cloud',
    topics: 'Traditional mobile network issues, ODIN agent, Mobi-Flow Markov predictor, Mininet-WiFi, NIST Cloud computing definition, IaaS/PaaS, SLA',
  },
  9: {
    title: 'OpenStack & Sensor-Cloud',
    topics: 'OpenStack (Nova, Horizon, Devstack), Sensor-Cloud virtualization, Sensor-owner business model, CoV-I virtual sensors, Adaptive caching, Fog computing origin',
  },
  10: {
    title: 'Smart Cities & Connected Vehicles',
    topics: 'Smart City anatomy & focus areas, Smart parking layers, Data fusion levels & conflicts, Energy harvesting, HAN (Zigbee, X-10), V2X & DSRC',
  },
  11: {
    title: 'Smart Grid, IIoT & Big Data',
    topics: 'Smart grid bidirectional flow, Smart meters, Time-of-Use pricing, PMU phasor monitoring, IIoT wrap-and-re-use, Mining WSN, Veracity, HDFS Datanodes',
  },
  12: {
    title: 'Data Analytics & Case Studies',
    topics: 'Qualitative vs Quantitative data, ANOVA, Pearson correlation, AgriSens water management, IoT Healthcare preventive care, Activity monitoring',
  },
};

export const HomePage: React.FC<HomePageProps> = ({
  onStartWeekQuick,
  onConfigureWeek,
  onStartCombined,
  weekStats,
  overallStats,
  recentHistory,
  onOpenHistory,
  onSelectAttempt,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/60 border border-blue-700/60 text-blue-300">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>NPTEL Online Certification • IIT Kharagpur</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Introduction to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Internet of Things
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Practice and master all 12 weekly assignment modules with the verified 180-question bank.
            Simulate real examination conditions with untimed practice or countdown timers, zero immediate answers, and detailed post-test solutions.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartWeekQuick(1)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-900/40 hover:scale-[1.02] transition cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Start Week 1 Practice</span>
            </button>

            <button
              onClick={onStartCombined}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-950/40 hover:scale-[1.02] transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>12-Week Combined Test (180 Qs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallStats.totalAttempts}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tests Completed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallStats.totalCorrect}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Correct Out of {overallStats.totalQuestionsAttempted}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallStats.averageScorePercentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average Score</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overallStats.bestCombinedScore
                ? `${overallStats.bestCombinedScore.score}/180`
                : '180 Qs'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {overallStats.bestCombinedScore
                ? `Best Full (${overallStats.bestCombinedScore.percentage}%)`
                : 'Complete Bank Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* 12 Weekly Assignment Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Assignment Modules</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each weekly test comprises 15 verified questions worth 1 mark each.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onStartCombined}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Practice All 12 Weeks Combined</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
            const meta = WEEK_METADATA[w];
            const stats = weekStats[w];
            return (
              <WeekCard
                key={w}
                week={w}
                title={meta?.title || `Week ${w} Assignment`}
                topicSummary={meta?.topics || 'IoT Concepts, Architecture, and Protocols'}
                stats={stats}
                onQuickStart={onStartWeekQuick}
                onConfigure={onConfigureWeek}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Attempts Preview (if available) */}
      {recentHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Practice Attempts
              </h3>
            </div>
            <button
              onClick={onOpenHistory}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.mode === 'combined'
                        ? 'Combined Test'
                        : item.mode === 'retake_incorrect'
                        ? 'Retake Missed'
                        : `Week ${item.week}`}
                    </span>
                    <span
                      className={`font-black ${
                        item.percentage >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : item.percentage >= 50
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.score}/{item.maxMarks} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Accuracy: {item.accuracy}% • {item.correctCount} correct
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => onSelectAttempt(item)}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
