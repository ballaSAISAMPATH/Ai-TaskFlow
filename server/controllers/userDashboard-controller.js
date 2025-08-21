const Goal = require('../models/goal'); // Adjust path as needed

const getDashboardAnalytics = async (req, res) => {
  try {
    const { userId } = req.params; // or get from req.user if using auth middleware
    
    // Calculate date range for last 7 days
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // End of today
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // 7 days ago (including today)
    startDate.setHours(0, 0, 0, 0); // Start of that day
    
    // Fetch goals updated in the last 7 days for the user
    const goals = await Goal.find({
      userId: userId,
      updatedAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('isCompleted monthlyTasks weeklyTasks dailyTasks updatedAt');
    
    // Initialize data structure for 7 days
    const analyticsData = [];
    
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      // Filter goals updated on this specific day
      const dayGoals = goals.filter(goal => {
        const goalDate = new Date(goal.updatedAt);
        return goalDate >= currentDate && goalDate < nextDate;
      });
      
      // Count completed goals for this day
      const completedGoals = dayGoals.filter(goal => goal.isCompleted).length;
      
      // Count completed tasks for this day
      let completedTasks = 0;
      dayGoals.forEach(goal => {
        // Count completed monthly tasks
        goal.monthlyTasks.forEach(taskGroup => {
          if (taskGroup.status) completedTasks++;
        });
        
        // Count completed weekly tasks
        goal.weeklyTasks.forEach(taskGroup => {
          if (taskGroup.status) completedTasks++;
        });
        
        // Count completed daily tasks
        goal.dailyTasks.forEach(taskGroup => {
          if (taskGroup.status) completedTasks++;
        });
      });
      
      analyticsData.push({
        date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
        day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        completedGoals: completedGoals,
        completedTasks: completedTasks
      });
    }
    
    // Calculate summary statistics
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
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
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

// Get user dashboard summary statistics
const getDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const goals = await Goal.find({ userId: userId });
    
    // Calculate summary statistics
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.isCompleted).length;
    const activeGoals = totalGoals - completedGoals;
    
    // Calculate total tasks across all goals
    let totalTasks = 0;
    let completedTasks = 0;
    
    goals.forEach(goal => {
      // Count all task groups
      const allTaskGroups = [
        ...goal.monthlyTasks,
        ...goal.weeklyTasks,
        ...goal.dailyTasks
      ];
      
      totalTasks += allTaskGroups.length;
      completedTasks += allTaskGroups.filter(taskGroup => taskGroup.status).length;
    });
    
    // Calculate completion rates
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Get recent activity (goals updated in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentlyUpdatedGoals = goals.filter(goal => 
      new Date(goal.updatedAt) >= thirtyDaysAgo
    ).length;
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalGoals,
          completedGoals,
          activeGoals,
          totalTasks,
          completedTasks,
          goalCompletionRate,
          taskCompletionRate
        },
        activity: {
          recentlyUpdatedGoals,
          lastUpdated: goals.length > 0 ? Math.max(...goals.map(g => new Date(g.updatedAt))) : null
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message
    });
  }
};

// Get goals grouped by completion status with task details
const getGoalsOverview = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const goals = await Goal.find({ userId: userId })
      .select('goalTitle totalDays duration isCompleted monthlyTasks weeklyTasks dailyTasks createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    // Group goals and add task statistics
    const goalsWithStats = goals.map(goal => {
      const allTaskGroups = [
        ...goal.monthlyTasks,
        ...goal.weeklyTasks,
        ...goal.dailyTasks
      ];
      
      const totalTaskGroups = allTaskGroups.length;
      const completedTaskGroups = allTaskGroups.filter(tg => tg.status).length;
      const taskProgress = totalTaskGroups > 0 ? Math.round((completedTaskGroups / totalTaskGroups) * 100) : 0;
      
      return {
        _id: goal._id,
        goalTitle: goal.goalTitle,
        totalDays: goal.totalDays,
        duration: goal.duration,
        isCompleted: goal.isCompleted,
        taskProgress,
        totalTaskGroups,
        completedTaskGroups,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt
      };
    });
    
    // Separate into completed and active
    const completedGoals = goalsWithStats.filter(goal => goal.isCompleted);
    const activeGoals = goalsWithStats.filter(goal => !goal.isCompleted);
    
    res.status(200).json({
      success: true,
      data: {
        activeGoals,
        completedGoals,
        counts: {
          total: goals.length,
          active: activeGoals.length,
          completed: completedGoals.length
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching goals overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals overview',
      error: error.message
    });
  }
};

// Get task performance by category (monthly, weekly, daily)
const getTaskCategoryAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const goals = await Goal.find({ userId: userId });
    
    let monthlyStats = { total: 0, completed: 0 };
    let weeklyStats = { total: 0, completed: 0 };
    let dailyStats = { total: 0, completed: 0 };
    
    goals.forEach(goal => {
      // Monthly tasks
      monthlyStats.total += goal.monthlyTasks.length;
      monthlyStats.completed += goal.monthlyTasks.filter(task => task.status).length;
      
      // Weekly tasks
      weeklyStats.total += goal.weeklyTasks.length;
      weeklyStats.completed += goal.weeklyTasks.filter(task => task.status).length;
      
      // Daily tasks
      dailyStats.total += goal.dailyTasks.length;
      dailyStats.completed += goal.dailyTasks.filter(task => task.status).length;
    });
    
    // Calculate completion rates
    const calculateRate = (completed, total) => total > 0 ? Math.round((completed / total) * 100) : 0;
    
    res.status(200).json({
      success: true,
      data: {
        taskCategories: {
          monthly: {
            ...monthlyStats,
            completionRate: calculateRate(monthlyStats.completed, monthlyStats.total)
          },
          weekly: {
            ...weeklyStats,
            completionRate: calculateRate(weeklyStats.completed, weeklyStats.total)
          },
          daily: {
            ...dailyStats,
            completionRate: calculateRate(dailyStats.completed, dailyStats.total)
          }
        },
        overall: {
          totalTasks: monthlyStats.total + weeklyStats.total + dailyStats.total,
          completedTasks: monthlyStats.completed + weeklyStats.completed + dailyStats.completed
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching task category analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task category analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getDashboardSummary,
  getGoalsOverview,
  getTaskCategoryAnalytics
};
