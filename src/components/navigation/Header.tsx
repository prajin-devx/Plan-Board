import React from 'react';
import {
  Search,
  Plus,
  Palette,
  BookOpenCheck,
  CheckCircle2,
  WifiOff,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useData } from '../../context/DataContext';

interface HeaderProps {
  activeTab: NavigationTab;
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
  onOpenThemeModal: () => void;
  onOpenDailyReview: () => void;
}

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string }> = {
  today: { title: 'Today’s Focus', subtitle: 'Prioritize high-impact tasks and maintain daily energy balance' },
  inbox: { title: 'Inbox', subtitle: 'Capture raw thoughts and quickly triage into actionable projects' },
  tasks: { title: 'Flow & Tasks', subtitle: 'Visual Flow stages and structured view by intensity & priority' },
  calendar: { title: 'Calendar & Schedule', subtitle: 'Map out weekly deadlines, milestones, and daily allocations' },
  habits: { title: 'Habits & Routines', subtitle: 'Build compounding consistency and streak momentum' },
  projects: { title: 'Projects & Workspaces', subtitle: 'Group tasks into structured milestone boards' },
  insights: { title: 'Productivity Insights', subtitle: 'Track completion velocity, intensity distribution, and streaks' },
  settings: { title: 'Settings', subtitle: 'Personalize theme palettes, typography, and preferences' },
};

export function Header({
  activeTab,
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenThemeModal,
  onOpenDailyReview,
}: HeaderProps) {
  const { tasks, isOnline, syncStatus } = useData();
  const currentTab = TAB_TITLES[activeTab] || { title: 'Plan Board', subtitle: 'Productive Task Planner' };

  const completedTodayCount = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.completedAt.startsWith(today);
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Title & Subtitle */}
      <div className="min-w-0">
        <h2 className="text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-white truncate">
          {currentTab.title}
        </h2>
        <p className="hidden md:block text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {currentTab.subtitle}
        </p>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-2">
        {/* Connection / Offline indicator */}
        {!isOnline && (
          <div
            title="Working offline. All changes are saved locally and will sync when reconnected."
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 text-xs font-medium shadow-xs"
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden xs:inline">Offline (Saved locally)</span>
            <span className="xs:hidden">Offline</span>
          </div>
        )}

        {isOnline && syncStatus === 'syncing' && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 text-[11px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>Syncing</span>
          </div>
        )}

        {/* Completed today mini counter */}
        {completedTodayCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{completedTodayCount} done today</span>
          </div>
        )}

        {/* Global Search / Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search & Jump</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-400">
            ⌘K
          </kbd>
        </button>

        {/* Theme Customizer Trigger */}
        <button
          onClick={onOpenThemeModal}
          title="Customize Theme & Palette"
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Daily Review Trigger */}
        <button
          onClick={onOpenDailyReview}
          title="Daily Review & Evening Reflection"
          className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
        >
          <BookOpenCheck className="w-4 h-4" />
        </button>

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
