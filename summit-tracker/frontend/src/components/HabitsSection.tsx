import React, { useState } from 'react';
import { habitsAPI } from '../services/api';
import type { Habit } from '../types';
import { format } from 'date-fns';
import { ClimbingHold, RopeKnot } from './LineArt';

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
    color: '#666666',
    icon: '•',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsAPI.create(formData);
      setFormData({ name: '', description: '', frequency: 'daily', color: '#666666', icon: '•' });
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
    { name: 'Charcoal', value: '#666666' },
    { name: 'Dark Grey', value: '#757575' },
    { name: 'Medium', value: '#9e9e9e' },
    { name: 'Light', value: '#bdbdbd' },
    { name: 'Graphite', value: '#515151' },
    { name: 'Slate', value: '#616161' },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-display text-ink-900 flex items-center tracking-wide">
            <ClimbingHold className="w-6 h-6 mr-2 text-ink-600" />
            Daily Habits
          </h2>
          <RopeKnot className="w-8 h-8 text-ink-300 mt-1" />
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs">
          {showForm ? '× Close' : '+ New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-paper-100 border-l-4 border-ink-400">
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
                    className={`w-8 h-8 border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-ink-800 scale-110'
                        : 'border-ink-300 hover:border-ink-500'
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

      <div className="space-y-3">
        {habits.length === 0 ? (
          <p className="text-center text-ink-400 italic py-8 font-body text-sm">
            No habits yet. Create one to start tracking!
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-paper-50 p-4 border-l-4 hover:border-ink-600 transition-all"
              style={{ borderColor: habit.color }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 mr-3"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h4 className="font-display text-ink-900">{habit.name}</h4>
                      {habit.description && (
                        <p className="text-sm font-body text-ink-600 mt-1">{habit.description}</p>
                      )}
                      <p className="text-xs font-body text-ink-500 mt-1 capitalize">{habit.frequency}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => logHabit(habit.id)}
                  className="btn-secondary text-xs px-3 py-1"
                >
                  ✓ Log Today
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HabitsSection;
