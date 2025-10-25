import React, { useState } from 'react';
import { goalsAPI } from '../services/api';
import type { Goal } from '../types';
import { Carabiner, MountainLine } from './LineArt';

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

  const renderGoalsList = (goalsList: Goal[], type: string) => (
    <div className="mb-6">
      <h3 className="text-base font-display text-ink-800 mb-3 tracking-wide border-b border-ink-200 pb-2">
        {type} Objectives
      </h3>
      {goalsList.length === 0 ? (
        <p className="text-ink-400 italic font-body text-sm">No {type.toLowerCase()} goals set</p>
      ) : (
        <div className="space-y-3">
          {goalsList.map((goal) => (
            <div key={goal.id} className="bg-paper-50 p-4 border-l-2 border-ink-400">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-display text-ink-900">{goal.title}</h4>
                  {goal.description && (
                    <p className="text-sm font-body text-ink-600 mt-1">{goal.description}</p>
                  )}
                  {goal.target_date && (
                    <p className="text-xs font-body text-ink-500 mt-1">
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleStatus(goal.id, goal.status)}
                  className="ml-2 w-6 h-6 border-2 border-ink-400 flex items-center justify-center hover:bg-ink-100 transition-all"
                  title={goal.status === 'completed' ? 'Mark as active' : 'Mark as completed'}
                >
                  {goal.status === 'completed' && (
                    <span className="text-ink-800 font-body text-sm">✓</span>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-body text-ink-600 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-paper-200 h-1">
                  <div
                    className="bg-ink-700 h-1 transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full mt-2 cursor-pointer accent-ink-700"
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
        <div>
          <h2 className="text-xl font-display text-ink-900 flex items-center tracking-wide">
            <Carabiner className="w-6 h-6 mr-2 text-ink-600" />
            Goals
          </h2>
          <MountainLine className="w-32 h-4 text-ink-300 mt-1" />
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs">
          {showForm ? '× Close' : '+ New'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-paper-100 border-l-4 border-ink-400">
          <div className="flex space-x-2 mb-4">
            {(['yearly', 'monthly', 'weekly'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGoalType(type)}
                className={`px-3 py-1 text-xs font-body transition-all border-2 ${
                  goalType === type
                    ? 'bg-ink-800 text-paper-50 border-ink-800'
                    : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
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

      {renderGoalsList(yearlyGoals, 'Yearly')}
      {renderGoalsList(monthlyGoals, 'Monthly')}
      {renderGoalsList(weeklyGoals, 'Weekly')}
    </div>
  );
};

export default GoalsSection;
