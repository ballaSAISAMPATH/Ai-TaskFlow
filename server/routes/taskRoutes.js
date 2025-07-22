const express = require('express');
const {askGemini} = require('../controllers/task-controller')
const router = express.Router();

router.post('/query',askGemini)

module.exports = router;
