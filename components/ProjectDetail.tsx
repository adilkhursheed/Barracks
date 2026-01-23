
import React from 'react';
import { ArrowLeft, Edit, Briefcase, Calendar, User, Users, Star, ExternalLink, Shield, CheckCircle, Plus, UserMinus } from 'lucide-react';
// Corrected imports: Aliased Team to Project and TeamAssignment to ProjectAssignment from types.ts
import { Team as Project, Employee, TeamAssignment as ProjectAssignment, AllocationStatus } from '../types';

interface ProjectDetailProps {
  project: Project;
  team: (ProjectAssignment & { employee: Employee | undefined })[];
  onBack: () => void;
  canEdit: boolean;
  onEdit: (proj: Project) => void;
  onToggleStatus: (id: string, status: AllocationStatus) => void;
  onViewEmployee: (id: string) => void;
  onAddMember?: () => void;
  onRemoveMember?: (assignmentId: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  team, 
  onBack, 
  canEdit, 
  onEdit, 
  onToggleStatus,
  onViewEmployee,
  onAddMember,
  onRemoveMember
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all font-bold text-xs uppercase tracking-widest"
          >
            <div className="p-2 rounded-xl group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Matrix
          </button>
          <div>
            <div className="flex items-center gap-4 mb-2">
               <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-indigo-600/20">
                {project.id}
               </span>
               <div className={`w-2 h-2 rounded-full ${project.status === AllocationStatus.Active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{project.name}</h1>
            <p className="text-xl text-indigo-600 font-bold mt-2">{project.clientName}</p>
          </div>
        </div>

        <div className="flex gap-4 p-2 bg-white rounded-[24px] shadow-sm border border-slate-50">
          {canEdit && (
            <>
              <button 
                onClick={() => onToggleStatus(project.id, project.status === AllocationStatus.Active ? AllocationStatus.COMPLETED : AllocationStatus.Active)}
                className={`px-6 py-3 flex items-center gap-2 rounded-2xl transition-all font-bold text-sm ${
                  project.status === AllocationStatus.Active 
                    ? 'text-emerald-600 hover:bg-emerald-50' 
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {project.status === AllocationStatus.Active ? <CheckCircle size={18} /> : <ExternalLink size={18} />}
                <span>{project.status === AllocationStatus.Active ? 'Complete Project' : 'Re-open'}</span>
              </button>
              <button 
                onClick={() => onEdit(project)}
                className="px-8 py-3 flex items-center gap-2 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                <Edit size={18} />
                <span>Modify Details</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Project Meta Cards */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Timeline</p>
                <div className="flex items-center gap-4 text-slate-900">
                  <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{project.startDate}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{project.endDate || 'Ongoing'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em]">Key Leadership</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{project.projectLead || 'Not Assigned'}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Project Lead</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{project.technicalLead || 'Not Assigned'}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tech Lead</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[40px] text-white/90 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Briefcase size={80} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/40">Mission Brief</h4>
            <p className="text-sm leading-relaxed font-medium italic">
              "{project.description || 'Global impact objective pending description...'}"
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Users size={24} className="text-indigo-600" />
              Team Architecture
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg ml-2">
                {team.length}
              </span>
            </h4>
            {canEdit && project.status === AllocationStatus.Active && (
              <button 
                onClick={onAddMember}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-widest transition-all hover:gap-3"
              >
                Assemble Talent <Plus size={16} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.length > 0 ? (
              team.map((member, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.01)] group hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-500 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xl text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                          {member.employee?.firstName.charAt(0)}
                        </div>
                        <div>
                          <button 
                            onClick={() => member.employee && onViewEmployee(member.employee.id)}
                            className="text-lg font-bold text-slate-900 block hover:text-indigo-600 transition-colors text-left leading-none"
                          >
                            {member.employee?.fullName}
                          </button>
                          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-2">{member.role}</p>
                        </div>
                      </div>
                      {canEdit && project.status === AllocationStatus.Active && onRemoveMember && (
                        <button 
                          onClick={() => { if(confirm(`Relieve ${member.employee?.fullName} from this project?`)) onRemoveMember(member.id); }}
                          className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {member.employee?.skillsets?.slice(0, 3).map((skill, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Allocated Since</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">{member.startDate}</p>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-widest">Full Profile</span>
                      <ArrowLeft className="rotate-180" size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                <Users size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No team assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
