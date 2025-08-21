const mongoose = require("mongoose");
const Goal = require("./models/Goal");
async function getGoalsCompletedLast7Days(userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await Goal.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId), 
        createdAt: { $gte: sevenDaysAgo },
        isCompleted: true
      } 
    },
    { 
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        completedGoals: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return data;
}

async function getTasksCompletedLast7Days(userId) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await Goal.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sevenDaysAgo } } },
    { $project: {
        createdAt: 1,
        dailyTasks: {
          $filter: {
            input: "$dailyTasks",
            as: "task",
            cond: { $eq: ["$$task.status", true] }
          }
        }
      }
    },
    { $unwind: "$dailyTasks" },
    { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        completedCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return data;
}

module.exports ={getGoalsCompletedLast7Days,getTasksCompletedLast7Days}