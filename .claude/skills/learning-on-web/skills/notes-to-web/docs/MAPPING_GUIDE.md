# Component Mapping Guide

> Reference document for content classification and component selection. Loaded on-demand by the agent during Stage 2 of the convert pipeline.

## Intelligent Component Selection Algorithm

**Core Principle:** For EVERY section in a note, reason about which presentation format best serves learning. Do NOT default to plain markdown rendering.

---

## Step 1: Classify Content Type

Parse each markdown section (H2, H3) and classify its content type:

| Content Pattern | Classification | Component Candidates |
|----------------|---------------|---------------------|
| **2+ items with attributes** | Comparison | `SideBySide`, `ComparisonTable`, `TabbedComparison` |
| **Sequential steps (1→2→3)** | Process/Workflow | `Timeline`, `Stepper`, `AnimatedFlow`, `StepWizard` |
| **Term + definition list** | Definitions | `FlashcardDeck`, `AccordionGlossary`, `TerminologyDeck` |
| **Numbers, statistics** | Metrics | `NumberTicker`, `ProgressRings`, `AnimatedCounter`, `HeatMap` |
| **Code blocks** | Code | `SyntaxHighlighted` + Copy button, `CodePlayground` |
| **Multiple examples/cases** | Examples | `TabbedExamples`, `CardGrid`, `BentoGrid` |
| **Relationships/hierarchy** | Connections | `MermaidDiagram` (zoom/pan), `MindMapTree` |
| **Questions with answers** | Quiz/Assessment | `QuizEngine` with animated feedback |
| **Time-based data** | Timeline | `Timeline` with animated progress line |
| **Pros vs Cons** | Trade-off | `BeforeAfter` toggle, `SideBySide` with color coding |
| **Dense reference info** | Reference | `Accordion` for expand/collapse, `Tabs` for categories |

---

## Step 2: Apply Engagement Heuristics

For each classified section, enhance with engagement logic:

**High-value concepts** (marked as important in note or in TL;DR):
→ Make INTERACTIVE, require user action (click to reveal, hover to highlight, drag to reorder)

**Reference material** (terminology, appendix, detailed specs):
→ Make COLLAPSIBLE (accordion, tabs) — available but not cluttering main flow

**Practice content** (self-test, exercises, practice tasks):
→ Make GAMIFIED — points, instant feedback, streak mechanics, confetti on success

**Complex diagrams** (mind maps, flowcharts, architecture):
→ Add ANIMATED ENTRANCE (blur-fade, stagger), make zoomable/pannable

**Page entry points** (hero, first section):
→ MAXIMIZE IMPACT — bold typography, Magic UI animations (aurora-text, line-shadow-text)

---

## Classification Guidelines

| Content Nature | Best Presentation | Why | Advanced UI Level |
|---------------|------------------|-----|-------------------|
| Narrative/context/storytelling | ProseBlock with typography | Reading flow > interaction | Low (focus on beauty) |
| Key takeaways/summary | TLDRCard with icons | Quick scanning, visual hierarchy | Medium |
| Comparison (2+ items) | SideBySide, ComparisonTable | Visual separation aids pattern recognition | **HIGH** |
| Process/workflow (steps) | Timeline, Stepper, Flowchart | Sequential guidance | **HIGH** |
| Terms/definitions | FlashcardDeck, Glossary | Active recall > passive reading | **HIGH** |
| Facts to memorize | Flashcards with spaced rep | Engagement drives retention | **HIGH** |
| Self-test questions | QuizEngine with feedback | Gamification motivates | **HIGH** |
| Examples/cases | TabbedExamples, BentoGrid | Organization for multiple items | Medium |
| Code samples | SyntaxHighlighted + CodePlayground | Executable > static | Medium |
| Hierarchies/relationships | MindMapTree, MermaidDiagram | Visual > text description | Medium |

---

## Artifact Templates

### Stage 1 Output: `section-map.json`

Location: `.learning/mappings/[lesson-slug]-sections.json`

```json
{
  "file": "docs/course-1/c1-m1-p1.md",
  "lessonSlug": "c1-m1-p1",
  "extractedAt": "2024-01-15T10:30:00Z",
  "sections": [
    {
      "id": "tldr",
      "heading": "TL;DR",
      "level": 2,
      "contentPreview": "First 100 chars of content...",
      "wordCount": 45,
      "hasList": true,
      "listItemCount": 5,
      "hasCodeBlock": false,
      "hasMermaid": false
    },
    {
      "id": "pm-vs-engineering",
      "heading": "PM vs Engineering Mindset",
      "level": 2,
      "contentPreview": "Product managers focus on...",
      "wordCount": 280,
      "hasList": true,
      "listItemCount": 6,
      "hasCodeBlock": false,
      "hasMermaid": false,
      "detectedPattern": "comparison"
    },
    {
      "id": "key-terminology",
      "heading": "Key Terminology",
      "level": 2,
      "contentPreview": "| Term | Definition |...",
      "wordCount": 150,
      "hasList": false,
      "hasTable": true,
      "tableRows": 8,
      "detectedPattern": "definitions"
    }
  ]
}
```

### Stage 2 Output: `component-mapping.json`

Location: `.learning/mappings/[lesson-slug]-mapping.json`

```json
{
  "file": "docs/course-1/c1-m1-p1.md",
  "lessonSlug": "c1-m1-p1",
  "classifiedAt": "2024-01-15T10:35:00Z",
  "mappings": [
    {
      "sectionId": "tldr",
      "heading": "TL;DR",
      "contentType": "summary",
      "component": "TLDRCard",
      "rationale": "5 key takeaways need visual hierarchy with icons for quick scanning",
      "magicUI": ["blur-fade"],
      "designNotes": "Staggered entrance, icon per point, subtle gradient background"
    },
    {
      "sectionId": "context-intro",
      "heading": "Why This Matters",
      "contentType": "narrative",
      "component": "ProseBlock",
      "rationale": "Context-setting narrative flows best as beautiful typography — interaction would interrupt reading flow",
      "magicUI": ["blur-fade"],
      "designNotes": "Large leading (1.8), pull quote styling for key sentence, subtle left border accent"
    },
    {
      "sectionId": "pm-vs-engineering",
      "heading": "PM vs Engineering Mindset",
      "contentType": "comparison",
      "component": "SideBySide",
      "rationale": "Two perspectives DEMAND visual separation — this is exactly what SideBySide excels at",
      "magicUI": ["blur-fade", "text-animate"],
      "designNotes": "Color-coded columns (blue vs green), hover highlight, toggle between views"
    },
    {
      "sectionId": "key-terminology",
      "heading": "Key Terminology",
      "contentType": "definitions",
      "component": "FlashcardDeck",
      "rationale": "8 terms need active recall — passive reading won't make them stick",
      "magicUI": ["blur-fade"],
      "designNotes": "Physics-based flip, swipe on mobile, progress indicator (3/8)"
    },
    {
      "sectionId": "self-test",
      "heading": "Self-Test Questions",
      "contentType": "quiz",
      "component": "QuizEngine",
      "rationale": "Testing understanding requires immediate feedback and gamification",
      "magicUI": ["blur-fade", "confetti"],
      "designNotes": "Instant feedback, confetti on correct, gentle shake on wrong, explanation reveal"
    }
  ]
}
```

---

## Validation Rules

### Step 5: Validate Component Appropriateness

Before finalizing, check:

- ✅ **Serves the content:** Component enhances understanding, not decorative
- ✅ **Appropriate complexity:** Not over-engineered (accordion for 2 items = too much)
- ✅ **Performance:** Component doesn't slow page load (use `blur-fade` lazy loading if heavy)
- ✅ **Accessible:** Keyboard navigable, screen reader compatible
- ✅ **Cohesive:** Fits design system (colors, fonts, spacing)

**Red flags to avoid:**
- ❌ Using flashcards for < 3 terms (just use a simple table)
- ❌ Using interactive flowchart for linear 3-step process (timeline is simpler)
- ❌ Using quiz engine for 1 question (inline question with reveal is better)
- ❌ Using accordion for content that should always be visible

---

## Anti-Patterns (FORBIDDEN)

```
❌ FORBIDDEN: Building ANY page without component-mapping.json existing first
❌ FORBIDDEN: Defaulting to prose without explicitly REASONING about alternatives
❌ FORBIDDEN: Skipping user approval of component mapping
❌ FORBIDDEN: "Just rendering markdown" as the implementation strategy
❌ FORBIDDEN: Using plain <p>, <ul>, <ol> without intentional typography for prose sections
❌ FORBIDDEN: Rendering a comparison as bullet points when SideBySide would serve better
❌ FORBIDDEN: Rendering terminology as a static table when FlashcardDeck would aid retention
❌ FORBIDDEN: Rendering quiz questions as text when QuizEngine would provide feedback
```
