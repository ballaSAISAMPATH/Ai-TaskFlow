import { useDispatch } from 'react-redux'
import { updateDailyTaskStatus, updateWeeklyTaskStatus, updateMonthlyTaskStatus, getGoalById } from '@/store/task'
import { toast } from 'sonner'

export const useTaskActions = (goalId, user, moveAgentToNextLevel) => {
  const dispatch = useDispatch()

  const handleGroupStatusUpdate = async (taskType, groupIndex, status) => {
    try {
      const updateActions = {
        daily: updateDailyTaskStatus,
        weekly: updateWeeklyTaskStatus,
        monthly: updateMonthlyTaskStatus
      }

      const updateAction = updateActions[taskType]
      if (updateAction) {
        await dispatch(updateAction({ 
          goalId, 
          taskIndex: groupIndex,
          status, 
          user 
        })).unwrap()
      }

      await dispatch(getGoalById({ goalId, user }))
      toast.success(`Task group ${status ? 'completed' : 'marked as incomplete'}!`)
      
      if (status) {
        moveAgentToNextLevel()
      }
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  return { handleGroupStatusUpdate }
}