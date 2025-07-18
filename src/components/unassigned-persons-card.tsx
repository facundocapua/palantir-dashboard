'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PersonWithTeamAndRole } from '@/types/database';
import PersonCard from './person-card';

interface TeamStats {
  totalHours: number;
  hoursByRole: Record<string, number>;
  memberCount: number;
}

interface UnassignedPersonsCardProps {
  people: PersonWithTeamAndRole[];
  stats: TeamStats;
}

export default function UnassignedPersonsCard({ people, stats }: UnassignedPersonsCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
        isOver ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
      }`}
    >
      <div className="p-4 border-b border-orange-200 bg-orange-50">
        <h3 className="text-lg font-semibold text-orange-700 flex items-center">
          <span className="w-3 h-3 bg-orange-500 rounded-full mr-2 shadow-sm"></span>
          Unassigned People
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-gray-600">People:</span>
            <span className="ml-1 font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
              {stats.memberCount}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600">Total Hours:</span>
            <span className="ml-1 font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
              {stats.totalHours}h
            </span>
          </div>
        </div>
        
        {Object.keys(stats.hoursByRole).length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-2 font-medium">Hours by Role:</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(stats.hoursByRole).map(([role, hours]) => (
                <div key={role} className="flex justify-between text-xs bg-white rounded px-2 py-1 border border-orange-200">
                  <span className="text-gray-700 font-medium">{role}:</span>
                  <span className="font-semibold text-orange-700">{hours}h</span>
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
              <p className="text-sm">All people are assigned to teams</p>
              <p className="text-xs mt-1">Drag people here to unassign them</p>
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
