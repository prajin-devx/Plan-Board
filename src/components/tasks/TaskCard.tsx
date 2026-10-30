import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  ListTodo,
  MoreVertical,
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

const KANBAN_ORDER: TaskStatus[] = ['todo', 'in_progress', 'completed'];

export function TaskCard({ task, onOpenDetail, showColumnControls = false }: TaskCardProps) {
  const { deleteTask, toggleTaskStatus, moveTaskStatus, toggleDailyFocus, projects } = useData();

  const isCompleted = task.status === 'completed';
  const intensity = INTENSITY_LEVELS[task.intensity] || INTENSITY_LEVELS[3];
  const project = projects.find((p) => p.id === task.projectId);

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  const currentColIndex = KANBAN_ORDER.indexOf(task.status);
  const canMovePrev = currentColIndex > 0;
  const canMoveNext = currentColIndex < KANBAN_ORDER.length - 1;

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
      moveTaskStatus(task.id, KANBAN_ORDER[currentColIndex - 1]);
    }
  };

  const handleMoveNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveNext) {
      moveTaskStatus(task.id, KANBAN_ORDER[currentColIndex + 1]);
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className={`group relative p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-neutral-200/60 dark:border-neutral-800/60 opacity-60 bg-neutral-50/50 dark:bg-neutral-900/50'
          : 'border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Status Checkbox */}
        <button
          onClick={handleToggleStatus}
          className="mt-0.5 text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4
              className={`text-xs font-semibold tracking-tight text-neutral-900 dark:text-white leading-snug ${
                isCompleted ? 'line-through text-neutral-400 dark:text-neutral-500' : ''
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Badges Row */}
          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
            {/* Intensity Pill */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${intensity.bgColor} ${intensity.color} ${intensity.borderColor}`}
              title={`Intensity: Level ${task.intensity} (${intensity.name})`}
            >
              <span className="font-mono font-bold">L{task.intensity}</span>
              <span>{intensity.name}</span>
            </span>

            {/* Priority Indicator */}
            {task.priority !== 'low' && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                  task.priority === 'urgent'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400'
                    : task.priority === 'high'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400'
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {task.priority}
              </span>
            )}

            {/* Project Pill */}
            {project && (
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-1.5 py-0.5 rounded-md">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: project.color || '#6366f1' }}
                />
                <span className="truncate max-w-[80px]">{project.name}</span>
              </span>
            )}

            {/* Subtasks Progress */}
            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md border border-neutral-200/60 dark:border-neutral-700/60">
                <ListTodo className="w-3 h-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate.slice(5)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Top-Right Action Controls (Star Daily Focus + Bulletproof Delete Button) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleToggleFocus}
            title={task.isDailyFocus ? 'Remove from daily focus' : 'Set as daily focus'}
            className={`p-1 rounded-md transition-colors ${
              task.isDailyFocus
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                : 'text-neutral-300 hover:text-amber-500 dark:text-neutral-600'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>

          {/* BULLETPROOF DELETE BUTTON */}
          <button
            onClick={handleDelete}
            title="Delete task"
            className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Kanban Column Transition Arrows (if enabled) */}
      {showColumnControls && (
        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          {canMovePrev ? (
            <button
              onClick={handleMovePrev}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Move to previous stage"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {canMoveNext && (
            <button
              onClick={handleMoveNext}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors ml-auto font-medium"
              title="Move to next stage"
            >
              <span>Move</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
