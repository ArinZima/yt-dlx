console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  green: "\x1b[32m",
};

const scripts = {
  setup: "chmod +x ./linux-setup.sh && ./linux-setup.sh",
  remake: "yarn clean && yarn make && yarn build",
  "remake:update": "yarn clean && yarn make && yarn update && yarn build",
  upload:
    "yarn test && yarn cli && yarn remake && npm pkg fix && yarn publish --access=public && yarn update",
  clean: "yarn clean:base && yarn clean:frontend",
  "clean:base": "rm -rf node_modules temp proto yarn.lock",
  "clean:frontend": "cd frontend && rm -rf node_modules .next yarn.lock",
  make: "yarn make:base && yarn make:frontend",
  "make:base": "yarn install",
  "make:frontend": "cd frontend && yarn install",
  build: "yarn build:base && yarn build:frontend",
  "build:base":
    "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:frontend": "cd frontend && yarn build",
  update: "yarn make && yarn update:base && yarn update:frontend",
  "update:base": "yarn upgrade --latest",
  "update:frontend": "cd frontend && yarn upgrade --latest",
  spec: "tsup 'scripts/quick.spec.ts' --outDir 'temp' && node 'temp/quick.spec.js'",
  test: "yarn ingress & yarn test:base && yarn test:scrape && yarn cli",
  "test:base":
    "tsup 'scripts/__tests__' --outDir 'temp' && node 'temp/cjs.mjs'",
  "test:scrape":
    "tsup 'scripts/scrape.spec.ts' --outDir 'temp' && node 'temp/scrape.spec.mjs'",
  cli: "yarn link && yarn cli:test && yarn unlink",
  "cli:test":
    "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'",
};

function runScript() {
  console.log(
    `${colors.green}@yt-dlp: ${colors.red}welcome to the yt-dlp dev-startup kit${colors.reset}`
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
    `${colors.green}@info:${colors.reset} enter the ${colors.green}number${colors.reset} of the ${colors.green}script${colors.reset} you want to run: ${colors.red}`,
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
