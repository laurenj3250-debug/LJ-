import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, status } = req.query;

    let queryText = 'SELECT * FROM goals WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 1;

    if (type) {
      paramCount++;
      queryText += ` AND goal_type = $${paramCount}`;
      params.push(type);
    }

    if (status) {
      paramCount++;
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
    }

    queryText += ' ORDER BY target_date ASC, created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description, goal_type, target_date } = req.body;

    if (!title || !goal_type) {
      res.status(400).json({ error: 'Title and goal type are required' });
      return;
    }

    const result = await query(
      `INSERT INTO goals (user_id, title, description, goal_type, target_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, description, goal_type, target_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, goal_type, target_date, status, progress } = req.body;

    const result = await query(
      `UPDATE goals
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           goal_type = COALESCE($3, goal_type),
           target_date = COALESCE($4, target_date),
           status = COALESCE($5, status),
           progress = COALESCE($6, progress)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, description, goal_type, target_date, status, progress, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
