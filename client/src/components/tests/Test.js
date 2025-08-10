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
      fullName: '',
      date: '',
      time: '',
      location: '',
      testMethod: 'call_point',
      outcome: 'pass'
    },
    test2: {
      fullName: '',
      date: '',
      time: '',
      location: '',
      testMethod: 'weekly_flash',
      outcome: 'pass'
    },
    fire_drill: {
      drillLeaderName: '',
      dateTime: '',
      locationOfTrigger: '',
      testMethod: 'planned',
      involvedPersons: '',
      outcome: 'pass',
      drillReport: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    test1Count: 0,
    test2Count: 0,
    fireDrillCount: 0,
    completedTests: 0,
    pendingTests: 0,
    totalTests: 0
  });

  // Default options for dropdowns based on tabs
  const defaultOptions = {
    test1: {
      testMethod: [
        { value: 'call_point', label: 'Call Point' },
        { value: 'detector', label: 'Detector' }
      ],
      outcome: [
        { value: 'pass', label: 'Pass' },
        { value: 'fail', label: 'Fail' }
      ]
    },
    test2: {
      testMethod: [
        { value: 'weekly_flash', label: 'Weekly Flash Test' },
        { value: 'monthly_1hr', label: 'Monthly 1hr Test' }
      ],
      outcome: [
        { value: 'pass', label: 'Pass' },
        { value: 'fail', label: 'Fail' }
      ]
    },
    fire_drill: {
      testMethod: [
        { value: 'planned', label: 'Planned' },
        { value: 'surprise', label: 'Surprise' }
      ],
      outcome: [
        { value: 'pass', label: 'Pass' },
        { value: 'fail', label: 'Fail' }
      ]
    }
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
      
      // Validate required fields based on test type
      if (testType === 'fire_drill') {
        if (!currentTestData.drillLeaderName || !currentTestData.dateTime || !currentTestData.locationOfTrigger || !currentTestData.involvedPersons) {
          setMessage({ type: 'error', text: 'Please fill in all required fields for fire drill test' });
          setLoading(false);
          return;
        }
      } else if (testType === 'test1') {
        if (!currentTestData.fullName || !currentTestData.date || !currentTestData.time || !currentTestData.location) {
          setMessage({ type: 'error', text: 'Please fill in all required fields for fire test' });
          setLoading(false);
          return;
        }
      } else if (testType === 'test2') {
        if (!currentTestData.fullName || !currentTestData.date || !currentTestData.time || !currentTestData.location) {
          setMessage({ type: 'error', text: 'Please fill in all required fields for EM light test' });
          setLoading(false);
          return;
        }
      } else {
        if (!currentTestData.input1 || !currentTestData.input2 || !currentTestData.input3) {
          setMessage({ type: 'error', text: 'Please fill in all required fields' });
          setLoading(false);
          return;
        }
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
        [testType]: testType === 'fire_drill' ? {
          drillLeaderName: '',
          dateTime: '',
          locationOfTrigger: '',
          testMethod: 'planned',
          involvedPersons: '',
          outcome: 'pass',
          drillReport: ''
        } : testType === 'test1' ? {
          fullName: '',
          date: '',
          time: '',
          location: '',
          testMethod: 'call_point',
          outcome: 'pass'
        } : testType === 'test2' ? {
          fullName: '',
          date: '',
          time: '',
          location: '',
          testMethod: 'weekly_flash',
          outcome: 'pass'
        } : {
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
            <p className="text-gray-400 text-sm font-medium">Fire Test</p>
            <p className="text-2xl font-bold text-blue-400">{stats.test1Count}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">EM Light Test</p>
            <p className="text-2xl font-bold text-purple-400">{stats.test2Count}</p>
          </div>
        </div>
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Fire Drill</p>
            <p className="text-2xl font-bold text-red-400">{stats.fireDrillCount}</p>
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
            Fire Test
          </button>
          <button
            onClick={() => setActiveTab('test2')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'test2'
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            EM Light Test
          </button>
          <button
            onClick={() => setActiveTab('fire_drill')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'fire_drill'
                ? 'bg-red-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            Fire Drill
          </button>
        </div>

        {/* Test Form */}
        <div className="space-y-4">
          {activeTab === 'fire_drill' ? (
            // Fire Drill Form
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Drill Leader Name *
                  </label>
                  <input
                    type="text"
                    value={testData.fire_drill.drillLeaderName}
                    onChange={(e) => handleInputChange('fire_drill', 'drillLeaderName', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter drill leader name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={testData.fire_drill.dateTime}
                    onChange={(e) => handleInputChange('fire_drill', 'dateTime', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location of Trigger *
                  </label>
                  <input
                    type="text"
                    value={testData.fire_drill.locationOfTrigger}
                    onChange={(e) => handleInputChange('fire_drill', 'locationOfTrigger', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter trigger location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Method *
                  </label>
                  <select
                    value={testData.fire_drill.testMethod}
                    onChange={(e) => handleInputChange('fire_drill', 'testMethod', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {defaultOptions.fire_drill.testMethod.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Involved Persons *
                  </label>
                  <textarea
                    value={testData.fire_drill.involvedPersons}
                    onChange={(e) => handleInputChange('fire_drill', 'involvedPersons', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter names of all involved persons (one per line)"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Outcome *
                  </label>
                  <select
                    value={testData.fire_drill.outcome}
                    onChange={(e) => handleInputChange('fire_drill', 'outcome', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {defaultOptions.fire_drill.outcome.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Drill Report
                </label>
                <textarea
                  value={testData.fire_drill.drillReport}
                  onChange={(e) => handleInputChange('fire_drill', 'drillReport', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Document the drill activity and observations"
                  rows="4"
                />
              </div>
            </>
          ) : activeTab === 'test1' ? (
            // Test 1 Form (Conduct fire test)
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={testData.test1.fullName}
                    onChange={(e) => handleInputChange('test1', 'fullName', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={testData.test1.date}
                    onChange={(e) => handleInputChange('test1', 'date', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={testData.test1.time}
                    onChange={(e) => handleInputChange('test1', 'time', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={testData.test1.location}
                    onChange={(e) => handleInputChange('test1', 'location', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Method *
                  </label>
                  <select
                    value={testData.test1.testMethod}
                    onChange={(e) => handleInputChange('test1', 'testMethod', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {defaultOptions.test1.testMethod.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Outcome *
                  </label>
                  <select
                    value={testData.test1.outcome}
                    onChange={(e) => handleInputChange('test1', 'outcome', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {defaultOptions.test1.outcome.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : activeTab === 'test2' ? (
            // Test 2 Form (EM light test)
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={testData.test2.fullName}
                    onChange={(e) => handleInputChange('test2', 'fullName', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={testData.test2.date}
                    onChange={(e) => handleInputChange('test2', 'date', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={testData.test2.time}
                    onChange={(e) => handleInputChange('test2', 'time', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={testData.test2.location}
                    onChange={(e) => handleInputChange('test2', 'location', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Method *
                  </label>
                  <select
                    value={testData.test2.testMethod}
                    onChange={(e) => handleInputChange('test2', 'testMethod', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {defaultOptions.test2.testMethod.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Outcome *
                  </label>
                  <select
                    value={testData.test2.outcome}
                    onChange={(e) => handleInputChange('test2', 'outcome', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {defaultOptions.test2.outcome.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            // Standard Test Form
            <>
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
            </>
          )}

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
                    : activeTab === 'test2'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Fire Test History
          </h3>
          <p className="text-gray-400 mb-4">
            View detailed history and results for Fire Tests
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
            EM Light Test History
          </h3>
          <p className="text-gray-400 mb-4">
            View detailed history and results for EM Light Tests
          </p>
          <button
            onClick={() => window.location.href = '/tests/history/test2'}
            className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all duration-200"
          >
            View History
          </button>
        </div>

        <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            Fire Drill History
          </h3>
          <p className="text-gray-400 mb-4">
            View detailed history and results for Fire Drills
          </p>
          <button
            onClick={() => window.location.href = '/tests/history/fire_drill'}
            className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all duration-200"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test; 