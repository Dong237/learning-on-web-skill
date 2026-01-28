---
name: learning-on-web
description: "Transform any course content into an interactive learning website. 4-phase pipeline: Analyze → Notes → Web → Audit. Human-in-the-loop at every step. Requires shadcn/ui MCP and Magic UI MCP for web building. Trigger: build learning site, transform course, create learning platform, course to website, make interactive learning, convert course content."
---

# Learning on Web — Main Orchestrator

## Overview

Transform **any course content** into an interactive, beautiful learning website through an AI-assisted, human-in-the-loop pipeline.

The skill operates in four composable phases:
1. **Analyze** — Discover course structure, confirm with human
2. **Transform** — Generate value-added learning notes, oriented by human-specified audience and goals
3. **Build** — Create an interactive web platform with intelligent presentation selection
4. **Evaluate** — Audit the experience, identify gaps, fix them

**The fundamental promise:** The learning path stays intact. The knowledge stays intact. But the *way* it's presented becomes dramatically more engaging, interactive, and motivating.

---

## First Action: Check for Existing Progress

**BEFORE ANYTHING ELSE**, check if `.learning/PROGRESS.md` exists in the working directory.

### If PROGRESS.md EXISTS:

1. Read `.learning/PROGRESS.md` to understand current state
2. Read the active phase's task file from `.learning/tasks/`
3. Present status to the user:

   ```
   Found existing learning-on-web project!

   Current state:
   ✅ Phase 1 (Analyze): Complete — course-spec.json generated
   🔄 Phase 2 (Notes): In progress — 8/18 notes done (Module 2, Part 3 next)
   ⏳ Phase 3 (Build): Pending
   ⏳ Phase 4 (Audit): Pending

   Last worked on: 2026-01-25

   Continue from where we left off?
   ```

4. If user says yes → route to the active phase's sub-skill
5. If user says no → ask what they'd like to do instead

### If PROGRESS.md DOES NOT EXIST:

Check if this looks like a quick task or a full pipeline:

**Quick mode detection:**
- User provides 1-5 markdown files directly (not a course folder)
- User says something like "just convert these notes" or "make this interactive"
- No complex course hierarchy

If quick mode detected:
```
This looks like a small set of files. Options:
1. Quick mode — Skip full analysis, use sensible defaults, go straight to web building
2. Full pipeline — Run all 4 phases for maximum quality and customization

Which do you prefer?
```

If quick mode chosen:
- Generate a minimal `course-spec.json` with defaults
- Skip to Phase 3 (notes-to-web)

If full pipeline (default):
- Start with Phase 1 (course-analyze)

---

## Phase Routing

Route to the appropriate sub-skill based on context:

| User Intent | Route To | Sub-Skill Path |
|------------|----------|---------------|
| "analyze course", "discover structure" | Phase 1 | `skills/course-analyze/SKILL.md` |
| "generate notes", "transform content" | Phase 2 | `skills/course-to-notes/SKILL.md` |
| "build website", "create web" | Phase 3 | `skills/notes-to-web/SKILL.md` |
| "audit", "evaluate", "check quality" | Phase 4 | `skills/learning-audit/SKILL.md` |
| "transform this course" (full pipeline) | Phase 1 → 2 → 3 → 4 | Sequential |

Each phase completes fully before moving to the next. The user can also invoke individual sub-skills independently.

---

## PROGRESS.md Management

The orchestrator maintains `.learning/PROGRESS.md` as the single source of truth for pipeline state.

### Creating PROGRESS.md (at pipeline start)

```markdown
# Learning-on-Web Progress

## Project: [Course Title]
## Started: [ISO-8601 timestamp]
## Last Updated: [ISO-8601 timestamp]

## Current Phase: course-analyze
## Current Target: Step 1 — Source materials discovery

## Phase Status
| Phase | Status | Progress | Task File |
|-------|--------|----------|-----------|
| course-analyze | 🔄 in-progress | Step 1/5 | .learning/tasks/course-analyze.task.md |
| course-to-notes | ⏳ pending | — | — |
| notes-to-web | ⏳ pending | — | — |
| learning-audit | ⏳ pending | — | — |

## Spec Version
- course-spec.json: not yet created
- Notes generated against: n/a

## Quick Stats
- Total parts: [count]
- Notes completed: 0/[count]
- Pages built: 0/[count]
- Pages audited: 0/[count]
```

### Updating PROGRESS.md (after each significant action)

- Update `Last Updated` timestamp
- Update `Current Phase` and `Current Target`
- Update phase status table
- Update quick stats
- If `course-spec.json` changes after Phase 2 started, add warning:
  ```
  ⚠️ WARNING: course-spec.json modified after notes generation began.
  Notes generated before [timestamp] may be inconsistent with current spec.
  ```

---

## The Build-Audit Loop

Phases 3 and 4 form an iterative quality loop:

```
┌─────────────────────────────────────────┐
│  notes-to-web: Build module chunk       │
│  (scaffold → convert pages → enhance)   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  learning-audit: Audit the chunk        │
│  (5 dimensions → report → fix)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
         Re-audit passed?
           │         │
          Yes        No → Fix and re-audit
           │
           ▼
     Next chunk → back to notes-to-web
```

The granularity of this loop (per-part, per-module, per-course) is set by the user during Phase 4 setup.

---

## Batch Mode

For Phase 2 (notes) and Phase 3 (web), the user chooses interaction density:

| Mode | Behavior |
|------|----------|
| **Verbose** | Ask questions per note/page. Most thorough. |
| **Module** | Ask questions per module, apply to all parts. Balanced. |
| **Auto** | Learn from first module's feedback, apply to rest. Only ask about exceptions. |

Ask the user which mode they prefer at the start of each phase. They can switch mid-session.

---

## Skill Discovery

Before Phase 3, search for installed skills that can enhance output:

1. **Check `.claude/skills/`** for:
   - `ui-ux-pro-max` — design system generation
   - `frontend-design` — bold aesthetic principles
   - Any other design/UI skills

2. **Check MCP availability:**
   - shadcn/ui MCP (REQUIRED for Phase 3)
   - Magic UI MCP (REQUIRED for Phase 3)
   - Playwright MCP (recommended for Phase 4)
   - Figma MCP (optional)

3. Report findings to user:
   ```
   Skill & tool discovery:
   ✅ shadcn/ui MCP — available
   ✅ Magic UI MCP — available
   ✅ ui-ux-pro-max skill — found, will use for design system
   ⚠️ Playwright MCP — not found (visual testing will be limited)
   ℹ️ Figma MCP — not found (not needed unless you have designs)
   ```

---

## Error Handling

- **Phase fails:** Don't move to next phase. Present error, ask user how to proceed.
- **Quality check fails:** Mark item as `❌ needs-retry` in task file. Retry or skip.
- **Spec changes mid-pipeline:** Warn user, offer to regenerate affected outputs.
- **Session interrupted:** PROGRESS.md + task files ensure perfect resumption.
- **MCP unavailable:** For Phase 3, STOP and guide installation. For Phase 4, degrade gracefully (code review instead of visual testing).

---

## Success Criteria

The pipeline is successful when:
1. A user with zero setup can point it at any course folder and get an interactive website
2. Every step involves human confirmation — no black-box generation
3. Generated notes read as if written by a human expert
4. Web presentation intelligently adapts to content type
5. The site is genuinely beautiful — passes the "screenshot test"
6. The audit loop catches and fixes quality issues
7. Progress persists across sessions — interruptions don't lose work
