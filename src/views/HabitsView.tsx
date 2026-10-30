import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Flame,
  Calendar,
  X,
  Trophy,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Habit, HabitLog } from '../types';
import { useData } from '../context/DataContext';

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
  isActive: boolean;
  motivationalMessage: string;
  milestoneTitle: string;
  flameLevel: 'none' | 'spark' | 'flame' | 'blaze' | 'legendary';
}

function calculateHabitStreak(habitId: string, habitLogs: HabitLog[]): StreakInfo {
  const completedDates = new Set(
    habitLogs
      .filter((l) => l.habitId === habitId && l.status === 'completed')
      .map((l) => l.date)
  );

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const yDate = new Date();
  yDate.setDate(yDate.getDate() - 1);
  const yesterdayStr = yDate.toISOString().split('T')[0];

  const isCompletedToday = completedDates.has(todayStr);
  const isCompletedYesterday = completedDates.has(yesterdayStr);

  let currentStreak = 0;
  if (isCompletedToday) {
    currentStreak = 1;
    const check = new Date();
    check.setDate(check.getDate() - 1);
    while (true) {
      const dStr = check.toISOString().split('T')[0];
      if (completedDates.has(dStr)) {
        currentStreak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
  } else if (isCompletedYesterday) {
    currentStreak = 1;
    const check = new Date();
    check.setDate(check.getDate() - 2);
    while (true) {
      const dStr = check.toISOString().split('T')[0];
      if (completedDates.has(dStr)) {
        currentStreak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across history
  const sortedDates = Array.from(completedDates).sort();
  let longestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const curDate = new Date(dateStr + 'T00:00:00');
    if (!prevDate) {
      running = 1;
    } else {
      const diffTime = curDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > longestStreak) longestStreak = running;
    prevDate = curDate;
  }
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  // Milestone & theme configuration
  let flameLevel: 'none' | 'spark' | 'flame' | 'blaze' | 'legendary' = 'none';
  let milestoneTitle = 'Ready to Start';
  let motivationalMessage = 'Log today to ignite your streak!';

  if (currentStreak >= 30) {
    flameLevel = 'legendary';
    milestoneTitle = 'Monthly Master 🏆';
    motivationalMessage = isCompletedToday
      ? 'Outstanding 30+ day mastery! Streak locked for today.'
      : 'Maintain your 30+ day streak! Check in today.';
  } else if (currentStreak >= 14) {
    flameLevel = 'blaze';
    milestoneTitle = '2 Weeks Strong ⚡';
    motivationalMessage = isCompletedToday
      ? '14+ days consistent! Incredible momentum.'
      : 'Keep the 2-week blaze burning today.';
  } else if (currentStreak >= 7) {
    flameLevel = 'flame';
    milestoneTitle = 'Week Champion 🔥';
    motivationalMessage = isCompletedToday
      ? '7+ days streak secured! Keep advancing.'
      : 'Check in today to keep your weekly streak alive!';
  } else if (currentStreak >= 3) {
    flameLevel = 'spark';
    milestoneTitle = 'Building Habit 🌟';
    motivationalMessage = isCompletedToday
      ? 'Streak growing strong! Next target: 7 days.'
      : 'Don’t break the chain today!';
  } else if (currentStreak > 0) {
    flameLevel = 'spark';
    milestoneTitle = 'Spark Ignited ✨';
    motivationalMessage = isCompletedToday
      ? 'Great start! Return tomorrow to build momentum.'
      : 'Check in today to keep your streak going.';
  }

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
    isActive: isCompletedToday || isCompletedYesterday,
    motivationalMessage,
    milestoneTitle,
    flameLevel,
  };
}

export function HabitsView() {
  const { habits, habitLogs, addHabit, deleteHabit, logHabit, showToast } = useData();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Personal');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekdays' | 'weekly_target'>('daily');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Generate last 7 days strings
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    return d.toISOString().split('T')[0];
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Aggregated consistency metrics
  const streakStats = habits.map((h) => calculateHabitStreak(h.id, habitLogs));
  const maxActiveStreak = streakStats.reduce((max, s) => Math.max(max, s.currentStreak), 0);
  const totalCompletedToday = streakStats.filter((s) => s.isCompletedToday).length;
  const completionRateToday = habits.length > 0 ? Math.round((totalCompletedToday / habits.length) * 100) : 0;

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    await addHabit({
      name: habitName.trim(),
      category: habitCategory,
      frequency: habitFrequency,
      trackingMethod: 'binary',
      isArchived: false,
      isPaused: false,
    });

    setHabitName('');
    setIsAddOpen(false);
  };

  const handleToggleHabitDay = (habit: Habit, dateStr: string, wasCompleted: boolean) => {
    logHabit(habit.id, dateStr, 'completed');

    if (!wasCompleted) {
      const streakInfo = calculateHabitStreak(habit.id, habitLogs);
      const newStreak = streakInfo.isCompletedToday ? streakInfo.currentStreak : streakInfo.currentStreak + 1;

      try {
        if (newStreak >= 7) {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 },
          });
          showToast(`🔥 ${newStreak}-Day Streak Milestone reached for ${habit.name}!`, 'success');
        } else if (newStreak > 1) {
          showToast(`⚡ Streak extended to ${newStreak} days!`, 'success');
        }
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Daily Consistency System
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>Habits & Current Streaks</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Consecutive daily repetition builds identity. Maintain your streaks to build compound progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Aggregate Streak Overview Cards */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Top Current Streak</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{maxActiveStreak}</span>
                <span className="text-xs text-neutral-500">days active</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Today's Progress</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-neutral-900 dark:text-white">
                  {totalCompletedToday}/{habits.length}
                </span>
                <span className="text-xs text-neutral-500">completed ({completionRateToday}%)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Total Active Habits</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-neutral-900 dark:text-white">{habits.length}</span>
                <span className="text-xs text-neutral-500">tracked routines</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Create Daily Habit</h4>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Habit Name</label>
                <input
                  type="text"
                  autoFocus
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. 20m Morning Reading, 2L Hydration, Workout"
                  className="w-full text-sm p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-neutral-500 block mb-1">Category</label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  >
                    <option value="Health">Health & Wellness</option>
                    <option value="Productivity">Productivity & Deep Work</option>
                    <option value="Learning">Learning & Reading</option>
                    <option value="Mindfulness">Mindfulness & Rest</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-500 block mb-1">Frequency</label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="weekly_target">Weekly Target</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!habitName.trim()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold disabled:opacity-40"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habits List with Enhanced Current Streak Counters */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <Sparkles className="w-6 h-6 text-neutral-400 mx-auto" />
            <p className="text-sm font-bold text-neutral-900 dark:text-white">No active habits yet</p>
            <p className="text-xs text-neutral-500">Create your first daily routine to begin tracking momentum.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const streak = calculateHabitStreak(habit.id, habitLogs);

            // Streak visual styling
            let flameBg = 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';
            let flameIconColor = 'text-neutral-400 dark:text-neutral-500';
            let streakTextColor = 'text-neutral-900 dark:text-white';

            if (streak.flameLevel === 'legendary') {
              flameBg = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800 ring-1 ring-purple-400/30';
              flameIconColor = 'text-purple-600 dark:text-purple-400';
              streakTextColor = 'text-purple-900 dark:text-purple-200';
            } else if (streak.flameLevel === 'blaze') {
              flameBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30';
              flameIconColor = 'text-rose-600 dark:text-rose-400';
              streakTextColor = 'text-rose-900 dark:text-rose-200';
            } else if (streak.flameLevel === 'flame') {
              flameBg = 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/30';
              flameIconColor = 'text-amber-500 dark:text-amber-400';
              streakTextColor = 'text-amber-900 dark:text-amber-200';
            } else if (streak.flameLevel === 'spark') {
              flameBg = 'bg-amber-50/60 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/60';
              flameIconColor = 'text-amber-500';
              streakTextColor = 'text-amber-800 dark:text-amber-300';
            }

            return (
              <div
                key={habit.id}
                className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Top Row: Habit Details & Prominent Streak Counter */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Habit Info */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm md:text-base font-bold text-neutral-900 dark:text-white truncate">
                        {habit.name}
                      </h4>
                      {habit.category && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {habit.category}
                        </span>
                      )}
                    </div>
                    {habit.description && (
                      <p className="text-xs text-neutral-500 line-clamp-1">{habit.description}</p>
                    )}
                    <p className="text-[11px] text-neutral-400">
                      Frequency: <span className="capitalize text-neutral-600 dark:text-neutral-300">{habit.frequency}</span>
                      {streak.longestStreak > 0 && (
                        <span> · All-time Record: <strong className="text-neutral-700 dark:text-neutral-200">{streak.longestStreak} days</strong></span>
                      )}
                    </p>
                  </div>

                  {/* PROMINENT CURRENT STREAK COUNTER BADGE */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    <div
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all ${flameBg}`}
                      title={streak.motivationalMessage}
                    >
                      <div className="relative flex items-center justify-center">
                        <Flame className={`w-5 h-5 ${flameIconColor} ${streak.currentStreak > 0 ? 'animate-bounce' : ''}`} />
                        {streak.currentStreak >= 7 && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>

                      <div className="text-left">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-base font-extrabold ${streakTextColor}`}>
                            {streak.currentStreak}
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85">
                            {streak.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                          </span>
                        </div>
                        <p className="text-[10px] font-medium opacity-90 leading-tight">
                          {streak.milestoneTitle}
                        </p>
                      </div>
                    </div>

                    {/* BULLETPROOF HABIT DELETE BUTTON */}
                    <div className="shrink-0">
                      {confirmDeleteId === habit.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-xl">
                          <button
                            onClick={() => {
                              deleteHabit(habit.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 px-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(habit.id)}
                          title="Delete habit"
                          className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Motivational Streak Banner */}
                <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                  streak.isCompletedToday
                    ? 'bg-emerald-50/70 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                    : 'bg-amber-50/70 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40'
                }`}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    {streak.isCompletedToday ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate font-medium">{streak.motivationalMessage}</span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-full bg-white/70 dark:bg-neutral-900/60">
                    {streak.isCompletedToday ? 'Streak Protected' : 'Action Required'}
                  </span>
                </div>

                {/* Bottom Row: 7 Days Check-in Matrix */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Last 7 Days Activity</span>
                  </span>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    {last7Days.map((dStr) => {
                      const dayName = new Date(dStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'narrow' });
                      const isCompleted = habitLogs.some(
                        (l) => l.habitId === habit.id && l.date === dStr && l.status === 'completed'
                      );
                      const isToday = dStr === todayStr;

                      return (
                        <div key={dStr} className="flex flex-col items-center gap-1">
                          <span
                            className={`text-[10px] font-bold ${
                              isToday ? 'text-neutral-900 dark:text-white underline underline-offset-2' : 'text-neutral-400'
                            }`}
                          >
                            {dayName}
                          </span>
                          <button
                            onClick={() => handleToggleHabitDay(habit, dStr, isCompleted)}
                            title={`Toggle for ${dStr} (${isCompleted ? 'Completed' : 'Pending'})`}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-xs hover:bg-emerald-600 scale-100 active:scale-95'
                                : isToday
                                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-300 dark:border-amber-700 hover:bg-amber-100'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'stroke-[2.5]' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
