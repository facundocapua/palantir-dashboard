import { PersonService } from '@/services/personService';

export interface StatItem {
  label: string;
  count: number;
  percentage: number;
}

export interface StatsData {
  roleStats: StatItem[];
  seniorityStats: StatItem[];
  teamStats: StatItem[];
  totalPeople: number;
}

export interface ReportFilters {
  selectedTeam?: string;
  selectedRole?: string;
  selectedSeniority?: string;
}

export class ReportsService {
  static async getTeamStats(filters: ReportFilters = {}): Promise<StatsData> {
    const allPeople = await PersonService.getAllPeople();
    
    // Apply filters
    let people = allPeople;
    
    if (filters.selectedTeam) {
      people = people.filter(person => person.team?.name === filters.selectedTeam);
    }
    
    if (filters.selectedRole) {
      people = people.filter(person => 
        person.role === filters.selectedRole || person.roleDetail?.name === filters.selectedRole
      );
    }
    
    if (filters.selectedSeniority) {
      people = people.filter(person => person.seniority === filters.selectedSeniority);
    }
    
    const totalPeople = people.length;

    // Calculate role distribution
    const roleCount = new Map<string, number>();
    people.forEach(person => {
      const role = person.role || 'No Role';
      roleCount.set(role, (roleCount.get(role) || 0) + 1);
    });

    const roleStats: StatItem[] = Array.from(roleCount.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: totalPeople > 0 ? Math.round((count / totalPeople) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate seniority distribution
    const seniorityCount = new Map<string, number>();
    people.forEach(person => {
      const seniority = person.seniority || 'No Seniority';
      seniorityCount.set(seniority, (seniorityCount.get(seniority) || 0) + 1);
    });

    const seniorityStats: StatItem[] = Array.from(seniorityCount.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: totalPeople > 0 ? Math.round((count / totalPeople) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate team distribution
    const teamCount = new Map<string, number>();
    people.forEach(person => {
      const team = person.team?.name || 'No Team';
      teamCount.set(team, (teamCount.get(team) || 0) + 1);
    });

    const teamStats: StatItem[] = Array.from(teamCount.entries())
      .map(([label, count]) => ({
        label,
        count,
        percentage: totalPeople > 0 ? Math.round((count / totalPeople) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);

    return {
      roleStats,
      seniorityStats,
      teamStats,
      totalPeople
    };
  }
}
