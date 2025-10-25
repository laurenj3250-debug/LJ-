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
  const [justLogged, setJustLogged] = useState<number | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'custom' as 'daily' | 'weekly' | 'custom',
    frequency_per_week: 3,
    color: '#666666',
    icon: '✓',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsAPI.create(formData);
      setFormData({
        name: '',
        description: '',
        frequency: 'custom',
        frequency_per_week: 3,
        color: '#666666',
        icon: '✓'
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const logHabit = async (habitId: number) => {
    try {
      setLoading(habitId);
      await habitsAPI.log(habitId, { date: format(new Date(), 'yyyy-MM-dd') });
      setJustLogged(habitId);
      setTimeout(() => setJustLogged(null), 2000); // Show success for 2 seconds
      await onUpdate();
    } catch (error) {
      console.error('Error logging habit:', error);
      alert('Failed to log habit. Please try again.');
    } finally {
      setLoading(null);
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

  const commonEmojis = [
    '✓', '✔️', '📚', '🏃', '🧘', '💪', '🎯', '⭐', '🔥', '💧',
    '🌱', '📝', '🎨', '🎵', '☕', '🥗', '🏔️', '🧗', '🎸', '📖',
    '💻', '🎮', '🏋️', '🚴', '🏊', '🧠', '❤️', '🌟', '✨', '🌙'
  ];

  const getFrequencyText = (habit: Habit) => {
    if (habit.frequency === 'daily') return 'Daily';
    if (habit.frequency === 'weekly') return 'Weekly';
    if (habit.frequency_per_week) {
      return `${habit.frequency_per_week}× per week`;
    }
    return 'Custom';
  };

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
            <div>
              <label className="label">Habit Name</label>
              <input
                type="text"
                placeholder="e.g., Practice German, Exercise, Read"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Description (optional)</label>
              <input
                type="text"
                placeholder="Any notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">How often?</label>
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: 'daily', frequency_per_week: 7 })}
                  className={`px-3 py-2 text-xs font-body transition-all border-2 ${
                    formData.frequency === 'daily'
                      ? 'bg-ink-800 text-paper-50 border-ink-800'
                      : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
                  }`}
                >
                  Every Day
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: 'custom', frequency_per_week: 3 })}
                  className={`px-3 py-2 text-xs font-body transition-all border-2 ${
                    formData.frequency === 'custom'
                      ? 'bg-ink-800 text-paper-50 border-ink-800'
                      : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
                  }`}
                >
                  X Times/Week
                </button>
              </div>

              {formData.frequency === 'custom' && (
                <div className="mt-2">
                  <label className="label text-xs">Times per week</label>
                  <select
                    value={formData.frequency_per_week}
                    onChange={(e) => setFormData({ ...formData, frequency_per_week: parseInt(e.target.value) })}
                    className="input-field"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <option key={num} value={num}>{num} times per week</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="label">Icon/Emoji</label>
              <div className="grid grid-cols-10 gap-1 p-2 bg-paper-50 border border-ink-200 max-h-32 overflow-y-auto">
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`w-8 h-8 text-lg flex items-center justify-center transition-all border ${
                      formData.icon === emoji
                        ? 'border-ink-800 bg-ink-100'
                        : 'border-transparent hover:border-ink-400 hover:bg-paper-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-xs font-body text-ink-500 mt-1">Selected: {formData.icon}</p>
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
                    <span className="text-2xl mr-3">{habit.icon || '✓'}</span>
                    <div>
                      <h4 className="font-display text-ink-900">{habit.name}</h4>
                      {habit.description && (
                        <p className="text-sm font-body text-ink-600 mt-1">{habit.description}</p>
                      )}
                      <p className="text-xs font-body text-ink-500 mt-1">{getFrequencyText(habit)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => logHabit(habit.id)}
                  disabled={loading === habit.id || justLogged === habit.id}
                  className={`text-xs px-4 py-2 font-body border-2 transition-all ${
                    justLogged === habit.id
                      ? 'bg-ink-800 text-paper-50 border-ink-800'
                      : loading === habit.id
                      ? 'bg-paper-200 text-ink-400 border-ink-200 cursor-wait'
                      : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
                  }`}
                >
                  {justLogged === habit.id ? '✓ Logged!' : loading === habit.id ? 'Logging...' : '✓ Check Off'}
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
