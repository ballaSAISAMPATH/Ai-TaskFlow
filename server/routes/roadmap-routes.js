const Router = require('express')
const {generateRoadmapController} = require('../controllers/roadMap-controller.js');
const router = Router();

router.post("/roadmap/generation",generateRoadmapController);

module.exports= router;