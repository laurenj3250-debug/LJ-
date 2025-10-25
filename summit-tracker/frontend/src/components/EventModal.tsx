import React, { useState, useEffect } from 'react';
import { eventsAPI, goalsAPI } from '../services/api';
import type { Event, Goal } from '../types';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  event?: Event;
  initialDate?: Date;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onUpdate, event, initialDate }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'event' as 'event' | 'task' | 'climbing_session' | 'training' | 'rest_day',
    start_time: '',
    end_time: '',
    all_day: false,
    location: '',
    color: '#666666',
    icon: '📅',
    goal_id: undefined as number | undefined,
  });

  useEffect(() => {
    if (isOpen) {
      loadGoals();
      if (event) {
        // Edit mode
        setFormData({
          title: event.title,
          description: event.description || '',
          event_type: event.event_type,
          start_time: event.start_time,
          end_time: event.end_time || '',
          all_day: event.all_day,
          location: event.location || '',
          color: event.color,
          icon: event.icon || '📅',
          goal_id: event.goal_id,
        });
      } else if (initialDate) {
        // Create mode with initial date
        const dateStr = format(initialDate, 'yyyy-MM-dd');
        setFormData(prev => ({
          ...prev,
          start_time: `${dateStr}T09:00`,
          end_time: `${dateStr}T10:00`,
        }));
      }
    }
  }, [isOpen, event, initialDate]);

  const loadGoals = async () => {
    try {
      const res = await goalsAPI.getAll(undefined, 'active');
      setGoals(res.data);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (event) {
        await eventsAPI.update(event.id, formData);
      } else {
        await eventsAPI.create(formData);
      }
      onUpdate();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(event.id);
      onUpdate();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'event',
      start_time: '',
      end_time: '',
      all_day: false,
      location: '',
      color: '#666666',
      icon: '📅',
      goal_id: undefined,
    });
  };

  if (!isOpen) return null;

  const eventTypes = [
    { value: 'event', label: 'Event', icon: '📅' },
    { value: 'task', label: 'Task', icon: '✓' },
    { value: 'climbing_session', label: 'Climbing Session', icon: '🧗' },
    { value: 'training', label: 'Training', icon: '💪' },
    { value: 'rest_day', label: 'Rest Day', icon: '😴' },
  ];

  const eventIcons = ['📅', '✓', '🧗', '💪', '😴', '🎯', '📚', '🏃', '🧘', '⭐', '🔥', '⛰️'];
  const colors = ['#666666', '#757575', '#8B8B8B', '#A0A0A0', '#5D7A8C', '#6B8E9E', '#7A9DAF'];

  return (
    <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-paper-50 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-ink-300 shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-display text-ink-900 mb-6">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
                required
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, event_type: type.value as any, icon: type.icon })}
                    className={`p-3 border-2 font-body text-sm transition-all ${
                      formData.event_type === type.value
                        ? 'bg-ink-800 text-paper-50 border-ink-800'
                        : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.all_day}
                onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                className="w-4 h-4 border-2 border-ink-400"
              />
              <label className="ml-2 text-sm font-body text-ink-700">
                All day event
              </label>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                {formData.all_day ? 'Date *' : 'Start Time *'}
              </label>
              <input
                type={formData.all_day ? 'date' : 'datetime-local'}
                value={formData.all_day ? formData.start_time.split('T')[0] : formData.start_time}
                onChange={(e) => {
                  const value = formData.all_day ? `${e.target.value}T00:00` : e.target.value;
                  setFormData({ ...formData, start_time: value });
                }}
                className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
                required
              />
            </div>

            {/* End Time */}
            {!formData.all_day && (
              <div>
                <label className="block text-sm font-body text-ink-700 mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
                />
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
                placeholder="e.g., Yosemite Valley"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Link to Goal */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Link to Goal (Optional)
              </label>
              <select
                value={formData.goal_id || ''}
                onChange={(e) => setFormData({ ...formData, goal_id: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border-2 border-ink-300 bg-paper-50 text-ink-900 font-body focus:border-ink-500 focus:outline-none"
              >
                <option value="">No goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title} ({goal.goal_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-12 gap-1">
                {eventIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-2 text-center transition-all border-2 ${
                      formData.icon === icon
                        ? 'border-ink-800 bg-ink-100'
                        : 'border-ink-200 hover:border-ink-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-body text-ink-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 border-2 transition-all ${
                      formData.color === color
                        ? 'border-ink-800 ring-2 ring-ink-300'
                        : 'border-ink-200 hover:border-ink-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4">
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border-2 border-red-600 text-red-600 font-body text-sm hover:bg-red-600 hover:text-white transition-all"
                >
                  Delete
                </button>
              )}
              <div className={`flex space-x-2 ${!event ? 'ml-auto' : ''}`}>
                <button
                  type="button"
                  onClick={() => { onClose(); resetForm(); }}
                  className="px-4 py-2 border-2 border-ink-300 text-ink-700 font-body text-sm hover:border-ink-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-ink-800 bg-ink-800 text-paper-50 font-body text-sm hover:bg-ink-700 transition-all"
                >
                  {event ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
