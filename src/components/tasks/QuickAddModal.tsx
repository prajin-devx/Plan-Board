import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Flame, Zap } from 'lucide-react';
import { Priority, IntensityLevel, INTENSITY_LEVELS } from '../../types';
import { useData } from '../../context/DataContext';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultProjectId?: string;
}

export function QuickAddModal({
  isOpen,
  onClose,
  defaultDate,
  defaultProjectId,
}: QuickAddModalProps) {
  const { addTask, projects } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [isDailyFocus, setIsDailyFocus] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setIntensity(3);
      setIsDailyFocus(false);
      setScheduledDate(defaultDate || new Date().toISOString().split('T')[0]);
      setDueDate(defaultDate || '');
      setProjectId(defaultProjectId);
    }
  }, [isOpen, defaultDate, defaultProjectId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'todo',
      priority,
      intensity,
      isDailyFocus,
      dueDate: dueDate || undefined,
      scheduledDate: scheduledDate || undefined,
      projectId: projectId || undefined,
      labels: [],
      subtasks: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Quick Add Task</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              Return ↵
            </kbd>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="w-full text-base font-semibold text-neutral-900 dark:text-white bg-transparent outline-none placeholder:text-neutral-400"
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description or notes (optional)..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/70 dark:border-neutral-700/70 text-neutral-900 dark:text-white outline-none focus:border-neutral-400"
            />
          </div>

          {/* Intensity Bar */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Intensity (Energy Level)</span>
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {([1, 2, 3, 4, 5] as IntensityLevel[]).map((lvl) => {
                const info = INTENSITY_LEVELS[lvl];
                const isSelected = intensity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`py-1.5 px-1.5 rounded-xl border text-center text-xs transition-all ${
                      isSelected
                        ? `${info.bgColor} ${info.borderColor} ${info.color} font-bold ring-2 ring-blue-500/30 shadow-xs scale-102`
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    <span className="block font-mono font-bold">L{lvl}</span>
                    <span className="text-[10px] block truncate">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-none outline-none font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Project Workspace</label>
              <select
                value={projectId || ''}
                onChange={(e) => setProjectId(e.target.value || undefined)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-none outline-none font-medium focus:ring-1 focus:ring-blue-500"
              >
                <option value="">(Inbox / No Project)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-none outline-none font-medium focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neutral-500 block mb-1">Due Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-none outline-none font-medium focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Daily Focus Star Toggle */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsDailyFocus(!isDailyFocus)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isDailyFocus
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-800'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{isDailyFocus ? 'Starred for Daily Focus' : 'Mark for Daily Focus'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 disabled:opacity-40 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
