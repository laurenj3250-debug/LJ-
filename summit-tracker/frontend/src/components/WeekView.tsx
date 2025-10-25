import React, { useState, useEffect } from 'react';
import { habitsAPI, logsAPI } from '../services/api';
import type { Goal, Habit, DailyLog } from '../types';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { SketchyMountains, Carabiner, ClimbingHold } from './LineArt';

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
    const dateStr = format(date, 'yyyy-MM-dd');
    const isLogged = isHabitLoggedForDay(habitId, date);

    try {
      if (isLogged) {
        // Uncheck - delete the log
        await habitsAPI.deleteLog(habitId, dateStr);
      } else {
        // Check - create the log
        await habitsAPI.log(habitId, { date: dateStr });
      }
      loadWeekData();
    } catch (error) {
      console.error('Error toggling habit:', error);
      alert(`Failed to ${isLogged ? 'uncheck' : 'log'} habit. Please try again.`);
    }
  };

  const isToday = (day: Date) => isSameDay(day, new Date());

  const weeklyGoals = goals.filter(g => g.goal_type === 'weekly' && g.status === 'active');

  return (
    <div className="journal-page">
      <div className="journal-margin space-y-6">
        {/* Week Goals Overview */}
        {weeklyGoals.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-display text-ink-800 mb-4 flex items-center tracking-wide">
              <Carabiner className="w-6 h-6 mr-2 text-ink-600" />
              This Week's Objectives
            </h2>
            <SketchyMountains className="w-full h-10 text-ink-300 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="bg-paper-100 p-4 border-l-2 border-ink-400">
                  <h4 className="font-display text-ink-800">{goal.title}</h4>
                  <div className="mt-2">
                    <div className="w-full bg-paper-200 h-1">
                      <div
                        className="bg-ink-600 h-1 transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="text-xs font-body text-ink-500 mt-1">{goal.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Week Grid */}
        <div className="card">
          <h2 className="text-xl font-display text-ink-800 mb-6 flex items-center tracking-wide">
            <ClimbingHold className="w-6 h-6 mr-2 text-ink-600" />
            Habit Tracker
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-ink-200 bg-paper-100 p-3 text-left font-display text-ink-700 min-w-[150px]">
                    Habit
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.toISOString()}
                      className={`border border-ink-200 p-3 text-center min-w-[100px] ${
                        isToday(day) ? 'bg-ink-100 font-bold' : 'bg-paper-50'
                      }`}
                    >
                      <div className={`font-body ${isToday(day) ? 'text-ink-900' : 'text-ink-700'}`}>
                        {format(day, 'EEE')}
                      </div>
                      <div className={`text-sm font-body ${isToday(day) ? 'text-ink-600' : 'text-ink-500'}`}>
                        {format(day, 'MMM d')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id}>
                    <td className="border border-ink-200 p-3 bg-paper-50">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 mr-2"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span className="font-body text-ink-800">{habit.name}</span>
                      </div>
                    </td>
                    {weekDays.map((day) => {
                      const isLogged = isHabitLoggedForDay(habit.id, day);
                      return (
                        <td
                          key={day.toISOString()}
                          className={`border border-ink-200 p-2 text-center ${
                            isToday(day) ? 'bg-ink-50' : 'bg-paper-50'
                          }`}
                        >
                          <button
                            onClick={() => logHabit(habit.id, day)}
                            className={`w-8 h-8 transition-all font-body text-sm ${
                              isLogged
                                ? 'bg-ink-700 text-paper-50 border-2 border-ink-700 hover:bg-ink-600 cursor-pointer'
                                : 'bg-transparent border-2 border-ink-300 text-ink-400 hover:border-ink-500'
                            }`}
                            title={isLogged ? 'Click to uncheck' : 'Click to check off'}
                          >
                            {isLogged ? '✓' : ''}
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
            <p className="text-center text-ink-400 italic py-8 font-body text-sm">
              No habits to track yet
            </p>
          )}
        </div>

        {/* Daily Tasks Grid */}
        <div className="card">
          <h2 className="text-xl font-display text-ink-800 mb-6 flex items-center tracking-wide">
            Daily Entries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayLogs = getLogsForDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`p-4 border-l-2 ${
                    isToday(day)
                      ? 'border-ink-600 bg-ink-50'
                      : 'border-ink-200 bg-paper-50'
                  }`}
                >
                  <div className={`font-display mb-2 ${isToday(day) ? 'text-ink-900' : 'text-ink-700'}`}>
                    {format(day, 'EEE')}
                    <div className="text-sm font-body text-ink-500">
                      {format(day, 'MMM d')}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayLogs.length === 0 ? (
                      <p className="text-xs text-ink-400 italic font-body">—</p>
                    ) : (
                      dayLogs.map((log) => (
                        <div
                          key={log.id}
                          className={`text-xs p-2 border-l border-ink-300 font-body ${
                            log.status === 'completed'
                              ? 'line-through text-ink-400'
                              : 'text-ink-700'
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
    </div>
  );
};

export default WeekView;
