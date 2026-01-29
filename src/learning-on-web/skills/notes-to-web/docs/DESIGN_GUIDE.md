# Design System Guide

> Reference document for design principles and visual quality standards. Loaded on-demand by the agent during scaffold and build phases.

## Anti-AI-Slop Protocol

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

## Aesthetic Directions

When scaffolding, present these options to the user:

### 1. Editorial
Clean, magazine-like. Generous whitespace, serif display headings, sophisticated color palette.
**Think:** premium online publication
**Best for:** academic courses, professional development

### 2. Interactive Playground
Bold, playful, gamified. Vibrant colors, rounded elements, achievement badges, progress streaks.
**Think:** Duolingo meets Notion
**Best for:** beginner courses, language learning, broad audiences

### 3. Developer Studio
Dark-mode-first, monospace accents, code-editor-inspired panels, terminal aesthetics with syntax-highlighted everything.
**Think:** Codecademy
**Best for:** programming, DevOps, engineering courses

### 4. Calm Focus
Warm, earthy tones. Soft shadows, natural textures, slow animations, reading-optimized typography.
**Think:** Headspace meets Medium
**Best for:** soft skills, wellness, creative courses
