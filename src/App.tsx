import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NavigationTab, Task } from './types';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { MobileNav } from './components/navigation/MobileNav';
import { MobileMenuModal } from './components/navigation/MobileMenuModal';
import { CommandPalette } from './components/common/CommandPalette';
import { QuickAddModal } from './components/tasks/QuickAddModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { DailyReviewModal } from './components/review/DailyReviewModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ThemeCustomizerModal } from './components/theme/ThemeCustomizerModal';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { TodayView } from './views/TodayView';
import { TasksView } from './views/TasksView';
import { InboxView } from './views/InboxView';
import { CalendarView } from './views/CalendarView';
import { HabitsView } from './views/HabitsView';
import { ProjectsView } from './views/ProjectsView';
import { InsightsView } from './views/InsightsView';
import { SettingsView } from './views/SettingsView';

const ONBOARDING_KEY = 'planboard_onboarded_v1';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('today');
  
  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<string | undefined>(undefined);
  const [quickAddProjectId, setQuickAddProjectId] = useState<string | undefined>(undefined);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return localStorage.getItem(ONBOARDING_KEY) !== 'true';
  });

  // Global Keyboard Shortcuts (Cmd+K for palette, Cmd+N for quick add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setQuickAddDate(undefined);
        setQuickAddProjectId(undefined);
        setIsQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenQuickAdd = (defaultDate?: string, defaultProjectId?: string) => {
    setQuickAddDate(defaultDate);
    setQuickAddProjectId(defaultProjectId);
    setIsQuickAddOpen(true);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/30 dark:from-[#0b0f19] dark:via-[#0e1628] dark:to-[#0f172a] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header
          activeTab={activeTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenQuickAdd={() => handleOpenQuickAdd()}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onOpenDailyReview={() => setIsDailyReviewOpen(true)}
        />

        {/* View Switcher */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'today' && (
            <TodayView
              onOpenDetail={setDetailTask}
              onOpenQuickAdd={handleOpenQuickAdd}
              onOpenDailyReview={() => setIsDailyReviewOpen(true)}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              onOpenDetail={setDetailTask}
              onOpenQuickAdd={() => handleOpenQuickAdd()}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxView
              onOpenDetail={setDetailTask}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              onOpenDetail={setDetailTask}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {activeTab === 'habits' && (
            <HabitsView />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              onOpenDetail={setDetailTask}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {activeTab === 'insights' && <InsightsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenuModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      {/* Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveTab}
        onOpenQuickAdd={() => handleOpenQuickAdd()}
        onSelectTask={setDetailTask}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultDate={quickAddDate}
        defaultProjectId={quickAddProjectId}
      />

      <TaskDetailModal
        task={detailTask}
        onClose={() => setDetailTask(null)}
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <DailyReviewModal
        isOpen={isDailyReviewOpen}
        onClose={() => setIsDailyReviewOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
