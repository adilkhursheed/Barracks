export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer',
  AUDITOR = 'Auditor'
}

export enum EmploymentStatus {
  ACTIVE = 'Active',
  OFFBOARDED = 'Offboarded'
}

export enum AllocationStatus {
  Active = 'Active',
  COMPLETED = 'Completed'
}

export enum AssetType {
  LAPTOP = 'Laptop',
  SMART_CARD = 'Smart Card',
  YUBIKEY = 'YubiKey',
  SAW_DEVICE = 'SAW Device',
  DOCKING_STATION = 'Docking Station',
  HEADPHONES = 'Headphones',
  MOUSE = 'Mouse',
  CHARGER = 'Charger',
  MONITOR = 'Monitor'
}

export interface OnboardingStatus {
  lumovyEmail: boolean;
  bgvId: boolean;
  onboardingSubmitted: boolean;
  scocCompleted: boolean;
  vidReceived: boolean;
  identityPassed: boolean;
  passkeysGenerated: boolean;
  teamIntroduced: boolean;
}

export interface ElevatedAccess {
  pme: boolean;
  scAlt: boolean;
  ame: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  designation: string;
  location?: string;
  skillsets: string[];
  contactNumber: string;
  lumovyEmail: string;
  microsoftEmail: string;
  scAltEmail?: string;
  microsoftPersonnelNumber?: string;
  bgvIdString?: string;
  department: string;
  reportingManager: string;
  projectLead: string;
  technicalLead: string;
  microsoftLead?: string;
  status: EmploymentStatus;
  onboarding?: OnboardingStatus;
  elevatedAccess?: ElevatedAccess;
  offboardingReason?: string;
  version: number;
}

export interface Asset {
  id: string;
  type: AssetType;
  make: string;
  model: string;
  serialNumber: string;
  isAssigned: boolean;
  version: number;
}

export interface Team {
  id: string;
  name: string;
  clientName: string;
  projectLead: string;
  technicalLead: string;
  description: string;
  startDate: string;
  endDate: string;
  status: AllocationStatus;
  version: number;
}

export interface TeamAssignment {
  id: string;
  employeeId: string;
  projectId: string;
  role: string;
  startDate: string;
  endDate?: string;
  status: AllocationStatus;
  reassignmentReason?: string;
}

export interface AssetAssignment {
  id: string;
  employeeId: string;
  assetId: string;
  assignmentDate: string;
  returnDate?: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DEACTIVATE' | 'REACTIVATE' | 'IMPORT';
  entity: 'Employee' | 'Asset' | 'Team' | 'Assignment' | 'AssetAssignment';
  entityId: string;
  changedBy: string;
  changes: string;
  timestamp: string;
}