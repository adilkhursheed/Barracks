
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, User, Mail, Rocket, Check, ArrowRight, ArrowLeft,
  Laptop, ShieldCheck, Box, MapPin, UserCog, BriefcaseBusiness,
  Key, CreditCard, MinusCircle, Monitor, Search, ChevronDown, Clock,
  UserCheck, Shield, Package, LayoutList
} from 'lucide-react';
import { Employee, Asset, Team, AssetType, OnboardingStatus } from '../types';

interface OnboardingWizardProps {
  assets: Asset[];
  projects: Team[];
  onClose: () => void;
  onComplete: (data: {
    employee: Partial<Employee>;
    assetIds: string[]; 
    newAssets: Partial<Asset>[]; 
    projectAssignment: {
      projectId: string;
      role: string;
      startDate: string;
    } | null;
    onboardingOverride?: Partial<OnboardingStatus>;
  }) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ assets, projects, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    designation: '',
    location: '',
    lumovyEmail: '',
    reportingManager: '',
    projectLead: '',
    technicalLead: '',
    department: 'Engineering',
    skillsets: []
  });

  const [emailInProgress, setEmailInProgress] = useState(false);

  // Asset Logistics State - New logic: None or Assign from Inventory
  const [assetMode, setAssetMode] = useState<'none' | 'inventory'>('none');
  const [selectedInventoryAssets, setSelectedInventoryAssets] = useState<{
    [key in AssetType]?: string; // assetId
  }>({});
  const [activeAssetTypeTab, setActiveAssetTypeTab] = useState<AssetType>(AssetType.SAW_DEVICE);

  // Project State
  const [projectAssignment, setProjectAssignment] = useState<any>({
    projectId: '',
    role: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Effect to auto-fill leads when project changes
  useEffect(() => {
    if (projectAssignment.projectId) {
      const selectedProject = projects.find(p => p.id === projectAssignment.projectId);
      if (selectedProject) {
        setFormData((prev: any) => ({
          ...prev,
          projectLead: prev.projectLead || selectedProject.projectLead || '',
          technicalLead: prev.technicalLead || selectedProject.technicalLead || ''
        }));
      }
    }
  }, [projectAssignment.projectId, projects]);

  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 border border-transparent text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 shadow-inner";

  const isStep1Valid = formData.firstName && formData.lastName && formData.designation && formData.reportingManager && (emailInProgress || formData.lumovyEmail);
  const isStep2Valid = !!projectAssignment.projectId && !!projectAssignment.role && !!formData.projectLead && !!formData.technicalLead;
  
  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setStep(s => s + 1);
  };
  
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = () => {
    const assetIds: string[] = assetMode === 'inventory' ? Object.values(selectedInventoryAssets).filter(Boolean) as string[] : [];
    onComplete({
      employee: formData,
      assetIds,
      newAssets: [], // Wizard simplified to inventory-only as requested
      projectAssignment,
      onboardingOverride: {
        lumovyEmail: !emailInProgress
      }
    });
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>First Name</label>
          <input required type="text" placeholder="e.g. Sarah" value={formData.firstName} className={inputClass} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Last Name</label>
          <input required type="text" placeholder="e.g. Connor" value={formData.lastName} className={inputClass} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Designation</label>
          <div className="relative">
            <UserCog className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input required type="text" placeholder="Senior Architect" value={formData.designation} className={`${inputClass} pl-10`} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Location</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input type="text" placeholder="London, UK" value={formData.location} className={`${inputClass} pl-10`} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2 px-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lumovy Email</label>
          <button 
            onClick={() => setEmailInProgress(!emailInProgress)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-all ${emailInProgress ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}
          >
            <Clock size={10} />
            <span className="text-[9px] font-black uppercase tracking-wider">In Progress</span>
          </button>
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input 
            required={!emailInProgress} 
            disabled={emailInProgress}
            type="email" 
            placeholder={emailInProgress ? "Provisioning..." : "name@lumovy.com"} 
            value={formData.lumovyEmail} 
            className={`${inputClass} pl-10 ${emailInProgress ? 'opacity-50 grayscale bg-slate-100' : ''}`} 
            onChange={e => setFormData({ ...formData, lumovyEmail: e.target.value })} 
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Reporting Manager</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input required type="text" placeholder="Direct Manager Name" value={formData.reportingManager} className={`${inputClass} pl-10`} onChange={e => setFormData({ ...formData, reportingManager: e.target.value })} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <label className={labelClass}>Mission Team</label>
        <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {projects.map(team => (
            <button 
              key={team.id}
              onClick={() => setProjectAssignment({...projectAssignment, projectId: team.id})}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${projectAssignment.projectId === team.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/10' : 'bg-white border-slate-100 hover:border-blue-200'}`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${projectAssignment.projectId === team.id ? 'bg-white/20' : 'bg-slate-50 text-slate-300'}`}>
                  {team.name.charAt(0)}
                 </div>
                 <div>
                  <p className="text-xs font-bold leading-tight">{team.name}</p>
                  <p className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${projectAssignment.projectId === team.id ? 'text-blue-100' : 'text-slate-400'}`}>{team.clientName}</p>
                 </div>
              </div>
              {projectAssignment.projectId === team.id && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className={labelClass}>Personnel Role</label>
          <div className="relative">
            <BriefcaseBusiness className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input required type="text" placeholder="e.g. Technical SME" value={projectAssignment.role} className={`${inputClass} pl-10`} onChange={e => setProjectAssignment({...projectAssignment, role: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Project Manager</label>
            <div className="relative">
              <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input required type="text" placeholder="PM Name" value={formData.projectLead} className={`${inputClass} pl-10`} onChange={e => setFormData({ ...formData, projectLead: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Technical Lead</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input required type="text" placeholder="Tech Lead Name" value={formData.technicalLead} className={`${inputClass} pl-10`} onChange={e => setFormData({ ...formData, technicalLead: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const availableTypes = [AssetType.SAW_DEVICE, AssetType.DOCKING_STATION, AssetType.MONITOR, AssetType.LAPTOP, AssetType.HEADPHONES];
    const unitsForType = assets.filter(a => a.type === activeAssetTypeTab && !a.isAssigned);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="space-y-4">
          <label className={labelClass}>Hardware Provisioning</label>
          <div className="flex gap-3">
             <button 
               onClick={() => setAssetMode('none')}
               className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all ${assetMode === 'none' ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border-slate-100 hover:border-slate-200'}`}
             >
               <MinusCircle size={24} className={assetMode === 'none' ? 'text-white' : 'text-slate-300'} />
               <div className="text-center">
                 <p className="text-xs font-black uppercase tracking-widest leading-none">None</p>
                 <p className={`text-[8px] font-bold mt-2 uppercase tracking-widest ${assetMode === 'none' ? 'text-white/40' : 'text-slate-400'}`}>No Initial Setup</p>
               </div>
             </button>

             <button 
               onClick={() => setAssetMode('inventory')}
               className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-[32px] border transition-all ${assetMode === 'inventory' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-white border-slate-100 hover:border-blue-200'}`}
             >
               <Package size={24} className={assetMode === 'inventory' ? 'text-white' : 'text-slate-300'} />
               <div className="text-center">
                 <p className="text-xs font-black uppercase tracking-widest leading-none">Inventory</p>
                 <p className={`text-[8px] font-bold mt-2 uppercase tracking-widest ${assetMode === 'inventory' ? 'text-white/40' : 'text-slate-400'}`}>Assign Units</p>
               </div>
             </button>
          </div>

          {assetMode === 'inventory' && (
            <div className="mt-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
                {availableTypes.map(type => (
                  <button 
                    key={type}
                    onClick={() => setActiveAssetTypeTab(type)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeAssetTypeTab === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className={labelClass}>Available {activeAssetTypeTab} Units</label>
                <div className="relative">
                   <select 
                     value={selectedInventoryAssets[activeAssetTypeTab] || ''}
                     onChange={(e) => setSelectedInventoryAssets({ ...selectedInventoryAssets, [activeAssetTypeTab]: e.target.value })}
                     className="w-full pl-5 pr-10 py-4 rounded-2xl bg-slate-50 border-none text-[13px] font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                   >
                     <option value="">Skip this category</option>
                     {unitsForType.map(u => (
                       <option key={u.id} value={u.id}>{u.make} {u.model} - {u.serialNumber}</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
                
                {Object.keys(selectedInventoryAssets).filter(k => selectedInventoryAssets[k as AssetType]).length > 0 && (
                  <div className="pt-4 space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Selected Bundle</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(selectedInventoryAssets).map(type => {
                        const assetId = selectedInventoryAssets[type as AssetType];
                        if (!assetId) return null;
                        return (
                          <div key={type} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 animate-in zoom-in-95">
                            <Check size={10} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{type}</span>
                            <button onClick={() => setSelectedInventoryAssets({ ...selectedInventoryAssets, [type as AssetType]: '' })} className="ml-1 text-blue-300 hover:text-blue-500">
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-[2px]">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300 border border-slate-100">
        
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Deployment Protocol</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2">
                Phase {step}: {step === 1 ? 'Personnel Record' : step === 2 ? 'Mission Assign' : 'Provisioning'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl"><X size={20} /></button>
        </div>

        <div className="flex h-[1px] bg-slate-100 w-full">
          <div className="bg-blue-600 h-full transition-all duration-700 ease-in-out" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar bg-white">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/40">
          <button 
            onClick={step === 1 ? onClose : prevStep} 
            className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all px-4 py-2 hover:bg-white rounded-xl"
          >
            {step === 1 ? 'Cancel' : 'Return'}
          </button>
          
          <div className="flex items-center gap-3">
            {step < 3 ? (
              <button 
                onClick={nextStep} 
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className={`group flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] ${
                  (step === 1 ? !isStep1Valid : !isStep2Valid) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-700 shadow-xl shadow-blue-600/20'
                }`}
              >
                Proceed <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleComplete} 
                className="flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10 hover:bg-slate-800"
              >
                Launch Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
