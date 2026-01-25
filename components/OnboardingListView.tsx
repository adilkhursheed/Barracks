import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  Rocket, ArrowLeft, ShieldCheck, CheckCircle2, Search, X, AlertCircle, Users, ArrowRight,
  Target, Zap, UserCog, Clock, ChevronRight, CircleDot, Lock, Check
} from 'lucide-react';
import { Employee, TeamAssignment, OnboardingStatus } from '../types';
import OnboardingTracker from './OnboardingTracker';

interface OnboardingListViewProps {
  employees: Employee[];
  projectAssignments: TeamAssignment[];
  onViewEmployee: (id: string) => void;
  onNavigate: (view: string) => void;
  onUpdateOnboarding: (employeeId: string, status: OnboardingStatus) => void;
  onUpdateEmployee: (emp: Employee) => void;
  canEdit: boolean;
  focusId?: string | null;
}

const ModalLogo = () => (
  <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
    <div className="absolute inset-0 bg-blue-600 rounded-md opacity-20 blur-[2px]"></div>
    <div className="absolute inset-0 bg-blue-600 rounded-md rotate-3 shadow-sm"></div>
    <div className="absolute inset-0 bg-slate-900 rounded-md -rotate-3"></div>
    <span className="text-white relative z-10 font-black text-[10px] leading-none select-none">@</span>
  </div>
);

const OnboardingListView: React.FC<OnboardingListViewProps> = ({ 
  employees, 
  projectAssignments, 
  onViewEmployee,
  onNavigate,
  onUpdateOnboarding,
  onUpdateEmployee,
  canEdit,
  focusId
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [emailModalEmpId, setEmailModalEmpId] = useState<string | null>(null);
  const [lumovyEmailModalEmpId, setLumovyEmailModalEmpId] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState('');
  const [tempLumovyEmail, setTempLumovyEmail] = useState('');
  const [tempPersonnelNumber, setTempPersonnelNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [leadModalEmpId, setLeadModalEmpId] = useState<string | null>(null);
  const [tempLeadName, setTempLeadName] = useState('');

  // Handle focus and auto-scroll
  useEffect(() => {
    if (focusId) {
      setExpandedId(focusId);
    }
  }, [focusId]);

  useEffect(() => {
    if (expandedId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`onboarding-container-${expandedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [expandedId]);

  const onboardingStages: { key: keyof OnboardingStatus; label: string }[] = [
    { key: 'lumovyEmail', label: 'Email' },
    { key: 'bgvId', label: 'BGV' },
    { key: 'onboardingSubmitted', label: 'Onboarding' },
    { key: 'scocCompleted', label: 'SCoC' },
    { key: 'vidReceived', label: 'V-ID' },
    { key: 'identityPassed', label: 'Identity Pass' },
    { key: 'passkeysGenerated', label: 'Account Setup' },
    { key: 'teamIntroduced', label: 'Intro' },
  ];

  const onboardingRegistry = useMemo(() => {
    return employees
      .filter(emp => !!emp.onboarding)
      .map(emp => {
        const completedCount = onboardingStages.filter(s => emp.onboarding![s.key]).length;
        const percentage = Math.round((completedCount / onboardingStages.length) * 100);
        const isComplete = percentage === 100;
        const nextStep = isComplete ? null : (onboardingStages.find(s => !emp.onboarding![s.key])?.label || null);
        
        const assignment = projectAssignments.find(pa => pa.employeeId === emp.id);
        const teamName = assignment?.role || "Awaiting Matrix";

        return { ...emp, percentage, nextStep, completedCount, isComplete, teamName };
      })
      .sort((a, b) => {
        if (a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1;
        return b.percentage - a.percentage;
      });
  }, [employees, projectAssignments]);

  const handleToggleStage = (employeeId: string, currentStatus: OnboardingStatus, key: keyof OnboardingStatus) => {
    if (key === 'lumovyEmail' && !currentStatus.lumovyEmail) {
      setLumovyEmailModalEmpId(employeeId);
      const emp = employees.find(e => e.id === employeeId);
      setTempLumovyEmail(emp?.lumovyEmail || '');
      setValidationError(null);
      return;
    }

    if (key === 'vidReceived' && !currentStatus.vidReceived) {
      setEmailModalEmpId(employeeId);
      setTempEmail('');
      setTempPersonnelNumber('');
      setValidationError(null);
      return;
    }

    if (key === 'teamIntroduced' && !currentStatus.teamIntroduced) {
      setLeadModalEmpId(employeeId);
      setTempLeadName('');
      return;
    }
    
    const newStatus = { ...currentStatus, [key]: !currentStatus[key] };
    onUpdateOnboarding(employeeId, newStatus);
  };

  const handleLumovyEmailSubmit = () => {
    if (!lumovyEmailModalEmpId) return;
    const isValid = tempLumovyEmail.toLowerCase().endsWith('@lumovy.com');
    if (!isValid) { setValidationError("Email must end with @lumovy.com"); return; }

    const emp = employees.find(e => e.id === lumovyEmailModalEmpId);
    if (emp) {
      onUpdateEmployee({ ...emp, lumovyEmail: tempLumovyEmail });
      if (emp.onboarding) onUpdateOnboarding(lumovyEmailModalEmpId, { ...emp.onboarding, lumovyEmail: true });
    }
    setLumovyEmailModalEmpId(null);
    setValidationError(null);
  };

  const handleCredentialsSubmit = () => {
    if (!emailModalEmpId) return;
    const isEmailValid = tempEmail.toLowerCase().endsWith('@microsoft.com');
    const isIdValid = /^\d{7}$/.test(tempPersonnelNumber);
    if (!isEmailValid) { setValidationError("Email must end with @microsoft.com"); return; }
    if (!isIdValid) { setValidationError("ID must be 7 digits"); return; }

    const emp = employees.find(e => e.id === emailModalEmpId);
    if (emp) {
      onUpdateEmployee({ ...emp, microsoftEmail: tempEmail, microsoftPersonnelNumber: tempPersonnelNumber });
      if (emp.onboarding) onUpdateOnboarding(emailModalEmpId, { ...emp.onboarding, vidReceived: true });
    }
    setEmailModalEmpId(null);
    setValidationError(null);
  };

  const handleLeadSubmit = () => {
    if (!leadModalEmpId) return;
    const emp = employees.find(e => e.id === leadModalEmpId);
    if (emp) {
      onUpdateEmployee({ ...emp, microsoftLead: tempLeadName });
      if (emp.onboarding) onUpdateOnboarding(leadModalEmpId, { ...emp.onboarding, teamIntroduced: true });
    }
    setLeadModalEmpId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <button onClick={() => onNavigate('dashboard')} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Overview
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Onboarding Pipeline</h1>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {onboardingRegistry.length > 0 ? onboardingRegistry.map((emp) => {
            const isExpanded = expandedId === emp.id;
            const activeStepIndex = onboardingStages.findIndex(s => !emp.onboarding![s.key]);

            return (
              <div key={emp.id} id={`onboarding-container-${emp.id}`} className="flex flex-col transition-all duration-500">
                <div 
                  className={`px-6 py-10 transition-all flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:bg-slate-50/40 ${isExpanded ? 'bg-slate-50/60' : ''}`}
                >
                  
                  {/* Personnel Identity - Locked Width for Consistency */}
                  <div className="flex items-center gap-4 xl:w-[280px] shrink-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-base transition-all shadow-sm shrink-0 ${emp.isComplete ? 'bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-400' : 'bg-white text-slate-200 border border-slate-100'}`}>
                      {emp.isComplete ? <Check size={20} strokeWidth={3} /> : emp.firstName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 truncate tracking-tight leading-none">{emp.fullName}</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 leading-none">{emp.designation}</p>
                    </div>
                  </div>

                  {/* Stretched Horizontal Pipeline Map - Middle flex-grow */}
                  <div className={`flex-grow hidden lg:flex items-center justify-center px-6 transition-all duration-700 ${isExpanded ? 'opacity-10 scale-[0.99] blur-[2px]' : 'opacity-100'}`}>
                    <div className="relative w-full flex items-center justify-between mx-auto">
                      {/* Grey Background track */}
                      <div className="absolute top-[10px] left-0 right-0 h-[2.5px] bg-slate-100 rounded-full overflow-hidden">
                        {/* Green Progress overlay */}
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                          style={{ 
                            width: `${(emp.completedCount / onboardingStages.length) * 100}%`
                          }}
                        />
                      </div>
                      
                      {onboardingStages.map((stage, idx) => {
                        const isDone = emp.onboarding![stage.key];
                        const isActive = idx === activeStepIndex;
                        
                        return (
                          <div key={stage.key} className="relative flex flex-col items-center flex-1">
                            {/* Circle checkpoints: Green if Done, Grey if Not */}
                            <div className={`w-5 h-5 rounded-full border-[2px] transition-all duration-500 relative z-10 flex items-center justify-center ${
                              isDone ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30' : 
                              isActive ? 'bg-white border-slate-300 ring-4 ring-slate-100 animate-pulse' : 
                              'bg-slate-200 border-slate-300'
                            }`}>
                              {isDone ? (
                                <Check size={11} className="text-white" strokeWidth={4} />
                              ) : isActive ? (
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                              ) : null}
                            </div>
                            
                            {/* Labels: Green if Done, Readable Grey if Not */}
                            <span className={`absolute top-7 text-[7.5px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all duration-500 text-center ${
                              isDone ? 'text-emerald-600' : 
                              isActive ? 'text-slate-600 font-black' : 
                              'text-slate-500'
                            }`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary & Action - Locked Width for Consistency */}
                  <div className="flex items-center justify-end shrink-0 gap-6 xl:w-[200px]">
                    <div className="hidden sm:flex flex-col items-end w-20">
                       <p className={`text-4xl font-black uppercase tracking-tighter leading-none transition-all duration-700 hover:opacity-100 ${emp.isComplete ? 'text-emerald-500 opacity-100' : 'text-slate-900 opacity-30'}`}>
                         {emp.percentage}%
                       </p>
                       <p className={`text-[7.5px] font-black uppercase tracking-[0.25em] mt-1 pr-1 transition-colors duration-500 ${emp.isComplete ? 'text-emerald-500/60' : 'text-slate-400'}`}>COMPLETE</p>
                    </div>
                    <button 
                      onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                      className={`h-9 px-5 rounded-lg font-black text-[8.5px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shrink-0 ${isExpanded ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30' : 'bg-white text-slate-900 border border-slate-200 hover:border-blue-600 hover:shadow-md active:scale-95'}`}
                    >
                      {isExpanded ? 'CLOSE' : 'MANAGE'}
                      <ChevronRight size={12} className={`transition-transform duration-500 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {isExpanded && emp.onboarding && (
                  <div className="px-10 pb-16 pt-8 bg-slate-50/40 animate-in slide-in-from-top-4 duration-700 border-t border-slate-100/50">
                    <div className="max-w-full mx-auto">
                      <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <Rocket size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Milestone Architecture</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sequential deployment verification status</p>
                          </div>
                        </div>
                      </div>
                      <OnboardingTracker 
                        status={emp.onboarding} 
                        canEdit={canEdit} 
                        onToggle={(key) => handleToggleStage(emp.id, emp.onboarding!, key)} 
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="py-24 text-center">
              <ShieldCheck size={40} className="text-blue-600 mx-auto mb-4 opacity-20" />
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Registry is empty.</p>
            </div>
          )}
        </div>
      </div>

      {(emailModalEmpId || lumovyEmailModalEmpId || leadModalEmpId) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-100">
            <button onClick={() => { setEmailModalEmpId(null); setLumovyEmailModalEmpId(null); setLeadModalEmpId(null); setValidationError(null); }} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={20}/>
            </button>
            {lumovyEmailModalEmpId ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3"><ModalLogo /><h3 className="text-xl font-black text-slate-900 uppercase">Lumovy Provisioning</h3></div>
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium">Specify the corporate email address provided for this personnel record.</p>
                  <input type="email" placeholder="name@lumovy.com" value={tempLumovyEmail} onChange={e => setTempLumovyEmail(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20" />
                </div>
                {validationError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{validationError}</p>}
                <button onClick={handleLumovyEmailSubmit} className="w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all">Verify & Sync</button>
              </div>
            ) : emailModalEmpId ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3"><ModalLogo /><h3 className="text-xl font-black text-slate-900 uppercase">Verification</h3></div>
                <div className="space-y-4">
                  {/* Fixed: Wrapped state dispatchers in event handlers to extract target value */}
                  <input type="email" placeholder="name@microsoft.com" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20" />
                  <input type="text" maxLength={7} placeholder="Personnel ID" value={tempPersonnelNumber} onChange={(e) => setTempPersonnelNumber(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20" />
                </div>
                {validationError && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{validationError}</p>}
                <button onClick={handleCredentialsSubmit} className="w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all">Complete Milestone</button>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-3"><ModalLogo /><h3 className="text-xl font-black text-slate-900 uppercase">Lead Sync</h3></div>
                <input type="text" placeholder="Microsoft Lead Name" value={tempLeadName} onChange={e => setTempLeadName(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20" />
                <button onClick={handleLeadSubmit} className="w-full py-4 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all">Confirm Handover</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingListView;