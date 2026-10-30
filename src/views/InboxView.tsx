import React, { useState } from 'react';
import { Inbox, Plus, ArrowRight, Trash2 } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Quick Capture Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-3">
          <Inbox className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick capture a thought or task into Inbox (Press Enter ↵)..."
            className="flex-1 text-sm bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold disabled:opacity-40"
          >
            Capture
          </button>
        </form>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Inbox Items</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
              {activeInbox.length} pending
            </span>
          </h3>
          <p className="text-xs text-neutral-500">Unassigned items waiting to be organized into projects or scheduled</p>
        </div>

        {inboxTasks.length > 0 && (
          <button
            onClick={handleClearInbox}
            title="Delete all inbox tasks"
            className="text-xs text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Inbox</span>
          </button>
        )}
      </div>

      {/* Task List */}
      {activeInbox.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-neutral-900 dark:text-white">Inbox Zero</p>
          <p className="text-xs text-neutral-500">All captured thoughts have been scheduled or triaged.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeInbox.map((task) => (
            <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      )}

      {/* Completed in Inbox */}
      {completedInbox.length > 0 && (
        <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-2.5 opacity-70">
          <span className="text-xs font-semibold text-neutral-400">Completed in Inbox ({completedInbox.length})</span>
          {completedInbox.map((task) => (
            <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      )}
    </div>
  );
}
