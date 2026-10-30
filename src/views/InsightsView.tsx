import React from 'react';
import {
  Layers,
  CheckCircle2,
  Zap,
  TrendingUp,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { INTENSITY_LEVELS, IntensityLevel } from '../types';

export function InsightsView() {
  const { tasks, habits, habitLogs } = useData();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Intensity distribution
  const intensityCounts: Record<IntensityLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  tasks.forEach((t) => {
    if (t.intensity in intensityCounts) {
      intensityCounts[t.intensity]++;
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span>Productivity & Velocity Insights</span>
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Actionable metrics tracking task throughput, cognitive intensity distribution, and consistency.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{completedTasks.length}</p>
          <p className="text-[10px] text-neutral-400">out of {totalTasks} total tasks</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{completionRate}%</p>
          <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mt-1">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Daily Focus Starred</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {tasks.filter((t) => t.isDailyFocus).length}
          </p>
          <p className="text-[10px] text-neutral-400">High priority targets</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs">
            <span>Active Habits</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">{habits.length}</p>
          <p className="text-[10px] text-neutral-400">{habitLogs.length} total logs</p>
        </div>
      </div>

      {/* Intensity Distribution Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Cognitive Intensity Breakdown (Energy Budget)
          </h4>
        </div>

        <div className="space-y-3">
          {([1, 2, 3, 4, 5] as IntensityLevel[]).map((lvl) => {
            const count = intensityCounts[lvl];
            const percent = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
            const info = INTENSITY_LEVELS[lvl];

            return (
              <div key={lvl} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">L{lvl}</span>
                    <span className="text-neutral-600 dark:text-neutral-400">{info.name}</span>
                    <span className="text-[10px] text-neutral-400">({info.tagline})</span>
                  </div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {count} tasks ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor:
                        lvl === 1 ? '#10b981' : lvl === 2 ? '#14b8a6' : lvl === 3 ? '#f59e0b' : lvl === 4 ? '#f97316' : '#f43f5e',
                    }}
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
