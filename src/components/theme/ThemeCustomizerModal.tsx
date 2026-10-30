import React from 'react';
import { X, Check, Sun, Moon, Sparkles, Type, Palette } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { COLOR_PALETTES, FontChoice } from '../../types';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONTS: { id: FontChoice; name: string; description: string; sample: string }[] = [
  { id: 'jakarta', name: 'Plus Jakarta Sans', description: 'Clean, modern geometrical neo-grotesque', sample: 'Modern, balanced clarity' },
  { id: 'inter', name: 'Inter Display', description: 'Crisp, high-legibility interface typography', sample: 'Optimal data reading' },
  { id: 'editorial', name: 'Playfair Editorial', description: 'Refined serif styling with literary poise', sample: 'Distinctive thoughtful elegance' },
  { id: 'mono', name: 'JetBrains Mono', description: 'Technical, monospaced developer precision', sample: 'Structured code aesthetic' },
];

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { settings, updateSettings } = useData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Theme & Dashboard Styling</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Personalize color palettes, typography, and contrast</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Appearance / Mode */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5" />
            <span>Appearance Mode</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'light', label: 'Light', icon: Sun, desc: 'Crisp studio daylight' },
              { id: 'dark', label: 'Dark', icon: Moon, desc: 'Deep obsidian night' },
              { id: 'warm', label: 'Warm Sepia', icon: Sparkles, desc: 'Soft paper ambient' },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = settings.theme === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => updateSettings({ theme: mode.id as 'light' | 'dark' | 'warm' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/80 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />}
                  </div>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">{mode.label}</p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">{mode.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Modern Color Palettes */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>Accent Color Palette</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COLOR_PALETTES.map((pal) => {
              const isSelected = settings.paletteId === pal.id;
              return (
                <button
                  key={pal.id}
                  onClick={() => updateSettings({ paletteId: pal.id, accentColor: pal.accent })}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 shadow-xs ring-1 ring-neutral-900/10 dark:ring-white/10'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: pal.accent }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{pal.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Typography / Font Choices */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>Interface Typography</span>
          </label>
          <div className="space-y-2">
            {FONTS.map((font) => {
              const isSelected = settings.fontChoice === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => updateSettings({ fontChoice: font.id })}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800/60 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">{font.name}</span>
                      <span className="text-[10px] text-neutral-400">· {font.description}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 italic opacity-85">
                      "{font.sample}"
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Sample */}
        <div className="p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Live Preview</span>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: settings.accentColor || '#10b981' }}
              />
              <span className="text-xs font-semibold text-neutral-900 dark:text-white">Active Milestone Card</span>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: settings.accentColor || '#10b981' }}
            >
              On Track
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
