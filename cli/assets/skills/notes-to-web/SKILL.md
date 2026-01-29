---
name: notes-to-web
description: "Transform markdown notes into an interactive, beautiful learning website. Uses intelligent presentation selection, design system generation, and MCP-powered components. Requires shadcn/ui MCP and Magic UI MCP. Trigger: build website, create web, notes to web, scaffold site, convert to interactive."
---

# Notes to Web — Interactive Web Building

## ⛔ CRITICAL: READ THIS FIRST

**BEFORE WRITING ANY PAGE CODE**, you MUST complete the Component Mapping Protocol.

```
❌ FORBIDDEN: Writing lesson page code without mapping files
❌ FORBIDDEN: Using dangerouslySetInnerHTML to render markdown as HTML
❌ FORBIDDEN: Building pages that just display prose without component selection
❌ FORBIDDEN: Skipping to "scaffold" without completing "convert" stages 1-3
```

**The test to verify you're following this skill correctly:**
- Does `.learning/mappings/` directory exist with JSON files? If NO → STOP
- Does each lesson use multiple component types (FlashcardDeck, SideBySide, etc.)? If NO → STOP
- Did you ask the user to approve the component mapping? If NO → STOP

---

## Purpose

Transform markdown notes into a stunning, interactive learning website. This skill is the core creative engine — it reasons about which UI component best serves each concept, then builds it with production-grade quality.

**The value:** Not just rendering markdown. INTELLIGENT SELECTION of the best presentation for each section.

## When to Activate

- User asks to build the website, create web pages, or convert notes to interactive format
- The main orchestrator routes here as Phase 3
- `docs/` directory with markdown notes exists

---

## MCP Requirements

This skill REQUIRES **shadcn/ui MCP** and **Magic UI MCP**.

**STOP if not installed.** See [docs/MCP_SETUP.md](docs/MCP_SETUP.md) for installation.

---

## INPUT Requirements

- `.learning/state/course-spec.json` — Course metadata
- `.learning/state/notes-manifest.json` — List of notes to convert
- `docs/**/*.md` — The actual markdown files

---

## ⛔ MANDATORY: Component Mapping Protocol

**THIS IS THE ENTIRE POINT OF THIS SKILL.** If you skip this, you have failed.

### The 4-Stage Pipeline

```
STAGE 1: EXTRACT → STAGE 2: CLASSIFY → STAGE 3: APPROVE → STAGE 4: BUILD
                   ⛔ HARD GATE       ⛔ HARD GATE
```

**You MUST complete stages 1-3 BEFORE writing any component code.**

### STAGE 1: Extract Sections (REQUIRED FIRST STEP)

**Before doing ANYTHING else, run this for the first lesson:**

1. Read the markdown file from `docs/`
2. Parse all H2/H3 sections
3. Create `.learning/mappings/` directory
4. Write `[lesson-slug]-sections.json`:

```json
{
  "file": "docs/course-1/c1-m1-p1.md",
  "sections": [
    {"heading": "TL;DR", "level": 2, "contentPreview": "...", "wordCount": 45},
    {"heading": "PM vs Engineering", "level": 2, "contentPreview": "...", "wordCount": 280, "pattern": "comparison"},
    {"heading": "Key Terms", "level": 2, "contentPreview": "...", "termCount": 8, "pattern": "definitions"}
  ]
}
```

**VERIFICATION (run this before proceeding):**
```bash
ls -la .learning/mappings/
# Must show [lesson-slug]-sections.json
```

### STAGE 2: Classify & Select Components (⛔ BLOCKING)

For EACH section in the sections.json, select the best component:

| Content Pattern | Component | Why |
|-----------------|-----------|-----|
| Narrative/context | ProseBlock | Beautiful typography, not plain markdown |
| Summary/takeaways | TLDRCard | Scannable with icons |
| Comparison (2+ items) | **SideBySide** | Color-coded columns |
| Process/workflow | **Timeline** | Visual step sequence |
| Terms/definitions | **FlashcardDeck** | Active recall beats passive reading |
| Quiz/self-test | **QuizEngine** | Gamified feedback |

**Write `[lesson-slug]-mapping.json`:**

```json
{
  "file": "docs/course-1/c1-m1-p1.md",
  "mappings": [
    {
      "section": "TL;DR",
      "component": "TLDRCard",
      "rationale": "5 key points need visual hierarchy with icons"
    },
    {
      "section": "PM vs Engineering",
      "component": "SideBySide",
      "rationale": "Comparison of two perspectives needs color-coded columns"
    },
    {
      "section": "Key Terms",
      "component": "FlashcardDeck",
      "rationale": "8 terms — active recall via flip animation beats passive reading"
    }
  ]
}
```

**VERIFICATION:**
```bash
ls -la .learning/mappings/
# Must show BOTH sections.json AND mapping.json
```

### STAGE 3: Present to User (⛔ BLOCKING)

**STOP and show the user this:**

```
📄 Component Mapping for "[Lesson Title]"

📌 TL;DR (45 words) → TLDRCard with icons
🔀 PM vs Engineering (280 words, comparison) → SideBySide with color-coded columns
📚 Key Terms (8 terms) → FlashcardDeck with physics-based flip

Approve this mapping? [yes / modify / skip]
```

**DO NOT PROCEED without user response.**

### STAGE 4: Build Components

**Only AFTER user approval**, build the page:

1. Query shadcn/ui MCP for component props
2. Query Magic UI MCP for animations
3. Build according to the approved mapping
4. Each section renders using its designated component (NOT raw markdown)

**Full component specs:** See [docs/COMPONENT_GUIDE.md](docs/COMPONENT_GUIDE.md)

---

## Sub-Commands

### `scaffold` — Initialize the Web Project

1. Read `.learning/state/course-spec.json`
2. Check MCP availability
3. Present aesthetic options to user
4. Generate design system
5. Scaffold Next.js project with shadcn/ui
6. Build base component library

**Design principles:** See [docs/DESIGN_GUIDE.md](docs/DESIGN_GUIDE.md)

### `convert` — Transform Notes (4-Stage Pipeline)

**THIS IS WHERE THE VALUE IS. DO NOT SKIP.**

For each lesson in notes-manifest.json:
1. **Stage 1:** Extract sections → write sections.json
2. **Stage 2:** Classify content → write mapping.json
3. **Stage 3:** Present mapping → get user approval
4. **Stage 4:** Build page using approved components

**You cannot batch these.** Each lesson must go through all 4 stages.

### `enhance` — Add Platform-Level Features

After convert is complete:
1. Landing page with hero section
2. Learning dashboard with progress
3. Dark mode support
4. Search functionality
5. Mobile navigation

---

## Pre-Delivery Checklist (MANDATORY)

**Before delivering ANY page, verify:**

```bash
# 1. Mapping files exist
ls .learning/mappings/*.json
# Should show sections.json AND mapping.json for each lesson

# 2. Check a built page imports multiple components
grep -r "FlashcardDeck\|SideBySide\|QuizEngine\|TLDRCard" learning-site/src/
# Should return matches - NOT just prose/markdown rendering
```

**If these checks fail, you have skipped the protocol. Go back to Stage 1.**

### Content Verification
- [ ] Content loads from actual markdown files (NOT hardcoded)
- [ ] Each lesson page uses different components based on content type
- [ ] Comparisons use SideBySide (NOT bullet points)
- [ ] Terms use FlashcardDeck (NOT tables)
- [ ] Quizzes use QuizEngine (NOT plain text)

### Visual Verification
- [ ] Page load has blur-fade entrance animation
- [ ] Flashcards have physics-based flip
- [ ] Quizzes have confetti/shake feedback

---

## What NOT To Do

**FORBIDDEN PATTERNS:**

```tsx
// ❌ NEVER DO THIS - raw markdown rendering
<div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />

// ❌ NEVER DO THIS - prose-only pages
<article className="prose">{content}</article>

// ❌ NEVER DO THIS - comparison as bullet points
<ul>
  <li>PM: focuses on business</li>
  <li>Engineer: focuses on tech</li>
</ul>
```

**REQUIRED PATTERNS:**

```tsx
// ✅ DO THIS - component-based rendering
<TLDRCard points={lesson.tldr} />
<SideBySide left={pmPerspective} right={engPerspective} />
<FlashcardDeck terms={lesson.terminology} />
<QuizEngine questions={lesson.selfTest} />
```

---

## Task File Maintenance

Maintain `.learning/tasks/notes-to-web.task.md` with:
- Current sub-command
- Design system choices
- Conversion progress per module
- Component mapping log

---

## Reference Documents

| Document | Purpose | When to Load |
|----------|---------|--------------|
| [docs/MCP_SETUP.md](docs/MCP_SETUP.md) | MCP installation | Before starting |
| [docs/MAPPING_GUIDE.md](docs/MAPPING_GUIDE.md) | Classification algorithm | During Stage 2 |
| [docs/COMPONENT_GUIDE.md](docs/COMPONENT_GUIDE.md) | Component specs | During Stage 4 |
| [docs/DESIGN_GUIDE.md](docs/DESIGN_GUIDE.md) | Design principles | During scaffold |

**Load on-demand** — not everything needs to be in context at once.
