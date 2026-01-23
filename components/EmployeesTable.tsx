import React from 'react';
import { Edit, ChevronRight, Terminal } from 'lucide-react';
import { Employee, EmploymentStatus } from '../types';

interface EmployeesTableProps {
  employees: Employee[];
  onView: (id: string) => void;
  canEdit: boolean;
  onEdit: (emp: Employee) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (id: string) => void;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onView, canEdit, onEdit, onDeactivate, onReactivate }) => {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Employee</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Position</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp) => (
              <tr 
                key={emp.id} 
                className="group hover:bg-slate-50/50 transition-all duration-300"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border group-hover:bg-white group-hover:shadow-sm transition-all ${emp.status === EmploymentStatus.ACTIVE ? 'bg-slate-100 text-slate-500 border-slate-50' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                      {emp.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900 tracking-tight leading-none">{emp.fullName}</p>
                      <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{emp.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <p className="text-[11px] font-semibold text-slate-600">{emp.designation}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{emp.department}</p>
                </td>
                <td className="px-6 py-3.5">
                  <p className="text-[11px] text-slate-600 font-medium">{emp.lumovyEmail}</p>
                </td>
                <td className="px-6 py-3.5">
                  <div className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold border ${
                    emp.status === EmploymentStatus.ACTIVE 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {emp.status}
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {canEdit && (
                      <button 
                        onClick={() => onEdit(emp)}
                        className="p-1.5 text-slate-300 hover:text-slate-900 transition-all"
                      >
                        <Edit size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => onView(emp.id)}
                      className="p-1.5 text-slate-300 hover:text-slate-900 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {employees.length === 0 && (
        <div className="py-20 text-center">
          <Terminal size={32} className="text-slate-100 mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No records found</p>
        </div>
      )}
    </div>
  );
};

export default EmployeesTable;