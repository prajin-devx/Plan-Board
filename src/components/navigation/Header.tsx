import React from 'react';
import {
  Search,
  Plus,
  Palette,
  BookOpenCheck,
  CheckCircle2,
  WifiOff,
  Flame,
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

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string; badgeColor: string }> = {
  today: { title: 'Today’s Focus', subtitle: 'Prioritize high-impact tasks and maintain daily energy balance', badgeColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' },
  inbox: { title: 'Inbox & Ideas', subtitle: 'Capture raw thoughts and quickly triage into actionable projects', badgeColor: 'text-sky-600 bg-sky-50 dark:bg-sky-950/50' },
  tasks: { title: 'Flow & Tasks', subtitle: 'Visual Flow stages and structured view by intensity & priority', badgeColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50' },
  calendar: { title: 'Calendar & Schedule', subtitle: 'Map out weekly deadlines, milestones, and daily allocations', badgeColor: 'text-violet-600 bg-violet-50 dark:bg-violet-950/50' },
  habits: { title: 'Habits & Routines', subtitle: 'Build compounding consistency and streak momentum', badgeColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
  projects: { title: 'Workspaces', subtitle: 'Group tasks into structured milestone boards', badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
  insights: { title: 'Productivity Insights', subtitle: 'Track completion velocity, intensity distribution, and streaks', badgeColor: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/50' },
  settings: { title: 'Settings', subtitle: 'Personalize theme palettes, typography, and preferences', badgeColor: 'text-slate-600 bg-slate-50 dark:bg-slate-950/50' },
};

export function Header({
  activeTab,
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenThemeModal,
  onOpenDailyReview,
}: HeaderProps) {
  const { tasks, isOnline, syncStatus } = useData();
  const currentTab = TAB_TITLES[activeTab] || { title: 'Plan Board', subtitle: 'Productive Task Planner', badgeColor: 'text-blue-600 bg-blue-50' };

  const completedTodayCount = tasks.filter((t) => {
    if (t.status !== 'completed' || !t.completedAt) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.completedAt.startsWith(today);
  }).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-blue-100/70 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
      {/* Title & Subtitle with Colorful Accent */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base md:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
            {currentTab.title}
          </h2>
        </div>
        <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate">
          {currentTab.subtitle}
        </p>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-2.5">
        {/* Offline indicator */}
        {!isOnline && (
          <div
            title="Working offline. All changes are saved locally and will sync when reconnected."
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold animate-pulse"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Offline (Saved)</span>
            <span className="xs:hidden">Offline</span>
          </div>
        )}

        {isOnline && syncStatus === 'syncing' && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>Syncing</span>
          </div>
        )}

        {/* Completed today badge (Colorful Emerald Pill) */}
        {completedTodayCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1 rounded-full shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            <span className="tabular-nums">{completedTodayCount} done today</span>
          </div>
        )}

        {/* Global Search / Command Palette Trigger with Blue Focus Ring */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Theme Customizer Trigger */}
        <button
          onClick={onOpenThemeModal}
          title="Customize Theme & Palette"
          className="p-2 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Daily Review Trigger */}
        <button
          onClick={onOpenDailyReview}
          title="Daily Review & Evening Reflection"
          className="p-2 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <BookOpenCheck className="w-4 h-4" />
        </button>

        {/* Quick Add Button (Vibrant Cobalt Blue Gradient) */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden xs:inline">Add Task</span>
        </button>
      </div>
    </header>
  );
}
