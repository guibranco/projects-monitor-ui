import React, { useState, useEffect } from 'react';
import { Activity, User, Bot, Clock, TrendingUp, RefreshCw } from 'lucide-react';

interface WebhookStats {
  EventCount: number;
  FirstActivity: string;
  LastActivity: string;
  EventsPerMinute: number;
  FrequencyMultiplier: number;
  TimeSpanMinutes: number;
}

interface WebhooksStatsData {
  [key: string]: WebhookStats;
}

/**
 * A React component that displays statistics about webhooks, including event counts, user activity levels, and more.
 *
 * The component fetches webhook data from an API and updates it periodically based on auto-refresh settings.
 * It calculates various totals such as total events, users, bots, and human users. The component also includes
 * a countdown timer for automatic refresh and error handling mechanisms for failed fetch attempts.
 *
 * Key features:
 * - Fetches webhook statistics from an external API.
 * - Displays total event count, user counts (total, bots, human), and individual user statistics.
 * - Provides auto-refresh functionality with a countdown timer.
 * - Includes error handling for data fetching failures.
 * - Uses conditional rendering to display different UI states based on loading status and errors.
 *
 * The component uses React hooks such as useState and useEffect to manage state and side effects.
 */
export function WebhooksStats() {
  const [webhooksData, setWebhooksData] = useState<WebhooksStatsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(true);

  /**
   * Fetches webhook statistics from the specified endpoint and updates the component's state with the data.
   *
   * This function performs an asynchronous HTTP GET request to retrieve webhooks statistics.
   * It sets the loading state to true before making the request and updates the error state if the request fails.
   * Upon successful retrieval, it parses the JSON response and updates the webhooks data and last updated time in the component's state.
   * If any errors occur during the fetch operation, it catches them, sets an appropriate error message, logs the error to the console,
   * and ensures that the loading state is set back to false in the `finally` block.
   */
  const fetchWebhooksStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://webhooks.straccini.com/Stats');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWebhooksData(data);
      setLastUpdated(new Date());
      setCountdown(60); // Reset countdown after successful fetch
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch webhooks stats');
      console.error('Error fetching webhooks stats:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches webhooks statistics manually.
   */
  const handleManualRefresh = () => {
    fetchWebhooksStats();
  };

  useEffect(() => {
    fetchWebhooksStats();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isAutoRefreshing) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchWebhooksStats();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRefreshing]);

  /**
   * Formats a date string to a locale-specific string representation.
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  /**
   * Formats a given number of minutes into a human-readable duration string.
   * The function converts minutes into hours, days, and remaining minutes,
   * and formats them accordingly. If the total hours exceed 24, it includes
   * the number of days and remaining hours in the output.
   *
   * @param {number} minutes - The total number of minutes to format.
   * @returns {string} A formatted duration string in the format 'Xd Yh Zm'.
   */
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  /**
   * Determines the type of user based on username.
   */
  const getUserType = (username: string) => {
    if (username.includes('[bot]')) {
      return 'bot';
    }
    return 'user';
  };

  /**
   * Determines and returns the appropriate icon component based on user type.
   */
  const getUserIcon = (username: string) => {
    return getUserType(username) === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  /**
   * Determines the activity level based on events per minute.
   *
   * This function assesses the input `eventsPerMinute` and categorizes it into
   * four levels: 'high', 'medium', 'low', or 'minimal'. The categorization is
   * based on a series of conditional checks that compare the input value to
   * predefined thresholds. The first condition met determines the activity level,
   * ensuring a clear hierarchical classification.
   *
   * @param eventsPerMinute - The number of events occurring per minute.
   */
  const getActivityLevel = (eventsPerMinute: number) => {
    if (eventsPerMinute >= 5) return 'high';
    if (eventsPerMinute >= 1) return 'medium';
    if (eventsPerMinute >= 0.1) return 'low';
    return 'minimal';
  };

  /**
   * Determines the color class based on the activity level.
   *
   * This function maps different activity levels to their corresponding CSS color classes.
   * It returns a string containing text and background color classes for light and dark themes.
   *
   * @param level - The activity level as a string ('high', 'medium', 'low', 'minimal').
   * @returns A string with CSS classes for text and background colors in both light and dark modes.
   */
  const getActivityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'low':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'minimal':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  /**
   * Formats a countdown timer in minutes and seconds.
   */
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // Sort data by event count (descending)
  const sortedData = Object.entries(webhooksData).sort(
    ([, a], [, b]) => b.EventCount - a.EventCount
  );

  // Calculate totals
  const totalEvents = Object.values(webhooksData).reduce((sum, stats) => sum + stats.EventCount, 0);
  const totalUsers = Object.keys(webhooksData).length;
  const totalBots = Object.keys(webhooksData).filter(username => username.includes('[bot]')).length;
  const totalHumanUsers = totalUsers - totalBots;

  if (loading && !lastUpdated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>Webhooks Handler Stats</span>
          </h2>
        </div>
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading webhooks statistics...</p>
        </div>
      </div>
    );
  }

  if (error && !lastUpdated) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span>Webhooks Handler Stats</span>
            </h2>
            <button
              onClick={handleManualRefresh}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <Activity className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium">Failed to load webhooks statistics</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span>Webhooks Handler Stats</span>
            {lastUpdated && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                (Updated: {lastUpdated.toLocaleTimeString()})
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                isAutoRefreshing
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Auto-refresh: {isAutoRefreshing ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-md transition-colors min-w-[100px]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {loading ? 'Loading...' : isAutoRefreshing ? formatCountdown(countdown) : 'Refresh'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalEvents.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalUsers}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalBots}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalHumanUsers}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Human Users</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User/Bot
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Activity Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Events/Min
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Activity
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Activity className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">No webhook statistics available</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map(([username, stats]) => {
                const activityLevel = getActivityLevel(stats.EventsPerMinute);
                return (
                  <tr key={username} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getUserIcon(username)}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {getUserType(username)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stats.EventCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(activityLevel)}`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {activityLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {stats.EventsPerMinute.toFixed(3)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDuration(stats.TimeSpanMinutes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(stats.LastActivity)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}