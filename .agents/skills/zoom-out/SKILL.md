---
name: zoom-out
description: Use when the developer needs architectural or codebase understanding before implementation, such as tracing data flow, feature behavior, file ownership, or frontend/backend boundaries.
---

# Zoom Out

## Purpose
Help the developer understand how part of the codebase works before changing it.

## Use When
- Understanding data flow.
- Understanding how a feature works.
- Identifying which files control behavior.
- Tracing frontend/backend boundaries.

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
- Do not make code changes unless explicitly requested.
- Inspect relevant files first.
- Explain the system from high level to implementation detail.
- Identify frontend, backend, API route, cache, database, and external service boundaries when relevant.
- Mention important files and their roles.
- Point out risks, confusing areas, and hidden dependencies.
- Use practical explanations suitable for a technical beginner learning software development.
