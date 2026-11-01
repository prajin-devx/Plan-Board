import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Zap,
  LayoutGrid,
  Palette,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { COLOR_PALETTES } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const { settings, updateSettings } = useData();

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6 overflow-hidden animate-in fade-in zoom-in-95 duration-250">
        {/* Step indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step
                    ? 'w-7 bg-blue-600 dark:bg-blue-400'
                    : idx < step
                    ? 'w-3 bg-blue-200 dark:bg-blue-900/60'
                    : 'w-2 bg-neutral-200 dark:bg-neutral-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            Step {step + 1} of {totalSteps}
          </span>
        </div>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <CheckSquare className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Welcome to Plan Board
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 max-w-sm mx-auto leading-relaxed">
                A colorful, modern productivity board combining visual Flow, energy-based task intensity, and habit consistency.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2 text-left">
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40">
                <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Visual Flow</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Fluid progress & stage momentum</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                <Zap className="w-4 h-4 text-amber-500 mb-1" />
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Task Intensity</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Energy & cognitive weighting</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40">
                <Sparkles className="w-4 h-4 text-emerald-500 mb-1" />
                <p className="text-xs font-bold text-neutral-900 dark:text-white">Vibrant Themes</p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Custom color palettes & fonts</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Task Intensity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">5-Level Task Intensity</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Not all tasks are created equal. Label tasks from quick administrative chores to deep cognitive work.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { lvl: 'L1', name: 'Light', desc: 'Quick low-effort tasks (< 15 mins)', color: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' },
                { lvl: 'L3', name: 'Moderate', desc: 'Standard focus and structured thinking', color: 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400' },
                { lvl: 'L5', name: 'Intense', desc: 'Demanding, high-stake problem solving', color: 'border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400' },
              ].map((item) => (
                <div
                  key={item.lvl}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${item.color}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white/80 dark:bg-black/30">
                      {item.lvl}
                    </span>
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <p className="text-[11px] opacity-80">{item.desc}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 shrink-0 opacity-70" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Multi-View Agility */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Flow, Lists & Calendar</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Adapt Plan Board to your working style. Switch effortlessly between interactive Flow columns, compact lists, or monthly calendar deadlines.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-xs">
                  <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Flow Board</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  To-Do, In Progress, and Done stages with fluid progress and instant deletion.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Calendar Schedule</span>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Map due dates to dates, plan weekly workload, and avoid last-minute deadline stress.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Customize Theme & Palette */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Choose Your Starter Aesthetic</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Tailor your personal dashboard. Select your favorite accent palette to get started.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {COLOR_PALETTES.slice(0, 4).map((pal) => {
                const isSelected = settings.paletteId === pal.id;
                return (
                  <button
                    key={pal.id}
                    onClick={() => updateSettings({ paletteId: pal.id, accentColor: pal.accent })}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50/80 dark:bg-blue-950/80 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: pal.accent }}
                    />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-blue-950 dark:text-blue-200' : 'text-neutral-900 dark:text-white'}`}>{pal.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95"
          >
            <span>{step === totalSteps - 1 ? 'Start Planning' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
