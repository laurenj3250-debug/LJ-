import React, { useState, useEffect } from 'react';
import { habitsAPI, logsAPI } from '../services/api';
import type { Goal, Habit, DailyLog } from '../types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface WeekViewProps {
  goals: Goal[];
  habits: Habit[];
}

const WeekView: React.FC<WeekViewProps> = ({ goals, habits }) => {
  const [weekLogs, setWeekLogs] = useState<DailyLog[]>([]);
  const [habitLogs, setHabitLogs] = useState<any>({});

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadWeekData();
  }, []);

  const loadWeekData = async () => {
    try {
      const startDate = format(weekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');

      const logsRes = await logsAPI.getAll(undefined, startDate, endDate);
      setWeekLogs(logsRes.data);

      // Load habit logs for each habit
      const habitLogsData: any = {};
      for (const habit of habits) {
        const statsRes = await habitsAPI.getStats(habit.id, startDate, endDate);
        habitLogsData[habit.id] = statsRes.data.logs || [];
      }
      setHabitLogs(habitLogsData);
    } catch (error) {
      console.error('Error loading week data:', error);
    }
  };

  const isHabitLoggedForDay = (habitId: number, day: Date) => {
    const logs = habitLogs[habitId] || [];
    return logs.some((log: any) => {
      const logDate = new Date(log.log_date);
      return isSameDay(logDate, day);
    });
  };

  const getLogsForDay = (day: Date) => {
    return weekLogs.filter((log) => {
      const logDate = new Date(log.log_date);
      return isSameDay(logDate, day);
    });
  };

  const logHabit = async (habitId: number, date: Date) => {
    try {
      await habitsAPI.log(habitId, { date: format(date, 'yyyy-MM-dd') });
      loadWeekData();
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const isToday = (day: Date) => isSameDay(day, new Date());

  const weeklyGoals = goals.filter(g => g.goal_type === 'weekly' && g.status === 'active');

  return (
    <div className="space-y-6">
      {/* Week Goals Overview */}
      {weeklyGoals.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-granite-800 mb-4 flex items-center">
            <span className="mr-2">🧗</span>
            This Week's Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyGoals.map((goal) => (
              <div key={goal.id} className="bg-gradient-to-r from-summit-50 to-summit-100 rounded-lg p-4 border border-summit-200">
                <h4 className="font-semibold text-granite-800">{goal.title}</h4>
                <div className="mt-2">
                  <div className="w-full bg-white rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-summit-500 to-summit-600 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-granite-600 mt-1">{goal.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week Grid */}
      <div className="card">
        <h2 className="text-2xl font-bold text-granite-800 mb-6 flex items-center">
          <span className="mr-2">📅</span>
          Week Overview
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-granite-300 bg-granite-100 p-3 text-left font-semibold text-granite-700 min-w-[150px]">
                  Habit
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`border border-granite-300 p-3 text-center min-w-[100px] ${
                      isToday(day) ? 'bg-summit-100 font-bold' : 'bg-granite-50'
                    }`}
                  >
                    <div className={isToday(day) ? 'text-summit-700' : 'text-granite-700'}>
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-sm ${isToday(day) ? 'text-summit-600' : 'text-granite-500'}`}>
                      {format(day, 'MMM d')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id}>
                  <td className="border border-granite-300 p-3 bg-white">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="font-semibold text-granite-800">{habit.name}</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const isLogged = isHabitLoggedForDay(habit.id, day);
                    return (
                      <td
                        key={day.toISOString()}
                        className={`border border-granite-300 p-2 text-center ${
                          isToday(day) ? 'bg-summit-50' : 'bg-white'
                        }`}
                      >
                        <button
                          onClick={() => !isLogged && logHabit(habit.id, day)}
                          className={`w-10 h-10 rounded-full transition-all ${
                            isLogged
                              ? 'bg-gradient-to-r from-summit-500 to-summit-600 text-white shadow-md'
                              : 'bg-granite-100 hover:bg-granite-200 text-granite-400'
                          }`}
                          disabled={isLogged}
                        >
                          {isLogged ? '✓' : '○'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {habits.length === 0 && (
          <p className="text-center text-granite-500 italic py-8">
            No habits to track. Create some habits first!
          </p>
        )}
      </div>

      {/* Daily Tasks Grid */}
      <div className="card">
        <h2 className="text-2xl font-bold text-granite-800 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Daily Tasks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayLogs = getLogsForDay(day);
            return (
              <div
                key={day.toISOString()}
                className={`rounded-lg p-4 border-2 ${
                  isToday(day)
                    ? 'border-summit-400 bg-summit-50'
                    : 'border-granite-200 bg-white'
                }`}
              >
                <div className={`font-bold mb-2 ${isToday(day) ? 'text-summit-700' : 'text-granite-700'}`}>
                  {format(day, 'EEE')}
                  <div className="text-sm font-normal text-granite-500">
                    {format(day, 'MMM d')}
                  </div>
                </div>

                <div className="space-y-2">
                  {dayLogs.length === 0 ? (
                    <p className="text-xs text-granite-400 italic">No tasks</p>
                  ) : (
                    dayLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`text-xs p-2 rounded ${
                          log.status === 'completed'
                            ? 'bg-summit-100 line-through text-granite-500'
                            : 'bg-granite-50 text-granite-700'
                        }`}
                      >
                        {log.content}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
