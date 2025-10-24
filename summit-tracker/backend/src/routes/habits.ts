import express from 'express';
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabit,
  getHabitStats,
  reorderHabits
} from '../controllers/habitsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getHabits);
router.post('/', createHabit);
router.post('/reorder', reorderHabits);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/log', logHabit);
router.get('/:id/stats', getHabitStats);

export default router;
