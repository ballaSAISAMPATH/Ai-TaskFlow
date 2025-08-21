const Goal = require('../models/goal'); 
const getDashboardAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); 
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); 
    startDate.setHours(0, 0, 0, 0); 
    
    console.log(`Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    
    const goals = await Goal.find({
      userId: userId
    }).select('goalTitle isCompleted monthlyTasks weeklyTasks dailyTasks updatedAt createdAt');
    
    console.log(`Found ${goals.length} goals for user ${userId}`);
    
    const analyticsData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      currentDate.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(0, 0, 0, 0);
      
      const isToday = currentDate.toDateString() === today.toDateString();
      console.log(`\n=== Checking ${currentDate.toISOString().split('T')[0]} (${currentDate.toLocaleDateString('en-US', { weekday: 'short' })}) ${isToday ? '- TODAY' : ''} ===`);
      
      // Count goals completed ON this specific day
      const completedGoals = goals.filter(goal => {
        if (!goal.isCompleted) return false;
        
        const completedDate = new Date(goal.updatedAt);
        const isInRange = completedDate >= currentDate && completedDate < nextDate;
        
        if (isInRange) {
          console.log(`✅ Goal completed: ${goal.goalTitle} on ${completedDate.toISOString().split('T')[0]}`);
        }
        
        return isInRange;
      }).length;
      
      // Count task groups completed ON this specific day
      let completedTaskGroups = 0;
      
      goals.forEach(goal => {
        console.log(`\nGoal: ${goal.goalTitle}`);
        console.log(`  Monthly task groups: ${goal.monthlyTasks?.length || 0}`);
        console.log(`  Weekly task groups: ${goal.weeklyTasks?.length || 0}`);
        console.log(`  Daily task groups: ${goal.dailyTasks?.length || 0}`);
        
        // Check monthly task groups
        if (goal.monthlyTasks && goal.monthlyTasks.length > 0) {
          goal.monthlyTasks.forEach((taskGroup, groupIndex) => {
            console.log(`  Monthly Group ${groupIndex}: ${taskGroup.label} - Status: ${taskGroup.status}`);
            if (taskGroup.status) {
              const taskDate = taskGroup.updatedAt || goal.updatedAt;
              const taskDateObj = new Date(taskDate);
              const isInRange = taskDateObj >= currentDate && taskDateObj < nextDate;
              
              if (isInRange) {
                completedTaskGroups++;
                console.log(`    ✅ Monthly task group completed: ${taskGroup.label} on ${taskDateObj.toISOString().split('T')[0]}`);
              }
            }
          });
        }
        
        if (goal.weeklyTasks && goal.weeklyTasks.length > 0) {
          goal.weeklyTasks.forEach((taskGroup, groupIndex) => {
            console.log(`  Weekly Group ${groupIndex}: ${taskGroup.label} - Status: ${taskGroup.status}`);
            if (taskGroup.status) {
              const taskDate = taskGroup.updatedAt || goal.updatedAt;
              const taskDateObj = new Date(taskDate);
              const isInRange = taskDateObj >= currentDate && taskDateObj < nextDate;
              
              if (isInRange) {
                completedTaskGroups++;
                console.log(`    ✅ Weekly task group completed: ${taskGroup.label} on ${taskDateObj.toISOString().split('T')[0]}`);
              }
            }
          });
        }
        
        if (goal.dailyTasks && goal.dailyTasks.length > 0) {
          goal.dailyTasks.forEach((taskGroup, groupIndex) => {
            console.log(`  Daily Group ${groupIndex}: ${taskGroup.label} - Status: ${taskGroup.status}`);
            if (taskGroup.status) {
              const taskDate = taskGroup.updatedAt || goal.updatedAt;
              const taskDateObj = new Date(taskDate);
              const isInRange = taskDateObj >= currentDate && taskDateObj < nextDate;
              
              if (isInRange) {
                completedTaskGroups++;
                console.log(`    ✅ Daily task group completed: ${taskGroup.label} on ${taskDateObj.toISOString().split('T')[0]}`);
              }
            }
          });
        }
      });
      
      analyticsData.push({
        date: currentDate.toISOString().split('T')[0], 
        day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        completedGoals: completedGoals,
        completedTasks: completedTaskGroups 
      });
      
      console.log(`Summary for ${currentDate.toISOString().split('T')[0]}: Goals: ${completedGoals}, Task Groups: ${completedTaskGroups}`);
    }
    
    console.log('\n=== FINAL ANALYTICS DATA ===');
    analyticsData.forEach(day => {
      console.log(`${day.date} (${day.day}): Goals: ${day.completedGoals}, Task Groups: ${day.completedTasks}`);
    });
    
    const totalCompletedGoals = analyticsData.reduce((sum, day) => sum + day.completedGoals, 0);
    const totalCompletedTaskGroups = analyticsData.reduce((sum, day) => sum + day.completedTasks, 0);
    
    res.status(200).json({
      success: true,
      data: {
        dailyAnalytics: analyticsData,
        summary: {
          totalCompletedGoals,
          totalCompletedTasks: totalCompletedTaskGroups,
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