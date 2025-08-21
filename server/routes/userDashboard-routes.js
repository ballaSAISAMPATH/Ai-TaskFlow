const express = require("express");
const {
    getDashboardAnalytics,
    getDashboardSummary,
    getGoalsOverview,
    getTaskCategoryAnalytics
} = require("../controllers/userDashboard-controller");

const router = express.Router();

// 1. 7-day analytics for graphs (your existing route)
router.get('/dashboard/analytics/:userId', getDashboardAnalytics);

// 2. Overall summary statistics
router.get('/dashboard/summary/:userId', getDashboardSummary);

// 3. Goals overview with task progress
router.get('/dashboard/goals/:userId', getGoalsOverview);

// 4. Task performance by category (monthly/weekly/daily)
router.get('/dashboard/tasks/categories/:userId', getTaskCategoryAnalytics);

module.exports = router;