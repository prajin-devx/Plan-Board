import React from 'react';
import {
  Flame,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  BookOpenCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, NavigationTab } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface TodayViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (date?: string) => void;
  onOpenDailyReview: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export function TodayView({
  onOpenDetail,
  onOpenQuickAdd,
  onOpenDailyReview,
  onNavigateTab,
}: TodayViewProps) {
  const { tasks, habits, habitLogs, logHabit, settings } = useData();

  const todayStr = new Date().toISOString().split('T')[0];

  // Tasks for today
  const todayTasks = tasks.filter((t) => {
    return t.scheduledDate === todayStr || t.dueDate === todayStr || t.isDailyFocus;
  });

  const activeTasks = todayTasks.filter((t) => t.status !== 'completed');
  const completedTasks = todayTasks.filter((t) => t.status === 'completed');
  const dailyFocusTasks = todayTasks.filter((t) => t.isDailyFocus);

  // Intensity load score
  const totalIntensityPoints = activeTasks.reduce((acc, curr) => acc + (curr.intensity || 1), 0);

  // Trigger celebration confetti
  const handleTriggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Banner: Daily Energy & Focus Summary */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {activeTasks.length === 0 ? "You're all caught up for today!" : `${activeTasks.length} tasks scheduled today`}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {dailyFocusTasks.length > 0
              ? `${dailyFocusTasks.length} marked as critical daily focus.`
              : 'Tip: Star 1-3 tasks as your daily focus to maintain clear cognitive priority.'}
          </p>
        </div>

        {/* Intensity Meter Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-right">
            <div className="flex items-center gap-1.5 justify-end text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{totalIntensityPoints} Intensity Pts</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              {totalIntensityPoints > 12 ? 'High Cognitive Load' : 'Balanced Energy Target'}
            </p>
          </div>

          <button
            onClick={() => onOpenQuickAdd(todayStr)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add for Today</span>
          </button>
        </div>
      </div>

      {/* Habits Daily Row */}
      {habits.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Daily Routine & Habits</span>
            </div>
            <button
              onClick={() => onNavigateTab('habits')}
              className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              View streaks →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {habits.map((habit) => {
              const isLogged = habitLogs.some(
                (l) => l.habitId === habit.id && l.date === todayStr && l.status === 'completed'
              );
              return (
                <button
                  key={habit.id}
                  onClick={() => {
                    logHabit(habit.id, todayStr, 'completed');
                    if (!isLogged) handleTriggerConfetti();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    isLogged
                      ? 'border-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">{habit.name}</span>
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isLogged ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Focus Section */}
      {dailyFocusTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4" />
            <span>Priority Daily Focus</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailyFocusTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>
      )}

      {/* Main Today Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>All Tasks for Today ({activeTasks.length})</span>
          </div>

          <button
            onClick={() => onOpenQuickAdd(todayStr)}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium"
          >
            + Add Task
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">No pending tasks for today</p>
              <p className="text-xs text-neutral-500 mt-0.5">Plan tomorrow or capture a new task below.</p>
            </div>
            <button
              onClick={() => onOpenQuickAdd(todayStr)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Today Section */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
            <span>Completed Today ({completedTasks.length})</span>
            <button
              onClick={onOpenDailyReview}
              className="flex items-center gap-1 text-[11px] hover:text-neutral-900 dark:hover:text-white"
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Review in Evening Reflection</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-75">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
