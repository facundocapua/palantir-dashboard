// Database types based on the MySQL schema

export interface Team {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  seniority: 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null;
  contract: 'Employee' | 'Contractor' | null;
  team_id: number | null;
  role_id: number | null;
  english_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  monthly_hours: number;
}

export interface Client {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  repository: string | null;
  client_id: number;
  team_id: number;
  status: 'Active' | 'Inactive' | 'Completed' | 'On Hold';
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectProjectedHours {
  id: number;
  project_id: number;
  year: number;
  month: number;
  projected_hours: number;
  created_at: Date;
  updated_at: Date;
}

// Extended types with relations
export interface PersonWithTeamAndRole extends Person {
  team: Team | null;
  roleDetail: Role | null;
}

export interface ClientWithProjectCount extends Client {
  projectCount: number;
}

export interface ProjectWithClientAndTeam extends Project {
  client: Client;
  team: Team;
}

export interface ProjectWithProjectedHours extends Project {
  client: Client;
  team: Team;
  projectedHours: ProjectProjectedHours[];
}

export interface TeamCapacityAnalysis {
  team: Team;
  totalMemberHours: number;
  memberCount: number;
  projects: ProjectWithProjectedHours[];
  totalProjectedHours: number;
  capacityDifference: number; // positive = excess capacity, negative = needs more people
  utilizationPercentage: number;
}

export interface TeamWithMembers extends Team {
  members: PersonWithTeamAndRole[];
  memberCount: number;
}

export interface TeamWithMemberCount extends Team {
  memberCount: number;
}

export interface TeamWithProjects extends Team {
  projects: Project[];
  projectCount: number;
}

export interface RoleWithUsageCount extends Role {
  usageCount: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
