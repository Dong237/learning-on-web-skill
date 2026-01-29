# Component Specifications Guide

> Reference document for learning component specifications. Loaded on-demand by the agent when building components.

## "Go All Out" — Minimum Standards for Advanced UI

For content that DEMANDS interactive UI (comparisons, processes, terminology, quizzes), the bar is HIGH. These are not optional enhancements — they're the minimum standard.

**The test:** Would a user WANT to interact with this? Would they screenshot it and share it?

---

## SideBySide / ComparisonTable (for comparisons)

**Required features:**
- Color-coded columns (e.g., blue vs green, not just left/right)
- Animated entrance (blur-fade with stagger)
- Hover highlight to emphasize differences
- Clear column labels with distinct styling
- Visual icons or badges for each item

**Enhanced features (when appropriate):**
- Toggle between different comparison views
- Expandable details per item
- "Winner" badge for clear superiority
- Animated connecting lines between related items

```
┌─────────────────────┬─────────────────────┐
│  🔵 PM Mindset      │  🟢 Eng Mindset     │
├─────────────────────┼─────────────────────┤
│  Focus on WHAT      │  Focus on HOW       │  ← hover highlights row
│  User problems      │  Technical problems │
│  Stakeholders       │  Code quality       │
└─────────────────────┴─────────────────────┘
```

---

## Timeline / Stepper (for processes)

**Required features:**
- Animated progress line connecting steps (draws as user scrolls)
- Clickable step indicators
- Expandable step details
- Current step highlighting
- Smooth scroll-to on navigation

**Enhanced features:**
- Completion state tracking (persistent)
- Time estimates per step
- Branching paths for decision points
- "You are here" indicator

```
○───────●───────○───────○───────○
│       │       │       │       │
Step 1  Step 2  Step 3  Step 4  Step 5
        ↑
    [CURRENT]
    "Define user problem"
    Expand for details ▼
```

---

## FlashcardDeck / TerminologyDeck (for definitions)

**Required features:**
- Physics-based flip animation (not instant toggle)
- Swipe gestures on mobile (left/right to navigate)
- Progress indicator (e.g., "3/12 cards")
- Keyboard navigation (space to flip, arrows to navigate)

**Enhanced features:**
- Shuffle/reset controls
- "Mark as known" to skip mastered cards
- Spaced repetition algorithm
- Audio pronunciation (if applicable)
- Two-sided design (term on front, definition on back)

```
┌─────────────────────────┐
│                         │
│    📚 TERM              │
│                         │
│    "Sprint Backlog"     │
│                         │
│    [Tap to flip]        │
│                         │
│         3/12            │
│       ← ● ● ● →         │
└─────────────────────────┘
```

---

## QuizEngine (for self-tests)

**Required features:**
- Instant feedback with color transitions (green/red)
- Confetti burst on correct answers
- Gentle shake animation on wrong answers
- Explanation reveal after answering
- Score tracking with animated counter

**Enhanced features:**
- Progress bar showing quiz completion
- "Try again" option without penalty
- Difficulty indicators per question
- Time tracking (optional)
- Share score functionality

```
Q3/5: What is the primary goal of a PM?

  ○ A) Write code faster
  ● B) Solve user problems  ← selected
  ○ C) Manage engineers
  ○ D) Create documentation

  [Submit Answer]

  ✅ Correct! +10 points 🎉
  "PMs focus on understanding and solving user problems..."

  [Next Question →]
```

---

## TLDRCard (for key takeaways)

**Required features:**
- Visual icon for each point (not decorative emojis)
- Staggered entrance animation
- Clear visual hierarchy (numbering or bullets)
- Subtle gradient or pattern background
- Distinct from surrounding content

**Enhanced features:**
- Copy-to-clipboard for sharing
- Collapsible for returning visitors
- "Add to notes" functionality
- Print-friendly styling

```
┌─────────────────────────────────────────┐
│  📌 KEY TAKEAWAYS                       │
│─────────────────────────────────────────│
│  1. PMs own the "what" and "why"        │
│  2. Engineers own the "how"             │
│  3. Collaboration > handoffs            │
│  4. User problems drive priorities      │
│  5. Data informs, intuition decides     │
│                                         │
│                        [Copy] [Share]   │
└─────────────────────────────────────────┘
```

---

## ProseBlock (for narrative content)

Even when prose is the right choice, it must be INTENTIONALLY DESIGNED:

**Required features:**
- Large line-height (1.75-1.8 for body text)
- Elegant font pairing (display + body)
- Pull quote styling for key sentences
- Subtle visual distinction (background, border, or spacing)
- Comfortable reading width (65-75 characters)

**Enhanced features:**
- Drop cap for opening paragraph
- Marginal notes or annotations
- Highlight-on-hover for key phrases
- "Read time" indicator

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  W  hy does this matter? Product management is the      │
│     discipline of understanding what users truly need   │
│  — not what they say they want — and translating that   │
│  understanding into solutions that create value.        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  "The best PMs are not feature factories.       │   │
│  │   They are problem hunters."                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  This requires a unique blend of empathy, analytical    │
│  thinking, and communication skills...                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

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

### Examples of on-the-fly components:
- **Timeline** for historical progression
- **DecisionTree** for branching logic
- **CodePlayground** for executable examples
- **BeforeAfter** for toggle comparisons
- **HeatMap** for data visualization
- **Kanban** for workflow visualization
- **StepWizard** for guided processes
