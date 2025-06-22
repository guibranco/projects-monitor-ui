import React from 'react';
import { Activity, Moon, Sun, User } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export function Header({ isDarkMode, setIsDarkMode }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Project Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-16 h-8 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle dark mode"
            >
              <div
                className={`absolute left-1 top-1 w-6 h-6 rounded-full transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-8 bg-gray-800' : 'translate-x-0 bg-yellow-500'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                ) : (
                  <Sun className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}