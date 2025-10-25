import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { goalsAPI, habitsAPI } from '../services/api';
import type { Goal, Habit } from '../types';
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';
import { SketchyMountains, CornerSwirl, Carabiner, ClimbingHold, RopeSwirl, ElCapitan, HalfDome } from '../components/LineArt';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitStats, setHabitStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsRes, habitsRes] = await Promise.all([
        goalsAPI.getAll(),
        habitsAPI.getAll(),
      ]);

      setGoals(goalsRes.data);
      setHabits(habitsRes.data);

      // Load stats for each habit
      const stats: any = {};
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      for (const habit of habitsRes.data) {
        const [weekStatsRes, monthStatsRes] = await Promise.all([
          habitsAPI.getStats(habit.id, weekStart, weekEnd),
          habitsAPI.getStats(habit.id, monthStart, monthEnd),
        ]);
        stats[habit.id] = {
          week: weekStatsRes.data,
          month: monthStatsRes.data,
        };
      }
      setHabitStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGoalProgress = (goalType: 'yearly' | 'monthly' | 'weekly') => {
    const filteredGoals = goals.filter(g => g.goal_type === goalType && g.status === 'active');
    if (filteredGoals.length === 0) return 0;
    const avgProgress = filteredGoals.reduce((sum, g) => sum + g.progress, 0) / filteredGoals.length;
    return Math.round(avgProgress);
  };

  const getHabitCompletionRate = (habitId: number, period: 'week' | 'month') => {
    const stats = habitStats[habitId]?.[period];
    if (!stats) return 0;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const targetCount = period === 'week'
      ? (habit.frequency_per_week || 7)
      : (habit.frequency_per_week ? habit.frequency_per_week * 4 : 30);

    const actual = stats.total_completions || 0;
    return Math.min(Math.round((actual / targetCount) * 100), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-100">
        <div className="text-xl font-display text-ink-600">Loading statistics...</div>
      </div>
    );
  }

  const yearlyProgress = calculateGoalProgress('yearly');
  const monthlyProgress = calculateGoalProgress('monthly');
  const weeklyProgress = calculateGoalProgress('weekly');

  return (
    <div className="min-h-screen bg-paper-100">
      {/* Header */}
      <header className="bg-paper-50 border-b-2 border-ink-200 shadow-sm relative overflow-hidden">
        <CornerSwirl className="absolute top-2 left-4 w-12 h-12 text-ink-200" />
        <CornerSwirl className="absolute top-2 right-4 w-12 h-12 text-ink-200" flip />
        <HalfDome className="absolute right-0 top-0 h-full w-32 text-ink-200 opacity-35" />
        <ElCapitan className="absolute left-0 top-0 h-full w-16 text-ink-200 opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display text-ink-900 tracking-wide">Statistics & Progress</h1>
              <SketchyMountains className="w-64 h-8 text-ink-400 mt-1" />
              <p className="text-sm font-body text-ink-600 mt-2">{user?.name}'s journey</p>
            </div>

            <a href="/" className="btn-secondary text-xs">
              ← Back to Journal
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Progress Overview */}
        <div className="journal-page mb-8">
          <div className="journal-margin">
            <h2 className="text-2xl font-display text-ink-900 mb-6 flex items-center tracking-wide">
              <Carabiner className="w-8 h-8 mr-3 text-ink-600" />
              Goal Progress
            </h2>
            <SketchyMountains className="w-full h-12 text-ink-300 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Yearly Goals */}
              <div className="bg-paper-50 p-6 border-l-4 border-ink-600">
                <h3 className="font-display text-ink-800 text-lg mb-4">Yearly Goals</h3>
                <div className="relative">
                  <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#666666"
                      strokeWidth="20"
                      strokeDasharray={`${yearlyProgress * 5.03} 503`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-display text-ink-900">{yearlyProgress}%</div>
                      <div className="text-xs font-body text-ink-600">complete</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-body text-ink-600 text-center mt-4">
                  {goals.filter(g => g.goal_type === 'yearly' && g.status === 'active').length} active goals
                </p>
              </div>

              {/* Monthly Goals */}
              <div className="bg-paper-50 p-6 border-l-4 border-ink-500">
                <h3 className="font-display text-ink-800 text-lg mb-4">Monthly Goals</h3>
                <div className="relative">
                  <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#757575"
                      strokeWidth="20"
                      strokeDasharray={`${monthlyProgress * 5.03} 503`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-display text-ink-900">{monthlyProgress}%</div>
                      <div className="text-xs font-body text-ink-600">complete</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-body text-ink-600 text-center mt-4">
                  {goals.filter(g => g.goal_type === 'monthly' && g.status === 'active').length} active goals
                </p>
              </div>

              {/* Weekly Goals */}
              <div className="bg-paper-50 p-6 border-l-4 border-ink-400">
                <h3 className="font-display text-ink-800 text-lg mb-4">Weekly Goals</h3>
                <div className="relative">
                  <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#9e9e9e"
                      strokeWidth="20"
                      strokeDasharray={`${weeklyProgress * 5.03} 503`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-display text-ink-900">{weeklyProgress}%</div>
                      <div className="text-xs font-body text-ink-600">complete</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-body text-ink-600 text-center mt-4">
                  {goals.filter(g => g.goal_type === 'weekly' && g.status === 'active').length} active goals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Habit Statistics */}
        <div className="journal-page">
          <div className="journal-margin">
            <h2 className="text-2xl font-display text-ink-900 mb-6 flex items-center tracking-wide">
              <ClimbingHold className="w-8 h-8 mr-3 text-ink-600" />
              Habit Tracking
            </h2>
            <RopeSwirl className="w-24 h-12 text-ink-300 mb-6" />

            {habits.length === 0 ? (
              <p className="text-center text-ink-400 italic py-12 font-body">
                No habits tracked yet
              </p>
            ) : (
              <div className="space-y-6">
                {habits.map((habit) => {
                  const weekStats = habitStats[habit.id]?.week || {};
                  const monthStats = habitStats[habit.id]?.month || {};
                  const weekRate = getHabitCompletionRate(habit.id, 'week');
                  const monthRate = getHabitCompletionRate(habit.id, 'month');
                  const streak = weekStats.current_streak || 0;

                  return (
                    <div key={habit.id} className="bg-paper-50 p-6 border-l-4" style={{ borderColor: habit.color }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-3xl mr-3">{habit.icon || '✓'}</span>
                          <div>
                            <h3 className="font-display text-ink-900 text-lg">{habit.name}</h3>
                            <p className="text-sm font-body text-ink-600">
                              {habit.frequency_per_week ? `${habit.frequency_per_week}× per week` : 'Daily'}
                            </p>
                          </div>
                        </div>
                        {streak > 0 && (
                          <div className="text-right">
                            <div className="text-2xl font-display text-ink-900">{streak}</div>
                            <div className="text-xs font-body text-ink-600">day streak 🔥</div>
                          </div>
                        )}
                      </div>

                      {/* Week Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-body text-ink-600 mb-1">
                          <span>This Week</span>
                          <span>{weekStats.total_completions || 0} / {habit.frequency_per_week || 7} days</span>
                        </div>
                        <div className="w-full h-2 bg-paper-200">
                          <div
                            className="h-2 transition-all"
                            style={{
                              width: `${weekRate}%`,
                              backgroundColor: habit.color
                            }}
                          />
                        </div>
                      </div>

                      {/* Month Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs font-body text-ink-600 mb-1">
                          <span>This Month</span>
                          <span>{monthStats.total_completions || 0} completions</span>
                        </div>
                        <div className="w-full h-2 bg-paper-200">
                          <div
                            className="h-2 transition-all opacity-60"
                            style={{
                              width: `${monthRate}%`,
                              backgroundColor: habit.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
