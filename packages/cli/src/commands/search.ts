import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import { getConfig } from "../lib/config.js";
import { ApiError } from "../lib/errors.js";
import type { Snippet, ApiResult } from "../types/index.js";

export const searchCommand = new Command("search")
  .description("Search for snippets on OpenClaw")
  .argument("<query>", "Search query")
  .option("-c, --category <category>", "Filter by category")
  .option("-f, --frequency <frequency>", "Filter by frequency")
  .action(async (query: string, options: { category?: string; frequency?: string }) => {
    const { apiUrl } = getConfig();
    const params = new URLSearchParams({ q: query });

    if (options.category) {
      params.set("category", options.category);
    }
    if (options.frequency) {
      params.set("frequency", options.frequency);
    }

    const url = `${apiUrl}/api/snippets?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new ApiError(
          `API returned ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const result = (await response.json()) as ApiResult<Snippet[]>;

      if (result.error) {
        console.log(chalk.red(`Error: ${result.error}`));
        return;
      }

      const snippets = result.data;

      if (!snippets || snippets.length === 0) {
        console.log(chalk.yellow("No snippets found."));
        return;
      }

      const table = new Table({
        head: [
          chalk.cyan("ID"),
          chalk.cyan("Name"),
          chalk.cyan("Category"),
          chalk.cyan("Frequency"),
        ],
      });

      for (const snippet of snippets) {
        table.push([snippet.id, snippet.name, snippet.category, snippet.frequency]);
      }

      console.log(table.toString());
      console.log(chalk.dim(`\n${snippets.length} snippet(s) found.`));
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(chalk.red(error.message));
      } else {
        console.log(
          chalk.red(
            `Failed to connect to API at ${apiUrl}. Is the server running?`
          )
        );
      }
      process.exit(1);
    }
  });
