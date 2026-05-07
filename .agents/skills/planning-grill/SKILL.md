---
name: planning-grill
description: Use when challenging and refining a feature, architecture idea, integration strategy, or implementation plan before coding begins.
---

# Planning Grill

## Purpose
Challenge and refine a feature, architecture idea, or implementation plan before coding begins.

## Use When
- Database/cache planning.
- API integration planning.
- Deployment strategy.
- Authentication decisions.
- Daily Brief generation pipeline.
- Evaluating whether a feature is worth building now.

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
- Do not start coding.
- Inspect relevant repo documentation and files first.
- Read `PROJECT_STATUS.md` and `AGENTS.md` before analysis.
- Clarify the actual goal.
- Identify hidden complexity, risks, tradeoffs, and dependencies.
- Ask focused follow-up questions only when needed.
- Provide recommendations with reasoning.
- Prefer the simplest architecture that satisfies the current MVP needs.
- Avoid recommending large rewrites without strong justification.
- Suggest an ADR only when the decision is:
  - difficult to reverse
  - surprising without context
  - based on meaningful tradeoffs
- Note whether `AGENTS.md` or `PROJECT_STATUS.md` may need updates after the decision.
