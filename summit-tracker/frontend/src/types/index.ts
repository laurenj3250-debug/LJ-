export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  goal_type: 'yearly' | 'monthly' | 'weekly';
  target_date?: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  frequency_per_week?: number; // For "x times per week" habits
  target_count: number;
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
  linked_goals?: { id: number; title: string; goal_type: string }[];
}

export interface HabitLog {
  id: number;
  habit_id: number;
  user_id: number;
  completed_at: string;
  note?: string;
  date: string;
}

export interface DailyLog {
  id: number;
  user_id: number;
  log_date: string;
  entry_type: 'task' | 'event' | 'note';
  content: string;
  status: 'open' | 'completed' | 'migrated' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  goal_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  event_type: 'event' | 'task' | 'climbing_session' | 'training' | 'rest_day';
  start_time: string;
  end_time?: string;
  all_day: boolean;
  location?: string;
  color: string;
  icon?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  goal_id?: number;
  linked_goal?: { id: number; title: string; goal_type: string };
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}
