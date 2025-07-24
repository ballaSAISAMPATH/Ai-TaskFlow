import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getGoalById, updateDailyTaskStatus, updateWeeklyTaskStatus, updateMonthlyTaskStatus } from '@/store/task'
import { toast } from 'sonner'
import { ArrowLeft, Calendar, Clock, Target, CheckCircle2, Circle, CalendarDays, Timer } from 'lucide-react'

const GoalDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { goalId } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { selectedGoal, loading, error } = useSelector((state) => state.task)
    const [activeTab, setActiveTab] = useState('daily')

    useEffect(() => {
        if (user && goalId) {
            dispatch(getGoalById({ goalId, user }))
        }
    }, [dispatch, user, goalId])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
        console.log(error);
        
    }, [error])

    const handleTaskStatusUpdate = async (taskType, groupIndex, taskIndex, currentStatus) => {
        const newStatus = !currentStatus
        
        try {
            if (taskType === 'daily') {
                await dispatch(updateDailyTaskStatus({ 
                    goalId, 
                    taskIndex: groupIndex,
                    status: newStatus, 
                    user 
                })).unwrap()
            } else if (taskType === 'weekly') {
                await dispatch(updateWeeklyTaskStatus({ 
                    goalId, 
                    taskIndex: groupIndex,
                    status: newStatus, 
                    user 
                })).unwrap()
            } else if (taskType === 'monthly') {
                await dispatch(updateMonthlyTaskStatus({ 
                    goalId, 
                    taskIndex: groupIndex,
                    status: newStatus, 
                    user 
                })).unwrap()
            }
            
            // Refresh the goal data to get updated status
            await dispatch(getGoalById({ goalId, user }))
            
            toast.success(`Task ${newStatus ? 'completed' : 'marked as incomplete'}!`)
        } catch (error) {
            toast.error('Failed to update task status')
        }
    }

    const renderTaskList = (taskGroups, taskType) => {
        if (!taskGroups || taskGroups.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-gray-600">No {taskType} tasks available</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {taskGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm mr-3">
                                {group.label}
                            </span>
                            <span className="text-sm text-gray-600">
                                ({group.tasks?.filter(task => task.status).length || 0}/{group.tasks?.length || 0} completed)
                            </span>
                        </h3>
                        
                        {group.tasks && group.tasks.length > 0 ? (
                            <div className="space-y-3">
                                {group.tasks.map((taskContent, taskIndex) => (
                                    <div 
                                        key={taskIndex}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-all duration-200"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <button
                                                onClick={() => handleTaskStatusUpdate(taskType, groupIndex, taskIndex, group.status)}
                                                className="mt-1 flex-shrink-0"
                                            >
                                                {group.status ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <p className={`text-gray-800 ${group.status ? 'line-through text-gray-500' : ''}`}>
                                                    {taskContent}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">No tasks in this group</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const getCompletionStats = (taskGroups) => {
        if (!taskGroups || taskGroups.length === 0) return { completed: 0, total: 0, percentage: 0 }
        
        const completed = taskGroups.filter(group => group.status).length
        const total = taskGroups.length
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
        
        return { completed, total, percentage }
    }

    if (loading.getGoalById) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        )
    }

    if (!selectedGoal) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Goal not found</h3>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // Calculate stats after all early returns
    const dailyStats = getCompletionStats(selectedGoal?.dailyTasks)
    const weeklyStats = getCompletionStats(selectedGoal?.weeklyTasks)
    const monthlyStats = getCompletionStats(selectedGoal?.monthlyTasks)

    const overallStats = {
        completed: dailyStats.completed + weeklyStats.completed + monthlyStats.completed,
        total: dailyStats.total + weeklyStats.total + monthlyStats.total
    }
    overallStats.percentage = overallStats.total > 0 ? Math.round((overallStats.completed / overallStats.total) * 100) : 0

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        {selectedGoal.goalTitle}
                                    </h1>
                                    {selectedGoal.isCompleted && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1 text-green-500" />
                                        <span>{selectedGoal.duration}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                        <span>{selectedGoal.totalDays} days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
                {/* Progress Overview */}
                <div className={`rounded-lg p-6 mb-8 ${selectedGoal.isCompleted ? 'bg-green-100 border-2 border-green-300' : 'bg-green-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Overall Progress</h2>
                        {selectedGoal.isCompleted && (
                            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Goal Completed! 🎉
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {overallStats.percentage}%
                            </div>
                            <div className="text-gray-600 text-sm">Complete</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {dailyStats.completed}/{dailyStats.total}
                            </div>
                            <div className="text-gray-600 text-sm">Daily Tasks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {weeklyStats.completed}/{weeklyStats.total}
                            </div>
                            <div className="text-gray-600 text-sm">Weekly Tasks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {monthlyStats.completed}/{monthlyStats.total}
                            </div>
                            <div className="text-gray-600 text-sm">Monthly Tasks</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${overallStats.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="sticky top-[73px] bg-white border-b border-gray-200 z-10">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'daily', label: 'Daily Tasks', icon: Timer, count: dailyStats.total },
                                { id: 'weekly', label: 'Weekly Tasks', icon: CalendarDays, count: weeklyStats.total },
                                { id: 'monthly', label: 'Monthly Tasks', icon: Calendar, count: monthlyStats.total }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                        activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        activeTab === tab.id 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'daily' && renderTaskList(selectedGoal.dailyTasks, 'daily')}
                        {activeTab === 'weekly' && renderTaskList(selectedGoal.weeklyTasks, 'weekly')}
                        {activeTab === 'monthly' && renderTaskList(selectedGoal.monthlyTasks, 'monthly')}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GoalDetail