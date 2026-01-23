
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

// All initial registries are now empty to ensure data parity with the cloud database.
export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_ASSETS: Asset[] = [];

export const INITIAL_TEAMS: Team[] = [];
