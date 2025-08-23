const LoginHistory = require('../models/loginHistory');

// Helper function to log login event
const logLoginEvent = async (userId, name, email) => {
  try {
    await LoginHistory.create({
      userId,
      name,
      email,
      loginTime: new Date()
    });
  } catch (error) {
    console.error('Error logging login event:', error);
  }
};

// Get last 10 recent logins
const getRecentLogins = async (req, res) => {
  try {
    // Aggregate to get last 10 unique users by email with their most recent login
    const recentLogins = await LoginHistory.aggregate([
      {
        $sort: { loginTime: -1 }
      },
      {
        $group: {
          _id: "$email",
          name: { $first: "$name" },
          email: { $first: "$email" },
          lastLogin: { $first: "$loginTime" },
          userId: { $first: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userExists"
        }
      },
      {
        $addFields: {
          isUserDeleted: { $eq: [{ $size: "$userExists" }, 0] }
        }
      },
      {
        $sort: { lastLogin: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          lastLogin: 1,
          isUserDeleted: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: recentLogins
    });
  } catch (error) {
    console.error('Error fetching recent logins:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent logins'
    });
  }
};

module.exports = {
  logLoginEvent,
  getRecentLogins
};