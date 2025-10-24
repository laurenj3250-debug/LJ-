export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  goal_type: 'yearly' | 'monthly' | 'weekly';
  target_date?: Date;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  parent_goal_id?: number; // For sub-goals
  display_order: number; // For reordering
  created_at: Date;
  updated_at: Date;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_count: number;
  color: string;
  icon?: string;
  display_order: number; // For reordering
  created_at: Date;
  updated_at: Date;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  user_id: number;
  completed_at: Date;
  note?: string;
  date: Date;
  time_spent?: number; // In minutes
}

export interface DailyLog {
  id: number;
  user_id: number;
  log_date: Date;
  entry_type: 'task' | 'event' | 'note';
  content: string;
  status: 'open' | 'completed' | 'migrated' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  goal_id?: number;
  is_recurring: boolean; // For recurring tasks
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'custom';
  recurrence_days?: number[]; // [1,3,5] = Mon, Wed, Fri
  parent_recurring_task_id?: number; // Link to parent recurring task
  created_at: Date;
  updated_at: Date;
}

export interface MoodLog {
  id: number;
  user_id: number;
  log_date: Date;
  mood: 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';
  energy_level?: number; // 1-5
  note?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
  };
}
