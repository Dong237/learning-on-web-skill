---
name: learning-audit
description: "Audit the built learning website against expectations. Evaluate content fidelity, UX, design quality, learning effectiveness, and visual consistency. Fix issues iteratively. Trigger: audit learning site, evaluate website, check quality, review pages."
---

# Learning Audit — Evaluation & Improvement

## Purpose

After the website is built (fully or partially), audit the learning experience against expectations. Identify gaps between intended and actual UX. Fix issues and improve quality iteratively.

## When to Activate

- After Phase 3 produces output (per user-specified granularity)
- User asks to audit, evaluate, review, or check quality
- The main orchestrator routes here as Phase 4

## Prerequisites

- `web/` directory with built pages exists
- `.learning/course-spec.json` for reference expectations
- Playwright MCP recommended for visual testing

---

## Audit Granularity

Before starting, ask the user:

```
At what granularity should I run audits?

1. Per part   — Audit after each lesson page (most thorough)
2. Per module — Audit after all lessons in a module (balanced)
3. Per course — Audit after entire course is built (fastest)
4. Custom     — You tell me when to audit
```

Also ask:
- "What matters most?" (content accuracy / visual polish / interactivity / mobile experience)
- "Should I auto-fix issues or present each fix for approval?"

---

## 5 Audit Dimensions

### 1. Content Fidelity

Check that the interactive version preserves all knowledge:

- [ ] Every concept from the markdown note appears in the web page
- [ ] No oversimplification or distortion in interactive conversion
- [ ] Quiz questions test concepts actually covered in the note
- [ ] Flashcard decks include ALL terms from the terminology table
- [ ] Learning path navigation works (previous ↔ next)
- [ ] Mind maps reflect actual content structure

**Method:** Read the source markdown note and the generated MDX side-by-side. Flag any missing or altered content.

### 2. Presentation Quality

Check that interactive components serve their content:

- [ ] Each component type matches its content (comparison → SideBySide, not plain text)
- [ ] No missed opportunities for interactivity (comparisons as prose, processes as bullets)
- [ ] No over-engineering (interactive for the sake of interactive when text would be clearer)
- [ ] **Page cohesion:** Does the page feel like a unified learning unit? Do components flow together or feel like a random collection?
- [ ] Component density is appropriate (not too sparse, not too crowded)

**Method:** Review each section. For each, ask: "Is this the BEST format for this content?"

### 3. User Experience

Check the overall experience:

- [ ] Page loads in reasonable time (< 3s on 3G)
- [ ] Layout makes sense on desktop (1440px) AND mobile (375px)
- [ ] Reading flow is natural (eye moves logically through content)
- [ ] Interactive elements are discoverable (clear affordances, not hidden)
- [ ] Dark mode works correctly for ALL components (not just "not broken")
- [ ] Navigation is intuitive (breadcrumbs, sidebar, next/prev)
- [ ] Progress tracking updates correctly

**Method:** If Playwright MCP available, navigate each page and take screenshots at desktop/tablet/mobile breakpoints. Otherwise, review code for responsive patterns.

### 4. Learning Effectiveness

Check that the site actually teaches:

- [ ] A learner at the specified level (from course-spec.json) would understand this
- [ ] No knowledge gaps between lessons (concepts aren't referenced before being taught)
- [ ] Quiz difficulty matches the audience level
- [ ] Practice tasks are achievable and relevant
- [ ] Progress indicators motivate continued learning
- [ ] The overall flow builds knowledge cumulatively

**Method:** Read through pages in order as a learner would. Note where you'd be confused.

### 5. Visual & Design Quality

Check aesthetic quality against the design system:

- [ ] Font pairing is distinctive and consistent across all pages
- [ ] Color palette matches chosen aesthetic (DESIGN.md)
- [ ] No visual inconsistencies between pages
- [ ] Typography is readable (especially Chinese text: line-height 1.75, proper font)
- [ ] All Mermaid diagrams render correctly
- [ ] Interactive components have consistent styling
- [ ] Animations are smooth (no jank, no layout shift)
- [ ] **Screenshot test:** Would someone screenshot this page and share it?
- [ ] **NOT AI-slop:** No Inter font, no purple gradients, no generic card grids

**Method:** Compare each page against DESIGN.md specifications. Check for deviations.

---

## Audit Process

1. **Open each page** (Playwright MCP for screenshots, or code review)
2. **Take screenshots** at key breakpoints if Playwright available:
   - Desktop (1440px)
   - Tablet (768px)
   - Mobile (375px)
   - Dark mode variants
   Ask user about screenshot granularity if it would be too much work.
3. **Run through all 5 audit dimensions** per page
4. **Generate audit report** (format below)
5. **Present report to user** with options:
   - "Fix all issues automatically?"
   - "Fix only critical/major issues?"
   - "Present each fix for approval?"
6. **Apply fixes** based on user's choice
7. **Re-audit** fixed pages to verify

---

## Audit Report Format

```markdown
# Learning Audit Report
## Scope: [Module 1 / Course 1 / etc.]
## Date: [date]
## Pages Audited: [count]

### Critical Issues (must fix)
- [ ] [Page: 01-intro] Quiz question 3 tests concept not covered in this note
- [ ] [Page: 02-skills] Flashcard deck missing 4 terms from terminology table
- [ ] [Page: 03-methods] Page crashes on mobile (component overflow)

### Major Issues (should fix)
- [ ] [Page: 01-intro] Framework comparison is plain text — should be SideBySide
- [ ] [Page: 03-methods] Mobile layout breaks at 375px — accordion overlaps sidebar
- [ ] [Page: 02-skills] Dark mode contrast too low on ConceptCard borders

### Minor Issues (nice to fix)
- [ ] [Page: 01-intro] TLDRCard could use more specific icons
- [ ] [Page: 04-process] Entrance animation timing slightly off (too fast)

### Opportunities (could improve)
- [ ] [Page: 01-intro] "PM daily schedule" section → TimeAllocation component
- [ ] [Page: 03-methods] Decision tree in prose → InteractiveDecisionTree
- [ ] [Page: 02-skills] Add streak counter to encourage daily returns

### Design Quality Score
| Dimension | Score | Notes |
|-----------|-------|-------|
| Content Fidelity | 9/10 | Minor term missing |
| Presentation Quality | 7/10 | 3 missed interactivity opportunities |
| User Experience | 8/10 | Mobile needs work |
| Learning Effectiveness | 9/10 | Strong progression |
| Visual Quality | 8/10 | Dark mode needs polish |

### Summary
- Critical: [count], Major: [count], Minor: [count], Opportunities: [count]
- Recommended action: Fix critical + major, present opportunities for user decision
```

---

## Human-in-the-Loop During Audit

1. **Present findings incrementally** — don't dump everything at once
2. **Show before/after for proposed fixes** — especially for component swaps
3. **Ask about ambiguous cases:**
   - "This comparison is currently plain text. Convert to SideBySide, or is the current format fine?"
   - "This page has 8 interactive components. Is that too many? Should some be simplified to text?"
4. **After fixing, summarize:**
   - What was fixed
   - What remains
   - "Any areas you want me to look at more closely?"

---

## Task File Maintenance

Maintain `.learning/tasks/learning-audit.task.md`:

```markdown
# learning-audit Task State

## Status: in-progress
## Granularity: per-module
## Fix Mode: auto for critical/major, ask for opportunities
## Last Updated: [timestamp]

## Audits Completed
### Module 1 Audit (2026-01-28)
- Pages audited: 5
- Critical: 2 (fixed), Major: 3 (fixed), Minor: 2 (fixed), Opportunities: 2 (1 accepted)
- Re-audit: passed

### Module 2 Audit
- ⏳ pending (waiting for notes-to-web to complete Module 2)

## Cumulative Stats
- Total pages audited: 5
- Total issues found: 9
- Total issues fixed: 8
- Remaining: 1 (user declined opportunity)
```

---

## The Audit Loop

Phases 3 and 4 form an iterative loop:

```
notes-to-web (build module) → learning-audit (audit module) → fix → next module
```

After audit completes for a chunk:
1. Apply fixes
2. Re-audit to verify
3. Update PROGRESS.md
4. Signal notes-to-web to continue with next chunk

This ensures quality compounds rather than issues accumulating.

---

## Resumption

If `.learning/tasks/learning-audit.task.md` exists:
1. Read it to find audit history and current scope
2. Present: "Audited Module 1 (5 pages, all issues fixed). Module 2 is ready for audit."
3. Ask: "Continue auditing?"
4. Resume with next unaudited module/page
