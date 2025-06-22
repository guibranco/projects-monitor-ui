import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, FileText, Folder, Calendar, Clock, HardDrive, MapPin, Hash, Trash2, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';

interface LoggerError {
  id: string;
  application: string;
  message: string;
  level: 'error' | 'warning' | 'critical';
  timestamp: string;
  count: number;
}

interface CpanelError {
  id: string;
  directory: string;
  filename: string;
  filesize: string;
  lastModified: string;
  errorCount: number;
}

interface CpanelErrorDetail {
  id: string;
  date: string;
  directory: string;
  errorMessage: string;
  errorFile: string;
  errorLine: number;
  severity: 'error' | 'warning' | 'fatal' | 'notice';
}

const mockLoggerErrors: LoggerError[] = [
  {
    id: '1',
    application: 'API Gateway',
    message: 'Database connection timeout',
    level: 'critical',
    timestamp: '2024-01-15 14:30:25',
    count: 15
  },
  {
    id: '2',
    application: 'API Gateway',
    message: 'Invalid authentication token',
    level: 'error',
    timestamp: '2024-01-15 14:25:10',
    count: 8
  },
  {
    id: '3',
    application: 'Web Dashboard',
    message: 'Failed to load user preferences',
    level: 'warning',
    timestamp: '2024-01-15 14:20:45',
    count: 3
  },
  {
    id: '4',
    application: 'Web Dashboard',
    message: 'Session expired unexpectedly',
    level: 'error',
    timestamp: '2024-01-15 14:15:30',
    count: 12
  },
  {
    id: '5',
    application: 'Background Worker',
    message: 'Queue processing failed',
    level: 'critical',
    timestamp: '2024-01-15 14:10:15',
    count: 7
  },
  {
    id: '6',
    application: 'Background Worker',
    message: 'Memory limit exceeded',
    level: 'warning',
    timestamp: '2024-01-15 14:05:00',
    count: 4
  }
];

const mockCpanelErrors: CpanelError[] = [
  {
    id: '1',
    directory: '/public_html/api',
    filename: 'error_log',
    filesize: '2.4 MB',
    lastModified: '2024-01-15 14:30:00',
    errorCount: 156
  },
  {
    id: '2',
    directory: '/public_html/dashboard',
    filename: 'error_log',
    filesize: '1.8 MB',
    lastModified: '2024-01-15 14:25:00',
    errorCount: 89
  },
  {
    id: '3',
    directory: '/public_html/webhooks',
    filename: 'error_log',
    filesize: '3.1 MB',
    lastModified: '2024-01-15 14:20:00',
    errorCount: 234
  },
  {
    id: '4',
    directory: '/public_html/admin',
    filename: 'error_log',
    filesize: '856 KB',
    lastModified: '2024-01-15 14:15:00',
    errorCount: 45
  },
  {
    id: '5',
    directory: '/public_html/cron',
    filename: 'error_log',
    filesize: '1.2 MB',
    lastModified: '2024-01-15 14:10:00',
    errorCount: 67
  }
];

const mockCpanelErrorDetails: CpanelErrorDetail[] = [
  {
    id: '1',
    date: '2024-01-15 14:30:25',
    directory: '/public_html/api',
    errorMessage: 'PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused',
    errorFile: '/public_html/api/database/Connection.php',
    errorLine: 45,
    severity: 'fatal'
  },
  {
    id: '2',
    date: '2024-01-15 14:28:15',
    directory: '/public_html/api',
    errorMessage: 'PHP Warning: file_get_contents(): SSL operation failed with code 1',
    errorFile: '/public_html/api/services/HttpClient.php',
    errorLine: 128,
    severity: 'warning'
  },
  {
    id: '3',
    date: '2024-01-15 14:25:45',
    directory: '/public_html/dashboard',
    errorMessage: 'PHP Notice: Undefined index: user_id in session data',
    errorFile: '/public_html/dashboard/auth/SessionManager.php',
    errorLine: 67,
    severity: 'notice'
  },
  {
    id: '4',
    date: '2024-01-15 14:23:30',
    directory: '/public_html/webhooks',
    errorMessage: 'PHP Fatal error: Maximum execution time of 30 seconds exceeded',
    errorFile: '/public_html/webhooks/processors/GitHubProcessor.php',
    errorLine: 234,
    severity: 'fatal'
  },
  {
    id: '5',
    date: '2024-01-15 14:20:12',
    directory: '/public_html/api',
    errorMessage: 'PHP Error: Call to undefined method User::getPermissions()',
    errorFile: '/public_html/api/controllers/UserController.php',
    errorLine: 89,
    severity: 'error'
  },
  {
    id: '6',
    date: '2024-01-15 14:18:45',
    directory: '/public_html/dashboard',
    errorMessage: 'PHP Warning: Invalid argument supplied for foreach() loop',
    errorFile: '/public_html/dashboard/components/DataTable.php',
    errorLine: 156,
    severity: 'warning'
  },
  {
    id: '7',
    date: '2024-01-15 14:15:20',
    directory: '/public_html/webhooks',
    errorMessage: 'PHP Fatal error: Allowed memory size of 134217728 bytes exhausted',
    errorFile: '/public_html/webhooks/handlers/PayloadProcessor.php',
    errorLine: 445,
    severity: 'fatal'
  },
  {
    id: '8',
    date: '2024-01-15 14:12:35',
    directory: '/public_html/admin',
    errorMessage: 'PHP Notice: Trying to get property of non-object',
    errorFile: '/public_html/admin/models/ConfigModel.php',
    errorLine: 78,
    severity: 'notice'
  },
  {
    id: '9',
    date: '2024-01-15 14:10:50',
    directory: '/public_html/cron',
    errorMessage: 'PHP Error: Division by zero in calculation',
    errorFile: '/public_html/cron/jobs/StatisticsCalculator.php',
    errorLine: 123,
    severity: 'error'
  },
  {
    id: '10',
    date: '2024-01-15 14:08:15',
    directory: '/public_html/api',
    errorMessage: 'PHP Warning: Cannot modify header information - headers already sent',
    errorFile: '/public_html/api/middleware/CorsMiddleware.php',
    errorLine: 34,
    severity: 'warning'
  },
  {
    id: '11',
    date: '2024-01-15 14:05:40',
    directory: '/public_html/dashboard',
    errorMessage: 'PHP Fatal error: Class \'DatabaseConnection\' not found',
    errorFile: '/public_html/dashboard/services/DataService.php',
    errorLine: 12,
    severity: 'fatal'
  },
  {
    id: '12',
    date: '2024-01-15 14:03:25',
    directory: '/public_html/webhooks',
    errorMessage: 'PHP Notice: Array to string conversion',
    errorFile: '/public_html/webhooks/utils/Logger.php',
    errorLine: 89,
    severity: 'notice'
  }
];

export function ErrorsPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'logger' | 'cpanel' | 'cpanel-details'>('logger');
  const [cpanelFiles, setCpanelFiles] = useState(mockCpanelErrors);
  const [cpanelErrorDetails, setCpanelErrorDetails] = useState(mockCpanelErrorDetails);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
      case 'fatal':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'error':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'notice':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const groupLoggerErrors = () => {
    const grouped: { [key: string]: LoggerError[] } = {};
    mockLoggerErrors.forEach(error => {
      if (!grouped[error.application]) {
        grouped[error.application] = [];
      }
      grouped[error.application].push(error);
    });
    return grouped;
  };

  const groupCpanelErrorDetails = () => {
    const grouped: { [key: string]: CpanelErrorDetail[] } = {};
    cpanelErrorDetails.forEach(error => {
      if (!grouped[error.directory]) {
        grouped[error.directory] = [];
      }
      grouped[error.directory].push(error);
    });
    return grouped;
  };

  const handleDeleteFile = (fileId: string) => {
    setCpanelFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleEmptyTrash = () => {
    setCpanelFiles([]);
  };

  const handleDeleteDirectoryErrors = (directory: string) => {
    setCpanelErrorDetails(prev => prev.filter(error => error.directory !== directory));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="w-full px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
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
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error Logs</h1>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('logger')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'logger'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Logger Errors</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('cpanel')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'cpanel'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-4 h-4" />
                    <span>CPanel Files</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('cpanel-details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'cpanel-details'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>CPanel Error Details</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Logger Errors Tab */}
          {activeTab === 'logger' && (
            <div className="space-y-6">
              {Object.entries(groupLoggerErrors()).map(([application, errors]) => (
                <div key={application} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>{application}</span>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({errors.length} errors)
                      </span>
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Count
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Last Occurrence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {errors.map((error) => (
                          <tr key={error.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(error.level)}`}>
                                {error.level.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white font-medium">
                                {error.message}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white font-semibold">
                                {error.count}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{error.timestamp}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CPanel Files Tab */}
          {activeTab === 'cpanel' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Folder className="w-5 h-5 text-blue-500" />
                      <span>CPanel Error Log Files</span>
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({cpanelFiles.length} files)
                      </span>
                    </h3>
                    {cpanelFiles.length > 0 && (
                      <button
                        onClick={handleEmptyTrash}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                        <span>Empty All</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Directory
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Filename
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          File Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Error Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {cpanelFiles.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <Folder className="w-12 h-12 text-gray-400" />
                              <p className="text-gray-500 dark:text-gray-400">No error log files found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        cpanelFiles.map((error) => (
                          <tr key={error.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Folder className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {error.directory}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {error.filename}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                                <HardDrive className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold">{error.filesize}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                {error.errorCount} errors
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>{error.lastModified}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteFile(error.id)}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CPanel Error Details Tab */}
          {activeTab === 'cpanel-details' && (
            <div className="space-y-6">
              {Object.entries(groupCpanelErrorDetails()).map(([directory, errors]) => (
                <div key={directory} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <Folder className="w-5 h-5 text-blue-500" />
                        <span>{directory}</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          ({errors.length} detailed errors)
                        </span>
                      </h3>
                      <button
                        onClick={() => handleDeleteDirectoryErrors(directory)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete File</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Error Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Error File
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Line
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {errors.map((error) => (
                          <tr key={error.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>{error.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 max-w-md">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <div className="truncate" title={error.errorMessage}>
                                  {error.errorMessage}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded max-w-xs truncate" title={error.errorFile}>
                                  {error.errorFile.split('/').pop()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold">{error.errorLine}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}