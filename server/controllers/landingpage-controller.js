const Goal = require('../models/goal');
const User = require('../models/User');

const getLandingStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const totalGoals = await Goal.countDocuments();
    
    const completedGoals = await Goal.countDocuments({ isCompleted: true });
    
    const activeGoals = await Goal.countDocuments({ isCompleted: false });
    
    const completionRate = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).toFixed(1) : 0;
    
    const durationStats = await Goal.aggregate([
      { $group: { _id: '$duration', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const mostPopularDuration = durationStats.length > 0 ? durationStats[0]._id : 'N/A';
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const recentGoals = await Goal.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const avgGoalsPerUser = totalUsers > 0 ? (totalGoals / totalUsers).toFixed(1) : 0;

    const stats = {
      users: {
        total: totalUsers,
        recentSignups: recentUsers
      },
      goals: {
        total: totalGoals,
        completed: completedGoals,
        active: activeGoals,
        recent: recentGoals,
        completionRate: parseFloat(completionRate),
        avgPerUser: parseFloat(avgGoalsPerUser)
      },
      insights: {
        mostPopularDuration,
        totalTasksCreated: await getTotalTasksCount()
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Error fetching landing stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

const getTotalTasksCount = async () => {
  try {
    const result = await Goal.aggregate([
      {
        $project: {
          totalTasks: {
            $add: [
              { $size: { $ifNull: ['$monthlyTasks', []] } },
              { $size: { $ifNull: ['$weeklyTasks', []] } },
              { $size: { $ifNull: ['$dailyTasks', []] } }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalTasksCount: { $sum: '$totalTasks' }
        }
      }
    ]);
    
    return result.length > 0 ? result[0].totalTasksCount : 0;
  } catch (error) {
    console.error('Error counting total tasks:', error);
    return 0;
  }
};

const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    const userGoals = await Goal.countDocuments({ userId });
    
    const userCompletedGoals = await Goal.countDocuments({ 
      userId, 
      isCompleted: true 
    });
    
    const userActiveGoals = await Goal.countDocuments({ 
      userId, 
      isCompleted: false 
    });
    
    const userCompletionRate = userGoals > 0 ? 
      ((userCompletedGoals / userGoals) * 100).toFixed(1) : 0;
    
    const recentGoal = await Goal.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('goalTitle createdAt');
    
    const userTasksCount = await Goal.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $project: {
          totalTasks: {
            $add: [
              { $size: { $ifNull: ['$monthlyTasks', []] } },
              { $size: { $ifNull: ['$weeklyTasks', []] } },
              { $size: { $ifNull: ['$dailyTasks', []] } }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalTasksCount: { $sum: '$totalTasks' }
        }
      }
    ]);
    
    const totalUserTasks = userTasksCount.length > 0 ? userTasksCount[0].totalTasksCount : 0;
    
    const userStats = {
      goals: {
        total: userGoals,
        completed: userCompletedGoals,
        active: userActiveGoals,
        completionRate: parseFloat(userCompletionRate)
      },
      tasks: {
        total: totalUserTasks
      },
      recent: {
        goal: recentGoal
      }
    };

    res.status(200).json({
      success: true,
      data: userStats
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
      error: error.message
    });
  }
};

module.exports = {
  getLandingStats,
  getUserStats
};