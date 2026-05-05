# JustDailyBanter

A simple two-page Next.js MVP for a soccer daily summary app.

This version uses football-data.org for recent score data and keeps brief content mocked. It does not connect to AI services, databases, scraping, or real news sources.

## Features

- Home page with the JustDailyBanter brand and a Daily Brief navigation link
- Visual team cards for AC Milan, Leeds, and Chelsea with latest finished scores
- Separate Daily Brief page with mock summaries for each team
- Placeholder source links for each team brief
- Mock data kept in `lib/mockBriefs.ts` for easy editing later
- Clean responsive styling

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
