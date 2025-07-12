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
  role: 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null;
  contract: 'Employee' | 'Contractor' | null;
  team_id: number | null;
  role_id: number | null;
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
