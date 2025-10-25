import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export const getEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date, type, status } = req.query;

    let queryText = `
      SELECT e.*,
             CASE WHEN g.id IS NOT NULL
               THEN json_build_object('id', g.id, 'title', g.title, 'goal_type', g.goal_type)
               ELSE NULL
             END as linked_goal
      FROM events e
      LEFT JOIN goals g ON e.goal_id = g.id
      WHERE e.user_id = $1
    `;
    const params: any[] = [userId];
    let paramCount = 1;

    if (start_date) {
      paramCount++;
      queryText += ` AND e.start_time >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      queryText += ` AND e.start_time <= $${paramCount}`;
      params.push(end_date);
    }

    if (type) {
      paramCount++;
      queryText += ` AND e.event_type = $${paramCount}`;
      params.push(type);
    }

    if (status) {
      paramCount++;
      queryText += ` AND e.status = $${paramCount}`;
      params.push(status);
    }

    queryText += ' ORDER BY e.start_time ASC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      title,
      description,
      event_type,
      start_time,
      end_time,
      all_day,
      location,
      color,
      icon,
      goal_id
    } = req.body;

    if (!title || !start_time) {
      res.status(400).json({ error: 'Title and start time are required' });
      return;
    }

    const result = await query(
      `INSERT INTO events
       (user_id, title, description, event_type, start_time, end_time, all_day, location, color, icon, goal_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        userId,
        title,
        description,
        event_type || 'event',
        start_time,
        end_time,
        all_day || false,
        location,
        color || '#666666',
        icon,
        goal_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      title,
      description,
      event_type,
      start_time,
      end_time,
      all_day,
      location,
      color,
      icon,
      status,
      goal_id
    } = req.body;

    const result = await query(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           event_type = COALESCE($3, event_type),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           all_day = COALESCE($6, all_day),
           location = COALESCE($7, location),
           color = COALESCE($8, color),
           icon = COALESCE($9, icon),
           status = COALESCE($10, status),
           goal_id = COALESCE($11, goal_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [title, description, event_type, start_time, end_time, all_day, location, color, icon, status, goal_id, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
