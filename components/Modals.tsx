import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Plus, Search, Check, 
  Upload, ArrowRight, Download, 
  FileSpreadsheet, FileCode, LayoutList,
  Terminal,
  Database,
  User,
  Mail,
  Briefcase,
  Phone,
  Shield,
  Layers,
  Binary,
  UserCog,
  UserPlus,
  FileUp,
  UsersRound,
  ArrowUpRight,
  Monitor,
  ShieldAlert,
  Zap,
  Key
} from 'lucide-react';
import { Employee, EmploymentStatus, Team, Asset } from '../types';
import * as XLSX from 'xlsx';
import { downloadTemplate } from '../exportUtils';

interface EntityModalProps {
  type: 'employee' | 'asset' | 'team';
  initialData?: any;
  employees: Employee[];
  assets: any[];
  teams: Team[];
  onClose: () => void;
  onSaveEmployee: (data: any) => void;
  onSaveAsset: (data: any) => void;
  onSaveTeam: (data: any) => void;
}

export const EntityModal: React.FC<EntityModalProps> = ({
  type, initialData, employees, assets, teams, onClose,
  onSaveEmployee, onSaveAsset, onSaveTeam
}) => {
  const [formData, setFormData] = useState<any>(initialData || { skillsets: [], elevatedAccess: { pme: false, scAlt: false, ame: false } });

  useEffect(() => {
    setFormData(initialData || { skillsets: [], elevatedAccess: { pme: false, scAlt: false, ame: false } });
  }, [initialData, type]);

  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 ml-1";
  const inputClass = "w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300 shadow-inner";

  const toggleAccess = (key: 'pme' | 'scAlt' | 'ame') => {
    setFormData({
      ...formData,
      elevatedAccess: {
        ...(formData.elevatedAccess || { pme: false, scAlt: false, ame: false }),
        [key]: !formData.elevatedAccess?.[key]
      }
    });
  };

  const renderForm = () => {
    switch (type) {
      case 'team':
        return (
          <div className="space-y-6">
            <div><label className={labelClass}>Team Name</label><input required type="text" placeholder="e.g. Infrastructure Squad" value={formData.name || ''} className={inputClass} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><label className={labelClass}>Client</label><input required type="text" placeholder="e.g. Enterprise Cloud" value={formData.clientName || ''} className={inputClass} onChange={e => setFormData({ ...formData, clientName: e.target.value })} /></div>
            <div><label className={labelClass}>Mission Description</label><textarea placeholder="Operational goals..." value={formData.description || ''} className={`${inputClass} h-32`} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
          </div>
        );
      case 'employee':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div><label className={labelClass}>First Name</label><input required type="text" value={formData.firstName || ''} className={inputClass} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
              <div><label className={labelClass}>Last Name</label><input required type="text" value={formData.lastName || ''} className={inputClass} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
            </div>
            <div><label className={labelClass}>Designation</label><input required type="text" value={formData.designation || ''} className={inputClass} onChange={e => setFormData({ ...formData, designation: e.target.value })} /></div>
            
            <div className="grid grid-cols-2 gap-6">
              <div><label className={labelClass}>Lumovy Email</label><input type="email" value={formData.lumovyEmail || ''} className={inputClass} onChange={e => setFormData({ ...formData, lumovyEmail: e.target.value })} /></div>
              <div><label className={labelClass}>SC-ALT Email</label><input type="email" value={formData.scAltEmail || ''} className={inputClass} onChange={e => setFormData({ ...formData, scAltEmail: e.target.value })} /></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div><label className={labelClass}>BGV ID</label><input type="text" value={formData.bgvIdString || ''} className={inputClass} onChange={e => setFormData({ ...formData, bgvIdString: e.target.value })} /></div>
              <div><label className={labelClass}>V-ID (Personnel Number)</label><input type="text" value={formData.microsoftPersonnelNumber || ''} className={inputClass} onChange={e => setFormData({ ...formData, microsoftPersonnelNumber: e.target.value })} /></div>
            </div>
            <div><label className={labelClass}>Location</label><input type="text" value={formData.location || ''} className={inputClass} onChange={e => setFormData({ ...formData, location: e.target.value })} /></div>
            
            <div className="pt-6 border-t border-slate-50">
              <label className={labelClass}>Elevated Access Clearance</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'pme', label: 'PME', icon: Zap },
                  { id: 'scAlt', label: 'SC-ALT', icon: ShieldAlert },
                  { id: 'ame', label: 'AME', icon: Monitor }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAccess(item.id as any)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                      formData.elevatedAccess?.[item.id] 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-50 border-transparent text-slate-400'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default: return <div className="text-center py-10 text-slate-300 uppercase font-black text-[10px]">Protocol initialized...</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[48px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{initialData ? 'Update' : 'Initialize'} {type}</h3>
          <button onClick={onClose} className="p-4 text-slate-300 hover:text-slate-900 transition-all"><X size={28} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(type==='team') onSaveTeam(formData); else if(type==='employee') onSaveEmployee(formData); }} className="p-12 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {renderForm()}
          <div className="mt-12 flex gap-4">
            <button type="button" onClick={onClose} className="px-8 py-5 text-slate-400 font-black text-xs uppercase tracking-widest">Cancel</button>
            <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-600/20">Confirm registry update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AssignmentModal: React.FC<{
  employees: Employee[];
  assets?: Asset[];
  onClose: () => void;
  onSelect: (id: string) => void;
}> = ({ employees, assets, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  
  const filteredEmployees = useMemo(() => 
    employees.filter(e => e.fullName.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())),
    [employees, search]
  );

  const filteredAssets = useMemo(() => 
    assets ? assets.filter(a => a.make.toLowerCase().includes(search.toLowerCase()) || a.serialNumber.toLowerCase().includes(search.toLowerCase())) : [],
    [assets, search]
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[48px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{assets ? 'Select Hardware' : 'Select Personnel'}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Link inventory units to active personnel</p>
          </div>
          <button onClick={onClose} className="p-4 text-slate-300 hover:text-slate-900 transition-all"><X size={28} /></button>
        </div>
        
        <div className="p-12 space-y-8 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {assets ? (
              filteredAssets.length > 0 ? filteredAssets.map(a => (
                <button 
                  key={a.id}
                  onClick={() => onSelect(a.id)}
                  className="w-full flex items-center justify-between p-6 rounded-[32px] border border-slate-100 bg-white hover:border-emerald-600 hover:bg-emerald-50/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Monitor size={24} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 tracking-tight leading-none">{a.make} {a.model}</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">S/N: {a.serialNumber}</p>
                    </div>
                  </div>
                </button>
              )) : <div className="py-10 text-center text-slate-300 uppercase font-black text-[10px]">No hardware available</div>
            ) : (
              filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                <button 
                  key={emp.id}
                  onClick={() => onSelect(emp.id)}
                  className="w-full flex items-center justify-between p-6 rounded-[32px] border border-slate-100 bg-white hover:border-indigo-600 hover:bg-indigo-50/20 transition-all group text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {emp.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 leading-none tracking-tight">{emp.fullName}</p>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{emp.designation}</p>
                    </div>
                  </div>
                </button>
              )) : <div className="py-10 text-center text-slate-300 uppercase font-black text-[10px]">No personnel found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ImportModal: React.FC<{
  type: 'employees' | 'assets' | 'teams';
  onClose: () => void;
  onImport: (data: any[]) => void;
}> = ({ type, onClose, onImport }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        onImport(data);
      } catch (error) { console.error(error); alert("Import failed."); }
      finally { setIsProcessing(false); }
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[48px] w-full max-w-xl p-12 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={24} /></button>
        <div className="mb-10 text-center"><div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><FileUp size={32} /></div><h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Bulk Import</h3></div>
        <div className="space-y-6"><button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="w-full border-2 border-dashed border-slate-200 rounded-[32px] p-16 text-center transition-all group hover:border-indigo-600 hover:bg-indigo-50/30"><Upload size={40} className="mx-auto mb-4 text-slate-200" /><p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Drop XLSX file here or click to browse</p></button><input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" /><div className="flex flex-col items-center gap-4 pt-4"><button onClick={() => downloadTemplate(type as any)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest"><Download size={14} /> Download Template</button></div></div>
      </div>
    </div>
  );
};