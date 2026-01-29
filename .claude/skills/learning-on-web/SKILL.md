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

## State-Driven Routing (Core Architecture)

**BEFORE ANYTHING ELSE**, check the current state by examining `.learning/state/` directory.

### Step 1: Check Current State

```bash
# Check what state files exist
ls -la .learning/state/ 2>/dev/null || echo "No state directory yet"
```

The orchestrator uses **explicit state files** to determine which phase to run next:

| State File | Meaning | Next Action |
|------------|---------|-------------|
| None exist | Fresh start | Ask: Quick Mode or Full Pipeline? |
| `course-spec.json` exists | Phase 1 complete | Route to Phase 2 |
| `notes-manifest.json` exists | Phase 2 complete | Route to Phase 3-4 Loop |
| `build-manifest.json` exists | Phase 3 in progress | Check audit status → Route accordingly |
| All complete + all audits passed | Pipeline done | Celebrate ✅ |

### Step 2: Route Based on State

#### Case 1: No State Files (Fresh Start)

Detect if this is Quick Mode or Full Pipeline:

**Quick Mode indicators:**
- User provides pre-written markdown files in `docs/` directory
- User says "convert these notes", "make this interactive", "quick mode"
- 1-10 markdown files, no complex course folder structure

Ask user:
```
Found [N] markdown files in docs/. How would you like to proceed?

1. 🚀 Quick Mode — Skip analysis & note generation, go straight to building website
   - Uses sensible defaults
   - Still runs full audit (Phase 4)
   - Faster but less customized

2. 📚 Full Pipeline — Run all 4 phases for maximum quality
   - Interactive discovery (Phase 1)
   - Value-added note generation (Phase 2)
   - Intelligent web building (Phase 3)
   - Comprehensive audit (Phase 4)

Which do you prefer?
```

**If Quick Mode chosen:**
1. **Ask: "What language should the notes and website use?"**
   - English
   - 中文 (Chinese)
   - Bilingual (English + Chinese)
   - Auto-detect from note content

2. Generate minimal `course-spec.json`:
   ```bash
   mkdir -p .learning/state
   cat > .learning/state/course-spec.json <<EOF
   {
     "version": "1.0",
     "mode": "quick",
     "contentLanguage": "[user selection]",
     "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
     "audience": "general",
     "perspective": "learner",
     "tone": "professional",
     "emphasis": "balanced"
   }
   EOF
   ```

3. Create `notes-manifest.json` from existing docs:
   ```bash
   # Scan docs/ to find all markdown files
   # Generate manifest with modules detected from file structure
   # Mark all as validated=true (assume user's notes are ready)
   ```

4. Route to Phase 3 (notes-to-web)

**If Full Pipeline chosen:**
1. **Ask: "What language should the notes and website use?"** (same options as Quick Mode)
2. Route to Phase 1 (course-analyze) with language preference

#### Case 2: `course-spec.json` exists, `notes-manifest.json` missing

Phase 1 is complete. Route to Phase 2 (course-to-notes).

#### Case 3: `notes-manifest.json` exists

Phase 2 is complete. Enter the Build-Audit Loop (Phase 3-4).

**Read build-manifest.json to find progress:**
```bash
if [ -f .learning/state/build-manifest.json ]; then
  # Find last completed chunk
  LAST_CHUNK=$(jq -r '.lastCompletedChunk' .learning/state/build-manifest.json)
else
  LAST_CHUNK="none"
fi
```

**Check audit status:**
```bash
# For the next chunk to build/audit
NEXT_CHUNK="[determined from notes-manifest.json and build-manifest.json]"

if [ -f .learning/audits/${NEXT_CHUNK}.json ]; then
  AUDIT_STATUS=$(jq -r '.status' .learning/audits/${NEXT_CHUNK}.json)

  if [ "$AUDIT_STATUS" = "PASSED" ]; then
    echo "✅ $NEXT_CHUNK audit passed. Moving to next chunk."
    # Route to Phase 3 for next chunk
  elif [ "$AUDIT_STATUS" = "FAILED" ]; then
    echo "❌ $NEXT_CHUNK audit failed. Need to fix and re-audit."
    # Route to Phase 4 to fix issues
  fi
else
  echo "⏳ $NEXT_CHUNK built but not audited yet."
  # Route to Phase 4 to audit this chunk
fi
```

#### Case 4: All Chunks Built and Audited

```bash
# Check if all chunks in notes-manifest.json have passed audits
ALL_PASSED=true
for chunk in $(jq -r '.chunks[]' notes-manifest.json); do
  if [ ! -f .learning/audits/${chunk}.json ] || \
     [ "$(jq -r '.status' .learning/audits/${chunk}.json)" != "PASSED" ]; then
    ALL_PASSED=false
    break
  fi
done

if [ "$ALL_PASSED" = true ]; then
  echo "🎉 All phases complete! Website is ready."
  # Update PROGRESS.md to mark as COMPLETED
  exit 0
fi
```

### Step 3: Resumption Logic

If user returns to an in-progress project:

1. Read PROGRESS.md (user-facing summary)
2. Read state files to determine actual status
3. Present combined view:
   ```
   Welcome back to your learning website project!

   Progress:
   ✅ Phase 1 (Analyze): course-spec.json created
   ✅ Phase 2 (Notes): 18 notes generated
   🔄 Phase 3-4 Loop: 3/5 modules complete
      ✅ Module 1: 4 pages built + audited (all passed)
      ✅ Module 2: 3 pages built + audited (all passed)
      ✅ Module 3: 2 pages built + audited (all passed)
      ⏳ Module 4: Not started yet
      ⏳ Module 5: Not started yet

   Continue building Module 4?
   ```

4. Route to appropriate phase based on state

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

### ⛔ CRITICAL: How to Route

**"Route to" means READ the sub-skill file and FOLLOW its instructions EXACTLY.**

When entering Phase 3 (notes-to-web):
1. **READ** `skills/notes-to-web/SKILL.md` FIRST
2. **FOLLOW** its Component Mapping Protocol — stages 1-4
3. **DO NOT** skip to building pages without creating mapping files
4. **VERIFY** `.learning/mappings/` directory exists before writing page code

```
⛔ FORBIDDEN: Building lesson pages without mapping files
⛔ FORBIDDEN: Using dangerouslySetInnerHTML to render markdown
⛔ FORBIDDEN: Rendering markdown as prose without component selection
```

Each phase completes fully before moving to the next. The user can also invoke individual sub-skills independently.

---

## PROGRESS.md Management (User-Facing Summary Only)

**Important:** PROGRESS.md is now a **user-facing summary file**, NOT the routing authority.

**Routing decisions** are made by checking `.learning/state/*.json` files (see State-Driven Routing above).

**PROGRESS.md purpose:**
- Human-readable project overview
- Session history and timestamps
- Quick visual status
- Warnings and notes

### Creating PROGRESS.md (at pipeline start)

```bash
mkdir -p .learning
cat > .learning/PROGRESS.md <<EOF
# Learning-on-Web Progress

## Project: [Course Title from course-spec.json or detected]
## Mode: [Quick Mode ⚡ or Full Pipeline 📚]
## Started: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
## Last Updated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Current Phase: [current phase name]
## Current Target: [current step]

## Phase Status
| Phase | Status | Progress | State File |
|-------|--------|----------|------------|
| course-analyze | [status] | [progress] | .learning/state/course-spec.json |
| course-to-notes | [status] | [progress] | .learning/state/notes-manifest.json |
| notes-to-web | [status] | [progress] | .learning/state/build-manifest.json |
| learning-audit | [status] | [progress] | .learning/state/audit-state.json |

## Spec Version
- course-spec.json: [version or "not yet created"]
- Content language: [language setting]
- Notes generated against: [spec version]

## Quick Stats
- Total modules: [count]
- Total parts: [count]
- Notes completed: [count]/[total]
- Pages built: [count]/[total]
- Pages audited: [count]/[total]
- Audits passed: [count]/[total]
EOF
```

### Updating PROGRESS.md (after each phase completes)

**After Phase 1:**
```bash
# Update PROGRESS.md to show course-analyze completed
sed -i '' 's/course-analyze | .*/course-analyze | ✅ completed | Phase done | course-spec.json/' .learning/PROGRESS.md
```

**After Phase 2:**
```bash
# Update with actual counts from notes-manifest.json
TOTAL_NOTES=$(jq '.modules[].parts | length' .learning/state/notes-manifest.json | awk '{s+=$1} END {print s}')
```

**After each Phase 3-4 iteration:**
```bash
# Update build and audit counts
BUILT=$(jq '.chunksCompleted' .learning/state/build-manifest.json)
AUDITED=$(find .learning/audits -name '*.json' -exec jq -r 'select(.status=="PASSED")' {} \; | wc -l)
```

**Warnings to add:**
- If `course-spec.json` modified after Phase 2 started
- If MCP tools become unavailable mid-pipeline
- If re-audit fails 3+ times (escalate to user)

---

## Phase Handoff Protocol

Each sub-skill follows this explicit contract for state management:

### INPUT (What the Phase Reads)

Each phase SKILL.md declares required state files at the top:

```markdown
## INPUT Requirements
- `.learning/state/course-spec.json` (from Phase 1)
- `.learning/state/notes-manifest.json` (from Phase 2)

**Verify before proceeding:**
```bash
for file in course-spec.json notes-manifest.json; do
  if [ ! -f .learning/state/$file ]; then
    echo "❌ Missing required file: $file"
    exit 1
  fi
done
```
```

### PROCESS (What the Phase Does)

Phase uses available tools (Bash, Read, Write, Edit) to perform its work.

Phases do NOT directly invoke other phases.
Phases do NOT use `context: fork` or subagents.
Phases instruct Claude step-by-step (like ui-ux-pro-max skill pattern).

### OUTPUT (What the Phase Writes)

Each phase writes explicit state files to `.learning/state/` or `.learning/audits/`:

**Phase 1 outputs:**
- `.learning/state/course-spec.json`

**Phase 2 outputs:**
- `.learning/state/notes-manifest.json`
- `docs/` directory with all notes

**Phase 3 outputs:**
- `.learning/state/build-manifest.json` (updated after each chunk)
- Website files in `[site-directory]/`

**Phase 4 outputs:**
- `.learning/audits/[chunk-id].json` (per chunk audited)
- `.learning/state/audit-state.json` (overall progress)

### RETURN (Control Back to Orchestrator)

After phase completes its work, it exits and returns control to this main orchestrator.

The orchestrator then:
1. Re-checks state (Step 1)
2. Routes to next phase (Step 2)
3. Repeats

**No phase calls another phase directly.** The orchestrator is the only routing authority.

---

## The Build-Audit Loop (Phase 3-4 Iteration)

Phases 3 and 4 form an iterative quality loop controlled by the orchestrator:

```
┌─────────────────────────────────────────────────┐
│ ORCHESTRATOR: Read notes-manifest.json          │
│ Determine next chunk to build                   │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│ Phase 3 (notes-to-web): Build this chunk        │
│ - Convert markdown to interactive components    │
│ - Query shadcn/ui & Magic UI MCPs               │
│ - Write to build-manifest.json                  │
└───────────────────┬─────────────────────────────┘
                    │ (returns to orchestrator)
                    ▼
┌─────────────────────────────────────────────────┐
│ ORCHESTRATOR: Check if audit exists for chunk   │
│ - If no: Route to Phase 4                       │
│ - If yes with FAILED: Route to Phase 4          │
│ - If yes with PASSED: Route to Phase 3 (next)   │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│ Phase 4 (learning-audit): Audit this chunk      │
│ - 5-dimensional quality check                   │
│ - Write to audits/[chunk-id].json               │
│ - If issues found: Fix and re-audit             │
│ - Update status to PASSED or FAILED             │
└───────────────────┬─────────────────────────────┘
                    │ (returns to orchestrator)
                    ▼
┌─────────────────────────────────────────────────┐
│ ORCHESTRATOR: Re-check audit status             │
│ - If PASSED: Move to next chunk (back to Phase 3│
│ - If FAILED: Loop back to Phase 4               │
│ - If all chunks PASSED: Mark COMPLETED ✅        │
└─────────────────────────────────────────────────┘
```

**Granularity Setting** (per-part, per-module, per-course):
- User chooses during first Phase 3 invocation
- Stored in `build-manifest.json` as `granularity` field
- Determines chunk size:
  - `per-part`: Each part is a chunk (most iterations, highest quality)
  - `per-module`: Each module is a chunk (balanced)
  - `per-course`: Entire site is one chunk (fewest iterations, fastest)

**Critical:** Phase 4 ALWAYS runs, even in Quick Mode. The audit step is non-negotiable for quality.

---

## ⛔ Phase 3 Execution Protocol (MANDATORY)

**When you route to Phase 3, you MUST follow these steps IN ORDER. This is the core value of the entire skill.**

### Step 1: For EACH lesson, Extract Sections First

Before writing ANY page code, analyze the markdown:

```bash
# Create mappings directory
mkdir -p .learning/mappings
```

Read the markdown file, identify all H2/H3 sections, and write `[lesson-id]-sections.json`:

```json
{
  "file": "docs/course-1/c1-m1-p1.md",
  "sections": [
    {"heading": "TL;DR", "level": 2, "wordCount": 45},
    {"heading": "PM vs Engineering", "level": 2, "wordCount": 280, "pattern": "comparison"},
    {"heading": "Key Terms", "level": 2, "termCount": 8, "pattern": "definitions"}
  ]
}
```

### Step 2: Classify Each Section → Select Component

For each section, decide the best component:

| Pattern | Component | Why |
|---------|-----------|-----|
| Summary/takeaways | TLDRCard | Scannable with icons |
| Comparison (2+ items) | **SideBySide** | Color-coded columns for pattern recognition |
| Process/workflow | **Timeline** | Visual step sequence |
| Terms/definitions | **FlashcardDeck** | Active recall via flip animation |
| Quiz/self-test | **QuizEngine** | Gamified feedback |
| Narrative/context | ProseBlock | Beautiful typography (NOT raw markdown) |

Write `[lesson-id]-mapping.json`:

```json
{
  "mappings": [
    {"section": "TL;DR", "component": "TLDRCard", "rationale": "5 key points need icons"},
    {"section": "PM vs Engineering", "component": "SideBySide", "rationale": "Two perspectives need color-coded columns"},
    {"section": "Key Terms", "component": "FlashcardDeck", "rationale": "8 terms need active recall"}
  ]
}
```

### Step 3: Ask User to Approve Mapping

**STOP and show the user:**

```
📄 Component Mapping for "[Lesson Title]"

📌 TL;DR (45 words) → TLDRCard
🔀 PM vs Engineering (comparison) → SideBySide
📚 Key Terms (8 terms) → FlashcardDeck

Approve this mapping? [yes / modify]
```

**DO NOT proceed without user response.**

### Step 4: Build Using Approved Components

Only AFTER approval, build the page where:
- Each section renders using its designated component
- NO raw markdown rendering with `dangerouslySetInnerHTML`
- NO `<article className="prose">{content}</article>`

### Verification (MUST PASS before moving on)

```bash
# These files MUST exist:
ls .learning/mappings/*.json

# Page MUST import multiple component types:
grep -r "FlashcardDeck\|SideBySide\|QuizEngine\|TLDRCard" learning-site/src/
```

**If verification fails, you skipped the protocol. Go back to Step 1.**

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

### Phase Execution Failures

If a phase fails (exits with error, incomplete state file):

1. **DO NOT advance** to next phase
2. Present error to user with context
3. Ask: "Retry, skip this phase, or abort?"
   - Retry: Re-run same phase from last good state
   - Skip: Mark phase as `⏭️ skipped` in PROGRESS.md, continue to next
   - Abort: Preserve state files, exit gracefully

### Quality Check Failures

If Phase 2 note validation fails or Phase 4 audit fails:

1. Show specific failure details (which checks failed, which files)
2. Ask: "Let me fix and retry, or continue anyway?"
3. If fixing:
   - Apply fixes
   - Re-validate/re-audit
   - Only proceed when checks pass
4. If continuing anyway:
   - Add warning to PROGRESS.md
   - Mark affected items with `⚠️ quality-warning`

### State File Corruption

If state file is malformed or unreadable:

1. Present error: `"State file [filename] is corrupted"`
2. Show last known good content (from git or backup if available)
3. Ask: "Manually fix, regenerate from scratch, or restore from backup?"

### Spec Changes Mid-Pipeline

If `course-spec.json` is modified after Phase 2 has started:

1. Detect change by comparing file timestamp vs. notes-manifest.json timestamp
2. Warn user with affected items list
3. Offer to regenerate affected notes or continue with mixed specs
4. Update PROGRESS.md with warning

### Session Interruption

State files ensure perfect resumption:

1. User can exit anytime (Ctrl+C, close terminal, etc.)
2. On next invocation, orchestrator reads state files
3. Presents exact resumption point
4. No work lost

### MCP Tool Unavailability

**During Phase 3 (CRITICAL - STOP):**
- shadcn/ui MCP required → Guide installation, exit
- Magic UI MCP required → Guide installation, exit

**During Phase 4 (DEGRADE GRACEFULLY):**
- Playwright MCP missing → Skip visual tests, warn user, continue with code review only

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
