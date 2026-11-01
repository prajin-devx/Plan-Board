import React from 'react';
import {
  Flame,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  BookOpenCheck,
  Zap,
  ArrowRight,
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
  const { tasks, habits, habitLogs, logHabit } = useData();

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
  const maxRecommendedPoints = 15;
  const intensityPercentage = Math.min(100, Math.round((totalIntensityPoints / maxRecommendedPoints) * 100));

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Banner: Colorful Hero with Blue Accent & Cognitive Meter */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-cyan-500/10 dark:from-blue-950/60 dark:via-indigo-950/40 dark:to-slate-900 border border-blue-200/90 dark:border-blue-800/80 shadow-md shadow-blue-500/5">
        {/* Ambient decorative glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span aria-hidden="true">·</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]">
                TODAY
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {greeting}, ready for today’s wins?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {activeTasks.length === 0
                ? 'All scheduled tasks are completed. You have achieved outstanding focus today!'
                : `${activeTasks.length} ${activeTasks.length === 1 ? 'task' : 'tasks'} queued for execution · ${
                    dailyFocusTasks.length > 0
                      ? `${dailyFocusTasks.length} starred as critical daily focus`
                      : 'Star 1–3 high-leverage tasks to protect your focus'
                  }.`}
            </p>
          </div>

          {/* Energy & Cognitive Load Meter */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-blue-100 dark:border-blue-900/50 shadow-sm min-w-[180px]">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Cognitive Load</span>
                </span>
                <span className="tabular-nums font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                  {totalIntensityPoints} pts
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-300 shadow-xs"
                  style={{ width: `${intensityPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-right font-medium">
                {totalIntensityPoints > 14 ? '⚡ High Cognitive Load' : '✨ Balanced Energy Target'}
              </p>
            </div>

            <button
              onClick={() => onOpenQuickAdd(todayStr)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Habits Daily Routine Strip with Colorful Category Identity */}
      {habits.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">
                Daily Routine & Habits
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('habits')}
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold transition-colors"
            >
              <span>View Streaks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {habits.map((habit) => {
              const isLogged = habitLogs.some(
                (l) => l.habitId === habit.id && l.date === todayStr && l.status === 'completed'
              );

              // Distinct color tints per category
              const isHealth = habit.category?.toLowerCase().includes('health');
              const isProductivity = habit.category?.toLowerCase().includes('prod');
              const isLearning = habit.category?.toLowerCase().includes('learn');

              const cardBg = isLogged
                ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : isHealth
                ? 'border-teal-200/80 dark:border-teal-900/60 bg-gradient-to-br from-teal-50/60 to-emerald-50/40 dark:from-slate-900 dark:to-teal-950/20 text-slate-800 dark:text-slate-200'
                : isProductivity
                ? 'border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/20 text-slate-800 dark:text-slate-200'
                : isLearning
                ? 'border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/60 to-pink-50/40 dark:from-slate-900 dark:to-purple-950/20 text-slate-800 dark:text-slate-200'
                : 'border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-slate-900 dark:to-amber-950/20 text-slate-800 dark:text-slate-200';

              return (
                <button
                  key={habit.id}
                  onClick={() => {
                    logHabit(habit.id, todayStr, 'completed');
                    if (!isLogged) handleTriggerConfetti();
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all shadow-xs hover:shadow-md ${cardBg}`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold truncate">{habit.name}</p>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                      {habit.category || 'Daily'} · {habit.frequency}
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isLogged
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isLogged ? 'text-white stroke-[2.5]' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Priority Daily Focus Section (Vibrant Amber/Gold Theme) */}
      {dailyFocusTasks.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/15 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </span>
            <h4 className="text-xs font-extrabold tracking-tight text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Priority Daily Focus
            </h4>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full">
              {dailyFocusTasks.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyFocusTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>
      )}

      {/* Main Today Tasks List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h4 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">
              All Tasks for Today
            </h4>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
              {activeTasks.length}
            </span>
          </div>

          <button
            onClick={() => onOpenQuickAdd(todayStr)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            + Add Task
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 border border-blue-100 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up for today</p>
              <p className="text-xs text-slate-500 mt-1">Capture a new task below or plan ahead in Calendar.</p>
            </div>
            <button
              onClick={() => onOpenQuickAdd(todayStr)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Today Section (Emerald / Mint Tint) */}
      {completedTasks.length > 0 && (
        <div className="pt-6 border-t border-blue-100 dark:border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Today ({completedTasks.length})</span>
            </span>
            <button
              onClick={onOpenDailyReview}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Evening Reflection</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
