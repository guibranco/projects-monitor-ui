import React, { useState } from 'react';
import { ArrowLeft, Activity, Shield, Heart, Globe, Clock, Server, Zap, Calendar, CheckCircle, XCircle, AlertTriangle, ExternalLink, Hash, Terminal, GitBranch, Package, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';
import { GaugeChart } from '../dashboard/GaugeChart';

interface WireGuardConnection {
  id: string;
  peer: string;
  status: 'connected' | 'disconnected' | 'handshake_failed';
  lastHandshake: string;
  received: string;
  sent: string;
}

interface HealthCheck {
  id: string;
  checkName: string;
  status: 'up' | 'down' | 'grace' | 'paused';
  lastPing: string;
  nextPing: string;
  tags: string[];
}

interface UptimeMonitor {
  id: string;
  monitorName: string;
  status: 'up' | 'down' | 'seems_down' | 'paused';
  lastChange: string;
  details: string;
  uptime: number;
}

interface Domain {
  id: string;
  domainName: string;
  createdDate: string;
  daysSinceCreated: number;
  expireDate: string;
  daysUntilExpire: number;
  status: 'active' | 'expired' | 'pending_renewal' | 'suspended';
  nameservers: string[];
}

interface CronJob {
  id: string;
  expression: string;
  command: string;
  description: string;
  lastRun: string;
  nextRun: string;
  status: 'active' | 'disabled' | 'failed';
}

interface AppVeyorBuild {
  id: string;
  project: string;
  status: 'success' | 'failed' | 'running' | 'cancelled' | 'queued';
  branch: string;
  version: string;
  date: string;
  duration: string;
}

interface QueueData {
  id: string;
  serverName: string;
  queueName: string;
  queueLength: number;
  activeConsumers: number;
  status: 'healthy' | 'warning' | 'critical';
}

// Mock data
const mockWireGuardConnections: WireGuardConnection[] = [
  { id: '1', peer: 'mobile-device-01', status: 'connected', lastHandshake: '2024-01-15 14:28:45', received: '2.4 GB', sent: '856 MB' },
  { id: '2', peer: 'laptop-work', status: 'connected', lastHandshake: '2024-01-15 14:30:12', received: '1.8 GB', sent: '1.2 GB' },
  { id: '3', peer: 'server-backup', status: 'disconnected', lastHandshake: '2024-01-15 12:15:30', received: '45 MB', sent: '23 MB' },
  { id: '4', peer: 'home-router', status: 'connected', lastHandshake: '2024-01-15 14:29:58', received: '3.2 GB', sent: '2.1 GB' },
  { id: '5', peer: 'mobile-device-02', status: 'handshake_failed', lastHandshake: '2024-01-15 13:45:22', received: '156 MB', sent: '89 MB' }
];

const mockHealthChecks: HealthCheck[] = [
  { id: '1', checkName: 'API Health Check', status: 'up', lastPing: '2024-01-15 14:30:00', nextPing: '2024-01-15 14:35:00', tags: ['api', 'critical'] },
  { id: '2', checkName: 'Database Backup', status: 'up', lastPing: '2024-01-15 14:25:00', nextPing: '2024-01-15 15:25:00', tags: ['database', 'backup'] },
  { id: '3', checkName: 'SSL Certificate Check', status: 'grace', lastPing: '2024-01-15 14:20:00', nextPing: '2024-01-15 14:50:00', tags: ['ssl', 'security'] },
  { id: '4', checkName: 'Log Rotation', status: 'up', lastPing: '2024-01-15 14:15:00', nextPing: '2024-01-16 02:15:00', tags: ['maintenance'] },
  { id: '5', checkName: 'Webhook Processor', status: 'down', lastPing: '2024-01-15 14:10:00', nextPing: '2024-01-15 14:40:00', tags: ['webhook', 'critical'] },
  { id: '6', checkName: 'Email Service', status: 'paused', lastPing: '2024-01-15 13:30:00', nextPing: '2024-01-15 15:30:00', tags: ['email', 'notifications'] }
];

const mockUptimeMonitors: UptimeMonitor[] = [
  { id: '1', monitorName: 'Main Website', status: 'up', lastChange: '2024-01-10 08:30:00', details: 'HTTP 200 - Response time: 245ms', uptime: 99.98 },
  { id: '2', monitorName: 'API Endpoint', status: 'up', lastChange: '2024-01-12 14:15:00', details: 'HTTP 200 - Response time: 156ms', uptime: 99.95 },
  { id: '3', monitorName: 'Admin Dashboard', status: 'seems_down', lastChange: '2024-01-15 14:20:00', details: 'HTTP 503 - Service Unavailable', uptime: 98.45 },
  { id: '4', monitorName: 'CDN Endpoint', status: 'up', lastChange: '2024-01-08 12:00:00', details: 'HTTP 200 - Response time: 89ms', uptime: 99.99 },
  { id: '5', monitorName: 'Database Server', status: 'down', lastChange: '2024-01-15 13:45:00', details: 'Connection timeout after 30s', uptime: 97.23 },
  { id: '6', monitorName: 'File Storage', status: 'paused', lastChange: '2024-01-15 10:00:00', details: 'Monitoring paused for maintenance', uptime: 99.87 }
];

const mockDomains: Domain[] = [
  { id: '1', domainName: 'example.com', createdDate: '2020-03-15', daysSinceCreated: 1402, expireDate: '2025-03-15', daysUntilExpire: 59, status: 'active', nameservers: ['ns1.cloudflare.com', 'ns2.cloudflare.com'] },
  { id: '2', domainName: 'api.example.com', createdDate: '2021-06-20', daysSinceCreated: 939, expireDate: '2024-06-20', daysUntilExpire: -209, status: 'expired', nameservers: ['ns1.example.com', 'ns2.example.com'] },
  { id: '3', domainName: 'staging.example.com', createdDate: '2022-01-10', daysSinceCreated: 735, expireDate: '2025-01-10', daysUntilExpire: 25, status: 'pending_renewal', nameservers: ['ns1.digitalocean.com', 'ns2.digitalocean.com'] },
  { id: '4', domainName: 'blog.example.com', createdDate: '2019-11-05', daysSinceCreated: 1532, expireDate: '2024-11-05', daysUntilExpire: -71, status: 'suspended', nameservers: ['ns1.suspended.com', 'ns2.suspended.com'] },
  { id: '5', domainName: 'shop.example.com', createdDate: '2023-08-12', daysSinceCreated: 156, expireDate: '2026-08-12', daysUntilExpire: 574, status: 'active', nameservers: ['ns1.shopify.com', 'ns2.shopify.com'] }
];

const mockCronJobs: CronJob[] = [
  { id: '1', expression: '0 2 * * *', command: '/usr/bin/backup-database.sh', description: 'Daily database backup', lastRun: '2024-01-15 02:00:00', nextRun: '2024-01-16 02:00:00', status: 'active' },
  { id: '2', expression: '*/15 * * * *', command: '/usr/bin/check-services.sh', description: 'Service health check', lastRun: '2024-01-15 14:30:00', nextRun: '2024-01-15 14:45:00', status: 'active' },
  { id: '3', expression: '0 0 1 * *', command: '/usr/bin/cleanup-logs.sh', description: 'Monthly log cleanup', lastRun: '2024-01-01 00:00:00', nextRun: '2024-02-01 00:00:00', status: 'active' },
  { id: '4', expression: '30 1 * * 0', command: '/usr/bin/update-ssl-certs.sh', description: 'Weekly SSL certificate update', lastRun: '2024-01-14 01:30:00', nextRun: '2024-01-21 01:30:00', status: 'failed' },
  { id: '5', expression: '0 */6 * * *', command: '/usr/bin/sync-data.sh', description: 'Data synchronization', lastRun: '2024-01-15 12:00:00', nextRun: '2024-01-15 18:00:00', status: 'disabled' },
  { id: '6', expression: '45 23 * * *', command: '/usr/bin/generate-reports.sh', description: 'Daily report generation', lastRun: '2024-01-14 23:45:00', nextRun: '2024-01-15 23:45:00', status: 'active' }
];

const mockAppVeyorBuilds: AppVeyorBuild[] = [
  { id: '1', project: 'projects-monitor', status: 'success', branch: 'main', version: '1.2.3', date: '2024-01-15 14:25:00', duration: '3m 45s' },
  { id: '2', project: 'api-gateway', status: 'failed', branch: 'feature/auth-fix', version: '2.1.0-beta', date: '2024-01-15 14:20:00', duration: '2m 12s' },
  { id: '3', project: 'web-dashboard', status: 'running', branch: 'develop', version: '1.5.2', date: '2024-01-15 14:30:00', duration: '1m 23s' },
  { id: '4', project: 'webhook-service', status: 'success', branch: 'main', version: '3.0.1', date: '2024-01-15 14:15:00', duration: '4m 56s' },
  { id: '5', project: 'data-processor', status: 'cancelled', branch: 'hotfix/memory-leak', version: '1.8.4', date: '2024-01-15 14:10:00', duration: '45s' },
  { id: '6', project: 'notification-service', status: 'queued', branch: 'main', version: '2.3.1', date: '2024-01-15 14:35:00', duration: '-' }
];

const mockQueueData: QueueData[] = [
  {
    id: '1',
    serverName: 'rabbitmq-prod-01',
    queueName: 'webhook.processing',
    queueLength: 45,
    activeConsumers: 3,
    status: 'healthy'
  },
  {
    id: '2',
    serverName: 'rabbitmq-prod-01',
    queueName: 'email.notifications',
    queueLength: 156,
    activeConsumers: 2,
    status: 'warning'
  },
  {
    id: '3',
    serverName: 'rabbitmq-prod-01',
    queueName: 'github.events',
    queueLength: 892,
    activeConsumers: 0,
    status: 'critical'
  },
  {
    id: '4',
    serverName: 'rabbitmq-prod-02',
    queueName: 'data.processing',
    queueLength: 23,
    activeConsumers: 5,
    status: 'healthy'
  },
  {
    id: '5',
    serverName: 'rabbitmq-prod-02',
    queueName: 'report.generation',
    queueLength: 8,
    activeConsumers: 1,
    status: 'healthy'
  },
  {
    id: '6',
    serverName: 'lavinmq-dev-01',
    queueName: 'test.queue',
    queueLength: 0,
    activeConsumers: 2,
    status: 'healthy'
  },
  {
    id: '7',
    serverName: 'lavinmq-dev-01',
    queueName: 'debug.logs',
    queueLength: 234,
    activeConsumers: 1,
    status: 'warning'
  },
  {
    id: '8',
    serverName: 'rabbitmq-staging',
    queueName: 'integration.tests',
    queueLength: 12,
    activeConsumers: 3,
    status: 'healthy'
  }
];

export function OpsOverviewPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'wireguard' | 'healthchecks' | 'uptime' | 'domains' | 'cronjobs' | 'appveyor' | 'queues'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
      case 'connected':
      case 'active':
      case 'success':
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'down':
      case 'disconnected':
      case 'failed':
      case 'expired':
      case 'suspended':
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'grace':
      case 'seems_down':
      case 'pending_renewal':
      case 'running':
      case 'handshake_failed':
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'paused':
      case 'disabled':
      case 'cancelled':
      case 'queued':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
      case 'connected':
      case 'active':
      case 'success':
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'down':
      case 'disconnected':
      case 'failed':
      case 'expired':
      case 'suspended':
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'grace':
      case 'seems_down':
      case 'pending_renewal':
      case 'running':
      case 'handshake_failed':
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getDomainExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-600 dark:text-red-400';
    if (days < 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getLabelColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'api': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'database': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'backup': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'ssl': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'maintenance': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'webhook': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'email': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      'notifications': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getQueueLengthColor = (length: number) => {
    if (length > 500) return 'text-red-600 dark:text-red-400';
    if (length > 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getConsumerColor = (consumers: number) => {
    if (consumers === 0) return 'text-red-600 dark:text-red-400';
    if (consumers < 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  // Calculate overview metrics
  const wireGuardConnected = mockWireGuardConnections.filter(conn => conn.status === 'connected').length;
  const healthChecksUp = mockHealthChecks.filter(check => check.status === 'up').length;
  const uptimeMonitorsUp = mockUptimeMonitors.filter(monitor => monitor.status === 'up').length;
  const domainsActive = mockDomains.filter(domain => domain.status === 'active').length;
  const cronJobsActive = mockCronJobs.filter(job => job.status === 'active').length;
  const appVeyorSuccess = mockAppVeyorBuilds.filter(build => build.status === 'success').length;
  const queuesHealthy = mockQueueData.filter(queue => queue.status === 'healthy').length;

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
                <Server className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ops Overview</h1>
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
                    <Activity className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('wireguard')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'wireguard'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>WireGuard</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('healthchecks')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'healthchecks'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>HealthChecks.io</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('uptime')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'uptime'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>UptimeRobot</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('domains')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'domains'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Domains</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('cronjobs')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'cronjobs'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Cron Jobs</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('appveyor')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'appveyor'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>AppVeyor</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('queues')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === 'queues'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Message Queues</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Gauge Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GaugeChart 
                  value={Math.round((wireGuardConnected / mockWireGuardConnections.length) * 100)} 
                  label="WireGuard Connections" 
                  icon={Shield} 
                />
                <GaugeChart 
                  value={Math.round((healthChecksUp / mockHealthChecks.length) * 100)} 
                  label="Health Checks" 
                  icon={Heart} 
                />
                <GaugeChart 
                  value={Math.round((uptimeMonitorsUp / mockUptimeMonitors.length) * 100)} 
                  label="Uptime Monitors" 
                  icon={Zap} 
                />
                <GaugeChart 
                  value={Math.round((domainsActive / mockDomains.length) * 100)} 
                  label="Active Domains" 
                  icon={Globe} 
                />
                <GaugeChart 
                  value={Math.round((cronJobsActive / mockCronJobs.length) * 100)} 
                  label="Active Cron Jobs" 
                  icon={Clock} 
                />
                <GaugeChart 
                  value={Math.round((appVeyorSuccess / mockAppVeyorBuilds.length) * 100)} 
                  label="Successful Builds" 
                  icon={Package} 
                />
                <GaugeChart 
                  value={Math.round((queuesHealthy / mockQueueData.length) * 100)} 
                  label="Healthy Queues" 
                  icon={Activity} 
                />
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">98.5%</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {wireGuardConnected + healthChecksUp + uptimeMonitorsUp + domainsActive + cronJobsActive + queuesHealthy}
                      </p>
                    </div>
                    <Server className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">3</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WireGuard Tab */}
          {activeTab === 'wireguard' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>WireGuard Connections</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockWireGuardConnections.length} peers)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Handshake</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Received</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockWireGuardConnections.map((connection) => (
                      <tr key={connection.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{connection.peer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(connection.status)}`}>
                            {getStatusIcon(connection.status)}
                            <span className="ml-1">{connection.status.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{connection.lastHandshake}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{connection.received}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{connection.sent}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HealthChecks Tab */}
          {activeTab === 'healthchecks' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>HealthChecks.io</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockHealthChecks.length} checks)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Check Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Ping</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Ping</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockHealthChecks.map((check) => (
                      <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{check.checkName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(check.status)}`}>
                            {getStatusIcon(check.status)}
                            <span className="ml-1">{check.status.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{check.lastPing}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{check.nextPing}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {check.tags.map((tag, index) => (
                              <span key={index} className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLabelColor(tag)}`}>
                                {tag}
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

          {/* UptimeRobot Tab */}
          {activeTab === 'uptime' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>UptimeRobot Monitors</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockUptimeMonitors.length} monitors)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monitor Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uptime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockUptimeMonitors.map((monitor) => (
                      <tr key={monitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{monitor.monitorName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(monitor.status)}`}>
                            {getStatusIcon(monitor.status)}
                            <span className="ml-1">{monitor.status.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{monitor.uptime}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{monitor.lastChange}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={monitor.details}>
                            {monitor.details}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Domains Tab */}
          {activeTab === 'domains' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  <span>Domain Management</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockDomains.length} domains)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Domain Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expires</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nameservers</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockDomains.map((domain) => (
                      <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{domain.domainName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div>{domain.createdDate}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {domain.daysSinceCreated} days ago
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div>{domain.expireDate}</div>
                            <div className={`text-xs font-medium ${getDomainExpiryColor(domain.daysUntilExpire)}`}>
                              {domain.daysUntilExpire < 0 ? 'Expired' : `${domain.daysUntilExpire} days left`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(domain.status)}`}>
                            {getStatusIcon(domain.status)}
                            <span className="ml-1">{domain.status.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {domain.nameservers.map((ns, index) => (
                              <div key={index} className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm mb-1">
                                {ns}
                              </div>
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

          {/* Cron Jobs Tab */}
          {activeTab === 'cronjobs' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span>Cron Jobs</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockCronJobs.length} jobs)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expression</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Command</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Run</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next Run</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockCronJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm text-gray-900 dark:text-white">
                              {job.expression}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Terminal className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm text-gray-900 dark:text-white max-w-xs truncate" title={job.command}>
                              {job.command}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{job.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{job.lastRun}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{job.nextRun}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span className="ml-1">{job.status.toUpperCase()}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AppVeyor Tab */}
          {activeTab === 'appveyor' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  <span>AppVeyor Builds</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockAppVeyorBuilds.length} builds)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Version</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockAppVeyorBuilds.map((build) => (
                      <tr key={build.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{build.project}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(build.status)}`}>
                            {getStatusIcon(build.status)}
                            <span className="ml-1">{build.status.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm text-gray-900 dark:text-white">
                              {build.branch}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{build.version}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{build.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{build.duration}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message Queues Tab */}
          {activeTab === 'queues' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span>Message Queues</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({mockQueueData.length} queues)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Server Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Queue Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Queue Length
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Active Consumers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {mockQueueData.map((queue) => (
                      <tr key={queue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Server className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-sm">
                              {queue.serverName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {queue.queueName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-bold ${getQueueLengthColor(queue.queueLength)}`}>
                              {queue.queueLength.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">messages</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-bold ${getConsumerColor(queue.activeConsumers)}`}>
                              {queue.activeConsumers}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {queue.activeConsumers === 1 ? 'consumer' : 'consumers'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(queue.status)}`}>
                            {queue.status.toUpperCase()}
                          </span>
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