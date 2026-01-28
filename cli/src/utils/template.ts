import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "assets");

interface PlatformConfig {
  platform: string;
  displayName: string;
  installType: "full" | "reference";
  folderStructure: {
    root: string;
    skillPath: string;
    filename: string;
  };
  skillsPath: string;
  frontmatter: {
    name: string;
    description: string;
  } | null;
  title: string;
  skillOrWorkflow: string;
}

function loadPlatformConfig(aiType: string): PlatformConfig {
  const configPath = join(ASSETS_DIR, "templates", "platforms", `${aiType}.json`);
  if (!existsSync(configPath)) {
    throw new Error(`No platform config found for "${aiType}". Supported: claude, cursor, windsurf, etc.`);
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function renderFrontmatter(fm: { name: string; description: string }): string {
  return `---\nname: ${fm.name}\ndescription: "${fm.description}"\n---\n\n`;
}

function renderSkillContent(config: PlatformConfig): string {
  const template = readFileSync(join(ASSETS_DIR, "templates", "base", "skill-content.md"), "utf-8");

  const frontmatter = config.frontmatter ? renderFrontmatter(config.frontmatter) : "";
  const skillOrWorkflowLower = config.skillOrWorkflow.toLowerCase();

  return template
    .replace("{{FRONTMATTER}}", frontmatter)
    .replace(/\{\{SKILL_OR_WORKFLOW\}\}/g, config.skillOrWorkflow)
    .replace(/\{\{SKILL_OR_WORKFLOW_LOWER\}\}/g, skillOrWorkflowLower)
    .replace(/\{\{SKILLS_PATH\}\}/g, config.skillsPath)
    .replace(/\{\{TITLE\}\}/g, config.title);
}

function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function copySkillFiles(targetDir: string): void {
  const sourceSkills = join(ASSETS_DIR, "skills");
  const subSkills = ["course-analyze", "course-to-notes", "notes-to-web", "learning-audit"];

  for (const skill of subSkills) {
    const srcDir = join(sourceSkills, skill);
    const destDir = join(targetDir, skill);

    if (existsSync(srcDir)) {
      cpSync(srcDir, destDir, { recursive: true });
    }
  }
}

export function installForPlatform(
  cwd: string,
  aiType: string,
  options: { force?: boolean }
): { success: boolean; message: string } {
  const config = loadPlatformConfig(aiType);

  // Determine target paths
  const platformRoot = join(cwd, config.folderStructure.root);
  const skillDir = join(platformRoot, config.folderStructure.skillPath);
  const mainFile = join(skillDir, config.folderStructure.filename);

  // Check for existing installation
  if (existsSync(mainFile) && !options.force) {
    return {
      success: false,
      message: `Already installed at ${mainFile}. Use --force to overwrite.`,
    };
  }

  // Create directories
  ensureDir(skillDir);

  // Render and write main skill file
  const content = renderSkillContent(config);
  writeFileSync(mainFile, content, "utf-8");

  // Install sub-skills
  if (config.installType === "full") {
    // Full install: copy skills alongside the main SKILL.md
    const subSkillsDir = join(skillDir, "skills");
    ensureDir(subSkillsDir);
    copySkillFiles(subSkillsDir);
  } else {
    // Reference install: copy to .shared/ directory
    const sharedDir = join(cwd, ".shared", "learning-on-web");
    const sharedSkillsDir = join(sharedDir, "skills");
    ensureDir(sharedSkillsDir);
    copySkillFiles(sharedSkillsDir);
  }

  return {
    success: true,
    message: `Installed for ${config.displayName} at ${mainFile}`,
  };
}
