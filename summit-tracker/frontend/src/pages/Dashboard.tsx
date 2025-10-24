import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalsAPI, habitsAPI, logsAPI } from '../services/api';
import type { Goal, Habit, DailyLog } from '../types';
import GoalsSection from '../components/GoalsSection';
import HabitsSection from '../components/HabitsSection';
import RapidLog from '../components/RapidLog';
import WeekView from '../components/WeekView';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'week'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsRes, habitsRes, logsRes] = await Promise.all([
        goalsAPI.getAll(),
        habitsAPI.getAll(),
        logsAPI.getAll(new Date().toISOString().split('T')[0]),
      ]);

      setGoals(goalsRes.data);
      setHabits(habitsRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-granite-600">Loading your summit...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-granite-50 via-granite-100 to-summit-50">
      {/* Header */}
      <header className="bg-white border-b border-granite-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🏔️</span>
              <div>
                <h1 className="text-2xl font-bold text-granite-800">Summit Tracker</h1>
                <p className="text-sm text-granite-600">Welcome back, {user?.name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView(activeView === 'overview' ? 'week' : 'overview')}
                className="btn-secondary text-sm"
              >
                {activeView === 'overview' ? '📅 Week View' : '📊 Overview'}
              </button>
              <button onClick={logout} className="text-granite-600 hover:text-granite-800 font-semibold">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Goals */}
            <div className="lg:col-span-2 space-y-6">
              <GoalsSection goals={goals} onUpdate={loadData} />
              <HabitsSection habits={habits} onUpdate={loadData} />
            </div>

            {/* Right Column - Rapid Log */}
            <div className="lg:col-span-1">
              <RapidLog logs={logs} onUpdate={loadData} />
            </div>
          </div>
        ) : (
          <WeekView goals={goals} habits={habits} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
