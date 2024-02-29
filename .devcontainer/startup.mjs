console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  green: "\x1b[32m",
};

const core = {
  setup: "chmod +x ./linux-setup.sh && ./linux-setup.sh",
  remake: "bun run clean && bun run make && bun run build",
  "remake:update":
    "bun run clean && bun run make && bun install --latest && bun run build",
  upload:
    "bun run test && bun run cli && bun run remake && npm pkg fix && bun run publish --access=public && bun run update",
  clean: "bun run clean:base && bun run clean:client",
  "clean:base": "rm -rf node_modules .temp shared bun.lockb",
  "clean:client": "cd client && rm -rf node_modules .next bun.lockb",
  make: "bun run make:base && bun run make:client",
  "make:base": "bun install",
  "make:client": "cd client && bun install",
  build: "bun run build:base && bun run build:client",
  "build:base":
    "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:client": "cd client && bun run build",
  update: "bun run make && bun run update:base && bun run update:client",
  "update:base": "bun install --latest && bun update --latest",
  "update:client": "cd client && bun install --latest && bun update --latest",
  cli: "bun run link && bun run test:cli && bun run unlink",
  test: "bun run test:bun && bun run test:cli",
  "test:bun": "bun test --timeout 60000 --bail --watch",
  "test:spec":
    "bun test --timeout 60000 --bail --watch ./core/__tests__/bun.spec.ts",
  "test:cli":
    "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'",
};

function runScript() {
  console.log(
    `${colors.green}@info: ${colors.red}welcome to the yt-dlp dev-startup kit${colors.reset}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  Object.keys(core).forEach((script, index) => {
    console.log(
      `${colors.green}@script:${colors.reset} ${colors.red}${index}${colors.reset}: ` +
        script
    );
  });
  rl.question(
    `${colors.green}@info:${colors.reset} enter the ${colors.red}number${colors.reset} of the ${colors.green}script${colors.reset} you want to run: ${colors.red}`,
    (answer) => {
      console.log(colors.reset);
      const scriptIndex = parseInt(answer) - 1;
      const scriptKeys = Object.keys(core);
      if (scriptIndex >= 0 && scriptIndex < scriptKeys.length) {
        const scriptName = scriptKeys[scriptIndex];
        const command = core[scriptName];
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
