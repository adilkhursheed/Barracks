import React, { useState } from 'react';
import { 
  ArrowLeft, Edit, Power, Briefcase, Monitor, Mail, 
  Shield, UserCheck, ShieldCheck, UserCircle2, MapPin, 
  Trash2, Cpu, ChevronRight, UserCog,
  AlertCircle, Fingerprint, IdCard, Calendar, CheckCircle,
  Key, Zap, ShieldAlert, ShieldX, ShieldCheck as ShieldCheckIcon,
  RefreshCw, Info, Coffee, ArrowRight, MinusCircle,
  LayoutList, Box, Sparkles, Wand2
} from 'lucide-react';
import { Employee, Asset, EmploymentStatus, AllocationStatus, OnboardingStatus, ElevatedAccess } from '../types';
import { GoogleGenAI } from "@google/genai";

interface EmployeeDetailProps {
  employee: Employee;
  assets: Asset[];
  projects: any[];
  onBack: () => void;
  canEdit: boolean;
  onUpdate: (emp: Employee) => void;
  onOffboard: (id: string) => void;
  onReactivate: (id: string) => void;
  onAssignAsset: () => void;
  onUnassignAsset: (assetId: string) => void;
  onAssignProject: () => void;
  onEndProject: (assignmentId: string) => void;
  onViewProject?: (id: string) => void;
  onViewAsset?: (id: string) => void;
  onUpdateOnboarding: (status: OnboardingStatus) => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ 
  employee, 
  assets = [], 
  projects = [], 
  onBack, 
  canEdit, 
  onUpdate, 
  onOffboard,
  onReactivate,
  onAssignAsset,
  onUnassignAsset,
  onAssignProject,
  onEndProject,
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this employee profile for project fit and skill growth:
        Name: ${employee.fullName}
        Designation: ${employee.designation}
        Skills: ${employee.skillsets.join(', ')}
        Current Project: ${projects.find(p => p.status === AllocationStatus.Active)?.projectName || 'Bench'}
        Past Projects: ${projects.filter(p => p.status === AllocationStatus.COMPLETED).map(p => p.projectName).join(', ')}
        
        Provide a concise 3-sentence summary of their "Strategic Value" and "Growth Path".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiAnalysis(response.text || "Analysis failed to generate.");
    } catch (err) {
      console.error(err);
      setAiAnalysis("AI Engine Unavailable.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeAssignment = projects.find(p => p.status === AllocationStatus.Active);
  const isBench = !activeAssignment && employee.status === EmploymentStatus.ACTIVE;

  const sortedAll = [...projects].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const timelineHistory = [];
  for (let i = 0; i < sortedAll.length; i++) {
    const current = sortedAll[i];
    
    if (i > 0) {
      const prev = sortedAll[i-1];
      if (prev.endDate && new Date(prev.endDate) < new Date(current.startDate)) {
        timelineHistory.push({
          type: 'BENCH',
          startDate: prev.endDate,
          endDate: current.startDate,
          projectName: 'ON BENCH',
          role: 'Bench Period'
        });
      }
    }
    
    if (current.status === AllocationStatus.COMPLETED) {
      timelineHistory.push({ ...current, type: 'PROJECT' });
    }
  }
  
  if (isBench && sortedAll.length > 0) {
    const last = sortedAll[sortedAll.length - 1];
    if (last.endDate) {
      timelineHistory.push({
        type: 'BENCH',
        startDate: last.endDate,
        endDate: 'PRESENT',
        projectName: 'ON BENCH',
        role: 'Bench Period'
      });
    }
  }

  const historicalDisplay = timelineHistory.reverse();

  const handleToggleAccess = (key: keyof ElevatedAccess) => {
    if (!canEdit) return;
    const currentAccess = employee.elevatedAccess || { pme: false, scAlt: false, ame: false };
    onUpdate({
      ...employee,
      elevatedAccess: {
        ...currentAccess,
        [key]: !currentAccess[key]
      }
    });
  };

  const handleBulkAccess = (status: boolean) => {
    if (!canEdit) return;
    onUpdate({
      ...employee,
      elevatedAccess: {
        pme: status,
        scAlt: status,
        ame: status
      }
    });
  };

  const scAltUsername = employee.scAltEmail ? employee.scAltEmail.split('@')[0] : 'Authorized';

  const InfoBlock = ({ label, value, icon: Icon, color = "blue", action }: { label: string, value: string | undefined, icon: any, color?: string, action?: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 group/block">
      <div className={`mt-0.5 p-1.5 rounded-lg ${
        color === 'blue' ? 'bg-blue-50 text-blue-500' : 
        color === 'emerald' ? 'bg-emerald-50 text-emerald-500' :
        'bg-rose-50 text-rose-500'
      }`}>
        <Icon size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-semibold truncate ${
            color === 'rose' ? 'text-rose-600' : 
            (label.toLowerCase().includes('id') || label.toLowerCase().includes('v-id') || label.toLowerCase().includes('bgv') ? 'font-mono text-xs' : 'text-slate-900')
          }`}>
            {value || '---'}
          </p>
          {action}
        </div>
      </div>
    </div>
  );

  const AccessCard = ({ label, isActive, icon: Icon, color, onClick, statusText }: { label: string, isActive: boolean, icon: any, color: string, onClick: () => void, statusText?: string }) => (
    <button 
      onClick={onClick}
      disabled={!canEdit}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group text-left ${
        isActive 
          ? `bg-${color}-50/50 border-${color}-200 shadow-sm` 
          : 'bg-white border-slate-100 hover:border-slate-200 opacity-60 hover:opacity-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        isActive ? `bg-${color}-600 text-white shadow-md shadow-${color}-600/20` : 'bg-slate-100 text-slate-300'
      }`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{label}</h4>
        <div className={`flex items-center gap-1 mt-1 ${isActive ? `text-${color}-600` : 'text-slate-300'}`}>
          <div className={`w-1 h-1 rounded-full ${isActive ? `bg-${color}-500` : 'bg-slate-300'}`}></div>
          <span className="text-[8px] font-bold uppercase tracking-widest">{isActive ? (statusText || 'Authorized') : 'Restricted'}</span>
        </div>
      </div>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group"
        >
          <div className="p-2 rounded-xl group-hover:bg-slate-100">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <button 
                onClick={() => onUpdate(employee)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Edit size={14} />
                Edit Profile
              </button>
              {employee.status === EmploymentStatus.ACTIVE ? (
                <button 
                  onClick={() => onOffboard(employee.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
                >
                  <Power size={14} />
                  Offboard
                </button>
              ) : (
                <button 
                  onClick={() => onReactivate(employee.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all"
                >
                  <UserCheck size={14} />
                  Reactivate
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${employee.status === EmploymentStatus.ACTIVE ? (isBench ? 'bg-amber-400' : 'bg-blue-600') : 'bg-slate-300'}`}></div>
            
            <div className="flex flex-col items-center mt-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 shadow-sm transition-all ${
                employee.status === EmploymentStatus.ACTIVE 
                  ? (isBench ? 'bg-amber-50 text-amber-600' : 'bg-blue-600 text-white') 
                  : 'bg-slate-50 text-slate-300'
              }`}>
                {employee.firstName?.charAt(0)}
              </div>
              
              <div className="space-y-1">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{employee.fullName}</h1>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{employee.designation}</p>
                <div className={`mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
                  employee.status === EmploymentStatus.ACTIVE ? (isBench ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700') : 'bg-slate-100 text-slate-500'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${employee.status === EmploymentStatus.ACTIVE ? (isBench ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-300'}`}></div>
                  {isBench ? 'ON BENCH' : employee.status}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50 text-left space-y-0.5">
              <InfoBlock 
                icon={Briefcase} 
                label="Current Team" 
                value={activeAssignment ? activeAssignment.projectName : (isBench ? 'BENCH' : 'Inactive')} 
                color={activeAssignment ? "emerald" : (isBench ? "amber" : "blue")}
                action={canEdit && employee.status === EmploymentStatus.ACTIVE && (
                  <div className="flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <button 
                      onClick={onAssignProject}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Update Assignment"
                    >
                      <Edit size={14} />
                    </button>
                    {activeAssignment && (
                      <button 
                        onClick={() => onEndProject(activeAssignment.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="End Assignment"
                      >
                        <MinusCircle size={14} />
                      </button>
                    )}
                  </div>
                )}
              />
              <InfoBlock icon={Mail} label="Corporate Email" value={employee.lumovyEmail} color="blue" />
              <InfoBlock icon={IdCard} label="Personnel Number" value={employee.microsoftPersonnelNumber} color="emerald" />
              <InfoBlock icon={Fingerprint} label="Background ID" value={employee.bgvIdString} color="emerald" />
              <InfoBlock icon={MapPin} label="Office Location" value={employee.location} color="blue" />
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-slate-900 rounded-[28px] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles size={48} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wand2 size={16} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Strategic AI Insight</h4>
            </div>
            
            {aiAnalysis ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                  {aiAnalysis}
                </p>
                <button 
                  onClick={() => setAiAnalysis(null)} 
                  className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white"
                >
                  Clear Analysis
                </button>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-[10px] text-slate-500 mb-4 font-medium italic">Generate a strategic profile summary based on project history and skill graph.</p>
                <button 
                  onClick={handleAiAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {isAnalyzing ? 'Processing...' : 'Generate Insight'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Key size={18} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">System Access</h3>
              </div>
              {canEdit && (
                <div className="flex items-center gap-4">
                  <button onClick={() => handleBulkAccess(false)} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Revoke All</button>
                  <button onClick={() => handleBulkAccess(true)} className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest hover:underline transition-all">Elevate All</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AccessCard label="SC-ALT" isActive={!!employee.elevatedAccess?.scAlt} icon={ShieldAlert} color="emerald" onClick={() => handleToggleAccess('scAlt')} statusText={scAltUsername} />
              <AccessCard label="PME" isActive={!!employee.elevatedAccess?.pme} icon={Zap} color="blue" onClick={() => handleToggleAccess('pme')} />
              <AccessCard label="AME" isActive={!!employee.elevatedAccess?.ame} icon={Monitor} color="indigo" onClick={() => handleToggleAccess('ame')} />
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Stakeholders</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
              <InfoBlock icon={UserCircle2} label="Line Manager" value={employee.reportingManager} color="emerald" />
              <InfoBlock icon={UserCheck} label="Project Lead" value={employee.projectLead} color="emerald" />
              <InfoBlock icon={Shield} label="Technical Lead" value={employee.technicalLead} color="emerald" />
              <InfoBlock icon={UserCog} label="Client Contact" value={employee.microsoftLead} color="emerald" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimal Team History */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20">
                <div className="flex items-center gap-2.5">
                  <LayoutList size={16} className="text-slate-400" />
                  <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Team History</h3>
                </div>
              </div>
              <div className="p-6 flex-1">
                {historicalDisplay.length > 0 ? (
                  <div className="space-y-6">
                    {historicalDisplay.map((p, i) => {
                      const isBenchEntry = p.type === 'BENCH';
                      return (
                        <div key={i} className="relative pl-6 border-l border-slate-100 last:border-transparent pb-1">
                          <div className={`absolute -left-[4.5px] top-0.5 w-2 h-2 rounded-full transition-all ${isBenchEntry ? 'bg-amber-400' : 'bg-blue-600'}`}></div>
                          
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-[12px] font-bold leading-none ${isBenchEntry ? 'text-amber-600' : 'text-slate-900'}`}>
                                {p.projectName}
                              </h4>
                              <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">{p.startDate} - {p.endDate}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{p.role}</p>
                            
                            {p.reassignmentReason && (
                              <div className="mt-2 pl-3 border-l-2 border-slate-100">
                                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                                  {p.reassignmentReason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-30">
                    <RefreshCw size={24} className="text-slate-200 mb-3" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Assignment history empty</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Monitor size={16} className="text-slate-400" />
                  <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Hardware</h3>
                </div>
                {canEdit && employee.status === EmploymentStatus.ACTIVE && (
                  <button onClick={onAssignAsset} className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Add</button>
                )}
              </div>
              <div className="p-4 flex-1">
                {assets.length > 0 ? (
                  <div className="space-y-2">
                    {assets.map((a, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group/asset">
                        <div className="flex items-center gap-3">
                          <Cpu size={14} className="text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-slate-900 truncate">{a.type}</p>
                            <p className="text-[9px] font-medium text-slate-400">{a.serialNumber}</p>
                          </div>
                        </div>
                        {canEdit && employee.status === EmploymentStatus.ACTIVE && (
                          <button onClick={() => onUnassignAsset(a.id)} className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover/asset:opacity-100 transition-all">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center opacity-30">
                    <Box size={24} className="text-slate-200 mb-2" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No assets</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;