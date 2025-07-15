// Test script to demonstrate the reports filtering functionality
// This script shows how the filtering works programmatically

import { ReportsService } from '../src/services/reportsService';

async function testReportsFiltering() {
  console.log('Testing Reports Filtering Functionality');
  console.log('=====================================');
  
  try {
    // Test 1: Get all reports (no filters)
    console.log('\n1. Getting all reports (no filters):');
    const allReports = await ReportsService.getTeamStats();
    console.log('Total People:', allReports.totalPeople);
    console.log('Role Stats:', allReports.roleStats.length, 'roles');
    console.log('Team Stats:', allReports.teamStats.length, 'teams');
    console.log('Seniority Stats:', allReports.seniorityStats.length, 'seniority levels');
    
    // Test 2: Filter by team
    console.log('\n2. Filtering by team (first team):');
    const teamName = allReports.teamStats[0]?.label;
    if (teamName) {
      const teamFiltered = await ReportsService.getTeamStats({ selectedTeam: teamName });
      console.log(`Total People in ${teamName}:`, teamFiltered.totalPeople);
      console.log('Role distribution in team:', teamFiltered.roleStats.map(r => `${r.label}: ${r.count}`));
    }
    
    // Test 3: Filter by role
    console.log('\n3. Filtering by role (first role):');
    const roleName = allReports.roleStats[0]?.label;
    if (roleName) {
      const roleFiltered = await ReportsService.getTeamStats({ selectedRole: roleName });
      console.log(`Total People with ${roleName} role:`, roleFiltered.totalPeople);
      console.log('Team distribution for role:', roleFiltered.teamStats.map(t => `${t.label}: ${t.count}`));
    }
    
    // Test 4: Filter by seniority
    console.log('\n4. Filtering by seniority (first seniority):');
    const seniorityLevel = allReports.seniorityStats[0]?.label;
    if (seniorityLevel) {
      const seniorityFiltered = await ReportsService.getTeamStats({ selectedSeniority: seniorityLevel });
      console.log(`Total People with ${seniorityLevel} seniority:`, seniorityFiltered.totalPeople);
      console.log('Role distribution for seniority:', seniorityFiltered.roleStats.map(r => `${r.label}: ${r.count}`));
    }
    
    // Test 5: Combined filters
    console.log('\n5. Combined filters (team + role):');
    if (teamName && roleName) {
      const combinedFiltered = await ReportsService.getTeamStats({ 
        selectedTeam: teamName, 
        selectedRole: roleName 
      });
      console.log(`Total People in ${teamName} with ${roleName} role:`, combinedFiltered.totalPeople);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing reports filtering:', error);
  }
}

// Export for potential use
export { testReportsFiltering };
