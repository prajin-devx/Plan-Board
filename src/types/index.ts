export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface IntensityConfig {
  level: IntensityLevel;
  name: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  bars: number;
}

export const INTENSITY_LEVELS: Record<IntensityLevel, IntensityConfig> = {
  1: {
    level: 1,
    name: 'Light',
    tagline: 'Quick, low-effort action',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    bars: 1,
  },
  2: {
    level: 2,
    name: 'Easy',
    tagline: 'Simple, routine attention',
    color: 'text-teal-700 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/50',
    borderColor: 'border-teal-200 dark:border-teal-800',
    bars: 2,
  },
  3: {
    level: 3,
    name: 'Moderate',
    tagline: 'Sustained focus & thinking',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
    borderColor: 'border-amber-200 dark:border-amber-800',
    bars: 3,
  },
  4: {
    level: 4,
    name: 'Deep',
    tagline: 'Challenging, high concentration',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    borderColor: 'border-orange-200 dark:border-orange-800',
    bars: 4,
  },
  5: {
    level: 5,
    name: 'Intense',
    tagline: 'Demanding, high-stake output',
    color: 'text-rose-700 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/50',
    borderColor: 'border-rose-200 dark:border-rose-800',
    bars: 5,
  },
};

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  intensity: IntensityLevel;
  isDailyFocus: boolean;
  scheduledDate?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  estimatedMinutes?: number;
  actualMinutes?: number;
  projectId?: string;
  labels: string[];
  subtasks: Subtask[];
  recurrenceRule?: 'daily' | 'weekdays' | 'weekly' | 'monthly' | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export type HabitTrackingMethod = 'binary' | 'numeric' | 'duration';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekly_target';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  frequency: HabitFrequency;
  targetDaysPerWeek?: number; // For weekly_target (e.g. 4)
  trackingMethod: HabitTrackingMethod;
  targetValue?: number; // e.g. 2000 (ml) or 30 (mins)
  unit?: string; // e.g. 'ml', 'pages', 'mins'
  isArchived: boolean;
  isPaused: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HabitLogStatus = 'completed' | 'skipped' | 'missed';

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  status: HabitLogStatus;
  numericValue?: number;
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  isArchived: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  notes?: string;
  completedAt: string;
  createdAt: string;
}

export type FontChoice = 'jakarta' | 'inter' | 'editorial' | 'mono';

export interface ColorPalette {
  id: string;
  name: string;
  accent: string;
  ring: string;
  glow: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'emerald', name: 'Emerald Forest', accent: '#10b981', ring: 'ring-emerald-500', glow: 'bg-emerald-500/10' },
  { id: 'indigo', name: 'Electric Indigo', accent: '#6366f1', ring: 'ring-indigo-500', glow: 'bg-indigo-500/10' },
  { id: 'amber', name: 'Studio Amber', accent: '#f59e0b', ring: 'ring-amber-500', glow: 'bg-amber-500/10' },
  { id: 'rose', name: 'Rose Velvet', accent: '#f43f5e', ring: 'ring-rose-500', glow: 'bg-rose-500/10' },
  { id: 'cyan', name: 'Ocean Cyan', accent: '#06b6d4', ring: 'ring-cyan-500', glow: 'bg-cyan-500/10' },
  { id: 'slate', name: 'Minimal Slate', accent: '#64748b', ring: 'ring-slate-500', glow: 'bg-slate-500/10' },
  { id: 'obsidian', name: 'Monochrome', accent: '#171717', ring: 'ring-neutral-900 dark:ring-white', glow: 'bg-neutral-900/10' },
];

export interface UserSettings {
  theme: 'light' | 'dark' | 'warm' | 'system';
  accentColor: string;
  paletteId: string;
  fontChoice: FontChoice;
  weekStart: 'monday' | 'sunday';
  defaultPriority: Priority;
  defaultIntensity: IntensityLevel;
  dailyFocusLimit: number;
  soundEnabled: boolean;
}

export type NavigationTab = 
  | 'today'
  | 'inbox'
  | 'tasks'
  | 'calendar'
  | 'habits'
  | 'projects'
  | 'insights'
  | 'settings';
