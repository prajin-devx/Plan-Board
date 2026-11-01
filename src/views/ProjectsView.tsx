import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Project, Task } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface ProjectsViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (defaultDate?: string, defaultProjectId?: string) => void;
}

const PRESET_COLORS = [
  '#2563eb', // Vibrant Blue
  '#6366f1', // Electric Indigo
  '#06b6d4', // Ocean Cyan
  '#10b981', // Emerald Green
  '#f59e0b', // Amber Orange
  '#ec4899', // Hot Pink
  '#8b5cf6', // Purple Violet
  '#f43f5e', // Rose Coral
];

export function ProjectsView({ onOpenDetail, onOpenQuickAdd }: ProjectsViewProps) {
  const { projects, tasks, addProject, deleteProject } = useData();

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newP = await addProject({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      isArchived: false,
    });

    setName('');
    setDescription('');
    setIsAddOpen(false);
    setActiveProjectId(newP.id);
  };

  const selectedProject = projects.find((p) => p.id === activeProjectId);
  const selectedTasks = activeProjectId ? tasks.filter((t) => t.projectId === activeProjectId) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Header Info with Colorful Gradient Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-500/10 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-200 dark:border-blue-800/80 shadow-md shadow-blue-500/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
            <span>Workspaces & Initiatives</span>
            <span aria-hidden="true">·</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[10px]">
              PROJECT TRACKING
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>Workspaces & Boards</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Group related tasks into structured boards with milestones, vivid color indicators, and completion metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Add Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Create New Workspace</h4>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Workspace Name</label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile App Redesign, Marketing Q4"
                  className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Goals, deliverables, or team scope..."
                  className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-2">Accent Color</label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-xl transition-all shadow-xs ${color === c ? 'scale-110 ring-2 ring-blue-600 ring-offset-2' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
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
                  disabled={!name.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Cards Grid with Vibrant Color Accent Headers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedCount = projTasks.filter((t) => t.status === 'completed').length;
          const totalCount = projTasks.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isSelected = activeProjectId === proj.id;

          return (
            <div
              key={proj.id}
              onClick={() => setActiveProjectId(isSelected ? null : proj.id)}
              className={`relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-xs hover:shadow-lg space-y-4 ${
                isSelected
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-blue-100/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {/* Top Accent Stripe in Project's Color */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: proj.color || '#2563eb' }}
              />

              <div className="flex items-start justify-between pt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: proj.color || '#2563eb' }}
                  />
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{proj.name}</h4>
                </div>

                {/* Delete Button */}
                <div onClick={(e) => e.stopPropagation()}>
                  {confirmDeleteId === proj.id ? (
                    <div className="flex items-center gap-1 bg-rose-500/15 p-1 rounded-xl border border-rose-500/30">
                      <button
                        onClick={() => {
                          deleteProject(proj.id);
                          if (activeProjectId === proj.id) setActiveProjectId(null);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2.5 py-0.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] text-slate-400 px-1 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(proj.id)}
                      title="Delete workspace"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {proj.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{proj.description}</p>
              )}

              {/* Glowing Progress Bar & Task Counts */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="tabular-nums">
                    {completedCount}/{totalCount} tasks
                  </span>
                  <span className="tabular-nums text-slate-900 dark:text-white font-bold">{percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-300 shadow-xs"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: proj.color || '#2563eb',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Drill-down */}
      {selectedProject && (
        <div className="pt-8 border-t border-blue-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: selectedProject.color || '#2563eb' }}
              />
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {selectedProject.name} Tasks ({selectedTasks.length})
              </h4>
            </div>

            <button
              onClick={() => onOpenQuickAdd(undefined, selectedProject.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add to Workspace</span>
            </button>
          </div>

          {selectedTasks.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-blue-200 dark:border-slate-800 text-center text-xs text-slate-400 font-medium">
              No tasks assigned to {selectedProject.name} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
