import React from 'react';
import {
  Calendar,
  Check,
  Flame,
  ListTodo,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Task, INTENSITY_LEVELS, TaskStatus } from '../../types';
import { useData } from '../../context/DataContext';

interface TaskCardProps {
  task: Task;
  onOpenDetail: (task: Task) => void;
  showColumnControls?: boolean;
}

const FLOW_ORDER: TaskStatus[] = ['todo', 'in_progress', 'completed'];

const INTENSITY_COLOR_MAP: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/30' },
  2: { bg: 'bg-sky-500/15', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-500/30' },
  3: { bg: 'bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/30' },
  4: { bg: 'bg-purple-500/15', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/30' },
  5: { bg: 'bg-rose-500/15', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/30' },
};

export function TaskCard({ task, onOpenDetail, showColumnControls = false }: TaskCardProps) {
  const { deleteTask, toggleTaskStatus, moveTaskStatus, toggleDailyFocus, projects } = useData();

  const isCompleted = task.status === 'completed';
  const intensity = INTENSITY_LEVELS[task.intensity] || INTENSITY_LEVELS[3];
  const project = projects.find((p) => p.id === task.projectId);
  const intensityStyles = INTENSITY_COLOR_MAP[task.intensity] || INTENSITY_COLOR_MAP[3];

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  const currentColIndex = FLOW_ORDER.indexOf(task.status);
  const canMovePrev = currentColIndex > 0;
  const canMoveNext = currentColIndex < FLOW_ORDER.length - 1;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskStatus(task.id);
  };

  const handleToggleFocus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDailyFocus(task.id);
  };

  const handleMovePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMovePrev) {
      moveTaskStatus(task.id, FLOW_ORDER[currentColIndex - 1]);
    }
  };

  const handleMoveNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveNext) {
      moveTaskStatus(task.id, FLOW_ORDER[currentColIndex + 1]);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className={`group relative p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
        isCompleted
          ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
          : task.isDailyFocus
          ? 'bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-500/60 shadow-sm shadow-amber-500/10 hover:border-amber-400 hover:shadow-md'
          : 'bg-white dark:bg-slate-900 border-blue-100/90 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Custom Modern Checkbox */}
        <button
          onClick={handleToggleStatus}
          className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 bg-white dark:bg-slate-800'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h4
              className={`text-xs md:text-sm font-bold tracking-tight leading-snug line-clamp-2 ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Colorful Metadata Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3 text-[11px]">
            {/* Colorful Intensity Tag */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${intensityStyles.bg} ${intensityStyles.text} ${intensityStyles.border}`}
              title={`Intensity: Level ${task.intensity} (${intensity.name})`}
            >
              <span className="font-mono">L{task.intensity}</span>
              <span>{intensity.name}</span>
            </span>

            {/* Colorful Priority Tag */}
            {task.priority !== 'low' && (
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  task.priority === 'urgent'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : task.priority === 'high'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                }`}
              >
                {task.priority}
              </span>
            )}

            {/* Project Tag with Saturated Colored Dot */}
            {project && (
              <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-medium">
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: project.color || '#3b82f6' }}
                />
                <span className="truncate max-w-[100px]">{project.name}</span>
              </span>
            )}

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 tabular-nums text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-md text-[10px]">
                <ListTodo className="w-3 h-3 text-slate-400" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </span>
            )}

            {/* Due Date in Indigo/Blue */}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 tabular-nums text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded-md text-[10px] font-semibold">
                <Calendar className="w-3 h-3 text-blue-500" />
                <span>Due {task.dueDate.slice(5)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleFocus}
            title={task.isDailyFocus ? 'Remove from daily focus' : 'Set as daily focus'}
            className={`p-1.5 rounded-lg transition-colors ${
              task.isDailyFocus
                ? 'text-amber-500 bg-amber-500/15 shadow-xs'
                : 'text-slate-300 hover:text-amber-500 dark:text-slate-600 hover:bg-amber-50 dark:hover:bg-slate-800'
            }`}
            aria-label={task.isDailyFocus ? 'Remove from daily focus' : 'Set as daily focus'}
          >
            <Flame className={`w-3.5 h-3.5 ${task.isDailyFocus ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            title="Delete task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Flow Stage Transition Controls with Blue Accent */}
      {showColumnControls && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          {canMovePrev ? (
            <button
              onClick={handleMovePrev}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              title="Move to previous stage"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {canMoveNext && (
            <button
              onClick={handleMoveNext}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 transition-colors ml-auto shadow-2xs"
              title="Move to next stage"
            >
              <span>Advance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
