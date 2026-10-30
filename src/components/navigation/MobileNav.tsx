import React from 'react';
import { Flame, Inbox, LayoutGrid, Calendar, Menu, Plus } from 'lucide-react';
import { NavigationTab } from '../../types';
import { useData } from '../../context/DataContext';

interface MobileNavProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickAdd: () => void;
  onOpenMenu: () => void;
}

export function MobileNav({ activeTab, onNavigate, onOpenQuickAdd, onOpenMenu }: MobileNavProps) {
  const { tasks } = useData();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCount = tasks.filter(
    (t) => (t.scheduledDate === todayStr || t.dueDate === todayStr || t.isDailyFocus) && t.status !== 'completed'
  ).length;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 px-3 py-1.5 flex items-center justify-around safe-area-bottom">
      <button
        onClick={() => onNavigate('today')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors relative ${
          activeTab === 'today' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span>Today</span>
        {todayCount > 0 && (
          <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500" />
        )}
      </button>

      <button
        onClick={() => onNavigate('inbox')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'inbox' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <Inbox className="w-5 h-5" />
        <span>Inbox</span>
      </button>

      {/* Floating Center Quick Add */}
      <button
        onClick={onOpenQuickAdd}
        className="w-11 h-11 -mt-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Add task"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={() => onNavigate('tasks')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'tasks' ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <LayoutGrid className="w-5 h-5" />
        <span>Flow</span>
      </button>

      <button
        onClick={onOpenMenu}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          ['habits', 'projects', 'insights', 'settings', 'calendar'].includes(activeTab)
            ? 'text-neutral-900 dark:text-white font-semibold'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
      >
        <Menu className="w-5 h-5" />
        <span>More</span>
      </button>
    </nav>
  );
}
