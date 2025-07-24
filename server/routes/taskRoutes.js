const express = require('express');
const router = express.Router();
const  {createGoal,getAllGoals,getGoalById,updateGoal,updateDailyTaskStatus,updateWeeklyTaskStatus,updateMonthlyTaskStatus,getDailyTasks
  ,getWeeklyTasks,getMonthlyTasks,deleteGoal,getGoalStats
} =require('../controllers/task-controller');
router.post('/create', createGoal);
router.post('/displayAll', getAllGoals);
router.post('/stats', getGoalStats);
router.post('/goal/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

router.get('/:id/daily-tasks', getDailyTasks);
router.patch('/:id/daily-tasks/status', updateDailyTaskStatus);

router.get('/:id/weekly-tasks', getWeeklyTasks);
router.patch('/:id/weekly-tasks/status', updateWeeklyTaskStatus);

router.get('/:id/monthly-tasks', getMonthlyTasks);
router.patch('/:id/monthly-tasks/status', updateMonthlyTaskStatus);

module.exports = router;