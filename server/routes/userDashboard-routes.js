const express = require("express");
const { getDashboardAnalytics } = require("../controllers/userDashboard-controller");

const router = express.Router();

// Analytics for graphs only (7-day data)
router.get('/dashboard/analytics/:userId', getDashboardAnalytics);

module.exports = router;