import React, { useMemo } from 'react';
import { 
  Users, 
  Layout, 
  Rocket, 
  Plus, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Zap
} from 'lucide-react';
import { Employee, Asset, Team, EmploymentStatus, OnboardingStatus } from '../types';

interface DashboardProps {
  employees: Employee[];
  assets: Asset[];
  projects: Team[];
  auditLogs: any[];
  onViewEmployee: (id: string) => void;
  onViewOnboarding?: (id: string) => void;
  onViewProject: (id: string) => void;
  onViewAsset: (id: string) => void;
  onEditEmployee: (emp: Employee) => void;
  onAddEmployee?: () => void;
  onDeactivateEmployee: (id: string) => void;
  onReactivateEmployee: (id: string) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
  onEditProject: (proj: Team) => void;
  onToggleProjectStatus: (id: string, status: any) => void;
  onNavigate: (view: string) => void;
  canEdit: boolean;
  isAdmin: boolean;
  assetAssignments: any[];
  projectAssignments: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  employees, 
  projects, 
  onViewEmployee,
  onViewOnboarding,
  onAddEmployee,
  onNavigate,
  canEdit,
  projectAssignments
}) => {
  const activeEmployees = employees.filter(e => e.status === EmploymentStatus.ACTIVE).length;
  const totalTeams = projects.length;

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

  const pendingOnboardings = useMemo(() => {
    return employees
      .filter(emp => {
        const isAssigned = projectAssignments.some(pa => pa.employeeId === emp.id);
        if (!isAssigned || !emp.onboarding) return false;
        const completedCount = onboardingStages.filter(s => emp.onboarding![s.key]).length;
        return completedCount < onboardingStages.length;
      })
      .map(emp => {
        const completedCount = onboardingStages.filter(s => emp.onboarding![s.key]).length;
        const percentage = Math.round((completedCount / onboardingStages.length) * 100);
        const nextStep = onboardingStages.find(s => !emp.onboarding![s.key])?.label || 'Complete';
        return { ...emp, percentage, nextStep };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [employees, projectAssignments]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Overview</h1>
        </div>
        <div className="flex items-center gap-2">
           {canEdit && (
             <button 
               onClick={onAddEmployee}
               className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-[10px] hover:bg-blue-700 transition-all shadow-md shadow-blue-600/10 active:scale-95 group tracking-widest"
             >
               <Plus size={12} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" /> 
               ONBOARD
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button 
          onClick={() => onNavigate('teams')}
          className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100/50">
              <Layout size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{totalTeams}</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Microsoft Teams</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
        </button>

        <button 
          onClick={() => onNavigate('employees')}
          className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm border border-emerald-100/50">
              <Users size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{activeEmployees}</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active Personnel</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* Onboarding Pipeline Widget */}
      <section className="bg-white border border-slate-100 rounded-[20px] shadow-sm relative overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/10 shrink-0">
                <Rocket size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Active Onboardings</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{pendingOnboardings.length} In Progress</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('onboardings')}
              className="text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:text-emerald-600 flex items-center gap-1.5 transition-all p-1.5 rounded-lg hover:bg-blue-50"
            >
              View All <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {pendingOnboardings.length > 0 ? (
                  pendingOnboardings.slice(0, 4).map((emp) => (
                    <button 
                      key={emp.id}
                      onClick={() => onViewOnboarding ? onViewOnboarding(emp.id) : onViewEmployee(emp.id)}
                      className="relative p-3 rounded-lg border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all group text-left flex items-center gap-3 overflow-hidden"
                    >
                      {/* Fluid Background Completion Bar (Emerald Growth) - Higher Opacity */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-emerald-100/60 transition-all duration-1000 ease-out z-0 border-r border-emerald-200/40"
                        style={{ width: `${emp.percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center gap-3 w-full">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 shadow-sm">
                          {emp.firstName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight leading-tight">{emp.fullName}</p>
                          <div className="flex items-center gap-1 mt-1">
                             <Clock size={10} className="text-slate-400 shrink-0" />
                             <p className="text-[9px] font-medium text-slate-500 truncate">{emp.nextStep}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-1">
                          <div className="text-[10px] font-bold text-emerald-700 tracking-tight">{emp.percentage}%</div>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-8 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-100">
                    <ShieldCheck size={24} className="text-emerald-400 mb-2 opacity-30" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Clear</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;