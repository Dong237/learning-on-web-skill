# Claude Marketplace Submission Guide

## Submission Form

**Submit your plugin here:** https://clau.de/plugin-directory-submission

## Plugin Information (Pre-filled for easy submission)

### Basic Information

- **Plugin Name:** learning-on-web
- **Display Name:** Learning on Web
- **Version:** 1.0.0
- **Author:** Dong237
- **License:** MIT

### Description

Transform any course content into an interactive learning website. 4-phase AI-assisted pipeline: Analyze → Notes → Web → Audit. Human-in-the-loop at every step.

### Full Description

Transform **any course content** (videos, transcripts, PDFs, slides) into an interactive, beautiful learning website through an AI-assisted, human-in-the-loop pipeline.

The skill operates in 4 composable phases:

1. **Analyze** — Interactively discover course structure, audience, goals → outputs course-spec.json
2. **Transform** — Generate commercial-grade learning notes (NOT summaries) → outputs markdown notes
3. **Build** — Create interactive Next.js + Nextra website with intelligent component selection → outputs web/
4. **Audit** — 5-dimension quality evaluation + iterative fixes → outputs audit reports

**Key Features:**
- Human-in-the-loop at every decision point
- Session persistence (interrupt anytime, resume perfectly)
- Anti-AI-slop design principles
- Intelligent component selection (comparisons → SideBySide, workflows → flowcharts, terms → flashcards)
- 3-layer design quality system

**Required:** shadcn/ui MCP + Magic UI MCP for Phase 3 (web building)

### Keywords

learning, education, interactive, course, website, edtech, notes, web-building, next.js, nextra

### Category

education

### Repository

https://github.com/Dong237/learning-on-web-skill

### Homepage

https://github.com/Dong237/learning-on-web-skill

### npm Package (after publishing)

learn-web-cli

**Installation command:**
```bash
npm install -g learn-web-cli
learn-web init --ai claude
```

### Plugin Location in Repository

`.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`

### Skills Directory

`.claude/skills/learning-on-web/`

### Documentation

- **README:** https://github.com/Dong237/learning-on-web-skill/blob/main/README.md
- **Developer Guide:** https://github.com/Dong237/learning-on-web-skill/blob/main/CLAUDE.md
- **Requirements:** https://github.com/Dong237/learning-on-web-skill/blob/main/REQUIREMENTS.md

### Dependencies

**Required MCP Servers:**
- shadcn/ui MCP: `claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp`
- Magic UI MCP: Add to `.mcp.json`:
  ```json
  {
    "mcpServers": {
      "magicui": {
        "command": "npx",
        "args": ["-y", "@magicuidesign/mcp@latest"]
      }
    }
  }
  ```

**Optional MCP Servers:**
- Playwright MCP (for Phase 4 visual testing)
- Figma MCP (if you have designs to reference)

### Usage Example

**Trigger phrases:**
- "build learning site"
- "transform course"
- "create learning platform"
- "course to website"
- "make interactive learning"
- "convert course content"

**Example workflow:**
```
User: Transform the course in ./materials/ into a learning website for junior developers.

AI (Phase 1): I found 4 modules with 18 parts. Who is the audience? What perspective?

User: Senior engineer perspective, conversational tone, commercial quality.

AI (Phase 2): For Module 1 Part 1, key concepts are: [list]. What should I emphasize?

User: Emphasize practical examples, use modern frameworks.

AI (Phase 3): Choose design direction: Editorial, Interactive Playground, Developer Studio, or Calm Focus?

User: Developer Studio.

AI: For this lesson, I propose: TL;DR → TLDRCard, Comparison → SideBySide, Process → Flowchart. Does this look right?

User: Yes.

AI (Phase 4): Audit found: Critical issues fixed, Major issues resolved. Re-audit passed.
```

### Multi-Platform Support

The CLI installer supports 14 AI coding assistants:
- Claude Code
- Cursor
- Windsurf
- GitHub Copilot
- Kiro
- Codex
- RooCode
- Qoder
- Gemini
- Trae
- OpenCode
- Continue
- CodeBuddy
- AntiGravity

### Quality Standards

**Design Quality (3-Layer System):**
1. Embedded principles (anti-AI-slop rules, educational patterns)
2. Skill discovery (uses ui-ux-pro-max, frontend-design if installed)
3. MCP tools (shadcn/ui, Magic UI)

**Content Quality:**
- Commercial publication grade notes
- Explicit rejection of AI writing markers
- Human expert perspective per course-spec.json

**Technical Quality:**
- Session persistence with perfect resumption
- Error handling and graceful degradation
- Build-audit iterative quality loop

---

## Submission Checklist

Before submitting, verify:

- [ ] Repository is public and accessible
- [ ] `.claude-plugin/plugin.json` is properly configured
- [ ] `.claude-plugin/marketplace.json` is properly configured
- [ ] README.md has clear installation and usage instructions
- [ ] All skill files are present in `.claude/skills/learning-on-web/`
- [ ] npm package is published (or mark as upcoming)
- [ ] MCP dependencies are documented
- [ ] License file is present (MIT)

---

## After Submission

1. **Wait for review:** Anthropic reviews for quality and security standards
2. **Check email:** You'll receive notification about approval status
3. **Upon approval:** Plugin will be added to official marketplace
4. **Users can install:** `/plugin install learning-on-web@claude-plugins-official`

---

## Support

For questions about the submission process:
- Claude Code documentation: https://code.claude.com/docs/en/plugins
- Official plugins repo: https://github.com/anthropics/claude-plugins-official
