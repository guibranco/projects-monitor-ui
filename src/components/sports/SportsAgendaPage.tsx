import React, { useState } from 'react';
import { ArrowLeft, Trophy, Users, Calendar, Eye, EyeOff, Clock, MapPin, Hash, Trash2, Check, X, AlertTriangle, Star, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';

interface OverviewStats {
  leagues: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
  };
  teams: {
    total: number;
    active: number;
    inactive: number;
  };
  matches: {
    total: number;
    upcoming: number;
    completed: number;
    live: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

interface IgnoredLeague {
  id: string;
  leagueName: string;
  country: string;
  sport: string;
  reason: string;
  status: 'pending' | 'ignored' | 'under_review';
  dateAdded: string;
  lastReviewed?: string;
  reviewedBy?: string;
  priority: 'low' | 'medium' | 'high';
  matchCount: number;
  teamCount: number;
}

// Mock data
const mockOverviewStats: OverviewStats = {
  leagues: {
    total: 245,
    active: 189,
    inactive: 34,
    pending: 22
  },
  teams: {
    total: 4567,
    active: 3892,
    inactive: 675
  },
  matches: {
    total: 15678,
    upcoming: 234,
    completed: 15234,
    live: 12,
    today: 45,
    thisWeek: 156,
    thisMonth: 678
  }
};

const mockIgnoredLeagues: IgnoredLeague[] = [
  {
    id: '1',
    leagueName: 'Regional Amateur Championship',
    country: 'Brazil',
    sport: 'Football',
    reason: 'Low relevance - amateur level',
    status: 'pending',
    dateAdded: '2024-01-15 14:30:00',
    priority: 'low',
    matchCount: 45,
    teamCount: 12
  },
  {
    id: '2',
    leagueName: 'Youth Development League U-16',
    country: 'Argentina',
    sport: 'Football',
    reason: 'Youth category - not in scope',
    status: 'pending',
    dateAdded: '2024-01-15 13:45:00',
    priority: 'medium',
    matchCount: 78,
    teamCount: 16
  },
  {
    id: '3',
    leagueName: 'Corporate Football League',
    country: 'Brazil',
    sport: 'Football',
    reason: 'Corporate/internal league',
    status: 'ignored',
    dateAdded: '2024-01-14 16:20:00',
    lastReviewed: '2024-01-15 09:30:00',
    reviewedBy: 'admin@sports.com',
    priority: 'low',
    matchCount: 23,
    teamCount: 8
  },
  {
    id: '4',
    leagueName: 'Beach Soccer Championship',
    country: 'Brazil',
    sport: 'Beach Soccer',
    reason: 'Different sport variant',
    status: 'under_review',
    dateAdded: '2024-01-14 12:15:00',
    lastReviewed: '2024-01-14 15:45:00',
    reviewedBy: 'reviewer@sports.com',
    priority: 'high',
    matchCount: 156,
    teamCount: 32
  },
  {
    id: '5',
    leagueName: 'Women\'s Regional Cup',
    country: 'Chile',
    sport: 'Football',
    reason: 'Pending data verification',
    status: 'pending',
    dateAdded: '2024-01-14 10:30:00',
    priority: 'high',
    matchCount: 89,
    teamCount: 24
  },
  {
    id: '6',
    leagueName: 'Veterans League 40+',
    country: 'Uruguay',
    sport: 'Football',
    reason: 'Age-restricted category',
    status: 'ignored',
    dateAdded: '2024-01-13 14:20:00',
    lastReviewed: '2024-01-14 11:15:00',
    reviewedBy: 'admin@sports.com',
    priority: 'low',
    matchCount: 34,
    teamCount: 10
  },
  {
    id: '7',
    leagueName: 'Indoor Football Championship',
    country: 'Brazil',
    sport: 'Indoor Football',
    reason: 'Different sport variant',
    status: 'under_review',
    dateAdded: '2024-01-13 09:45:00',
    lastReviewed: '2024-01-13 16:30:00',
    reviewedBy: 'reviewer@sports.com',
    priority: 'medium',
    matchCount: 67,
    teamCount: 18
  },
  {
    id: '8',
    leagueName: 'School Championship U-14',
    country: 'Brazil',
    sport: 'Football',
    reason: 'Educational institution league',
    status: 'pending',
    dateAdded: '2024-01-12 15:10:00',
    priority: 'low',
    matchCount: 112,
    teamCount: 28
  }
];

export function SportsAgendaPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'ignored-leagues'>('overview');
  const [ignoredLeagues, setIgnoredLeagues] = useState(mockIgnoredLeagues);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'ignored':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'under_review':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'ignored':
        return <EyeOff className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-3 h-3" />;
      case 'medium':
        return <Target className="w-3 h-3" />;
      case 'low':
        return <Activity className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const handleApproveLeague = (leagueId: string) => {
    setIgnoredLeagues(prev => prev.filter(league => league.id !== leagueId));
  };

  const handleDeleteLeague = (leagueId: string) => {
    setIgnoredLeagues(prev => prev.filter(league => league.id !== leagueId));
  };

  const handleReviewLeague = (leagueId: string) => {
    setIgnoredLeagues(prev => prev.map(league => 
      league.id === leagueId 
        ? { 
            ...league, 
            status: 'under_review' as const,
            lastReviewed: new Date().toISOString().slice(0, 19).replace('T', ' '),
            reviewedBy: 'current-user@sports.com'
          }
        : league
    ));
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
                <Trophy className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sports Agenda - API BR</h1>
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
                  onClick={() => setActiveTab('ignored-leagues')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'ignored-leagues'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <EyeOff className="w-4 h-4" />
                    <span>Ignored Leagues</span>
                    <span className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                      {ignoredLeagues.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Leagues Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Leagues Overview</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {mockOverviewStats.leagues.total}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Leagues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {mockOverviewStats.leagues.active}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {mockOverviewStats.leagues.inactive}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                        {mockOverviewStats.leagues.pending}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Teams Overview</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {mockOverviewStats.teams.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Teams</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {mockOverviewStats.teams.active.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {mockOverviewStats.teams.inactive.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matches Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <span>Matches Overview</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {mockOverviewStats.matches.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {mockOverviewStats.matches.upcoming}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                        {mockOverviewStats.matches.completed.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                        {mockOverviewStats.matches.live}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Live</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {mockOverviewStats.matches.today}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {mockOverviewStats.matches.thisWeek}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {mockOverviewStats.matches.thisMonth}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ignored Leagues Tab */}
          {activeTab === 'ignored-leagues' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <EyeOff className="w-5 h-5 text-red-500" />
                  <span>Ignored Leagues Management</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({ignoredLeagues.length} leagues)
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">League</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country/Sport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {ignoredLeagues.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <Trophy className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">No ignored leagues found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      ignoredLeagues.map((league) => (
                        <tr key={league.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {league.leagueName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{league.country}</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {league.sport}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={league.reason}>
                              {league.reason}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(league.status)}`}>
                              {getStatusIcon(league.status)}
                              <span className="ml-1">{league.status.replace('_', ' ').toUpperCase()}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(league.priority)}`}>
                              {getPriorityIcon(league.priority)}
                              <span className="ml-1">{league.priority.toUpperCase()}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{league.matchCount} matches</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{league.teamCount} teams</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{league.dateAdded}</span>
                              </div>
                              {league.lastReviewed && (
                                <div className="text-xs mt-1">
                                  Reviewed: {league.lastReviewed}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {league.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveLeague(league.id)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 rounded-md transition-colors"
                                    title="Approve and add to active leagues"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => handleReviewLeague(league.id)}
                                    className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-md transition-colors"
                                    title="Mark for review"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Review</span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteLeague(league.id)}
                                className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-md transition-colors"
                                title="Remove from ignored list"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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