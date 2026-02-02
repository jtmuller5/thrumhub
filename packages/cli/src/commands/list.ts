import { Command } from "commander";
import path from "node:path";
import chalk from "chalk";
import Table from "cli-table3";
import { getConfig } from "../lib/config.js";
import {
  readHeartbeat,
  hasValidThrumZone,
  parseInstalledSnippets,
} from "../lib/heartbeat.js";

export const listCommand = new Command("list")
  .description("List installed snippets in your HEARTBEAT.md")
  .action(async () => {
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

    if (!hasValidThrumZone(content)) {
      console.log(
        chalk.red(
          `No valid thrum-zone found in ${resolved}. Run "thrum init" first.`
        )
      );
      process.exit(1);
      return;
    }

    const snippets = parseInstalledSnippets(content);

    if (snippets.length === 0) {
      console.log(chalk.yellow("No snippets installed."));
      return;
    }

    const table = new Table({
      head: [chalk.cyan("ID"), chalk.cyan("Preview")],
    });

    for (const snippet of snippets) {
      const preview =
        snippet.content.length > 60
          ? snippet.content.substring(0, 60) + "..."
          : snippet.content;
      table.push([snippet.id, preview.replace(/\n/g, " ")]);
    }

    console.log(table.toString());
    console.log(chalk.dim(`\n${snippets.length} snippet(s) installed.`));
  });
