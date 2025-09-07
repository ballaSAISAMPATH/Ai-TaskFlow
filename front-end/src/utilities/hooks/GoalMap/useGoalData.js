import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getGoalById } from '@/store/task'

export const useGoalData = (goalId, user) => {
  const dispatch = useDispatch()
  const { selectedGoal, loading, error } = useSelector((state) => state.task)
  const [allLevels, setAllLevels] = useState([])

  useEffect(() => {
    if (user && goalId) {
      dispatch(getGoalById({ goalId, user }))
    }
  }, [dispatch, user, goalId])

  useEffect(() => {
    if (selectedGoal) {
      const newAllLevels = []
      
      selectedGoal.dailyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'daily', index })
      })

      selectedGoal.weeklyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'weekly', index })
      })

      selectedGoal.monthlyTasks?.forEach((group, index) => {
        newAllLevels.push({ ...group, type: 'monthly', index })
      })

      setAllLevels(newAllLevels)
    }
  }, [selectedGoal])

  return {
    selectedGoal,
    loading,
    error,
    allLevels
  }
}