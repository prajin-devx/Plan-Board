import React from 'react';
import { X, CheckCircle2, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface DailyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DailyReviewModal({ isOpen, onClose }: DailyReviewModalProps) {
  const { tasks, toggleDailyFocus } = useData();

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter((t) => t.status === 'completed' && t.completedAt?.startsWith(todayStr));
  const remainingToday = tasks.filter(
    (t) => (t.scheduledDate === todayStr || t.dueDate === todayStr || t.isDailyFocus) && t.status !== 'completed'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Daily Review & Reflection</h3>
              <p className="text-xs text-neutral-500">Close out your work and prepare for clarity tomorrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Accomplishments */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accomplished Today ({completedToday.length})</span>
          </h4>
          {completedToday.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-2">No tasks logged as completed today yet.</p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              {completedToday.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending & Roll-over */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Remaining Focus Items ({remainingToday.length})</span>
          </h4>
          {remainingToday.length === 0 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-1">
              ✨ Excellent! All today's focus items are completed.
            </p>
          ) : (
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
              {remainingToday.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-neutral-800 dark:text-neutral-200">{t.title}</span>
                  <button
                    onClick={() => toggleDailyFocus(t.id)}
                    className="text-[10px] text-neutral-400 hover:text-amber-500 shrink-0"
                  >
                    Unstar focus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
          >
            <span>Finish Reflection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
