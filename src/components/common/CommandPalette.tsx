import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutGrid,
  Calendar,
  Sparkles,
  FolderKanban,
  Settings,
  Plus,
  Palette,
  CheckCircle2,
  X,
  Trash2,
} from 'lucide-react';
import { NavigationTab, Task } from '../../types';
import { useData } from '../../context/DataContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenQuickAdd: () => void;
  onSelectTask: (task: Task) => void;
  onOpenThemeModal: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenQuickAdd,
  onSelectTask,
  onOpenThemeModal,
}: CommandPaletteProps) {
  const { tasks, projects, deleteTask } = useData();
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    if (isOpen) setQueryText('');
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTasks = queryText.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(queryText.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(queryText.toLowerCase()))
      )
    : tasks.slice(0, 5);

  const navigationCommands: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'today', label: 'Go to Today’s Focus', icon: CheckCircle2 },
    { id: 'tasks', label: 'Go to Flow & Tasks', icon: LayoutGrid },
    { id: 'calendar', label: 'Go to Calendar', icon: Calendar },
    { id: 'habits', label: 'Go to Habits & Streaks', icon: Sparkles },
    { id: 'projects', label: 'Go to Projects & Workspaces', icon: FolderKanban },
    { id: 'settings', label: 'Go to Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Palette Box */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Type a task name, project, or command..."
            className="w-full text-sm bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
            ESC
          </kbd>
        </div>

        {/* Content List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 px-2">Quick Actions</span>
            <button
              onClick={() => {
                onOpenQuickAdd();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400" />
              <span>Create New Task</span>
            </button>
            <button
              onClick={() => {
                onOpenThemeModal();
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              <span>Customize Dashboard Palette & Typography</span>
            </button>
          </div>

          {/* Tasks Results with Working Delete */}
          {filteredTasks.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 px-2">Tasks</span>
              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTask(t);
                    onClose();
                  }}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-neutral-400">L{t.intensity}</span>
                    <span className={`truncate ${t.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(t.id);
                      }}
                      title="Delete task"
                      className="p-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-600 rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Commands */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 px-2">Navigation</span>
            {navigationCommands.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onNavigate(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{cmd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
