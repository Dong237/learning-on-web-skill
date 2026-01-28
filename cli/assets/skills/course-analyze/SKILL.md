---
name: course-analyze
description: "Discover course structure, audience, and goals through interactive dialogue. Produces course-spec.json that drives all subsequent skills. Trigger: analyze course, discover structure, scan course folder."
---

# Course Analyze — Structure Discovery

## Purpose

Scan any course folder, discover its structure through interactive dialogue with the user, and produce a specification file (`course-spec.json`) that drives all subsequent skills.

## When to Activate

- User asks to analyze, scan, or discover course structure
- User begins the learning-on-web pipeline from scratch
- The main orchestrator routes here as Phase 1

## Prerequisites

- A course folder with source materials (transcripts, PDFs, slides, markdown, readings)
- No prior `.learning/` directory (or user wants to re-analyze)

---

## Interactive Discovery Flow

This skill is deeply interactive. NEVER assume — always ask.

### Step 1: Source Materials Discovery

Ask the user:

1. **Where are the source materials?** (path to folder)
2. **What format are they?** (video transcripts, PDFs, slides, readings, mixed?)
3. **Is there a syllabus, outline, or table of contents file?** (helps establish hierarchy)
4. **Are materials in one language or multiple?**

After getting answers, scan the folder structure. Present what you found:
```
Found 24 files in ./materials/:
- 12 .txt files (likely transcripts)
- 5 .pdf files
- 4 .md files
- 3 .pptx files

Proposed hierarchy based on filenames:
  Module 1: [name] (6 files)
  Module 2: [name] (8 files)
  ...
```

### Step 2: Target Audience

Ask the user:

1. **Who is this for?** (e.g., "engineers learning PM", "designers learning code", "students learning data science")
2. **Existing knowledge level?** (beginner, intermediate, advanced)
3. **What perspective should notes bring?** (e.g., "practitioner with 5 years experience", "LLM engineer", "startup founder")
4. **What language should output be in?**

### Step 3: Learning Goals

Ask the user:

1. **Should notes be self-sufficient?** (learner doesn't need original content)
2. **What depth?** (overview vs. mastery)
3. **Topics to emphasize or de-emphasize?**
4. **Include hands-on exercises?**

### Step 4: Content Quality Expectations

Ask the user:

1. **What tone?** (academic, conversational, professional editorial)
2. **Style guides to follow?**
3. **Quality bar?** (default: commercial publication quality)
4. **Formatting preferences?**

### Step 5: Confirm Structure

Present the discovered structure to the user:

```
Course: [Title]
├── Module 1: [Name] (5 parts)
│   ├── Part 1: [Name] — concept-heavy
│   ├── Part 2: [Name] — framework
│   └── ...
├── Module 2: [Name] (4 parts)
│   └── ...
└── Module 3: [Name] (6 parts)
    └── ...
```

Ask:
1. **Does this grouping make sense?**
2. **Any content to skip or merge?**
3. **Naming conventions for output files?**
4. **Any modules to reorder?**

---

## Content Type Classification

For each part, classify the content type. This drives which template is used in Phase 2:

| Type | Description | Signals |
|------|-------------|---------|
| `concept-heavy` | Definitions, theories, mental models | Abstract ideas, terminology-dense |
| `framework` | Structured methodologies | Step-by-step processes, matrices, canvases |
| `tool` | Software, techniques, instruments | How-to, setup guides, feature walkthroughs |
| `process` | Workflows, procedures | Sequential steps, decision points, checklists |
| `soft-skill` | Communication, leadership, teamwork | Scenarios, interpersonal dynamics |

Present classifications to user for confirmation. They may override.

---

## Output

Generate these files in `.learning/`:

### `course-spec.json`

```json
{
  "meta": {
    "title": "...",
    "language": "zh-CN",
    "audience": "Engineers transitioning to PM",
    "audienceLevel": "intermediate",
    "perspective": "LLM engineer with market knowledge",
    "depth": "mastery",
    "selfSufficient": true,
    "tone": "professional editorial",
    "qualityBar": "commercial publication",
    "exercises": true,
    "dualLanguageTerms": true
  },
  "courses": [
    {
      "id": "course-1",
      "title": "...",
      "localTitle": "...",
      "sourcePath": "...",
      "modules": [
        {
          "id": "module-01",
          "title": "...",
          "parts": [
            {
              "id": "01",
              "title": "...",
              "sourceFiles": ["file1.txt", "file2.md"],
              "contentType": "concept-heavy",
              "estimatedLength": "medium"
            }
          ]
        }
      ]
    }
  ],
  "userDecisions": {
    "emphasize": ["...topics to emphasize..."],
    "deemphasize": ["...topics to skip/minimize..."],
    "examples": "current-year with classic exceptions",
    "exercises": true,
    "dualLanguageTerms": true
  },
  "specVersion": "1.0",
  "createdAt": "ISO-8601 timestamp"
}
```

### `learning-brief.md`

Human-readable summary of all decisions made during analysis. Written in clear prose, not JSON. Serves as a quick reference for the user and for subsequent skill phases.

### `.learning/tasks/course-analyze.task.md`

```markdown
# course-analyze Task State

## Status: completed
## Completed At: [timestamp]

## Steps Completed
- [x] Source materials scanned
- [x] Audience defined
- [x] Learning goals set
- [x] Quality expectations set
- [x] Structure confirmed by user
- [x] Content types classified
- [x] course-spec.json generated
- [x] learning-brief.md generated

## User Decisions Log
- Audience: [what user said]
- Perspective: [what user said]
- Emphasis: [what user said]
- ...
```

### Update `.learning/PROGRESS.md`

After completing analysis:
```markdown
## Phase Status
| Phase | Status | Progress |
|-------|--------|----------|
| course-analyze | ✅ completed | 100% |
| course-to-notes | ⏳ pending | — |
| notes-to-web | ⏳ pending | — |
| learning-audit | ⏳ pending | — |
```

---

## Resumption

If `.learning/tasks/course-analyze.task.md` exists and is incomplete:
1. Read the task file to see which steps are done
2. Present status to user
3. Ask: "Continue from where we left off?"
4. Resume from the first incomplete step
