import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Task } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface CalendarViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (defaultDate?: string) => void;
}

export function CalendarView({ onOpenDetail, onOpenQuickAdd }: CalendarViewProps) {
  const { tasks } = useData();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayString, setSelectedDayString] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  // Tasks for the selected day
  const dayTasks = tasks.filter(
    (t) => t.scheduledDate === selectedDayString || t.dueDate === selectedDayString
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs border border-blue-100 dark:border-blue-900/30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white">{monthName}</h3>
            <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 font-medium">Monthly Horizon & Deadlines</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDayString(new Date().toISOString().split('T')[0]);
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-xs font-semibold text-blue-700 dark:text-blue-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Calendar Grid */}
      <div className="p-4 md:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Empty prefix cells for day of week offset */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 md:h-20 rounded-xl bg-neutral-50/40 dark:bg-neutral-950/20" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dayStr === todayStr;
            const isSelected = dayStr === selectedDayString;

            const tasksOnThisDay = tasks.filter(
              (t) => t.scheduledDate === dayStr || t.dueDate === dayStr
            );
            const pendingTasks = tasksOnThisDay.filter((t) => t.status !== 'completed');

            return (
              <button
                key={dayStr}
                onClick={() => setSelectedDayString(dayStr)}
                className={`h-16 md:h-20 p-2 rounded-xl flex flex-col justify-between text-left transition-all border ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/60 shadow-xs ring-2 ring-blue-500/20'
                    : isToday
                    ? 'border-sky-400 dark:border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-1 ring-sky-400/30'
                    : 'border-neutral-100 dark:border-neutral-800/60 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/20 dark:hover:bg-blue-950/10 bg-white dark:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-300 font-extrabold'
                        : isToday
                        ? 'text-sky-600 dark:text-sky-400 font-extrabold'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {tasksOnThisDay.length > 0 && (
                    <span className="text-[10px] tabular-nums font-bold px-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {tasksOnThisDay.length}
                    </span>
                  )}
                </div>

                {/* Task indicators with color matching */}
                <div className="flex items-center gap-1 flex-wrap">
                  {pendingTasks.slice(0, 3).map((t) => {
                    const dotColor =
                      t.priority === 'urgent'
                        ? 'bg-rose-500'
                        : t.priority === 'high'
                        ? 'bg-amber-500'
                        : t.intensity >= 4
                        ? 'bg-indigo-500'
                        : 'bg-blue-500';
                    return (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                        title={t.title}
                      />
                    );
                  })}
                  {pendingTasks.length > 3 && (
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold font-mono">
                      +{pendingTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Schedule for {new Date(selectedDayString + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}{' '}
              <span className="text-blue-600 dark:text-blue-400">({dayTasks.length})</span>
            </h4>
          </div>

          <button
            onClick={() => onOpenQuickAdd(selectedDayString)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task for this Day</span>
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center text-xs text-neutral-400">
            No tasks scheduled or due on this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {dayTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
