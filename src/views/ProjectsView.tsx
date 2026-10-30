import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { Project, Task } from '../types';
import { useData } from '../context/DataContext';
import { TaskCard } from '../components/tasks/TaskCard';

interface ProjectsViewProps {
  onOpenDetail: (task: Task) => void;
  onOpenQuickAdd: (defaultDate?: string, defaultProjectId?: string) => void;
}

const PRESET_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#14b8a6', '#64748b'];

export function ProjectsView({ onOpenDetail, onOpenQuickAdd }: ProjectsViewProps) {
  const { projects, tasks, addProject, deleteProject } = useData();

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
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
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-500" />
            <span>Projects & Workspaces</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Group tasks into milestone projects with custom color tags and completion metrics.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Add Project Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Create New Project</h4>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-neutral-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Project Name</label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Launch, Home Remodel, Q4 Strategy"
                  className="w-full text-sm p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key milestones and goals..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 block mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-neutral-900 dark:ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold disabled:opacity-40"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              className={`p-5 rounded-2xl bg-white dark:bg-neutral-900 border transition-all cursor-pointer shadow-xs hover:shadow-md space-y-3 ${
                isSelected
                  ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900/10'
                  : 'border-neutral-200/90 dark:border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: proj.color || '#6366f1' }}
                  />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{proj.name}</h4>
                </div>

                {/* BULLETPROOF PROJECT DELETE BUTTON */}
                <div onClick={(e) => e.stopPropagation()}>
                  {confirmDeleteId === proj.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteProject(proj.id);
                          if (activeProjectId === proj.id) setActiveProjectId(null);
                          setConfirmDeleteId(null);
                        }}
                        className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[10px] text-neutral-400 px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(proj.id)}
                      title="Delete project"
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {proj.description && (
                <p className="text-xs text-neutral-500 line-clamp-2">{proj.description}</p>
              )}

              {/* Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    {completedCount}/{totalCount} tasks
                  </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%`, backgroundColor: proj.color || '#6366f1' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Drill-Down Tasks */}
      {selectedProject && (
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedProject.color || '#6366f1' }}
              />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                Tasks in {selectedProject.name} ({selectedTasks.length})
              </h4>
            </div>

            <button
              onClick={() => onOpenQuickAdd(undefined, selectedProject.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to {selectedProject.name}</span>
            </button>
          </div>

          {selectedTasks.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-4 text-center">
              No tasks in this project yet. Click "+ Add" to create one.
            </p>
          ) : (
            <div className="space-y-2.5">
              {selectedTasks.map((t) => (
                <TaskCard key={t.id} task={t} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
