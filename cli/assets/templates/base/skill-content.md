{{FRONTMATTER}}
# Learning on Web — {{SKILL_OR_WORKFLOW}}

## Overview

Transform **any course content** into an interactive, beautiful learning website through an AI-assisted, human-in-the-loop pipeline.

4-phase pipeline: **Analyze → Notes → Web → Audit**

Each phase is a separate sub-{{SKILL_OR_WORKFLOW_LOWER}} that can run independently or as part of the full pipeline.

## When to Apply

Use this {{SKILL_OR_WORKFLOW_LOWER}} when the user wants to:
- Transform course content into an interactive website
- Generate learning notes from raw materials
- Build a beautiful educational web platform
- Audit and improve a learning website

**Trigger words:** "build learning site", "transform course", "create learning platform", "course to website", "make interactive learning", "convert course content"

## Required MCP Servers

Phase 3 (web building) requires:
- **shadcn/ui MCP** — accurate component implementation
- **Magic UI MCP** — animated interactive components

## Sub-{{SKILL_OR_WORKFLOW}}s

The following sub-{{SKILL_OR_WORKFLOW_LOWER}}s are available in `{{SKILLS_PATH}}`:

| Phase | {{SKILL_OR_WORKFLOW}} | Purpose |
|-------|------|---------|
| 1 | `course-analyze` | Discover course structure, audience, goals → `course-spec.json` |
| 2 | `course-to-notes` | Transform content into value-added learning notes |
| 3 | `notes-to-web` | Build interactive website with intelligent component selection |
| 4 | `learning-audit` | Audit quality, find gaps, fix issues |

## Session Persistence

This {{SKILL_OR_WORKFLOW_LOWER}} maintains state in `.learning/PROGRESS.md` and `.learning/tasks/`. On activation, always check for existing progress first and offer to resume.

## Full Instructions

Read the main orchestrator and sub-{{SKILL_OR_WORKFLOW_LOWER}} SKILL.md files in `{{SKILLS_PATH}}` for detailed instructions.
