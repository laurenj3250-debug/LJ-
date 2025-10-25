import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isWithinInterval } from 'date-fns';
import type { Goal, Habit, HabitLog } from '../types';
import { MountainLine, CornerSwirl, Carabiner } from '../components/LineArt';

interface MonthViewProps {
  goals: Goal[];
  habits: Habit[];
  habitLogs?: HabitLog[];
}

const MonthView: React.FC<MonthViewProps> = ({ goals, habits, habitLogs = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Get goals for a specific date
  const getGoalsForDate = (date: Date) => {
    return goals.filter(goal => {
      if (!goal.target_date) return false;
      const targetDate = parseISO(goal.target_date.toString());
      return isSameDay(targetDate, date);
    });
  };

  // Get habit logs for a specific date
  const getHabitLogsForDate = (date: Date) => {
    return habitLogs.filter(log => {
      const logDate = parseISO(log.log_date.toString());
      return isSameDay(logDate, date);
    });
  };

  // Check if a date falls within a goal's timeframe
  const isGoalActive = (goal: Goal, date: Date) => {
    if (!goal.target_date) return false;
    const targetDate = parseISO(goal.target_date.toString());

    if (goal.goal_type === 'yearly') {
      return targetDate.getFullYear() === date.getFullYear();
    } else if (goal.goal_type === 'monthly') {
      return targetDate.getFullYear() === date.getFullYear() && targetDate.getMonth() === date.getMonth();
    } else if (goal.goal_type === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return isWithinInterval(targetDate, { start: weekStart, end: weekEnd });
    }
    return false;
  };

  return (
    <div className="journal-page">
      <div className="journal-margin">
        {/* Header with mountain decoration */}
        <div className="flex items-center justify-between mb-8 relative">
          <CornerSwirl className="absolute top-0 left-0 w-16 h-16 text-ink-300" />

          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="btn-secondary text-xs px-3 py-1"
          >
            ← Previous
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-display text-ink-800 tracking-wide">
              {format(currentMonth, 'MMMM yyyy')}
            </h1>
            <MountainLine className="w-48 h-8 mx-auto mt-2 text-ink-400" />
          </div>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="btn-secondary text-xs px-3 py-1"
          >
            Next →
          </button>

          <CornerSwirl className="absolute top-0 right-0 w-16 h-16 text-ink-300" flip />
        </div>

        {/* Monthly Goals Summary */}
        <div className="mb-6 p-4 border-2 border-ink-200 bg-paper-50">
          <h2 className="font-display text-lg text-ink-700 mb-2 flex items-center">
            <Carabiner className="w-5 h-5 mr-2 text-ink-500" />
            Monthly Objectives
          </h2>
          <div className="space-y-1">
            {goals.filter(g => isGoalActive(g, currentMonth) && g.goal_type === 'monthly').length > 0 ? (
              goals.filter(g => isGoalActive(g, currentMonth) && g.goal_type === 'monthly').map(goal => (
                <div key={goal.id} className="flex items-baseline text-sm">
                  <span className="text-ink-400 mr-2">•</span>
                  <span className="font-body text-ink-700">{goal.title}</span>
                  <span className="ml-auto text-ink-400 text-xs">{goal.progress}%</span>
                </div>
              ))
            ) : (
              <p className="text-ink-400 text-sm italic font-body">No monthly goals set</p>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-ink-200 border border-ink-200">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="bg-paper-50 p-2 text-center font-display text-xs text-ink-600 tracking-wider"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-paper-100 p-2 min-h-[120px]" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map(day => {
            const dayGoals = getGoalsForDate(day);
            const dayHabitLogs = getHabitLogsForDate(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`bg-paper-50 p-2 min-h-[120px] relative transition-all hover:shadow-md ${
                  isToday ? 'ring-2 ring-ink-400' : ''
                }`}
              >
                {/* Date number */}
                <div className={`text-right font-body text-sm mb-1 ${
                  isToday ? 'font-bold text-ink-900' : 'text-ink-600'
                }`}>
                  {format(day, 'd')}
                </div>

                {/* Goals for this day */}
                {dayGoals.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {dayGoals.slice(0, 2).map(goal => (
                      <div
                        key={goal.id}
                        className="text-xs p-1 bg-ink-100 border-l-2 border-ink-400 font-body truncate"
                        title={goal.title}
                      >
                        {goal.title}
                      </div>
                    ))}
                    {dayGoals.length > 2 && (
                      <div className="text-xs text-ink-400 font-body">
                        +{dayGoals.length - 2} more
                      </div>
                    )}
                  </div>
                )}

                {/* Habit completion indicators */}
                {dayHabitLogs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {dayHabitLogs.slice(0, 4).map((log, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-full bg-ink-400"
                        title="Habit completed"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Habits Legend */}
        <div className="mt-6 p-4 border-t-2 border-ink-200">
          <h3 className="font-display text-sm text-ink-700 mb-2">Active Habits</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center text-sm">
                <div className="w-2 h-2 rounded-full bg-ink-400 mr-2" />
                <span className="font-body text-ink-600 text-xs">{habit.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthView;
