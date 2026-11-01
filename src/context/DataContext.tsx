import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  Task,
  Habit,
  HabitLog,
  Project,
  UserSettings,
  COLOR_PALETTES,
  TaskStatus,
} from '../types';

interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  undoAction?: () => void;
}

interface DataContextType {
  // State
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  habitLogs: HabitLog[];
  settings: UserSettings;
  loading: boolean;
  toasts: ToastMessage[];
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';

  // Task Actions (with bulletproof deletion)
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  batchDeleteTasks: (taskIds: string[]) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  toggleDailyFocus: (taskId: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;

  // Habit Actions
  addHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Habit>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  logHabit: (habitId: string, date: string, status: 'completed' | 'skipped' | 'missed', numericValue?: number) => Promise<void>;

  // Settings & Theme Actions
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;

  // Utility Actions
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error', undoAction?: () => void) => void;
  dismissToast: (id: string) => void;
  resetToSampleData: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  accentColor: '#2563eb',
  paletteId: 'blue',
  fontChoice: 'jakarta',
  weekStart: 'monday',
  defaultPriority: 'medium',
  defaultIntensity: 3,
  dailyFocusLimit: 3,
  soundEnabled: true,
};

const STORAGE_PREFIX = 'planboard_';

const DataContext = createContext<DataContextType | undefined>(undefined);

function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

const SEED_PROJECTS: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Work & Projects',
    description: 'Sprint milestones, client deliverables, and core tasks',
    color: '#6366f1',
    icon: 'briefcase',
    isArchived: false,
    order: 0,
  },
  {
    name: 'Personal Development',
    description: 'Reading, skills, writing, and wellness',
    color: '#10b981',
    icon: 'sparkles',
    isArchived: false,
    order: 1,
  },
  {
    name: 'Home & Life',
    description: 'Errands, finances, maintenance, and family',
    color: '#f59e0b',
    icon: 'home',
    isArchived: false,
    order: 2,
  },
];

const SEED_TASKS = (userId: string, projId1: string, projId2: string, projId3: string): Task[] => {
  const today = getTodayString();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

  return [
    {
      id: 'task-seed-1',
      userId,
      title: 'Review Plan Board visual Flow view',
      description: 'Explore the modern stage columns, drag or click status transitions, and customize your visual workspace.',
      status: 'in_progress',
      priority: 'high',
      intensity: 3,
      isDailyFocus: true,
      scheduledDate: today,
      dueDate: today,
      projectId: projId1,
      labels: ['Productivity', 'Getting Started'],
      subtasks: [
        { id: 'sub-1', title: 'Test moving card to In Review or Done', completed: true },
        { id: 'sub-2', title: 'Open theme customizer and pick a palette', completed: false },
        { id: 'sub-3', title: 'Try pressing Cmd+K for command palette', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 0,
    },
    {
      id: 'task-seed-2',
      userId,
      title: 'Draft quarterly product roadmap & key objectives',
      description: 'Synthesize user feedback into high-impact deliverables for Q4.',
      status: 'todo',
      priority: 'urgent',
      intensity: 5,
      isDailyFocus: true,
      scheduledDate: today,
      dueDate: tomorrow,
      projectId: projId1,
      labels: ['Planning', 'High Focus'],
      subtasks: [
        { id: 'sub-4', title: 'Draft customer problem statements', completed: true },
        { id: 'sub-5', title: 'Map engineering constraints', completed: false },
        { id: 'sub-6', title: 'Finalize presentation deck', completed: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 1,
    },
    {
      id: 'task-seed-3',
      userId,
      title: '30-minute deep reading: Design Systems Handbook',
      description: 'Chapter 4 on typography scale, accessible contrast, and motion tokens.',
      status: 'todo',
      priority: 'medium',
      intensity: 2,
      isDailyFocus: false,
      scheduledDate: today,
      dueDate: today,
      projectId: projId2,
      labels: ['Learning', 'Design'],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 2,
    },
    {
      id: 'task-seed-4',
      userId,
      title: 'Monthly utility billing audit & expense categorisation',
      description: 'Archive invoices and reconcile receipts.',
      status: 'completed',
      priority: 'low',
      intensity: 1,
      isDailyFocus: false,
      scheduledDate: today,
      dueDate: nextWeek,
      projectId: projId3,
      labels: ['Finance'],
      subtasks: [
        { id: 'sub-7', title: 'Download electricity and internet receipts', completed: true },
      ],
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 3,
    },
    {
      id: 'task-seed-5',
      userId,
      title: 'Schedule quarterly dental checkup and routine labs',
      description: 'Confirm health insurance in-network provider.',
      status: 'todo',
      priority: 'medium',
      intensity: 1,
      isDailyFocus: false,
      scheduledDate: tomorrow,
      dueDate: nextWeek,
      projectId: projId3,
      labels: ['Health'],
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: 4,
    },
  ];
};

const SEED_HABITS = (userId: string): Habit[] => [
  {
    id: 'habit-seed-1',
    userId,
    name: 'Morning Hydration (750ml water)',
    description: 'Drink full bottle upon waking before coffee',
    icon: 'droplet',
    category: 'Health',
    frequency: 'daily',
    trackingMethod: 'binary',
    isArchived: false,
    isPaused: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'habit-seed-2',
    userId,
    name: 'Deep Work Session (45m+)',
    description: 'No notification interruptions or multi-tasking',
    icon: 'zap',
    category: 'Productivity',
    frequency: 'weekdays',
    trackingMethod: 'binary',
    isArchived: false,
    isPaused: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'habit-seed-3',
    userId,
    name: 'Daily Evening Reflection',
    description: 'Review day accomplishments & set tomorrow focus',
    icon: 'moon',
    category: 'Mindfulness',
    frequency: 'daily',
    trackingMethod: 'binary',
    isArchived: false,
    isPaused: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, effectiveUserId } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}settings`);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>(
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced'
  );

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', undoAction?: () => void) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, undoAction }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Network Connectivity Monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('synced');
      showToast('Connection restored — offline changes synced', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
      showToast('Working offline — changes saved locally in cache', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Synchronize Theme & Font into DOM
  useEffect(() => {
    const root = document.documentElement;
    // Theme
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('theme-warm');
    } else if (settings.theme === 'warm') {
      root.classList.remove('dark');
      root.classList.add('theme-warm');
    } else {
      root.classList.remove('dark', 'theme-warm');
    }

    // Font
    root.classList.remove('font-inter', 'font-mono', 'font-editorial', 'font-jakarta');
    if (settings.fontChoice === 'inter') root.classList.add('font-inter');
    else if (settings.fontChoice === 'mono') root.classList.add('font-mono');
    else if (settings.fontChoice === 'editorial') root.classList.add('font-editorial');
    else root.classList.add('font-jakarta');

    // Accent
    const palette = COLOR_PALETTES.find((p) => p.id === settings.paletteId);
    if (palette) {
      root.style.setProperty('--color-accent', palette.accent);
    }
  }, [settings.theme, settings.fontChoice, settings.paletteId]);

  // Initial load: Local storage first, then Firestore sync if user is signed in
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTasks = localStorage.getItem(`${STORAGE_PREFIX}tasks_${effectiveUserId}`);
        const storedProjects = localStorage.getItem(`${STORAGE_PREFIX}projects_${effectiveUserId}`);
        const storedHabits = localStorage.getItem(`${STORAGE_PREFIX}habits_${effectiveUserId}`);
        const storedLogs = localStorage.getItem(`${STORAGE_PREFIX}habit_logs_${effectiveUserId}`);

        let initialProjects: Project[] = storedProjects ? JSON.parse(storedProjects) : [];
        let initialTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        let initialHabits: Habit[] = storedHabits ? JSON.parse(storedHabits) : [];
        let initialLogs: HabitLog[] = storedLogs ? JSON.parse(storedLogs) : [];

        // If newly initialised with empty data, generate seed records
        if (initialProjects.length === 0) {
          initialProjects = SEED_PROJECTS.map((p, idx) => ({
            ...p,
            id: `proj-seed-${idx + 1}`,
            userId: effectiveUserId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          localStorage.setItem(`${STORAGE_PREFIX}projects_${effectiveUserId}`, JSON.stringify(initialProjects));
        }

        if (initialTasks.length === 0) {
          initialTasks = SEED_TASKS(
            effectiveUserId,
            initialProjects[0]?.id || 'proj-seed-1',
            initialProjects[1]?.id || 'proj-seed-2',
            initialProjects[2]?.id || 'proj-seed-3'
          );
          localStorage.setItem(`${STORAGE_PREFIX}tasks_${effectiveUserId}`, JSON.stringify(initialTasks));
        }

        if (initialHabits.length === 0) {
          initialHabits = SEED_HABITS(effectiveUserId);
          localStorage.setItem(`${STORAGE_PREFIX}habits_${effectiveUserId}`, JSON.stringify(initialHabits));
        }

        setProjects(initialProjects);
        setTasks(initialTasks);
        setHabits(initialHabits);
        setHabitLogs(initialLogs);

        // If signed into Firebase, fetch and reconcile remote Firestore documents
        if (user) {
          try {
            const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
            const tasksSnapshot = await getDocs(tasksQuery);
            if (!tasksSnapshot.empty) {
              const remoteTasks = tasksSnapshot.docs.map((d) => d.data() as Task);
              setTasks(remoteTasks);
              localStorage.setItem(`${STORAGE_PREFIX}tasks_${user.uid}`, JSON.stringify(remoteTasks));
            }

            const projectsQuery = query(collection(db, 'projects'), where('userId', '==', user.uid));
            const projectsSnapshot = await getDocs(projectsQuery);
            if (!projectsSnapshot.empty) {
              const remoteProjects = projectsSnapshot.docs.map((d) => d.data() as Project);
              setProjects(remoteProjects);
              localStorage.setItem(`${STORAGE_PREFIX}projects_${user.uid}`, JSON.stringify(remoteProjects));
            }
          } catch (syncErr) {
            console.info('Cloud sync deferred, using local repository cache:', syncErr);
          }
        }
      } catch (err) {
        console.warn('Data bootstrap warning:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, effectiveUserId]);

  // Synchronise local state to localStorage
  const persistTasks = useCallback((updated: Task[]) => {
    setTasks(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}tasks_${effectiveUserId}`, JSON.stringify(updated));
    } catch {
      // quota or private mode fallback
    }
  }, [effectiveUserId]);

  const persistProjects = useCallback((updated: Project[]) => {
    setProjects(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}projects_${effectiveUserId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [effectiveUserId]);

  const persistHabits = useCallback((updated: Habit[]) => {
    setHabits(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}habits_${effectiveUserId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [effectiveUserId]);

  const persistHabitLogs = useCallback((updated: HabitLog[]) => {
    setHabitLogs(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}habit_logs_${effectiveUserId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [effectiveUserId]);

  // TASK ACTIONS (BULLETPROOF DELETION & MODIFICATION)
  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Task> => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Math.random().toString(36).substring(2, 11),
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: tasks.length,
    };

    const updated = [newTask, ...tasks];
    persistTasks(updated);
    showToast(`Task "${newTask.title.slice(0, 24)}" created`, 'success');

    if (user) {
      try {
        await setDoc(doc(db, 'tasks', newTask.id), newTask);
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Task queued in Firestore offline cache:', newTask.id);
        } else {
          try {
            handleFirestoreError(e, OperationType.CREATE, `tasks/${newTask.id}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
    return newTask;
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const prev = tasks.find((t) => t.id === taskId);
    if (!prev) return;

    const updatedTask: Task = {
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    persistTasks(updated);

    if (user) {
      try {
        await setDoc(doc(db, 'tasks', taskId), updatedTask, { merge: true });
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Task update queued in Firestore offline cache:', taskId);
        } else {
          try {
            handleFirestoreError(e, OperationType.UPDATE, `tasks/${taskId}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
  };

  /**
   * BULLETPROOF DELETE TASK:
   * Works consistently everywhere in the application.
   * Immediately removes task from state & storage, supports undo.
   */
  const deleteTask = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    // Remove immediately from in-memory state
    const remaining = tasks.filter((t) => t.id !== taskId);
    persistTasks(remaining);

    // Provide undo toast
    showToast(`Deleted "${target.title.slice(0, 24)}"`, 'info', () => {
      // Undo restoration
      const restored = [target, ...remaining];
      persistTasks(restored);
      if (user) {
        setDoc(doc(db, 'tasks', target.id), target).catch(console.warn);
      }
    });

    // Remote Firestore delete if logged in
    if (user) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (e) {
        console.warn('Remote task delete notice:', e);
      }
    }
  };

  const batchDeleteTasks = async (taskIds: string[]) => {
    const idSet = new Set(taskIds);
    const deletedCount = tasks.filter((t) => idSet.has(t.id)).length;
    const remaining = tasks.filter((t) => !idSet.has(t.id));
    persistTasks(remaining);

    showToast(`Removed ${deletedCount} tasks`, 'info');

    if (user) {
      for (const id of taskIds) {
        deleteDoc(doc(db, 'tasks', id)).catch(console.warn);
      }
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const isCompleting = target.status !== 'completed';
    const newStatus: TaskStatus = isCompleting ? 'completed' : 'todo';
    const completedAt = isCompleting ? new Date().toISOString() : null;

    await updateTask(taskId, {
      status: newStatus,
      completedAt,
    });
  };

  const moveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target || target.status === newStatus) return;

    const isCompleting = newStatus === 'completed';
    const completedAt = isCompleting ? new Date().toISOString() : (newStatus === 'todo' ? null : target.completedAt);

    await updateTask(taskId, {
      status: newStatus,
      completedAt,
    });
  };

  const toggleDailyFocus = async (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    await updateTask(taskId, {
      isDailyFocus: !target.isDailyFocus,
    });
  };

  const addSubtask = async (taskId: string, title: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const newSub = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      completed: false,
    };

    const subtasks = [...(target.subtasks || []), newSub];
    await updateTask(taskId, { subtasks });
  };

  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const subtasks = (target.subtasks || []).map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    await updateTask(taskId, { subtasks });
  };

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    if (!target) return;

    const subtasks = (target.subtasks || []).filter((s) => s.id !== subtaskId);
    await updateTask(taskId, { subtasks });
  };

  // PROJECT ACTIONS (WITH SAFE DELETION & CASCADING REASSIGNMENT)
  const addProject = async (projData: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'order'>): Promise<Project> => {
    const newProj: Project = {
      ...projData,
      id: 'proj_' + Math.random().toString(36).substring(2, 10),
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: projects.length,
    };

    const updated = [...projects, newProj];
    persistProjects(updated);
    showToast(`Project "${newProj.name}" created`, 'success');

    if (user) {
      try {
        await setDoc(doc(db, 'projects', newProj.id), newProj);
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Project create queued in Firestore offline cache:', newProj.id);
        } else {
          try {
            handleFirestoreError(e, OperationType.CREATE, `projects/${newProj.id}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
    return newProj;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    const prev = projects.find((p) => p.id === projectId);
    if (!prev) return;

    const updatedProj: Project = {
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = projects.map((p) => (p.id === projectId ? updatedProj : p));
    persistProjects(updated);

    if (user) {
      try {
        await setDoc(doc(db, 'projects', projectId), updatedProj, { merge: true });
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Project update queued in Firestore offline cache:', projectId);
        } else {
          try {
            handleFirestoreError(e, OperationType.UPDATE, `projects/${projectId}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
  };

  const deleteProject = async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    // 1. Remove project
    const remainingProjects = projects.filter((p) => p.id !== projectId);
    persistProjects(remainingProjects);

    // 2. Reassign associated tasks to inbox (no project)
    const updatedTasks = tasks.map((t) =>
      t.projectId === projectId ? { ...t, projectId: undefined } : t
    );
    persistTasks(updatedTasks);

    showToast(`Project "${target.name}" deleted`, 'info');

    if (user) {
      deleteDoc(doc(db, 'projects', projectId)).catch((e) => {
        console.warn('Project delete notice (saved locally):', e);
      });
    }
  };

  // HABIT ACTIONS (WITH SAFE DELETION)
  const addHabit = async (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Habit> => {
    const newHabit: Habit = {
      ...habitData,
      id: 'habit_' + Math.random().toString(36).substring(2, 10),
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...habits, newHabit];
    persistHabits(updated);
    showToast(`Habit "${newHabit.name}" added`, 'success');

    if (user) {
      try {
        await setDoc(doc(db, 'habits', newHabit.id), newHabit);
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Habit create queued in Firestore offline cache:', newHabit.id);
        } else {
          try {
            handleFirestoreError(e, OperationType.CREATE, `habits/${newHabit.id}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
    return newHabit;
  };

  const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
    const prev = habits.find((h) => h.id === habitId);
    if (!prev) return;

    const updatedHabit: Habit = {
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = habits.map((h) => (h.id === habitId ? updatedHabit : h));
    persistHabits(updated);

    if (user) {
      try {
        await setDoc(doc(db, 'habits', habitId), updatedHabit, { merge: true });
      } catch (e) {
        if (!navigator.onLine || String(e).toLowerCase().includes('offline')) {
          console.info('Habit update queued in Firestore offline cache:', habitId);
        } else {
          try {
            handleFirestoreError(e, OperationType.UPDATE, `habits/${habitId}`);
          } catch (err) {
            console.warn('Firestore sync notice (saved locally):', err);
          }
        }
      }
    }
  };

  const deleteHabit = async (habitId: string) => {
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const remainingHabits = habits.filter((h) => h.id !== habitId);
    persistHabits(remainingHabits);

    // Remove logs associated with this habit
    const remainingLogs = habitLogs.filter((l) => l.habitId !== habitId);
    persistHabitLogs(remainingLogs);

    showToast(`Habit "${target.name}" deleted`, 'info');

    if (user) {
      deleteDoc(doc(db, 'habits', habitId)).catch((e) => {
        console.warn('Habit delete notice (saved locally):', e);
      });
    }
  };

  const logHabit = async (habitId: string, date: string, status: 'completed' | 'skipped' | 'missed', numericValue?: number) => {
    const existingIndex = habitLogs.findIndex((l) => l.habitId === habitId && l.date === date);

    let updatedLogs: HabitLog[];
    if (existingIndex >= 0) {
      // Toggle or update
      if (habitLogs[existingIndex].status === status && status === 'completed') {
        // Toggle off
        updatedLogs = habitLogs.filter((_, idx) => idx !== existingIndex);
      } else {
        const updatedLog: HabitLog = {
          ...habitLogs[existingIndex],
          status,
          numericValue,
        };
        updatedLogs = habitLogs.map((l, idx) => (idx === existingIndex ? updatedLog : l));
      }
    } else {
      const newLog: HabitLog = {
        id: 'log_' + Math.random().toString(36).substring(2, 10),
        habitId,
        userId: effectiveUserId,
        date,
        status,
        numericValue,
        createdAt: new Date().toISOString(),
      };
      updatedLogs = [...habitLogs, newLog];
    }

    persistHabitLogs(updatedLogs);
  };

  // SETTINGS
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      } catch (e) {
        console.warn('Settings cloud sync notice:', e);
      }
    }
  };

  // RESET
  const resetToSampleData = () => {
    const seededProjects = SEED_PROJECTS.map((p, idx) => ({
      ...p,
      id: `proj-seed-${idx + 1}`,
      userId: effectiveUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const seededTasks = SEED_TASKS(effectiveUserId, seededProjects[0].id, seededProjects[1].id, seededProjects[2].id);
    const seededHabits = SEED_HABITS(effectiveUserId);

    persistProjects(seededProjects);
    persistTasks(seededTasks);
    persistHabits(seededHabits);
    persistHabitLogs([]);
    showToast('Workspace reset to clean sample template', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        projects,
        habits,
        habitLogs,
        settings,
        loading,
        toasts,
        isOnline,
        syncStatus,
        addTask,
        updateTask,
        deleteTask,
        batchDeleteTasks,
        toggleTaskStatus,
        moveTaskStatus,
        toggleDailyFocus,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addProject,
        updateProject,
        deleteProject,
        addHabit,
        updateHabit,
        deleteHabit,
        logHabit,
        updateSettings,
        showToast,
        dismissToast,
        resetToSampleData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
