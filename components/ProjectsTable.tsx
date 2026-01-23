
import React from 'react';
import { Edit, CheckCircle, Plus, Eye } from 'lucide-react';
// Corrected imports: Aliased Team to Project and TeamAssignment to ProjectAssignment from types.ts
import { Team as Project, TeamAssignment as ProjectAssignment, Employee, AllocationStatus } from '../types';

interface ProjectsTableProps {
  projects: Project[];
  assignments: ProjectAssignment[];
  employees: Employee[];
  canEdit: boolean;
  onEdit: (proj: Project) => void;
  onView: (id: string) => void;
  onToggleStatus: (id: string, status: AllocationStatus) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, assignments, employees, canEdit, onEdit, onView, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project & Client</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeline</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((proj) => {
              const teamMembers = assignments.filter(a => a.projectId === proj.id);
              
              return (
                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{proj.name}</p>
                    <p className="text-xs text-blue-600 font-medium">{proj.clientName}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-xs font-medium text-slate-700">PL: {proj.projectLead || '-'}</p>
                     <p className="text-xs text-slate-500">TL: {proj.technicalLead || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600">{proj.startDate || 'N/A'}</p>
                    <p className="text-xs text-slate-400">{proj.endDate ? `Ends ${proj.endDate}` : 'Ongoing'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex -space-x-2 overflow-hidden">
                      {teamMembers.slice(0, 3).map((m, i) => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 text-[10px] flex items-center justify-center font-bold text-slate-500 shadow-sm">
                          {employees.find(e => e.id === m.employeeId)?.firstName.charAt(0)}
                        </div>
                      ))}
                      {teamMembers.length > 3 && (
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 text-[8px] flex items-center justify-center text-slate-400 font-bold">
                          +{teamMembers.length - 3}
                        </div>
                      )}
                      {teamMembers.length === 0 && <span className="text-xs text-slate-300 italic">Empty</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proj.status === AllocationStatus.Active 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => onView(proj.id)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors"
                        title="View Project Details"
                      >
                        <Eye size={18} />
                      </button>
                      {canEdit && (
                        <>
                          <button 
                            onClick={() => onEdit(proj)}
                            className="p-2 hover:bg-slate-100 hover:text-slate-800 rounded-lg text-slate-400 transition-colors"
                            title="Edit Project"
                          >
                            <Edit size={16} />
                          </button>
                          {proj.status === AllocationStatus.Active ? (
                            <button 
                              onClick={() => onToggleStatus(proj.id, AllocationStatus.COMPLETED)}
                              className="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-slate-400 transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => onToggleStatus(proj.id, AllocationStatus.Active)}
                              className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-colors"
                              title="Reactivate Project"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </>
                      )}
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

export default ProjectsTable;
