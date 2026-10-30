import React from 'react';
import {
  Calendar,
  CheckSquare,
  Flame,
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

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: Flame, badge: todayTasksCount },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: inboxCount },
    { id: 'tasks', label: 'Flow & Tasks', icon: LayoutGrid, badge: tasks.filter((t) => t.status !== 'completed').length },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'insights', label: 'Insights', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-neutral-900 border-r border-neutral-200/80 dark:border-neutral-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold shadow-sm">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
              Plan Board
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400">
                v2.0
              </span>
            </h1>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Task & Project Planner</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="p-3">
        <button
          onClick={onOpenQuickAdd}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
          <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 dark:bg-neutral-200 text-neutral-400 dark:text-neutral-600">
            ⌘N
          </kbd>
        </button>
      </div>

      {/* Navigation List */}
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
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-200/70 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Project Section */}
        <div className="pt-4 pb-2">
          <div className="px-3 flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            <span>Boards & Projects</span>
            <span className="text-[10px]">{projects.length}</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {projects.map((proj) => {
              const projTasksCount = tasks.filter((t) => t.projectId === proj.id && t.status !== 'completed').length;
              return (
                <button
                  key={proj.id}
                  onClick={() => onNavigate('projects')}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color || '#6366f1' }}
                  />
                  <span className="truncate flex-1 text-left">{proj.name}</span>
                  {projTasksCount > 0 && (
                    <span className="text-[10px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                      {projTasksCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Status Footer */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                {user?.displayName || 'Personal Planner'}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                {isGuest ? 'Local Mode' : 'Cloud Sync Active'}
              </p>
            </div>
          </div>

          {isGuest ? (
            <button
              onClick={signInWithGoogle}
              title="Sign in with Google"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={signOut}
              title="Sign out"
              className="p-1.5 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
