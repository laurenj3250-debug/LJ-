-- Migration: Create events table
-- Description: Add events table for calendar events and time-blocked activities

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'event', -- event, task, climbing_session, training, rest_day
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  all_day BOOLEAN DEFAULT FALSE,
  location VARCHAR(255),
  color VARCHAR(7) DEFAULT '#666666',
  icon VARCHAR(10),
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled
  goal_id INTEGER REFERENCES goals(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_goal_id ON events(goal_id);
