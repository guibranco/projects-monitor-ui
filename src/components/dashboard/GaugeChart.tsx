import React from "react";

interface GaugeChartProps {
  value: number;
  label: string;
  icon: React.ElementType;
}

export function GaugeChart({ value, label, icon: Icon }: GaugeChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-lg font-semibold mt-2 block dark:text-white">
        {value}%
      </span>
    </div>
  );
}
