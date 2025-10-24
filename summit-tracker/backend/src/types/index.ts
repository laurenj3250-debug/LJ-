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
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
  };
}
