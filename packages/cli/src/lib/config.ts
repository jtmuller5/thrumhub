import Conf from "conf";
import { CliConfig } from "../types/index.js";

const config = new Conf<CliConfig>({
  projectName: "thrum",
  defaults: {
    apiUrl: "http://localhost:3000",
    heartbeatPath: "./heartbeat.md",
  },
});

export function getConfig(): CliConfig {
  return {
    apiUrl: config.get("apiUrl"),
    heartbeatPath: config.get("heartbeatPath"),
  };
}

export function setConfig(key: keyof CliConfig, value: string): void {
  config.set(key, value);
}

export { config };
