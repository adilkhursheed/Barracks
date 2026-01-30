import { Employee, Asset, Team, TeamAssignment, AssetAssignment, EmploymentStatus, AssetType, AllocationStatus } from '../types';
import { INITIAL_ONBOARDING } from '../constants';

export interface SeedData {
  employees: Employee[];
  assets: Asset[];
  teams: Team[];
  teamAssignments: TeamAssignment[];
  assetAssignments: AssetAssignment[];
  auditLogs: any[];
}

export function generateSeedData(): SeedData {
  const today = new Date().toISOString().split('T')[0];
  
  // Sample Employees
  const employees: Employee[] = [
    {
      id: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      designation: 'Senior Software Engineer',
      skillsets: ['React', 'TypeScript', 'Node.js', 'Azure'],
      contactNumber: '+1-555-0101',
      lumovyEmail: 'sarah.johnson@lumovy.com',
      microsoftEmail: 'sarah.johnson@company.com',
      department: 'Engineering',
      reportingManager: 'John Smith',
      projectLead: 'Mike Chen',
      technicalLead: 'Alice Wang',
      status: EmploymentStatus.ACTIVE,
      onboarding: {
        ...INITIAL_ONBOARDING,
        lumovyEmail: true,
        bgvId: true,
        onboardingSubmitted: true,
        scocCompleted: true,
        vidReceived: true,
        identityPassed: true,
        passkeysGenerated: true,
        teamIntroduced: true
      },
      version: 1
    },
    {
      id: 'EMP002',
      firstName: 'Michael',
      lastName: 'Chen',
      fullName: 'Michael Chen',
      designation: 'DevOps Engineer',
      skillsets: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      contactNumber: '+1-555-0102',
      lumovyEmail: 'michael.chen@lumovy.com',
      microsoftEmail: 'michael.chen@company.com',
      department: 'Engineering',
      reportingManager: 'John Smith',
      projectLead: 'Mike Chen',
      technicalLead: 'Alice Wang',
      status: EmploymentStatus.ACTIVE,
      onboarding: {
        ...INITIAL_ONBOARDING,
        lumovyEmail: true,
        bgvId: true,
        onboardingSubmitted: true,
        scocCompleted: true,
        vidReceived: true,
        identityPassed: true,
        passkeysGenerated: false,
        teamIntroduced: false
      },
      version: 1
    },
    {
      id: 'EMP003',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      fullName: 'Emily Rodriguez',
      designation: 'Product Manager',
      skillsets: ['Agile', 'Product Strategy', 'User Research', 'Analytics'],
      contactNumber: '+1-555-0103',
      lumovyEmail: 'emily.rodriguez@lumovy.com',
      microsoftEmail: 'emily.rodriguez@company.com',
      department: 'Product',
      reportingManager: 'Jane Doe',
      projectLead: 'Mike Chen',
      technicalLead: '',
      status: EmploymentStatus.ACTIVE,
      onboarding: {
        ...INITIAL_ONBOARDING,
        lumovyEmail: true,
        bgvId: true,
        onboardingSubmitted: true,
        scocCompleted: true,
        vidReceived: true,
        identityPassed: true,
        passkeysGenerated: true,
        teamIntroduced: true
      },
      version: 1
    },
    {
      id: 'EMP004',
      firstName: 'David',
      lastName: 'Kim',
      fullName: 'David Kim',
      designation: 'UI/UX Designer',
      skillsets: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      contactNumber: '+1-555-0104',
      lumovyEmail: 'david.kim@lumovy.com',
      microsoftEmail: 'david.kim@company.com',
      department: 'Design',
      reportingManager: 'Jane Doe',
      projectLead: 'Alice Wang',
      technicalLead: '',
      status: EmploymentStatus.ACTIVE,
      onboarding: {
        ...INITIAL_ONBOARDING,
        lumovyEmail: true,
        bgvId: false,
        onboardingSubmitted: true,
        scocCompleted: false,
        vidReceived: false,
        identityPassed: false,
        passkeysGenerated: false,
        teamIntroduced: false
      },
      version: 1
    }
  ];

  // Sample Assets
  const assets: Asset[] = [
    {
      id: 'AST001',
      type: AssetType.LAPTOP,
      make: 'Dell',
      model: 'XPS 15',
      serialNumber: 'DL-XPS-2024-001',
      isAssigned: true,
      version: 1
    },
    {
      id: 'AST002',
      type: AssetType.LAPTOP,
      make: 'Apple',
      model: 'MacBook Pro 16"',
      serialNumber: 'AP-MBP-2024-002',
      isAssigned: true,
      version: 1
    },
    {
      id: 'AST003',
      type: AssetType.MONITOR,
      make: 'LG',
      model: 'UltraWide 34"',
      serialNumber: 'LG-UW-2024-003',
      isAssigned: true,
      version: 1
    },
    {
      id: 'AST004',
      type: AssetType.LAPTOP,
      make: 'Lenovo',
      model: 'ThinkPad X1 Carbon',
      serialNumber: 'LN-X1C-2024-004',
      isAssigned: false,
      version: 1
    },
    {
      id: 'AST005',
      type: AssetType.MOUSE,
      make: 'Logitech',
      model: 'MX Master 3',
      serialNumber: 'LG-MX3-2024-005',
      isAssigned: true,
      version: 1
    }
  ];

  // Sample Teams
  const teams: Team[] = [
    {
      id: 'TEAM001',
      name: 'Cloud Migration Initiative',
      clientName: 'TechCorp Industries',
      projectLead: 'Mike Chen',
      technicalLead: 'Alice Wang',
      description: 'Migrate legacy systems to Azure cloud infrastructure with zero downtime',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: AllocationStatus.Active,
      version: 1
    },
    {
      id: 'TEAM002',
      name: 'Mobile App Development',
      clientName: 'RetailMax Solutions',
      projectLead: 'Sarah Johnson',
      technicalLead: 'Michael Chen',
      description: 'Cross-platform mobile application for retail customer engagement',
      startDate: '2024-02-01',
      endDate: '',
      status: AllocationStatus.Active,
      version: 1
    },
    {
      id: 'TEAM003',
      name: 'Data Analytics Platform',
      clientName: 'FinanceHub',
      projectLead: 'Emily Rodriguez',
      technicalLead: 'Sarah Johnson',
      description: 'Real-time analytics dashboard for financial insights',
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      status: AllocationStatus.COMPLETED,
      version: 1
    }
  ];

  // Sample Team Assignments
  const teamAssignments: TeamAssignment[] = [
    {
      id: 'TA001',
      employeeId: 'EMP001',
      projectId: 'TEAM001',
      role: 'Lead Developer',
      startDate: '2024-01-15',
      status: AllocationStatus.Active
    },
    {
      id: 'TA002',
      employeeId: 'EMP002',
      projectId: 'TEAM001',
      role: 'DevOps Engineer',
      startDate: '2024-01-15',
      status: AllocationStatus.Active
    },
    {
      id: 'TA003',
      employeeId: 'EMP003',
      projectId: 'TEAM002',
      role: 'Product Owner',
      startDate: '2024-02-01',
      status: AllocationStatus.Active
    },
    {
      id: 'TA004',
      employeeId: 'EMP004',
      projectId: 'TEAM002',
      role: 'UI/UX Lead',
      startDate: '2024-02-01',
      status: AllocationStatus.Active
    }
  ];

  // Sample Asset Assignments
  const assetAssignments: AssetAssignment[] = [
    {
      id: 'AA001',
      employeeId: 'EMP001',
      assetId: 'AST001',
      assignmentDate: '2024-01-10'
    },
    {
      id: 'AA002',
      employeeId: 'EMP002',
      assetId: 'AST002',
      assignmentDate: '2024-01-10'
    },
    {
      id: 'AA003',
      employeeId: 'EMP003',
      assetId: 'AST003',
      assignmentDate: '2024-01-25'
    },
    {
      id: 'AA004',
      employeeId: 'EMP004',
      assetId: 'AST005',
      assignmentDate: '2024-01-28'
    }
  ];

  return {
    employees,
    assets,
    teams,
    teamAssignments,
    assetAssignments,
    auditLogs: []
  };
}
