import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Github, Server, Bot, Trophy, LogOut } from 'lucide-react';
import { GitHubStats } from './GitHubStats';
import { SystemMetrics } from './SystemMetrics';
import { ServiceStatus } from './ServiceStatus';
import { Header } from './Header';
import { GitHubActivity } from './GitHubActivity';
import { Footer } from './Footer';
import { mockAuth } from '../../lib/auth';

export function Dashboard() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogout = () => {
    mockAuth.logout(() => navigate('/'));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content */}
      <main className="w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Quick Actions & System Metrics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/errors"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>View Error Logs</span>
                </Link>
                <Link
                  to="/github-stats"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Analytics</span>
                </Link>
                <Link
                  to="/ops-overview"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Server className="w-4 h-4" />
                  <span>Ops Overview</span>
                </Link>
                <Link
                  to="/gstraccini-bot"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>GStraccini Bot</span>
                </Link>
                <Link
                  to="/sports-agenda"
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Sports Agenda</span>
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            
            <SystemMetrics />
          </div>

          {/* Middle Column - GitHub Stats */}
          <div className="lg:col-span-2 space-y-6">
            <GitHubActivity />
            <GitHubStats />
          </div>

          {/* Right Column - Service Status */}
          <div className="lg:col-span-1 space-y-6">
            <ServiceStatus />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}