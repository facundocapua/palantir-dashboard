'use client';

import { useState, useEffect, useCallback } from 'react';
import AppLayout from "@/components/app-layout";
import PeopleTable from "@/components/people-table";
import { PersonWithTeamAndRole, Team, Role } from '@/types/database';
import toast from 'react-hot-toast';

export default function PeoplePage() {
  const [people, setPeople] = useState<PersonWithTeamAndRole[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { getPeople, getTeams, getRoles } = await import('@/actions/people');
      
      const [peopleResult, teamsResult, rolesResult] = await Promise.all([
        getPeople(),
        getTeams(),
        getRoles()
      ]);

      if (peopleResult.success) {
        setPeople(peopleResult.data || []);
      } else {
        toast.error(peopleResult.error || 'Unable to fetch people data');
      }
      
      if (teamsResult.success) {
        setTeams(teamsResult.data || []);
      } else {
        toast.error(teamsResult.error || 'Unable to fetch teams data');
      }
      
      if (rolesResult.success) {
        setRoles(rolesResult.data || []);
      } else {
        toast.error(rolesResult.error || 'Unable to fetch roles data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An unexpected error occurred while loading the data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">People</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the people in your organization including their name, role, and team.
            </p>
          </div>
        </div>

        <PeopleTable 
          people={people} 
          teams={teams} 
          roles={roles} 
          onDataChange={fetchData}
        />
      </div>
    </AppLayout>
  );
}
