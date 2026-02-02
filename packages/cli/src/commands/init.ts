import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import chalk from "chalk";
import { getConfig } from "../lib/config.js";

export const initCommand = new Command("init")
  .description("Initialize heartbeat.md with thrum-zone tags")
  .action(async () => {
    const { heartbeatPath } = getConfig();
    const resolved = path.resolve(heartbeatPath);

    // Ensure ~/.openclaw directory exists
    const openclawDir = path.join(os.homedir(), ".openclaw", "snippets");
    fs.mkdirSync(openclawDir, { recursive: true });
    console.log(chalk.green(`Created ${openclawDir}`));

    if (fs.existsSync(resolved)) {
      const existing = fs.readFileSync(resolved, "utf-8");
      if (existing.includes("<!-- thrum-zone:start -->")) {
        console.log(
          chalk.yellow("heartbeat.md already has a thrum-zone. Skipping.")
        );
        return;
      }
      // Append thrum-zone to existing file
      const updated =
        existing + "\n\n<!-- thrum-zone:start -->\n<!-- thrum-zone:end -->\n";
      fs.writeFileSync(resolved, updated, "utf-8");
      console.log(chalk.green("Added thrum-zone to existing heartbeat.md"));
    } else {
      const content = `# Heartbeat\n\n<!-- thrum-zone:start -->\n<!-- thrum-zone:end -->\n`;
      fs.writeFileSync(resolved, content, "utf-8");
      console.log(chalk.green(`Created ${resolved} with thrum-zone`));
    }
  });
