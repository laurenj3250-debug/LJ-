import React, { useState } from 'react';
import { logsAPI } from '../services/api';
import type { DailyLog } from '../types';
import { ChalkBag } from './LineArt';

interface RapidLogProps {
  logs: DailyLog[];
  onUpdate: () => void;
}

const RapidLog: React.FC<RapidLogProps> = ({ logs, onUpdate }) => {
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
      case 'completed': return '✓';
      case 'migrated': return '→';
      case 'cancelled': return '×';
      default: return '';
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
      case 'high': return 'text-ink-900';
      case 'medium': return 'text-ink-700';
      case 'low': return 'text-ink-500';
      default: return 'text-ink-700';
    }
  };

  return (
    <div className="card sticky top-4">
      <h2 className="text-xl font-display text-ink-900 mb-4 flex items-center tracking-wide">
        <ChalkBag className="w-6 h-6 mr-2 text-ink-600" />
        Rapid Log
      </h2>

      <p className="text-sm font-body text-ink-600 mb-4 italic">
        Quick capture for today
      </p>

      {/* Quick Entry Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex space-x-2 mb-3">
          {(['task', 'event', 'note'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setEntryType(type)}
              className={`px-3 py-1 text-xs font-body transition-all border-2 ${
                entryType === type
                  ? 'bg-ink-800 text-paper-50 border-ink-800'
                  : 'bg-paper-50 text-ink-700 border-ink-300 hover:border-ink-500'
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
            className={`px-3 py-1 text-xs font-body border-2 ${
              priority === 'high' ? 'bg-ink-800 text-paper-50 border-ink-800' : 'bg-paper-50 text-ink-600 border-ink-300'
            }`}
          >
            !!! High
          </button>
          <button
            type="button"
            onClick={() => setPriority(priority === 'medium' ? undefined : 'medium')}
            className={`px-3 py-1 text-xs font-body border-2 ${
              priority === 'medium' ? 'bg-ink-700 text-paper-50 border-ink-700' : 'bg-paper-50 text-ink-600 border-ink-300'
            }`}
          >
            !! Med
          </button>
          <button
            type="button"
            onClick={() => setPriority(priority === 'low' ? undefined : 'low')}
            className={`px-3 py-1 text-xs font-body border-2 ${
              priority === 'low' ? 'bg-ink-600 text-paper-50 border-ink-600' : 'bg-paper-50 text-ink-600 border-ink-300'
            }`}
          >
            ! Low
          </button>
        </div>

        <button type="submit" className="btn-primary w-full text-xs">
          Add Entry
        </button>
      </form>

      {/* Today's Logs */}
      <div className="border-t-2 border-ink-200 pt-4">
        <h3 className="font-display text-ink-800 mb-3 text-sm tracking-wide">Today's Entries</h3>

        {logs.length === 0 ? (
          <p className="text-ink-400 italic text-sm text-center py-4 font-body">
            No entries yet
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 border-l-2 transition-all ${
                  log.status === 'completed'
                    ? 'bg-paper-100 border-ink-400 opacity-75'
                    : 'bg-paper-50 border-ink-300'
                }`}
              >
                <div className="flex items-start">
                  <button
                    onClick={() => {
                      const nextStatus = log.status === 'open' ? 'completed' : 'open';
                      updateLogStatus(log.id, nextStatus);
                    }}
                    className="mr-2 w-5 h-5 flex items-center justify-center border-2 border-ink-400 hover:bg-ink-100 transition-all font-body text-xs"
                  >
                    {getStatusIcon(log.status)}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start">
                      <span className="mr-2 font-body font-bold text-ink-700">
                        {getTypeIcon(log.entry_type)}
                      </span>
                      <p className={`text-sm font-body ${getPriorityColor(log.priority)} ${
                        log.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {log.content}
                      </p>
                    </div>
                    {log.priority && (
                      <span className={`text-xs ${getPriorityColor(log.priority)} font-body`}>
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
