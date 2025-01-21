# Poetry Site Deployment Plan

## 1. Backend Deployment (Priority)

### Prepare Backend
1. Update environment variables
   - Create `.env` file for production
   - Set secure values for:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `PORT`
     - Other sensitive data

2. Database Setup
   - Set up PostgreSQL database on a cloud provider (suggested: [Railway](https://railway.app) or [Supabase](https://supabase.com))
   - Update database connection string in environment variables
   - Run migrations: `npx prisma migrate deploy`
   - Seed initial data if needed

3. Backend Hosting Options
   - Option 1: [Railway](https://railway.app)
     - Easy PostgreSQL integration
     - Good free tier
     - Simple deployment process
   - Option 2: [Render](https://render.com)
     - Reliable free tier
     - Good documentation
     - PostgreSQL support
   - Option 3: [Fly.io](https://fly.io)
     - Global deployment
     - Generous free tier
     - Good performance

### Deploy Backend
1. Choose Railway for deployment:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login to Railway
   railway login

   # Initialize project
   railway init

   # Link to existing project
   railway link

   # Deploy
   railway up