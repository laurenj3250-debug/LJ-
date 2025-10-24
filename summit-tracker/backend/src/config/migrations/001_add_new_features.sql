-- Migration: Add new features (recurring tasks, sub-goals, time tracking, mood check-in, reordering)

-- Add parent_goal_id for sub-goals
ALTER TABLE goals ADD COLUMN IF NOT EXISTS parent_goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE;

-- Add display_order for reordering goals and habits
ALTER TABLE goals ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add time tracking to habit logs
ALTER TABLE habit_logs ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0; -- in minutes

-- Add recurring task fields to daily_logs
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS recurrence_pattern VARCHAR(20) CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'custom'));
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS recurrence_days INTEGER[]; -- for weekly: [1,3,5] = Mon, Wed, Fri
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS parent_recurring_task_id INTEGER REFERENCES daily_logs(id) ON DELETE CASCADE;

-- Mood check-ins table
CREATE TABLE IF NOT EXISTS mood_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood VARCHAR(20) NOT NULL CHECK (mood IN ('amazing', 'good', 'okay', 'bad', 'terrible')),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, log_date) -- One mood per day
);

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON goals(parent_goal_id);
CREATE INDEX IF NOT EXISTS idx_goals_display_order ON goals(display_order);
CREATE INDEX IF NOT EXISTS idx_habits_display_order ON habits(display_order);
CREATE INDEX IF NOT EXISTS idx_daily_logs_recurring ON daily_logs(is_recurring);
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_date ON mood_logs(user_id, log_date);

-- Add trigger for mood_logs updated_at
CREATE TRIGGER update_mood_logs_updated_at BEFORE UPDATE ON mood_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
