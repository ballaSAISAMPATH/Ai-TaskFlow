const express = require('express');
const { getLandingStats } = require('../controllers/landingpage-controller');

const router = express.Router();

router.get('/landing', getLandingStats);

module.exports = router;