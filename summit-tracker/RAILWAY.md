# Railway Deployment Guide 🚂

**Good news:** Railway gives you **$5 FREE credit every month** - you haven't been charged yet!

## Step-by-Step Setup

### 1. Create PostgreSQL Database

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creates the database and generates a `DATABASE_URL` automatically
4. ✅ Leave this running

### 2. Deploy Backend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your `LJ-` repository
3. Railway will try to deploy - it will fail (that's okay!)
4. Click on the service → **"Settings"**
5. **Root Directory**: Enter `summit-tracker/backend`
6. **Variables** tab → Add these:
   ```
   JWT_SECRET = any-random-string-here-123
   NODE_ENV = production
   ```
7. DATABASE_URL should already be there (auto-connected to PostgreSQL)
8. **"Deployments"** tab → Click **"Redeploy"**
9. Wait ~2 minutes - you'll see:
   ```
   ✅ Database connection successful
   🚀 Running initial schema...
   ✅ All migrations completed successfully!
   ✅ Summit Tracker API running on port 5000
   ```
10. Copy the backend URL (Settings → Domains → `https://xxxxx.railway.app`)

### 3. Deploy Frontend

1. Click **"+ New"** → **"GitHub Repo"** (same repo again)
2. Click on the service → **"Settings"**
3. **Root Directory**: Enter `summit-tracker/frontend`
4. **Variables** tab → Add:
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```
   (Use the URL you copied from step 2)
5. **"Deployments"** tab → Click **"Redeploy"**
6. Wait ~2 minutes for build
7. **Settings** → **Domains** → Click **"Generate Domain"**
8. ✅ **Open your app!** https://xxxxx.railway.app

## Total Setup Time: ~5 minutes

## Auto-Deploy from GitHub

Every time you (or I via Claude) push to GitHub:
- Railway automatically detects the changes
- Rebuilds and redeploys both services
- Takes ~2 minutes
- Zero manual work needed!

## Checking Deployment Status

### View Logs:
1. Click on Backend or Frontend service
2. **"Deployments"** tab
3. Click latest deployment
4. **"View Logs"** - see real-time output

### Common Issues:

**Backend won't start?**
- Check "Variables" has `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`
- Check "Settings" → Root Directory is `summit-tracker/backend`
- View logs for specific error

**Frontend can't connect to backend?**
- Check `VITE_API_URL` points to backend Railway URL (not localhost!)
- Must end with `/api`
- Example: `https://backend-production-abc123.railway.app/api`

**"Build failed"?**
- Check Root Directory is set correctly
- Check logs for specific npm/build errors

## Your Free Tier:

- **$5 free credit per month**
- **500 hours execution** (enough for hobby projects)
- **100GB outbound bandwidth**
- PostgreSQL database included

You won't be charged unless you exceed these limits!

## Cost Monitoring:

1. Railway Dashboard → **"Usage"**
2. See exactly how much credit you've used
3. Set up spending limits if you want

## Need Help?

Railway has great docs: https://docs.railway.app

Or ask me - I'll help debug any deployment issues!
