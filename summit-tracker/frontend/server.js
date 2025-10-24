import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  console.log('Health check request received');
  res.status(200).json({ status: 'ok' });
});

// Serve static files from dist directory
app.use(express.static(join(__dirname, 'dist')));

// Fallback middleware - send all other requests to index.html (for SPA routing)
app.use((req, res, next) => {
  // Only send index.html for GET requests that don't match static files
  if (req.method === 'GET') {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`✅ Health check available at http://0.0.0.0:${PORT}/health`);
  console.log(`✅ Listening on all interfaces (0.0.0.0)`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
