import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getDailyLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { date, start_date, end_date } = req.query;

    let queryText = 'SELECT * FROM daily_logs WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 1;

    if (date) {
      paramCount++;
      queryText += ` AND log_date = $${paramCount}`;
      params.push(date);
    } else {
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
    }

    queryText += ' ORDER BY log_date DESC, created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDailyLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { log_date, entry_type, content, priority, goal_id } = req.body;

    if (!entry_type || !content) {
      res.status(400).json({ error: 'Entry type and content are required' });
      return;
    }

    const result = await query(
      `INSERT INTO daily_logs (user_id, log_date, entry_type, content, priority, goal_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        log_date || new Date().toISOString().split('T')[0],
        entry_type,
        content,
        priority,
        goal_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create daily log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDailyLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { content, status, priority, goal_id } = req.body;

    const result = await query(
      `UPDATE daily_logs
       SET content = COALESCE($1, content),
           status = COALESCE($2, status),
           priority = COALESCE($3, priority),
           goal_id = COALESCE($4, goal_id)
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [content, status, priority, goal_id, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Daily log not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update daily log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteDailyLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM daily_logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Daily log not found' });
      return;
    }

    res.json({ message: 'Daily log deleted successfully' });
  } catch (error) {
    console.error('Delete daily log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
