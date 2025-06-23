import React, { useState } from 'react';
import { ArrowLeft, Github, Activity, GitPullRequest, Bug, Clock, AlertTriangle, CheckCircle, XCircle, BarChart3, TrendingUp, User, Calendar, Tag, ExternalLink, GitBranch, Play, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';

interface APIUsageData {
  endpoint: string;
  requests: number;
  limit: number;
  resetTime: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface IssueData {
  type: 'awaiting-triage' | 'bug' | 'blocked' | 'general' | 'enhancement' | 'documentation';
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface PullRequestData {
  type: 'awaiting-triage' | 'blocked' | 'ready-for-review' | 'in-review' | 'approved' | 'draft';
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface GitHubItem {
  id: string;
  number: number;
  title: string;
  labels: string[];
  repository: string;
  sender: string;
  date: string;
  url: string;
}

interface WorkflowRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  action: string;
  status: 'completed' | 'in_progress' | 'queued' | 'cancelled';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  event: string;
  isPrivate: boolean;
  repository: string;
  actor: string;
  url: string;
}

interface Branch {
  id: string;
  updatedAt: string;
  repository: string;
  branchName: string;
  headBranch: string;
  sender: string;
  url: string;
}

interface CheckRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: 'completed' | 'in_progress' | 'queued' | 'pending';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | 'stale';
  headSha: string;
  repository: string;
  checkSuite: string;
  app: string;
  url: string;
}

const mockAPIUsage: APIUsageData[] = [
  {
    endpoint: 'Core API',
    requests: 4250,
    limit: 5000,
    resetTime: '2024-01-15 15:00:00',
    status: 'warning'
  },
  {
    endpoint: 'Search API',
    requests: 28,
    limit: 30,
    resetTime: '2024-01-15 15:00:00',
    status: 'critical'
  },
  {
    endpoint: 'GraphQL API',
    requests: 850,
    limit: 5000,
    resetTime: '2024-01-15 15:00:00',
    status: 'healthy'
  },
  {
    endpoint: 'REST API',
    requests: 3200,
    limit: 5000,
    resetTime: '2024-01-15 15:00:00',
    status: 'healthy'
  }
];

const mockIssuesData: IssueData[] = [
  { type: 'awaiting-triage', count: 23, trend: 'up', trendValue: 5 },
  { type: 'bug', count: 19, trend: 'down', trendValue: 3 },
  { type: 'blocked', count: 8, trend: 'stable', trendValue: 0 },
  { type: 'general', count: 45, trend: 'up', trendValue: 7 },
  { type: 'enhancement', count: 32, trend: 'up', trendValue: 4 },
  { type: 'documentation', count: 12, trend: 'down', trendValue: 2 }
];

const mockPullRequestsData: PullRequestData[] = [
  { type: 'awaiting-triage', count: 15, trend: 'up', trendValue: 3 },
  { type: 'blocked', count: 5, trend: 'stable', trendValue: 0 },
  { type: 'ready-for-review', count: 12, trend: 'up', trendValue: 2 },
  { type: 'in-review', count: 8, trend: 'down', trendValue: 1 },
  { type: 'approved', count: 6, trend: 'up', trendValue: 2 },
  { type: 'draft', count: 18, trend: 'up', trendValue: 4 }
];

// Mock data for GitHub items
const mockIssuesAssigned: GitHubItem[] = [
  { id: '1', number: 1234, title: 'Fix authentication bug in login flow', labels: ['bug', 'high-priority'], repository: 'projects-monitor', sender: 'john-doe', date: '2024-01-15', url: '#' },
  { id: '2', number: 1235, title: 'Add dark mode support to dashboard', labels: ['enhancement', 'ui'], repository: 'web-dashboard', sender: 'jane-smith', date: '2024-01-14', url: '#' },
  { id: '3', number: 1236, title: 'Update API documentation for v2.0', labels: ['documentation'], repository: 'api-docs', sender: 'mike-wilson', date: '2024-01-13', url: '#' }
];

const mockIssuesBlocked: GitHubItem[] = [
  { id: '4', number: 1237, title: 'Database migration script failing', labels: ['bug', 'blocked', 'database'], repository: 'backend-api', sender: 'sarah-jones', date: '2024-01-12', url: '#' },
  { id: '5', number: 1238, title: 'Integration tests not running in CI', labels: ['blocked', 'ci/cd'], repository: 'test-suite', sender: 'alex-brown', date: '2024-01-11', url: '#' }
];

const mockIssuesBug: GitHubItem[] = [
  { id: '6', number: 1239, title: 'Memory leak in webhook processor', labels: ['bug', 'critical'], repository: 'webhook-service', sender: 'tom-davis', date: '2024-01-15', url: '#' },
  { id: '7', number: 1240, title: 'Incorrect timezone handling in reports', labels: ['bug', 'reports'], repository: 'analytics', sender: 'lisa-garcia', date: '2024-01-14', url: '#' },
  { id: '8', number: 1241, title: 'Form validation not working on mobile', labels: ['bug', 'mobile', 'ui'], repository: 'mobile-app', sender: 'david-miller', date: '2024-01-13', url: '#' }
];

const mockIssuesAwaitingTriage: GitHubItem[] = [
  { id: '9', number: 1242, title: 'Feature request: Add export functionality', labels: ['triage'], repository: 'data-export', sender: 'emma-taylor', date: '2024-01-15', url: '#' },
  { id: '10', number: 1243, title: 'Performance issue with large datasets', labels: ['triage', 'performance'], repository: 'data-processor', sender: 'ryan-anderson', date: '2024-01-14', url: '#' },
  { id: '11', number: 1244, title: 'Add support for custom themes', labels: ['triage', 'enhancement'], repository: 'ui-components', sender: 'sophia-white', date: '2024-01-13', url: '#' }
];

const mockIssuesAuthored: GitHubItem[] = [
  { id: '12', number: 1245, title: 'Implement rate limiting for API endpoints', labels: ['enhancement', 'api'], repository: 'rate-limiter', sender: 'guibranco', date: '2024-01-15', url: '#' },
  { id: '13', number: 1246, title: 'Add monitoring dashboard for system health', labels: ['feature', 'monitoring'], repository: 'health-monitor', sender: 'guibranco', date: '2024-01-14', url: '#' },
  { id: '14', number: 1247, title: 'Refactor authentication middleware', labels: ['refactor', 'security'], repository: 'auth-service', sender: 'guibranco', date: '2024-01-13', url: '#' }
];

const mockIssuesWIP: GitHubItem[] = [
  { id: '15', number: 1248, title: 'WIP: Implement OAuth2 integration', labels: ['wip', 'oauth'], repository: 'oauth-service', sender: 'chris-johnson', date: '2024-01-15', url: '#' },
  { id: '16', number: 1249, title: 'WIP: Add real-time notifications', labels: ['wip', 'notifications'], repository: 'notification-service', sender: 'maria-rodriguez', date: '2024-01-14', url: '#' }
];

const mockPRsAssigned: GitHubItem[] = [
  { id: '17', number: 456, title: 'Fix: Resolve memory leak in data processing', labels: ['bug-fix'], repository: 'data-processor', sender: 'kevin-lee', date: '2024-01-15', url: '#' },
  { id: '18', number: 457, title: 'Feature: Add batch processing capabilities', labels: ['feature'], repository: 'batch-processor', sender: 'anna-clark', date: '2024-01-14', url: '#' }
];

const mockPRsAwaitingTriage: GitHubItem[] = [
  { id: '19', number: 458, title: 'Update dependencies to latest versions', labels: ['dependencies'], repository: 'core-lib', sender: 'james-wilson', date: '2024-01-15', url: '#' },
  { id: '20', number: 459, title: 'Add unit tests for user service', labels: ['tests'], repository: 'user-service', date: '2024-01-14', sender: 'rachel-moore', url: '#' },
  { id: '21', number: 460, title: 'Improve error handling in API gateway', labels: ['improvement'], repository: 'api-gateway', sender: 'daniel-taylor', date: '2024-01-13', url: '#' }
];

const mockPRsBlocked: GitHubItem[] = [
  { id: '22', number: 461, title: 'Database schema migration for v3.0', labels: ['blocked', 'database'], repository: 'schema-migration', sender: 'michelle-adams', date: '2024-01-12', url: '#' },
  { id: '23', number: 462, title: 'Security patch for authentication system', labels: ['blocked', 'security'], repository: 'auth-system', sender: 'robert-harris', date: '2024-01-11', url: '#' }
];

// Mock data for Workflow Runs
const mockWorkflowRuns: WorkflowRun[] = [
  {
    id: '1',
    createdAt: '2024-01-15 14:30:25',
    updatedAt: '2024-01-15 14:35:42',
    name: 'CI/CD Pipeline',
    action: 'Build and Test',
    status: 'completed',
    conclusion: 'success',
    event: 'push',
    isPrivate: false,
    repository: 'guibranco/projects-monitor',
    actor: 'guibranco',
    url: '#'
  },
  {
    id: '2',
    createdAt: '2024-01-15 14:25:10',
    updatedAt: '2024-01-15 14:25:10',
    name: 'Security Scan',
    action: 'CodeQL Analysis',
    status: 'in_progress',
    conclusion: 'neutral',
    event: 'pull_request',
    isPrivate: true,
    repository: 'guibranco/api-gateway',
    actor: 'dependabot[bot]',
    url: '#'
  },
  {
    id: '3',
    createdAt: '2024-01-15 14:20:45',
    updatedAt: '2024-01-15 14:22:15',
    name: 'Deploy to Production',
    action: 'Deploy Application',
    status: 'completed',
    conclusion: 'failure',
    event: 'workflow_dispatch',
    isPrivate: false,
    repository: 'guibranco/web-dashboard',
    actor: 'john-doe',
    url: '#'
  },
  {
    id: '4',
    createdAt: '2024-01-15 14:15:30',
    updatedAt: '2024-01-15 14:15:30',
    name: 'Nightly Build',
    action: 'Full Test Suite',
    status: 'queued',
    conclusion: 'neutral',
    event: 'schedule',
    isPrivate: false,
    repository: 'guibranco/backend-services',
    actor: 'github-actions[bot]',
    url: '#'
  },
  {
    id: '5',
    createdAt: '2024-01-15 14:10:15',
    updatedAt: '2024-01-15 14:18:30',
    name: 'Integration Tests',
    action: 'Run E2E Tests',
    status: 'completed',
    conclusion: 'timed_out',
    event: 'pull_request',
    isPrivate: true,
    repository: 'guibranco/mobile-app',
    actor: 'jane-smith',
    url: '#'
  },
  {
    id: '6',
    createdAt: '2024-01-15 14:05:00',
    updatedAt: '2024-01-15 14:05:45',
    name: 'Lint and Format',
    action: 'Code Quality Check',
    status: 'completed',
    conclusion: 'cancelled',
    event: 'push',
    isPrivate: false,
    repository: 'guibranco/utils-library',
    actor: 'mike-wilson',
    url: '#'
  },
  {
    id: '7',
    createdAt: '2024-01-15 14:00:20',
    updatedAt: '2024-01-15 14:03:45',
    name: 'Documentation Build',
    action: 'Generate Docs',
    status: 'completed',
    conclusion: 'skipped',
    event: 'push',
    isPrivate: false,
    repository: 'guibranco/docs-site',
    actor: 'sarah-jones',
    url: '#'
  },
  {
    id: '8',
    createdAt: '2024-01-15 13:55:10',
    updatedAt: '2024-01-15 13:58:25',
    name: 'Performance Tests',
    action: 'Load Testing',
    status: 'completed',
    conclusion: 'action_required',
    event: 'workflow_dispatch',
    isPrivate: true,
    repository: 'guibranco/performance-suite',
    actor: 'alex-brown',
    url: '#'
  }
];

// Mock data for Branches
const mockBranches: Branch[] = [
  {
    id: '1',
    updatedAt: '2024-01-15 14:30:25',
    repository: 'guibranco/projects-monitor',
    branchName: 'feature/dashboard-improvements',
    headBranch: 'main',
    sender: 'guibranco',
    url: '#'
  },
  {
    id: '2',
    updatedAt: '2024-01-15 14:25:10',
    repository: 'guibranco/api-gateway',
    branchName: 'fix/authentication-bug',
    headBranch: 'develop',
    sender: 'john-doe',
    url: '#'
  },
  {
    id: '3',
    updatedAt: '2024-01-15 14:20:45',
    repository: 'guibranco/web-dashboard',
    branchName: 'hotfix/security-patch',
    headBranch: 'main',
    sender: 'jane-smith',
    url: '#'
  },
  {
    id: '4',
    updatedAt: '2024-01-15 14:15:30',
    repository: 'guibranco/backend-services',
    branchName: 'refactor/database-layer',
    headBranch: 'develop',
    sender: 'mike-wilson',
    url: '#'
  },
  {
    id: '5',
    updatedAt: '2024-01-15 14:10:15',
    repository: 'guibranco/mobile-app',
    branchName: 'feature/push-notifications',
    headBranch: 'main',
    sender: 'sarah-jones',
    url: '#'
  },
  {
    id: '6',
    updatedAt: '2024-01-15 14:05:00',
    repository: 'guibranco/utils-library',
    branchName: 'test/unit-coverage',
    headBranch: 'develop',
    sender: 'alex-brown',
    url: '#'
  },
  {
    id: '7',
    updatedAt: '2024-01-15 14:00:20',
    repository: 'guibranco/docs-site',
    branchName: 'docs/api-reference',
    headBranch: 'main',
    sender: 'lisa-garcia',
    url: '#'
  },
  {
    id: '8',
    updatedAt: '2024-01-15 13:55:10',
    repository: 'guibranco/performance-suite',
    branchName: 'feature/load-testing',
    headBranch: 'develop',
    sender: 'tom-davis',
    url: '#'
  }
];

// Mock data for Check Runs
const mockCheckRuns: CheckRun[] = [
  {
    id: '1',
    createdAt: '2024-01-15 14:30:25',
    updatedAt: '2024-01-15 14:32:45',
    name: 'Build / build (push)',
    status: 'completed',
    conclusion: 'success',
    headSha: 'a1b2c3d4',
    repository: 'guibranco/projects-monitor',
    checkSuite: 'CI/CD Pipeline',
    app: 'GitHub Actions',
    url: '#'
  },
  {
    id: '2',
    createdAt: '2024-01-15 14:28:15',
    updatedAt: '2024-01-15 14:30:20',
    name: 'Test / unit-tests',
    status: 'completed',
    conclusion: 'failure',
    headSha: 'e5f6g7h8',
    repository: 'guibranco/api-gateway',
    checkSuite: 'CI/CD Pipeline',
    app: 'GitHub Actions',
    url: '#'
  },
  {
    id: '3',
    createdAt: '2024-01-15 14:25:10',
    updatedAt: '2024-01-15 14:25:10',
    name: 'CodeQL',
    status: 'in_progress',
    conclusion: 'neutral',
    headSha: 'i9j0k1l2',
    repository: 'guibranco/web-dashboard',
    checkSuite: 'Security Scan',
    app: 'CodeQL',
    url: '#'
  },
  {
    id: '4',
    createdAt: '2024-01-15 14:22:30',
    updatedAt: '2024-01-15 14:22:30',
    name: 'Lint / eslint',
    status: 'queued',
    conclusion: 'neutral',
    headSha: 'm3n4o5p6',
    repository: 'guibranco/backend-services',
    checkSuite: 'Code Quality',
    app: 'GitHub Actions',
    url: '#'
  },
  {
    id: '5',
    createdAt: '2024-01-15 14:20:45',
    updatedAt: '2024-01-15 14:23:15',
    name: 'Deploy / staging',
    status: 'completed',
    conclusion: 'timed_out',
    headSha: 'q7r8s9t0',
    repository: 'guibranco/mobile-app',
    checkSuite: 'Deployment',
    app: 'Vercel',
    url: '#'
  },
  {
    id: '6',
    createdAt: '2024-01-15 14:18:20',
    updatedAt: '2024-01-15 14:19:45',
    name: 'Security / dependency-check',
    status: 'completed',
    conclusion: 'action_required',
    headSha: 'u1v2w3x4',
    repository: 'guibranco/utils-library',
    checkSuite: 'Security Scan',
    app: 'Snyk',
    url: '#'
  },
  {
    id: '7',
    createdAt: '2024-01-15 14:15:30',
    updatedAt: '2024-01-15 14:16:20',
    name: 'Coverage / codecov',
    status: 'completed',
    conclusion: 'cancelled',
    headSha: 'y5z6a7b8',
    repository: 'guibranco/docs-site',
    checkSuite: 'Code Quality',
    app: 'Codecov',
    url: '#'
  },
  {
    id: '8',
    createdAt: '2024-01-15 14:12:15',
    updatedAt: '2024-01-15 14:14:30',
    name: 'Performance / lighthouse',
    status: 'completed',
    conclusion: 'skipped',
    headSha: 'c9d0e1f2',
    repository: 'guibranco/performance-suite',
    checkSuite: 'Performance Tests',
    app: 'Lighthouse CI',
    url: '#'
  },
  {
    id: '9',
    createdAt: '2024-01-15 14:10:00',
    updatedAt: '2024-01-15 14:11:45',
    name: 'Docker / build-image',
    status: 'completed',
    conclusion: 'stale',
    headSha: 'g3h4i5j6',
    repository: 'guibranco/container-registry',
    checkSuite: 'Container Build',
    app: 'Docker Hub',
    url: '#'
  },
  {
    id: '10',
    createdAt: '2024-01-15 14:08:30',
    updatedAt: '2024-01-15 14:08:30',
    name: 'Integration / e2e-tests',
    status: 'pending',
    conclusion: 'neutral',
    headSha: 'k7l8m9n0',
    repository: 'guibranco/integration-tests',
    checkSuite: 'Integration Tests',
    app: 'Cypress',
    url: '#'
  }
];

export function GitHubStatsPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'pull-requests' | 'workflow-runs' | 'branches' | 'check-runs'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />;
      case 'stable':
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatIssueType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getUsagePercentage = (requests: number, limit: number) => {
    return Math.round((requests / limit) * 100);
  };

  const getLabelColor = (label: string) => {
    const colors: { [key: string]: string } = {
      'bug': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'enhancement': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'documentation': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'blocked': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'wip': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'triage': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'high-priority': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'feature': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[label] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'queued':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getConclusionColor = (conclusion: string) => {
    switch (conclusion) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'failure':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'timed_out':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'neutral':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'skipped':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'action_required':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'stale':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const renderItemsTable = (items: GitHubItem[], title: string, icon: React.ElementType) => {
    const Icon = icon;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Icon className="w-5 h-5 text-blue-500" />
            <span>{title}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({items.length} items)
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title & Labels
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Repository
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      #{item.number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.labels.map((label, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getLabelColor(label)}`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {item.repository}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {item.sender}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={item.url}
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
                <Github className="w-6 h-6 text-gray-900 dark:text-white" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GitHub Analytics</h1>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'issues'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Bug className="w-4 h-4" />
                    <span>Issues</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('pull-requests')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'pull-requests'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GitPullRequest className="w-4 h-4" />
                    <span>Pull Requests</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('workflow-runs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'workflow-runs'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Workflow Runs</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('branches')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'branches'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GitBranch className="w-4 h-4" />
                    <span>Branches</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('check-runs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'check-runs'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Check Runs</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* API Usage Section */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <span>API Usage</span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {mockAPIUsage.map((api, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">{api.endpoint}</h3>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(api.status)}`}>
                              {getStatusIcon(api.status)}
                              <span className="ml-1">{api.status}</span>
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Usage</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {api.requests.toLocaleString()} / {api.limit.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  getUsagePercentage(api.requests, api.limit) > 90
                                    ? 'bg-red-500'
                                    : getUsagePercentage(api.requests, api.limit) > 75
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${getUsagePercentage(api.requests, api.limit)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Resets: {api.resetTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Bug className="w-5 h-5 text-red-500" />
                      <span>Issues by Type</span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockIssuesData.map((issue, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {issue.type === 'bug' && <Bug className="w-5 h-5 text-red-500" />}
                              {issue.type === 'blocked' && <XCircle className="w-5 h-5 text-red-500" />}
                              {issue.type === 'awaiting-triage' && <Clock className="w-5 h-5 text-yellow-500" />}
                              {issue.type === 'general' && <Activity className="w-5 h-5 text-blue-500" />}
                              {issue.type === 'enhancement' && <TrendingUp className="w-5 h-5 text-green-500" />}
                              {issue.type === 'documentation' && <BarChart3 className="w-5 h-5 text-purple-500" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatIssueType(issue.type)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {issue.count} issues
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(issue.trend)}
                            <span className={`text-sm font-medium ${
                              issue.trend === 'up' ? 'text-red-500' : 
                              issue.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                            }`}>
                              {issue.trend !== 'stable' && (issue.trend === 'up' ? '+' : '-')}{issue.trendValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pull Requests Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <GitPullRequest className="w-5 h-5 text-green-500" />
                      <span>Pull Requests by Type</span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {mockPullRequestsData.map((pr, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {pr.type === 'awaiting-triage' && <Clock className="w-5 h-5 text-yellow-500" />}
                              {pr.type === 'blocked' && <XCircle className="w-5 h-5 text-red-500" />}
                              {pr.type === 'ready-for-review' && <GitPullRequest className="w-5 h-5 text-blue-500" />}
                              {pr.type === 'in-review' && <Activity className="w-5 h-5 text-orange-500" />}
                              {pr.type === 'approved' && <CheckCircle className="w-5 h-5 text-green-500" />}
                              {pr.type === 'draft' && <BarChart3 className="w-5 h-5 text-gray-500" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatIssueType(pr.type)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {pr.count} PRs
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(pr.trend)}
                            <span className={`text-sm font-medium ${
                              pr.trend === 'up' ? 'text-red-500' : 
                              pr.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                            }`}>
                              {pr.trend !== 'stable' && (pr.trend === 'up' ? '+' : '-')}{pr.trendValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <span>Summary</span>
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {mockIssuesData.reduce((sum, issue) => sum + issue.count, 0)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Issues</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {mockPullRequestsData.reduce((sum, pr) => sum + pr.count, 0)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Pull Requests</div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {mockAPIUsage.reduce((sum, api) => sum + api.requests, 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">API Requests Today</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          Rate Limit Status
                        </div>
                        <div className="mt-2 space-y-1">
                          {mockAPIUsage.map((api, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{api.endpoint}</span>
                              <span className={`font-medium ${
                                getUsagePercentage(api.requests, api.limit) > 90 ? 'text-red-500' :
                                getUsagePercentage(api.requests, api.limit) > 75 ? 'text-yellow-500' : 'text-green-500'
                              }`}>
                                {getUsagePercentage(api.requests, api.limit)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <div className="space-y-6">
              {renderItemsTable(mockIssuesAssigned, 'Issues Assigned', User)}
              {renderItemsTable(mockIssuesBlocked, 'Issues Blocked', XCircle)}
              {renderItemsTable(mockIssuesBug, 'Bug Issues', Bug)}
              {renderItemsTable(mockIssuesAwaitingTriage, 'Issues Awaiting Triage', Clock)}
              {renderItemsTable(mockIssuesAuthored, 'Issues Authored', User)}
              {renderItemsTable(mockIssuesWIP, 'Issues WIP', Activity)}
            </div>
          )}

          {/* Pull Requests Tab */}
          {activeTab === 'pull-requests' && (
            <div className="space-y-6">
              {renderItemsTable(mockPRsAssigned, 'Pull Requests Assigned', User)}
              {renderItemsTable(mockPRsAwaitingTriage, 'Pull Requests Awaiting Triage', Clock)}
              {renderItemsTable(mockPRsBlocked, 'Pull Requests Blocked', XCircle)}
            </div>
          )}

          {/* Workflow Runs Tab */}
          {activeTab === 'workflow-runs' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Play className="w-5 h-5 text-blue-500" />
                  <span>Workflow Runs</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockWorkflowRuns.length} runs)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Conclusion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Repository
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockWorkflowRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{run.createdAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{run.updatedAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {run.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {run.action}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkflowStatusColor(run.status)}`}>
                            {run.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConclusionColor(run.conclusion)}`}>
                            {run.conclusion.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {run.event.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {run.isPrivate ? (
                              <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                                <XCircle className="w-4 h-4" />
                                <span>Private</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>Public</span>
                              </div>
                            )}
                            <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {run.repository}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {run.actor}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={run.url}
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Branches Tab */}
          {activeTab === 'branches' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-blue-500" />
                  <span>Branches</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockBranches.length} branches)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Repository Owner/Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Branch (ref) Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Head Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockBranches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{branch.updatedAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {branch.repository}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                              {branch.branchName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-mono text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                              {branch.headBranch}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              {branch.sender}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={branch.url}
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Check Runs Tab */}
          {activeTab === 'check-runs' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Check Runs</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockCheckRuns.length} checks)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Conclusion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Head SHA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Repository
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Check Suite
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        App
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockCheckRuns.map((check) => (
                      <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{check.createdAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{check.updatedAt}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {check.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkflowStatusColor(check.status)}`}>
                            {check.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConclusionColor(check.conclusion)}`}>
                            {check.conclusion.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {check.headSha}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {check.repository}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {check.checkSuite}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                            {check.app}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={check.url}
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
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
