import { Command } from "commander";
import path from "node:path";
import chalk from "chalk";
import inquirer from "inquirer";
import { getConfig } from "../lib/config.js";
import { ApiError } from "../lib/errors.js";
import {
  readHeartbeat,
  writeHeartbeat,
  hasSnippet,
  hasValidThrumZone,
  addSnippetBlock,
} from "../lib/heartbeat.js";
import type { SnippetWithVariables, ApiResult } from "../types/index.js";

export const addCommand = new Command("add")
  .description("Add a snippet to your heartbeat.md")
  .argument("<id>", "Snippet ID to add")
  .action(async (id: string) => {
    const { apiUrl, heartbeatPath } = getConfig();
    const resolved = path.resolve(heartbeatPath);

    // Fetch snippet from API
    const url = `${apiUrl}/api/snippets/${encodeURIComponent(id)}`;

    let snippet: SnippetWithVariables;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(chalk.red(`Snippet "${id}" not found.`));
          process.exit(1);
        }
        throw new ApiError(
          `API returned ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const result = (await response.json()) as ApiResult<SnippetWithVariables>;

      if (result.error) {
        console.log(chalk.red(`Error: ${result.error}`));
        process.exit(1);
      }

      snippet = result.data!;
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
      return; // unreachable, helps TS narrow
    }

    // Read heartbeat file
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

    // Check idempotency
    if (hasSnippet(content, snippet.id)) {
      console.log(
        chalk.yellow(`Snippet "${snippet.id}" is already installed. Skipping.`)
      );
      return;
    }

    // Handle variables / placeholders
    let snippetContent = snippet.content;

    if (snippet.variables && snippet.variables.length > 0) {
      console.log(
        chalk.cyan(
          `Snippet "${snippet.name}" has ${snippet.variables.length} variable(s) to configure:`
        )
      );

      const questions = snippet.variables.map((v) => ({
        type: "input" as const,
        name: v.placeholder,
        message: v.prompt_text || `Enter value for {{${v.placeholder}}}:`,
      }));

      const answers = await inquirer.prompt(questions);

      for (const variable of snippet.variables) {
        const value = answers[variable.placeholder] as string;
        const pattern = new RegExp(`\\{\\{${variable.placeholder}\\}\\}`, "g");
        snippetContent = snippetContent.replace(pattern, value);
      }
    }

    // Add snippet block to heartbeat
    const updated = addSnippetBlock(content, snippet.id, snippetContent);
    writeHeartbeat(resolved, updated);

    console.log(chalk.green(`Added snippet "${snippet.name}" (${snippet.id})`));
  });
