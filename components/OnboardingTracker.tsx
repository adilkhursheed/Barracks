import React from 'react';
import { 
  Check, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Target,
  Lock,
  Clock,
  ChevronRight
} from 'lucide-react';
import { OnboardingStatus } from '../types';

interface OnboardingTrackerProps {
  status: OnboardingStatus;
  canEdit: boolean;
  onToggle: (key: keyof OnboardingStatus) => void;
}

const OnboardingTracker: React.FC<OnboardingTrackerProps> = ({ status, canEdit, onToggle }) => {
  const stages: { key: keyof OnboardingStatus; label: string }[] = [
    { key: 'lumovyEmail', label: 'Email' },
    { key: 'bgvId', label: 'BGV' },
    { key: 'onboardingSubmitted', label: 'Onboarding' },
    { key: 'scocCompleted', label: 'SCoC' },
    { key: 'vidReceived', label: 'V-ID' },
    { key: 'identityPassed', label: 'Identity Pass' },
    { key: 'passkeysGenerated', label: 'Account Setup' },
    { key: 'teamIntroduced', label: 'Intro' },
  ];

  const activeStepIndex = stages.findIndex(s => !status[s.key]);
  const isComplete = activeStepIndex === -1;

  return (
    <div className="w-full">
      {/* Symmetrical Milestone Grid - Updated to Green/Grey Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, index) => {
          const isDone = status[stage.key];
          const isActive = index === activeStepIndex;
          const isNext = index === activeStepIndex + 1;
          const isLocked = index > activeStepIndex && !isNext && !isComplete;

          return (
            <div 
              key={stage.key}
              className={`relative p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between group h-24 ${
                isDone 
                  ? 'bg-emerald-50/40 border-emerald-100/30 shadow-sm' 
                  : isActive 
                    ? 'bg-white border-slate-300 shadow-xl shadow-slate-900/5 scale-[1.01] z-10 ring-2 ring-slate-100' 
                    : isNext
                      ? 'bg-white border-slate-200 border-dashed opacity-100'
                      : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Status Indicator: Green if Done, Grey if Pending */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isDone 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                    : isActive 
                      ? 'bg-slate-200 text-slate-500 border border-slate-300' 
                      : 'bg-slate-100 text-slate-300'
                }`}>
                  {isDone ? <Check size={18} strokeWidth={3} /> : isActive ? <Zap size={18} className="animate-pulse" /> : <Lock size={16} />}
                </div>

                <div className="min-w-0">
                  <h5 className={`text-[13px] font-bold tracking-tight leading-none truncate ${isDone ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {stage.label}
                  </h5>
                  {isNext && (
                    <p className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-[0.1em] leading-none">Next Step</p>
                  )}
                  {isDone && (
                    <p className="text-[9px] font-bold text-emerald-500/60 mt-2 uppercase tracking-widest leading-none">Verified</p>
                  )}
                  {isLocked && !isDone && !isActive && (
                    <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-widest leading-none">Awaiting</p>
                  )}
                </div>
              </div>

              {/* Contextual Actions */}
              <div className="flex items-center gap-3">
                {isActive && canEdit && (
                  <button 
                    onClick={() => onToggle(stage.key)}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-90 shadow-md flex items-center justify-center"
                    title="Mark Milestone Complete"
                  >
                    <ArrowRight size={14} />
                  </button>
                )}
                {isLocked && (
                  <Clock size={16} className="text-slate-200" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingTracker;