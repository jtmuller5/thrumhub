import Conf from "conf";
import path from "node:path";
import os from "node:os";
import { CliConfig } from "../types/index.js";

const config = new Conf<CliConfig>({
  projectName: "thrum",
  defaults: {
    apiUrl: "https://thrumhub.com",
    heartbeatPath: path.join(os.homedir(), ".openclaw", "workspace", "HEARTBEAT.md"),
  },
});

const HEARTBEAT_PATH = path.join(os.homedir(), ".openclaw", "workspace", "HEARTBEAT.md");

export function getConfig(): CliConfig {
  return {
    apiUrl: config.get("apiUrl"),
    heartbeatPath: HEARTBEAT_PATH,
  };
}

export function setConfig(key: keyof CliConfig, value: string): void {
  config.set(key, value);
}

export { config };
