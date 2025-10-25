import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import goalsRoutes from './routes/goals';
import habitsRoutes from './routes/habits';
import logsRoutes from './routes/logs';
import moodRoutes from './routes/mood';
import eventsRoutes from './routes/events';
import { runMigrations, testConnection } from './config/migrate';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/events', eventsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Summit Tracker API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🏔️  Starting Summit Tracker API...');

    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Run migrations (creates tables if they don't exist)
    await runMigrations();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Summit Tracker API running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
