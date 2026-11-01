import React, { useState } from 'react';
import { Inbox, Plus, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { Task } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface InboxViewProps {
  onOpenDetail: (task: Task) => void;
}

export function InboxView({ onOpenDetail }: InboxViewProps) {
  const { tasks, addTask, batchDeleteTasks } = useData();
  const [quickTitle, setQuickTitle] = useState('');

  const inboxTasks = tasks.filter((t) => !t.projectId);
  const activeInbox = inboxTasks.filter((t) => t.status !== 'completed');
  const completedInbox = inboxTasks.filter((t) => t.status === 'completed');

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    await addTask({
      title: quickTitle.trim(),
      status: 'todo',
      priority: 'medium',
      intensity: 2,
      isDailyFocus: false,
      labels: [],
      subtasks: [],
    });

    setQuickTitle('');
  };

  const handleClearInbox = () => {
    const ids = inboxTasks.map((t) => t.id);
    if (ids.length > 0) batchDeleteTasks(ids);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* Quick Capture Input */}
      <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-blue-200/80 dark:border-blue-900/40 shadow-xs focus-within:ring-2 focus-within:ring-blue-500/30 transition-all">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/70 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture a task or raw thought into Inbox (Press Enter ↵)..."
            className="flex-1 text-xs md:text-sm bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold disabled:opacity-40 shadow-xs shadow-blue-500/25 transition-all active:scale-95"
          >
            Capture
          </button>
        </form>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Inbox Queue</span>
            <span className="tabular-nums text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold">
              {activeInbox.length} pending
            </span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Unassigned items waiting to be organized into workspaces or scheduled.
          </p>
        </div>

        {inboxTasks.length > 0 && (
          <button
            onClick={handleClearInbox}
            title="Delete all inbox tasks"
            className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Inbox</span>
          </button>
        )}
      </div>

      {/* Active Inbox Tasks */}
      <div className="space-y-3">
        {activeInbox.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-gradient-to-br from-blue-50/40 via-sky-50/20 to-emerald-50/30 dark:from-blue-950/20 dark:via-sky-950/10 dark:to-emerald-950/10 border border-blue-200/50 dark:border-blue-900/30 space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-neutral-900 dark:text-white">Inbox Zero</p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              All captured thoughts are processed, scheduled, or assigned to a dedicated workspace.
            </p>
          </div>
        ) : (
          activeInbox.map((task) => (
            <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
          ))
        )}
      </div>

      {/* Completed Inbox Tasks */}
      {completedInbox.length > 0 && (
        <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <h4 className="text-xs font-semibold text-neutral-400">
            Archived / Completed ({completedInbox.length})
          </h4>
          <div className="space-y-2.5 opacity-70">
            {completedInbox.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
