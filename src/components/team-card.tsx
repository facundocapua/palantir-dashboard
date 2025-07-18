'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Team, PersonWithTeamAndRole } from '@/types/database';
import PersonCard from './person-card';

interface TeamStats {
  totalHours: number;
  hoursByRole: Record<string, number>;
  memberCount: number;
}

interface TeamCardProps {
  team: Team;
  people: PersonWithTeamAndRole[];
  stats: TeamStats;
}

const getTeamColor = (teamName: string) => {
  switch (teamName.toLowerCase()) {
    case 'atlas':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hoverBorder: 'border-blue-500',
        text: 'text-blue-700',
        accent: 'bg-blue-100'
      };
    case 'legion':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        hoverBorder: 'border-red-500',
        text: 'text-red-700',
        accent: 'bg-red-100'
      };
    case 'infraestructura':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        hoverBorder: 'border-green-500',
        text: 'text-green-700',
        accent: 'bg-green-100'
      };
    case 'valhalla':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hoverBorder: 'border-purple-500',
        text: 'text-purple-700',
        accent: 'bg-purple-100'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        hoverBorder: 'border-gray-500',
        text: 'text-gray-700',
        accent: 'bg-gray-100'
      };
  }
};

export default function TeamCard({ team, people, stats }: TeamCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `team-${team.id}`,
  });

  const colors = getTeamColor(team.name);

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
        isOver ? `${colors.hoverBorder} ${colors.bg}` : colors.border
      }`}
    >
      <div className={`p-4 border-b ${colors.border} ${colors.bg}`}>
        <h3 className={`text-lg font-semibold ${colors.text}`}>{team.name}</h3>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600">Members:</span>
            <span className={`ml-1 font-semibold px-2 py-0.5 rounded ${colors.accent} ${colors.text}`}>
              {stats.memberCount}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">Total Hours:</span>
            <span className={`ml-1 font-semibold px-2 py-0.5 rounded ${colors.accent} ${colors.text}`}>
              {stats.totalHours}h
            </span>
          </div>
        </div>
        
        {Object.keys(stats.hoursByRole).length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2 font-medium">Hours by Role:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(stats.hoursByRole).map(([role, hours]) => (
                <div key={role} className="flex justify-between text-xs bg-white rounded px-2 py-1 border border-gray-200">
                  <span className="text-gray-700 font-medium">{role}:</span>
                  <span className={`font-semibold ${colors.text}`}>{hours}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <SortableContext 
          items={people.map(p => p.id.toString())} 
          strategy={verticalListSortingStrategy}
        >
          {people.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No members assigned</p>
              <p className="text-xs mt-1">Drag people here to assign them</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
              {people.map(person => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
