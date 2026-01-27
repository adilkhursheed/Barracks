
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Bell,
  LayoutGrid,
  Box,
  Layout,
  Rocket,
  Users,
  Plus,
  Upload,
  ChevronDown,
  Calendar,
  Shuffle,
  Settings as SettingsIcon
} from 'lucide-react';
import { 
  UserRole, 
  Employee, 
  Asset, 
  Team, 
  AuditLog, 
  EmploymentStatus, 
  AllocationStatus, 
  TeamAssignment, 
  AssetAssignment,
  OnboardingStatus,
  AssetType
} from './types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_ASSETS, 
  INITIAL_TEAMS,
  INITIAL_ONBOARDING
} from './constants';
import Dashboard from './components/Dashboard';
import EmployeesTable from './components/EmployeesTable';
import AssetsTable from './components/AssetsTable';
import TeamsTable from './components/TeamsTable';
import EmployeeDetail from './components/EmployeeDetail';
import TeamDetail from './components/TeamDetail';
import AssetDetail from './components/AssetDetail';
import OnboardingListView from './components/OnboardingListView';
import Settings from './components/Settings';
import { EntityModal, ImportModal, AssignmentModal } from './components/Modals';
import OnboardingWizard from './components/OnboardingWizard';
import { persistence } from './services/persistence';
import { generateSeedData } from './utils/seedData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ToastContainer: React.FC<{ toasts: Toast[], onRemove: (id: string) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
    {toasts.map((toast) => (
      <div 
        key={toast.id}
        className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl bg-white border border-slate-100 animate-fade-in"
      >
        <div className={`p-2 rounded-xl ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
          toast.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
        </div>
        <span className="text-sm font-medium text-slate-700 leading-tight">{toast.message}</span>
        <button onClick={() => onRemove(toast.id)} className="ml-4 text-slate-300 hover:text-slate-500">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

const Logo = () => (
  <div className="relative w-8 h-8 group cursor-pointer shrink-0">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative w-full h-full bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden">
      <div className="relative w-5 h-5">
        <div className="absolute top-0 left-0 w-3 h-4 bg-blue-600 rounded-sm group-hover:translate-x-0.5 transition-transform duration-500"></div>
        <div className="absolute bottom-0 right-0 w-3 h-4 bg-emerald-500 rounded-sm group-hover:-translate-x-0.5 transition-transform duration-500 mix-blend-multiply"></div>
        <div className="absolute inset-0 border-[1.5px] border-white/40 rounded-sm"></div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [focusOnboardingId, setFocusOnboardingId] = useState<string | null>(null);
  
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalType, setModalType] = useState<'employee' | 'asset' | 'team' | 'onboarding_wizard' | 'assign_asset' | 'assign_project' | 'end_project' | 'offboard' | null>(null);
  const [importModalType, setImportModalType] = useState<'employees' | 'assets' | 'teams' | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [selectedTeamIdForModal, setSelectedTeamIdForModal] = useState('');
  const [assignedRoleForModal, setAssignedRoleForModal] = useState('');
  const [reassignmentReason, setReassignmentReason] = useState('');
  const [assignedDateForModal, setAssignedDateForModal] = useState(new Date().toISOString().split('T')[0]);
  const [endDateForCurrent, setEndDateForCurrent] = useState(new Date().toISOString().split('T')[0]);

  // App initialization state - initialized as empty to prevent hardcoded artifacts
  const [isLoaded, setIsLoaded] = useState(false);
  const hasCompletedInitialLoad = useRef(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment[]>([]);
  const [assetAssignments, setAssetAssignments] = useState<AssetAssignment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Async data loading from Cosmos DB
  useEffect(() => {
    const initData = async () => {
      console.log('?? Loading data from Cosmos DB...');
      const data = await persistence.loadAll();
      
      // If Cosmos DB returns data, use it; otherwise initialize with empty arrays
      if (data && typeof data === 'object') {
        const empData = data.employees || [];
        const assData = data.assets || [];
        const teamData = data.teams || [];
        const taData = data.teamAssignments || [];
        const aaData = data.assetAssignments || [];
        const auditData = data.auditLogs || [];
        
        setEmployees(empData);
        setAssets(assData);
        setTeams(teamData);
        setTeamAssignments(taData);
        setAssetAssignments(aaData);
        setAuditLogs(auditData);
        
        console.log('?? Data loaded from Cosmos DB:', {
          employees: empData.length,
          assets: assData.length,
          teams: teamData.length
        });
        
        // Mark as having loaded data
        hasCompletedInitialLoad.current = true;
      } else {
        // Only initialize if truly no data exists
        console.log('?? No existing data - ready for seeding or manual entry');
        setEmployees([]);
        setAssets([]);
        setTeams([]);
        setTeamAssignments([]);
        setAssetAssignments([]);
        setAuditLogs([]);
        hasCompletedInitialLoad.current = true;
      }
      
      setIsLoaded(true);
      console.log('? Initial load marked complete');
    };
    initData();
  }, []);

  // Sync state to Cosmos DB on every change (but ONLY after initial load)
  useEffect(() => {
    if (isLoaded && hasCompletedInitialLoad.current) {
      const saveData = async () => {
        console.log('?? Syncing data to Cosmos DB...', {
          employees: employees.length,
          assets: assets.length,
          teams: teams.length
        });
        
        await persistence.saveAll({ 
          employees, 
          assets, 
          teams, 
          teamAssignments, 
          assetAssignments, 
          auditLogs 
        });
        
        console.log('? Data synced successfully');
      };
      
      // Small delay to batch multiple rapid state changes
      const timeoutId = setTimeout(saveData, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [employees, assets, teams, teamAssignments, assetAssignments, auditLogs, isLoaded]);

  const currentAssignmentForModal = useMemo(() => {
    if (modalType === 'assign_project' && modalData) {
      return teamAssignments.find(ta => ta.employeeId === modalData && ta.status === AllocationStatus.Active);
    }
    return null;
  }, [modalType, modalData, teamAssignments]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const canEdit = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.EDITOR;

  const handleUnassignAsset = (assetId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAssetAssignments(prev => prev.map(aa => 
      (aa.assetId === assetId && !aa.returnDate) ? { ...aa, returnDate: today } : aa
    ));
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, isAssigned: false } : a));
    showToast("Hardware returned to inventory.");
  };

  const handleAssignAsset = (assetId: string, employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const isActive = assetAssignments.some(aa => aa.assetId === assetId && !aa.returnDate);
    if (isActive) {
      showToast("Asset already in active use.", "error");
      return;
    }
    const newAssignment: AssetAssignment = { id: `AA-${Date.now()}`, employeeId, assetId, assignmentDate: today };
    setAssetAssignments(prev => [...prev, newAssignment]);
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, isAssigned: true } : a));
    showToast(`Asset assigned.`);
    setModalType(null);
  };

  const handleUpdateTeamAssignment = (employeeId: string, newProjectId: string, role: string, startDate: string, reason?: string, currentEndDate?: string) => {
    setTeamAssignments(prev => {
      const updated = prev.map(ta => 
        (ta.employeeId === employeeId && ta.status === AllocationStatus.Active) 
          ? { ...ta, status: AllocationStatus.COMPLETED, endDate: currentEndDate || startDate, reassignmentReason: reason } 
          : ta
      );
      
      const newAssignment: TeamAssignment = {
        id: `TA-${Date.now()}`,
        employeeId,
        projectId: newProjectId,
        role,
        startDate: startDate,
        status: AllocationStatus.Active
      };
      
      return [...updated, newAssignment];
    });

    const newProject = teams.find(t => t.id === newProjectId);
    if (newProject) {
      setEmployees(prev => prev.map(e => e.id === employeeId ? {
        ...e,
        projectLead: newProject.projectLead,
        technicalLead: newProject.technicalLead
      } : e));
    }

    showToast("Team assignment updated.");
    setModalType(null);
    setSelectedTeamIdForModal('');
    setAssignedRoleForModal('');
    setReassignmentReason('');
    setAssignedDateForModal(new Date().toISOString().split('T')[0]);
    setEndDateForCurrent(new Date().toISOString().split('T')[0]);
  };

  const handleEndTeamAssignment = (assignmentId: string, endDate: string, reason?: string) => {
    const assignment = teamAssignments.find(ta => ta.id === assignmentId);
    if (!assignment) return;

    setTeamAssignments(prev => prev.map(ta => 
      ta.id === assignmentId ? { ...ta, status: AllocationStatus.COMPLETED, endDate: endDate, reassignmentReason: reason } : ta
    ));

    setEmployees(prev => prev.map(e => e.id === assignment.employeeId ? {
      ...e,
      projectLead: '',
      technicalLead: ''
    } : e));

    showToast("Team assignment completed.");
    setModalType(null);
    setAssignedDateForModal(new Date().toISOString().split('T')[0]);
    setReassignmentReason('');
  };

  const handleOffboardSubmit = (id: string, reason: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status: EmploymentStatus.OFFBOARDED, 
      offboardingReason: reason,
      version: (e.version || 0) + 1 
    } : e));
    
    const activeAssets = assetAssignments.filter(aa => aa.employeeId === id && !aa.returnDate);
    activeAssets.forEach(aa => handleUnassignAsset(aa.assetId));

    const today = new Date().toISOString().split('T')[0];
    setTeamAssignments(prev => prev.map(ta => 
      (ta.employeeId === id && ta.status === AllocationStatus.Active) 
        ? { ...ta, status: AllocationStatus.COMPLETED, endDate: today } 
        : ta
    ));

    setModalType(null);
    showToast("Personnel offboarded.");
  };

  const handleReactivate = (id: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status: EmploymentStatus.ACTIVE, 
      offboardingReason: undefined,
      version: (e.version || 0) + 1 
    } : e));
    showToast("Personnel record reactivated.");
  };

  const handleSeedDatabase = async () => {
    try {
      // Check if seed data already exists
      const seedEmployeeIds = ['EMP001', 'EMP002', 'EMP003', 'EMP004'];
      const seedAssetIds = ['AST001', 'AST002', 'AST003', 'AST004', 'AST005'];
      const seedTeamIds = ['TEAM001', 'TEAM002', 'TEAM003'];
      
      const hasExistingEmployees = employees.some(e => seedEmployeeIds.includes(e.id));
      const hasExistingAssets = assets.some(a => seedAssetIds.includes(a.id));
      const hasExistingTeams = teams.some(t => seedTeamIds.includes(t.id));
      
      if (hasExistingEmployees || hasExistingAssets || hasExistingTeams) {
        console.warn('?? Seed data already exists, skipping seed operation');
        showToast('Sample data already exists. Skipping duplicate seed.', 'info');
        return;
      }
      
      const seedData = generateSeedData();
      
      // ? APPEND seed data to existing data instead of replacing
      setEmployees(prev => [...prev, ...seedData.employees]);
      setAssets(prev => [...prev, ...seedData.assets]);
      setTeams(prev => [...prev, ...seedData.teams]);
      setTeamAssignments(prev => [...prev, ...seedData.teamAssignments]);
      setAssetAssignments(prev => [...prev, ...seedData.assetAssignments]);
      setAuditLogs(prev => [...prev, ...seedData.auditLogs]);
      
      console.log('? Seed data added successfully');
      showToast(`Added ${seedData.employees.length} employees, ${seedData.assets.length} assets, and ${seedData.teams.length} teams`, 'success');
      
      // Navigate to dashboard to see the data
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Seed error:', error);
      showToast('Failed to seed database', 'error');
    }
  };

  const handleViewEmployee = (id: string) => { setSelectedEmployeeId(id); setCurrentView('employee_detail'); };
  const handleViewTeam = (id: string) => { setSelectedTeamId(id); setCurrentView('team_detail'); };
  const handleViewAsset = (id: string) => { setSelectedAssetId(id); setCurrentView('asset_detail'); };
  
  const handleUpdateOnboarding = (employeeId: string, status: OnboardingStatus) => {
    setEmployees(prev => prev.map(e => e.id === employeeId ? { ...e, onboarding: status } : e));
  };

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees(prev => prev.map(e => e.id === updated.id ? { ...updated, version: (e.version || 0) + 1 } : e));
    setModalType(null);
    showToast("Profile updated.");
  };

  const handleOnboardingComplete = (data: {
    employee: Partial<Employee>;
    assetIds: string[]; 
    newAssets: Partial<Asset>[]; 
    projectAssignment: {
      projectId: string;
      role: string;
      startDate: string;
    } | null;
    onboardingOverride?: Partial<OnboardingStatus>;
  }) => {
    const employeeId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp: Employee = {
      ...data.employee,
      id: employeeId,
      fullName: `${data.employee.firstName} ${data.employee.lastName}`,
      status: EmploymentStatus.ACTIVE,
      onboarding: { ...INITIAL_ONBOARDING, ...(data.onboardingOverride || {}) },
      version: 1,
      skillsets: data.employee.skillsets || []
    } as Employee;

    const newlyCreatedAssets: Asset[] = data.newAssets.map((na, idx) => ({
      ...na,
      id: `AST-N${Date.now()}-${idx}`,
      isAssigned: true,
      version: 1
    } as Asset));

    setAssets(prev => [
      ...prev.map(a => data.assetIds.includes(a.id) ? { ...a, isAssigned: true } : a),
      ...newlyCreatedAssets
    ]);

    const newAssetAssignments: AssetAssignment[] = [
      ...data.assetIds, 
      ...newlyCreatedAssets.map(a => a.id)
    ].map(assetId => ({
      id: `AA-${Date.now()}-${assetId}`,
      employeeId,
      assetId,
      assignmentDate: new Date().toISOString().split('T')[0]
    }));
    setAssetAssignments(prev => [...prev, ...newAssetAssignments]);

    if (data.projectAssignment) {
      const newTeamAssignment: TeamAssignment = {
        id: `TA-${Date.now()}`,
        employeeId,
        projectId: data.projectAssignment.projectId,
        role: data.projectAssignment.role,
        startDate: data.projectAssignment.startDate,
        status: AllocationStatus.Active
      };
      setTeamAssignments(prev => [...prev, newTeamAssignment]);
    }

    setEmployees(prev => [...prev, newEmp]);
    setModalType(null);
    showToast("Personnel assigned.");
  };

  const handleBulkImport = (data: any[]) => {
    if (!importModalType) return;
    try {
      if (importModalType === 'employees') {
        const newEmployees: Employee[] = data.map((item, index) => {
          const fName = String(item.firstName || '');
          const lName = String(item.lastName || '');
          return {
            id: `EMP-I${Date.now()}-${index}`,
            firstName: fName, lastName: lName, fullName: `${fName} ${lName}`.trim(),
            designation: String(item.designation || 'Staff'),
            skillsets: typeof item.skillsets === 'string' ? item.skillsets.split(',').map((s: string) => s.trim()) : [],
            contactNumber: String(item.contactNumber || ''), lumovyEmail: String(item.lumovyEmail || ''),
            microsoftEmail: String(item.microsoftEmail || ''), department: String(item.department || 'General'),
            reportingManager: String(item.reportingManager || ''), projectLead: String(item.projectLead || ''),
            technicalLead: String(item.technicalLead || ''), status: EmploymentStatus.ACTIVE,
            onboarding: { ...INITIAL_ONBOARDING }, version: 1
          };
        });
        setEmployees(prev => [...prev, ...newEmployees]);
        showToast(`${newEmployees.length} personnel imported.`);
      } else if (importModalType === 'assets') {
        const newAssets: Asset[] = data.map((item, index) => ({
          id: `AST-I${Date.now()}-${index}`, type: (item.type || AssetType.LAPTOP) as AssetType,
          make: String(item.make || ''), model: String(item.model || ''),
          serialNumber: String(item.serialNumber || ''), isAssigned: false, version: 1
        }));
        setAssets(prev => [...prev, ...newAssets]);
        showToast(`${newAssets.length} assets added.`);
      } else if (importModalType === 'teams') {
        const newTeams: Team[] = data.map((item, index) => ({
          id: `TEM-I${Date.now()}-${index}`, name: String(item.name || ''),
          clientName: String(item.clientName || ''), projectLead: String(item.projectLead || ''),
          technicalLead: String(item.technicalLead || ''), description: String(item.description || ''),
          startDate: String(item.startDate || new Date().toISOString().split('T')[0]),
          endDate: String(item.endDate || ''), status: AllocationStatus.Active, version: 1
        }));
        setTeams(prev => [...prev, ...newTeams]);
        showToast(`${newTeams.length} teams registered.`);
      }
    } catch (err) {
      console.error(err);
      showToast("Import error.", "error");
    } finally {
      setImportModalType(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Initializing Barracks...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === 'employee_detail' && selectedEmployeeId) {
      const emp = employees.find(e => e.id === selectedEmployeeId);
      if (!emp) return null;
      return <EmployeeDetail 
        employee={emp} 
        assets={assetAssignments.filter(aa => aa.employeeId === emp.id && !aa.returnDate).map(aa => assets.find(a => a.id === aa.assetId)).filter(Boolean) as Asset[]} 
        projects={teamAssignments.filter(ta => ta.employeeId === emp.id).map(ta => ({ ...ta, projectName: teams.find(t => t.id === ta.projectId)?.name }))} 
        onBack={() => setCurrentView('employees')} 
        canEdit={canEdit} 
        onUpdate={(e) => { setModalData(e); setModalType('employee'); }} 
        onOffboard={(id) => { setModalData(id); setModalType('offboard'); }} 
        onReactivate={handleReactivate} 
        onViewProject={handleViewTeam} 
        onViewAsset={handleViewAsset} 
        onUpdateOnboarding={(status) => handleUpdateOnboarding(emp.id, status)}
        onAssignAsset={() => { setModalData(emp.id); setModalType('assign_asset'); }}
        onUnassignAsset={handleUnassignAsset}
        onAssignProject={() => { 
          setModalData(emp.id); 
          setModalType('assign_project'); 
          const current = teamAssignments.find(ta => ta.employeeId === emp.id && ta.status === AllocationStatus.Active);
          if (current) {
            setAssignedRoleForModal(current.role);
          }
        }}
        onEndProject={(id) => { setModalData(id); setModalType('end_project'); }}
      />;
    }
    if (currentView === 'team_detail' && selectedTeamId) {
      const team = teams.find(t => t.id === selectedTeamId);
      if (!team) return null;
      return <TeamDetail team={team} members={teamAssignments.filter(ta => ta.projectId === team.id).map(ta => ({ ...ta, employee: employees.find(e => e.id === ta.employeeId) }))} onBack={() => setCurrentView('teams')} canEdit={canEdit} onEdit={(t) => { setModalData(t); setModalType('team'); }} onToggleStatus={() => {}} onViewEmployee={handleViewEmployee} />;
    }
    if (currentView === 'asset_detail' && selectedAssetId) {
      const asset = assets.find(a => a.id === selectedAssetId);
      if (!asset) return null;
      const assetHistory = assetAssignments.filter(aa => aa.assetId === asset.id).map(aa => ({ ...aa, employee: employees.find(e => e.id === aa.employeeId) }));
      return <AssetDetail asset={asset} history={assetHistory} onBack={() => setCurrentView('assets')} canEdit={canEdit} onEdit={(a) => { setModalData(a); setModalType('asset'); }} onViewEmployee={handleViewEmployee} onUnassign={() => handleUnassignAsset(asset.id)} onAssign={() => { setModalData(asset.id); setModalType('assign_asset'); }} />;
    }
    
    switch (currentView) {
      case 'dashboard': return <Dashboard employees={employees} assets={assets} projects={teams} auditLogs={auditLogs} onViewEmployee={handleViewEmployee} onViewOnboarding={(id) => { setFocusOnboardingId(id); setCurrentView('onboardings'); }} onViewProject={handleViewTeam} onViewAsset={handleViewAsset} onEditEmployee={() => {}} onAddEmployee={() => setModalType('onboarding_wizard')} onDeactivateEmployee={() => {}} onReactivateEmployee={() => {}} onEditAsset={() => {}} onDeleteAsset={() => {}} onEditProject={() => {}} onToggleProjectStatus={() => {}} onNavigate={setCurrentView} canEdit={canEdit} isAdmin={currentUserRole === UserRole.ADMIN} assetAssignments={assetAssignments} projectAssignments={teamAssignments} />;
      case 'onboardings': return <OnboardingListView employees={employees} projectAssignments={teamAssignments} onViewEmployee={handleViewEmployee} onNavigate={setCurrentView} onUpdateOnboarding={handleUpdateOnboarding} onUpdateEmployee={handleUpdateEmployee} canEdit={canEdit} focusId={focusOnboardingId} />;
      case 'employees': return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">People</h2><p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Internal Directory</p></div>
            <div className="flex gap-2">
              <button onClick={() => setImportModalType('employees')} className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm"><Upload size={14} /> Import</button>
              <button onClick={() => setModalType('onboarding_wizard')} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/10"><Plus size={14} /> Add Personnel</button>
            </div>
          </div>
          <EmployeesTable employees={employees} onView={handleViewEmployee} canEdit={canEdit} onEdit={(e) => { setModalData(e); setModalType('employee'); }} onDeactivate={() => {}} onReactivate={() => {}} />
        </div>
      );
      case 'teams': return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">Teams</h2><p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Project Groups</p></div>
            <div className="flex gap-2">
              <button onClick={() => setImportModalType('teams')} className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm"><Upload size={14} /> Bulk Import</button>
              <button onClick={() => { setModalData(null); setModalType('team'); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/10"><Plus size={14} /> New Team</button>
            </div>
          </div>
          <TeamsTable teams={teams} assignments={teamAssignments} employees={employees} canEdit={canEdit} onEdit={(t) => { setModalData(t); setModalType('team'); }} onView={handleViewTeam} onToggleStatus={() => {}} />
        </div>
      );
      case 'assets': return (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">Assets</h2><p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">Hardware Inventory</p></div>
            <div className="flex gap-2">
              <button onClick={() => setImportModalType('assets')} className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-slate-50 transition-all shadow-sm"><Upload size={14} /> Import</button>
              <button onClick={() => { setModalData(null); setModalType('asset'); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/10"><Plus size={14} /> Register Unit</button>
            </div>
          </div>
          <AssetsTable assets={assets} assignments={assetAssignments} employees={employees} canEdit={canEdit} onView={handleViewAsset} onEdit={(a) => { setModalData(a); setModalType('asset'); }} onDelete={() => {}} />
        </div>
      );
      case 'settings': return <Settings onSeedData={handleSeedDatabase} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutGrid size={18} /> },
    { id: 'onboardings', label: 'Onboarding', icon: <Rocket size={18} />, badge: employees.filter(e => e.onboarding && Object.values(e.onboarding).filter(Boolean).length < 8).length },
    { id: 'employees', label: 'People', icon: <Users size={18} /> },
    { id: 'teams', label: 'Teams', icon: <Layout size={18} /> },
    { id: 'assets', label: 'Assets', icon: <Box size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      <aside className="w-[220px] bg-white border-r border-slate-100 flex flex-col fixed h-full z-50">
        <div className="p-6 pb-2"><div className="flex items-center gap-3 group cursor-pointer mb-6"><Logo /><h1 className="text-2xl text-slate-950 brand-font leading-none pt-0.5">barracks</h1></div></div>
        <nav className="flex-1 px-3 space-y-1">{navItems.map((item) => (<button key={item.id} onClick={() => { setCurrentView(item.id); setSelectedEmployeeId(null); setSelectedTeamId(null); setSelectedAssetId(null); }} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${currentView === item.id ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}><div className="flex items-center gap-3"><div className={currentView === item.id ? 'text-white' : 'text-slate-300 group-hover:text-blue-600 transition-colors'}>{item.icon}</div><span className="text-[13px] font-medium tracking-tight">{item.label}</span></div>{item.badge !== undefined && item.badge > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${currentView === item.id ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'}`}>{item.badge}</span>}</button>))}</nav>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen pl-[220px]">
        <header className="h-14 bg-white/80 backdrop-blur-md flex items-center justify-end px-8 fixed top-0 right-0 left-[220px] z-40 border-b border-slate-100/50"><div className="flex items-center gap-4" ref={searchRef}><div className="relative"><button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-1.5 rounded-lg transition-all ${isSearchOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}><Search size={18} /></button>{isSearchOpen && (<div className="absolute top-full right-0 mt-2 w-72 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 animate-fade-in ring-4 ring-blue-900/5"><div className="relative"><input autoFocus type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search registry..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border-none text-[13px] font-medium focus:ring-2 focus:ring-blue-500/20 text-slate-900 tracking-tight" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} /></div></div>)}</div><button className="relative text-slate-300 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></button></div></header>
        <div className="p-4 pt-16 pb-8 max-w-full mx-auto w-full">{renderContent()}</div>
      </main>
      {modalType === 'onboarding_wizard' && <OnboardingWizard assets={assets} projects={teams} onClose={() => setModalType(null)} onComplete={handleOnboardingComplete} />}
      {modalType === 'assign_asset' && (
        <AssignmentModal 
          employees={typeof modalData === 'string' && employees.find(e => e.id === modalData) ? [] : employees.filter(e => e.status === EmploymentStatus.ACTIVE)} 
          onClose={() => setModalType(null)} 
          onSelect={(id) => {
            if (typeof modalData === 'string' && employees.find(e => e.id === modalData)) {
              handleAssignAsset(id, modalData);
            } else {
              handleAssignAsset(modalData, id);
            }
          }} 
          assets={typeof modalData === 'string' && employees.find(e => e.id === modalData) ? assets.filter(a => !a.isAssigned) : undefined}
        />
      )}
      {modalType === 'offboard' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button onClick={() => setModalType(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900"><X size={20}/></button>
            <div className="mb-8">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Confirm Offboarding</h3>
              <p className="text-sm text-slate-500 mt-2">Personnel will be removed from all active teams and assets will be returned.</p>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Offboarding</label>
              <textarea 
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none text-sm font-semibold h-32 resize-none placeholder:text-slate-300 focus:ring-2 focus:ring-rose-500/20" 
                placeholder="e.g. End of contract, Resignation..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleOffboardSubmit(modalData, e.currentTarget.value);
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const area = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                  handleOffboardSubmit(modalData, area.value);
                }}
                className="w-full py-4 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                Execute Offboarding
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'assign_project' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Shuffle size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Team Assignment</h3>
              </div>
              <button onClick={() => { setModalType(null); setSelectedTeamIdForModal(''); setAssignedRoleForModal(''); setReassignmentReason(''); setAssignedDateForModal(new Date().toISOString().split('T')[0]); }} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={18}/></button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
              {currentAssignmentForModal && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Current Team Termination</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                      <input 
                        type="date"
                        value={endDateForCurrent}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-[13px] font-bold text-slate-900 focus:ring-2 focus:ring-amber-500/20"
                        onChange={(e) => setEndDateForCurrent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Role</label>
                      <div className="px-4 py-3 bg-slate-50/50 text-slate-400 text-[12px] font-bold rounded-xl border border-slate-100 italic">
                        {currentAssignmentForModal.role}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Assignment Update</label>
                    <textarea 
                      placeholder="Context for transition..."
                      value={reassignmentReason}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-[13px] font-medium text-slate-900 h-20 resize-none focus:ring-2 focus:ring-amber-500/20 placeholder:text-slate-300"
                      onChange={(e) => setReassignmentReason(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Assignment</p>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Team</label>
                  <div className="relative">
                    <select 
                      value={selectedTeamIdForModal}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-none text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/20 text-slate-900" 
                      onChange={(e) => setSelectedTeamIdForModal(e.target.value)}
                    >
                      <option value="">Select team...</option>
                      {teams.filter(t => t.status === AllocationStatus.Active && (!currentAssignmentForModal || t.id !== currentAssignmentForModal.projectId)).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Role</label>
                    <input 
                      type="text"
                      placeholder="Technical SME"
                      value={assignedRoleForModal}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-[13px] font-bold focus:ring-2 focus:ring-blue-500/20"
                      onChange={(e) => setAssignedRoleForModal(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input 
                      type="date"
                      value={assignedDateForModal}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-[13px] font-bold focus:ring-2 focus:ring-blue-500/20"
                      onChange={(e) => setAssignedDateForModal(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-50">
              <button 
                onClick={() => {
                  if (selectedTeamIdForModal && assignedRoleForModal) {
                    handleUpdateTeamAssignment(modalData, selectedTeamIdForModal, assignedRoleForModal, assignedDateForModal, reassignmentReason, endDateForCurrent);
                  }
                }}
                disabled={!selectedTeamIdForModal || !assignedRoleForModal || !assignedDateForModal}
                className={`w-full py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                  (!selectedTeamIdForModal || !assignedRoleForModal || !assignedDateForModal) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                Execute Team Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === 'end_project' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-100">
            <button onClick={() => { setModalType(null); setAssignedDateForModal(new Date().toISOString().split('T')[0]); setReassignmentReason(''); }} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={20}/>
            </button>
            <h3 className="text-xl font-black text-slate-900 uppercase mb-8">Finalize Assignment</h3>
            <div className="space-y-6">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Record completion date and context for ending this team assignment.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Completion Date</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={assignedDateForModal}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                      onChange={(e) => setAssignedDateForModal(e.target.value)}
                    />
                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Termination Context</label>
                  <textarea 
                    placeholder="e.g. Project completion, Internal rotation..."
                    value={reassignmentReason}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none text-sm font-semibold h-24 resize-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={(e) => setReassignmentReason(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={() => handleEndTeamAssignment(modalData, assignedDateForModal, reassignmentReason)}
                disabled={!assignedDateForModal}
                className={`w-full py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] ${
                  !assignedDateForModal ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                Terminate Active Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType && !['onboarding_wizard', 'assign_asset', 'assign_project', 'end_project', 'offboard'].includes(modalType) && (
        <EntityModal type={modalType as any} initialData={modalData} employees={employees} assets={assets} teams={teams} onClose={() => setModalType(null)} onSaveEmployee={handleUpdateEmployee} onSaveAsset={() => {}} onSaveTeam={() => {}} />
      )}
      {importModalType && <ImportModal type={importModalType} onClose={() => setImportModalType(null)} onImport={handleBulkImport} />}
    </div>
  );
};

export default App;
