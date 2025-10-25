import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalsAPI, habitsAPI, logsAPI } from '../services/api';
import type { Goal, Habit, DailyLog } from '../types';
import GoalsSection from '../components/GoalsSection';
import HabitsSection from '../components/HabitsSection';
import RapidLog from '../components/RapidLog';
import WeekView from '../components/WeekView';
import MonthView from './MonthView';
import { MountainLine, CornerSwirl } from '../components/LineArt';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'daily' | 'week' | 'month'>('daily');

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
      <div className="min-h-screen flex items-center justify-center bg-paper-100">
        <div className="text-xl font-display text-ink-600">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100">
      {/* Header */}
      <header className="bg-paper-50 border-b-2 border-ink-200 shadow-sm relative">
        <CornerSwirl className="absolute top-2 left-4 w-12 h-12 text-ink-200" />
        <CornerSwirl className="absolute top-2 right-4 w-12 h-12 text-ink-200" flip />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display text-ink-900 tracking-wide">Climbing Journal</h1>
              <MountainLine className="w-48 h-6 text-ink-400 mt-1" />
              <p className="text-sm font-body text-ink-600 mt-2">{user?.name}'s logbook</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Switcher */}
              <div className="flex border-2 border-ink-300">
                <button
                  onClick={() => setActiveView('daily')}
                  className={`px-4 py-2 text-sm font-body transition-all ${
                    activeView === 'daily'
                      ? 'bg-ink-800 text-paper-50'
                      : 'bg-paper-50 text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setActiveView('week')}
                  className={`px-4 py-2 text-sm font-body border-l-2 border-r-2 border-ink-300 transition-all ${
                    activeView === 'week'
                      ? 'bg-ink-800 text-paper-50'
                      : 'bg-paper-50 text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setActiveView('month')}
                  className={`px-4 py-2 text-sm font-body transition-all ${
                    activeView === 'month'
                      ? 'bg-ink-800 text-paper-50'
                      : 'bg-paper-50 text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  Month
                </button>
              </div>

              <button onClick={logout} className="text-ink-600 hover:text-ink-900 font-body text-sm border-b border-ink-400">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto py-8">
        {activeView === 'daily' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Goals & Habits */}
              <div className="lg:col-span-2 space-y-6">
                <GoalsSection goals={goals} onUpdate={loadData} />
                <HabitsSection habits={habits} onUpdate={loadData} />
              </div>

              {/* Right Column - Rapid Log */}
              <div className="lg:col-span-1">
                <RapidLog logs={logs} onUpdate={loadData} />
              </div>
            </div>
          </div>
        ) : activeView === 'week' ? (
          <WeekView goals={goals} habits={habits} />
        ) : (
          <MonthView goals={goals} habits={habits} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
