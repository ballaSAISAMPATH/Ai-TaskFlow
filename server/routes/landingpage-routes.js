const express = require('express');
const { getLandingStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/landing', getLandingStats);

module.exports = router;