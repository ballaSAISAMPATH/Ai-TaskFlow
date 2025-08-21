import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllGoals } from '@/store/task'
import { toast } from 'sonner'
import { Plus, Target, Clock, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getGoalById } from '@/store/task'
import { deleteGoal } from '@/store/task'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[240px] flex flex-col animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
            
            <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="flex items-center mb-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>

            <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded mr-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    </div>
)

const UserHome = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { goals, loading, error } = useSelector((state) => state.task)

    useEffect(() => {
        if (user) {
            dispatch(getAllGoals({ user }))
        }
    }, [dispatch, user])

    useEffect(() => {
        if (error) {
            toast.error(error)
        }
    }, [error])

    const handleGoalClick = (goalId, event) => {
        // Prevent navigation if clicking on delete button area
        if (event.target.closest('[data-delete-button]')) {
            return
        }
        navigate(`/user/goal/${goalId}`)
    }

    const handleCreateNew = () => {
        navigate('/user/add-task')
        toast.info('Happy to see your initiation')
    }

    const handleDeleteGoal = (goalId, event) => {
        event.stopPropagation()
        dispatch(deleteGoal({ goalId, user }))
            .unwrap()
            .then(() => {
                toast.success('Goal deleted successfully')
                dispatch(getAllGoals({ user }))
            })
            .catch((error) => {
                toast.error(error?.message || 'Failed to delete goal')
            })
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusInfo = (goal) => {
        if (goal.isCompleted) {
            return {
                icon: CheckCircle,
                text: 'Completed',
                color: 'text-green-600',
                bgColor: 'bg-green-100'
            }
        } else {
            return {
                icon: XCircle,
                text: 'Pending',
                color: 'text-orange-600',
                bgColor: 'bg-orange-100'
            }
        }
    }

    if (loading.getAllGoals) {
        return (
            <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded mb-2 w-64 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-[240px] flex flex-col items-center justify-center animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-5 bg-gray-200 rounded mb-2 w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </div>
                        
                        {[...Array(8)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, {user?.userName || 'User'}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your goals and track your progress
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <div 
                        onClick={handleCreateNew}
                        className="bg-white border-2 border-dashed border-green-500 rounded-lg p-6 hover:border-green-600 hover:bg-green-50 transition-all duration-200 cursor-pointer group min-h-[240px] flex flex-col items-center justify-center"
                    >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Create New Goal</h3>
                        <p className="text-gray-600 text-center text-sm">
                            Start your journey towards achieving something amazing
                        </p>
                    </div>

                    {goals.map((goal) => {
                        const statusInfo = getStatusInfo(goal)
                        const StatusIcon = statusInfo.icon
                        
                        return (
                            <div 
                                key={goal._id}
                                onClick={(e) => handleGoalClick(goal._id, e)}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer group min-h-[240px] flex flex-col relative"
                            >
                                {/* Delete Button */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            data-delete-button="true"
                                            className="absolute top-4 right-4 w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-all duration-200 z-10 opacity-70 sm:opacity-0 group-hover:opacity-100"
                                            title="Delete Goal"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="z-[100] bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete "{goal.goalTitle}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={(e) => handleDeleteGoal(goal._id, e)}
                                                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4 pr-8">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                                            <Target className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                                        {goal.goalTitle}
                                    </h3>
                                    
                                    <div className="flex items-center text-gray-600 text-sm mb-2">
                                        <Clock className="w-4 h-4 mr-2 text-green-500" />
                                        <span>{goal.duration}</span>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-xs">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        <span>Created: {formatDate(goal.createdAt)}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Click to view details</span>
                                        <div className="w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {goals.length === 0 && !loading.getAllGoals && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            No goals yet
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start your journey by creating your first goal. Set targets, track progress, and achieve more than you ever thought possible.
                        </p>
                        <button 
                            onClick={handleCreateNew}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Goal
                        </button>
                    </div>
                )}

                {goals.length > 0 && (
                    <div className="mt-12 bg-green-50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    {goals.length}
                                </div>
                                <div className="text-gray-600 text-sm">Total Goals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {goals.filter(goal => !goal.isCompleted).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">Pending Goals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    {goals.filter(goal => goal.isCompleted).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">Completed Goals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600 mb-1">
                                    {Math.round((goals.filter(goal => goal.isCompleted).length / goals.length) * 100) || 0}%
                                </div>
                                <div className="text-gray-600 text-sm">Success Rate</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserHome