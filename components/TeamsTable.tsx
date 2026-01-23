import React from 'react';
import { Edit, CheckCircle, Plus, Eye } from 'lucide-react';
import { Team, TeamAssignment, Employee, AllocationStatus } from '../types';

interface TeamsTableProps {
  teams: Team[];
  assignments: TeamAssignment[];
  employees: Employee[];
  canEdit: boolean;
  onEdit: (team: Team) => void;
  onView: (id: string) => void;
  onToggleStatus: (id: string, status: AllocationStatus) => void;
}

const TeamsTable: React.FC<TeamsTableProps> = ({ 
  teams = [], 
  assignments = [], 
  employees = [], 
  canEdit, 
  onEdit, 
  onView, 
  onToggleStatus 
}) => {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Team Name</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Leadership</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Allocation</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teams.map((team) => {
              const members = assignments.filter(a => a.projectId === team.id);
              return (
                <tr key={team.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-6 py-3.5">
                    <p className="text-[13px] font-bold text-slate-900 leading-none">{team.name}</p>
                    <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-1">{team.clientName}</p>
                  </td>
                  <td className="px-6 py-3.5">
                     <p className="text-[11px] font-bold text-slate-700 leading-none">{team.projectLead || '-'}</p>
                     <p className="text-[9px] text-slate-400 mt-1">Manager</p>
                  </td>
                  <td className="px-6 py-3.5 text-[11px] text-slate-600">
                    {team.startDate} → {team.endDate || 'Ongoing'}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex -space-x-1.5">
                      {members.slice(0, 3).map((m, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[7px] font-bold text-slate-400">
                          {employees.find(e => e.id === m.employeeId)?.firstName?.charAt(0) || '?'}
                        </div>
                      ))}
                      {members.length > 3 && <div className="w-5 h-5 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[7px] font-bold text-indigo-600">+{members.length - 3}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-slate-300 group-hover:text-slate-500">
                      {canEdit && <button onClick={() => onEdit(team)} className="p-1.5 hover:text-indigo-600"><Edit size={14} /></button>}
                      <button onClick={() => onView(team.id)} className="p-1.5 hover:text-slate-900"><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamsTable;