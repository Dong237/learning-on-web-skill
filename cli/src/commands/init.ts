import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { detectAI, suggestAI, ALL_AI_TYPES, type AIType } from "../utils/detect.js";
import { installForPlatform } from "../utils/template.js";

interface InitOptions {
  ai?: string;
  force?: boolean;
  offline?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.bold("\n🎓 Learning on Web — Skill Installer\n"));

  const cwd = process.cwd();
  let aiTypes: AIType[];

  if (options.ai === "all") {
    aiTypes = [...ALL_AI_TYPES];
  } else if (options.ai) {
    if (!ALL_AI_TYPES.includes(options.ai as AIType)) {
      console.log(chalk.red(`Unknown AI type: ${options.ai}`));
      console.log(chalk.gray(`Supported: ${ALL_AI_TYPES.join(", ")}, all`));
      process.exit(1);
    }
    aiTypes = [options.ai as AIType];
  } else {
    // Auto-detect
    const detected = detectAI(cwd);
    const suggestion = suggestAI(detected);

    if (detected.length > 0) {
      console.log(chalk.gray(`Detected AI tools: ${detected.join(", ")}`));
    }

    const response = await prompts({
      type: "select",
      name: "ai",
      message: "Which AI assistant do you use?",
      choices: [
        ...ALL_AI_TYPES.map((ai) => ({
          title: detected.includes(ai)
            ? chalk.green(`${ai} (detected)`)
            : ai,
          value: ai,
        })),
        { title: chalk.bold("all — Install for all platforms"), value: "all" },
      ],
      initial: suggestion === "all"
        ? ALL_AI_TYPES.length
        : ALL_AI_TYPES.indexOf(suggestion),
    });

    if (!response.ai) {
      console.log(chalk.gray("Cancelled."));
      process.exit(0);
    }

    aiTypes = response.ai === "all" ? [...ALL_AI_TYPES] : [response.ai as AIType];
  }

  // Install for each selected platform
  const spinner = ora("Installing...").start();
  const results: { ai: string; success: boolean; message: string }[] = [];

  for (const ai of aiTypes) {
    spinner.text = `Installing for ${ai}...`;
    try {
      const result = installForPlatform(cwd, ai, { force: options.force });
      results.push({ ai, ...result });
    } catch (err) {
      results.push({
        ai,
        success: false,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  spinner.stop();

  // Report results
  console.log(chalk.bold("\nInstallation Results:\n"));

  const successes = results.filter((r) => r.success);
  const failures = results.filter((r) => !r.success);

  for (const r of successes) {
    console.log(chalk.green(`  ✅ ${r.ai}: ${r.message}`));
  }
  for (const r of failures) {
    console.log(chalk.yellow(`  ⚠️  ${r.ai}: ${r.message}`));
  }

  if (successes.length > 0) {
    console.log(chalk.bold("\n🎉 Installation complete!\n"));
    console.log(chalk.gray("Next steps:"));
    console.log(chalk.gray("  1. Open your AI assistant"));
    console.log(
      chalk.gray(
        '  2. Say: "Transform this course into a learning website"'
      )
    );
    console.log(
      chalk.gray(
        "  3. The skill will guide you through the 4-phase pipeline"
      )
    );
    console.log();
    console.log(chalk.gray("Required MCP servers for web building (Phase 3):"));
    console.log(
      chalk.gray(
        "  • shadcn/ui: claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp"
      )
    );
    console.log(
      chalk.gray(
        '  • Magic UI: Add to .mcp.json: {"magicui": {"command": "npx", "args": ["-y", "@magicuidesign/mcp@latest"]}}'
      )
    );
  }
}
