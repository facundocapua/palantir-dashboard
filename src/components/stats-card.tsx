import { StatItem } from '@/services/reportsService';

interface StatsCardProps {
  title: string;
  stats: StatItem[];
  totalPeople: number;
}

export default function StatsCard({ title, stats, totalPeople }: StatsCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-gray-900">{stat.label}</div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">{stat.count} people</div>
              <div className="text-sm font-medium text-gray-900">{stat.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Total</span>
          <span className="text-sm font-medium text-gray-900">{totalPeople} people</span>
        </div>
      </div>
    </div>
  );
}
