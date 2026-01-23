import React from 'react';
import { ArrowLeft, Edit, Briefcase, Calendar, User, Users, CheckCircle, ExternalLink, UserMinus } from 'lucide-react';
import { Team, Employee, TeamAssignment, AllocationStatus } from '../types';

interface TeamDetailProps {
  team: Team;
  members: (TeamAssignment & { employee: Employee | undefined })[];
  onBack: () => void;
  canEdit: boolean;
  onEdit: (team: Team) => void;
  onToggleStatus: (id: string, status: AllocationStatus) => void;
  onViewEmployee: (id: string) => void;
}

const TeamDetail: React.FC<TeamDetailProps> = ({ 
  team, 
  members, 
  onBack, 
  canEdit, 
  onEdit, 
  onToggleStatus,
  onViewEmployee
}) => {
  return (
    <div className="max-w-full space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Directory
          </button>
          <div>
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">{team.id}</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mt-1.5">{team.name}</h1>
            <p className="text-lg text-indigo-600 font-bold mt-1">{team.clientName}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(team)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-xs shadow-lg shadow-indigo-600/20"
            >
              <Edit size={16} className="inline mr-2" /> Modify Team
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-50 space-y-6">
            <div className="space-y-2.5">
              <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest">Timeline</p>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-indigo-600" />
                <div>
                  <p className="text-[13px] font-bold">{team.startDate}</p>
                  <p className="text-[11px] text-slate-400">{team.endDate || 'Active Strategy'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest">Manager</p>
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-900" />
                <p className="text-[13px] font-bold">{team.projectLead || 'Unassigned'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Users size={20} className="text-indigo-600" /> Personnel Roster</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((m, idx) => (
              <div key={idx} className="bg-white p-4 rounded-[24px] border border-slate-50 hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {m.employee?.firstName.charAt(0)}
                  </div>
                  <div>
                    <button onClick={() => m.employee && onViewEmployee(m.employee.id)} className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-all leading-tight">{m.employee?.fullName}</button>
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{m.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;