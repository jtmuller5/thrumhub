import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import chalk from "chalk";
import { getConfig } from "../lib/config.js";
import { hasValidThrumZone } from "../lib/heartbeat.js";

export const doctorCommand = new Command("doctor")
  .description("Validate your thrum setup")
  .action(async () => {
    const { heartbeatPath } = getConfig();
    const resolved = path.resolve(heartbeatPath);
    const openclawSnippets = path.join(os.homedir(), ".openclaw", "snippets");
    const openclawWorkspace = path.join(os.homedir(), ".openclaw", "workspace");
    let allGood = true;

    // Check 1: HEARTBEAT.md exists
    if (fs.existsSync(resolved)) {
      console.log(chalk.green(`[OK] HEARTBEAT.md found at ${resolved}`));
    } else {
      console.log(chalk.red(`[FAIL] HEARTBEAT.md not found at ${resolved}`));
      allGood = false;
    }

    // Check 2: valid thrum-zone
    if (fs.existsSync(resolved)) {
      const content = fs.readFileSync(resolved, "utf-8");
      if (hasValidThrumZone(content)) {
        console.log(chalk.green("[OK] Valid thrum-zone found"));
      } else {
        console.log(
          chalk.red("[FAIL] No valid thrum-zone in HEARTBEAT.md")
        );
        allGood = false;
      }
    } else {
      console.log(
        chalk.yellow("[SKIP] Cannot check thrum-zone (HEARTBEAT.md missing)")
      );
    }

    // Check 3: ~/.openclaw/workspace directory
    if (fs.existsSync(openclawWorkspace)) {
      console.log(chalk.green(`[OK] ${openclawWorkspace} exists`));
    } else {
      console.log(chalk.red(`[FAIL] ${openclawWorkspace} does not exist`));
      allGood = false;
    }

    // Check 4: ~/.openclaw/snippets directory
    if (fs.existsSync(openclawSnippets)) {
      console.log(chalk.green(`[OK] ${openclawSnippets} exists`));
    } else {
      console.log(chalk.red(`[FAIL] ${openclawSnippets} does not exist`));
      allGood = false;
    }

    // Summary
    console.log("");
    if (allGood) {
      console.log(chalk.green("All checks passed!"));
    } else {
      console.log(
        chalk.yellow('Some checks failed. Run "thrum init" to fix setup issues.')
      );
    }
  });
