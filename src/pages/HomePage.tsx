import React, { useState, useMemo } from 'react';
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
  Search,
  CheckCircle,
  Clock,
  CircleDashed,
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

const WEEK_METADATA: Record<number, { title: string; topics: string; tags: string[] }> = {
  1: {
    title: 'Introduction to IoT & Sensing',
    topics: 'ITU Report 2005, Smart Dust, M2M vs IoT, Web of Things, Sensor characteristics, Hysteresis error, Hydraulic & SMP actuators',
    tags: ['ITU 2005', 'Smart Dust', 'M2M vs IoT', 'Hysteresis', 'Actuators'],
  },
  2: {
    title: 'IoT Protocols & Standards',
    topics: 'MQTT topics & wildcards, SMQTT stages, CoAP over UDP, AMQP components & frames, IEEE 802.15.4, ZigBee, 6LoWPAN, RFID',
    tags: ['MQTT', 'CoAP', 'AMQP', 'IEEE 802.15.4', 'ZigBee', '6LoWPAN'],
  },
  3: {
    title: 'Wireless Technologies & Sensors',
    topics: 'Wired HART, Z-Wave frequencies & Healing, Dumb sensor behavior, Channel Blacklisting, NFC principles, Bluetooth Piconets',
    tags: ['Wired HART', 'Z-Wave', 'NFC', 'Bluetooth', 'Piconets'],
  },
  4: {
    title: 'Sensor Networks & M2M',
    topics: 'Agricultural Intrusion Detection (AID), Nanodevice communication, Sensing coverage vs connectivity, Data mules, UAVs, SCADA vs M2M',
    tags: ['Nanodevices', 'Coverage', 'Data Mules', 'UAV Networks', 'SCADA'],
  },
  5: {
    title: 'Interoperability & Arduino',
    topics: 'Syntactic interoperability, Universal Middleware Bridge (UMB), Arduino UNO specs, sketches, random(), DHT sensor, Servo motors',
    tags: ['Interoperability', 'UMB', 'Arduino UNO', 'DHT Sensor', 'Servo'],
  },
  6: {
    title: 'Python & Raspberry Pi 3',
    topics: 'Python data types & exceptions, Sockets, Raspberry Pi 3 Model B GPIOs, Raspbian OS, CSI camera raspistill, DHT auto-cooling relay',
    tags: ['Python', 'Sockets', 'Raspberry Pi 3', 'GPIO', 'Camera'],
  },
  7: {
    title: 'Remote Logging & SDN Basics',
    topics: 'UDP sensor logging, Datalog.txt, Matplotlib real-time ion(), SDN vs traditional switches, OpenFlow origin, Northbound/Southbound APIs, SDN-WISE',
    tags: ['UDP Logging', 'Matplotlib', 'SDN', 'OpenFlow', 'SDN-WISE'],
  },
  8: {
    title: 'Software-Defined IoT & Cloud',
    topics: 'Traditional mobile network issues, ODIN agent, Mobi-Flow Markov predictor, Mininet-WiFi, NIST Cloud computing definition, IaaS/PaaS, SLA',
    tags: ['Mobi-Flow', 'Mininet-WiFi', 'Cloud Computing', 'NIST', 'IaaS / PaaS'],
  },
  9: {
    title: 'OpenStack & Sensor-Cloud',
    topics: 'OpenStack (Nova, Horizon, Devstack), Sensor-Cloud virtualization, Sensor-owner business model, CoV-I virtual sensors, Adaptive caching, Fog computing origin',
    tags: ['OpenStack', 'Devstack', 'Sensor-Cloud', 'CoV-I', 'Fog Computing'],
  },
  10: {
    title: 'Smart Cities & Connected Vehicles',
    topics: 'Smart City anatomy & focus areas, Smart parking layers, Data fusion levels & conflicts, Energy harvesting, HAN (Zigbee, X-10), V2X & DSRC',
    tags: ['Smart Cities', 'Data Fusion', 'Smart Parking', 'HAN', 'V2X & DSRC'],
  },
  11: {
    title: 'Smart Grid, IIoT & Big Data',
    topics: 'Smart grid bidirectional flow, Smart meters, Time-of-Use pricing, PMU phasor monitoring, IIoT wrap-and-re-use, Mining WSN, Veracity, HDFS Datanodes',
    tags: ['Smart Grid', 'PMU', 'IIoT', 'Big Data', 'HDFS'],
  },
  12: {
    title: 'Data Analytics & Case Studies',
    topics: 'Qualitative vs Quantitative data, ANOVA, Pearson correlation, AgriSens water management, IoT Healthcare preventive care, Activity monitoring',
    tags: ['ANOVA', 'Pearson r', 'AgriSens', 'Healthcare IoT', 'Activity Monitoring'],
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');

  // Filtered weeks
  const filteredWeeks = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1).filter((w) => {
      const meta = WEEK_METADATA[w];
      const stats = weekStats[w];
      const status = stats?.status || 'not_started';

      // Status filter
      if (filterTab !== 'all' && status !== filterTab) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = meta.title.toLowerCase().includes(query);
        const matchesTopics = meta.topics.toLowerCase().includes(query);
        const matchesTags = meta.tags.some((t) => t.toLowerCase().includes(query));
        const matchesWeek = `week ${w}`.includes(query) || `${w}` === query;
        return matchesTitle || matchesTopics || matchesTags || matchesWeek;
      }

      return true;
    });
  }, [filterTab, searchQuery, weekStats]);

  // Counts for filter pills
  const counts = useMemo(() => {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    for (let w = 1; w <= 12; w++) {
      const s = weekStats[w]?.status || 'not_started';
      if (s === 'completed') completed++;
      else if (s === 'in_progress') inProgress++;
      else notStarted++;
    }
    return { all: 12, completed, in_progress: inProgress, not_started: notStarted };
  }, [weekStats]);

  // Determine next uncompleted week to recommend
  const nextRecommendedWeek = useMemo(() => {
    for (let w = 1; w <= 12; w++) {
      if (weekStats[w]?.status !== 'completed') {
        return w;
      }
    }
    return 1;
  }, [weekStats]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-950 text-white p-8 sm:p-12 border border-slate-800/80 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>NPTEL Online Certification • IIT Kharagpur</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Introduction to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Internet of Things
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Master all 12 assignment weeks with the complete, verified 180-question curriculum bank.
              Simulate real examination conditions with untimed practice or timers, zero answer leakage, and detailed post-submission solutions.
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartWeekQuick(nextRecommendedWeek)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-950/40 hover:scale-[1.02] transition cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>
                  {weekStats[nextRecommendedWeek]?.status === 'in_progress'
                    ? `Continue Week ${nextRecommendedWeek}`
                    : `Start Week ${nextRecommendedWeek} Practice`}
                </span>
              </button>

              <button
                onClick={onStartCombined}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 rounded-2xl shadow-md hover:scale-[1.02] transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>12-Week Combined Exam (180 Qs)</span>
              </button>
            </div>
          </div>

          {/* Readiness Gauge Widget */}
          <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 text-center flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Curriculum Mastery
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight mb-1">
              {overallStats.overallReadinessPercentage}
              <span className="text-2xl text-cyan-400 font-bold">%</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              {overallStats.masteredWeeksCount} of 12 modules mastered ($\ge 80\%$)
            </p>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-4 border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, overallStats.overallReadinessPercentage)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 w-full text-left text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Completed</span>
                <span className="font-bold text-emerald-400">{counts.completed} Weeks</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">In Progress</span>
                <span className="font-bold text-amber-400">{counts.in_progress} Weeks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Tests */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 flex items-center justify-center text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/60">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {overallStats.totalAttempts}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Tests Completed</div>
          </div>
        </div>

        {/* Mastered Modules */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {overallStats.masteredWeeksCount} / 12
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Modules Mastered</div>
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {overallStats.averageScorePercentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Average Accuracy</div>
          </div>
        </div>

        {/* Best Full Score */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 flex items-center justify-center text-amber-500 border border-amber-200 dark:border-amber-900/60">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {overallStats.bestCombinedScore
                ? `${overallStats.bestCombinedScore.score}/180`
                : '180 Qs'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              {overallStats.bestCombinedScore
                ? `Best Full (${overallStats.bestCombinedScore.percentage}%)`
                : 'Full Bank Verified'}
            </div>
          </div>
        </div>
      </div>

      {/* 12 Modules Section with Search and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Curriculum Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any assignment week to practise its 15 verified questions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search topics (e.g. MQTT, Arduino)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>All Weeks</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700/60">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mastered</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {counts.completed}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'in_progress'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>In Progress</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {counts.in_progress}
            </span>
          </button>

          <button
            onClick={() => setFilterTab('not_started')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'not_started'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <CircleDashed className="w-3.5 h-3.5 text-slate-400" />
            <span>Not Started</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700">
              {counts.not_started}
            </span>
          </button>
        </div>

        {/* 12 Weekly Cards Grid */}
        {filteredWeeks.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1322] rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">No modules found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No course weeks match "{searchQuery}". Try searching for another topic or clear the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterTab('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWeeks.map((w) => {
              const meta = WEEK_METADATA[w];
              const stats = weekStats[w];
              return (
                <WeekCard
                  key={w}
                  week={w}
                  title={meta?.title || `Week ${w} Assignment`}
                  topicSummary={meta?.topics || 'IoT Concepts, Architecture, and Protocols'}
                  tags={meta?.tags || []}
                  stats={stats}
                  onQuickStart={onStartWeekQuick}
                  onConfigure={onConfigureWeek}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Practice Attempts Preview */}
      {recentHistory.length > 0 && (
        <div className="bg-white dark:bg-[#0c1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Practice Attempts
              </h3>
            </div>
            <button
              onClick={onOpenHistory}
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full History ({recentHistory.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {recentHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.mode === 'combined'
                        ? 'Combined 12-Week'
                        : item.mode === 'retake_incorrect'
                        ? 'Retake Practice'
                        : `Week ${item.week}`}
                    </span>
                    <span
                      className={`font-mono font-black ${
                        item.percentage >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : item.percentage >= 50
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.score}/{item.maxMarks} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Accuracy: {item.accuracy}% • {item.correctCount} correct
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => onSelectAttempt(item)}
                    className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
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
