const express = require("express");
const { 
  getTasksCompletedLast7Days, 
  getGoalsCompletedLast7Days 
} = require("../controllers/userDashboard-controller");

const router = express.Router();

// GET /api/dashboard/tasks/:userId
router.get("/tasks/:userId", getTasksCompletedLast7Days);

// GET /api/dashboard/goals/:userId
router.get("/goals/:userId", getGoalsCompletedLast7Days);

module.exports = router;
