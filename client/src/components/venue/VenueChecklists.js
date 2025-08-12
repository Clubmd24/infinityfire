import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle,
  Circle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const VenueChecklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState(null);
  const [formData, setFormData] = useState({
    checklistType: 'opening',
    conductedBy: '',
    checkDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/venue-checklists');
      setChecklists(response.data.data);
    } catch (error) {
      console.error('Failed to load checklists:', error);
      setError('Failed to load checklists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChecklist = async () => {
    try {
      const response = await axios.post('/api/venue-checklists', formData);
      setChecklists([response.data.data, ...checklists]);
      setShowCreateForm(false);
      setFormData({
        checklistType: 'opening',
        conductedBy: '',
        checkDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (error) {
      console.error('Failed to create checklist:', error);
      setError('Failed to create checklist');
    }
  };

  const handleUpdateChecklist = async (checklistId, updates) => {
    try {
      const response = await axios.patch(`/api/venue-checklists/${checklistId}/items`, {
        items: updates
      });
      
      setChecklists(checklists.map(checklist => 
        checklist.id === checklistId ? response.data.data : checklist
      ));
    } catch (error) {
      console.error('Failed to update checklist:', error);
      setError('Failed to update checklist');
    }
  };

  const handleCompleteChecklist = async (checklistId, overallConfirmation) => {
    try {
      const response = await axios.patch(`/api/venue-checklists/${checklistId}/complete`, {
        overallConfirmation
      });
      
      setChecklists(checklists.map(checklist => 
        checklist.id === checklistId ? response.data.data : checklist
      ));
    } catch (error) {
      console.error('Failed to complete checklist:', error);
      setError('Failed to complete checklist');
    }
  };

  const handleDeleteChecklist = async (checklistId) => {
    if (!window.confirm('Are you sure you want to delete this checklist?')) return;
    
    try {
      await axios.delete(`/api/venue-checklists/${checklistId}`);
      setChecklists(checklists.filter(checklist => checklist.id !== checklistId));
    } catch (error) {
      console.error('Failed to delete checklist:', error);
      setError('Failed to delete checklist');
    }
  };

  const getOpeningChecklistItems = () => [
    { key: 'fireDoorsNorthChainCollected', label: 'Fire Doors north chain collected' },
    { key: 'fireDoorsSouthChainCollected', label: 'Fire Doors south chain collected' },
    { key: 'fireDoorsUnlocked', label: 'Fire Doors Unlocked' },
    { key: 'runwayLightingOperating', label: 'Runway Lighting Operating' },
    { key: 'functionalSafetyLightingOn', label: 'Functional / Safety Lighting On' },
    { key: 'cctvOperating', label: 'CCTV Operating' },
    { key: 'fireAlarmOperational', label: 'Fire Alarm Operational' },
    { key: 'radioChecksIncTango', label: 'Radio Checks (inc Tango)' },
    { key: 'gatesShuttersSecuredOpen', label: 'Gates / Shutters Secured Open' },
    { key: 'idScannerOperation', label: 'ID Scanner Operation' },
    { key: 'tillSystemReset', label: 'Till System Re-set' },
    { key: 'gasTurnedOn', label: 'Gas Turned on' },
    { key: 'runwayClean', label: 'Runway Clean' },
    { key: 'soundSystemWorking', label: 'Sound system Working' },
    { key: 'lasersOn', label: 'Lasers On' },
    { key: 'smokeMachinesFull', label: 'Smoke Machines Full' },
    { key: 'ledScreenProjectorsOnWorking', label: 'LED Screen & Projectors On & Working' },
    { key: 'postMixFull', label: 'Post Mix Full' },
    { key: 'fireAlarmIsolated', label: 'Fire Alarm Isolated' }
  ];

  const getClosingChecklistItems = () => [
    { key: 'fireDoor1LockedSecured', label: 'Fire Door 1 Locked & Secured' },
    { key: 'fireDoor2LockedSecured', label: 'Fire Door 2 Locked & Secured' },
    { key: 'fireDoor3LockedSecured', label: 'Fire Door 3 Locked & Secured' },
    { key: 'fireDoor4LockedSecured', label: 'Fire Door 4 Locked & Secured' },
    { key: 'fireDoor5LockedSecured', label: 'Fire Door 5 Locked & Secured' },
    { key: 'fireDoor6LockedSecured', label: 'Fire Door 6 Locked & Secured' },
    { key: 'gentsWcCleared', label: 'Gents WC Cleared' },
    { key: 'ladiesWcCleared', label: 'Ladies WC Cleared' },
    { key: 'phrootClear', label: 'Phroot Clear' },
    { key: 'lv3Clear', label: 'Lv 3 Clear' },
    { key: 'lv2Clear', label: 'Lv 2 Clear' },
    { key: 'lv1Clear', label: 'Lv 1 Clear' },
    { key: 'frontDoorsLocked', label: 'Front doors LOCKED!!' },
    { key: 'runwayClean', label: 'Runway Clean' },
    { key: 'barsClean', label: 'Bars clean' },
    { key: 'dishwashersOff', label: 'Dishwashers Off' },
    { key: 'gasesOff', label: 'Gases Off' },
    { key: 'djGearOff', label: 'DJ Gear off' },
    { key: 'fireAlarmTakenOutOfIsolation', label: 'Fire Alarm taken out of isolation' },
    { key: 'radiosReturnedOnCharge', label: 'Radios returned & on Charge' },
    { key: 'tangoLinkSignedOff', label: 'Tango link signed off' }
  ];

  const renderChecklistItem = (checklist, item) => (
    <div key={item.key} className="flex items-center space-x-3 p-2 hover:bg-dark-700 rounded">
      <button
        onClick={() => handleUpdateChecklist(checklist.id, { [item.key]: !checklist[item.key] })}
        className="flex items-center space-x-2 text-left flex-1"
      >
        {checklist[item.key] ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
        <span className={checklist[item.key] ? 'text-green-400' : 'text-gray-300'}>
          {item.label}
        </span>
      </button>
    </div>
  );

  const renderChecklist = (checklist) => {
    const items = checklist.checklistType === 'opening' 
      ? getOpeningChecklistItems() 
      : getClosingChecklistItems();

    return (
      <div key={checklist.id} className="bg-dark-800 rounded-lg p-6 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              checklist.checklistType === 'opening' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {checklist.checklistType === 'opening' ? 'Opening' : 'Closing'} Checklist
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              checklist.status === 'completed' ? 'bg-green-500/20 text-green-400' :
              checklist.status === 'verified' ? 'bg-blue-500/20 text-blue-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {checklist.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {checklist.status === 'in_progress' && (
              <button
                onClick={() => {
                  const confirmation = prompt('Enter overall confirmation:');
                  if (confirmation) {
                    handleCompleteChecklist(checklist.id, confirmation);
                  }
                }}
                className="btn-primary text-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Complete
              </button>
            )}
            <button
              onClick={() => handleDeleteChecklist(checklist.id)}
              className="btn-secondary text-sm text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Checklist Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Conducted by:</span>
            <span className="text-gray-100">{checklist.conductedBy}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Date:</span>
            <span className="text-gray-100">
              {new Date(checklist.checkDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Created:</span>
            <span className="text-gray-100">
              {new Date(checklist.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Notes */}
        {checklist.notes && (
          <div className="mb-6 p-3 bg-dark-700 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 font-medium">Notes:</span>
            </div>
            <p className="text-gray-300">{checklist.notes}</p>
          </div>
        )}

        {/* Checklist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => renderChecklistItem(checklist, item))}
        </div>

        {/* Completion Info */}
        {checklist.status === 'completed' && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Completed</span>
            </div>
            <p className="text-green-300">
              <strong>Overall Confirmation:</strong> {checklist.overallConfirmation}
            </p>
            {checklist.signature && (
              <p className="text-green-300 mt-1">
                <strong>Signature:</strong> {checklist.signature}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Venue Checklists</h1>
          <p className="text-gray-400 mt-1">
            Manage opening and closing checklists for Infinity Nightclub
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <h3 className="text-lg font-semibold text-gray-100">Create New Checklist</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Checklist Type
                </label>
                <select
                  value={formData.checklistType}
                  onChange={(e) => setFormData({...formData, checklistType: e.target.value})}
                  className="input-field w-full"
                >
                  <option value="opening">Opening Checklist</option>
                  <option value="closing">Closing Checklist</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Conducted By
                </label>
                <input
                  type="text"
                  value={formData.conductedBy}
                  onChange={(e) => setFormData({...formData, conductedBy: e.target.value})}
                  placeholder="Enter your name"
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Check Date
                </label>
                <input
                  type="date"
                  value={formData.checkDate}
                  onChange={(e) => setFormData({...formData, checkDate: e.target.value})}
                  className="input-field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="input-field w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-dark-700">
              <button
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChecklist}
                disabled={!formData.conductedBy.trim()}
                className="btn-primary"
              >
                Create Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checklists List */}
      {checklists.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No checklists found</p>
          <p className="text-gray-500 mt-2">Create your first opening or closing checklist to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {checklists.map(renderChecklist)}
        </div>
      )}
    </div>
  );
};

export default VenueChecklists;
