console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  green: "\x1b[32m",
};

const scripts = {
  "setup": "chmod +x ./linux-setup.sh && ./linux-setup.sh",
  "remake": "bun run clean && bun run make && bun run build",
  "remake:update": "bun run clean && bun run make && bun install --latest && bun run build",
  "upload": "bun run test && bun run cli && bun run remake && npm pkg fix && bun run publish --access=public && bun run update",
  "clean": "bun run clean:base && bun run clean:frontend",
  "clean:base": "rm -rf node_modules .temp shared bun.lockb",
  "clean:frontend": "cd frontend && rm -rf node_modules .next bun.lockb",
  "make": "bun run make:base && bun run make:frontend",
  "make:base": "bun install",
  "make:frontend": "cd frontend && bun install",
  "build": "bun run build:base && bun run build:frontend",
  "build:base": "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:frontend": "cd frontend && bun run build",
  "update": "bun run make && bun run update:base && bun run update:frontend",
  "update:base": "bun install --latest && bun update --latest",
  "update:frontend": "cd frontend && bun install --latest && bun update --latest",
  "cli": "bun run link && bun run test:cli && bun run unlink",
  "test": "bun run est:vitest && bun run test:cli",
  "test:vitest": "vitest --config 'vitest.config.mts'",
  "test:spec": "bun test --timeout 60000 --bail --watch ./scripts/__tests__/bun.spec.ts",
  "test:cli": "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'"
};

function runScript() {
  console.log(
    `${colors.green}@info: ${colors.red}welcome to the yt-dlp dev-startup kit${colors.reset}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  Object.keys(scripts).forEach((script, index) => {
    console.log(
      `${colors.green}@script:${colors.reset} ${colors.red}${index + 1}${
        colors.reset
      }`,
      script
    );
  });
  rl.question(
    `${colors.green}@info:${colors.reset} enter the ${colors.red}number${colors.reset} of the ${colors.green}script${colors.reset} you want to run: ${colors.red}`,
    (answer) => {
      console.log(colors.reset);
      const scriptIndex = parseInt(answer) - 1;
      const scriptKeys = Object.keys(scripts);
      if (scriptIndex >= 0 && scriptIndex < scriptKeys.length) {
        const scriptName = scriptKeys[scriptIndex];
        const command = scripts[scriptName];
        console.log(`${colors.green}@choice:${colors.reset}`, scriptName);
        const childProcess = spawn(command, {
          shell: true,
          stdio: "inherit",
        });
        childProcess.on("error", (error) => {
          console.error(`${colors.red}@error:${colors.reset}`, error);
        });
        childProcess.on("exit", (code) => {
          if (code !== 0) {
            console.error(
              `${colors.red}@error:${colors.reset}`,
              `Exited with code ${code}`
            );
          }
          runScript();
        });
      } else {
        console.log(`${colors.red}@error:${colors.reset}`, "invalid choice.");
        runScript();
      }
      rl.close();
    }
  );
}

runScript();
