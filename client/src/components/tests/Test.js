import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Play, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Save,
  History
} from 'lucide-react';
import axios from 'axios';

const Test = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('test1');
  const [testData, setTestData] = useState({
    test1: {
      input1: '',
      input2: '',
      input3: '',
      dropdownValue: 'option1'
    },
    test2: {
      input1: '',
      input2: '',
      input3: '',
      dropdownValue: 'option1'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    test1Count: 0,
    test2Count: 0,
    completedTests: 0,
    pendingTests: 0,
    totalTests: 0
  });

  // Default options for dropdowns based on tabs
  const defaultOptions = {
    test1: [
      { value: 'option1', label: 'Option 1 - Basic Test' },
      { value: 'option2', label: 'Option 2 - Advanced Test' },
      { value: 'option3', label: 'Option 3 - Custom Test' },
      { value: 'option4', label: 'Option 4 - Extended Test' }
    ],
    test2: [
      { value: 'option1', label: 'Option 1 - Standard Test' },
      { value: 'option2', label: 'Option 2 - Performance Test' },
      { value: 'option3', label: 'Option 3 - Security Test' },
      { value: 'option4', label: 'Option 4 - Integration Test' }
    ]
  };

  useEffect(() => {
    fetchTestStats();
  }, []);

  const fetchTestStats = async () => {
    try {
      const response = await axios.get('/api/tests/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch test stats:', error);
    }
  };

  const handleInputChange = (testType, field, value) => {
    setTestData(prev => ({
      ...prev,
      [testType]: {
        ...prev[testType],
        [field]: value
      }
    }));
  };

  const handleSubmitTest = async (testType) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const currentTestData = testData[testType];
      
      // Validate required fields
      if (!currentTestData.input1 || !currentTestData.input2 || !currentTestData.input3) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/tests/create', {
        testType,
        testData: currentTestData,
        notes: `Test conducted by ${user.username || user.firstName || 'User'}`
      });

      setMessage({ type: 'success', text: `${testType.toUpperCase()} test submitted successfully!` });
      
      // Reset form for the submitted test type
      setTestData(prev => ({
        ...prev,
        [testType]: {
          input1: '',
          input2: '',
          input3: '',
          dropdownValue: 'option1'
        }
      }));

      // Refresh stats
      fetchTestStats();

    } catch (error) {
      console.error('Failed to submit test:', error);
      setMessage({ type: 'error', text: 'Failed to submit test. Please try again.' });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-800 to-dark-700 rounded-2xl p-6 border border-dark-600">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Conduct Tests 🔬
            </h1>
            <p className="text-gray-300">
              Run diagnostic tests and monitor their progress
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Total Tests</p>
            <p className="text-2xl font-bold text-white">{stats.totalTests}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Test 1</p>
            <p className="text-2xl font-bold text-blue-400">{stats.test1Count}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Test 2</p>
            <p className="text-2xl font-bold text-purple-400">{stats.test2Count}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-400">{stats.completedTests}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pendingTests}</p>
          </div>
        </div>
      </div>

      {/* Test Tabs */}
      <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('test1')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'test1'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Test 1
          </button>
          <button
            onClick={() => setActiveTab('test2')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'test2'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Test 2
          </button>
        </div>

        {/* Test Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Input Field 1
              </label>
              <input
                type="text"
                value={testData[activeTab].input1}
                onChange={(e) => handleInputChange(activeTab, 'input1', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter test data 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Input Field 2
              </label>
              <input
                type="text"
                value={testData[activeTab].input2}
                onChange={(e) => handleInputChange(activeTab, 'input2', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter test data 2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Input Field 3
              </label>
              <input
                type="text"
                value={testData[activeTab].input3}
                onChange={(e) => handleInputChange(activeTab, 'input3', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter test data 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Test Configuration
              </label>
              <select
                value={testData[activeTab].dropdownValue}
                onChange={(e) => handleInputChange(activeTab, 'dropdownValue', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {defaultOptions[activeTab].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmitTest(activeTab)}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                loading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : activeTab === 'test1'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Submit {activeTab.toUpperCase()} Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Test 1 History
          </h3>
          <p className="text-gray-400 mb-4">
            View detailed history and results for Test 1
          </p>
          <button
            onClick={() => window.location.href = '/tests/history/test1'}
            className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
          >
            View History
          </button>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Test 2 History
          </h3>
          <p className="text-gray-400 mb-4">
            View detailed history and results for Test 2
          </p>
          <button
            onClick={() => window.location.href = '/tests/history/test2'}
            className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test; 