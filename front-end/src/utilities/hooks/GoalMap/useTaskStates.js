import { useState, useEffect } from 'react'

export const useTaskStates = (selectedGoal) => {
  const [taskStates, setTaskStates] = useState({
    daily: {},
    weekly: {},
    monthly: {}
  })

  const initializeTaskStates = (taskGroups, taskType) => {
    const states = {}
    taskGroups?.forEach((group, groupIndex) => {
      states[groupIndex] = {}
      group.tasks?.forEach((_, taskIndex) => {
        states[groupIndex][taskIndex] = group.status || false
      })
    })
    return states
  }

  useEffect(() => {
    if (selectedGoal) {
      setTaskStates({
        daily: initializeTaskStates(selectedGoal.dailyTasks, 'daily'),
        weekly: initializeTaskStates(selectedGoal.weeklyTasks, 'weekly'),
        monthly: initializeTaskStates(selectedGoal.monthlyTasks, 'monthly')
      })
    }
  }, [selectedGoal])

  const getTaskCompletionCount = (taskType, groupIndex) => {
    if (!taskStates[taskType][groupIndex]) return { completed: 0, total: 0 }

    const groupTasks = taskStates[taskType][groupIndex]
    const completed = Object.values(groupTasks).filter(status => status === true).length
    const total = Object.keys(groupTasks).length

    return { completed, total }
  }

  const isTaskCompleted = (taskType, groupIndex, taskIndex) => {
    return taskStates[taskType][groupIndex]?.[taskIndex] || false
  }

  return {
    taskStates,
    setTaskStates,
    getTaskCompletionCount,
    isTaskCompleted
  }
}
