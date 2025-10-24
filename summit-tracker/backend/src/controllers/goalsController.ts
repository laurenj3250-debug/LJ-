import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, status } = req.query;

    let queryText = `
      SELECT g.*,
             COALESCE(json_agg(
               json_build_object('id', sg.id, 'title', sg.title, 'progress', sg.progress, 'status', sg.status, 'display_order', sg.display_order)
               ORDER BY sg.display_order, sg.created_at
             ) FILTER (WHERE sg.id IS NOT NULL), '[]') as sub_goals
      FROM goals g
      LEFT JOIN goals sg ON g.id = sg.parent_goal_id AND sg.user_id = $1
      WHERE g.user_id = $1 AND g.parent_goal_id IS NULL
    `;
    const params: any[] = [userId];
    let paramCount = 1;

    if (type) {
      paramCount++;
      queryText += ` AND g.goal_type = $${paramCount}`;
      params.push(type);
    }

    if (status) {
      paramCount++;
      queryText += ` AND g.status = $${paramCount}`;
      params.push(status);
    }

    queryText += ' GROUP BY g.id ORDER BY g.display_order, g.target_date ASC, g.created_at DESC';

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
    const { title, description, goal_type, target_date, parent_goal_id } = req.body;

    if (!title || !goal_type) {
      res.status(400).json({ error: 'Title and goal type are required' });
      return;
    }

    // Get the next display_order value
    const maxOrderResult = await query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM goals WHERE user_id = $1 AND COALESCE(parent_goal_id, 0) = COALESCE($2, 0)',
      [userId, parent_goal_id || null]
    );
    const displayOrder = maxOrderResult.rows[0].next_order;

    const result = await query(
      `INSERT INTO goals (user_id, title, description, goal_type, target_date, parent_goal_id, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, description, goal_type, target_date, parent_goal_id || null, displayOrder]
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

export const reorderGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { goal_orders } = req.body; // Array of {id, display_order}

    if (!Array.isArray(goal_orders)) {
      res.status(400).json({ error: 'goal_orders must be an array' });
      return;
    }

    // Update each goal's display_order
    for (const { id, display_order } of goal_orders) {
      await query(
        'UPDATE goals SET display_order = $1 WHERE id = $2 AND user_id = $3',
        [display_order, id, userId]
      );
    }

    res.json({ message: 'Goals reordered successfully' });
  } catch (error) {
    console.error('Reorder goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
