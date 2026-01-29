---
name: learning-audit
description: "Audit the built learning website against expectations. Evaluate content fidelity, UX, design quality, learning effectiveness, and visual consistency. Fix issues iteratively. Trigger: audit learning site, evaluate website, check quality, review pages."
---

# Learning Audit — Evaluation & Improvement (Phase 4)

## Purpose

After the website is built (fully or partially), audit the learning experience against expectations. Identify gaps between intended and actual UX. Fix issues and improve quality iteratively through automated checks and human verification.

## When to Activate

- After Phase 3 produces output (per user-specified granularity)
- User asks to audit, evaluate, review, or check quality
- The main orchestrator routes here as Phase 4

---

## INPUT Requirements (State Files from Phase 3)

**CRITICAL: Verify all required state files exist before proceeding.**

```bash
# Check for required state files
for file in course-spec.json notes-manifest.json build-manifest.json; do
  if [ ! -f .learning/state/$file ]; then
    echo "❌ ERROR: Missing required file .learning/state/$file"
    echo "Phase 4 requires Phase 3 to run first and produce build-manifest.json"
    exit 1
  fi
done

# Read granularity and chunk status
GRANULARITY=$(jq -r '.granularity // "per-part"' .learning/state/build-manifest.json)
SITE_DIR=$(jq -r '.siteDirectory' .learning/state/build-manifest.json)
CHUNKS_TOTAL=$(jq '.chunks | length' .learning/state/build-manifest.json)

# Find first chunk needing audit
CURRENT_CHUNK=$(jq -r '.chunks[] | select(.status == "built" and (.audited // false) == false) | .id' .learning/state/build-manifest.json | head -n 1)

if [ -z "$CURRENT_CHUNK" ]; then
  echo "✅ All chunks have been audited."
  exit 0
fi

echo "📋 Audit Scope:"
echo "  Granularity: $GRANULARITY"
echo "  Site Directory: $SITE_DIR"
echo "  Chunks Total: $CHUNKS_TOTAL"
echo "  Current Chunk to Audit: $CURRENT_CHUNK"
```

**Input Files Needed:**
- `.learning/state/course-spec.json` — Audience, goals, language, aesthetic preferences
- `.learning/state/notes-manifest.json` — Original markdown file paths for comparison
- `.learning/state/build-manifest.json` — Which chunks are built, which need audit
- `$SITE_DIR/design-system/DESIGN.md` — Design specifications (if exists)
- `$SITE_DIR/components-used.json` — Component choices made by Phase 3
- Original markdown notes (from notes-manifest.json paths) — For content fidelity check

**Playwright MCP** — Recommended for visual testing at 3 viewport sizes

---

## Audit Configuration (Read from State)

**Granularity** is inherited from build-manifest.json (set by Phase 3 or user preference):
- `per-part` — Audit after each lesson page (most thorough, default)
- `per-module` — Audit after all lessons in a module (balanced)
- `per-course` — Audit after entire course is built (fastest)

**Fix Mode** (ask user on first audit only, then persist in audit-state.json):

```
How should I handle issues found during audit?

1. Auto-fix all (fastest, least control)
2. Auto-fix Critical/Major, ask for Minor/Opportunities (RECOMMENDED)
3. Ask for approval on every fix (slowest, most control)
```

Store user's choice:
```bash
# Create or update audit-state.json
cat > .learning/state/audit-state.json <<EOF
{
  "version": "1.0",
  "fixMode": "auto-critical-major",
  "priorities": ["content accuracy", "mobile experience", "interactivity"],
  "lastAuditedChunk": null,
  "totalIssuesFound": 0,
  "totalIssuesFixed": 0
}
EOF
```

---

## Automated Audit Execution

### Step 1: Identify Files to Audit

```bash
# Get chunk details from build-manifest.json
CHUNK_ID="$CURRENT_CHUNK"
CHUNK_DATA=$(jq --arg id "$CHUNK_ID" '.chunks[] | select(.id == $id)' .learning/state/build-manifest.json)

# Extract file paths
BUILT_FILES=$(echo "$CHUNK_DATA" | jq -r '.files[]')
SOURCE_NOTES=$(echo "$CHUNK_DATA" | jq -r '.sourceNotes[]')

echo "📄 Files to audit:"
echo "$BUILT_FILES"
echo ""
echo "📝 Original notes for comparison:"
echo "$SOURCE_NOTES"
```

### Step 2: Run 5-Dimensional Audit

For each file in the chunk, run all 5 audit dimensions and collect findings.

---

## 5 Audit Dimensions (Detailed Implementation)

### Dimension 1: Content Fidelity (Automated)

**Goal:** Ensure interactive version preserves all knowledge from original notes.

**Automated Checks:**

```bash
# For each built page and its source note
for i in $(seq 0 $(($(echo "$BUILT_FILES" | wc -l) - 1))); do
  BUILT_FILE=$(echo "$BUILT_FILES" | sed -n "$((i+1))p")
  SOURCE_NOTE=$(echo "$SOURCE_NOTES" | sed -n "$((i+1))p")

  echo "Checking: $BUILT_FILE vs $SOURCE_NOTE"

  # 1. Extract all headings from source markdown
  SOURCE_HEADINGS=$(grep -E '^#{1,6} ' "$SOURCE_NOTE" | sed 's/^#* //')

  # 2. Extract all text content from built file (MDX/TSX)
  # This is a simplified check - actual implementation would parse React components
  BUILT_TEXT=$(cat "$BUILT_FILE")

  # 3. Check for missing concepts
  while IFS= read -r heading; do
    if ! echo "$BUILT_TEXT" | grep -q "$heading"; then
      echo "⚠️  CRITICAL: Heading '$heading' from source not found in built page"
      # Record in issues array
    fi
  done <<< "$SOURCE_HEADINGS"

  # 4. Check terminology table completeness
  TERMS_IN_SOURCE=$(grep -A 100 "^## Terminology" "$SOURCE_NOTE" | grep "^|" | grep -v "^| Term " | wc -l)
  # Check if FlashcardDeck or TerminologyDeck component has same number of terms

  # 5. Check quiz questions reference covered concepts
  # Extract quiz questions, verify each tests a concept from the note
done
```

**Checklist:**
- [ ] Every heading from markdown appears in built page
- [ ] Every term from terminology table → flashcard/terminology component
- [ ] No oversimplification or distortion in interactive conversion
- [ ] Quiz questions test concepts actually covered in the note
- [ ] Learning path navigation works (previous ↔ next links)
- [ ] Mind maps reflect actual content structure (compare mermaid diagrams)

**Output:** List of missing concepts, terms, or distorted content.

### Dimension 2: Presentation Quality (Human-in-Loop + Component Analysis)

**Goal:** Verify interactive components appropriately match content types.

**Automated Component Analysis:**

```bash
# Read components-used.json from Phase 3
COMPONENTS_FILE="$SITE_DIR/components-used.json"

if [ -f "$COMPONENTS_FILE" ]; then
  # Extract component choices for this chunk
  CHUNK_COMPONENTS=$(jq --arg chunk "$CHUNK_ID" '.[] | select(.chunk == $chunk)' "$COMPONENTS_FILE")

  echo "📦 Components used in this chunk:"
  echo "$CHUNK_COMPONENTS" | jq -r '.components[] | "  - \(.section): \(.component) (\(.rationale))"'
else
  echo "⚠️  No components-used.json found - skipping automated component verification"
fi
```

**Human Verification (Present to User):**

For each section with a component choice, show:
```
Section: "PM vs Engineer Mindset" (comparison content)
  ✅ Component: SideBySide
  Rationale: 2-column comparison of attributes
  Alternative considered: ComparisonTable

Does this look appropriate, or should we use a different component?
```

**Checklist:**
- [ ] Each component type matches its content (comparison → SideBySide, not plain text)
- [ ] No missed opportunities for interactivity (plain prose where component would help)
- [ ] No over-engineering (interactive for sake of it when text clearer)
- [ ] **Page cohesion:** Components flow together as unified learning unit
- [ ] Component density appropriate (not too sparse, not too crowded)
- [ ] Animations serve learning (highlight flow, not distract)

**Detect Missed Opportunities (Automated Scan):**

```bash
# Scan source markdown for patterns that should be components
for SOURCE_NOTE in $SOURCE_NOTES; do
  # Check for comparison patterns (vs, compared to, difference between)
  if grep -iE '(vs\.|versus|compared to|difference between)' "$SOURCE_NOTE" > /dev/null; then
    # Check if built file uses SideBySide, ComparisonTable, or TabbedComparison
    if ! grep -E '(SideBySide|ComparisonTable|TabbedComparison)' "$BUILT_FILE" > /dev/null; then
      echo "⚠️  OPPORTUNITY: Comparison content found but no comparison component used"
    fi
  fi

  # Check for process/timeline patterns (step 1, first...then, workflow)
  if grep -iE '(step [0-9]|first.*then|workflow|process:)' "$SOURCE_NOTE" > /dev/null; then
    if ! grep -E '(Timeline|Stepper|AnimatedFlow)' "$BUILT_FILE" > /dev/null; then
      echo "⚠️  OPPORTUNITY: Process content found but no timeline component used"
    fi
  fi

  # Check for definition patterns (terminology table exists)
  if grep "^## Terminology" "$SOURCE_NOTE" > /dev/null; then
    if ! grep -E '(FlashcardDeck|TerminologyDeck|AccordionGlossary)' "$BUILT_FILE" > /dev/null; then
      echo "⚠️  OPPORTUNITY: Terminology table but no interactive definition component"
    fi
  fi
done
```

**Output:** List of component choices to verify, missed opportunities for interactivity.

### Dimension 3: User Experience (Automated + Playwright MCP)

**Goal:** Ensure excellent experience across all devices and modes.

**Playwright MCP Integration (If Available):**

```bash
# Check if Playwright MCP is available
if claude mcp list | grep -q "playwright"; then
  echo "✅ Playwright MCP available - running visual tests"
  PLAYWRIGHT_AVAILABLE=true
else
  echo "⚠️  Playwright MCP not available - skipping visual tests"
  echo "Install with: npm install @playwright/test"
  PLAYWRIGHT_AVAILABLE=false
fi
```

**Visual Testing (If Playwright Available):**

For each built page in the chunk:
1. Start dev server (if not running): `cd $SITE_DIR && npm run dev &`
2. Navigate to page URL
3. Take screenshots at 3 viewport sizes:
   - Desktop: 1440x900
   - Tablet: 768x1024
   - Mobile: 375x667
4. Toggle dark mode, take another set of screenshots
5. Test interactive elements (click buttons, expand accordions, navigate timeline)

```markdown
Use Playwright MCP to:
- Navigate to http://localhost:3000/modules/module-1
- Set viewport to 1440x900
- Take screenshot: .learning/audits/screenshots/{chunk-id}-desktop-light.png
- Click dark mode toggle
- Take screenshot: .learning/audits/screenshots/{chunk-id}-desktop-dark.png
- Repeat for tablet (768x1024) and mobile (375x667)
```

**Present Screenshots to User:**

```
📸 Desktop (1440px) - Light Mode
[Show screenshot]

📸 Mobile (375px) - Dark Mode
[Show screenshot]

Visual issues detected:
- Sidebar overlaps content at 768px breakpoint
- Dark mode contrast too low on ConceptCard borders

Approve these findings?
```

**Automated Code Checks (If Playwright Not Available):**

```bash
for BUILT_FILE in $BUILT_FILES; do
  # Check for responsive classes (Tailwind)
  if ! grep -E '(sm:|md:|lg:|xl:)' "$BUILT_FILE" > /dev/null; then
    echo "⚠️  MAJOR: No responsive classes found in $BUILT_FILE"
  fi

  # Check for dark mode classes
  if ! grep -E '(dark:)' "$BUILT_FILE" > /dev/null; then
    echo "⚠️  MAJOR: No dark mode styling in $BUILT_FILE"
  fi

  # Check for accessibility attributes
  if ! grep -E '(aria-|role=)' "$BUILT_FILE" > /dev/null; then
    echo "⚠️  MINOR: No ARIA attributes in $BUILT_FILE"
  fi
done
```

**Checklist:**
- [ ] Desktop layout (1440px): Proper spacing, readable, no overflow
- [ ] Tablet layout (768px): Responsive breakpoints work, no overlap
- [ ] Mobile layout (375px): Stack order correct, touch targets ≥44px
- [ ] Dark mode: All components readable, contrast ratios pass WCAG AA
- [ ] Page load time < 3s (test with network throttling if Playwright available)
- [ ] Reading flow natural (eye moves logically through content)
- [ ] Interactive elements discoverable (clear affordances, not hidden)
- [ ] Navigation intuitive (breadcrumbs, sidebar, next/prev)

**Output:** Screenshots at 3 viewport sizes × 2 modes (6 total per page), list of responsive/dark mode issues.

### Dimension 4: Learning Effectiveness (Human-in-Loop)

**Goal:** Verify the site actually teaches effectively.

**Context from course-spec.json:**

```bash
# Read audience and learning goals
AUDIENCE=$(jq -r '.audience' .learning/state/course-spec.json)
GOALS=$(jq -r '.goals[]' .learning/state/course-spec.json)
PERSPECTIVE=$(jq -r '.perspective // "general"' .learning/state/course-spec.json)

echo "🎯 Target Audience: $AUDIENCE"
echo "📚 Learning Goals: $GOALS"
echo "👁️ Perspective: $PERSPECTIVE"
```

**Human Review Process:**

Read through the pages in order as if you were the target learner (e.g., "LLM Engineer transitioning to PM"). Ask:

1. **Prerequisite Knowledge:**
   - Does this assume knowledge I wouldn't have?
   - Are concepts referenced before being explained?

2. **Comprehension Flow:**
   - Can I follow the logic from section to section?
   - Are examples before abstractions?
   - Do interactive components help understanding or distract?

3. **Assessment Alignment:**
   - Do quiz questions test what was actually taught?
   - Are practice tasks achievable with the knowledge provided?
   - Is quiz difficulty appropriate for target audience?

4. **Cumulative Learning:**
   - Does each page build on previous pages?
   - Is there a clear learning progression?
   - Would I feel confident applying this knowledge?

**Present Findings:**

```
Learning Effectiveness Review for Module 1:

✅ Prerequisites: Assumes basic programming knowledge (appropriate for "LLM Engineer")
⚠️  Gap found: Page 2 references "PRD" but term not defined until Page 3
✅ Examples: Good use of ML analogies (aligns with LLM Engineer perspective)
⚠️  Quiz: Question 4 difficulty too high for introductory module
✅ Progression: Clear build from fundamentals → application

Recommended fixes:
1. Add "PRD (Product Requirements Document)" definition to Page 2 glossary
2. Simplify Quiz Question 4 or move to advanced section

Approve these changes?
```

**Checklist:**
- [ ] Learner at specified level (from course-spec.json) would understand
- [ ] No forward references (concepts used before explained)
- [ ] Quiz difficulty matches audience level
- [ ] Practice tasks achievable and relevant
- [ ] Progress indicators motivate continued learning
- [ ] Overall flow builds knowledge cumulatively
- [ ] Examples resonate with target audience perspective

**Output:** List of knowledge gaps, quiz misalignments, prerequisite issues.

### Dimension 5: Visual & Design Quality (Automated + Human)

**Goal:** Ensure distinctive, consistent, high-quality design.

**Read Design Specifications:**

```bash
# Check for design system file
DESIGN_FILE="$SITE_DIR/design-system/DESIGN.md"

if [ -f "$DESIGN_FILE" ]; then
  echo "📐 Design System Found:"
  AESTHETIC=$(grep "^Aesthetic:" "$DESIGN_FILE" | cut -d: -f2)
  FONTS=$(grep "^Font Pairing:" "$DESIGN_FILE" | cut -d: -f2)
  COLORS=$(grep "^Color Palette:" "$DESIGN_FILE" | cut -d: -f2)

  echo "  Aesthetic: $AESTHETIC"
  echo "  Fonts: $FONTS"
  echo "  Colors: $COLORS"
else
  echo "⚠️  No DESIGN.md found - using default design checks"
fi

# Read language for typography checks
CONTENT_LANG=$(jq -r '.contentLanguage' .learning/state/course-spec.json)
```

**Automated Design Checks:**

```bash
for BUILT_FILE in $BUILT_FILES; do
  # 1. Check for AI-slop anti-patterns
  if grep -i "font-inter" "$BUILT_FILE" > /dev/null; then
    echo "⚠️  DESIGN ISSUE: Inter font detected (generic AI aesthetic)"
  fi

  if grep -iE "(bg-gradient-to-r.*purple|from-purple-[0-9]|to-pink-[0-9])" "$BUILT_FILE" > /dev/null; then
    echo "⚠️  DESIGN ISSUE: Purple gradient detected (generic AI aesthetic)"
  fi

  # 2. Check font consistency (should match DESIGN.md specification)
  if [ -n "$FONTS" ]; then
    # Extract font families from DESIGN.md
    # Verify built file uses these fonts consistently
  fi

  # 3. Check Chinese typography (if content is Chinese/Bilingual)
  if [[ "$CONTENT_LANG" =~ (中文|Bilingual) ]]; then
    # Check for proper Chinese font and line-height
    if ! grep -E "(font-noto-sans-sc|font-source-han|line-height.*1\.75)" "$BUILT_FILE" > /dev/null; then
      echo "⚠️  TYPOGRAPHY: Chinese text needs line-height 1.75+ and proper font"
    fi
  fi

  # 4. Check for consistent component styling
  # All components should use design tokens, not hardcoded colors
  if grep -E "bg-\[#[0-9a-f]+\]" "$BUILT_FILE" > /dev/null; then
    echo "⚠️  CONSISTENCY: Hardcoded color found (should use design tokens)"
  fi

  # 5. Check animation performance (avoid layout shift)
  if grep -E "animate-(bounce|spin|ping)" "$BUILT_FILE" > /dev/null; then
    echo "⚠️  ANIMATION: Bounce/spin/ping can cause jank - use transform-based animations"
  fi
done
```

**Human Verification (Screenshot Test):**

If Playwright available, show screenshots and ask:

```
📸 Visual Quality Review:

[Show desktop screenshot of main page]

Questions:
1. Would you screenshot this page and share it on Twitter/LinkedIn?
2. Does this look distinctive or generic?
3. Is the typography pleasant to read?
4. Do colors feel cohesive or random?
5. Any visual inconsistencies between sections?

[Show mobile screenshot]

6. Does mobile layout maintain visual quality?
7. Are component animations smooth or janky?
```

**Mermaid Diagram Validation:**

```bash
# Check if mermaid diagrams render
for SOURCE_NOTE in $SOURCE_NOTES; do
  MERMAID_COUNT=$(grep -c '```mermaid' "$SOURCE_NOTE" || echo "0")

  if [ "$MERMAID_COUNT" -gt 0 ]; then
    echo "📊 Found $MERMAID_COUNT mermaid diagrams in source"
    echo "Verifying they render correctly in built page..."
    # Check built file has mermaid component or properly rendered SVG
  fi
done
```

**Checklist:**
- [ ] Font pairing distinctive and consistent (not Inter)
- [ ] Color palette matches DESIGN.md (or course-spec.json aesthetic)
- [ ] No visual inconsistencies between pages
- [ ] Typography readable:
  - [ ] Chinese text: line-height ≥1.75, proper font (Noto Sans SC / Source Han Sans)
  - [ ] English text: line-height ≥1.6, consistent font pairing
- [ ] All Mermaid diagrams render correctly
- [ ] Interactive components styled consistently
- [ ] Animations smooth (transform-based, no layout shift)
- [ ] **Screenshot test:** Distinctive enough to share
- [ ] **NOT AI-slop:** No Inter, no purple gradients, no generic grids
- [ ] Dark mode: Colors inverted properly, readability maintained

**Output:** Design consistency issues, typography problems, AI-slop anti-patterns detected.

---

## Fix → Re-Audit Loop (Critical for Iteration)

After collecting findings from all 5 dimensions:

### Step 1: Categorize Issues by Severity

```bash
# Create audit report directory
mkdir -p .learning/audits
AUDIT_FILE=".learning/audits/${CHUNK_ID}.json"

# Categorize all findings
cat > "$AUDIT_FILE" <<EOF
{
  "chunkId": "$CHUNK_ID",
  "auditedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "status": "FAILED",
  "dimensions": {
    "contentFidelity": {"score": 0, "issues": []},
    "presentationQuality": {"score": 0, "issues": []},
    "userExperience": {"score": 0, "issues": []},
    "learningEffectiveness": {"score": 0, "issues": []},
    "visualQuality": {"score": 0, "issues": []}
  },
  "issuesSummary": {
    "critical": 0,
    "major": 0,
    "minor": 0,
    "opportunities": 0
  },
  "fixes": []
}
EOF
```

**Severity Levels:**
- **CRITICAL** (blocks learning): Missing content, broken functionality, crashes
- **MAJOR** (degrades experience): Missed interactivity, responsive issues, dark mode problems
- **MINOR** (polish): Inconsistent spacing, animation timing, icon choices
- **OPPORTUNITIES** (could improve): Additional interactive components, advanced features

### Step 2: Present Findings to User

```markdown
# Audit Report: {Chunk Name}

## Critical Issues (MUST FIX) — {count}
- [Page: module-1/intro] Flashcard deck missing 4 terms from terminology table
- [Page: module-1/skills] Page crashes on mobile at 375px (component overflow)

## Major Issues (SHOULD FIX) — {count}
- [Page: module-1/intro] PM vs Engineer comparison is plain text (should be SideBySide)
- [Page: module-1/methods] Dark mode contrast too low on ConceptCard borders
- [Page: module-1/intro] No responsive classes for tablet breakpoint

## Minor Issues (NICE TO FIX) — {count}
- [Page: module-1/intro] TLDRCard animation timing slightly off
- [Page: module-1/skills] Inconsistent icon sizes in process timeline

## Opportunities (COULD IMPROVE) — {count}
- [Page: module-1/intro] "PM daily schedule" section → TimeAllocation component
- [Page: module-1/methods] Add streak counter to encourage daily returns

## Dimension Scores
| Dimension | Score | Status |
|-----------|-------|--------|
| Content Fidelity | 9/10 | ✅ PASS |
| Presentation Quality | 6/10 | ❌ FAIL (3 component mismatches) |
| User Experience | 7/10 | ❌ FAIL (mobile issues) |
| Learning Effectiveness | 9/10 | ✅ PASS |
| Visual Quality | 8/10 | ✅ PASS (minor polish needed) |

**Overall Status:** FAILED (2 dimensions below threshold)
```

### Step 3: Get Fix Approval (Based on Fix Mode)

Read fix mode from audit-state.json:

```bash
FIX_MODE=$(jq -r '.fixMode' .learning/state/audit-state.json)

case "$FIX_MODE" in
  "auto-all")
    echo "Applying all fixes automatically..."
    APPLY_CRITICAL=true
    APPLY_MAJOR=true
    APPLY_MINOR=true
    ASK_OPPORTUNITIES=true
    ;;
  "auto-critical-major")
    echo "Auto-fixing Critical and Major issues..."
    echo "Asking about Minor issues and Opportunities..."
    APPLY_CRITICAL=true
    APPLY_MAJOR=true
    ASK_MINOR=true
    ASK_OPPORTUNITIES=true
    ;;
  "ask-all")
    echo "Presenting all fixes for approval..."
    ASK_CRITICAL=true
    ASK_MAJOR=true
    ASK_MINOR=true
    ASK_OPPORTUNITIES=true
    ;;
esac
```

**For each fix requiring approval, show before/after:**

```
Fix: Convert PM vs Engineer comparison to SideBySide component

Before (Plain Text):
```
PM focuses on what to build and why...
Engineer focuses on how to build...
```

After (SideBySide Component):
<SideBySide
  left={{
    title: "PM Mindset",
    items: ["What to build", "Why it matters", "User needs"]
  }}
  right={{
    title: "Engineer Mindset",
    items: ["How to build", "Technical feasibility", "System design"]
  }}
/>

Apply this fix? (yes/no/skip)
```

### Step 4: Apply Approved Fixes

```bash
# For each approved fix
for FIX in "${APPROVED_FIXES[@]}"; do
  FILE=$(echo "$FIX" | jq -r '.file')
  OLD_CONTENT=$(echo "$FIX" | jq -r '.oldContent')
  NEW_CONTENT=$(echo "$FIX" | jq -r '.newContent')

  # Use Edit tool to apply fix
  # Edit file_path="$FILE" old_string="$OLD_CONTENT" new_string="$NEW_CONTENT"

  # Record fix in audit report
  jq --arg file "$FILE" --arg desc "$FIX_DESCRIPTION" \
     '.fixes += [{"file": $file, "description": $desc, "appliedAt": now|todate}]' \
     "$AUDIT_FILE" > tmp.$$ && mv tmp.$$ "$AUDIT_FILE"
done
```

### Step 5: Re-Audit Fixed Pages (Only Failed Dimensions)

**CRITICAL: Do NOT re-run entire audit. Only re-check dimensions that failed.**

```bash
# Read which dimensions failed
FAILED_DIMS=$(jq -r '.dimensions | to_entries[] | select(.value.score < 7) | .key' "$AUDIT_FILE")

echo "Re-auditing failed dimensions: $FAILED_DIMS"

# For each failed dimension, re-run only its checks
for DIM in $FAILED_DIMS; do
  case "$DIM" in
    "contentFidelity")
      # Re-run Dimension 1 checks
      ;;
    "presentationQuality")
      # Re-run Dimension 2 checks
      ;;
    "userExperience")
      # Re-run Dimension 3 checks (Playwright screenshots)
      ;;
    "learningEffectiveness")
      # Re-run Dimension 4 checks
      ;;
    "visualQuality")
      # Re-run Dimension 5 checks
      ;;
  esac
done
```

### Step 6: Update Audit Status

```bash
# Recalculate dimension scores
# If all dimensions now ≥ 7/10, mark as PASSED

ALL_PASSED=true
for DIM in contentFidelity presentationQuality userExperience learningEffectiveness visualQuality; do
  SCORE=$(jq -r ".dimensions.$DIM.score" "$AUDIT_FILE")
  if [ "$SCORE" -lt 7 ]; then
    ALL_PASSED=false
  fi
done

if [ "$ALL_PASSED" = true ]; then
  jq '.status = "PASSED"' "$AUDIT_FILE" > tmp.$$ && mv tmp.$$ "$AUDIT_FILE"
  echo "✅ Re-audit PASSED! All dimensions ≥ 7/10"
else
  echo "❌ Re-audit FAILED. Remaining issues:"
  jq -r '.dimensions | to_entries[] | select(.value.score < 7) | "\(.key): \(.value.score)/10"' "$AUDIT_FILE"
  echo ""
  echo "Options:"
  echo "1. Apply more fixes and re-audit again"
  echo "2. Accept current quality and proceed (user decision)"
  echo "3. Escalate to manual intervention"
fi
```

### Step 7: Update build-manifest.json

```bash
# Mark chunk as audited in build-manifest.json
AUDIT_STATUS=$(jq -r '.status' "$AUDIT_FILE")

jq --arg id "$CHUNK_ID" --arg status "$AUDIT_STATUS" \
   '(.chunks[] | select(.id == $id)) |= (. + {audited: true, auditStatus: $status})' \
   .learning/state/build-manifest.json > tmp.$$ && mv tmp.$$ .learning/state/build-manifest.json

# Update audit-state.json
jq --arg chunk "$CHUNK_ID" \
   '.lastAuditedChunk = $chunk | .totalIssuesFound += (.issuesSummary | add) | .totalIssuesFixed += (.fixes | length)' \
   .learning/state/audit-state.json > tmp.$$ && mv tmp.$$ .learning/state/audit-state.json
```

**Return to Main Orchestrator:**

The orchestrator will read `build-manifest.json` and see:
- If `auditStatus == "PASSED"`: Route to Phase 3 for next chunk
- If `auditStatus == "FAILED"`: Route back to Phase 4 to fix and re-audit
- If all chunks passed: Mark pipeline complete ✅

---

## OUTPUT: Audit Report (JSON Format)

**File:** `.learning/audits/{chunk-id}.json`

**Schema:**

```json
{
  "chunkId": "module-1-part-1",
  "auditedAt": "2026-01-29T10:30:00Z",
  "status": "PASSED" | "FAILED",
  "dimensions": {
    "contentFidelity": {
      "score": 9,
      "maxScore": 10,
      "issues": [
        {
          "severity": "MINOR",
          "file": "app/modules/module-1/page.tsx",
          "description": "Term 'PRD' used but not in flashcard deck",
          "fixed": true
        }
      ]
    },
    "presentationQuality": {
      "score": 8,
      "maxScore": 10,
      "issues": [
        {
          "severity": "MAJOR",
          "file": "app/modules/module-1/page.tsx",
          "description": "PM vs Engineer comparison is plain text, should be SideBySide",
          "fixed": true
        }
      ]
    },
    "userExperience": {
      "score": 7,
      "maxScore": 10,
      "issues": [
        {
          "severity": "MAJOR",
          "file": "app/modules/module-1/page.tsx",
          "description": "Mobile layout breaks at 375px - sidebar overlaps content",
          "fixed": true
        }
      ]
    },
    "learningEffectiveness": {
      "score": 9,
      "maxScore": 10,
      "issues": []
    },
    "visualQuality": {
      "score": 8,
      "maxScore": 10,
      "issues": [
        {
          "severity": "MINOR",
          "file": "app/modules/module-1/page.tsx",
          "description": "Dark mode contrast could be improved on ConceptCard borders",
          "fixed": false
        }
      ]
    }
  },
  "issuesSummary": {
    "critical": 0,
    "major": 2,
    "minor": 2,
    "opportunities": 1
  },
  "fixes": [
    {
      "file": "app/modules/module-1/page.tsx",
      "description": "Converted PM vs Engineer comparison to SideBySide component",
      "appliedAt": "2026-01-29T10:45:00Z",
      "beforeAfter": {
        "before": "Plain text comparison...",
        "after": "<SideBySide ... />"
      }
    }
  ],
  "screenshots": {
    "desktop": ".learning/audits/screenshots/module-1-part-1-desktop.png",
    "tablet": ".learning/audits/screenshots/module-1-part-1-tablet.png",
    "mobile": ".learning/audits/screenshots/module-1-part-1-mobile.png",
    "darkMode": ".learning/audits/screenshots/module-1-part-1-dark.png"
  },
  "reAudits": [
    {
      "reAuditedAt": "2026-01-29T10:50:00Z",
      "dimensionsChecked": ["presentationQuality", "userExperience"],
      "newScores": {
        "presentationQuality": 8,
        "userExperience": 7
      },
      "statusChanged": "FAILED → PASSED"
    }
  ]
}
```

**Passing Threshold:** All dimensions ≥ 7/10 → `status: "PASSED"`

---

## Human-in-the-Loop Interaction Patterns

### During Audit (Finding Issues)

**Dimension 2 (Presentation Quality) & Dimension 4 (Learning Effectiveness):**
- Present findings as you discover them
- Show screenshots when available (Playwright)
- Ask about ambiguous cases:
  ```
  This comparison section is currently plain text:
  "PM focuses on what... Engineer focuses on how..."

  Should I convert this to SideBySide component? (yes/no/skip)
  ```

**Dimension 3 (UX) Visual Testing:**
- Show screenshots at 3 viewport sizes
- Ask: "Do you see any layout issues at these breakpoints?"
- Highlight specific problems found

**Dimension 5 (Visual Quality) Screenshot Test:**
- Show representative page
- Ask: "Would you share this on Twitter/LinkedIn? Does it look distinctive?"

### During Fixes (Applying Changes)

**Based on Fix Mode:**

1. **Auto-fix mode (critical/major):**
   - Fix automatically, show summary after
   - "Applied 3 fixes: converted 2 comparisons to SideBySide, fixed mobile overflow, improved dark mode contrast"

2. **Approval mode (minor/opportunities):**
   - Present each fix with before/after
   - Ask: "Apply this fix? (yes/no/skip)"
   - Batch similar fixes: "Found 4 similar typography issues. Fix all? (yes/no/review individually)"

3. **Full approval mode (all fixes):**
   - Present every fix for approval
   - Show code diff for technical fixes

### After Re-Audit

**If PASSED:**
```
✅ Re-audit complete! All dimensions now ≥ 7/10.

Improvements:
- Presentation Quality: 6/10 → 8/10 (converted 3 sections to interactive components)
- User Experience: 7/10 → 8/10 (fixed mobile breakpoints, dark mode)

Proceeding to next chunk: module-1-part-2
```

**If FAILED:**
```
❌ Re-audit shows remaining issues:

Presentation Quality: 6/10 (still have 2 plain text comparisons)
User Experience: 6/10 (mobile overflow not fully resolved)

Options:
1. Apply more fixes and re-audit again (recommended)
2. Accept current quality and proceed (not recommended)
3. Manually review problematic sections

What would you like to do?
```

---

## Resumption (State-Driven)

**Phase 4 uses state files to resume automatically:**

```bash
# Check if audit already in progress
if [ -f .learning/state/audit-state.json ]; then
  LAST_CHUNK=$(jq -r '.lastAuditedChunk' .learning/state/audit-state.json)
  TOTAL_FIXED=$(jq -r '.totalIssuesFixed' .learning/state/audit-state.json)

  echo "📊 Previous audit session found:"
  echo "  Last audited: $LAST_CHUNK"
  echo "  Total issues fixed: $TOTAL_FIXED"
  echo ""
fi

# Find next chunk needing audit from build-manifest.json
NEXT_CHUNK=$(jq -r '.chunks[] | select(.status == "built" and (.audited // false) == false) | .id' .learning/state/build-manifest.json | head -n 1)

if [ -z "$NEXT_CHUNK" ]; then
  echo "✅ All chunks have been audited!"
  exit 0
else
  echo "Starting audit for: $NEXT_CHUNK"
fi
```

**No task files needed** — state files contain all resumption context.

---

## The Phase 3-4 Loop (How It Works)

```
┌─────────────────────────────────────────────────┐
│ Main Orchestrator (SKILL.md)                    │
│ - Reads build-manifest.json                    │
│ - Routes to Phase 3 or Phase 4 based on state  │
└─────────────────────────────────────────────────┘
         │
         ├─→ Phase 3: notes-to-web
         │   - Builds chunk (e.g., module-1-part-1)
         │   - Writes build-manifest.json:
         │     {chunks: [{id: "module-1-part-1", status: "built", audited: false}]}
         │   - Returns to orchestrator
         │
         └─→ Orchestrator reads build-manifest.json
             - Sees chunk built but not audited
             - Routes to Phase 4
             │
             ├─→ Phase 4: learning-audit
             │   - Audits module-1-part-1
             │   - Writes .learning/audits/module-1-part-1.json
             │     {status: "FAILED", dimensions: {...}}
             │   - Applies fixes
             │   - Re-audits
             │   - Updates .learning/audits/module-1-part-1.json
             │     {status: "PASSED", dimensions: {...}}
             │   - Updates build-manifest.json:
             │     {chunks: [{id: "module-1-part-1", status: "built", audited: true, auditStatus: "PASSED"}]}
             │   - Returns to orchestrator
             │
             └─→ Orchestrator reads build-manifest.json
                 - Sees chunk audited and PASSED
                 - Routes back to Phase 3 for next chunk
                 │
                 └─→ REPEAT until all chunks PASSED
```

**Quality compounds instead of issues accumulating.**

---

## Summary: What Phase 4 Outputs

**State Files Updated:**
1. `.learning/audits/{chunk-id}.json` — Detailed audit report with scores, issues, fixes
2. `.learning/state/audit-state.json` — Overall audit progress, fix mode, cumulative stats
3. `.learning/state/build-manifest.json` — Mark chunks as audited with PASSED/FAILED status

**Screenshots (if Playwright available):**
- `.learning/audits/screenshots/{chunk-id}-desktop-light.png`
- `.learning/audits/screenshots/{chunk-id}-desktop-dark.png`
- `.learning/audits/screenshots/{chunk-id}-tablet.png`
- `.learning/audits/screenshots/{chunk-id}-mobile.png`

**Orchestrator Decision:**
- If audit PASSED → Route to Phase 3 (next chunk)
- If audit FAILED → Route back to Phase 4 (fix and re-audit)
- If all chunks PASSED → Mark pipeline complete ✅
