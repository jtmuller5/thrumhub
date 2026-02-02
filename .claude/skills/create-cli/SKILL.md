---
name: create-cli
description: A skill to help create command-line interface (CLI) applications.
---

# Create CLI Tool

This skill provides a complete guide for creating a modern, production-ready CLI tool using TypeScript, Commander.js, and tsup.

## Tech Stack

- **TypeScript** - Type-safe development
- **Commander.js** - Command-line interface framework
- **tsup** - TypeScript bundler (fast, zero-config)
- **Chalk** - Terminal string styling
- **Conf** - Simple config management with JSON schema validation
- **Node.js 18+** - Runtime environment

## Project Structure

```
my-cli/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── cli.ts              # Main entry point
│   ├── commands/           # Command implementations
│   │   ├── command1.ts
│   │   └── command2.ts
│   ├── lib/                # Shared utilities
│   │   ├── config.ts       # Configuration management
│   │   └── errors.ts       # Custom error classes
│   └── types/              # TypeScript type definitions
│       └── index.ts
└── dist/                   # Build output (generated)
```

## Step-by-Step Setup

### 1. Initialize Project

```bash
mkdir my-cli && cd my-cli
npm init -y
```

### 2. Install Dependencies

```bash
# Production dependencies
npm install commander chalk conf

# Development dependencies
npm install -D typescript @types/node tsup
```

### 3. Configure package.json

```json
{
  "name": "my-cli",
  "version": "1.0.0",
  "description": "A CLI tool built with TypeScript",
  "type": "module",
  "main": "dist/cli.js",
  "bin": {
    "my-cli": "./dist/cli.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "start": "node dist/cli.js"
  },
  "keywords": ["cli", "tool"],
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Key fields:**

- `type: "module"` - Enable ES modules
- `bin` - Maps CLI command name to executable file
- `files` - Only include dist/ in npm package
- `engines` - Specify minimum Node version

### 4. Configure TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Important settings:**

- `moduleResolution: "bundler"` - Modern module resolution
- `strict: true` - Enable all strict type checking
- `declaration: true` - Generate .d.ts files

### 5. Configure tsup (tsup.config.ts)

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  shims: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
```

**Key options:**

- `entry` - CLI entry point
- `format: ["esm"]` - Output ES modules
- `banner` - Adds shebang for executable
- `clean: true` - Clean dist/ before build

### 6. Create Main CLI File (src/cli.ts)

```typescript
import { Command } from "commander";
import chalk from "chalk";
import { command1 } from "./commands/command1.js";
import { command2 } from "./commands/command2.js";

const program = new Command();

program.name("my-cli").description("A minimal CLI tool").version("1.0.0");

// Register commands
program.addCommand(command1);
program.addCommand(command2);

// Global error handler
program.exitOverride((err) => {
  // Let help and version exit normally
  if (
    err.code === "commander.helpDisplayed" ||
    err.code === "commander.version"
  ) {
    process.exit(0);
  }
  if (err.code === "commander.unknownCommand") {
    console.error(chalk.red(`Unknown command. Run 'my-cli --help' for usage.`));
    process.exit(1);
  }
  if (err.code === "commander.missingArgument") {
    console.error(chalk.red(`Missing required argument.`));
    process.exit(1);
  }
  throw err;
});

// Handle unhandled rejections
process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`));
  } else {
    console.error(chalk.red("An unexpected error occurred"));
  }
  process.exit(1);
});

program.parse();
```

### 7. Create Custom Errors (src/lib/errors.ts)

```typescript
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
```

### 8. Create Configuration Manager (src/lib/config.ts)

```typescript
import Conf from "conf";
import { ConfigError } from "./errors.js";

interface MyConfig {
  apiKey?: string;
  // Add more config fields as needed
}

const config = new Conf<MyConfig>({
  projectName: "my-cli",
  schema: {
    apiKey: {
      type: "string",
    },
  },
});

export function getApiKey(): string {
  // Check environment variable first
  const envKey = process.env.MY_API_KEY;
  if (envKey) {
    return envKey;
  }

  // Fall back to stored config
  const storedKey = config.get("apiKey");
  if (storedKey) {
    return storedKey;
  }

  throw new ConfigError(
    "No API key found. Set MY_API_KEY environment variable or run: my-cli config set-key <key>",
  );
}

export function setApiKey(key: string): void {
  config.set("apiKey", key);
}

export function clearConfig(): void {
  config.clear();
}

export function getConfigPath(): string {
  return config.path;
}
```

### 9. Create a Command (src/commands/command1.ts)

```typescript
import { Command } from "commander";
import chalk from "chalk";
import { ApiError, ConfigError } from "../lib/errors.js";

export const command1 = new Command("hello")
  .description("Say hello to someone")
  .argument("<name>", "Name of the person to greet")
  .option("-l, --loud", "Shout the greeting")
  .action(async (name: string, options: { loud?: boolean }) => {
    try {
      let greeting = `Hello, ${name}!`;

      if (options.loud) {
        greeting = greeting.toUpperCase();
      }

      console.log(chalk.green("✓"), greeting);
    } catch (error) {
      if (error instanceof ApiError || error instanceof ConfigError) {
        console.error(chalk.red(`Error: ${error.message}`));
        process.exit(1);
      }
      throw error;
    }
  });
```

### 10. Create Type Definitions (src/types/index.ts)

```typescript
export interface MyConfig {
  apiKey?: string;
}

export interface CommandOptions {
  verbose?: boolean;
  output?: string;
}
```

## Build and Test

### Local Development

```bash
# Build once
npm run build

# Watch mode (rebuilds on changes)
npm run dev

# Test locally
npm run start -- hello World
# or
node dist/cli.js hello World
```

### Test as Installed Package

```bash
# Link globally
npm link

# Now use the CLI command directly
my-cli hello World

# Unlink when done
npm unlink -g my-cli
```

## Publishing to npm

### First-Time Setup

1. Create npm account at https://www.npmjs.com
2. Login via CLI: `npm login`
3. Verify package name is available: `npm search my-cli`

### Pre-Publish Checklist

- [ ] Update version in package.json
- [ ] Build the project: `npm run build`
- [ ] Test the CLI: `npm link && my-cli --help`
- [ ] Preview package contents: `npm pack --dry-run`
- [ ] Update README.md with usage instructions

### Publish

```bash
# Initial publish
npm run build && npm publish

# Or add to package.json scripts:
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

### Version Management

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch && npm publish

# Minor (1.0.0 -> 1.1.0) - New features
npm version minor && npm publish

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major && npm publish
```

## Best Practices

### 1. Error Handling

- Create custom error classes for different error types
- Catch errors in command actions and display user-friendly messages
- Use `chalk.red()` for errors, `chalk.green()` for success

### 2. User Experience

- Provide clear, descriptive help text for all commands and options
- Use emojis/symbols (✓, ✗) for visual feedback
- Show dim/gray text for supplementary information
- Exit with appropriate codes (0 = success, 1 = error)

### 3. Configuration

- Support both environment variables and stored config
- Environment variables should take precedence
- Provide commands to view/set/clear configuration
- Use JSON schema validation with Conf

### 4. File Imports

- Always use `.js` extension in imports (not `.ts`)
- Example: `import { foo } from "./lib/config.js"`
- This is required for ES modules

### 5. Testing

- Test with `npm link` before publishing
- Verify help text: `my-cli --help`
- Test all commands with various inputs
- Test error scenarios

### 6. Documentation

- Keep README.md updated with:
  - Installation instructions
  - Usage examples for each command
  - Configuration requirements
  - Common troubleshooting

## Common Patterns

### Adding Interactive Prompts

Install inquirer for interactive prompts:

```bash
npm install inquirer @types/inquirer
```

```typescript
import inquirer from "inquirer";

const answers = await inquirer.prompt([
  {
    type: "input",
    name: "apiKey",
    message: "Enter your API key:",
  },
]);
```

### Progress Indicators

Use ora for spinners:

```bash
npm install ora
```

```typescript
import ora from "ora";

const spinner = ora("Loading...").start();
// Do work...
spinner.succeed("Done!");
```

### Table Output

Use cli-table3 for formatted tables:

```bash
npm install cli-table3 @types/cli-table3
```

### File Operations

Use fs/promises for async file operations:

```typescript
import { readFile, writeFile } from "fs/promises";

const content = await readFile("file.txt", "utf-8");
await writeFile("output.txt", content);
```

## Troubleshooting

### "Cannot find module" errors

- Ensure imports use `.js` extension
- Check `type: "module"` in package.json
- Verify `moduleResolution: "bundler"` in tsconfig.json

### CLI command not found after npm install

- Verify `bin` field in package.json
- Check shebang is added: `#!/usr/bin/env node`
- Ensure dist/cli.js is executable: `chmod +x dist/cli.js`

### TypeScript compilation errors

- Run `npm install -D @types/node`
- Ensure `esModuleInterop: true` in tsconfig.json
- Check for missing type definitions

## Additional Resources

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [tsup Documentation](https://tsup.egoist.dev/)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [Conf Documentation](https://github.com/sindresorhus/conf)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
