#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";

const program = new Command();

program
  .name("learn-web")
  .description("Install Learning on Web skill for AI coding assistants")
  .version("1.0.0");

program
  .command("init")
  .description("Install the learning-on-web skill for your AI assistant")
  .option("--ai <type>", "AI assistant type (claude, cursor, windsurf, etc.)")
  .option("--force", "Overwrite existing files")
  .option("--offline", "Use bundled assets only (skip GitHub)")
  .action(initCommand);

program.parse();
