import React from 'react';
import {
  Calendar,
  CheckSquare,
  FolderKanban,
  Inbox,
  LayoutGrid,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Layers,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickAdd: () => void;
}

export function Sidebar({ activeTab, onNavigate, onOpenQuickAdd }: SidebarProps) {
  const { tasks, projects, settings, updateSettings } = useData();
  const { user, isGuest, signInWithGoogle, signOut } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasksCount = tasks.filter(
    (t) => (t.scheduledDate === todayStr || t.dueDate === todayStr || t.isDailyFocus) && t.status !== 'completed'
  ).length;

  const inboxCount = tasks.filter((t) => !t.projectId && t.status !== 'completed').length;

  const toggleTheme = () => {
    updateSettings({
      theme: settings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    colorClass: string;
    activeBg: string;
  }[] = [
    {
      id: 'today',
      label: 'Today',
      icon: CheckSquare,
      badge: todayTasksCount,
      colorClass: 'text-blue-600 dark:text-blue-400',
      activeBg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-l-[3px] border-blue-600',
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: Inbox,
      badge: inboxCount,
      colorClass: 'text-sky-500 dark:text-sky-400',
      activeBg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-l-[3px] border-sky-500',
    },
    {
      id: 'tasks',
      label: 'Flow & Tasks',
      icon: LayoutGrid,
      badge: tasks.filter((t) => t.status !== 'completed').length,
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      activeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-l-[3px] border-indigo-600',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      colorClass: 'text-violet-600 dark:text-violet-400',
      activeBg: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-l-[3px] border-violet-600',
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: Sparkles,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      activeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-l-[3px] border-emerald-600',
    },
    {
      id: 'projects',
      label: 'Workspaces',
      icon: FolderKanban,
      badge: projects.length,
      colorClass: 'text-amber-600 dark:text-amber-400',
      activeBg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-l-[3px] border-amber-600',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: Layers,
      colorClass: 'text-fuchsia-600 dark:text-fuchsia-400',
      activeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-l-[3px] border-fuchsia-600',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      colorClass: 'text-slate-600 dark:text-slate-400',
      activeBg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-l-[3px] border-slate-600',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-blue-100/80 dark:border-slate-800 shrink-0 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-blue-100/60 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/25">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                Plan Board
              </h1>
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]" title="Active & Ready" />
            </div>
            <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 font-medium">Colorful Productivity</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      {/* Primary Action Button (Vibrant Blue Accent Gradient) */}
      <div className="p-3">
        <button
          onClick={onOpenQuickAdd}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white/90">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Navigation List with Rich Color Accents */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? `${item.activeBg} font-bold shadow-xs`
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? item.colorClass : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`tabular-nums text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Workspaces Section */}
        <div className="pt-4 pb-2">
          <div className="px-3 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span>Workspaces</span>
            <span className="text-[10px] tabular-nums font-semibold bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
              {projects.length}
            </span>
          </div>
          <div className="mt-1.5 space-y-0.5">
            {projects.map((proj) => {
              const projTasksCount = tasks.filter((t) => t.projectId === proj.id && t.status !== 'completed').length;
              return (
                <button
                  key={proj.id}
                  onClick={() => onNavigate('projects')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: proj.color || '#3b82f6' }}
                  />
                  <span className="truncate flex-1 text-left font-medium">{proj.name}</span>
                  {projTasksCount > 0 && (
                    <span className="tabular-nums text-[11px] text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-semibold">
                      {projTasksCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Status Footer with Blue Accent */}
      <div className="p-3 border-t border-blue-100/70 dark:border-slate-800/80 bg-blue-50/40 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.displayName || 'Personal Workspace'}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isGuest ? 'Local Cache' : 'Cloud Sync Active'}
              </p>
            </div>
          </div>

          {isGuest ? (
            <button
              onClick={signInWithGoogle}
              title="Sign in with Google"
              className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
