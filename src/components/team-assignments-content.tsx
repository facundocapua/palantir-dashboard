'use client';

import { useState, useCallback, useTransition } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Team, PersonWithTeamAndRole } from '@/types/database';
import { updateMultiplePersonTeamAssignments } from '@/actions/teamAssignments';
import TeamCard from './team-card';
import PersonCard from './person-card';
import UnassignedPersonsCard from './unassigned-persons-card';

interface TeamAssignmentsContentProps {
  teams: Team[];
  people: PersonWithTeamAndRole[];
}

interface TeamStats {
  totalHours: number;
  hoursByRole: Record<string, number>;
  memberCount: number;
}

export default function TeamAssignmentsContent({ teams, people }: TeamAssignmentsContentProps) {
  const [localPeople, setLocalPeople] = useState(people);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Group people by team
  const peopleByTeam = localPeople.reduce((acc, person) => {
    const teamId = person.team_id || 'unassigned';
    if (!acc[teamId]) {
      acc[teamId] = [];
    }
    acc[teamId].push(person);
    return acc;
  }, {} as Record<string | number, PersonWithTeamAndRole[]>);

  // Calculate team statistics
  const getTeamStats = useCallback((teamMembers: PersonWithTeamAndRole[]): TeamStats => {
    const totalHours = teamMembers.reduce((sum, member) => sum + member.monthly_hours, 0);
    const hoursByRole = teamMembers.reduce((acc, member) => {
      const roleName = member.roleDetail?.name || 'No Role';
      acc[roleName] = (acc[roleName] || 0) + member.monthly_hours;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalHours,
      hoursByRole,
      memberCount: teamMembers.length,
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activePersonId = parseInt(active.id as string);
    const overId = over.id as string;

    // Determine the target team ID
    let targetTeamId: number | null = null;
    
    if (overId === 'unassigned') {
      targetTeamId = null;
    } else if (overId.startsWith('team-')) {
      targetTeamId = parseInt(overId.replace('team-', ''));
    } else {
      // If dropped on another person, find their team
      const targetPerson = localPeople.find(p => p.id.toString() === overId);
      targetTeamId = targetPerson?.team_id || null;
    }

    // Update the person's team assignment
    setLocalPeople(prevPeople => 
      prevPeople.map(person => 
        person.id === activePersonId 
          ? { 
              ...person, 
              team_id: targetTeamId,
              team: targetTeamId ? teams.find(t => t.id === targetTeamId) || null : null
            }
          : person
      )
    );

    setIsDirty(true);
    setActiveId(null);
  };

  const handleSaveChanges = async () => {
    try {
      // Find people whose team assignments have changed
      const changedPeople = localPeople.filter(localPerson => {
        const originalPerson = people.find(p => p.id === localPerson.id);
        return originalPerson && originalPerson.team_id !== localPerson.team_id;
      });

      if (changedPeople.length === 0) {
        setIsDirty(false);
        return;
      }

      // Prepare updates for server action
      const updates = changedPeople.map(person => ({
        personId: person.id,
        teamId: person.team_id,
      }));

      startTransition(async () => {
        const result = await updateMultiplePersonTeamAssignments(updates);

        if (result.success) {
          setIsDirty(false);
          // The page will automatically revalidate due to revalidatePath in the server action
        } else {
          console.error('Error saving changes:', result.error);
          alert(`Error saving changes: ${result.error}`);
        }
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const handleResetChanges = () => {
    setLocalPeople(people);
    setIsDirty(false);
  };

  const activePerson = activeId ? localPeople.find(p => p.id.toString() === activeId) : null;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Assignments</h1>
          <p className="text-sm text-gray-600 mt-1">
            Drag and drop people between teams to reassign them
          </p>
        </div>
        
        {isDirty && (
          <div className="flex gap-2">
            <button
              onClick={handleResetChanges}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isPending}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {/* Unassigned people */}
          <UnassignedPersonsCard
            people={peopleByTeam.unassigned || []}
            stats={getTeamStats(peopleByTeam.unassigned || [])}
          />

          {/* Team cards */}
          {teams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              people={peopleByTeam[team.id] || []}
              stats={getTeamStats(peopleByTeam[team.id] || [])}
            />
          ))}
        </div>

        <DragOverlay>
          {activePerson ? (
            <PersonCard person={activePerson} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
