import { Command } from "commander";
import chalk from "chalk";
import { getConfig, setConfig } from "../lib/config.js";
import type { CliConfig } from "../types/index.js";

const VALID_KEYS: (keyof CliConfig)[] = ["apiUrl"];

export const configCommand = new Command("config")
  .description("Get or set CLI configuration")
  .addCommand(
    new Command("get")
      .description("Get a config value")
      .argument("[key]", "Config key to read")
      .action((key?: string) => {
        const cfg = getConfig();
        if (key) {
          if (!VALID_KEYS.includes(key as keyof CliConfig)) {
            console.log(chalk.red(`Unknown config key: ${key}`));
            console.log(`Valid keys: ${VALID_KEYS.join(", ")}`);
            process.exit(1);
          }
          console.log(cfg[key as keyof CliConfig]);
        } else {
          for (const k of VALID_KEYS) {
            console.log(`${chalk.cyan(k)}: ${cfg[k]}`);
          }
        }
      })
  )
  .addCommand(
    new Command("set")
      .description("Set a config value")
      .argument("<key>", "Config key")
      .argument("<value>", "Config value")
      .action((key: string, value: string) => {
        if (!VALID_KEYS.includes(key as keyof CliConfig)) {
          console.log(chalk.red(`Unknown config key: ${key}`));
          console.log(`Valid keys: ${VALID_KEYS.join(", ")}`);
          process.exit(1);
        }
        setConfig(key as keyof CliConfig, value);
        console.log(chalk.green(`Set ${key} = ${value}`));
      })
  );
