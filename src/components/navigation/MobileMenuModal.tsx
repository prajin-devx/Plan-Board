import React from 'react';
import {
  X,
  Calendar,
  Sparkles,
  FolderKanban,
  Layers,
  Settings,
  LogIn,
  LogOut,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface MobileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
  activeTab: NavigationTab;
}

export function MobileMenuModal({ isOpen, onClose, onNavigate, activeTab }: MobileMenuModalProps) {
  const { user, isGuest, signInWithGoogle, signOut } = useAuth();
  const { resetToSampleData } = useData();

  if (!isOpen) return null;

  const handleSelect = (tab: NavigationTab) => {
    onNavigate(tab);
    onClose();
  };

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'calendar', label: 'Calendar & Deadlines', icon: Calendar },
    { id: 'habits', label: 'Habit Consistency', icon: Sparkles },
    { id: 'projects', label: 'Projects & Workspaces', icon: FolderKanban },
    { id: 'insights', label: 'Productivity Insights', icon: Layers },
    { id: 'settings', label: 'Settings & Themes', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-t-2xl border-t border-neutral-200 dark:border-neutral-800 p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">Plan Board Menu</h3>
            <p className="text-xs text-neutral-500">Navigation & Preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <Icon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Tools */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <button
            onClick={() => {
              resetToSampleData();
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
          >
            <RotateCcw className="w-4 h-4 text-neutral-400" />
            <span>Reset Demo Workspace Data</span>
          </button>
        </div>

        {/* User Account Section */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-700 dark:text-neutral-200">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                {user?.displayName || 'Guest Planner'}
              </p>
              <p className="text-[10px] text-neutral-500">
                {isGuest ? 'Local storage only' : 'Cloud sync active'}
              </p>
            </div>
          </div>

          {isGuest ? (
            <button
              onClick={() => {
                signInWithGoogle();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
