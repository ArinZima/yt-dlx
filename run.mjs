console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

const scripts = {
  ingress: "cd stack && yarn ingress",
  setup: "chmod +x ./linux-setup.sh && ./linux-setup.sh",
  remake: "yarn clean && yarn make && yarn build",
  "remake:update": "yarn clean && yarn make && yarn udpdate && yarn build",
  upload:
    "yarn test && yarn cli && yarn remake && npm pkg fix && yarn publish --access=public && yarn update",
  clean: "yarn clean:base && yarn clean:stack && yarn clean:frontend",
  "clean:base": "rm -rf node_modules temp core yarn.lock",
  "clean:stack": "cd stack && rm -rf node_modules temp core yarn.lock",
  "clean:frontend": "cd frontend && rm -rf node_modules .next yarn.lock",
  make: "yarn make:base && yarn make:stack && yarn make:frontend",
  "make:base": "yarn install",
  "make:stack": "cd stack && yarn install",
  "make:frontend": "cd frontend && yarn install",
  build: "yarn build:base && yarn build:stack && yarn build:frontend",
  "build:base":
    "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:stack": "cd stack && rollup -c 'rollup.config.mjs'",
  "build:frontend": "cd frontend && yarn build",
  update:
    "yarn make && yarn update:base && yarn update:stack && yarn update:frontend",
  "update:base": "yarn upgrade --latest",
  "update:stack": "cd stack && yarn upgrade --latest",
  "update:frontend": "cd frontend && yarn upgrade --latest",
  spec: "cd stack && yarn start & tsup 'app/quick.spec.ts' --outDir 'temp' && node 'temp/quick.spec.mjs'",
  test: "cd stack && yarn start & yarn test:base && yarn test:stack && yarn test:scrape && yarn cli",
  "test:base": "tsup 'app/__tests__' --outDir 'temp' && node 'temp/cjs.mjs'",
  "test:scrape":
    "tsup 'app/scrape.spec.ts' --outDir 'temp' && node 'temp/scrape.spec.mjs'",
  "test:stack":
    "tsup 'app/ytcprox.spec.ts' --outDir 'temp' && node 'temp/ytcprox.spec.mjs'",
  cli: "yarn link && yarn cli:test && yarn unlink",
  "cli:test":
    "yt version && yt-dlp audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlp al --query 'SuaeRys5tTc'",
};

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
rl.question("Enter the number of the script you want to run: ", (answer) => {
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
    });
  } else console.log(`${colors.red}@error:${colors.reset}`, "invalid choice.");
  rl.close();
});
