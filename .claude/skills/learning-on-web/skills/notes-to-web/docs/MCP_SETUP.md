# MCP Server Setup Guide

> Reference document for MCP server installation and verification. This skill REQUIRES shadcn/ui MCP and Magic UI MCP for production-quality output.

## Required MCP Servers

### shadcn/ui MCP (Required)

Provides real-time access to the component registry with accurate TypeScript props and React component data.

**Installation:**
```bash
# For Claude Code:
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp

# Verify: run /mcp and check for "shadcn" in the list
```

**Why required:** Without this, the agent hallucinates component APIs. With it, every component uses correct, current props and patterns.

**Usage:**
```
1. Identify needed component (e.g., Accordion for collapsible sections)
2. Query shadcn MCP: "accordion component usage"
3. Get real, current API — not hallucinated props
4. Implement with correct patterns
```

---

### Magic UI MCP (Required)

Provides 50+ animated components: blur-fade, orbiting-circles, text-animate, bento-grid, dock, marquee, and more.

**Installation:**
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

**Key Components:**

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

---

### Playwright MCP (Recommended)

For visual testing and screenshot comparison. Use it to verify pages look correct.

**Installation:**
```bash
# Claude Code:
claude mcp add playwright
```

**Usage:** Take screenshots during build to verify visual quality before user review.

---

### Figma MCP (Optional)

If the user has Figma designs to implement.

**Installation:**
```bash
# Claude Code:
claude mcp add figma
```

---

## Pre-Flight Check

Before proceeding with Phase 3, run this verification:

```bash
# Check MCP availability
echo "Checking MCP servers..."

# The agent should verify these are accessible:
# - shadcn MCP: can query component APIs
# - Magic UI MCP: can query animation components

# If either is missing, STOP and guide user through installation
```

**STOP HERE if shadcn/ui MCP or Magic UI MCP is not available.** Guide the user through installation. Do not proceed with generic components.
