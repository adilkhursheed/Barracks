import React from 'react';
import { 
  ArrowLeft, Edit, Monitor, Calendar, User, History, Shield, 
  CheckCircle, Clock, UserCircle, BadgeInfo, UserMinus, UserPlus, Boxes
} from 'lucide-react';
import { Asset, Employee, AssetAssignment } from '../types';

interface AssetDetailProps {
  asset: Asset;
  history: (AssetAssignment & { employee: Employee | undefined })[];
  onBack: () => void;
  canEdit: boolean;
  onEdit: (asset: Asset) => void;
  onViewEmployee: (id: string) => void;
  onUnassign: () => void;
  onAssign: () => void;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ 
  asset, 
  history, 
  onBack, 
  canEdit, 
  onEdit,
  onViewEmployee,
  onUnassign,
  onAssign
}) => {
  // Derive actual assignment status from history entries that don't have a return date
  const currentAssignment = history.find(h => !h.returnDate);
  const isActuallyAssigned = !!currentAssignment;

  return (
    <div className="max-w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors group"
        >
          <div className="p-1.5 group-hover:bg-slate-100 rounded-full">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium text-sm">Back to Assets</span>
        </button>
        <div className="flex items-center gap-2.5">
          {canEdit && (
            <>
              {isActuallyAssigned ? (
                <button 
                  onClick={onUnassign}
                  className="px-4 py-2 flex items-center space-x-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20"
                >
                  <UserMinus size={14} />
                  <span>Inventory Release</span>
                </button>
              ) : (
                <button 
                  onClick={onAssign}
                  className="px-4 py-2 flex items-center space-x-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20"
                >
                  <UserPlus size={14} />
                  <span>Assign Unit</span>
                </button>
              )}
              <button 
                onClick={() => onEdit(asset)}
                className="px-4 py-2 flex items-center space-x-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-widest"
              >
                <Edit size={14} />
                <span>Specs</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Specs Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Monitor size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">{asset.make} {asset.model}</h3>
            <p className="text-blue-600 font-bold mt-1 text-[9px] uppercase tracking-[0.15em]">{asset.type}</p>
            
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${
              isActuallyAssigned ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              <Shield size={10} className="mr-1.5" /> {isActuallyAssigned ? 'Deployed' : 'In Reserve'}
            </div>

            <div className="mt-8 space-y-4 text-left border-t border-slate-50 pt-6">
              <div className="space-y-0.5">
                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Serial Number</p>
                <div className="flex items-center text-slate-700 font-mono text-[11px] tracking-wider">
                  <BadgeInfo size={12} className="mr-1.5 text-slate-300" />
                  <span>{asset.serialNumber}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Registry ID</p>
                <div className="flex items-center text-slate-500 font-medium text-[11px]">
                  <Boxes size={12} className="mr-1.5 text-slate-300" />
                  <span>{asset.id}</span>
                </div>
              </div>
            </div>
          </div>

          {currentAssignment && (
            <div className="bg-indigo-600 text-white p-6 rounded-[32px] shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <User size={100} />
              </div>
              <h4 className="font-black mb-4 text-[9px] uppercase tracking-[0.2em] opacity-60">Assigned Personnel</h4>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg backdrop-blur-md">
                  {currentAssignment.employee?.firstName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <button 
                    onClick={() => currentAssignment.employee && onViewEmployee(currentAssignment.employee.id)}
                    className="text-base font-bold hover:underline block text-left truncate leading-none"
                  >
                    {currentAssignment.employee?.fullName}
                  </button>
                  <p className="text-[10px] font-medium opacity-70 mt-1.5 truncate">{currentAssignment.employee?.designation}</p>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[8px] uppercase font-black opacity-50 tracking-widest">Deployment Date</p>
                  <p className="text-xs font-bold mt-0.5">{currentAssignment.assignmentDate}</p>
                </div>
                <Clock size={16} className="opacity-30" />
              </div>
            </div>
          )}
        </div>

        {/* Assignment History */}
        <div className="lg:col-span-2 space-y-4">
          <section className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
              <h4 className="font-black text-slate-900 flex items-center gap-2 text-base uppercase tracking-tight">
                <History size={18} className="text-indigo-600" />
                <span>Lifecycle History</span>
              </h4>
              <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">
                {history.length} Event{history.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="p-0">
              {history.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {history.sort((a, b) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime()).map((entry, idx) => (
                    <div key={idx} className={`px-8 py-6 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center gap-6 ${!entry.returnDate ? 'bg-indigo-50/30' : ''}`}>
                      {/* Status Icon */}
                      <div className="hidden md:flex flex-col items-center shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${!entry.returnDate ? 'bg-indigo-600 ring-4 ring-indigo-100 animate-pulse' : 'bg-slate-200'}`}></div>
                        {idx !== history.length - 1 && <div className="w-0.5 h-10 bg-slate-100 mt-1.5"></div>}
                      </div>

                      {/* Employee Info */}
                      <div className="flex items-center gap-4 min-w-[180px]">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${!entry.returnDate ? 'bg-white border-indigo-200 text-indigo-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                          {entry.employee?.firstName.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                          <button 
                            onClick={() => entry.employee && onViewEmployee(entry.employee.id)}
                            className="text-[13px] font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block leading-none"
                          >
                            {entry.employee?.fullName || 'Personnel Record Deleted'}
                          </button>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{entry.employee?.department || 'System'}</p>
                        </div>
                      </div>

                      {/* Timeline details */}
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Issued</p>
                          <p className="text-[11px] font-bold text-slate-700">{entry.assignmentDate}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Released</p>
                          <p className={`text-[11px] font-bold ${!entry.returnDate ? 'text-indigo-600 italic tracking-tight' : 'text-slate-500'}`}>
                            {entry.returnDate || 'ACTIVE USE'}
                          </p>
                        </div>
                      </div>

                      {/* Action Tag */}
                      <div className="md:text-right shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] ${
                          !entry.returnDate ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {entry.returnDate ? 'History' : 'Current'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                  <Monitor size={32} className="text-slate-100 mb-3" />
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Hardware has never been deployed.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;