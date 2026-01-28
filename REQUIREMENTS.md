# Requirements: "Learning on Web" Skill

> A PRD-style requirements document for AI to build the learning-on-web skill.

---

## 1. Vision

Transform **any course content** into an interactive learning website through an AI-assisted, human-in-the-loop pipeline. The skill operates in four composable phases:

1. **Analyze** — Discover course structure, confirm with human
2. **Transform** — Generate value-added learning notes, oriented by human-specified audience and goals
3. **Build** — Create an interactive web platform, intelligently choosing the best presentation format for each concept
4. **Evaluate** — Audit the built experience against expectations, identify gaps, and fix them

**The fundamental promise:** The learning path stays intact. The knowledge stays intact. But the *way* it's presented becomes dramatically more engaging, interactive, and motivating — because the AI actively reasons about which UI component, illustration, diagram, or interactive element best serves each specific concept.

**What makes this skill intelligent:** It doesn't just convert markdown to HTML. For every piece of content, it asks: *"What is the best way to make a learner truly understand and remember this?"* — then chooses the right interactive format (quiz, flowchart, comparison table, animated diagram, flashcard, simulation, video embed, timeline, etc.) and implements it.

---

## 2. Target Skill Format

Follow the `ui-ux-pro-max-skill` pattern from `.example_skills/`:

```
learning-on-web-skill/
├── .claude-plugin/
│   ├── plugin.json                    # Plugin metadata
│   └── marketplace.json               # Marketplace listing
├── .claude/
│   └── skills/
│       └── learning-on-web/
│           └── SKILL.md               # Main orchestrator (auto-activates)
├── skills/
│   ├── course-analyze/
│   │   └── SKILL.md                   # Phase 1: Structure discovery
│   ├── course-to-notes/
│   │   ├── SKILL.md                   # Phase 2: Content transformation
│   │   └── templates/
│   │       └── note-template.md       # Flexible note template
│   ├── notes-to-web/
│   │   └── SKILL.md                   # Phase 3: Web building
│   └── learning-audit/
│       └── SKILL.md                   # Phase 4: Evaluation & improvement
├── CLAUDE.md
└── README.md
```

Each SKILL.md uses the standard frontmatter format:
```yaml
---
name: skill-name
description: "When to activate. What it does. Key trigger words."
---
```

**This is a prompt-driven skill** — no Python scripts, no CSV databases. Pure SKILL.md instructions that leverage AI's native capabilities. Keep it simple. Scripts can be added later as the skill matures.

---

## 3. Skill 1: `course-analyze` — Structure Discovery

### Purpose
Scan any course folder, discover its structure through interactive dialogue with the user, and produce a specification file that drives all subsequent skills.

### Human-in-the-Loop Requirements

This skill MUST be deeply interactive. AI should:

1. **Ask about the source materials:**
   - Where are they? (path)
   - What format? (video transcripts, PDFs, slides, readings, mixed?)
   - Is there a syllabus, outline, or table of contents file?
   - Are materials in one language or multiple?

2. **Ask about the target audience:**
   - Who is this for? (e.g., "engineers learning PM", "designers learning code", "students learning data science")
   - What's their existing knowledge level? (beginner, intermediate, advanced)
   - What perspective should the notes bring? (e.g., "practitioner with 5 years experience", "LLM engineer", "startup founder")
   - What language should the output be in?

3. **Ask about learning goals:**
   - Should the notes be self-sufficient (no need to watch original content)?
   - What depth? (overview vs. mastery)
   - Any specific topics to emphasize or de-emphasize?
   - Should it include hands-on exercises?

4. **Ask about content quality expectations:**
   - What tone? (academic, conversational, professional editorial)
   - Any style guides to follow?
   - What writing quality bar? (default: commercial publication quality)
   - Any specific formatting preferences?

5. **Confirm the discovered structure:**
   - Present the course → module → part hierarchy
   - Ask if the grouping makes sense
   - Ask about naming conventions for output files
   - Ask about any content to skip or merge

### Output

A `.learning/` directory containing:

- **`course-spec.json`** — Machine-readable spec:
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
      "qualityBar": "commercial publication"
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
                "contentType": "concept-heavy | framework | tool | process | soft-skill",
                "estimatedLength": "short | medium | long"
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
    }
  }
  ```

- **`learning-brief.md`** — Human-readable summary of all decisions made

**All answers from this phase are persisted in `course-spec.json` and MUST be used by all subsequent skills to orient their output.** This is the single source of truth for audience, perspective, tone, and quality expectations.

---

## 4. Skill 2: `course-to-notes` — Content Transformation

### Purpose
Transform raw course content into value-added learning notes in markdown, with human steering at every stage. Notes are **oriented by the audience, perspective, tone, and goals defined in `course-spec.json`** from Skill 1.

### Core Philosophy (NON-NEGOTIABLE)

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

### Writing Quality Standard: COMMERCIAL PUBLICATION GRADE

Every note MUST read as if written by a professional human author for commercial publication. This means:

**MUST:**
- Natural, flowing prose with varied sentence structure
- Authentic voice matching the specified perspective (e.g., an experienced engineer writing for peers)
- Smooth transitions between sections
- Concrete, specific examples (not generic placeholders)
- Precise terminology used correctly and consistently
- Active voice, direct statements
- Real insights that demonstrate domain expertise

**MUST NOT:**
- Use AI-generation markers: "Let's dive in", "In this section, we will explore", "It's worth noting that", "As we can see", "In conclusion"
- Use decorative emojis as bullet points or section markers (emojis in callout boxes like `> 💡` are fine since they serve a functional purpose as visual category markers)
- Use filler phrases: "It is important to note", "As mentioned earlier", "Generally speaking"
- Use vague generalizations: "There are many ways to...", "This is a complex topic..."
- Repeat the same point in different words for padding
- Use numbered lists where prose would be more natural
- Sound like a textbook summary or course transcript

**The test:** If a reader can tell this was AI-generated, the note has failed. It should read like a thoughtful blog post or book chapter written by an experienced practitioner.

### Audience Orientation

Before writing each note, AI MUST re-read `course-spec.json` and orient the content based on:

- **Audience level** → Controls depth of explanation (beginner: explain everything; advanced: focus on nuance and edge cases)
- **Perspective** → Controls the voice (e.g., "LLM engineer" means drawing parallels to ML systems, using engineering analogies)
- **Tone** → Controls formality and style
- **Emphasis/de-emphasis** → Controls which topics get expanded vs. condensed
- **Self-sufficiency** → If true, the note must be complete enough to learn from alone

### Human-in-the-Loop Requirements

Before generating EACH note (or batch), AI should:

1. **Catalog-level questions (once per course):**
   - Review the module structure — does this grouping make sense for learning?
   - Any modules that should be reordered for better learning flow?
   - Any content gaps that should be filled with supplementary notes?
   - What's the overall narrative arc of this course?

2. **Module-level questions (once per module):**
   - What's the learning objective for this module?
   - How does this module connect to previous/next?
   - Any specific examples or case studies to prioritize?
   - Should any parts within this module be merged or split?

3. **Note-level questions (per note or batch):**
   - After reading the source content, present key concepts found
   - Ask: "What should I emphasize? What should I add that the source doesn't cover?"
   - Ask: "Any specific real-world examples you want included?"
   - Ask: "What common misconceptions should I address?"
   - After generating, present the note for review before saving

4. **Style and format questions (once, early):**
   - How many Mermaid diagrams per note? (recommend 2-5)
   - How long should each note be? (recommend 2000-4000 chars for Chinese)
   - Should notes include collapsible deep-dives?
   - Should terminology be in dual-language?

### Template Structure

Use the **flexible template pattern**:

**Required opening (every note):**
- TL;DR (3-5 key takeaways)
- Table of contents
- Learning path connection (previous ↔ next, with Mermaid flowchart)
- Content mind map (Mermaid mindmap)

**Flexible middle (choose based on content type from course-spec.json):**

| Content Type | Template | Key Sections |
|-------------|----------|-------------|
| `concept-heavy` | Core concept analysis | Definition, why it matters, perspective, misconceptions, applications |
| `framework` | Framework deep-dive | Origin, applicability, step-by-step, case studies, insights |
| `tool` | Tool practice guide | Positioning, evaluation table, quick start, pitfalls, alternatives |
| `process` | Process flowchart guide | Flowchart, overview, decision points, checklists, scenarios |
| `soft-skill` | Scenario-based practice | Scenarios, do/don't comparison, dialogue templates, exercises |

**Required ending (every note):**
- Terminology table (source language + target language + definition)
- Key points (Must Know vs Good to Know)
- Self-test questions (understanding, not memorization)
- Practice tasks (actionable)
- Next section preview

### Quality Checklist (verify before saving each note)

- [ ] TL;DR captures the essential 3-5 takeaways
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
- [ ] **Tone matches** the audience specification from course-spec.json
- [ ] **No decorative emojis** — only functional callout markers (💡, ⚠️, 🎯, 📌, 💎)

### Interactive Elements Library

Include these reusable markdown components in the template:

```markdown
<!-- Collapsible deep-dives -->
<details>
<summary>深入了解：[Topic]</summary>
Detailed content...
</details>

<!-- Functional callout boxes (these are acceptable — they serve as visual category markers) -->
> 💡 **洞察**：Key insight
> ⚠️ **注意**：Warning / common mistake
> 🎯 **实战提示**：Practical tip
> 📌 **必学**：Essential concept
> 💎 **经典案例**：Timeless example

<!-- Comparison tables, Mermaid diagrams, etc. -->
```

---

## 5. Skill 3: `notes-to-web` — Interactive Web Building

### Purpose
Transform markdown notes into an interactive learning website, using **intelligent presentation selection** — the AI actively reasons about which UI component, illustration, or interactive element best serves each concept.

### The Core Intelligence: Adaptive Presentation

This is what makes this skill special. For EVERY piece of content, AI should reason:

```
Given this concept/content:
  - What is the nature of this knowledge? (fact, process, comparison, hierarchy, timeline, decision tree, etc.)
  - What presentation format would maximize understanding and retention?
  - What interactive element would make this engaging?
  - If I am a learner myself, how would I best visualize this concept so I could learn with best motivation and effficiency?

Then choose the best format:
  - A comparison → SideBySide component or comparison table
  - A process → Interactive flowchart or step-by-step accordion
  - A hierarchy → Mind map tree or nested cards
  - A timeline → Gantt chart or timeline component
  - Facts to memorize → Flashcard deck
  - Understanding to test → Quiz engine
  - A framework → Expandable concept cards with examples
  - A decision → Interactive decision tree
  - Key takeaways → TLDRCard with visual icons
  - Vocabulary → Flashcards with spaced repetition
  - A scenario → Interactive simulation or role-play prompt
  - Data/statistics → Chart or infographic
  - Before/after → Toggle comparison
  - Best practices → Checklist component
  - And so on, for all other content types...
```

**This reasoning should happen on the fly for every section of every note.** The AI should not apply a fixed template — it should think about what works best for THIS specific content.

### Human-in-the-Loop Requirements

1. **Scaffold-level questions:**
   - What tech stack? (recommend Next.js + Nextra, but ask)
   - What design style? (leverage ui-ux-pro-max skill if available)
   - Desktop-first or mobile-first? (recommend equal priority)
   - Dark mode support?
   - What's the primary color palette mood?

2. **Design system questions:**
   - **IMPORTANT:** If a UI/UX design skill (like `ui-ux-pro-max`) is available, USE IT to generate a proper design system. Search for installed skills.
   - If no design skill available, ask about: color palette, typography, visual style (glassmorphism, minimal, bento, etc.)
   - Ask about: Chinese typography optimization (line-height 1.75, Noto Sans SC) if target language is Chinese

3. **Per-page conversion questions:**
   - After analyzing a note's content, present the proposed component mapping:
     ```
     "For this lesson on 'Product Management Frameworks', I propose:
     - TL;DR section → TLDRCard component
     - Framework comparison → SideBySide with toggle
     - Decision process → Interactive flowchart
     - Terminology → Flashcard deck (12 cards)
     - Self-test → QuizEngine (4 questions)
     Does this look good? Any changes?"
     ```
   - Ask if any content deserves special treatment (hero visualization, animation, etc.)

4. **Component library questions:**
   - Which learning components should we build? (present recommended set)
   - Any custom components needed for this specific course content?
   - Should we include gamification? (streaks, achievements, progress rings)

### Leveraging Other Skills

The SKILL.md should instruct AI to:

1. **Search for and use installed skills** — especially:
   - UI/UX design skills (for design system generation)
   - Web best practices skills (for accessibility, performance)
   - Any relevant domain skills

2. **Use MCP tools if available** — especially:
   - Playwright for visual testing after building
   - Context7 for up-to-date framework documentation

3. **Search for best practices** — when making component choices, search the web or documentation for current best practices in:
   - EdTech UI patterns
   - Interactive learning component design
   - Accessibility for educational content
   - Mobile learning UX

### Sub-Commands

**`scaffold`** — Initialize the web project:
1. Read `.learning/course-spec.json`
2. Create project tech stack (or detect existing), ask users with explanation on each tech stach feature, let user decide which ones to use
3. Generate design system (use ui-ux-pro-max or any other skills related to UI/UX design if available)
4. Build component library for learning content
5. Set up routing structure matching course hierarchy
6. Set up progress tracking (localStorage)

**`convert`** — Transform notes to interactive pages:
1. Read each `docs/*.md` file
2. **For each section, reason about the best interactive presentation**
3. Convert to `.mdx` with appropriate React component wrappers
4. Generate `_meta.ts` navigation files
5. Present each conversion for human review

**`enhance`** — Add platform-level features:
1. Landing page with course overview
2. Learning dashboard with progress
3. Dark mode support
4. Search functionality
5. Mobile-optimized navigation
6. Optional: gamification (streaks, achievements)

### Component Library (Recommended Starting Set)

| Component | Purpose | Best For |
|-----------|---------|----------|
| `TLDRCard` | Summary with key points | Every lesson opening |
| `ConceptCard` | Expandable concept box | Definitions, key ideas |
| `QuizEngine` | Multiple choice with feedback | Knowledge testing |
| `Flashcards` | Swipeable term cards | Vocabulary, memorization |
| `MindMapTree` | Hierarchical visualization | Topic overviews |
| `BentoGrid` | Multi-column card layout | Feature overviews |
| `SideBySide` | Two-column comparison | A vs B comparisons |
| `Accordion` | Collapsible sections | Deep-dives, FAQs |
| `PracticeChecklist` | Interactive checkbox list | Action items |
| `Tabs` | Tabbed content switcher | Multiple perspectives |
| `TimeAllocation` | Visual time breakdown | Resource allocation |
| `ProgressRing` | Circular progress | Lesson/module progress |

**The AI should NOT be limited to this list.** If a concept would be better served by a component not in this list, create it on the fly.

---

## 6. Skill 4: `learning-audit` — Evaluation & Improvement

### Purpose
After a chunk of the website is built, audit the learning experience against expectations. Identify gaps between intended and actual UX. Fix issues and improve quality iteratively.

### When to Run

This skill runs **after Skill 3 produces output** — but the granularity is flexible. AI should ask the user:

- "At what granularity should I run audits?"
  - **Per part** — Audit after each lesson page is built (most thorough, slowest)
  - **Per module** — Audit after all lessons in a module are built (balanced)
  - **Per course** — Audit after an entire course is built (fastest, least granular)
  - **Custom** — User specifies when to audit

### Audit Dimensions

The evaluation covers these areas:

#### 1. Content Fidelity
- Does the interactive version preserve all knowledge from the markdown notes?
- Are any concepts lost, oversimplified, or distorted in the interactive conversion?
- Does the learning path remain intact and navigable?

#### 2. Presentation Quality
- Does each interactive component serve its content well? (e.g., is a quiz actually testing the right concepts?)
- Are there sections that would benefit from a DIFFERENT interactive format?
- Are there missed opportunities for interactivity? (e.g., a comparison presented as plain text that should be a SideBySide)
- Is any content over-engineered? (interactive for the sake of interactive, when plain text would be clearer)
- **IMPORTANT:** how does the current page looks as a whole? (Is it a complete learning unit with unified theme and style, or does any components look out of place in terms of layout and styling etc?)

#### 3. User Experience
- Is the page load reasonable?
- Does the layout make sense on both desktop and mobile?
- Is the reading flow natural? (Does the eye move logically through the content?)
- Are interactive elements discoverable? (Can users find and use quizzes, flashcards?)
- Does dark mode work correctly for all components?

#### 4. Learning Effectiveness
- Would a learner at the specified level (from course-spec.json) actually understand this?
- Are there knowledge gaps between lessons?
- Do quizzes test the right things at the right difficulty?
- Are practice tasks achievable and relevant?
- Does the flow motivate continued learning? (Is there a sense of progress?)

#### 5. Visual & Design Quality
- Does the design match the chosen style (from design system)?
- Are there visual inconsistencies between pages?
- Is typography readable (especially for Chinese text)?
- Are all Mermaid diagrams rendering correctly?
- Do interactive components have consistent styling?

### Audit Process

1. **Open each page** (using Playwright if available, or by reviewing code)
2. **Take screenshots** at key breakpoints (desktop, tablet, mobile). Here if too much work, then ask user for opinion of the granularity of the audit.
3. **Compare against expectations** from course-spec.json
4. **Generate an audit report** with:
   - Issues found (categorized by severity: critical, major, minor)
   - Specific file and line references for each issue
   - Recommended fixes
   - Opportunities for improvement
5. **Present the report to the user** and ask:
   - "Should I fix all issues automatically?"
   - "Should I fix only critical/major issues?"
   - "Should I present each fix for approval?"
6. **Apply fixes** based on user's choice
7. **Re-audit** the fixed pages to verify improvements

### Human-in-the-Loop Requirements

1. **Before auditing:**
   - Ask: "At what granularity should I audit?" (per part / per module / per course / custom)
   - Ask: "What matters most to you?" (content accuracy / visual polish / interactivity / mobile experience)
   - Ask: "Should I auto-fix issues or present each fix for approval?"

2. **During auditing:**
   - Present findings incrementally, not all at once
   - Show before/after for proposed fixes
   - Ask about ambiguous cases: "This comparison is currently plain text. Should I convert it to a SideBySide component, or is the current format fine?"

3. **After auditing:**
   - Summarize what was fixed and what remains
   - Ask: "Any areas you want me to look at more closely?"
   - Update the audit log for future sessions

### Audit Report Format

```markdown
# Learning Audit Report
## Scope: [Module 1 / Course 1 / etc.]
## Date: [date]

### Critical Issues (must fix)
- [ ] [Page: 01-pm-role] Quiz question 3 tests a concept not covered in the note
- [ ] [Page: 02-pm-skills] Flashcard deck is missing 4 terms from the terminology table

### Major Issues (should fix)
- [ ] [Page: 01-pm-role] The framework comparison is plain text — should be SideBySide component
- [ ] [Page: 03-methods] Mobile layout breaks at 375px — accordion overlaps sidebar

### Minor Issues (nice to fix)
- [ ] [Page: 01-pm-role] TLDRCard could use a more specific icon for point 3
- [ ] [Page: 02-pm-skills] Dark mode contrast is low on ConceptCard borders

### Opportunities
- [ ] [Page: 01-pm-role] The "PM daily schedule" section could be an interactive TimeAllocation component
- [ ] [Page: 03-methods] The decision tree in prose could become an interactive DecisionTree component

### Summary
- Pages audited: 3
- Critical: 2, Major: 2, Minor: 2, Opportunities: 2
- Recommended action: Fix critical and major, present opportunities for user decision
```

---

## 7. Main Orchestrator: `.claude/skills/learning-on-web/SKILL.md`

The top-level skill auto-activates and orchestrates the four sub-skills.

**Trigger words:** "build learning site", "transform course", "create learning platform", "course to website", "make interactive learning", "convert course content"

**Orchestration flow:**
```
User: "Transform this course into a learning website"

Step 1: course-analyze
  └── Interactive discovery of structure + audience + goals
  └── Output: .learning/course-spec.json + learning-brief.md

Step 2: course-to-notes
  └── Interactive generation of each note with human steering
  └── Notes oriented by audience/perspective/tone from course-spec.json
  └── Output: docs/ directory with all .md notes

Step 3: notes-to-web
  └── Scaffold → Convert (with intelligent component selection) → Enhance
  └── Output: web/ directory with interactive Next.js site

Step 4: learning-audit (runs after each chunk, per user-specified granularity)
  └── Audit content fidelity, UX, design, learning effectiveness
  └── Present issues + fixes → Apply with user approval
  └── Output: audit report + applied fixes
```

Each step should complete fully before moving to the next. The user can also invoke individual sub-skills independently.

**The audit loop:** Steps 3 and 4 form an iterative loop. After building a chunk (module/part/course), the audit runs, fixes are applied, and the next chunk begins. This ensures quality compounds rather than issues accumulating.

---

## 8. Non-Functional Requirements

- **Simplicity:** This is a starting point. No scripts, no databases, no CLI tools. Pure SKILL.md prompt instructions.
- **Composability:** Each sub-skill works independently. Users can run just `course-analyze`, or just `notes-to-web` on existing notes.
- **Interactivity:** Every sub-skill asks questions. Never assume. The human is always in the loop.
- **Intelligence:** The web building skill doesn't apply fixed templates — it reasons about optimal presentation per concept.
- **Extensibility:** The skill should reference and leverage other installed skills (UI/UX, web practices, etc.).
- **Quality:** Every output goes through a checklist before being finalized.
- **Commercial quality:** All generated content must pass the "human-written" test. No AI artifacts.

---

## 9. Example Session (What a Full Run Looks Like)

```
User: I have a data science course in ./materials/. Transform it into a learning website for Chinese junior developers.

AI (course-analyze):
  "I found 4 modules with 18 parts. Here's the structure:
   - Module 1: Python Basics (5 parts)
   - Module 2: Data Analysis with Pandas (4 parts)
   - Module 3: Machine Learning Fundamentals (5 parts)
   - Module 4: Deep Learning Introduction (4 parts)

   Target audience: Chinese junior developers
   Language: Chinese

   Questions:
   1. Should I bring a 'senior engineer' perspective to these notes?
   2. Should the notes assume Python knowledge or teach it from scratch?
   3. Any specific frameworks or tools you want emphasized?
   4. What tone do you prefer — conversational like a blog, or polished like a textbook?
   5. What quality bar — these should read like a commercial book chapter?"

User: "Senior engineer perspective, assume basic Python, emphasize scikit-learn and PyTorch, conversational blog tone, yes commercial quality"

AI: "Saved to .learning/course-spec.json. Ready for note generation."

AI (course-to-notes, Module 1 Part 1):
  "I've read the source for 'Introduction to Data Science'.
   Key concepts:
   - What is data science (definition, scope)
   - Data science vs data engineering vs ML engineering
   - The data science workflow

   Questions:
   1. Should I compare these roles from a Chinese tech company perspective (BAT, ByteDance)?
   2. The source doesn't cover MLOps — should I add a forward-looking section?
   3. How much emphasis on statistical foundations vs practical coding?"

User: "Yes Chinese companies, yes MLOps preview, lean practical"

AI: [generates note, presents for review — written in conversational senior engineer voice, no AI artifacts]

AI (notes-to-web, converting Module 1 Part 1):
  "For this lesson on 'Introduction to Data Science', I propose:
   - TL;DR → TLDRCard (5 key points)
   - Role comparison → SideBySide with 3 columns (DS vs DE vs MLE)
   - Data science workflow → Interactive flowchart with expandable steps
   - Chinese company examples → BentoGrid with company cards
   - MLOps preview → ConceptCard (collapsible)
   - Terminology → Flashcards (8 terms)
   - Self-test → QuizEngine (5 questions)

   Does this component mapping look good?"

User: "Perfect, proceed"

AI (learning-audit, after Module 1 complete):
  "Audit of Module 1 (5 pages):

   Critical:
   - Page 3: Quiz question 2 references a concept from Module 2 (not yet covered)

   Major:
   - Page 2: The Pandas operations comparison is plain text — proposing SideBySide
   - Page 4: Mobile layout breaks on the BentoGrid at 375px

   Opportunities:
   - Page 1: The 'day in the life of a data scientist' section could be a TimeAllocation

   Should I fix critical + major automatically, and show you the opportunity?"

User: "Fix all, show me the opportunity"

AI: [fixes issues, presents TimeAllocation mockup, continues to Module 2]
```

---

## 10. Success Criteria

The skill is successful when:
1. A user with zero setup can point it at any course folder and get an interactive website
2. Every step involves human confirmation — no black-box generation
3. The generated notes read as if written by a human expert — commercial publication quality
4. The web presentation intelligently adapts to content type (not one-size-fits-all)
5. The skill leverages other available skills for design and best practices
6. The audit loop catches and fixes quality issues before they accumulate
7. A first-time user can complete the full pipeline in one session with guidance
