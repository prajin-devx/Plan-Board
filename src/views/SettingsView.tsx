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
import { COLOR_PALETTES, FontChoice } from '../types';

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
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          <span>Personalization</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">Preferences</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-neutral-500" />
          <span>Settings & Preferences</span>
        </h3>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
          Configure appearance modes, accent color palettes, typography, and cloud synchronization.
        </p>
      </div>

      {/* 1. Theme & Appearance */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <Sun className="w-4 h-4" />
          <span>Appearance Mode</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light Clean', icon: Sun },
            { id: 'dark', label: 'Obsidian Dark', icon: Moon },
            { id: 'warm', label: 'Warm Sepia', icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = settings.theme === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => updateSettings({ theme: mode.id as any })}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/50 shadow-xs font-bold ring-1 ring-blue-500/20'
                    : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400'}`} />
                  <span className={`text-xs font-semibold ${isSelected ? 'text-blue-950 dark:text-blue-200' : 'text-neutral-900 dark:text-white'}`}>{mode.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>

        {/* Accent Color Palettes */}
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              <span>Modern Color Palettes</span>
            </label>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Active: {COLOR_PALETTES.find((p) => p.id === settings.paletteId)?.name || 'Cobalt Blue'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = settings.paletteId === pal.id;
              return (
                <button
                  key={pal.id}
                  onClick={() => updateSettings({ paletteId: pal.id, accentColor: pal.accent })}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/60 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: pal.accent }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className={`text-xs font-semibold truncate ${isSelected ? 'text-blue-950 dark:text-blue-200' : 'text-neutral-900 dark:text-white'}`}>
                    {pal.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="pt-2 space-y-2.5">
          <label className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Type className="w-3.5 h-3.5" />
            <span>Interface Typography</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
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
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Cloud Sync & Account</h4>
          <p className="text-sm font-bold text-neutral-900 dark:text-white">
            {user ? user.email : 'Local Guest Mode'}
          </p>
          <p className="text-xs text-neutral-500 max-w-md">
            {user
              ? 'Your boards, habits, and tasks automatically sync with Google Cloud Firestore.'
              : 'Tasks are securely saved to your local offline browser storage. Sign in with Google to enable multi-device cloud synchronization.'}
          </p>
        </div>

        <div>
          {isGuest ? (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all active:scale-95 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Google Account</span>
            </button>
          ) : (
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Data Hygiene & Deletion Tools */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Workspace Data Management</h4>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Clear Finished Tasks</p>
            <p className="text-[11px] text-neutral-500">Permanently delete all {completedCount} completed tasks</p>
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">Reset Sample Workspace</p>
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
