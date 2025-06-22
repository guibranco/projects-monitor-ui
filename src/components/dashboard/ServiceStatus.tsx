import React from 'react';
import { Server, Clock, Bot, Globe, CheckCircle, XCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { mockData } from '../../lib/mockData';

export function ServiceStatus() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold dark:text-white">Service Status</h2>
        <StatCard icon={Server} label="API Usage" value={`${mockData.apiUsage}%`} color="blue" />
        <StatCard icon={Clock} label="Uptime" value={`${mockData.uptime}%`} color="green" />
        <StatCard icon={Bot} label="Bot Installations" value={mockData.botInstallations} color="purple" />
        <StatCard icon={Globe} label="Repositories" value={mockData.repositories} color="indigo" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Health Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-gray-300">WireGuard</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-gray-300">HealthChecks.io</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm dark:text-gray-300">UpTimeRobot</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}