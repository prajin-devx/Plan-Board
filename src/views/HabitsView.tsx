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
  let motivationalMessage = 'Log today to ignite your streak!';
  let milestoneTitle = 'Ready to Start';

  if (currentStreak >= 30) {
    flameLevel = 'legendary';
    milestoneTitle = '30-Day Master';
    motivationalMessage = isCompletedToday
      ? 'Legendary discipline! 30+ days continuous consistency.'
      : 'Protect your legendary 30+ day streak today!';
  } else if (currentStreak >= 14) {
    flameLevel = 'blaze';
    milestoneTitle = '2-Week Dynamo';
    motivationalMessage = isCompletedToday
      ? 'Fantastic momentum! Habit is firmly compounding.'
      : 'Complete today to protect your 14+ day streak.';
  } else if (currentStreak >= 7) {
    flameLevel = 'flame';
    milestoneTitle = '7-Day Champion';
    motivationalMessage = isCompletedToday
      ? 'Full week locked in! Great compound execution.'
      : 'Maintain your solid 7-day streak today.';
  } else if (currentStreak >= 3) {
    flameLevel = 'spark';
    milestoneTitle = 'Building Momentum';
    motivationalMessage = isCompletedToday
      ? '3-day streak active. Keep stacking consecutive wins.'
      : 'Stack day 3+ today to solidify this routine.';
  } else if (currentStreak === 1 || currentStreak === 2) {
    flameLevel = 'spark';
    milestoneTitle = 'Spark Ignited';
    motivationalMessage = isCompletedToday
      ? 'Great start! Momentum has begun.'
      : 'Log today to continue your streak.';
  }

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
    isActive: currentStreak > 0,
    motivationalMessage,
    milestoneTitle,
    flameLevel,
  };
}

export function HabitsView() {
  const { habits, habitLogs, addHabit, deleteHabit, logHabit, showToast } = useData();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Health');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekdays' | 'weekly_target'>('daily');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Past 7 days calculation
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // Aggregate metrics
  const allStreaks = habits.map((h) => calculateHabitStreak(h.id, habitLogs));
  const maxActiveStreak = allStreaks.reduce((max, s) => Math.max(max, s.currentStreak), 0);
  const totalCompletedToday = habits.filter((h) =>
    habitLogs.some((l) => l.habitId === h.id && l.date === todayStr && l.status === 'completed')
  ).length;
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

  const handleToggleHabitDay = (habit: Habit, dateStr: string, isCurrentlyDone: boolean) => {
    const nextStatus = isCurrentlyDone ? 'skipped' : 'completed';
    logHabit(habit.id, dateStr, nextStatus);

    if (!isCurrentlyDone && dateStr === todayStr) {
      const prevStreak = calculateHabitStreak(habit.id, habitLogs).currentStreak;
      const newStreak = prevStreak + 1;

      try {
        if (newStreak === 3 || newStreak === 7 || newStreak === 14 || newStreak === 30) {
          confetti({
            particleCount: 70,
            spread: 60,
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
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Header Card in Vibrant Gradient */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-indigo-500/10 dark:from-emerald-950/40 dark:via-blue-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-md shadow-emerald-500/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Consistency System</span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
              DAILY ROUTINES
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <span>Habits & Current Streaks</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Repetition builds subconscious identity. Maintain daily streak momentum to achieve compounding progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Aggregate Streak Overview Cards with Vibrant Glowing Icons */}
      {habits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25">
              <Flame className="w-6 h-6 stroke-[2.5] fill-white/20" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Top Streak</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{maxActiveStreak}</span>
                <span className="text-xs font-semibold text-slate-500">days active</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-slate-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Today’s Rate</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {totalCompletedToday}/{habits.length}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">({completionRateToday}%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-900 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Total Routines</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">{habits.length}</span>
                <span className="text-xs font-semibold text-slate-500">habits active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Create Daily Habit</span>
              </h4>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Habit Name</label>
                <input
                  type="text"
                  autoFocus
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. 20m Morning Reading, 2L Hydration, Workout"
                  className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Category</label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer font-medium"
                  >
                    <option value="Health">Health & Wellness</option>
                    <option value="Productivity">Productivity & Focus</option>
                    <option value="Learning">Learning & Reading</option>
                    <option value="Mindfulness">Mindfulness & Rest</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Frequency</label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none cursor-pointer font-medium"
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
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!habitName.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habits List with Colorful Current Streak Counters */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 space-y-2 shadow-xs">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-base font-bold text-slate-900 dark:text-white">No active habits yet</p>
            <p className="text-xs text-slate-500">Create your first daily routine to begin tracking momentum.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const streak = calculateHabitStreak(habit.id, habitLogs);

            // Streak visual styling
            let flameBg = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700';
            let flameIconColor = 'text-slate-400 dark:text-slate-500';
            let streakTextColor = 'text-slate-900 dark:text-white';

            if (streak.flameLevel === 'legendary') {
              flameBg = 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-400 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10';
              flameIconColor = 'text-purple-600 dark:text-purple-400 fill-purple-600';
              streakTextColor = 'text-purple-900 dark:text-purple-200';
            } else if (streak.flameLevel === 'blaze') {
              flameBg = 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 border-rose-400 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-500/10';
              flameIconColor = 'text-rose-600 dark:text-rose-400 fill-rose-600';
              streakTextColor = 'text-rose-900 dark:text-rose-200';
            } else if (streak.flameLevel === 'flame') {
              flameBg = 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-amber-800 dark:text-amber-300 shadow-sm shadow-amber-500/10';
              flameIconColor = 'text-amber-500 fill-amber-500';
              streakTextColor = 'text-amber-900 dark:text-amber-200';
            } else if (streak.flameLevel === 'spark') {
              flameBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700 dark:text-amber-400';
              flameIconColor = 'text-amber-500 fill-amber-500/30';
              streakTextColor = 'text-amber-800 dark:text-amber-300';
            }

            return (
              <div
                key={habit.id}
                className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-blue-100/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all space-y-4"
              >
                {/* Top Row: Habit Details & Prominent Streak Counter */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Habit Info */}
                  <div className="space-y-1.5 min-w-0">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {habit.name}
                    </h4>
                    {habit.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900/60 text-[11px]">
                        {habit.category}
                      </span>
                      <span className="text-slate-500 font-medium capitalize">{habit.frequency}</span>
                      {streak.longestStreak > 0 && (
                        <span className="tabular-nums text-slate-400">
                          · All-time Record: <strong className="text-slate-700 dark:text-slate-200">{streak.longestStreak} days</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PROMINENT CURRENT STREAK COUNTER BADGE */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${flameBg}`}
                      title={streak.motivationalMessage}
                    >
                      <div className="relative flex items-center justify-center">
                        <Flame className={`w-5 h-5 ${flameIconColor} ${streak.currentStreak > 0 ? 'animate-bounce' : ''}`} />
                        {streak.currentStreak >= 7 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>

                      <div className="text-left">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-lg font-black tabular-nums ${streakTextColor}`}>
                            {streak.currentStreak}
                          </span>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90">
                            {streak.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold opacity-85 leading-tight">
                          {streak.milestoneTitle}
                        </p>
                      </div>
                    </div>

                    {/* Delete Habit Button */}
                    <div className="shrink-0">
                      {confirmDeleteId === habit.id ? (
                        <div className="flex items-center gap-1 bg-rose-500/15 p-1 rounded-xl border border-rose-500/30">
                          <button
                            onClick={() => {
                              deleteHabit(habit.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(habit.id)}
                          title="Delete habit"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Motivational Streak Notice with Color Border */}
                <div
                  className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-2 border font-medium ${
                    streak.isCompletedToday
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {streak.isCompletedToday ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                    )}
                    <span className="truncate">{streak.motivationalMessage}</span>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase tracking-wider shrink-0 px-2 py-0.5 rounded-full ${
                    streak.isCompletedToday
                      ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200'
                  }`}>
                    {streak.isCompletedToday ? 'Streak Safe' : 'Action Needed'}
                  </span>
                </div>

                {/* Bottom Row: 7 Days Check-in Matrix */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Last 7 Days Activity</span>
                  </span>

                  <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
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
                              isToday ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400'
                            }`}
                          >
                            {dayName}
                          </span>
                          <button
                            onClick={() => handleToggleHabitDay(habit, dStr, isCompleted)}
                            title={`Toggle for ${dStr} (${isCompleted ? 'Completed' : 'Pending'})`}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 active:scale-95'
                                : isToday
                                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 border-2 border-blue-500 hover:bg-blue-100'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
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
