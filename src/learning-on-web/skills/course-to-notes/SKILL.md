---
name: course-to-notes
description: "Transform raw course content into value-added learning notes in markdown. Notes are oriented by audience, perspective, tone, and goals from course-spec.json. Trigger: generate notes, transform content, create learning notes, write notes."
---

# Course to Notes — Content Transformation

## Purpose

Transform raw course content into value-added learning notes in markdown, with human steering at every stage. Notes are **oriented by the audience, perspective, tone, and goals defined in `course-spec.json`** from Phase 1.

## When to Activate

- User asks to generate notes, transform content, or write learning notes
- The main orchestrator routes here as Phase 2
- `.learning/course-spec.json` exists

## INPUT Requirements (State Files from Phase 1)

This phase requires `.learning/state/course-spec.json` from Phase 1.

**Verify before proceeding:**

```bash
if [ ! -f .learning/state/course-spec.json ]; then
  echo "❌ ERROR: course-spec.json missing"
  echo "Phase 2 requires the course specification from Phase 1."
  echo ""
  echo "Please run Phase 1 (course-analyze) first, or if using Quick Mode,"
  echo "ensure the orchestrator generated a minimal course-spec.json."
  exit 1
fi

echo "✅ course-spec.json found"
```

**Read before every note** to orient content by audience, perspective, tone, and goals.

---

## Language Handling (CRITICAL)

Before generating any notes, read the language setting from course-spec.json:

```bash
CONTENT_LANG=$(jq -r '.contentLanguage // "English"' .learning/state/course-spec.json)
echo "Content language: $CONTENT_LANG"
```

**Apply language setting to ALL generated content:**

| Language Setting | How to Apply |
|-----------------|--------------|
| **English** | Generate all content (TL;DR, headings, terminology, self-test, practice tasks) in English |
| **中文 (Chinese)** | Generate all content in simplified Chinese. Use Chinese terminology with English in parentheses where helpful. |
| **Bilingual** | Primary language in Chinese, key terms in both Chinese and English. Example: "产品经理 (Product Manager)" |
| **Auto-detect** | Match the language of source materials. If mixed, use the dominant language. |

**Important formatting for bilingual content:**
```markdown
## 术语表 (Terminology)
| 中文术语 | English Term | 定义 (Definition) | 示例 (Example) |
|---------|--------------|------------------|----------------|
| 产品经理 | Product Manager | 负责产品战略... | ... |
```

**UI text and structure elements** (headings like "TL;DR", "Self-Test", "Practice Tasks"):
- If language is Chinese or Bilingual: Use Chinese headings (e.g., "核心要点" instead of "TL;DR")
- If language is English: Use English headings

---

## Core Philosophy (NON-NEGOTIABLE)

```
⚠️ CRITICAL: VALUE-ADD, NOT SUMMARIZATION

These notes are NOT summaries. They are:
- Self-contained mastery resources
- Enhanced understanding BEYOND the original course
- Practical wisdom connecting theory to application
- Written from the specified perspective (from course-spec.json)

The reader should master the subject WITHOUT the original content,
and gain EXTRA value they couldn't get from the original alone.
```

---

## Writing Quality Standard: COMMERCIAL PUBLICATION GRADE

Every note MUST read as if written by a professional human author for commercial publication.

### MUST:
- Natural, flowing prose with varied sentence structure
- Authentic voice matching the specified perspective
- Smooth transitions between sections
- Concrete, specific examples (not generic placeholders)
- Precise terminology used correctly and consistently
- Active voice, direct statements
- Real insights that demonstrate domain expertise

### MUST NOT:
- Use AI-generation markers: "Let's dive in", "In this section, we will explore", "It's worth noting that", "As we can see", "In conclusion"
- Use decorative emojis as bullet points or section markers (emojis in callout boxes like `> 💡` are fine — they serve a functional purpose as visual category markers)
- Use filler phrases: "It is important to note", "As mentioned earlier", "Generally speaking"
- Use vague generalizations: "There are many ways to...", "This is a complex topic..."
- Repeat the same point in different words for padding
- Use numbered lists where prose would be more natural
- Sound like a textbook summary or course transcript

### The Test
If a reader can tell this was AI-generated, the note has failed. It should read like a thoughtful blog post or book chapter written by an experienced practitioner.

---

## Audience Orientation

Before writing each note, re-read `course-spec.json` and orient content based on:

- **Audience level** → Controls depth (beginner: explain everything; advanced: focus on nuance and edge cases)
- **Perspective** → Controls voice (e.g., "LLM engineer" means drawing parallels to ML systems)
- **Tone** → Controls formality and style
- **Emphasis/de-emphasis** → Controls which topics get expanded vs. condensed
- **Self-sufficiency** → If true, the note must be complete enough to learn from alone

---

## Batch Mode Selection

Before starting, ask the user which interaction mode they prefer:

| Mode | Description | Best For |
|------|-------------|----------|
| **Verbose** | Ask 3-5 questions per note before writing | First-time use, critical content, high-stakes courses |
| **Module** | Ask questions once per module, apply to all parts | Balanced thoroughness, most common choice |
| **Auto** | After first module with feedback, apply learned preferences to rest — only ask about exceptions | Large courses (15+ parts), user trusts the skill |

User can switch modes mid-session.

---

## Human-in-the-Loop Flow

### Catalog-Level Questions (once per course)

- Review the module structure — does grouping make sense for learning?
- Any modules to reorder for better learning flow?
- Content gaps that need supplementary notes?
- What's the overall narrative arc?

### Module-Level Questions (once per module)

- Learning objective for this module?
- How does it connect to previous/next?
- Specific examples or case studies to prioritize?
- Should any parts be merged or split?

### Note-Level Questions (per note, in Verbose mode)

After reading source content, present key concepts found. Ask:
- "What should I emphasize? What should I add beyond the source?"
- "Any specific real-world examples to include?"
- "Common misconceptions to address?"
- After generating, present the note for review before saving

### Style Questions (once, early)

- How many Mermaid diagrams per note? (recommend 2-5)
- How long should each note be? (recommend 2000-4000 chars for Chinese)
- Include collapsible deep-dives?
- Dual-language terminology?

---

## Note Template

Use the template from `templates/note-template.md`. Each note follows this structure:

### Required Opening (every note)
- TL;DR (3-5 key takeaways)
- Table of contents
- Learning path connection (previous ↔ next, with Mermaid flowchart)
- Content mind map (Mermaid mindmap)

### Flexible Middle (based on content type from course-spec.json)

| Content Type | Template | Key Sections |
|-------------|----------|-------------|
| `concept-heavy` | Core concept analysis | Definition, why it matters, perspective, misconceptions, applications |
| `framework` | Framework deep-dive | Origin, applicability, step-by-step, case studies, insights |
| `tool` | Tool practice guide | Positioning, evaluation table, quick start, pitfalls, alternatives |
| `process` | Process flowchart guide | Flowchart, overview, decision points, checklists, scenarios |
| `soft-skill` | Scenario-based practice | Scenarios, do/don't comparison, dialogue templates, exercises |

### Required Ending (every note)
- Terminology table (source language + target language + definition)
- Key points (Must Know vs Good to Know)
- Self-test questions (understanding, not memorization)
- Practice tasks (actionable)
- Next section preview

---

## Interactive Elements Library

Include these in notes as appropriate:

```markdown
<!-- Collapsible deep-dives -->
<details>
<summary>深入了解：[Topic]</summary>
Detailed content...
</details>

<!-- Functional callout boxes -->
> 💡 **洞察**：Key insight
> ⚠️ **注意**：Warning / common mistake
> 🎯 **实战提示**：Practical tip
> 📌 **必学**：Essential concept
> 💎 **经典案例**：Timeless example
```

---

## Quality Checklist (verify before saving each note)

- [ ] TL;DR captures essential 3-5 takeaways
- [ ] Mind map reflects actual content, not generic categories
- [ ] At least 2-3 Mermaid diagrams (mindmap, flowchart, sequence, gantt as appropriate)
- [ ] Practical examples are current-year OR marked as classics
- [ ] Terminology table includes ALL technical terms
- [ ] Self-test questions test understanding, not memorization
- [ ] Practice tasks are actionable in the real world
- [ ] Word count target met
- [ ] Content adds value BEYOND the source material
- [ ] Written from the specified perspective (course-spec.json)
- [ ] **Passes the "human-written" test** — no AI generation artifacts
- [ ] **Tone matches** the audience specification
- [ ] **No decorative emojis** — only functional callout markers

---

## Output

Notes are saved to `docs/` directory:
```
docs/
├── {course-id}/
│   ├── {module-id}/
│   │   ├── {part-id}-{part-name}.md
│   │   └── ...
│   └── ...
```

---

## Task File Maintenance

Maintain `.learning/tasks/course-to-notes.task.md`:

```markdown
# course-to-notes Task State

## Status: in-progress
## Batch Mode: module
## Last Updated: [timestamp]

## Configuration
- Style: conversational, 2000-4000 chars, 2-5 diagrams per note
- Dual-language terms: yes
- Exercises: yes

## Progress
### Module 1: [Name]
- [x] Part 1: docs/course-1/m01/01-intro.md ✅ reviewed
- [x] Part 2: docs/course-1/m01/02-basics.md ✅ reviewed
- [ ] Part 3: docs/course-1/m01/03-advanced.md 🔄 in-progress

### Module 2: [Name]
- [ ] Part 1 ⏳ pending
- [ ] Part 2 ⏳ pending

## User Decisions Log
- Module 1: "emphasize practical examples over theory"
- Module 2: "add comparison to PyTorch where relevant"
- Global: "use startup examples from Chinese tech companies"
```

Update PROGRESS.md after each completed note/module.

---

## Resumption

If `.learning/tasks/course-to-notes.task.md` exists:
1. Read it to find last completed item
2. Present status: "You've completed 8/18 notes. Currently on Module 2, Part 4."
3. Ask: "Continue from where we left off?"
4. Load the user decisions log to maintain consistency
5. Resume from the next incomplete item

---

## OUTPUT: Generate Notes Manifest (State File for Phase 3)

When all notes are complete and validated, create the state file for Phase 3:

### Step 1: Validate All Notes

Run quality checks on all generated notes:

```bash
echo "Running quality validation..."

VALIDATION_FAILED=0

for note in docs/**/*.md; do
  # Check for required sections
  if ! grep -q "^## TL;DR" "$note" || \
     ! grep -q "^## .*Terminology" "$note" || \
     ! grep -q "^## .*Self.*Test" "$note" || \
     ! grep -q "^## .*Practice" "$note"; then
    echo "❌ $note: Missing required sections"
    VALIDATION_FAILED=1
  fi

  # Check for AI markers
  if grep -E "(Let's dive in|In this section|It's worth noting|As we can see)" "$note"; then
    echo "⚠️  $note: Contains AI generation markers"
    VALIDATION_FAILED=1
  fi
done

if [ $VALIDATION_FAILED -eq 1 ]; then
  echo ""
  echo "⚠️  Some notes failed validation. Fix these issues before proceeding."
  exit 1
fi

echo "✅ All notes passed quality validation"
```

### Step 2: Generate notes-manifest.json

Create the manifest that tells Phase 3 which notes to convert:

```bash
# Read course info from course-spec.json
COURSE_TITLE=$(jq -r '.courseTitle // "Untitled Course"' .learning/state/course-spec.json)
CONTENT_LANG=$(jq -r '.contentLanguage // "English"' .learning/state/course-spec.json)

# Count total notes
TOTAL_NOTES=$(find docs -name "*.md" | wc -l | tr -d ' ')

# Generate manifest
cat > .learning/state/notes-manifest.json <<EOF
{
  "version": "1.0",
  "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "courseTitle": "$COURSE_TITLE",
  "contentLanguage": "$CONTENT_LANG",
  "totalNotes": $TOTAL_NOTES,
  "modules": [
EOF

# Scan docs directory to build module structure
FIRST_MODULE=true
for module_dir in docs/*/; do
  MODULE_ID=$(basename "$module_dir")
  MODULE_TITLE=$(grep "^# " "$module_dir"/*.md | head -1 | sed 's/^# //' || echo "$MODULE_ID")

  if [ "$FIRST_MODULE" = false ]; then
    echo "," >> .learning/state/notes-manifest.json
  fi
  FIRST_MODULE=false

  cat >> .learning/state/notes-manifest.json <<MODULE
    {
      "id": "$MODULE_ID",
      "title": "$MODULE_TITLE",
      "parts": [
MODULE

  FIRST_PART=true
  for note_file in "$module_dir"/*.md; do
    PART_ID=$(basename "$note_file" .md)
    PART_TITLE=$(grep "^# " "$note_file" | head -1 | sed 's/^# //' || echo "$PART_ID")

    if [ "$FIRST_PART" = false ]; then
      echo "," >> .learning/state/notes-manifest.json
    fi
    FIRST_PART=false

    cat >> .learning/state/notes-manifest.json <<PART
        {
          "id": "$PART_ID",
          "title": "$PART_TITLE",
          "file": "$(realpath --relative-to=. "$note_file")",
          "validated": true
        }
PART
  done

  echo -e "\n      ]" >> .learning/state/notes-manifest.json
  echo "    }" >> .learning/state/notes-manifest.json
done

# Close modules array and add quality checks summary
cat >> .learning/state/notes-manifest.json <<EOF
  ],
  "qualityChecks": {
    "allHaveTLDR": true,
    "allHaveMindMap": true,
    "allHaveTerminology": true,
    "allHaveSelfTest": true,
    "allHavePractice": true,
    "noAIMarkers": true
  }
}
EOF

echo "✅ Generated .learning/state/notes-manifest.json"
cat .learning/state/notes-manifest.json | jq '.'
```

### Step 3: Update PROGRESS.md

```bash
# Mark Phase 2 as completed in PROGRESS.md
sed -i '' 's/course-to-notes | .*/course-to-notes | ✅ completed | All notes validated | notes-manifest.json/' .learning/PROGRESS.md

echo "✅ Updated PROGRESS.md"
```

### Step 4: Hand Off to Orchestrator

This phase is now complete. Return control to the main orchestrator, which will:
1. Detect `notes-manifest.json` exists
2. Route to Phase 3 (notes-to-web) to begin building the interactive website

**Do NOT directly invoke Phase 3.** The orchestrator handles all phase routing.
