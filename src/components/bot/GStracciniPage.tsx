import React, { useState } from 'react';
import { ArrowLeft, Bot, Activity, GitPullRequest, MessageSquare, Server, Calendar, Clock, Users, Eye, EyeOff, Hash, User, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';

interface ProcessingStats {
  pullRequests: {
    lastHour: number;
    last6Hours: number;
    lastDay: number;
    last7Days: number;
    lastMonth: number;
    total: number;
  };
  issues: {
    lastHour: number;
    last6Hours: number;
    lastDay: number;
    last7Days: number;
    lastMonth: number;
    total: number;
  };
  comments: {
    lastHour: number;
    last6Hours: number;
    lastDay: number;
    last7Days: number;
    lastMonth: number;
    total: number;
  };
  totalRepositories: number;
  totalInstallations: number;
  totalWebhooksProcessed: number;
}

interface WebhookEvent {
  id: string;
  date: string;
  event: string;
  action: string;
  repositoryOwner: string;
  repositoryName: string;
  sender: string;
}

interface Installation {
  id: string;
  installationId: number;
  clientId: string;
  date: string;
  repositorySelection: 'all' | 'selected';
  lastAction: string;
  lastActionDate: string;
  usersAssociated: string[];
}

interface InstallationRepository {
  id: string;
  date: string;
  repositoryOwner: string;
  repositoryName: string;
  visibility: 'public' | 'private';
  lastAction: string;
  lastActionDate: string;
}

// Mock data
const mockProcessingStats: ProcessingStats = {
  pullRequests: {
    lastHour: 12,
    last6Hours: 45,
    lastDay: 89,
    last7Days: 456,
    lastMonth: 1234,
    total: 15678
  },
  issues: {
    lastHour: 8,
    last6Hours: 32,
    lastDay: 67,
    last7Days: 234,
    lastMonth: 892,
    total: 9876
  },
  comments: {
    lastHour: 23,
    last6Hours: 78,
    lastDay: 156,
    last7Days: 789,
    lastMonth: 2345,
    total: 34567
  },
  totalRepositories: 145,
  totalInstallations: 23,
  totalWebhooksProcessed: 67890
};

const mockWebhookEvents: WebhookEvent[] = [
  { id: '1', date: '2024-01-15 14:30:25', event: 'pull_request', action: 'opened', repositoryOwner: 'guibranco', repositoryName: 'projects-monitor', sender: 'john-doe' },
  { id: '2', date: '2024-01-15 14:28:15', event: 'issues', action: 'labeled', repositoryOwner: 'microsoft', repositoryName: 'vscode', sender: 'jane-smith' },
  { id: '3', date: '2024-01-15 14:25:45', event: 'issue_comment', action: 'created', repositoryOwner: 'facebook', repositoryName: 'react', sender: 'mike-wilson' },
  { id: '4', date: '2024-01-15 14:23:30', event: 'pull_request', action: 'synchronize', repositoryOwner: 'vercel', repositoryName: 'next.js', sender: 'sarah-jones' },
  { id: '5', date: '2024-01-15 14:20:12', event: 'push', action: 'created', repositoryOwner: 'nodejs', repositoryName: 'node', sender: 'alex-brown' },
  { id: '6', date: '2024-01-15 14:18:45', event: 'pull_request_review', action: 'submitted', repositoryOwner: 'angular', repositoryName: 'angular', sender: 'tom-davis' },
  { id: '7', date: '2024-01-15 14:15:20', event: 'issues', action: 'closed', repositoryOwner: 'vuejs', repositoryName: 'vue', sender: 'lisa-garcia' },
  { id: '8', date: '2024-01-15 14:12:35', event: 'pull_request', action: 'closed', repositoryOwner: 'sveltejs', repositoryName: 'svelte', sender: 'david-miller' },
  { id: '9', date: '2024-01-15 14:10:50', event: 'issue_comment', action: 'edited', repositoryOwner: 'tailwindlabs', repositoryName: 'tailwindcss', sender: 'emma-taylor' },
  { id: '10', date: '2024-01-15 14:08:15', event: 'pull_request', action: 'review_requested', repositoryOwner: 'vitejs', repositoryName: 'vite', sender: 'ryan-anderson' },
  { id: '11', date: '2024-01-15 14:05:40', event: 'issues', action: 'assigned', repositoryOwner: 'typescript', repositoryName: 'typescript', sender: 'sophia-white' },
  { id: '12', date: '2024-01-15 14:03:25', event: 'pull_request_review_comment', action: 'created', repositoryOwner: 'webpack', repositoryName: 'webpack', sender: 'chris-johnson' }
];

const mockInstallations: Installation[] = [
  { 
    id: '1', 
    installationId: 12345678, 
    clientId: 'Iv1.a1b2c3d4e5f6g7h8', 
    date: '2024-01-10 09:30:00', 
    repositorySelection: 'all', 
    lastAction: 'pull_request_opened', 
    lastActionDate: '2024-01-15 14:25:00',
    usersAssociated: ['guibranco', 'john-doe', 'jane-smith']
  },
  { 
    id: '2', 
    installationId: 23456789, 
    clientId: 'Iv1.b2c3d4e5f6g7h8i9', 
    date: '2024-01-08 15:45:00', 
    repositorySelection: 'selected', 
    lastAction: 'issue_labeled', 
    lastActionDate: '2024-01-15 13:20:00',
    usersAssociated: ['microsoft-team', 'vscode-bot']
  },
  { 
    id: '3', 
    installationId: 34567890, 
    clientId: 'Iv1.c3d4e5f6g7h8i9j0', 
    date: '2024-01-05 11:20:00', 
    repositorySelection: 'selected', 
    lastAction: 'comment_created', 
    lastActionDate: '2024-01-15 12:15:00',
    usersAssociated: ['facebook-team']
  },
  { 
    id: '4', 
    installationId: 45678901, 
    clientId: 'Iv1.d4e5f6g7h8i9j0k1', 
    date: '2024-01-03 14:10:00', 
    repositorySelection: 'all', 
    lastAction: 'pull_request_merged', 
    lastActionDate: '2024-01-15 11:30:00',
    usersAssociated: ['vercel-team', 'next-maintainers']
  },
  { 
    id: '5', 
    installationId: 56789012, 
    clientId: 'Iv1.e5f6g7h8i9j0k1l2', 
    date: '2024-01-01 10:00:00', 
    repositorySelection: 'selected', 
    lastAction: 'issue_closed', 
    lastActionDate: '2024-01-15 10:45:00',
    usersAssociated: ['nodejs-team', 'node-collaborators', 'security-team']
  }
];

const mockInstallationRepositories: InstallationRepository[] = [
  { id: '1', date: '2024-01-10 09:30:00', repositoryOwner: 'guibranco', repositoryName: 'projects-monitor', visibility: 'public', lastAction: 'pull_request_opened', lastActionDate: '2024-01-15 14:25:00' },
  { id: '2', date: '2024-01-10 09:30:00', repositoryOwner: 'guibranco', repositoryName: 'gstraccini-bot', visibility: 'public', lastAction: 'issue_labeled', lastActionDate: '2024-01-15 13:45:00' },
  { id: '3', date: '2024-01-08 15:45:00', repositoryOwner: 'microsoft', repositoryName: 'vscode', visibility: 'public', lastAction: 'comment_created', lastActionDate: '2024-01-15 13:20:00' },
  { id: '4', date: '2024-01-08 15:45:00', repositoryOwner: 'microsoft', repositoryName: 'typescript', visibility: 'public', lastAction: 'pull_request_reviewed', lastActionDate: '2024-01-15 12:30:00' },
  { id: '5', date: '2024-01-05 11:20:00', repositoryOwner: 'facebook', repositoryName: 'react', visibility: 'public', lastAction: 'issue_assigned', lastActionDate: '2024-01-15 12:15:00' },
  { id: '6', date: '2024-01-05 11:20:00', repositoryOwner: 'facebook', repositoryName: 'react-native', visibility: 'public', lastAction: 'pull_request_synchronized', lastActionDate: '2024-01-15 11:50:00' },
  { id: '7', date: '2024-01-03 14:10:00', repositoryOwner: 'vercel', repositoryName: 'next.js', visibility: 'public', lastAction: 'pull_request_merged', lastActionDate: '2024-01-15 11:30:00' },
  { id: '8', date: '2024-01-03 14:10:00', repositoryOwner: 'vercel', repositoryName: 'swr', visibility: 'public', lastAction: 'issue_commented', lastActionDate: '2024-01-15 10:20:00' },
  { id: '9', date: '2024-01-01 10:00:00', repositoryOwner: 'nodejs', repositoryName: 'node', visibility: 'public', lastAction: 'issue_closed', lastActionDate: '2024-01-15 10:45:00' },
  { id: '10', date: '2024-01-01 10:00:00', repositoryOwner: 'nodejs', repositoryName: 'undici', visibility: 'public', lastAction: 'pull_request_opened', lastActionDate: '2024-01-15 09:15:00' },
  { id: '11', date: '2023-12-28 16:30:00', repositoryOwner: 'angular', repositoryName: 'angular', visibility: 'public', lastAction: 'issue_labeled', lastActionDate: '2024-01-15 08:30:00' },
  { id: '12', date: '2023-12-25 12:00:00', repositoryOwner: 'vuejs', repositoryName: 'vue', visibility: 'public', lastAction: 'pull_request_reviewed', lastActionDate: '2024-01-14 18:45:00' },
  { id: '13', date: '2023-12-20 14:15:00', repositoryOwner: 'sveltejs', repositoryName: 'svelte', visibility: 'public', lastAction: 'comment_edited', lastActionDate: '2024-01-14 16:20:00' },
  { id: '14', date: '2023-12-15 10:45:00', repositoryOwner: 'tailwindlabs', repositoryName: 'tailwindcss', visibility: 'public', lastAction: 'issue_reopened', lastActionDate: '2024-01-14 14:10:00' },
  { id: '15', date: '2023-12-10 13:20:00', repositoryOwner: 'vitejs', repositoryName: 'vite', visibility: 'public', lastAction: 'pull_request_closed', lastActionDate: '2024-01-14 12:30:00' }
];

export function GStracciniPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'installations' | 'repositories'>('overview');

  const getEventColor = (event: string) => {
    switch (event) {
      case 'pull_request':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'issues':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'issue_comment':
      case 'pull_request_review_comment':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'push':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'pull_request_review':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'opened':
      case 'created':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'closed':
      case 'deleted':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'edited':
      case 'synchronize':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'labeled':
      case 'assigned':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'submitted':
      case 'review_requested':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    return visibility === 'public' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />;
  };

  const getVisibilityColor = (visibility: string) => {
    return visibility === 'public' 
      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      : 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
  };

  const getRepositorySelectionColor = (selection: string) => {
    return selection === 'all'
      ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      : 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="w-full px-6 py-8 flex-1">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GStraccini Bot</h1>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'feed'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4" />
                    <span>Feed</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('installations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'installations'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Installations</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('repositories')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'repositories'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4" />
                    <span>Repositories</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Processing Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pull Requests */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <GitPullRequest className="w-5 h-5 text-green-500" />
                      <span>Pull Requests Processed</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Hour</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.pullRequests.lastHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 6 Hours</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.pullRequests.last6Hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Day</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.pullRequests.lastDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.pullRequests.last7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.pullRequests.lastMonth}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">{mockProcessingStats.pullRequests.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-red-500" />
                      <span>Issues Processed</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Hour</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.issues.lastHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 6 Hours</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.issues.last6Hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Day</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.issues.lastDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.issues.last7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.issues.lastMonth}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-red-600 dark:text-red-400">{mockProcessingStats.issues.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span>Comments Processed</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Hour</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.comments.lastHour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 6 Hours</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.comments.last6Hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Day</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.comments.lastDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last 7 Days</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.comments.last7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{mockProcessingStats.comments.lastMonth}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{mockProcessingStats.comments.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Repositories</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{mockProcessingStats.totalRepositories}</p>
                    </div>
                    <Server className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Installations</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{mockProcessingStats.totalInstallations}</p>
                    </div>
                    <Package className="w-8 h-8 text-indigo-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Webhooks Processed</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{mockProcessingStats.totalWebhooksProcessed.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  <span>Webhook Events Feed</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockWebhookEvents.length} recent events)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Repository</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sender</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockWebhookEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventColor(event.event)}`}>
                            {event.event}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(event.action)}`}>
                            {event.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.repositoryOwner}/{event.repositoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">{event.sender}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Installations Tab */}
          {activeTab === 'installations' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  <span>Bot Installations</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockInstallations.length} installations)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Repository Selection</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Action Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Installation ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Users Associated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockInstallations.map((installation) => (
                      <tr key={installation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{installation.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRepositorySelectionColor(installation.repositorySelection)}`}>
                            {installation.repositorySelection.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {installation.lastAction.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{installation.lastActionDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm text-gray-900 dark:text-white">
                              {installation.installationId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm text-gray-900 dark:text-white">
                            {installation.clientId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {installation.usersAssociated.map((user, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                <Users className="w-3 h-3 mr-1" />
                                {user}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Installation Repositories Tab */}
          {activeTab === 'repositories' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Server className="w-5 h-5 text-green-500" />
                  <span>Installation Repositories</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockInstallationRepositories.length} repositories)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Repository</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Visibility</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Action Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockInstallationRepositories.map((repo) => (
                      <tr key={repo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{repo.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {repo.repositoryOwner}/{repo.repositoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getVisibilityColor(repo.visibility)}`}>
                            {getVisibilityIcon(repo.visibility)}
                            <span className="ml-1">{repo.visibility.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {repo.lastAction.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{repo.lastActionDate}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}