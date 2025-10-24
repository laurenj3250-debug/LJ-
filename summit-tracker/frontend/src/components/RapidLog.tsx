import React, { useState } from 'react';
import { logsAPI } from '../services/api';
import type { DailyLog, Goal } from '../types';

interface RapidLogProps {
  logs: DailyLog[];
  goals: Goal[];
  onUpdate: () => void;
}

const RapidLog: React.FC<RapidLogProps> = ({ logs, goals, onUpdate }) => {
  const [content, setContent] = useState('');
  const [entryType, setEntryType] = useState<'task' | 'event' | 'note'>('task');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await logsAPI.create({
        content,
        entry_type: entryType,
        priority,
        log_date: new Date().toISOString().split('T')[0],
      });
      setContent('');
      setPriority(undefined);
      onUpdate();
    } catch (error) {
      console.error('Error creating log:', error);
    }
  };

  const updateLogStatus = async (id: number, status: DailyLog['status']) => {
    try {
      await logsAPI.update(id, { status });
      onUpdate();
    } catch (error) {
      console.error('Error updating log:', error);
    }
  };

  const getStatusIcon = (status: DailyLog['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'migrated': return '➡️';
      case 'cancelled': return '❌';
      default: return '⭕';
    }
  };

  const getTypeIcon = (type: DailyLog['entry_type']) => {
    switch (type) {
      case 'task': return '•';
      case 'event': return '○';
      case 'note': return '—';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-rope-600';
      case 'low': return 'text-granite-500';
      default: return 'text-granite-700';
    }
  };

  return (
    <div className="card sticky top-4">
      <h2 className="text-2xl font-bold text-granite-800 mb-4 flex items-center">
        <span className="mr-2">📝</span>
        Rapid Log
      </h2>

      <p className="text-sm text-granite-600 mb-4">
        Quick capture your thoughts, tasks, and events
      </p>

      {/* Quick Entry Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2 mb-3">
          {(['task', 'event', 'note'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEntryType(type)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                entryType === type
                  ? 'bg-summit-600 text-white'
                  : 'bg-granite-100 text-granite-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Add a ${entryType}...`}
          className="input-field mb-2"
          rows={2}
        />

        <div className="flex space-x-2 mb-3">
          <button
            type="button"
            onClick={() => setPriority(priority === 'high' ? undefined : 'high')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-granite-100 text-granite-600'
            }`}
          >
            !!! High
          </button>
          <button
            type="button"
            onClick={() => setPriority(priority === 'medium' ? undefined : 'medium')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              priority === 'medium' ? 'bg-rope-100 text-rope-700' : 'bg-granite-100 text-granite-600'
            }`}
          >
            !! Med
          </button>
          <button
            type="button"
            onClick={() => setPriority(priority === 'low' ? undefined : 'low')}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              priority === 'low' ? 'bg-granite-200 text-granite-700' : 'bg-granite-100 text-granite-600'
            }`}
          >
            ! Low
          </button>
        </div>

        <button type="submit" className="btn-primary w-full">
          Add Entry
        </button>
      </form>

      {/* Today's Logs */}
      <div className="border-t border-granite-200 pt-4">
        <h3 className="font-semibold text-granite-800 mb-3">Today's Entries</h3>

        {logs.length === 0 ? (
          <p className="text-granite-500 italic text-sm text-center py-4">
            No entries yet today
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border transition-all ${
                  log.status === 'completed'
                    ? 'bg-summit-50 border-summit-200 opacity-75'
                    : 'bg-white border-granite-200'
                }`}
              >
                <div className="flex items-start">
                  <button
                    onClick={() => {
                      const nextStatus = log.status === 'open' ? 'completed' : 'open';
                      updateLogStatus(log.id, nextStatus);
                    }}
                    className="mr-2 text-lg hover:scale-110 transition-transform"
                  >
                    {getStatusIcon(log.status)}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <span className="mr-2 font-bold text-granite-700">
                        {getTypeIcon(log.entry_type)}
                      </span>
                      <p className={`text-sm ${getPriorityColor(log.priority)} ${
                        log.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {log.content}
                      </p>
                    </div>
                    {log.priority && (
                      <span className={`text-xs ${getPriorityColor(log.priority)} font-semibold`}>
                        {log.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RapidLog;
