import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { exec } from "child_process";
import { promisify } from "util";
import { detectAI, suggestAI, ALL_AI_TYPES, type AIType } from "../utils/detect.js";
import { installForPlatform } from "../utils/template.js";

const execAsync = promisify(exec);

interface InitOptions {
  ai?: string;
  force?: boolean;
  offline?: boolean;
}

interface MCPStatus {
  hasShadcn: boolean;
  hasMagicUI: boolean;
  checked: boolean;
}

/**
 * Check MCP availability for Claude Code
 * Returns status but does not block installation
 */
async function checkMCPAvailability(): Promise<MCPStatus> {
  try {
    const { stdout } = await execAsync("claude mcp list", {
      timeout: 5000,
    });

    const hasShadcn = stdout.toLowerCase().includes("shadcn");
    const hasMagicUI = stdout.toLowerCase().includes("magicui") || stdout.toLowerCase().includes("magic-ui");

    return {
      hasShadcn,
      hasMagicUI,
      checked: true,
    };
  } catch (error) {
    // claude command not found or MCP list failed
    return {
      hasShadcn: false,
      hasMagicUI: false,
      checked: false,
    };
  }
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.bold("\n🎓 Learning on Web — Skill Installer\n"));

  const cwd = process.cwd();
  let aiTypes: AIType[];
  let mcpStatus: MCPStatus = { hasShadcn: false, hasMagicUI: false, checked: false };

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

  // Check MCP availability for Claude Code
  if (aiTypes.includes("claude-code")) {
    const mcpSpinner = ora("Checking MCP servers...").start();
    mcpStatus = await checkMCPAvailability();
    mcpSpinner.stop();

    if (mcpStatus.checked) {
      if (mcpStatus.hasShadcn && mcpStatus.hasMagicUI) {
        console.log(chalk.green("✅ All required MCP servers detected\n"));
      } else {
        console.log(chalk.yellow("⚠️  Missing MCP servers (required for Phase 3 web building):"));
        if (!mcpStatus.hasShadcn) {
          console.log(chalk.yellow("   • shadcn/ui MCP not found"));
        }
        if (!mcpStatus.hasMagicUI) {
          console.log(chalk.yellow("   • Magic UI MCP not found"));
        }
        console.log(chalk.gray("   Installation will continue, but you'll need these for web building.\n"));
      }
    }
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

    // Show MCP installation instructions if needed
    if (aiTypes.includes("claude-code") && mcpStatus.checked) {
      const needsSetup = !mcpStatus.hasShadcn || !mcpStatus.hasMagicUI;

      if (needsSetup) {
        console.log(chalk.bold.yellow("⚠️  MCP Setup Required\n"));
        console.log(chalk.yellow("Phase 3 (Web Building) requires these MCP servers:\n"));

        if (!mcpStatus.hasShadcn) {
          console.log(chalk.white("📦 shadcn/ui MCP"));
          console.log(chalk.gray("   claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp"));
          console.log();
        }

        if (!mcpStatus.hasMagicUI) {
          console.log(chalk.white("✨ Magic UI MCP"));
          console.log(chalk.gray("   1. Open ~/.claude/config"));
          console.log(chalk.gray('   2. Add to mcpServers: "magicui": {"command": "npx", "args": ["-y", "@magicuidesign/mcp@latest"]}'));
          console.log();
        }

        console.log(chalk.gray("After installing MCPs, restart Claude Code.\n"));
        console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
      }
    }

    console.log(chalk.bold("Next Steps:\n"));
    console.log(chalk.gray("  1. Open your AI assistant"));
    console.log(chalk.gray('  2. Say: "Transform this course into a learning website"'));
    console.log(chalk.gray("  3. Choose Quick Mode (with pre-written notes) or Full Pipeline"));
    console.log(chalk.gray("  4. The skill will guide you through all phases\n"));

    console.log(chalk.bold("📚 Documentation:\n"));
    console.log(chalk.gray("  • GitHub: https://github.com/your-repo/learning-on-web-skill"));
    console.log(chalk.gray("  • Issues: https://github.com/your-repo/learning-on-web-skill/issues"));
  }
}
