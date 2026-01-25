
import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Database, Cloud, HardDrive, RefreshCw, CheckCircle2, AlertCircle, Lock, Globe } from 'lucide-react';
import { persistence } from '../services/persistence';
import { ENV } from '../env';

const Settings: React.FC = () => {
  const [cloudEnabled, setCloudEnabled] = useState(persistence.isCloudMode());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const config = persistence.getConfig();

  // The current window origin to be used for Azure CORS configuration
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '---';

  const handleToggleCloud = () => {
    if (ENV.CLOUD_SYNC_ENABLED) return; // Prevent toggling if forced
    const nextValue = !cloudEnabled;
    setCloudEnabled(nextValue);
    persistence.setCloudMode(nextValue);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorMessage(null);
    
    const success = await persistence.testConnection();
    setTestResult(success ? 'success' : 'error');
    if (!success) {
      setErrorMessage(persistence.lastError);
    }
    setIsTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Configuration</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Registry Backbone & Persistence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persistence Mode */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Storage Mode</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${cloudEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {cloudEnabled ? <Cloud size={18} /> : <HardDrive size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{cloudEnabled ? 'Cloud Sync Active' : 'Local Storage Only'}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{cloudEnabled ? 'Azure Cosmos DB Engine' : 'Browser Indexed Registry'}</p>
                </div>
              </div>
              <button 
                onClick={handleToggleCloud}
                disabled={ENV.CLOUD_SYNC_ENABLED}
                className={`w-12 h-6 rounded-full transition-all relative ${cloudEnabled ? 'bg-blue-600' : 'bg-slate-200'} ${ENV.CLOUD_SYNC_ENABLED ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cloudEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {ENV.CLOUD_SYNC_ENABLED && (
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <Shield size={16} className="text-blue-600 mt-0.5" />
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider leading-relaxed">
                  Enterprise Policy: Cloud Persistence is enforced by system environment variables.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cloud Config */}
        {cloudEnabled && (
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <RefreshCw size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Connection Diagnostics</h3>
              </div>
              {testResult === 'success' && <CheckCircle2 className="text-emerald-500" size={20} />}
              {testResult === 'error' && <AlertCircle className="text-rose-500" size={20} />}
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Database</p>
                  <p className="text-xs font-bold text-slate-900">{config?.databaseId || '---'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Container</p>
                  <p className="text-xs font-bold text-slate-900">{config?.containerId || '---'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white/40 font-mono text-[10px] truncate">
                {config?.endpoint || 'Endpoint Undefined'}
              </div>

              {/* Origin Display Block */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={12} className="text-blue-600" />
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Required CORS Origin</p>
                </div>
                <p className="text-[11px] font-mono font-bold text-slate-700 bg-white/60 px-2 py-1.5 rounded-lg border border-blue-100 select-all">
                  {currentOrigin}
                </p>
                <p className="text-[8px] text-slate-500 mt-2 leading-relaxed">
                  Add this origin to the <b>Allowed Origins</b> in your Azure Cosmos DB CORS settings.
                </p>
              </div>

              {testResult === 'error' && errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
                  <AlertCircle size={14} className="text-rose-600 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-rose-700 font-medium leading-relaxed">{errorMessage}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`mt-6 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                isTesting ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14} />}
              {isTesting ? 'Testing Link...' : 'Verify Connectivity'}
            </button>
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm">
            <Lock size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Security & Compliance</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-2xl">
              All data transmitted to Azure Cosmos DB is encrypted at rest and in transit using TLS 1.2. 
              The system uses Gateway connection mode for maximum compatibility with browser-based environments. 
              CORS must be correctly configured in the Azure portal for the production domain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
