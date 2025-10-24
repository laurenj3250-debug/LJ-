import React, { useState } from 'react';
import { habitsAPI } from '../services/api';
import type { Habit } from '../types';
import { format } from 'date-fns';

interface HabitsSectionProps {
  habits: Habit[];
  onUpdate: () => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({ habits, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'custom',
    color: '#0ea5e9',
    icon: '✓',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsAPI.create(formData);
      setFormData({ name: '', description: '', frequency: 'daily', color: '#0ea5e9', icon: '✓' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const logHabit = async (habitId: number) => {
    try {
      await habitsAPI.log(habitId, { date: format(new Date(), 'yyyy-MM-dd') });
      onUpdate();
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const colors = [
    { name: 'Blue', value: '#0ea5e9' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-granite-800 flex items-center">
          <span className="mr-2">🎯</span>
          Daily Habits
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Habit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-summit-50 rounded-lg border border-summit-200">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Habit name (e.g., Practice German)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />

            <input
              type="text"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
            />

            <div>
              <label className="label">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="label">Color</label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.color === color.value ? 'border-granite-800 scale-110' : 'border-granite-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              Create Habit
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <p className="text-granite-500 italic text-center py-8">
          No habits yet. Create one to start tracking!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-lg p-4 border-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: habit.color }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-granite-800">{habit.name}</h4>
                  {habit.description && (
                    <p className="text-sm text-granite-600 mt-1">{habit.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-granite-500">
                    <span className="bg-granite-100 px-2 py-1 rounded">
                      {habit.frequency}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => logHabit(habit.id)}
                  className="ml-2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl hover:scale-110 transition-transform shadow-md"
                  style={{ backgroundColor: habit.color }}
                >
                  ✓
                </button>
              </div>

              {habit.linked_goals && habit.linked_goals.length > 0 && (
                <div className="mt-3 pt-3 border-t border-granite-200">
                  <p className="text-xs text-granite-500 mb-1">Linked to:</p>
                  <div className="flex flex-wrap gap-1">
                    {habit.linked_goals.map((goal: any) => (
                      <span
                        key={goal.id}
                        className="text-xs bg-summit-100 text-summit-700 px-2 py-1 rounded"
                      >
                        {goal.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitsSection;
