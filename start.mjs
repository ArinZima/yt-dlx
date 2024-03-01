console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  green: "\x1b[32m",
};

const core = {
  remake: "bun clean && bun make && bun run update && bun run build",
  upload:
    "bun remake && bun run test && npm pkg fix && npm publish --access=public && bun update",
  clean: "bun clean:base && bun clean:client",
  "clean:base": "rm -rf node_modules .temp shared bun.lockb",
  "clean:client": "cd client && rm -rf node_modules .next bun.lockb",
  make: "bun make:deps && bun make:base && bun make:client",
  "make:base": "bun install",
  "make:client": "cd client && bun install",
  "make:deps": "chmod +x ./ytdlx-deps.sh && ./ytdlx-deps.sh",
  build: "bun run build:base && bun run build:client",
  "build:base":
    "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:client": "cd client && npm run build",
  update: "bun make && bun update:base && bun update:client",
  "update:base": "bun install --latest && bun update --latest",
  "update:client": "cd client && bun install --latest && bun update --latest",
  cli: "bun link && bun test:cli && bun unlink",
  test: "bun test:bun && bun test:cli",
  "test:bun": "bun test --timeout 120000 --bail --watch",
  "test:cli":
    "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'",
  "test:spec":
    "tsup --config 'tsup.config.ts' './core/__tests__/bun.spec.ts' --outDir '.temp' --clean && node .temp/bun.spec.js",
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
      `${colors.green}@script:${colors.reset} ${colors.red}${index + 1}${
        colors.reset
      }: ` + script
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
          } else console.clear();
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
