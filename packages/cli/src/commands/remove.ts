import { Command } from "commander";
import path from "node:path";
import chalk from "chalk";
import { getConfig } from "../lib/config.js";
import {
  readHeartbeat,
  writeHeartbeat,
  hasSnippet,
  removeSnippetBlock,
} from "../lib/heartbeat.js";

export const removeCommand = new Command("remove")
  .description("Remove a snippet from your HEARTBEAT.md")
  .argument("<id>", "Snippet ID to remove")
  .action(async (id: string) => {
    const { heartbeatPath } = getConfig();
    const resolved = path.resolve(heartbeatPath);

    let content: string;
    try {
      content = readHeartbeat(resolved);
    } catch {
      console.log(
        chalk.red(
          `Heartbeat file not found at ${resolved}. Run "thrum init" first.`
        )
      );
      process.exit(1);
      return;
    }

    if (!hasSnippet(content, id)) {
      console.log(chalk.yellow(`Snippet "${id}" is not installed.`));
      return;
    }

    const updated = removeSnippetBlock(content, id);
    writeHeartbeat(resolved, updated);

    console.log(chalk.green(`Removed snippet "${id}"`));
  });
