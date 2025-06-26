import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Building, Users, Tag, Plus, Eye, EyeOff, Trash2, Edit, Save, X, Github, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../dashboard/Header';
import { Footer } from '../dashboard/Footer';

interface OverviewStats {
  vacancies: {
    total: number;
    active: number;
    closed: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  repositories: {
    total: number;
    active: number;
    inactive: number;
  };
  recruiters: {
    total: number;
    active: number;
    thisMonth: number;
  };
  labels: {
    total: number;
    mostUsed: string[];
  };
}

interface Repository {
  id: string;
  owner: string;
  name: string;
  enabled: boolean;
  vacanciesCount: number;
  recruitersCount: number;
  labels: string[];
  dateAdded: string;
  lastSync: string;
  description?: string;
}

interface NewRepository {
  owner: string;
  name: string;
  description: string;
  labels: string[];
}

// Mock data
const mockOverviewStats: OverviewStats = {
  vacancies: {
    total: 1247,
    active: 892,
    closed: 355,
    today: 23,
    thisWeek: 156,
    thisMonth: 445
  },
  repositories: {
    total: 45,
    active: 38,
    inactive: 7
  },
  recruiters: {
    total: 234,
    active: 189,
    thisMonth: 67
  },
  labels: {
    total: 89,
    mostUsed: ['remote', 'senior', 'javascript', 'react', 'python', 'full-time']
  }
};

const defaultLabels = [
  'remote', 'presencial', 'híbrido', 'junior', 'pleno', 'senior', 'full-time', 'part-time',
  'freelance', 'estágio', 'javascript', 'typescript', 'react', 'vue', 'angular', 'node',
  'python', 'java', 'php', 'c#', 'go', 'rust', 'frontend', 'backend', 'fullstack',
  'mobile', 'devops', 'data-science', 'machine-learning', 'ui-ux', 'product-manager'
];

const mockRepositories: Repository[] = [
  {
    id: '1',
    owner: 'frontendbr',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 234,
    recruitersCount: 45,
    labels: ['remote', 'frontend', 'javascript', 'react', 'vue', 'angular'],
    dateAdded: '2024-01-10 09:30:00',
    lastSync: '2024-01-15 14:25:00',
    description: 'Repositório de vagas para desenvolvedores frontend'
  },
  {
    id: '2',
    owner: 'backend-br',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 189,
    recruitersCount: 38,
    labels: ['remote', 'backend', 'node', 'python', 'java', 'go'],
    dateAdded: '2024-01-08 15:45:00',
    lastSync: '2024-01-15 13:20:00',
    description: 'Vagas para desenvolvedores backend'
  },
  {
    id: '3',
    owner: 'react-brasil',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 156,
    recruitersCount: 29,
    labels: ['remote', 'react', 'javascript', 'typescript', 'frontend'],
    dateAdded: '2024-01-05 11:20:00',
    lastSync: '2024-01-15 12:15:00',
    description: 'Oportunidades para desenvolvedores React'
  },
  {
    id: '4',
    owner: 'vuejs-br',
    name: 'vagas',
    enabled: false,
    vacanciesCount: 67,
    recruitersCount: 15,
    labels: ['remote', 'vue', 'javascript', 'frontend'],
    dateAdded: '2024-01-03 14:10:00',
    lastSync: '2024-01-14 16:30:00',
    description: 'Vagas para desenvolvedores Vue.js'
  },
  {
    id: '5',
    owner: 'python-brasil',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 198,
    recruitersCount: 42,
    labels: ['remote', 'python', 'django', 'flask', 'data-science', 'backend'],
    dateAdded: '2024-01-01 10:00:00',
    lastSync: '2024-01-15 10:45:00',
    description: 'Oportunidades para desenvolvedores Python'
  },
  {
    id: '6',
    owner: 'androiddevbr',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 89,
    recruitersCount: 23,
    labels: ['mobile', 'android', 'kotlin', 'java'],
    dateAdded: '2023-12-28 16:30:00',
    lastSync: '2024-01-15 08:30:00',
    description: 'Vagas para desenvolvedores Android'
  },
  {
    id: '7',
    owner: 'iosdevbr',
    name: 'vagas',
    enabled: false,
    vacanciesCount: 45,
    recruitersCount: 12,
    labels: ['mobile', 'ios', 'swift', 'objective-c'],
    dateAdded: '2023-12-25 12:00:00',
    lastSync: '2024-01-14 18:45:00',
    description: 'Oportunidades para desenvolvedores iOS'
  },
  {
    id: '8',
    owner: 'devops-br',
    name: 'vagas',
    enabled: true,
    vacanciesCount: 123,
    recruitersCount: 31,
    labels: ['devops', 'aws', 'docker', 'kubernetes', 'terraform'],
    dateAdded: '2023-12-20 14:15:00',
    lastSync: '2024-01-14 16:20:00',
    description: 'Vagas para profissionais de DevOps'
  }
];

export function VagasAggregatorPage() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('darkMode');
      return storedTheme === null ? true : storedTheme === 'true';
    }
    return true;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'repositories'>('overview');
  const [repositories, setRepositories] = useState(mockRepositories);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRepo, setEditingRepo] = useState<string | null>(null);
  const [newRepo, setNewRepo] = useState<NewRepository>({
    owner: '',
    name: '',
    description: '',
    labels: []
  });

  const handleToggleRepository = (repoId: string) => {
    setRepositories(prev => prev.map(repo => 
      repo.id === repoId ? { ...repo, enabled: !repo.enabled } : repo
    ));
  };

  const handleDeleteRepository = (repoId: string) => {
    setRepositories(prev => prev.filter(repo => repo.id !== repoId));
  };

  const handleAddRepository = () => {
    if (!newRepo.owner || !newRepo.name) return;

    const repository: Repository = {
      id: Date.now().toString(),
      owner: newRepo.owner,
      name: newRepo.name,
      description: newRepo.description,
      enabled: true,
      vacanciesCount: 0,
      recruitersCount: 0,
      labels: newRepo.labels,
      dateAdded: new Date().toISOString().slice(0, 19).replace('T', ' '),
      lastSync: 'Never'
    };

    setRepositories(prev => [repository, ...prev]);
    setNewRepo({ owner: '', name: '', description: '', labels: [] });
    setShowAddForm(false);
  };

  const handleEditRepository = (repoId: string) => {
    setEditingRepo(repoId);
  };

  const handleSaveRepository = (repoId: string, updatedRepo: Partial<Repository>) => {
    setRepositories(prev => prev.map(repo => 
      repo.id === repoId ? { ...repo, ...updatedRepo } : repo
    ));
    setEditingRepo(null);
  };

  const handleLabelToggle = (label: string, isNewRepo = false) => {
    if (isNewRepo) {
      setNewRepo(prev => ({
        ...prev,
        labels: prev.labels.includes(label)
          ? prev.labels.filter(l => l !== label)
          : [...prev.labels, label]
      }));
    }
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled
      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      : 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />;
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
                <Briefcase className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vagas Aggregator - API BR</h1>
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
                    <Briefcase className="w-4 h-4" />
                    <span>Overview</span>
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
                    <Building className="w-4 h-4" />
                    <span>Repositories</span>
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                      {repositories.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Vacancies Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span>Vacancies Overview</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {mockOverviewStats.vacancies.total.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {mockOverviewStats.vacancies.active}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                        {mockOverviewStats.vacancies.closed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Closed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {mockOverviewStats.vacancies.today}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {mockOverviewStats.vacancies.thisWeek}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {mockOverviewStats.vacancies.thisMonth}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">This Month</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Repositories */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Building className="w-5 h-5 text-green-500" />
                      <span>Repositories</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {mockOverviewStats.repositories.total}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {mockOverviewStats.repositories.active}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                          {mockOverviewStats.repositories.inactive}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Inactive</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recruiters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span>Recruiters</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {mockOverviewStats.recruiters.total}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {mockOverviewStats.recruiters.active}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {mockOverviewStats.recruiters.thisMonth}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">This Month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Tag className="w-5 h-5 text-yellow-500" />
                      <span>Labels</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {mockOverviewStats.labels.total}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Labels</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Most Used:</div>
                      <div className="flex flex-wrap gap-1">
                        {mockOverviewStats.labels.mostUsed.map((label, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Repositories Tab */}
          {activeTab === 'repositories' && (
            <div className="space-y-6">
              {/* Add Repository Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Repository</span>
                </button>
              </div>

              {/* Add Repository Form */}
              {showAddForm && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-green-500" />
                        <span>Add New Repository</span>
                      </h3>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Owner/Organization
                        </label>
                        <input
                          type="text"
                          value={newRepo.owner}
                          onChange={(e) => setNewRepo(prev => ({ ...prev, owner: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="e.g., frontendbr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Repository Name
                        </label>
                        <input
                          type="text"
                          value={newRepo.name}
                          onChange={(e) => setNewRepo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="e.g., vagas"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newRepo.description}
                        onChange={(e) => setNewRepo(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={3}
                        placeholder="Brief description of the repository"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preset Labels
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {defaultLabels.map((label) => (
                          <button
                            key={label}
                            onClick={() => handleLabelToggle(label, true)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                              newRepo.labels.includes(label)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddRepository}
                        disabled={!newRepo.owner || !newRepo.name}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Repository
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Repositories List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    <span>Repository Management</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({repositories.length} repositories)
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Repository</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statistics</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Labels</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Sync</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {repositories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <Building className="w-12 h-12 text-gray-400" />
                              <p className="text-gray-500 dark:text-gray-400">No repositories found</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        repositories.map((repo) => (
                          <tr key={repo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Github className="w-5 h-5 text-gray-400" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {repo.owner}/{repo.name}
                                  </div>
                                  {repo.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                      {repo.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(repo.enabled)}`}>
                                {getStatusIcon(repo.enabled)}
                                <span className="ml-1">{repo.enabled ? 'ACTIVE' : 'INACTIVE'}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <div className="flex items-center space-x-1">
                                  <Briefcase className="w-4 h-4 text-gray-400" />
                                  <span>{repo.vacanciesCount} vacancies</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>{repo.recruitersCount} recruiters</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {repo.labels.slice(0, 3).map((label, index) => (
                                  <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                    {label}
                                  </span>
                                ))}
                                {repo.labels.length > 3 && (
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                    +{repo.labels.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {repo.lastSync}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleRepository(repo.id)}
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                                    repo.enabled
                                      ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400'
                                      : 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400'
                                  }`}
                                >
                                  {repo.enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  <span>{repo.enabled ? 'Disable' : 'Enable'}</span>
                                </button>
                                <button
                                  onClick={() => handleEditRepository(repo.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-md transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteRepository(repo.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-md transition-colors"
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
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}