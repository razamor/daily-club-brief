# JustDailyBanter

A simple two-page Next.js MVP for a soccer daily summary app.

This version uses football-data.org for recent score data and keeps brief content mocked. It does not connect to AI services, databases, scraping, or real news sources.

## Features

- Home page with the JustDailyBanter brand and a Daily Brief navigation link
- Visual team cards for AC Milan, Leeds, and Chelsea with latest finished scores
- Cached football schedules, scores, standings, and live match data from football-data.org
- Separate Daily Brief page with mock summaries for each team
- Placeholder source links for each team brief
- Mock data kept in `lib/mockBriefs.ts` for easy editing later
- Clean responsive styling

## Football Data Cache

- `lib/footballData.ts` contains the football-data.org API helpers, server cache, scheduled refresh logic, and live refresh timing.
- `app/api/football-data/route.ts` serves cached football data to frontend components.
- `app/api/football-data/refresh/route.ts` refreshes the cached football data for scheduled jobs.
- `vercel.json` schedules cache refreshes at `15:00 UTC` and `22:00 UTC`, matching 10:00 AM and 5:00 PM Houston time during daylight savings time.
- During live matches, the frontend checks the cached API route every 60 seconds. When no games are live, it uses a slower cached-data check and does not call football-data.org directly from the browser.

Create `.env.local` with:

```bash
FOOTBALL_DATA_API_KEY=your_api_key
CRON_SECRET=your_random_cron_secret
```

The refresh endpoint at `/api/football-data/refresh` requires
`Authorization: Bearer <CRON_SECRET>`. Vercel Cron automatically sends this
header when `CRON_SECRET` is configured in the Vercel project environment.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` starts the production server after building.
- `npm run lint` runs the Next.js lint command.
