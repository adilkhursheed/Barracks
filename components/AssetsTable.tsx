import React from 'react';
import { Trash2, Edit, Eye } from 'lucide-react';
import { Asset, AssetAssignment, Employee } from '../types';

interface AssetsTableProps {
  assets: Asset[];
  assignments: AssetAssignment[];
  employees: Employee[];
  canEdit: boolean;
  onView: (id: string) => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const AssetsTable: React.FC<AssetsTableProps> = ({ assets, assignments, employees, canEdit, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Asset Info</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Serial Number</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Current Holder</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {assets.map((asset) => {
              const activeAssignment = assignments.find(a => a.assetId === asset.id && !a.returnDate);
              const holder = activeAssignment ? employees.find(e => e.id === activeAssignment.employeeId) : null;
              const isTrulyAssigned = !!activeAssignment;

              return (
                <tr key={asset.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-6 py-3.5">
                    <p className="text-[13px] font-bold text-slate-900 leading-none">{asset.make}</p>
                    <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">{asset.model}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-[11px] font-semibold text-slate-600">{asset.type}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-[11px] font-mono text-slate-400 tracking-wider">{asset.serialNumber}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    {holder ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-black text-indigo-500">
                          {holder.fullName.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{holder.fullName}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      isTrulyAssigned 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {isTrulyAssigned ? 'Deployed' : 'Unassigned'}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                      <button 
                        onClick={() => onView(asset.id)}
                        className="p-1.5 hover:text-slate-900"
                        title="View Asset Journey"
                      >
                        <Eye size={16} />
                      </button>
                      {canEdit && (
                        <>
                          <button 
                            onClick={() => onEdit(asset)}
                            className="p-1.5 hover:text-indigo-600"
                            title="Edit Asset"
                          >
                            <Edit size={14} />
                          </button>
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

export default AssetsTable;