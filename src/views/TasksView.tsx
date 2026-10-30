import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  FolderKanban,
  Search,
} from 'lucide-react';
import { Task, Priority, IntensityLevel, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface TasksViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (defaultDate?: string, defaultProjectId?: string) => void;
}

const COLUMNS: { id: TaskStatus; label: string; description: string; color: string }[] = [
  { id: 'todo', label: 'To-Do', description: 'Queued & planned', color: 'border-neutral-300 dark:border-neutral-700' },
  { id: 'in_progress', label: 'In Progress', description: 'Actively in motion', color: 'border-blue-300 dark:border-blue-800' },
  { id: 'completed', label: 'Done', description: 'Finished accomplishments', color: 'border-emerald-300 dark:border-emerald-800' },
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Controls Bar: View mode switch, filters, search, clear completed */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        {/* View Switcher & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Flow</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none outline-none"
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
            className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none outline-none"
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
            className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none outline-none"
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({completedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => onOpenQuickAdd()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 1. KANBAN BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 p-3.5 space-y-3 min-h-[450px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">{col.label}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenQuickAdd()}
                    className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards List with Column Shift Controls & Bulletproof Delete */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400">
                      Empty column
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
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm font-bold text-neutral-900 dark:text-white">No tasks match your filter</p>
              <p className="text-xs text-neutral-500 mt-1">Try resetting filters or create a new task.</p>
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
