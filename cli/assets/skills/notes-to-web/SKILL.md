---
name: notes-to-web
description: "Transform markdown notes into an interactive, beautiful learning website. Uses intelligent presentation selection, design system generation, and MCP-powered components. Requires shadcn/ui MCP and Magic UI MCP. Trigger: build website, create web, notes to web, scaffold site, convert to interactive."
---

# Notes to Web — Interactive Web Building

## Purpose

Transform markdown notes into a stunning, interactive learning website. This skill is the core creative engine — it reasons about which UI component, illustration, or interactive element best serves each concept, then builds it with production-grade quality.

## When to Activate

- User asks to build the website, create web pages, or convert notes to interactive format
- The main orchestrator routes here as Phase 3
- `docs/` directory with markdown notes exists

---

## ⚠️ REQUIRED: MCP Server Setup

This skill REQUIRES the following MCP servers for production-quality output. Check availability before proceeding. If not found, guide the user through installation:

### shadcn/ui MCP (Required)
Provides real-time access to the component registry with accurate TypeScript props and React component data.

```bash
# For Claude Code:
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp

# Verify: run /mcp and check for "shadcn" in the list
```

**Why required:** Without this, the agent hallucinates component APIs. With it, every component uses correct, current props and patterns.

### Magic UI MCP (Required)
Provides 50+ animated components: blur-fade, orbiting-circles, text-animate, bento-grid, dock, marquee, and more.

```bash
# Add to project .mcp.json or Claude settings:
{
  "mcpServers": {
    "magicui": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

**Why required:** This transforms static pages into engaging, animated learning experiences. Flashcards flip, text reveals, progress rings animate, content fades in.

### Playwright MCP (Recommended)
For visual testing and screenshot comparison. Use it to verify pages look correct.

### Figma MCP (Optional)
If the user has Figma designs to implement.

**STOP HERE if shadcn/ui MCP or Magic UI MCP is not available.** Guide the user through installation. Do not proceed with generic components.

---

## Design Thinking: Anti-AI-Slop Protocol

Before writing ANY code, commit to a **BOLD aesthetic direction**. AI coding agents converge on "AI slop" — this skill exists to prevent that.

### NEVER Use:
- **Fonts:** Inter, Roboto, Arial, system fonts, or any font that screams "default"
- **Colors:** Purple gradients on white backgrounds, generic blue (#007bff), teal-and-white
- **Layouts:** Symmetric card grids, cookie-cutter hero sections, predictable 3-column features
- **Patterns:** Generic "AI-generated" aesthetics — if it looks like every other AI-built site, it has failed

### ALWAYS Do:
- **Typography:** Choose distinctive, characterful fonts. Pair a bold display font with a refined body font. For Chinese text: optimize line-height (1.75), use high-quality Chinese fonts (Noto Sans SC, LXGW WenKai, Source Han Sans)
- **Color:** Commit to a cohesive palette. Dominant color with sharp accents outperforms timid, evenly-distributed palettes. Use CSS variables for consistency
- **Motion:** Purposeful animations at high-impact moments. One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions. Use Magic UI components for this
- **Spatial Composition:** Unexpected layouts, asymmetry, generous negative space OR controlled density, grid-breaking elements where appropriate
- **Backgrounds:** Atmosphere and depth — gradient meshes, noise textures, geometric patterns, layered transparencies. Not flat white

### The Screenshot Test
For every page, ask: **"Would someone screenshot this and share it?"** If no, redesign.

---

## 3-Layer Design Quality System

### Layer 1: Embedded Design Principles (Always Available)

These rules apply regardless of what tools are installed:

#### Educational UI Patterns

For each learning component, reason about three dimensions:

**ENGAGEMENT — Does this make the learner want to interact?**
- Flashcards MUST have physics-based flip animations, not instant toggles
- Quizzes MUST have satisfying correct/wrong feedback (confetti for correct, gentle shake for wrong, color transitions)
- Progress MUST feel rewarding (animated rings, streak counters, milestone celebrations)
- Page load MUST have orchestrated reveal (staggered fade-in, blur-fade for content sections)
- Hover states MUST surprise and delight (scale, glow, shadow lift)

**CLARITY — Does the visual design serve the content?**
- Concept cards MUST breathe (generous padding, clear typographic hierarchy, subtle borders)
- Comparisons MUST be scannable (aligned columns, color-coded sides, clear labels)
- Flowcharts MUST guide the eye (animated path drawing, highlighted current step)
- Code examples MUST be syntax-highlighted with copy buttons
- TL;DR sections MUST be visually distinct (different background, icon markers, border treatment)

**DISTINCTIVENESS — Would someone screenshot this?**
- Each page SHOULD have a unique visual identity within the design system
- Hero sections MUST be bold and memorable (not generic gradient + centered text)
- Typography MUST be intentional — use scale, weight, and spacing to create hierarchy
- At least ONE element per page should be unexpected or delightful

#### Reference Designs (Study These Patterns)

| Platform | What to Learn |
|----------|--------------|
| **Duolingo** | Gamification, streak mechanics, bite-sized progression, reward animations |
| **Codecademy** | Clean developer-environment feel, inline code editors, real-time feedback |
| **Khan Academy** | Content-first clarity, minimal visual clutter, mastery-based progression |
| **Brilliant.org** | Interactive explorations, visual explanations, problem-solving focus |
| **TED-Ed** | Visual storytelling, making abstract concepts concrete |

### Layer 2: Skill Discovery (Use If Installed)

Before scaffolding, search for installed design skills:

1. **Check for ui-ux-pro-max:** Look in `.claude/skills/`, `.cursor/commands/`, `.shared/`
   - If found: Use its design system generator (`python3 search.py "[course topic]" --design-system -p "[Project Name]"`)
   - This provides: industry-specific color palette, font pairing, UI style, landing page pattern, anti-patterns

2. **Check for frontend-design skill:** Look in `.claude/skills/`
   - If found: Follow its bold aesthetic direction principles
   - This provides: creative typography choices, spatial composition rules, motion guidelines

3. **Check for any other UI/design skills:** Search `.claude/skills/` and `.shared/`
   - Leverage whatever design intelligence is available

4. **If no design skills found:** Use Layer 1 embedded principles + ask user about aesthetic preferences

### Layer 3: MCP-Powered Components (Required)

#### Using shadcn/ui MCP

When building components, ALWAYS query the shadcn/ui MCP for:
- Correct component imports and props
- Latest component patterns
- Proper TypeScript types
- Theme integration patterns

Example workflow:
```
1. Identify needed component (e.g., Accordion for collapsible sections)
2. Query shadcn MCP: "accordion component usage"
3. Get real, current API — not hallucinated props
4. Implement with correct patterns
```

#### Using Magic UI MCP

For every page, identify at least 3 opportunities for Magic UI components:

| Content Pattern | Magic UI Component | Effect |
|----------------|-------------------|--------|
| Page load | `blur-fade` | Content sections fade in with blur-to-sharp effect |
| Section titles | `text-animate` or `aurora-text` | Text reveals with character-by-character or glow animation |
| Key metrics/numbers | `number-ticker` | Numbers count up when scrolled into view |
| Feature overviews | `bento-grid` | Multi-column responsive card layout |
| Logo/tool sections | `marquee` | Smooth scrolling horizontal display |
| Progress indicators | `animated-circular-progress-bar` | Satisfying fill animation |
| Navigation | `dock` | macOS-style dock for lesson navigation |
| Hero text | `line-shadow-text` or `morphing-text` | Bold, memorable headlines |
| Background | `dot-pattern` or `grid-pattern` | Subtle atmospheric patterns |
| Content reveal | `box-reveal` | Sections revealed with animated box wipe |

**CRITICAL:** Query the Magic UI MCP before using any component to get correct, current implementation code.

---

## Sub-Commands

### `scaffold` — Initialize the Web Project

1. **Read `.learning/course-spec.json`** — understand course structure, audience, language
2. **Check MCP availability** — verify shadcn/ui and Magic UI MCPs are accessible. If not, guide installation and STOP
3. **Present aesthetic options to user:**

   Present 3-4 aesthetic directions with vivid descriptions:

   ```
   Choose a design direction for your learning site:

   1. 📰 EDITORIAL
      Clean, magazine-like. Generous whitespace, serif display headings,
      sophisticated color palette. Think: premium online publication.
      Best for: academic courses, professional development.

   2. 🎮 INTERACTIVE PLAYGROUND
      Bold, playful, gamified. Vibrant colors, rounded elements,
      achievement badges, progress streaks. Think: Duolingo meets Notion.
      Best for: beginner courses, language learning, broad audiences.

   3. 🖥️ DEVELOPER STUDIO
      Dark-mode-first, monospace accents, code-editor-inspired panels,
      terminal aesthetics with syntax-highlighted everything. Think: Codecademy.
      Best for: programming, DevOps, engineering courses.

   4. 🌿 CALM FOCUS
      Warm, earthy tones. Soft shadows, natural textures, slow animations,
      reading-optimized typography. Think: Headspace meets Medium.
      Best for: soft skills, wellness, creative courses.
   ```

   User picks one, or describes a custom direction.

4. **Generate design system:**
   - If ui-ux-pro-max is installed, use its design system generator
   - Otherwise, generate based on chosen aesthetic:
     - Color palette (primary, secondary, accent, background, text) as CSS variables
     - Font pairing (display + body) with Google Fonts link
     - Spacing scale (4px base)
     - Border radius scale
     - Shadow scale
     - Animation timing functions
   - Save to `web/design-system/DESIGN.md`

5. **Scaffold Next.js + Nextra project:**
   ```bash
   npx create-next-app@latest web --typescript --tailwind --app
   cd web && npm install nextra nextra-theme-docs
   ```
   - Set up `next.config.mjs` with Nextra
   - Configure `theme.config.tsx` with course metadata from course-spec.json
   - Set up `tailwind.config.ts` with design system colors/fonts
   - Create `globals.css` with CSS variables from design system

6. **Build component library:**
   - Query shadcn MCP for base components (Button, Card, Accordion, Tabs, Badge)
   - Query Magic UI MCP for animation components (blur-fade, text-animate, number-ticker)
   - Create learning-specific components:
     - `TLDRCard` — Summary with key points and icon markers
     - `ConceptCard` — Expandable concept box with hover effects
     - `QuizEngine` — Multiple choice with animated feedback (confetti/shake)
     - `Flashcards` — Physics-based flip animation, swipe navigation
     - `MindMapTree` — Interactive hierarchical visualization
     - `BentoGrid` — Multi-column card layout (from Magic UI)
     - `SideBySide` — Two-column comparison with toggle
     - `PracticeChecklist` — Interactive checkbox list with progress
     - `ProgressRing` — Animated circular progress (from Magic UI)
     - `TerminologyDeck` — Flashcard-style term review
   - Save to `web/components/learning/`

7. **Set up routing** matching course hierarchy from course-spec.json
8. **Set up progress tracking** using localStorage
9. **Update task file** and PROGRESS.md

### `convert` — Transform Notes to Interactive Pages

For EACH note in `docs/`:

1. **Read the markdown note**
2. **Analyze every section** — for each section, reason about the best interactive presentation:

   ```
   Section: "Product Management vs. Engineering Management"
   Nature: comparison between two roles
   Best format: SideBySide component with toggle between perspectives
   Why: Learners need to see differences AND similarities. Side-by-side
   with color coding makes pattern recognition instant.

   Section: "The PM Decision Framework"
   Nature: sequential decision process with branches
   Best format: Interactive flowchart with expandable steps
   Why: Prose description of a process is hard to follow. A visual flowchart
   with clickable nodes lets learners trace decision paths.

   Section: "Key Terminology"
   Nature: vocabulary list (12 terms)
   Best format: Flashcard deck (TerminologyDeck component)
   Why: Passive reading of term definitions doesn't stick. Active recall
   through flashcards with flip animation creates engagement.
   ```

3. **Present proposed component mapping to user:**
   ```
   For "Lesson 1: Introduction to PM", I propose:
   - TL;DR → TLDRCard (5 key points with icons)
   - Role comparison → SideBySide with color-coded columns
   - Decision framework → Interactive flowchart with expandable nodes
   - Daily workflow → TimeAllocation with animated pie chart
   - Terminology (12 terms) → TerminologyDeck with flip cards
   - Self-test (4 questions) → QuizEngine with confetti feedback
   - Mind map → MindMapTree with zoom/pan

   Does this mapping look right? Any sections that deserve different treatment?
   ```

4. **Convert to `.mdx`** with React component wrappers
5. **Generate `_meta.ts`** navigation files
6. **Apply Magic UI animations:**
   - Page-level: blur-fade entrance for content sections
   - Section titles: text-animate reveal
   - Numbers/statistics: number-ticker count-up
   - Background: subtle dot-pattern or grid-pattern
7. **Present converted page for review** (use Playwright MCP to screenshot if available)
8. **Update task file** with per-page status

### `enhance` — Add Platform-Level Features

1. **Landing page** with course overview, hero section (use bold Magic UI text effects), module cards
2. **Learning dashboard** with overall progress (animated progress rings), recent activity, streaks
3. **Dark mode** support with proper color tokens for all components
4. **Search functionality** (Nextra built-in or custom)
5. **Mobile-optimized navigation** with gesture support where appropriate
6. **Gamification (optional, ask user):**
   - Streak counter (days in a row)
   - Lesson completion badges
   - Module certificates
   - Progress milestones with celebration animations

---

## Component Design Rules

### Every Component Must:
1. **Respect the design system** — use CSS variables, not hardcoded colors
2. **Support dark mode** — both themes must look intentional, not just inverted
3. **Be responsive** — work on mobile (375px) through desktop (1440px)
4. **Have motion** — entrance animation, hover state, interaction feedback
5. **Be accessible** — keyboard navigable, screen-reader compatible, sufficient contrast

### Component Quality Checklist:
- [ ] Uses design system colors/fonts/spacing (CSS variables)
- [ ] Dark mode looks intentional (not just inverted colors)
- [ ] Mobile layout works at 375px
- [ ] Has entrance animation (blur-fade, slide, or fade)
- [ ] Hover states provide feedback
- [ ] Interactive elements have clear affordances
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] No layout shifts during animations

---

## The AI Should NOT Be Limited

The component library above is a starting set. If a concept would be better served by a component not in the list:

1. Describe what component would work best
2. Check Magic UI MCP for similar components
3. Check shadcn MCP for base components to build on
4. Create a custom component following the design system
5. Present it to the user before implementation

Examples of on-the-fly components:
- **Timeline** for historical progression
- **DecisionTree** for branching logic
- **CodePlayground** for executable examples
- **BeforeAfter** for toggle comparisons
- **HeatMap** for data visualization
- **Kanban** for workflow visualization
- **StepWizard** for guided processes

---

## Pre-Delivery Checklist (Per Page)

Before marking any page as complete:

### Visual Quality
- [ ] Font pairing is distinctive (NOT Inter, Roboto, Arial)
- [ ] Color palette is cohesive and committed
- [ ] Generous whitespace OR intentional density
- [ ] At least one "screenshot-worthy" element
- [ ] Dark mode looks good (not just "not broken")

### Interaction Quality
- [ ] Page load has orchestrated entrance (staggered blur-fade)
- [ ] Interactive elements have hover/focus states
- [ ] Animations are smooth (no jank, no layout shift)
- [ ] Mobile touch targets are 44px minimum

### Content Quality
- [ ] All note content is preserved (no information lost)
- [ ] Component choices serve the content (not decorative)
- [ ] Navigation is clear (breadcrumbs, next/prev, sidebar)
- [ ] Progress tracking works

### Technical Quality
- [ ] No console errors
- [ ] Images optimized
- [ ] Lighthouse performance score > 85
- [ ] Accessible (WCAG 2.1 AA)

---

## Task File Maintenance

Maintain `.learning/tasks/notes-to-web.task.md`:

```markdown
# notes-to-web Task State

## Status: in-progress
## Current Sub-Command: convert
## Last Updated: [timestamp]

## Design System
- Aesthetic: Editorial
- Fonts: Playfair Display + Source Sans Pro
- Primary: #1a365d
- Saved to: web/design-system/DESIGN.md

## Scaffold
- [x] Next.js + Nextra initialized
- [x] Design system applied
- [x] Component library created (12 components)
- [x] Routing set up

## Conversion Progress
### Module 1: [Name]
- [x] Part 1: web/pages/m01/01-intro.mdx ✅ reviewed
- [x] Part 2: web/pages/m01/02-basics.mdx ✅ reviewed
- [ ] Part 3: web/pages/m01/03-advanced.mdx 🔄 in-progress

### Module 2: [Name]
- [ ] Part 1 ⏳ pending

## Enhancement
- [ ] Landing page
- [ ] Dashboard
- [ ] Dark mode
- [ ] Search
- [ ] Mobile nav
- [ ] Gamification (user declined)

## Component Mapping Log
- Part 1: TLDRCard, SideBySide, QuizEngine(5q), Flashcards(8)
- Part 2: TLDRCard, InteractiveFlowchart, ConceptCard(3), MindMapTree
```

---

## Resumption

If `.learning/tasks/notes-to-web.task.md` exists:
1. Read it to find current sub-command and last completed item
2. Load design system from `web/design-system/DESIGN.md`
3. Present status: "Scaffold complete. Converting pages: 5/18 done. Currently on Module 2, Part 1."
4. Ask: "Continue from where we left off?"
5. Resume from the next incomplete item
