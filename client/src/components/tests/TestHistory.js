import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Calendar,
  User,
  Settings,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

const TestHistory = () => {
  const { testType } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (testType && ['test1', 'test2'].includes(testType)) {
      fetchTestHistory();
    } else {
      setError('Invalid test type');
      setLoading(false);
    }
  }, [testType, filterStatus, sortBy, sortOrder]);

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tests/history/${testType}`);
      let filteredTests = response.data.data;

      // Apply status filter
      if (filterStatus !== 'all') {
        filteredTests = filteredTests.filter(test => test.status === filterStatus);
      }

      // Apply sorting
      filteredTests.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === 'createdAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setTests(filteredTests);
      setError('');
    } catch (error) {
      console.error('Failed to fetch test history:', error);
      setError('Failed to fetch test history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 border-green-500/30';
      case 'failed': return 'bg-red-500/20 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTestData = (testData) => {
    if (typeof testData === 'object') {
      return Object.entries(testData).map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="text-gray-400">{key}:</span> {value}
        </div>
      ));
    }
    return <span>{testData}</span>;
  };

  const handleUpdateTest = async (testId, newStatus) => {
    try {
      await axios.put(`/api/tests/${testId}/update`, {
        status: newStatus
      });
      
      // Refresh the test history
      fetchTestHistory();
    } catch (error) {
      console.error('Failed to update test:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => navigate('/tests')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl p-6 border border-dark-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tests')}
              className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {testType === 'test1' ? 'Test 1' : 'Test 2'} History 📊
              </h1>
              <p className="text-gray-300">
                View detailed history and results for {testType === 'test1' ? 'Test 1' : 'Test 2'}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              testType === 'test1' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                : 'bg-gradient-to-r from-purple-500 to-purple-600'
            }`}>
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="status">Status</option>
                <option value="id">Test ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
          <button
            onClick={fetchTestHistory}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Test History List */}
      <div className="space-y-4">
        {tests.length === 0 ? (
          <div className="text-center py-12 bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tests found</p>
            <p className="text-gray-500">No {testType === 'test1' ? 'Test 1' : 'Test 2'} tests have been conducted yet.</p>
          </div>
        ) : (
          tests.map((test) => (
            <div
              key={test.id}
              className={`bg-dark-800/50 backdrop-blur-sm border rounded-xl p-6 ${getStatusBgColor(test.status)}`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Test Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStatusBgColor(test.status)}`}>
                        {getStatusIcon(test.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {testType === 'test1' ? 'Test 1' : 'Test 2'} #{test.id}
                        </h3>
                        <p className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(test.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {test.user?.username || test.user?.firstName || 'Unknown User'}
                      </div>
                    </div>
                  </div>

                  {/* Test Data */}
                  <div className="bg-dark-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Test Configuration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {formatTestData(test.testData)}
                    </div>
                  </div>

                  {/* Notes */}
                  {test.notes && (
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Notes</h4>
                      <p className="text-gray-400 text-sm">{test.notes}</p>
                    </div>
                  )}

                  {/* Results */}
                  {test.result && (
                    <div className="bg-dark-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Results</h4>
                      <div className="text-gray-400 text-sm">
                        {typeof test.result === 'object' ? (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(test.result, null, 2)}</pre>
                        ) : (
                          test.result
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:w-48 space-y-3">
                  <div className="bg-dark-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Actions</h4>
                    <div className="space-y-2">
                      {test.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateTest(test.id, 'completed')}
                            className="w-full px-3 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleUpdateTest(test.id, 'failed')}
                            className="w-full px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Mark Failed
                          </button>
                        </>
                      )}
                      {test.status === 'completed' && (
                        <button
                          onClick={() => handleUpdateTest(test.id, 'pending')}
                          className="w-full px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
                        >
                          Reset to Pending
                        </button>
                      )}
                      {test.status === 'failed' && (
                        <button
                          onClick={() => handleUpdateTest(test.id, 'pending')}
                          className="w-full px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Test Details */}
                  <div className="bg-dark-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Details</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>ID: {test.id}</div>
                      <div>Type: {test.testType}</div>
                      <div>Created: {formatDate(test.createdAt)}</div>
                      {test.updatedAt && test.updatedAt !== test.createdAt && (
                        <div>Updated: {formatDate(test.updatedAt)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestHistory; 