import express from 'express';
import {
  createGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
  updateDailyTaskStatus,
  updateWeeklyTaskStatus,
  updateMonthlyTaskStatus,
  getDailyTasks,
  getWeeklyTasks,
  getMonthlyTasks,
  deleteGoal,
  getGoalStats,
  addManualTask
} from '../controllers/task-controller.js';

const router = express.Router();

router.post('/create', createGoal);
router.post('/displayAll', getAllGoals);
router.post('/stats', getGoalStats);
router.post('/goal/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/add-manual', addManualTask);

router.get('/:id/daily-tasks', getDailyTasks);
router.patch('/:id/daily-tasks/status', updateDailyTaskStatus);

router.get('/:id/weekly-tasks', getWeeklyTasks);
router.patch('/:id/weekly-tasks/status', updateWeeklyTaskStatus);

router.get('/:id/monthly-tasks', getMonthlyTasks);
router.patch('/:id/monthly-tasks/status', updateMonthlyTaskStatus);

export default router;