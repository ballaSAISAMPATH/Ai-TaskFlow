import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createGoal } from '@/store/task'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const AddTask = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.task)
  
  const [formData, setFormData] = useState({
    task: '',
    duration: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.task.trim() || !formData.duration.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    if (!user || !user.id) {
      toast.error('User authentication required')
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await dispatch(createGoal({
        goal: formData.task.trim(),
        duration: formData.duration.trim(),
        user: user
      })).unwrap()
      
      const taskId = result.taskId
      
      toast.success(
        <div className="flex flex-col space-y-2">
          <span className="font-semibold">🎉 Goal created successfully!</span>
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
      
      setFormData({
        task: '',
        duration: ''
      })
      
      console.log('Goal created with ID:', taskId)
    } catch (error) {
      toast.error(error.message || 'Failed to create goal')
      console.error('Failed to create goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewGoalDirectly = () => {
    navigate('/user/home')
  }

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:bg-transparent bg-gray-50 min-h-screen md:min-h-0 pt-20 md:pt-0">
      <div className="w-full max-w-2xl md:max-w-none mx-auto md:mx-0">
        <div className="mb-6 sm:mb-8 text-center sm:text-left md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-2">
            Add New Task
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-base">
            Create a new goal and set your timeline
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="space-y-5 sm:space-y-6 md:space-y-6">
              <div>
                <label htmlFor="task" className="block text-sm font-semibold text-gray-700 mb-2">
                  What's your goal? *
                </label>
                <div className="md:hidden">
                  <textarea
                    id="task"
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    placeholder="e.g., Learn React.js, Get fit, Write a book"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none text-sm"
                    disabled={isSubmitting || loading.createGoal}
                  />
                </div>
                <div className="hidden md:block">
                  <input
                    type="text"
                    id="task-desktop"
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    placeholder="e.g., Learn React.js, Get fit, Write a book"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    disabled={isSubmitting || loading.createGoal}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 1 month, 3 weeks, 90 days"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm md:text-base"
                  disabled={isSubmitting || loading.createGoal}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Recommended: Try "1 week", "1 month", "3 months", or "6 months"
                </p>
              </div>

              {user && (
                <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 p-3 md:p-3 rounded-xl">
                  <div className="w-8 h-8 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-semibold">
                      {(user.name || user.email || user.userName || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs md:text-sm">Creating goal for:</span>
                    <div className="font-medium text-gray-900 truncate md:text-sm">
                      {user.name || user.userName || user.email || user.id}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || loading.createGoal || !formData.task.trim() || !formData.duration.trim()}
                className={`w-full py-3 md:py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform text-sm md:text-base ${
                  isSubmitting || loading.createGoal
                    ? 'bg-gray-400 cursor-not-allowed'
                    : formData.task.trim() && formData.duration.trim()
                    ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 md:hover:scale-[1.02] shadow-lg hover:shadow-xl active:scale-[0.98]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isSubmitting || loading.createGoal ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Goal...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Create Goal</span>
                  </div>
                )}
              </button>

              <div className="text-center">
                <div className="inline-flex items-start space-x-2 text-xs sm:text-sm text-gray-500 bg-green-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg max-w-full">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-left">Your goal will be broken down into manageable daily tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8 sm:h-12"></div>
      </div>
    </div>
  )
}

export default AddTask