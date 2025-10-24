# Docker Deployment Guide 🐳

The **easiest** way to run Summit Tracker locally!

## Prerequisites

Just install Docker Desktop:
- **Mac**: https://docs.docker.com/desktop/install/mac-install/
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Linux**: https://docs.docker.com/desktop/install/linux-install/

## Quick Start (One Command!)

```bash
cd summit-tracker
docker-compose up
```

That's it! The app will:
1. ✅ Create a PostgreSQL database
2. ✅ Build and start the backend API
3. ✅ Build and start the frontend
4. ✅ Run all database migrations automatically

**Open your browser:** http://localhost:3000

## Commands

### Start the app
```bash
docker-compose up
```

### Start in background (detached mode)
```bash
docker-compose up -d
```

### Stop the app
```bash
docker-compose down
```

### Stop and delete all data (fresh start)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

### Rebuild after code changes
```bash
docker-compose up --build
```

## What's Running?

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PostgreSQL**: localhost:5432 (postgres/postgres)

## Troubleshooting

### Port already in use?
If you get "port is already allocated":

```bash
# Stop any running services
docker-compose down

# Check what's using the port
lsof -i :3000  # or :5000 or :5432

# Kill the process or change ports in docker-compose.yml
```

### Database data persists between runs
Data is stored in a Docker volume. To reset:

```bash
docker-compose down -v
docker-compose up
```

### Frontend can't connect to backend
Check the logs:
```bash
docker-compose logs backend
```

Make sure you see:
```
✅ Database connection successful
✅ Summit Tracker API running on port 5000
```

## Development Mode

The docker-compose.yml is set up for hot-reloading:
- Changes to `backend/src/*` automatically restart the API
- Changes to `frontend/src/*` automatically refresh the browser

Just edit your code and save!

## Production Deployment

For production (Railway, Render, etc.), use the main README.md deployment guides.
Docker Compose is optimized for local development.
