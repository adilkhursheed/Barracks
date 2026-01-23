
import React, { useState } from 'react';
import { 
  Cloud, 
  Database, 
  Server, 
  Key, 
  CheckCircle2, 
  ExternalLink, 
  Copy,
  ChevronRight,
  Info,
  ShieldCheck,
  FolderPlus,
  Zap,
  Lock,
  ArrowRight,
  AlertTriangle,
  Filter
} from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'general'>('cloud');

  const AzureStep = ({ number, title, description, code, portalLink }: { number: number, title: string, description: string, code?: string, portalLink?: string }) => (
    <div className="flex gap-6 items-start group">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
          {number}
        </div>
        <div className="w-0.5 h-full bg-slate-100 min-h-[40px] mt-2 group-last:hidden"></div>
      </div>
      <div className="flex-1 pb-10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h4>
          {portalLink && (
            <a 
              href={portalLink} 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-widest transition-all"
            >
              Go to Portal <ArrowRight size={12} />
            </a>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{description}</p>
        {code && (
          <div className="bg-slate-900 rounded-2xl p-4 relative group/code">
            <code className="text-[11px] font-mono text-emerald-400">{code}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(code)}
              className="absolute top-3 right-3 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Barracks Config</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">Infrastructure and Cloud Provisioning</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('cloud')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cloud' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Azure Beginner Guide
        </button>
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Connection Keys
        </button>
      </div>

      {activeTab === 'cloud' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Critical Troubleshooting Block */}
            <section className="bg-rose-50 border border-rose-100 rounded-[32px] p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl text-rose-600 shadow-sm">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-900 uppercase tracking-tight">"No Subscription Found" Error?</h3>
                  <p className="text-xs text-rose-700/70 mt-2 font-medium leading-relaxed">
                    If your dropdown is empty, Azure doesn't see a billing account. 
                    <br/><br/>
                    1. **Switch Directory:** Click the <Filter size={12} className="inline mx-1"/> icon in the top right portal bar. Check if you are in the correct "Directory".
                    <br/>
                    2. **Create Subscription:** Search for "Subscriptions" in the portal. Click **+ Add** and choose "Free Trial". 
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FolderPlus size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Zero-to-One DB Setup</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Follow these steps exactly after fixing your subscription</p>
                </div>
              </div>

              <div className="space-y-0">
                <AzureStep 
                  number={1} 
                  title="Step 1: The Resource Group (The Folder)" 
                  description="A Resource Group is just a 'Folder' for your project. Search for 'Resource Groups' in the top search bar. Click 'Create', select your new Subscription, and give it this name:"
                  code="Barracks-RG"
                  portalLink="https://portal.azure.com/#view/HubsExtension/BrowseResourceGroups"
                />
                <AzureStep 
                  number={2} 
                  title="Step 2: Create Cosmos DB Account" 
                  description="Now, search for 'Azure Cosmos DB'. Click 'Create' -> 'Azure Cosmos DB for NoSQL'. Select the 'Barracks-RG' group. Choose 'Serverless' to keep it cheap/free."
                  code="barracks-db-account"
                  portalLink="https://portal.azure.com/#view/Microsoft_Azure_DocumentDB/DatabaseAccountCreate"
                />
                <AzureStep 
                  number={3} 
                  title="Step 3: Add Database & Container" 
                  description="Inside your Cosmos account, click 'Data Explorer' > 'New Container'. Use these exact values for the app to work:"
                  code="Database: BarracksDB | Container: Employees | Partition Key: /id"
                />
                <AzureStep 
                  number={4} 
                  title="Step 4: Get Your Keys" 
                  description="In the Cosmos DB sidebar, find 'Settings' -> 'Keys'. Copy the 'URI' and 'Primary Key'."
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap size={120} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-white/40">Glossary</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-400">Subscription</p>
                  <p className="text-[11px] text-slate-400 mt-1">Your billing account (required even for free things).</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-400">Resource Group</p>
                  <p className="text-[11px] text-slate-400 mt-1">A logical folder. Costs nothing but is required.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Info size={16} className="text-slate-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Tips</h4>
              </div>
              <ul className="space-y-4">
                <li className="text-[11px] text-slate-500 font-medium leading-relaxed">• If "Subscriptions" says 'You don't have any', click 'Add' to start a Free Trial.</li>
                <li className="text-[11px] text-slate-500 font-medium leading-relaxed">• Partition Key **must** be `/id` (with the slash).</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-slate-100 p-10 space-y-8 shadow-sm">
           <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Backend Integration</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Connect your .NET backend to Cosmos DB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cosmos URI (Endpoint)</label>
              <input 
                type="text" 
                placeholder="https://barracks-nosql.documents.azure.com:443/" 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Master Key</label>
              <input 
                type="password" 
                placeholder="Paste your key here..." 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
            <Database size={20} className="text-slate-400 mt-1" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Once these are filled, update your `appsettings.json` in the backend project.</p>
              <p className="text-[10px] text-slate-400 font-medium">The backend is programmed to auto-detect and connect on next restart.</p>
            </div>
          </div>

          <button className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
            Save Integration Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
