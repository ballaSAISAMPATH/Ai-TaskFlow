import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { createManualGoal } from '@/store/task'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Trash2, 
  Target, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react'

const ManualTask = () => {
  function createManualGoal()
  {

  }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.task)
  
  const [formData, setFormData] = useState({
    goalTitle: '',
    durationType: '', 
    durationValue: '',
    totalDays: 30
  })

  const [taskCategories, setTaskCategories] = useState({
    monthly: [],
    weekly: [],
    daily: []
  })

  const [newTask, setNewTask] = useState({
    monthly: { label: '', tasks: [''] },
    weekly: { label: '', tasks: [''] },
    daily: { label: '', tasks: [''] }
  })

  const [activeTab, setActiveTab] = useState('daily')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTabs, setAvailableTabs] = useState(['daily'])

  const durationOptions = {
    days: Array.from({ length: 30 }, (_, i) => i + 1),
    weeks: Array.from({ length: 12 }, (_, i) => i + 1), 
    months: Array.from({ length: 12 }, (_, i) => i + 1)
  }

  useEffect(() => {
    let tabs = []
    
    switch (formData.durationType) {
      case 'days':
        tabs = ['daily']
        setActiveTab('daily')
        break
      case 'weeks':
        tabs = ['weekly', 'daily']
        setActiveTab('weekly')
        break
      case 'months':
        tabs = ['monthly', 'weekly', 'daily']
        setActiveTab('monthly')
        break
      default:
        tabs = ['daily']
        setActiveTab('daily')
    }
    
    setAvailableTabs(tabs)
    
    setTaskCategories(prev => {
      const newCategories = { ...prev }
      Object.keys(newCategories).forEach(category => {
        if (!tabs.includes(category)) {
          newCategories[category] = []
        }
      })
      return newCategories
    })
  }, [formData.durationType])

  useEffect(() => {
    if (formData.durationType && formData.durationValue) {
      let totalDays = 0
      const value = parseInt(formData.durationValue)
      
      switch (formData.durationType) {
        case 'days':
          totalDays = value
          break
        case 'weeks':
          totalDays = value * 7
          break
        case 'months':
          totalDays = value * 30 
          break
      }
      
      setFormData(prev => ({ ...prev, totalDays }))
    }
  }, [formData.durationType, formData.durationValue])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addTaskToGroup = (category, taskIndex) => {
    setNewTask(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        tasks: [...prev[category].tasks, '']
      }
    }))
  }

  const removeTaskFromGroup = (category, taskIndex) => {
    if (newTask[category].tasks.length > 1) {
      setNewTask(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          tasks: prev[category].tasks.filter((_, index) => index !== taskIndex)
        }
      }))
    }
  }

  const updateTaskText = (category, taskIndex, value) => {
    setNewTask(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        tasks: prev[category].tasks.map((task, index) => 
          index === taskIndex ? value : task
        )
      }
    }))
  }

  const updateTaskLabel = (category, value) => {
    setNewTask(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        label: value
      }
    }))
  }

  const addTaskGroup = (category) => {
    if (!newTask[category].label.trim()) {
      toast.error('Please enter a group label')
      return
    }

    const validTasks = newTask[category].tasks.filter(task => task.trim() !== '')
    
    if (validTasks.length === 0) {
      toast.error('Please add at least one task')
      return
    }

    const taskGroup = {
      label: newTask[category].label.trim(),
      tasks: validTasks,
      status: false
    }

    setTaskCategories(prev => ({
      ...prev,
      [category]: [...prev[category], taskGroup]
    }))

    setNewTask(prev => ({
      ...prev,
      [category]: { label: '', tasks: [''] }
    }))

    toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} task group added!`)
  }

  const removeTaskGroup = (category, groupIndex) => {
    setTaskCategories(prev => ({
      ...prev,
      [category]: prev[category].filter((_, index) => index !== groupIndex)
    }))
    toast.success('Task group removed')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.goalTitle.trim() || !formData.durationType || !formData.durationValue) {
      toast.error('Please fill in all required fields')
      return
    }

    const hasAnyTasks = availableTabs.some(tab => taskCategories[tab].length > 0)
    
    if (!hasAnyTasks) {
      toast.error('Please add tasks to at least one category')
      return
    }

    if (!user || !user.id) {
      toast.error('User authentication required')
      return
    }

    setIsSubmitting(true)
    
    try {
      const duration = `${formData.durationValue} ${formData.durationType}`
      
      const result = await dispatch(createManualGoal({
        goalTitle: formData.goalTitle.trim(),
        duration: duration,
        totalDays: formData.totalDays,
        monthlyTasks: taskCategories.monthly,
        weeklyTasks: taskCategories.weekly,
        dailyTasks: taskCategories.daily,
        user: user
      })).unwrap()
      
      const taskId = result.taskId
      
      toast.success(
        <div className="flex flex-col space-y-2">
          <span className="font-semibold">🎉 Manual goal created successfully!</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                navigate(`/user/goal/${taskId}`)
                toast.dismiss()
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
            >
              View Goal
            </button>
            <button
              onClick={() => navigate('/user/home')}
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
      )
      
      // Reset form
      setFormData({ goalTitle: '', durationType: '', durationValue: '', totalDays: 30 })
      setTaskCategories({ monthly: [], weekly: [], daily: [] })
      setNewTask({
        monthly: { label: '', tasks: [''] },
        weekly: { label: '', tasks: [''] },
        daily: { label: '', tasks: [''] }
      })
      
    } catch (error) {
      toast.error(error.message || 'Failed to create manual goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabConfig = {
    monthly: { icon: Calendar, color: 'text-green-600', bg: 'bg-green-100', label: 'Monthly Tasks' },
    weekly: { icon: Target, color: 'text-green-500', bg: 'bg-green-50', label: 'Weekly Tasks' },
    daily: { icon: Clock, color: 'text-green-400', bg: 'bg-green-50', label: 'Daily Tasks' }
  }

  const TaskGroupCard = ({ group, category, groupIndex }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {group.label}
        </h4>
        <button
          onClick={() => removeTaskGroup(category, groupIndex)}
          className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <ul className="space-y-1">
        {group.tasks.map((task, taskIndex) => (
          <li key={taskIndex} className="text-sm text-gray-600 flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            {task}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Manual Goal
          </h1>
          <p className="text-gray-600">
            Design your own goal with custom tasks and timeline
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-500" />
              Goal Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  name="goalTitle"
                  value={formData.goalTitle}
                  onChange={handleFormChange}
                  placeholder="e.g., Learn Spanish, Build a Website"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration Type *
                  </label>
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                    disabled={isSubmitting}
                  >
                    <option value="">Select duration type</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration Value *
                  </label>
                  <select
                    name="durationValue"
                    value={formData.durationValue}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                    disabled={isSubmitting || !formData.durationType}
                  >
                    <option value="">Select {formData.durationType || 'duration'}</option>
                    {formData.durationType && durationOptions[formData.durationType].map(value => (
                      <option key={value} value={value}>
                        {value} {formData.durationType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.durationType && formData.durationValue && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-700">
                      <strong>Total Duration:</strong> {formData.durationValue} {formData.durationType} 
                      ({formData.totalDays} days)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-green-600">
                    Available task categories: {availableTabs.map(tab => tab.charAt(0).toUpperCase() + tab.slice(1)).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {formData.durationType && formData.durationValue && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Task Categories
              </h2>

              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                {availableTabs.map((category) => {
                  const { icon: Icon, label } = tabConfig[category]
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveTab(category)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        activeTab === category
                          ? 'bg-green-500 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  )
                })}
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-green-300 rounded-xl p-6 bg-green-50/50">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-green-500" />
                    Add {tabConfig[activeTab].label.replace(' Tasks', '')} Task Group
                  </h3>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newTask[activeTab].label}
                      onChange={(e) => updateTaskLabel(activeTab, e.target.value)}
                      placeholder={`Task group label (e.g., '${activeTab === 'monthly' ? 'Month 1 Milestones' : activeTab === 'weekly' ? 'Week 1 Activities' : 'Daily Habits'}')`}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-all"
                      disabled={isSubmitting}
                    />
                    
                    {newTask[activeTab].tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTaskText(activeTab, taskIndex, e.target.value)}
                          placeholder={`Task ${taskIndex + 1}`}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-all"
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => addTaskToGroup(activeTab, taskIndex)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          disabled={isSubmitting}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        {newTask[activeTab].tasks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTaskFromGroup(activeTab, taskIndex)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => addTaskGroup(activeTab)}
                      className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      disabled={isSubmitting}
                    >
                      Add Task Group
                    </button>
                  </div>
                </div>

                {taskCategories[activeTab].length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {tabConfig[activeTab].label} ({taskCategories[activeTab].length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {taskCategories[activeTab].map((group, groupIndex) => (
                        <TaskGroupCard
                          key={groupIndex}
                          group={group}
                          category={activeTab}
                          groupIndex={groupIndex}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.durationType && formData.durationValue && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || loading.createManualGoal}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  isSubmitting || loading.createManualGoal
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting || loading.createManualGoal ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Manual Goal...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Create Manual Goal</span>
                  </div>
                )}
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-green-50 px-4 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 text-green-500" />
            <span>
              {formData.durationType === 'days' && 'Perfect for short-term goals - focus on daily tasks'}
              {formData.durationType === 'weeks' && 'Great for medium-term goals - plan weekly milestones and daily actions'}
              {formData.durationType === 'months' && 'Ideal for long-term goals - organize by monthly phases, weekly progress, and daily habits'}
              {!formData.durationType && 'Select a duration to see available task categories'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualTask