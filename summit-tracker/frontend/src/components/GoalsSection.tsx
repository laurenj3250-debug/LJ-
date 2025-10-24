import React, { useState } from 'react';
import { goalsAPI } from '../services/api';
import type { Goal } from '../types';

interface GoalsSectionProps {
  goals: Goal[];
  onUpdate: () => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [goalType, setGoalType] = useState<'yearly' | 'monthly' | 'weekly'>('weekly');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await goalsAPI.create({
        ...formData,
        goal_type: goalType,
      });
      setFormData({ title: '', description: '', target_date: '' });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const updateProgress = async (id: number, progress: number) => {
    try {
      await goalsAPI.update(id, { progress });
      onUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
    try {
      await goalsAPI.update(id, { status: newStatus as any });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const yearlyGoals = goals.filter(g => g.goal_type === 'yearly' && g.status === 'active');
  const monthlyGoals = goals.filter(g => g.goal_type === 'monthly' && g.status === 'active');
  const weeklyGoals = goals.filter(g => g.goal_type === 'weekly' && g.status === 'active');

  const renderGoalsList = (goalsList: Goal[], type: string, emoji: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-granite-800 mb-3 flex items-center">
        <span className="mr-2">{emoji}</span>
        {type} Goals
      </h3>
      {goalsList.length === 0 ? (
        <p className="text-granite-500 italic">No {type.toLowerCase()} goals yet</p>
      ) : (
        <div className="space-y-3">
          {goalsList.map((goal) => (
            <div key={goal.id} className="bg-gradient-to-r from-white to-summit-50 rounded-lg p-4 border border-summit-200 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-granite-800">{goal.title}</h4>
                  {goal.description && (
                    <p className="text-sm text-granite-600 mt-1">{goal.description}</p>
                  )}
                  {goal.target_date && (
                    <p className="text-xs text-summit-600 mt-1">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleStatus(goal.id, goal.status)}
                  className="ml-2 text-2xl hover:scale-110 transition-transform"
                >
                  {goal.status === 'completed' ? '✅' : '⭕'}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-granite-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-granite-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-summit-500 to-summit-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full mt-2 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-granite-800 flex items-center">
          <span className="mr-2">🎯</span>
          Your Goals
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-summit-50 rounded-lg border border-summit-200">
          <div className="flex space-x-2 mb-4">
            {(['yearly', 'monthly', 'weekly'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGoalType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  goalType === type
                    ? 'bg-summit-600 text-white'
                    : 'bg-white text-granite-700 border border-granite-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Goal title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={2}
            />
            <input
              type="date"
              value={formData.target_date}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full">
              Create Goal
            </button>
          </div>
        </form>
      )}

      {renderGoalsList(yearlyGoals, 'Yearly', '🏔️')}
      {renderGoalsList(monthlyGoals, 'Monthly', '⛰️')}
      {renderGoalsList(weeklyGoals, 'Weekly', '🧗')}
    </div>
  );
};

export default GoalsSection;
