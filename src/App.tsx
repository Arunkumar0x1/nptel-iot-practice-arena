import { useState, useMemo } from 'react';
import questionsDataRaw from './data/questions.json';
import type { Question, QuizConfig, QuizResult } from './types/quiz';
import { useTheme } from './hooks/useTheme';
import {
  getStoredHistory,
  clearStoredHistory,
  calculateWeekStats,
  calculateOverallStats,
  getStoredConfigPrefs,
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { QuizConfigModal } from './components/QuizConfigModal';
import { HistoryModal } from './components/HistoryModal';
import { ValidationReportModal } from './components/ValidationReportModal';
import { DetailedReview } from './components/DetailedReview';

export function App() {
  const { theme, toggleTheme } = useTheme();

  // All 180 questions verified from NPTELQUIZ.pdf
  const allQuestions = questionsDataRaw as Question[];

  // App routing & active test state
  const [activePage, setActivePage] = useState<'home' | 'quiz' | 'review_history'>('home');
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizConfig | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);

  // Modals state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [configModalMode, setConfigModalMode] = useState<'week' | 'combined'>('week');
  const [configModalWeek, setConfigModalWeek] = useState<number>(1);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // History and Stats state
  const [history, setHistory] = useState<QuizResult[]>(() => getStoredHistory());
  const [reviewAttempt, setReviewAttempt] = useState<QuizResult | null>(null);

  // Refresh history whenever it changes
  const refreshHistory = () => {
    setHistory(getStoredHistory());
  };

  const weekStats = useMemo(() => calculateWeekStats(history), [history]);
  const overallStats = useMemo(() => calculateOverallStats(history), [history]);

  // Launch a week-wise test with default or stored prefs
  const handleStartWeekQuick = (week: number) => {
    const prefs = getStoredConfigPrefs();
    const weekQuestions = allQuestions.filter((q) => q.week === week);

    const config: QuizConfig = {
      mode: 'week',
      week,
      shuffleQuestions: prefs.shuffleQuestions ?? false,
      shuffleOptions: prefs.shuffleOptions ?? false,
      timed: prefs.timed ?? false,
      timeLimitMinutes: prefs.timeLimitMinutes ?? 15,
    };

    setActiveQuizConfig(config);
    setActiveQuizQuestions(weekQuestions);
    setActivePage('quiz');
  };

  // Open config modal for a specific week
  const handleConfigureWeek = (week: number) => {
    setConfigModalMode('week');
    setConfigModalWeek(week);
    setIsConfigModalOpen(true);
  };

  // Open config modal or launch combined test
  const handleStartCombined = () => {
    setConfigModalMode('combined');
    setIsConfigModalOpen(true);
  };

  // Launch test from configuration modal
  const handleLaunchConfiguredQuiz = (config: QuizConfig) => {
    setIsConfigModalOpen(false);

    let selectedQuestions: Question[] = [];
    if (config.mode === 'combined') {
      selectedQuestions = [...allQuestions];
    } else if (config.week) {
      selectedQuestions = allQuestions.filter((q) => q.week === config.week);
    }

    setActiveQuizConfig(config);
    setActiveQuizQuestions(selectedQuestions);
    setActivePage('quiz');
  };

  // Retake quiz (used from Results screen)
  const handleRetakeQuiz = (config: QuizConfig, customQuestions?: Question[]) => {
    let questionsToUse = customQuestions;
    if (!questionsToUse) {
      if (config.mode === 'combined') {
        questionsToUse = [...allQuestions];
      } else if (config.week) {
        questionsToUse = allQuestions.filter((q) => q.week === config.week);
      } else {
        questionsToUse = [...allQuestions];
      }
    }

    setActiveQuizConfig(config);
    setActiveQuizQuestions(questionsToUse);
    setActivePage('quiz');
    refreshHistory();
  };

  // Clear history handler
  const handleClearHistory = () => {
    clearStoredHistory();
    setHistory([]);
  };

  // Review a specific past attempt from History
  const handleSelectHistoryAttempt = (result: QuizResult) => {
    setReviewAttempt(result);
    setActivePage('review_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={() => {
          setActivePage('home');
          refreshHistory();
        }}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        isInQuiz={activePage === 'quiz'}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onStartWeekQuick={handleStartWeekQuick}
            onConfigureWeek={handleConfigureWeek}
            onStartCombined={handleStartCombined}
            weekStats={weekStats}
            overallStats={overallStats}
            recentHistory={history}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onSelectAttempt={handleSelectHistoryAttempt}
          />
        )}

        {activePage === 'quiz' && activeQuizConfig && (
          <QuizPage
            key={`${activeQuizConfig.mode}-${activeQuizConfig.week || 'all'}-${Date.now()}`}
            questions={activeQuizQuestions}
            config={activeQuizConfig}
            allQuestionsPool={allQuestions}
            onExitQuiz={() => {
              setActivePage('home');
              refreshHistory();
            }}
            onRetake={handleRetakeQuiz}
          />
        )}

        {activePage === 'review_history' && reviewAttempt && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DetailedReview
              questions={
                reviewAttempt.mode === 'combined'
                  ? allQuestions
                  : allQuestions.filter((q) => q.week === reviewAttempt.week)
              }
              result={reviewAttempt}
              onBackToResults={() => setActivePage('home')}
              onReturnHome={() => setActivePage('home')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <QuizConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onStartQuiz={handleLaunchConfiguredQuiz}
        initialMode={configModalMode}
        initialWeek={configModalWeek}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        history={history}
        onClose={() => setIsHistoryModalOpen(false)}
        onClearHistory={handleClearHistory}
        onSelectAttempt={handleSelectHistoryAttempt}
      />

      <ValidationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}

export default App;
