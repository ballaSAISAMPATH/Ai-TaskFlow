export const getStars = (taskStates, taskType, groupIndex) => {
  const getTaskCompletionCount = (taskType, groupIndex) => {
    if (!taskStates[taskType][groupIndex]) return { completed: 0, total: 0 }

    const groupTasks = taskStates[taskType][groupIndex]
    const completed = Object.values(groupTasks).filter(status => status === true).length
    const total = Object.keys(groupTasks).length

    return { completed, total }
  }

  const { completed, total } = getTaskCompletionCount(taskType, groupIndex)
  if (total === 0) return 0
  
  const percentage = (completed / total) * 100
  if (percentage === 100) return 3
  if (percentage >= 66) return 2
  if (percentage >= 33) return 1
  return 0
}

export const isLevelUnlocked = (levelIndex, allLevels) => {
  if (levelIndex === 0) return true
  const prevLevel = allLevels[levelIndex - 1]
  return prevLevel?.status || false
}

export const getOverallProgress = (allLevels) => {
  const completed = allLevels.filter(level => level.status).length
  const total = allLevels.length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { completed, total, percentage }
}