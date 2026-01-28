# Learning on Web Skill — Developer Guide

## Overview

A multi-platform AI coding agent skill that transforms course content into interactive learning websites through a 4-phase pipeline: Analyze → Notes → Web → Audit.

## Architecture

```
learning-on-web-skill/
├── .claude-plugin/           # Plugin metadata for Claude marketplace
│   ├── plugin.json           # Plugin definition
│   └── marketplace.json      # Marketplace listing
├── .claude/skills/           # Claude Code skill entry point
│   └── learning-on-web/
│       └── SKILL.md          # Main orchestrator (auto-activates)
├── src/learning-on-web/      # SOURCE OF TRUTH
│   ├── skills/               # Sub-skill SKILL.md files
│   │   ├── course-analyze/   # Phase 1: Structure discovery
│   │   ├── course-to-notes/  # Phase 2: Content transformation
│   │   ├── notes-to-web/     # Phase 3: Web building (core)
│   │   └── learning-audit/   # Phase 4: Evaluation
│   └── templates/            # Platform configs + base template
│       ├── base/
│       └── platforms/        # 14 AI platform configs
├── cli/                      # npm CLI installer
│   ├── src/                  # TypeScript source
│   ├── assets/               # Bundled skill files (copy of src/)
│   └── package.json          # npm: learn-web-cli
├── CLAUDE.md                 # This file
├── REQUIREMENTS.md           # Original PRD
└── README.md                 # User-facing docs
```

## Key Files

| File | Purpose |
|------|---------|
| `.claude/skills/learning-on-web/SKILL.md` | Main orchestrator — routes phases, manages PROGRESS.md |
| `src/learning-on-web/skills/notes-to-web/SKILL.md` | Core web building skill — 3-layer design quality system |
| `src/learning-on-web/skills/course-analyze/SKILL.md` | Interactive course structure discovery |
| `src/learning-on-web/skills/course-to-notes/SKILL.md` | Value-added note generation |
| `src/learning-on-web/skills/learning-audit/SKILL.md` | 5-dimension quality audit |
| `cli/src/commands/init.ts` | CLI installation logic |
| `cli/src/utils/template.ts` | Platform-specific template rendering |

## Source of Truth

- `src/learning-on-web/` is the source of truth for all skill content
- `.claude/skills/` contains the orchestrator SKILL.md for direct Claude Code use
- `cli/assets/` is a copy of src/ bundled with the npm package
- After modifying src/, run: `cp -r src/learning-on-web/skills/* cli/assets/skills/ && cp -r src/learning-on-web/templates/* cli/assets/templates/`

## Commands

```bash
# Development
cd cli && bun run dev init --ai claude    # Test CLI locally

# Build CLI
cd cli && bun run build

# Publish to npm
cd cli && npm publish

# Sync assets after src changes
cp -r src/learning-on-web/skills/* cli/assets/skills/
cp -r src/learning-on-web/templates/* cli/assets/templates/
```

## Required MCP Servers (for Phase 3)

- **shadcn/ui MCP**: `claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp`
- **Magic UI MCP**: Add `{"magicui": {"command": "npx", "args": ["-y", "@magicuidesign/mcp@latest"]}}` to mcpServers

## Git Workflow

Never push to main. Always use feature branches + PRs.

```bash
git checkout -b feature/name
# work
git commit -m "Description"
git push -u origin feature/name
gh pr create --fill
```
