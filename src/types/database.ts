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
}

// Extended types with relations
export interface PersonWithTeamAndRole extends Person {
  team: Team | null;
  roleDetail: Role | null;
}

export interface TeamWithMembers extends Team {
  members: PersonWithTeamAndRole[];
  memberCount: number;
}

export interface TeamWithMemberCount extends Team {
  memberCount: number;
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
