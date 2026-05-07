---
name: safe-feature-change
description: Use when implementing one controlled feature change with minimal unrelated impact, such as a small feature, UI behavior adjustment, API route extension, or team/filter addition.
---

# Safe Feature Change

## Purpose
Implement one controlled feature change with minimal unrelated impact.

## Use When
- Adding a small feature.
- Adjusting existing UI behavior.
- Improving loading states.
- Extending an existing API route.
- Adding a new team or filter.

## General Rules
- Inspect relevant files before making claims or proposing changes.
- Avoid guessing.
- Prefer small, reviewable changes.
- Explain assumptions clearly.
- Keep API keys and secrets server-side.
- Respect rate limits, quotas, authentication rules, and terms for external APIs.
- Before adding or changing an external API integration, identify:
  - where credentials are stored
  - whether requests happen server-side or client-side
  - how errors are handled
  - how rate limits and retries are handled
- Run relevant verification commands appropriate for the task.
  Examples may include:
  - `npm run lint`
  - `npm run build`
  - targeted manual verification
- Summarize:
  - files changed
  - verification steps
  - risks
  - follow-up tasks
- Update `PROJECT_STATUS.md` when active, pending, blocked, or completed tasks change.
- Consider whether `AGENTS.md` should be updated when repo-wide instructions, architecture, APIs, database/cache strategy, deployment process, verification commands, or security rules change.

## Instructions
- Restate the requested change before implementation.
- Inspect affected files first.
- Explain current behavior before changing it.
- Implement the smallest reasonable change.
- Prefer existing patterns over introducing new architecture.
- Preserve working behavior outside the requested change.
- Avoid broad refactors.
- Avoid unrelated styling changes unless requested.
- Verify functionality after implementation.
- Summarize what changed, how it was verified, and any risks or follow-up tasks.
