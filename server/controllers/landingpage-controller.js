const Goal = require('../models/goal');
const User = require('../models/User');

const getLandingStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const completedGoals = await Goal.countDocuments({ isCompleted: true });
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: thirtyDaysAgo }
    });
    
    const stats = {
      totalUsers,
      activeUsers,
      totalGoals,
      completedGoals,
      successRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
    };

    res.json({ success: true, data: stats });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLandingStats };