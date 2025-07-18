'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PersonWithTeamAndRole } from '@/types/database';

interface PersonCardProps {
  person: PersonWithTeamAndRole;
  isDragging?: boolean;
}

export default function PersonCard({ person, isDragging = false }: PersonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: person.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSeniorityColor = (seniority: string | null) => {
    switch (seniority) {
      case 'JR I':
      case 'JR II':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SSR I':
      case 'SSR II':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SR I':
      case 'SR II':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-md p-2 cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging || isSortableDragging ? 'shadow-lg scale-105 border-blue-300' : 'shadow-sm hover:shadow-md hover:border-gray-300'
      } ${isDragging ? 'rotate-2 bg-blue-50' : ''}`}
    >
      <div className="space-y-1.5">
        <h4 className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {person.name}
        </h4>
        
        <div className="flex flex-wrap gap-1">
          {person.roleDetail && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
              {person.roleDetail.name}
            </span>
          )}
          
          {person.seniority && (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getSeniorityColor(person.seniority)}`}>
              {person.seniority}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium border border-orange-200">
              {person.monthly_hours}h
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500">
            {person.contract && (
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                person.contract === 'Employee' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {person.contract === 'Employee' ? 'EMP' : 'CTR'}
              </span>
            )}
            {person.english_level && (
              <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                {person.english_level}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
