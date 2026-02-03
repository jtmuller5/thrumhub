import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { searchCommand } from "./commands/search.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { listCommand } from "./commands/list.js";
import { doctorCommand } from "./commands/doctor.js";
import { configCommand } from "./commands/config.js";

const program = new Command();

program
  .name("thrum")
  .description("Package manager for OpenClaw heartbeat snippets")
  .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(searchCommand);
program.addCommand(addCommand);
program.addCommand(removeCommand);
program.addCommand(listCommand);
program.addCommand(doctorCommand);
program.addCommand(configCommand);

program.parse();
