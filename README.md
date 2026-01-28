# Learning on Web

Transform **any course content** into an interactive, beautiful learning website through an AI-assisted, human-in-the-loop pipeline.

## What It Does

Point it at a course folder → get an interactive learning website.

The skill operates in 4 composable phases:

| Phase | Skill | What It Does |
|-------|-------|-------------|
| 1 | **Analyze** | Discover course structure, audience, goals → `course-spec.json` |
| 2 | **Transform** | Generate value-added learning notes (not summaries) |
| 3 | **Build** | Create interactive website with intelligent component selection |
| 4 | **Evaluate** | Audit quality, find gaps, fix issues iteratively |

## Key Features

- **Human-in-the-loop** — Every phase asks questions, never assumes
- **Session persistence** — Interrupt anytime; `.learning/PROGRESS.md` tracks exact state
- **Intelligent presentation** — AI reasons per-concept: comparison → SideBySide, process → flowchart, terms → flashcards
- **Anti-AI-slop** — Built-in design principles prevent generic "AI-generated" aesthetics
- **Beautiful output** — Requires shadcn/ui MCP + Magic UI MCP for production-quality components
- **Multi-platform** — Works with Claude Code, Cursor, Windsurf, and 11 other AI assistants

## Installation

### Via npm (recommended)

```bash
npm install -g learn-web-cli
cd your-project
learn-web init --ai claude
```

Supported platforms:
```bash
learn-web init --ai claude          # Claude Code
learn-web init --ai cursor          # Cursor
learn-web init --ai windsurf        # Windsurf
learn-web init --ai codex           # Codex CLI
learn-web init --ai copilot         # GitHub Copilot
learn-web init --ai all             # All 14 platforms
```

### Required MCP Servers

Phase 3 (web building) requires these MCP servers:

**shadcn/ui MCP** — Accurate component implementation
```bash
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp
```

**Magic UI MCP** — 50+ animated components
```json
// Add to .mcp.json
{
  "mcpServers": {
    "magicui": {
      "command": "npx",
      "args": ["-y", "@magicuidesign/mcp@latest"]
    }
  }
}
```

### Manual Installation (Claude Code)

```bash
git clone https://github.com/Dong237/learning-on-web-skill.git
mkdir -p your-project/.claude/skills
cp -r learning-on-web-skill/.claude/skills/learning-on-web your-project/.claude/skills/
```

## Usage

### Full Pipeline

```
You: Transform the course in ./materials/ into a learning website for Chinese junior developers.

AI (Phase 1 — Analyze):
  "I found 4 modules with 18 parts. Here's the structure...
   Who is the audience? What perspective should I bring?
   What depth? What tone?"

You: Senior engineer perspective, conversational blog tone, commercial quality.

AI (Phase 2 — Notes):
  "For Module 1 Part 1, key concepts are: [list].
   What should I emphasize? Any examples to include?"

You: Emphasize practical examples, use Chinese tech companies.

AI (Phase 3 — Build):
  "Choose a design direction:
   1. Editorial — magazine-like, sophisticated
   2. Interactive Playground — gamified, vibrant
   3. Developer Studio — dark-mode, code-editor feel
   4. Calm Focus — warm, reading-optimized"

You: Developer Studio.

AI: "For this lesson, I propose:
   - TL;DR → TLDRCard
   - Role comparison → SideBySide with color columns
   - Workflow → Interactive flowchart
   - Terms → Flashcard deck with flip animation
   - Quiz → QuizEngine with confetti feedback
   Does this look right?"

AI (Phase 4 — Audit):
  "Audit of Module 1:
   Critical: Quiz Q3 references uncovered concept
   Major: Mobile layout breaks at 375px
   Opportunity: Daily schedule → TimeAllocation component
   Fix all automatically?"
```

### Individual Phases

Each phase can run independently:

```
You: Analyze the course in ./materials/
You: Generate notes for module 2
You: Build the website from existing notes
You: Audit the learning site
```

### Session Resumption

Interrupt anytime — progress is saved:

```
You: Transform this course into a website.

[... work through 8 of 18 notes, then close session ...]

[Next session]
You: Continue the learning website.

AI: "Found existing project! 8/18 notes complete.
     Currently on Module 2, Part 4. Continue?"
```

## How It Works

### Session Persistence

All state lives in `.learning/`:

```
.learning/
├── course-spec.json          # Audience, goals, structure (Phase 1)
├── learning-brief.md         # Human-readable summary
├── PROGRESS.md               # Pipeline state (which phase, which item)
└── tasks/
    ├── course-analyze.task.md
    ├── course-to-notes.task.md
    ├── notes-to-web.task.md
    └── learning-audit.task.md
```

### Design Quality (3-Layer System)

| Layer | Always Available | Conditional |
|-------|-----------------|-------------|
| **1. Embedded Principles** | Anti-AI-slop rules, EdTech patterns, Anthropic's frontend-design principles | Always |
| **2. Skill Discovery** | — | Uses ui-ux-pro-max, frontend-design if installed |
| **3. MCP Tools** | — | shadcn/ui (required), Magic UI (required), Playwright, Figma |

### Batch Modes

Control interaction density:

| Mode | When | Questions |
|------|------|-----------|
| **Verbose** | First use, critical content | Per note |
| **Module** | Balanced (default) | Per module |
| **Auto** | Large courses, trust the skill | Only exceptions |

## Tech Stack

Default output: **Next.js + Nextra** with:
- shadcn/ui components (via MCP)
- Magic UI animated components (via MCP)
- Tailwind CSS with design system tokens
- Dark mode support
- localStorage progress tracking

## License

MIT
