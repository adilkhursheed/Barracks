
import React from 'react';
import { History, ShieldAlert, Clock } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogTableProps {
  logs: AuditLog[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
        <ShieldAlert className="text-blue-500 shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm font-semibold text-blue-900">Audit Trail Enabled</p>
          <p className="text-xs text-blue-700">All changes are immutable and versioned for compliance. Unauthorized attempts to modify logs are tracked.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' :
                      log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                      log.action === 'DEACTIVATE' ? 'bg-red-100 text-red-700' :
                      log.action === 'REACTIVATE' ? 'bg-emerald-100 text-emerald-700' :
                      log.action === 'IMPORT' ? 'bg-slate-800 text-white' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{log.changedBy}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{log.entity}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <History className="text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No audit records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogTable;
