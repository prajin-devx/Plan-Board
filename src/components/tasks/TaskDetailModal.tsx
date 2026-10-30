import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  FolderKanban,
  Check,
  Zap,
} from 'lucide-react';
import { Task, Priority, IntensityLevel, INTENSITY_LEVELS, TaskStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const { updateTask, deleteTask, addSubtask, toggleSubtask, deleteSubtask, projects } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setIntensity(task.intensity);
      setStatus(task.status);
      setDueDate(task.dueDate || '');
      setScheduledDate(task.scheduledDate || '');
      setProjectId(task.projectId);
      setConfirmDelete(false);
    }
  }, [task]);

  if (!task) return null;

  const handleSaveField = (updates: Partial<Task>) => {
    updateTask(task.id, updates);
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  /**
   * BULLETPROOF DELETE IN TASK DETAIL MODAL
   */
  const handleDeleteTask = () => {
    deleteTask(task.id);
    onClose();
  };

  const currentIntensity = INTENSITY_LEVELS[intensity] || INTENSITY_LEVELS[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            {/* Status Selector */}
            <select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as TaskStatus;
                setStatus(newStatus);
                handleSaveField({
                  status: newStatus,
                  completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
                });
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-none outline-none focus:ring-1 focus:ring-neutral-400"
            >
              <option value="todo">To-Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Daily Focus Toggle */}
            <button
              onClick={() => handleSaveField({ isDailyFocus: !task.isDailyFocus })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                task.isDailyFocus
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-400'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{task.isDailyFocus ? 'Daily Focus' : 'Set Focus'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* BULLETPROOF DELETE BUTTON IN MODAL */}
            {confirmDelete ? (
              <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-lg">
                <button
                  onClick={handleDeleteTask}
                  className="px-2.5 py-1 bg-rose-600 text-white text-xs font-semibold rounded hover:bg-rose-700 transition-colors"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete this task"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSaveField({ title: title.trim() || 'Untitled Task' })}
            placeholder="Task Title"
            className="w-full text-lg font-bold text-neutral-900 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 pb-1"
          />
        </div>

        {/* 5-Level Intensity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Task Intensity & Cognitive Load</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {([1, 2, 3, 4, 5] as IntensityLevel[]).map((lvl) => {
              const info = INTENSITY_LEVELS[lvl];
              const isSelected = intensity === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setIntensity(lvl);
                    handleSaveField({ intensity: lvl });
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? `${info.bgColor} ${info.borderColor} ${info.color} ring-1 font-bold`
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="block font-mono text-xs">L{lvl}</span>
                  <span className="text-[10px] truncate block">{info.name}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">
            {currentIntensity.tagline}
          </p>
        </div>

        {/* Metadata Controls (Priority, Project, Dates) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80">
          {/* Priority */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => {
                const newP = e.target.value as Priority;
                setPriority(newP);
                handleSaveField({ priority: newP });
              }}
              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Project / Workspace</label>
            <select
              value={projectId || ''}
              onChange={(e) => {
                const val = e.target.value ? e.target.value : undefined;
                setProjectId(val);
                handleSaveField({ projectId: val });
              }}
              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
            >
              <option value="">(No Project / Inbox)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => {
                setScheduledDate(e.target.value);
                handleSaveField({ scheduledDate: e.target.value || undefined });
              }}
              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Due Deadline</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                handleSaveField({ dueDate: e.target.value || undefined });
              }}
              className="w-full text-xs p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
            />
          </div>
        </div>

        {/* Description / Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description & Notes</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleSaveField({ description: description.trim() })}
            placeholder="Add context, acceptance criteria, or reference links..."
            rows={3}
            className="w-full text-xs p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-900 dark:text-white outline-none focus:border-neutral-400"
          />
        </div>

        {/* Subtasks Checklist (with reliable subtask deletion) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between">
            <span>Checklist & Subtasks</span>
            <span className="text-[11px] text-neutral-400">
              {(task.subtasks || []).filter((s) => s.completed).length} / {(task.subtasks || []).length}
            </span>
          </label>

          <div className="space-y-1.5">
            {(task.subtasks || []).map((sub) => (
              <div
                key={sub.id}
                className="group/sub flex items-center gap-2 p-2 rounded-lg bg-neutral-50/60 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800"
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(task.id, sub.id)}
                  className="text-neutral-400 hover:text-emerald-500 transition-colors"
                >
                  {sub.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-xs flex-1 ${
                    sub.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {sub.title}
                </span>

                {/* BULLETPROOF SUBTASK DELETE */}
                <button
                  type="button"
                  onClick={() => deleteSubtask(task.id, sub.id)}
                  title="Delete subtask"
                  className="opacity-0 group-hover/sub:opacity-100 p-1 text-neutral-400 hover:text-rose-600 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none text-neutral-900 dark:text-white outline-none"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="p-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 disabled:opacity-40 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
