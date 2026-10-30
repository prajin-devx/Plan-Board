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

  // Tasks for the selected day
  const dayTasks = tasks.filter(
    (t) => t.scheduledDate === selectedDayString || t.dueDate === selectedDayString
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-neutral-500" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">{monthName}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDayString(new Date().toISOString().split('T')[0]);
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
          >
            Today
          </button>
          <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Calendar Grid (2 Cols on desktop) */}
        <div className="lg:col-span-2 p-4 md:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-neutral-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month days cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty prefix slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 md:h-20 rounded-xl bg-neutral-50/40 dark:bg-neutral-800/10" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDayString === dateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];

              const tasksOnDay = tasks.filter(
                (t) => t.scheduledDate === dateStr || t.dueDate === dateStr
              );

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDayString(dateStr)}
                  className={`h-16 md:h-20 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-100/70 dark:bg-neutral-800 shadow-xs'
                      : isToday
                      ? 'border-neutral-400 bg-neutral-50/80 dark:bg-neutral-800/30'
                      : 'border-neutral-150 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {tasksOnDay.length > 0 && (
                      <span className="text-[10px] font-medium text-neutral-400">
                        {tasksOnDay.length}
                      </span>
                    )}
                  </div>

                  {/* Task Indicators */}
                  <div className="flex items-center gap-1 overflow-hidden">
                    {tasksOnDay.slice(0, 3).map((t) => (
                      <span
                        key={t.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'completed' ? 'bg-emerald-500' : 'bg-neutral-900 dark:bg-white'
                        }`}
                      />
                    ))}
                    {tasksOnDay.length > 3 && (
                      <span className="text-[9px] text-neutral-400">+{tasksOnDay.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Side Panel */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Selected Day</p>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{selectedDayString}</h4>
            </div>
            <button
              onClick={() => onOpenQuickAdd(selectedDayString)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Day's Tasks List with Bulletproof Deletion */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {dayTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400 space-y-2">
                <Clock className="w-6 h-6 mx-auto opacity-50" />
                <p>No tasks scheduled for this date.</p>
                <button
                  onClick={() => onOpenQuickAdd(selectedDayString)}
                  className="text-xs text-neutral-900 dark:text-white font-semibold underline"
                >
                  Schedule a task now
                </button>
              </div>
            ) : (
              dayTasks.map((t) => (
                <TaskCard key={t.id} task={t} onOpenDetail={onOpenDetail} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
