import Goal from '../models/goal.js';

const getDashboardAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();

    today.setHours(23, 59, 59, 999);

    const lastWeekSameDay = new Date(today);
    lastWeekSameDay.setDate(today.getDate() - 7);
    lastWeekSameDay.setHours(0, 0, 0, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goals = await Goal.find({ userId })
      .select('goalTitle isCompleted monthlyTasks weeklyTasks dailyTasks updatedAt createdAt');

    const analyticsData = [];

    let currentDate = new Date(lastWeekSameDay);

    while (currentDate <= today) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);

      const completedGoals = goals.filter(goal => {
        if (!goal.isCompleted) return false;
        const completedDate = new Date(goal.updatedAt);
        return completedDate >= currentDate && completedDate < nextDate;
      }).length;

      let completedTaskGroups = 0;

      goals.forEach(goal => {
        const checkTasks = (taskArray) => {
          if (taskArray && taskArray.length > 0) {
            taskArray.forEach(taskGroup => {
              if (taskGroup.status) {
                const taskDate = taskGroup.updatedAt || goal.updatedAt;
                const taskDateObj = new Date(taskDate);
                if (taskDateObj >= currentDate && taskDateObj < nextDate) {
                  completedTaskGroups++;
                }
              }
            });
          }
        };
        checkTasks(goal.monthlyTasks);
        checkTasks(goal.weeklyTasks);
        checkTasks(goal.dailyTasks);
      });

      analyticsData.push({
        date: currentDate.toISOString().split('T')[0],
        day: dayNames[currentDate.getDay()],
        completedGoals,
        completedTasks: completedTaskGroups
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalCompletedGoals = analyticsData.reduce((sum, day) => sum + day.completedGoals, 0);
    const totalCompletedTasks = analyticsData.reduce((sum, day) => sum + day.completedTasks, 0);

    res.status(200).json({
      success: true,
      data: {
        dailyAnalytics: analyticsData,
        summary: {
          totalCompletedGoals,
          totalCompletedTasks,
          dateRange: {
            start: lastWeekSameDay.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0]
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
};

export {
  getDashboardAnalytics
};