import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal, reorderGoals } from '../controllers/goalsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getGoals);
router.post('/', createGoal);
router.post('/reorder', reorderGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
