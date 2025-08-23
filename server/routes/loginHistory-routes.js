const express = require('express');
const router = express.Router();
const { getRecentLogins } = require('../controllers/historylogin-controller');

router.get('/recent-logins', getRecentLogins);

module.exports = router;