# AGENTS.md

## Project Overview
This project is JustDailyBanter, a Next.js soccer club tracking MVP.
It tracks AC Milan, Leeds, and Chelsea using football-data.org data.
The Daily Brief page currently uses mock content.

## Working Principles
- Prefer small focused changes over large rewrites.
- Inspect the relevant files before making changes.
- Explain assumptions before changing architecture.
- Do not introduce new dependencies without a clear reason.
- Do not blindly refactor working code.
- Keep changes easy to review.

## Project State Tracking
- Read PROJECT_STATUS.md before starting meaningful work.
- Update PROJECT_STATUS.md when tasks are completed, added, blocked, or reprioritized.
- Keep completed tasks separate from active and pending tasks.
- Do not let PROJECT_STATUS.md become a large unorganized TODO list.

## Maintenance Rule
- Treat AGENTS.md as a living instruction file.
- Update AGENTS.md when project architecture, APIs, database/cache strategy, deployment process, verification commands, or security rules change.
- Do not update AGENTS.md for ordinary task completion or small bug fixes unless they create a reusable rule.
- Use PROJECT_STATUS.md for active, pending, blocked, and completed task tracking.

## Important Files
- app/page.tsx: home page entry point.
- components/HomeDashboard.tsx: team cards, scores, schedules, crests, and standings UI.
- lib/footballData.ts: football-data.org fetches, cache logic, fallbacks, and formatting.
- lib/mockBriefs.ts: team definitions and mock Daily Brief content.
- app/api/football-data/route.ts: public cached football data endpoint.
- app/api/football-data/refresh/route.ts: refresh endpoint for cron/manual refresh.
- vercel.json: Vercel cron configuration.
- next.config.mjs: external image configuration.

## Local Setup
Use:

```bash
npm install
npm run dev
```

Required local environment variable:
FOOTBALL_DATA_API_KEY

Optional/proposed environment variable:
CRON_SECRET

## Verification Commands
After meaningful code changes, run:

```bash
npm run lint
npm run build
```

If the change affects football data behavior, also verify:
- /
- /daily-brief
- /api/football-data
- /api/football-data/refresh when relevant

## API And Secret Handling
- Keep FOOTBALL_DATA_API_KEY server-side only.
- Never expose API keys in client components.
- Never commit .env.local.
- Protect refresh behavior with a server-side secret.
- Be cautious with football-data.org rate limits.

## Vercel Notes
- The app is intended for Vercel deployment.
- Module-level in-memory cache can reset on cold starts or separate serverless instances.
- Durable cache/database planning is a known pending task.
- Check Vercel build logs and environment variables when production behavior differs from local behavior.

## Coding Style
- Use TypeScript carefully.
- Prefer readable code over clever code.
- Avoid broad rewrites.
- Keep formatting consistent with the existing codebase.
- Do not change UI styling unless the task asks for it.

## Response Expectations
After completing a task, summarize:
1. Files changed
2. What changed
3. How it was verified
4. Any risks or follow-up tasks
5. Whether PROJECT_STATUS.md should be updated
