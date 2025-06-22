import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, color = "blue" }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-3">
        <Icon className={`w-6 h-6 text-${color}-500`} />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-semibold dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}