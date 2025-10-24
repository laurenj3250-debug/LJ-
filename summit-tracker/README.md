# Summit Tracker 🏔️

A beautiful goal-tracking app combining bullet journaling with habit tracking, featuring an Alex Honnold/Yosemite climbing aesthetic. Track your yearly, monthly, and weekly goals while building consistent habits to reach your summit!

## Features

- **Multi-level Goals**: Set and track yearly, monthly, and weekly goals
- **Habit Tracking**: Create daily and weekly habits linked to your goals
- **Rapid Logging**: Quick capture of tasks, events, and notes (bullet journal style)
- **Week View**: Visualize your entire week at a glance with habit tracking grid
- **Progress Visualization**: Beautiful progress bars, streaks, and completion tracking
- **Climbing-Themed UI**: Inspired by the granite walls of Yosemite and the spirit of free solo climbing

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- date-fns for date utilities
- Recharts for visualizations

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

### Database Setup

1. Install PostgreSQL if you haven't already
2. Create a new database:
```bash
psql -U postgres
CREATE DATABASE summit_tracker;
\q
```

3. Run the schema to create tables:
```bash
psql -U postgres -d summit_tracker -f backend/src/config/schema.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Edit `.env` with your database credentials:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/summit_tracker
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. The default `.env` should work for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`

## Usage

### Getting Started

1. **Register**: Create a new account with your email and password
2. **Login**: Sign in to access your dashboard

### Dashboard Overview

The main dashboard has two views:

#### Overview Mode
- **Goals Section**: Create and track yearly, monthly, and weekly goals
  - Add new goals with titles, descriptions, and target dates
  - Track progress with interactive progress bars
  - Mark goals as complete with a single click

- **Habits Section**: Build consistent daily and weekly habits
  - Create habits with custom colors
  - Link habits to specific goals
  - Quick-log habit completions with one tap

- **Rapid Log**: Capture thoughts and tasks instantly
  - Three entry types: Tasks, Events, Notes
  - Priority levels: Low, Medium, High
  - Mark tasks complete or migrate them

#### Week View
- **Habit Grid**: See your entire week of habit completions at a glance
- **Daily Tasks**: View all tasks and events organized by day
- **Weekly Goals**: Track progress on your week's objectives

### Tips for Best Results

1. **Start Small**: Begin with 2-3 daily habits
2. **Link Habits to Goals**: Connect your daily actions to bigger objectives
3. **Use Rapid Log Daily**: Quick daily logging keeps you on track
4. **Review Weekly**: Switch to week view every Sunday to plan ahead
5. **Celebrate Progress**: Update goal progress bars as you make progress

## Development

### Backend Development

Build for production:
```bash
npm run build
npm start
```

### Frontend Development

Build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
summit-tracker/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/log` - Log habit completion
- `GET /api/habits/:id/stats` - Get habit statistics

### Daily Logs
- `GET /api/logs` - Get daily logs
- `POST /api/logs` - Create new log entry
- `PUT /api/logs/:id` - Update log entry
- `DELETE /api/logs/:id` - Delete log entry

## Design Philosophy

Summit Tracker is inspired by the discipline and focus required in free solo climbing. Every goal is like a route up a granite wall - you need:

- **Clear objectives** (your goals)
- **Consistent training** (your habits)
- **Daily practice** (rapid logging)
- **Progress tracking** (visualizations)
- **Mental fortitude** (the climbing aesthetic to keep you motivated)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Acknowledgments

- Inspired by Alex Honnold's free solo climbing achievement
- Bullet journal methodology by Ryder Carroll
- The beautiful granite of Yosemite National Park 🏔️
