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

module.exports = {
  getDashboardAnalytics
};