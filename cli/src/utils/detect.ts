import { existsSync } from "node:fs";
import { join } from "node:path";

export type AIType =
  | "claude"
  | "cursor"
  | "windsurf"
  | "antigravity"
  | "copilot"
  | "kiro"
  | "codex"
  | "roocode"
  | "qoder"
  | "gemini"
  | "trae"
  | "opencode"
  | "continue"
  | "codebuddy";

const AI_DIRECTORIES: Record<AIType, string> = {
  claude: ".claude",
  cursor: ".cursor",
  windsurf: ".windsurf",
  antigravity: ".agent",
  copilot: ".github",
  kiro: ".kiro",
  codex: ".codex",
  roocode: ".roo",
  qoder: ".qoder",
  gemini: ".gemini",
  trae: ".trae",
  opencode: ".opencode",
  continue: ".continue",
  codebuddy: ".codebuddy",
};

export const ALL_AI_TYPES = Object.keys(AI_DIRECTORIES) as AIType[];

export function detectAI(cwd: string): AIType[] {
  const detected: AIType[] = [];
  for (const [ai, dir] of Object.entries(AI_DIRECTORIES)) {
    if (existsSync(join(cwd, dir))) {
      detected.push(ai as AIType);
    }
  }
  return detected;
}

export function suggestAI(detected: AIType[]): AIType | "all" {
  if (detected.length === 0) return "claude";
  if (detected.length === 1) return detected[0];
  return "all";
}
