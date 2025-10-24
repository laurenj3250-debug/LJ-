import express from 'express';
import {
  getMoodLogs,
  getTodayMood,
  createMoodLog,
  deleteMoodLog
} from '../controllers/moodController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMoodLogs);
router.get('/today', getTodayMood);
router.post('/', createMoodLog);
router.delete('/:id', deleteMoodLog);

export default router;
