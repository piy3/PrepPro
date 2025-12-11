# Job Openings API Setup Guide

## Overview
The job openings section supports **real-time job fetching** from JSearch API (RapidAPI) with automatic fallback to high-quality curated data.

## Features

### ✅ Real API Integration
- **JSearch API** from RapidAPI (free tier: 2,500 requests/month)
- Live job listings from top tech companies
- Real-time salary data, applicant counts, and job details
- Company logos via Clearbit API

### ✅ Smart Fallback System
- Works perfectly **without API key**
- Curated listings from: Google, Meta, Amazon, Microsoft, Apple, Netflix, OpenAI, Stripe
- All features functional in fallback mode

### ✅ Modern UI Features
- **Glassmorphism design** with backdrop blur effects
- **Gradient stat cards** with hover animations
- **Smart search & filters** with real-time updates
- **Save jobs** feature with localStorage persistence
- **Direct apply links** to company career pages
- **Responsive design** for all screen sizes
- **Dark mode** fully supported

## Setup Options

### Option 1: Use Fallback Data (Recommended for Testing)
**No setup required!** The app works immediately with high-quality fallback data.

### Option 2: Enable Real API (For Production)

#### Step 1: Get API Key
1. Visit [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Sign up for free account
3. Subscribe to **Basic Plan** (FREE - 2,500 requests/month)
4. Copy your API key from the dashboard

#### Step 2: Configure Environment
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your API key:
   ```env
   JSEARCH_API_KEY=your_actual_api_key_here
   ```

#### Step 3: Restart Development Server
```bash
npm run dev
```

## API Endpoints

### GET `/api/openings`

**Query Parameters:**
- `search` - Job title, company, or skills (e.g., "react developer")
- `location` - City or state (e.g., "San Francisco")
- `type` - Job type: `all`, `remote`, `onsite`
- `filter` - Sort by: `all`, `recent`, `popular`
- `page` - Page number (default: 1)

**Example:**
```javascript
GET /api/openings?search=software%20engineer&location=San%20Francisco&type=remote&filter=recent
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_123",
        "title": "Senior Software Engineer",
        "company": "Google",
        "location": "Mountain View, CA",
        "type": "Full-time",
        "experience": "5+ years",
        "salary": "$150k - $250k",
        "skills": ["JavaScript", "Python", "Cloud"],
        "description": "Build innovative solutions...",
        "posted": "2 days ago",
        "applicants": 245,
        "remote": true,
        "logo": "https://logo.clearbit.com/google.com",
        "applyLink": "https://careers.google.com",
        "jobUrl": "https://careers.google.com/job/123"
      }
    ],
    "total": 8,
    "filters": {
      "filter": "recent",
      "search": "software engineer",
      "location": "San Francisco",
      "type": "remote"
    }
  }
}
```

## Features Breakdown

### 1. Smart Search
- Searches across job titles, company names, and required skills
- Case-insensitive matching
- Real-time results

### 2. Location Filter
- Filter by city, state, or country
- Supports partial matching

### 3. Job Type Filter
- **All** - Show all jobs
- **Remote** - Work from anywhere positions
- **On-site** - Office-based roles

### 4. Sort Options
- **All Jobs** - Default listing
- **Recent** - Posted in last 7 days
- **Most Popular** - Sorted by applicant count

### 5. Save Jobs
- Bookmark interesting positions
- Persists in localStorage
- Visual indicator for saved jobs
- One-click save/unsave

### 6. Direct Apply
- Opens company career page in new tab
- No intermediate forms
- Direct access to application

## Alternative APIs

If you want to use different job APIs:

### Adzuna API
```javascript
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${query}`;
```

### RemoteOK API (No auth required)
```javascript
const url = `https://remoteok.com/api?tags=${query}`;
```

### USAJobs API (Government jobs)
```javascript
const url = `https://data.usajobs.gov/api/search?Keyword=${query}`;
headers: { 'Authorization-Key': USAJOBS_API_KEY }
```

## Customization

### Change Fallback Companies
Edit `/src/app/api/openings/route.js` - `fallbackJobs` array:
```javascript
const fallbackJobs = [
  {
    title: "Your Custom Job",
    company: "Your Company",
    // ... other fields
  }
];
```

### Modify UI Colors
Edit `/src/app/home/openings/page.js` gradient classes:
```javascript
// Stat cards
from-blue-500 to-blue-600 
from-green-500 to-emerald-600
from-purple-500 to-pink-600
from-orange-500 to-red-600
```

## Troubleshooting

### Jobs Not Loading
- Check console for errors
- Verify API key in `.env.local`
- Restart dev server after adding key
- Check RapidAPI quota limits

### Logos Not Showing
- Clearbit API has rate limits
- Fallback to avatar generator automatically
- Some companies may not have logos

### Search Not Working
- Clear browser cache
- Check network tab for API responses
- Verify query parameters are encoded

## Performance

- **API Response Time**: ~500ms (with JSearch API)
- **Fallback Response**: <50ms (instant)
- **Caching**: Implement Redis for production
- **Rate Limiting**: 2,500 requests/month (free tier)

## Production Deployment

1. Add API key to environment variables
2. Set up caching layer (Redis recommended)
3. Implement rate limiting
4. Monitor API usage
5. Consider upgrading to paid plan for higher limits

## Support

For issues or questions:
- Check console logs for detailed errors
- Verify API key validity
- Test with fallback mode first
- Review RapidAPI documentation
