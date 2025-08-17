const express = require('express');
const { getLandingStats, getUserStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/landing', getLandingStats);

router.get('/user', getUserStats);

module.exports = router;