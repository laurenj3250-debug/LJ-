import axios from 'axios';
import type { AuthResponse, Goal, Habit, DailyLog } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://lj-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

// Goals API
export const goalsAPI = {
  getAll: (type?: string, status?: string) =>
    api.get<Goal[]>('/goals', { params: { type, status } }),

  create: (data: Partial<Goal>) =>
    api.post<Goal>('/goals', data),

  update: (id: number, data: Partial<Goal>) =>
    api.put<Goal>(`/goals/${id}`, data),

  delete: (id: number) =>
    api.delete(`/goals/${id}`),
};

// Habits API
export const habitsAPI = {
  getAll: () =>
    api.get<Habit[]>('/habits'),

  create: (data: Partial<Habit> & { goal_ids?: number[] }) =>
    api.post<Habit>('/habits', data),

  update: (id: number, data: Partial<Habit> & { goal_ids?: number[] }) =>
    api.put<Habit>(`/habits/${id}`, data),

  delete: (id: number) =>
    api.delete(`/habits/${id}`),

  log: (id: number, data: { note?: string; date?: string }) =>
    api.post(`/habits/${id}/log`, data),

  getStats: (id: number, start_date?: string, end_date?: string) =>
    api.get(`/habits/${id}/stats`, { params: { start_date, end_date } }),
};

// Daily Logs API
export const logsAPI = {
  getAll: (date?: string, start_date?: string, end_date?: string) =>
    api.get<DailyLog[]>('/logs', { params: { date, start_date, end_date } }),

  create: (data: Partial<DailyLog>) =>
    api.post<DailyLog>('/logs', data),

  update: (id: number, data: Partial<DailyLog>) =>
    api.put<DailyLog>(`/logs/${id}`, data),

  delete: (id: number) =>
    api.delete(`/logs/${id}`),
};

export default api;
