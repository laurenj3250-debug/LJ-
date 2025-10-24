import express from 'express';
import {
  getDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog
} from '../controllers/logsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getDailyLogs);
router.post('/', createDailyLog);
router.put('/:id', updateDailyLog);
router.delete('/:id', deleteDailyLog);

export default router;
