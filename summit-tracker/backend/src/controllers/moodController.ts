import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getMoodLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    let queryText = 'SELECT * FROM mood_logs WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 1;

    if (start_date) {
      paramCount++;
      queryText += ` AND log_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      queryText += ` AND log_date <= $${paramCount}`;
      params.push(end_date);
    }

    queryText += ' ORDER BY log_date DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get mood logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTodayMood = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const today = new Date().toISOString().split('T')[0];

    const result = await query(
      'SELECT * FROM mood_logs WHERE user_id = $1 AND log_date = $2',
      [userId, today]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'No mood logged today' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMoodLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { mood, energy_level, note, log_date } = req.body;

    if (!mood) {
      res.status(400).json({ error: 'Mood is required' });
      return;
    }

    const result = await query(
      `INSERT INTO mood_logs (user_id, mood, energy_level, note, log_date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, log_date)
       DO UPDATE SET mood = $2, energy_level = $3, note = $4
       RETURNING *`,
      [userId, mood, energy_level, note, log_date || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create mood log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMoodLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM mood_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Mood log not found' });
      return;
    }

    res.json({ message: 'Mood log deleted successfully' });
  } catch (error) {
    console.error('Delete mood log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
