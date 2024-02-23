console.clear();
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  red: "\x1b[31m",
  reset: "\x1b[0m",
  green: "\x1b[32m",
};

const scripts = {
  ingress: "cd backend && yarn ingress",
  setup: "chmod +x ./linux-setup.sh && ./linux-setup.sh",
  remake: "yarn clean && yarn make && yarn build",
  remake_update: "yarn clean && yarn make && yarn update && yarn build",
  upload:
    "yarn test && yarn cli && yarn remake && npm pkg fix && yarn publish --access=public && yarn update",
  clean: "yarn clean_base && yarn clean_backend && yarn clean_frontend",
  clean_base: "rm -rf node_modules temp proto yarn.lock",
  clean_backend: "cd backend && rm -rf node_modules temp proto yarn.lock",
  clean_frontend: "cd frontend && rm -rf node_modules .next yarn.lock",
  make: "yarn make_base && yarn make_backend && yarn make_frontend",
  make_base: "yarn install",
  make_backend: "cd backend && yarn install",
  make_frontend: "cd frontend && yarn install",
  build: "yarn build_base && yarn build_backend && yarn build_frontend",
  build_base: "tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  build_backend: "cd backend && rollup -c 'rollup.config.mjs'",
  build_frontend: "cd frontend && yarn build",
  update:
    "yarn make && yarn update_base && yarn update_backend && yarn update_frontend",
  update_base: "yarn upgrade --latest",
  update_backend: "cd backend && yarn upgrade --latest",
  update_frontend: "cd frontend && yarn upgrade --latest",
  spec: "tsup 'base/quick.spec.ts' --outDir 'temp' && node 'temp/quick.spec.js'",
  test: "yarn ingress & yarn test_base && yarn test_backend && yarn test_scrape && yarn cli",
  test_base: "tsup 'base/__tests__' --outDir 'temp' && node 'temp/cjs.mjs'",
  test_scrape:
    "tsup 'base/scrape.spec.ts' --outDir 'temp' && node 'temp/scrape.spec.mjs'",
  test_backend:
    "tsup 'base/ytcprox.spec.ts' --outDir 'temp' && node 'temp/ytcprox.spec.mjs'",
  cli: "yarn link && yarn cli_test && yarn unlink",
  cli_test:
    "yt version && yt-dlp audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlp al --query 'SuaeRys5tTc'",
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
