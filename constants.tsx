
import React from 'react';
import { 
  Users, 
  Monitor, 
  Briefcase, 
  LayoutDashboard, 
  Rocket,
  Settings as SettingsIcon
} from 'lucide-react';
import { Employee, Asset, Team, EmploymentStatus, AssetType, AllocationStatus } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'onboardings', label: 'Onboarding', icon: <Rocket size={20} /> },
  { id: 'employees', label: 'People', icon: <Users size={20} /> },
  { id: 'teams', label: 'Teams', icon: <Briefcase size={20} /> },
  { id: 'assets', label: 'Assets', icon: <Monitor size={20} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
];

export const INITIAL_ONBOARDING = {
  lumovyEmail: true,
  bgvId: false,
  onboardingSubmitted: false,
  scocCompleted: false,
  vidReceived: false,
  identityPassed: false,
  passkeysGenerated: false,
  teamIntroduced: false,
};

export const INITIAL_ACCESS = {
  pme: false,
  scAlt: false,
  ame: false
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Connor',
    fullName: 'Sarah Connor',
    designation: 'Senior Developer',
    skillsets: ['React', 'TypeScript', 'Node.js'],
    contactNumber: '+1 555-0101',
    lumovyEmail: 'sarah.c@lumovy.com',
    microsoftEmail: 'sarah.connor@company.onmicrosoft.com',
    scAltEmail: 'sarah.c-alt@microsoft.com',
    department: 'Engineering',
    reportingManager: 'John Miller',
    projectLead: 'Michael Kyle',
    technicalLead: 'Sarah Connor',
    status: EmploymentStatus.ACTIVE,
    onboarding: { 
      ...INITIAL_ONBOARDING, 
      bgvId: true, 
      onboardingSubmitted: true, 
      scocCompleted: true 
    },
    elevatedAccess: { pme: true, scAlt: false, ame: false },
    version: 1
  },
  {
    id: 'EMP002',
    firstName: 'James',
    lastName: 'Smith',
    fullName: 'James Smith',
    designation: 'Product Manager',
    skillsets: ['Agile', 'Scrum', 'Product Strategy'],
    contactNumber: '+1 555-0102',
    lumovyEmail: 'james.s@lumovy.com',
    microsoftEmail: 'james.smith@company.onmicrosoft.com',
    scAltEmail: '',
    department: 'Product',
    reportingManager: 'Emily Davis',
    projectLead: 'Michael Kyle',
    technicalLead: 'Dave Brown',
    status: EmploymentStatus.ACTIVE,
    onboarding: { ...INITIAL_ONBOARDING },
    elevatedAccess: { ...INITIAL_ACCESS },
    version: 1
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'AST001',
    type: AssetType.LAPTOP,
    make: 'Apple',
    model: 'MacBook Pro M3',
    serialNumber: 'SN-LUM-001',
    isAssigned: true,
    version: 1
  },
  {
    id: 'AST002',
    type: AssetType.LAPTOP,
    make: 'Dell',
    model: 'XPS 15',
    serialNumber: 'SN-LUM-002',
    isAssigned: true,
    version: 1
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'TEM001',
    name: 'Infrastructure Squad',
    clientName: 'Enterprise Cloud',
    projectLead: 'Michael Kyle',
    technicalLead: 'Sarah Connor',
    description: 'Cloud modernization project.',
    startDate: '2023-01-01',
    endDate: '',
    status: AllocationStatus.Active,
    version: 1
  }
];
