---
name: focused-debugging
description: Use when investigating one specific technical issue using evidence from files, logs, errors, commands, and reproduction steps.
---

# Focused Debugging

## Purpose
Investigate and debug one specific technical issue using evidence from files, logs, errors, commands, and reproduction steps.

## Use When
- Build failures.
- Runtime bugs.
- Deployment mismatches.
- API failures.
- Caching issues.
- UI regressions.

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
- Define the issue before proposing fixes.
- Ask for missing logs or reproduction details only when necessary.
- Inspect relevant files before proposing changes.
- Separate local issues from deployment or environment issues.
- Check console errors, network errors, logs, environment variables, API responses, and recent changes when relevant.
- Propose the smallest reasonable fix.
- Avoid unrelated rewrites.
- Avoid introducing new dependencies unless clearly justified.
- Verify changes using relevant commands and practical testing.
- If user interaction is required, provide a simple human-in-the-loop verification checklist.
