# Vercel Deployment Guide

## Issues Fixed

Your build was failing because of:

1. **useToast() Hook Error**: The hook was throwing an error during prerendering when the Toast context wasn't available
2. **Missing API_URL Fallback**: Components were using `undefined` API URLs during build time, which could cause errors

## What I've Done

✅ **Fixed useToast() Hook** - Now returns a no-op function instead of throwing an error during build time
✅ **Added API URL Fallbacks** - All API_URL references now have `'http://localhost:5000'` as fallback
✅ **Created .env.example** - Documents all required environment variables

## Setup for Vercel

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add the following variable:

```
NEXT_PUBLIC_API_URL = https://your-backend-url.com
```

Replace `https://your-backend-url.com` with your actual backend API URL.

**Important**: For production, make sure:
- The backend is deployed and accessible from Vercel
- CORS is properly configured on your backend
- The API URL uses HTTPS (not HTTP)

### Step 2: Local Development

1. Create a `.env.local` file in the `frontend/` directory
2. Copy the contents from `.env.example`
3. Update the values with your local/development URLs

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Deploy

```bash
git add .
git commit -m "Fix: Add API URL fallbacks and fix prerendering errors"
git push origin main
```

Vercel will automatically rebuild with the new configuration.

## Testing Locally

Before deploying, test the build locally:

```bash
cd frontend
npm run build
npm start
```

## Troubleshooting

If you still get prerendering errors:

1. **Check backend is running** - Make sure your backend server is running
2. **Verify environment variables** - Confirm `NEXT_PUBLIC_API_URL` is set in Vercel
3. **Check CORS configuration** - Ensure backend allows requests from your Vercel domain
4. **Check logs** - Review Vercel's build logs for specific error details

## Notes

- The fallback to `'http://localhost:5000'` is only used during build time
- Client-side API calls will use the environment variable if set
- Toast notifications gracefully handle missing provider context
