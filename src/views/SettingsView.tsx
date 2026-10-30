import React from 'react';
import {
  Settings,
  Palette,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  Trash2,
  LogIn,
  LogOut,
  Type,
  Check,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { COLOR_PALETTES, FontChoice, Priority, IntensityLevel } from '../types';

export function SettingsView() {
  const { settings, updateSettings, resetToSampleData, tasks, batchDeleteTasks } = useData();
  const { user, isGuest, signInWithGoogle, signOut } = useAuth();

  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleClearAllCompleted = () => {
    const completedIds = tasks.filter((t) => t.status === 'completed').map((t) => t.id);
    if (completedIds.length > 0) {
      batchDeleteTasks(completedIds);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-neutral-500" />
          <span>Settings & Preferences</span>
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure appearance, theme palettes, typography, and cloud synchronization.
        </p>
      </div>

      {/* 1. Theme & Appearance */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
          <Sun className="w-4 h-4" />
          <span>Appearance Mode</span>
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'warm', label: 'Warm Sepia', icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = settings.theme === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => updateSettings({ theme: mode.id as any })}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">{mode.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />}
              </button>
            );
          })}
        </div>

        {/* Accent Color Palettes */}
        <div className="pt-2 space-y-2">
          <label className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Modern Color Palette</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = settings.paletteId === pal.id;
              return (
                <button
                  key={pal.id}
                  onClick={() => updateSettings({ paletteId: pal.id, accentColor: pal.accent })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: pal.accent }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">{pal.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="pt-2 space-y-2">
          <label className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
            <Type className="w-3.5 h-3.5" />
            <span>Interface Typography</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'jakarta', name: 'Plus Jakarta' },
              { id: 'inter', name: 'Inter Display' },
              { id: 'editorial', name: 'Editorial Serif' },
              { id: 'mono', name: 'JetBrains Mono' },
            ].map((f) => {
              const isSelected = settings.fontChoice === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => updateSettings({ fontChoice: f.id as FontChoice })}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Account & Cloud Synchronization */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Cloud Sync & Account</h4>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
            {user ? user.email : 'Local Guest Mode'}
          </p>
          <p className="text-xs text-neutral-500">
            {user
              ? 'Your boards and tasks automatically sync with Google Cloud Firestore.'
              : 'Tasks are securely saved to your local browser storage. Sign in with Google to enable cross-device cloud sync.'}
          </p>
        </div>

        <div>
          {isGuest ? (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Google Account</span>
            </button>
          ) : (
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Data Hygiene & Deletion Tools */}
      <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Workspace Data Management</h4>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Clear Completed Tasks</p>
            <p className="text-[11px] text-neutral-500">Permanently delete all {completedCount} finished tasks</p>
          </div>
          <button
            onClick={handleClearAllCompleted}
            disabled={completedCount === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-100/60 dark:hover:bg-rose-950/60 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Finished Tasks</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Reset Demo Template</p>
            <p className="text-[11px] text-neutral-500">Restore clean sample projects, intensity levels, and tasks</p>
          </div>
          <button
            onClick={resetToSampleData}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
