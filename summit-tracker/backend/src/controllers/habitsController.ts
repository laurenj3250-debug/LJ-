import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT h.*,
              COALESCE(json_agg(
                json_build_object('id', g.id, 'title', g.title, 'goal_type', g.goal_type)
              ) FILTER (WHERE g.id IS NOT NULL), '[]') as linked_goals
       FROM habits h
       LEFT JOIN habit_goals hg ON h.id = hg.habit_id
       LEFT JOIN goals g ON hg.goal_id = g.id
       WHERE h.user_id = $1
       GROUP BY h.id
       ORDER BY h.display_order, h.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, description, frequency, target_count, color, icon, goal_ids } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Get the next display_order value
    const maxOrderResult = await query(
      'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM habits WHERE user_id = $1',
      [userId]
    );
    const displayOrder = maxOrderResult.rows[0].next_order;

    const result = await query(
      `INSERT INTO habits (user_id, name, description, frequency, target_count, color, icon, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, name, description, frequency || 'daily', target_count || 1, color || '#0ea5e9', icon, displayOrder]
    );

    const habit = result.rows[0];

    // Link to goals if provided
    if (goal_ids && Array.isArray(goal_ids) && goal_ids.length > 0) {
      for (const goalId of goal_ids) {
        await query(
          'INSERT INTO habit_goals (habit_id, goal_id) VALUES ($1, $2)',
          [habit.id, goalId]
        );
      }
    }

    res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, frequency, target_count, color, icon, goal_ids } = req.body;

    const result = await query(
      `UPDATE habits
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           frequency = COALESCE($3, frequency),
           target_count = COALESCE($4, target_count),
           color = COALESCE($5, color),
           icon = COALESCE($6, icon)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [name, description, frequency, target_count, color, icon, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    // Update goal links if provided
    if (goal_ids !== undefined && Array.isArray(goal_ids)) {
      await query('DELETE FROM habit_goals WHERE habit_id = $1', [id]);

      if (goal_ids.length > 0) {
        for (const goalId of goal_ids) {
          await query(
            'INSERT INTO habit_goals (habit_id, goal_id) VALUES ($1, $2)',
            [id, goalId]
          );
        }
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { note, date, time_spent } = req.body;

    const result = await query(
      `INSERT INTO habit_logs (habit_id, user_id, note, date, time_spent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, note, date || new Date().toISOString().split('T')[0], time_spent || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Log habit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHabitLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      res.status(400).json({ error: 'Date is required' });
      return;
    }

    const result = await query(
      'DELETE FROM habit_logs WHERE habit_id = $1 AND user_id = $2 AND DATE(date) = $3 RETURNING *',
      [id, userId, date]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Habit log not found for this date' });
      return;
    }

    res.json({ message: 'Habit log deleted successfully' });
  } catch (error) {
    console.error('Delete habit log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHabitStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { start_date, end_date } = req.query;

    let queryText = `
      SELECT DATE(date) as log_date, COUNT(*) as count
      FROM habit_logs
      WHERE habit_id = $1 AND user_id = $2
    `;
    const params: any[] = [id, userId];
    let paramCount = 2;

    if (start_date) {
      paramCount++;
      queryText += ` AND date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      queryText += ` AND date <= $${paramCount}`;
      params.push(end_date);
    }

    queryText += ' GROUP BY DATE(date) ORDER BY log_date DESC';

    const result = await query(queryText, params);

    // Calculate streak
    const logs = result.rows;
    let currentStreak = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < logs.length; i++) {
      const logDate = logs[i].log_date.toISOString().split('T')[0];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (logDate === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Check if today is logged
    const todayLogged = logs.some(log => log.log_date.toISOString().split('T')[0] === todayStr);
    const streakAtRisk = currentStreak > 0 && !todayLogged;

    res.json({
      logs: result.rows,
      current_streak: currentStreak,
      total_completions: logs.length,
      streak_at_risk: streakAtRisk // Warning: streak will break if not logged today
    });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reorderHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { habit_orders } = req.body; // Array of {id, display_order}

    if (!Array.isArray(habit_orders)) {
      res.status(400).json({ error: 'habit_orders must be an array' });
      return;
    }

    // Update each habit's display_order
    for (const { id, display_order } of habit_orders) {
      await query(
        'UPDATE habits SET display_order = $1 WHERE id = $2 AND user_id = $3',
        [display_order, id, userId]
      );
    }

    res.json({ message: 'Habits reordered successfully' });
  } catch (error) {
    console.error('Reorder habits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
