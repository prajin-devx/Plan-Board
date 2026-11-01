import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface TasksViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (defaultDate?: string, defaultProjectId?: string) => void;
}

const COLUMNS: {
  id: TaskStatus;
  label: string;
  description: string;
  dotColor: string;
  badgeBg: string;
  headerBorder: string;
  columnBg: string;
}[] = [
  {
    id: 'todo',
    label: 'To-Do',
    description: 'Queued & planned',
    dotColor: 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]',
    badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    headerBorder: 'border-b-2 border-sky-500',
    columnBg: 'bg-gradient-to-b from-sky-50/70 via-white/80 to-sky-50/30 dark:from-sky-950/20 dark:via-slate-900/40 dark:to-slate-900/20 border-sky-200/80 dark:border-sky-900/50',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    description: 'Actively in motion',
    dotColor: 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.9)]',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    headerBorder: 'border-b-2 border-blue-600',
    columnBg: 'bg-gradient-to-b from-blue-50/80 via-white/80 to-indigo-50/30 dark:from-blue-950/25 dark:via-slate-900/40 dark:to-slate-900/20 border-blue-300/80 dark:border-blue-800/60 shadow-xs',
  },
  {
    id: 'completed',
    label: 'Done',
    description: 'Finished accomplishments',
    dotColor: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    headerBorder: 'border-b-2 border-emerald-500',
    columnBg: 'bg-gradient-to-b from-emerald-50/70 via-white/80 to-teal-50/30 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-slate-900/20 border-emerald-200/80 dark:border-emerald-900/50',
  },
];

export function TasksView({ onOpenDetail, onOpenQuickAdd }: TasksViewProps) {
  const { tasks, projects, batchDeleteTasks } = useData();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery) {
      const match =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!match) return false;
    }
    if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;
    if (selectedIntensity !== 'all' && t.intensity.toString() !== selectedIntensity) return false;
    if (selectedProjectId !== 'all') {
      if (selectedProjectId === 'inbox' && t.projectId) return false;
      if (selectedProjectId !== 'inbox' && t.projectId !== selectedProjectId) return false;
    }
    return true;
  });

  const completedIds = tasks.filter((t) => t.status === 'completed').map((t) => t.id);

  const handleClearCompleted = () => {
    if (completedIds.length > 0) {
      batchDeleteTasks(completedIds);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
      {/* Controls Bar: View mode switch, filters, search, clear completed */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 shadow-sm backdrop-blur-md">
        {/* View Switcher & Search */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'board'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Flow Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search & filter tasks..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800 border border-transparent focus:border-blue-400 dark:focus:border-blue-600 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Dropdowns & Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 outline-none font-semibold cursor-pointer"
          >
            <option value="all">Priority: All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Intensity */}
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 outline-none font-semibold cursor-pointer"
          >
            <option value="all">Intensity: All</option>
            <option value="1">L1 Light</option>
            <option value="2">L2 Easy</option>
            <option value="3">L3 Moderate</option>
            <option value="4">L4 Deep</option>
            <option value="5">L5 Intense</option>
          </select>

          {/* Project */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 outline-none font-semibold cursor-pointer max-w-[140px] truncate"
          >
            <option value="all">Workspace: All</option>
            <option value="inbox">Inbox Only</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Clear Completed Action Button */}
          {completedIds.length > 0 && (
            <button
              onClick={handleClearCompleted}
              title="Delete all finished tasks"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="tabular-nums">Clear Done ({completedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => onOpenQuickAdd()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 1. COLORFUL FLOW BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`flex flex-col rounded-3xl border p-4 space-y-3.5 min-h-[520px] transition-all shadow-xs ${col.columnBg}`}
              >
                {/* Column Header with Distinct Stage Identity */}
                <div className={`flex items-center justify-between pb-2.5 ${col.headerBorder}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <span className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white uppercase">
                      {col.label}
                    </span>
                    <span className={`tabular-nums text-xs font-bold px-2 py-0.5 rounded-full border ${col.badgeBg}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenQuickAdd()}
                    className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Cards List with Column Shift Controls & Bulletproof Delete */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
                      No tasks in this stage
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onOpenDetail={onOpenDetail}
                        showColumnControls={true}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. STRUCTURED LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 shadow-xs">
              <p className="text-sm font-bold text-slate-900 dark:text-white">No tasks match your filter</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting filters or create a new task.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
