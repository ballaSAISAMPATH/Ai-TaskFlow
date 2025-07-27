import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { addManualTask } from '@/store/task';

const ManualTask = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    goalTitle: '',
    days: 0,
    weeks: 0,
    months: 0
  });

  const [taskGroups, setTaskGroups] = useState({
    monthly: [],
    weekly: [],
    daily: []
  });

  const [activeTab, setActiveTab] = useState('daily');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generateTaskGroups = () => {
      const newTaskGroups = {
        daily: [],
        weekly: [],
        monthly: []
      };

      const totalWeeks = formData.weeks + (formData.months * 4);
      const totalDays = formData.days + (formData.weeks * 7) + (formData.months * 30);

      for (let i = 1; i <= totalDays; i++) {
        newTaskGroups.daily.push({
          label: `Day-${i}`,
          tasks: ['']
        });
      }

      for (let i = 1; i <= totalWeeks; i++) {
        newTaskGroups.weekly.push({
          label: `Week-${i}`,
          tasks: ['']
        });
      }

      for (let i = 1; i <= formData.months; i++) {
        newTaskGroups.monthly.push({
          label: `Month-${i}`,
          tasks: ['']
        });
      }

      setTaskGroups(newTaskGroups);
    };

    generateTaskGroups();
  }, [formData.days, formData.weeks, formData.months]);

  useEffect(() => {
    const totalDays = formData.days + (formData.weeks * 7) + (formData.months * 30);
    const totalWeeks = formData.weeks + (formData.months * 4);
    
    if (totalDays > 0) {
      setActiveTab('daily');
    } else if (totalWeeks > 0) {
      setActiveTab('weekly');
    } else if (formData.months > 0) {
      setActiveTab('monthly');
    }
  }, [formData.days, formData.weeks, formData.months]);

  const handleFormChange = (field, value) => {
    if (field === 'goalTitle') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      const numValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleTaskChange = (type, groupIndex, taskIndex, value) => {
    setTaskGroups(prev => ({
      ...prev,
      [type]: prev[type].map((group, gIdx) => 
        gIdx === groupIndex 
          ? { 
              ...group, 
              tasks: group.tasks.map((task, tIdx) => 
                tIdx === taskIndex ? value : task
              )
            }
          : group
      )
    }));
  };

  const addTask = (type, groupIndex) => {
    setTaskGroups(prev => ({
      ...prev,
      [type]: prev[type].map((group, idx) => 
        idx === groupIndex 
          ? { ...group, tasks: [...group.tasks, ''] }
          : group
      )
    }));
  };

  const removeTask = (type, groupIndex, taskIndex) => {
    const group = taskGroups[type][groupIndex];
    if (group.tasks.length > 1) {
      setTaskGroups(prev => ({
        ...prev,
        [type]: prev[type].map((g, gIdx) => 
          gIdx === groupIndex 
            ? { ...g, tasks: g.tasks.filter((_, tIdx) => tIdx !== taskIndex) }
            : g
        )
      }));
    }
  };

  const calculateTotalDays = () => {
    return formData.days + (formData.weeks * 7) + (formData.months * 30);
  };

  const formatDuration = () => {
    const parts = [];
    if (formData.months > 0) parts.push(`${formData.months} month${formData.months > 1 ? 's' : ''}`);
    if (formData.weeks > 0) parts.push(`${formData.weeks} week${formData.weeks > 1 ? 's' : ''}`);
    if (formData.days > 0) parts.push(`${formData.days} day${formData.days > 1 ? 's' : ''}`);
    return parts.join(', ') || '0 days';
  };

  const handleSubmit = async () => {
    if (!formData.goalTitle.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    if (formData.days === 0 && formData.weeks === 0 && formData.months === 0) {
      toast.error('Please set a duration for your goal');
      return;
    }

    if (!user || !user.id) {
      toast.error('User authentication required');
      return;
    }

    const hasAnyTasks = Object.values(taskGroups).some(groups => 
      groups.some(group => group.tasks.some(task => task.trim()))
    );

    if (!hasAnyTasks) {
      toast.error('Please add at least one task to your goal');
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredTaskGroups = {};
      Object.keys(taskGroups).forEach(type => {
        filteredTaskGroups[`${type}Tasks`] = taskGroups[type].filter(group => 
          group.tasks.some(task => task.trim())
        ).map(group => ({
          ...group,
          tasks: group.tasks.filter(task => task.trim())
        }));
      });

      const payload = {
        goalTitle: formData.goalTitle.trim(),
        totalDays: calculateTotalDays(),
        duration: formatDuration(),
        userId: user.id,
        ...filteredTaskGroups
      };

      console.log('Payload to send:', payload);

      const result = await dispatch(addManualTask(payload)).unwrap();
      
      const goalId = result.data._id || result.data.id;
      
      toast.success(
        <div className="flex flex-col space-y-2">
          <span className="font-semibold">🎉 Goal created successfully!</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                navigate(`/user/goal/${goalId}`);
                toast.dismiss();
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              View Goal
            </button>
            <button
              onClick={() => {
                navigate('/user/home');
                toast.dismiss();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>,
        {
          duration: 8000,
          dismissible: true,
        }
      );
      
      setFormData({ goalTitle: '', days: 0, weeks: 0, months: 0 });
      
      console.log('Goal created with ID:', goalId);
      
    } catch (error) {
      toast.error(error.message || 'Failed to create goal');
      console.error('Failed to create goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableTabs = () => {
    const tabs = [];
    const totalDays = formData.days + (formData.weeks * 7) + (formData.months * 30);
    const totalWeeks = formData.weeks + (formData.months * 4);
    
    if (totalDays > 0) {
      tabs.push({ key: 'daily', label: `Daily (${totalDays} days)`, count: totalDays });
    }
    if (totalWeeks > 0) {
      tabs.push({ key: 'weekly', label: `Weekly (${totalWeeks} weeks)`, count: totalWeeks });
    }
    if (formData.months > 0) {
      tabs.push({ key: 'monthly', label: `Monthly (${formData.months} months)`, count: formData.months });
    }
    return tabs;
  };

  const renderTaskGroup = (type) => {
    const groups = taskGroups[type];
    
    if (groups.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Enter duration above to see task groups here</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="border border-green-500 rounded-lg p-4 sm:p-6 bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-green-500 mb-3">{group.label}</h3>
              <p className="text-sm text-gray-500 mb-3">Add tasks for {group.label.toLowerCase()}:</p>
            </div>
            
            <div className="space-y-3">
              {group.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm text-gray-400 sm:w-16 flex-shrink-0">Task {taskIndex + 1}:</span>
                  <input
                    type="text"
                    placeholder={`What will you do on ${group.label.toLowerCase()}?`}
                    value={task}
                    onChange={(e) => handleTaskChange(type, groupIndex, taskIndex, e.target.value)}
                    className="flex-1 px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  />
                  {group.tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(type, groupIndex, taskIndex)}
                      className="self-end sm:self-center p-2 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors flex-shrink-0"
                      title="Remove this task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => addTask(type, groupIndex)}
                className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500"
              >
                <Plus className="w-4 h-4" />
                Add Another Task
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-500">Create Your Goal</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">Set your timeline and add tasks to achieve your goal</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 lg:sticky lg:top-0 lg:h-screen lg:self-start">
          <div className="p-4 sm:p-6 h-full overflow-y-auto">
            <h2 className="text-xl font-semibold text-green-500 mb-4">Goal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your goal? *
                </label>
                <input
                  type="text"
                  required
                  value={formData.goalTitle}
                  onChange={(e) => handleFormChange('goalTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  placeholder="Example: Learn Docker"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How long will it take? Set your timeline:
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Months</label>
                    <input
                      type="number"
                      min="0"
                      max="12"
                      value={formData.months}
                      onChange={(e) => handleFormChange('months', e.target.value)}
                      className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Weeks</label>
                    <input
                      type="number"
                      min="0"
                      max="52"
                      value={formData.weeks}
                      onChange={(e) => handleFormChange('weeks', e.target.value)}
                      className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Days</label>
                    <input
                      type="number"
                      min="0"
                      max="365"
                      value={formData.days}
                      onChange={(e) => handleFormChange('days', e.target.value)}
                      className="w-full px-4 py-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                {(formData.days > 0 || formData.weeks > 0 || formData.months > 0) && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      <strong>Duration:</strong> {formatDuration()} ({calculateTotalDays()} total days)
                    </p>
                  </div>
                )}
              </div>

              {(formData.days > 0 || formData.weeks > 0 || formData.months > 0) && formData.goalTitle && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    }`}
                  >
                    {isSubmitting ? 'Creating Your Goal...' : 'Create My Goal'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {(formData.days > 0 || formData.weeks > 0 || formData.months > 0) && (
            <>
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="px-4 sm:px-6 py-4">
                  <h2 className="text-xl font-semibold text-green-500 mb-2">Add Your Tasks</h2>
                  <p className="text-gray-500 text-sm mb-4">Now add tasks for each time period:</p>
                  
                  {getAvailableTabs().length > 0 && (
                    <div className="flex flex-wrap gap-2 overflow-x-auto">
                      {getAvailableTabs().map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab.key
                              ? 'bg-green-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6">
                  {renderTaskGroup(activeTab)}
                </div>
              </div>
            </>
          )}

          {formData.days === 0 && formData.weeks === 0 && formData.months === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">Ready to start planning?</p>
                <p className="text-sm">Set your goal duration on the left to begin adding tasks</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualTask;