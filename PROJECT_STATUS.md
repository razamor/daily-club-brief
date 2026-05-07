# JustDailyBanter - Project Status

## Project Overview
- Next.js soccer club tracking MVP.
- Tracks AC Milan, Leeds, and Chelsea.
- Uses football-data.org for soccer data.
- Daily Brief page currently uses mock content.

## Current Goal
Stabilize the MVP foundation before adding larger features.

## Active Tasks
- [ ] Create `AGENTS.md`
- [ ] Create initial Codex skills

## Pending Major Tasks
- [ ] Plan durable cache/database replacement for in-memory cache
- [ ] Replace mocked Daily Brief content with a real content pipeline
- [ ] Add tests for `lib/footballData.ts`

## Blocked / Waiting
- Durable cache/database choice is pending.
- Daily Brief pipeline is pending until data/cache strategy is more stable.

## Known Risks
- In-memory cache can reset on Vercel cold starts or separate serverless instances.
- football-data.org API rate limits are a practical risk.
- Refresh endpoint should not remain publicly usable.
- Daily Brief content is still mocked.

## Architecture Decisions
- Frontend/backend framework: Next.js App Router
- Deployment target: Vercel
- External soccer data provider: football-data.org
- Current cache strategy: temporary in-memory cache in `lib/footballData.ts`
- API key should stay server-side only

## Recently Completed
- [x] Protected `/api/football-data/refresh` with `CRON_SECRET`
- [x] Fixed schedule separator encoding bug using `\u00b7`
- [x] Made standings tables scrollable
- [x] Added football-data.org-backed home page data
- [x] Added club crests and standings previews

## Next Recommended Step
Create `AGENTS.md` so future Codex sessions have clear project-specific instructions.
