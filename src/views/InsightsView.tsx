import React from 'react';
import {
  Layers,
  CheckCircle2,
  Zap,
  TrendingUp,
  Sparkles,
  Flame,
  Clock,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { INTENSITY_LEVELS, IntensityLevel } from '../types';

export function InsightsView() {
  const { tasks, habits, habitLogs } = useData();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const starredFocusTasks = tasks.filter((t) => t.isDailyFocus).length;

  // Intensity distribution
  const intensityCounts: Record<IntensityLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  tasks.forEach((t) => {
    if (t.intensity in intensityCounts) {
      intensityCounts[t.intensity]++;
    }
  });

  const totalPoints = tasks.reduce((sum, t) => sum + (t.intensity || 1), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-cyan-500/10 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-cyan-950/20 border border-blue-200/70 dark:border-blue-900/40 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60">Productivity Metrics</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Velocity & Throughput</span>
        </div>
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <span>Performance & Cognitive Insights</span>
        </h3>
        <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 max-w-xl">
          Actionable metrics tracking task throughput, cognitive intensity distribution, and daily habit consistency.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Completed Tasks Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
            <span>Completed Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {completedTasks.length}
          </p>
          <p className="text-[11px] text-neutral-500 tabular-nums font-medium">
            of {totalTasks} total planned tasks
          </p>
        </div>

        {/* Completion Rate Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-blue-200/80 dark:border-blue-900/40 shadow-xs space-y-2 relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
            <span>Completion Rate</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {completionRate}%
          </p>
          <div className="w-full h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Daily Focus Starred */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-200/80 dark:border-amber-900/40 shadow-xs space-y-2 relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
            <span>Daily Focus Targets</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
            {starredFocusTasks}
          </p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium">High leverage targets</p>
        </div>

        {/* Active Habits */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-indigo-200/80 dark:border-indigo-900/40 shadow-xs space-y-2 relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
            <span>Active Habits</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
            {habits.length}
          </p>
          <p className="text-[11px] text-neutral-500 tabular-nums font-medium">
            {habitLogs.length} total logged sessions
          </p>
        </div>
      </div>

      {/* Intensity Breakdown & Cognitive Load Distribution */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-600">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>Cognitive Intensity Distribution</span>
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Breakdown of mental energy required across your active task catalog.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 tabular-nums border border-blue-200 dark:border-blue-900/40">
            Total Load: {totalPoints} pts
          </span>
        </div>

        <div className="space-y-4">
          {([1, 2, 3, 4, 5] as IntensityLevel[]).map((level) => {
            const info = INTENSITY_LEVELS[level];
            const count = intensityCounts[level];
            const percent = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;

            const badgeColor =
              level === 5
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                : level === 4
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                : level === 3
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                : level === 2
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';

            const barGradient =
              level === 5
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : level === 4
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                : level === 3
                ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                : level === 2
                ? 'bg-gradient-to-r from-sky-400 to-blue-500'
                : 'bg-gradient-to-r from-emerald-400 to-teal-500';

            return (
              <div key={level} className="space-y-1.5 p-3 rounded-xl bg-neutral-50/60 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${badgeColor}`}>
                      L{level}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-bold">{info.name}</span>
                    <span className="text-neutral-500 text-[11px] hidden sm:inline">({info.tagline})</span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">{count} tasks</span>
                    <span className="text-neutral-400 text-[11px] font-semibold">({percent}%)</span>
                  </div>
                </div>

                <div className="w-full h-2.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barGradient}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
