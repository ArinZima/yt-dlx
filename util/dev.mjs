console.clear();
import os from "os";
import readline from "readline";
import { spawn } from "child_process";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[1;31m",
  green: "\x1b[1;32m",
};

const core = {
  renew: "yarn clean && yarn make && yarn update && yarn build",
  "install:socks5": "chmod +x ./util/socks5.sh && ./util/socks5.sh",
  "install:deps":
    "chmod +x ./util/deps.sh && ./util/deps.sh && npx puppeteer browsers install chrome",
  "client:dev": "cd client && yarn dev",
  "client:build": "cd client && yarn build",
  "client:start": "cd client && yarn start",
  clean: "yarn clean:base && yarn clean:client && yarn clean:deps",
  "clean:base": "rm -rf node_modules temp shared others",
  "clean:client": "cd client && rm -rf node_modules .next",
  "clean:deps": "rm -rf util/ffmpeg.tar.xz util/ffmpeg util/engine",
  make: "yarn make:base && yarn make:client && yarn postinstall",
  "make:base": "yarn install --verbose",
  "make:client": "cd client && yarn install --verbose",
  update: "yarn update:base && yarn update:client",
  "update:base": "yarn install --verbose && yarn upgrade --latest",
  "update:client":
    "cd client && yarn install --verbose && yarn upgrade --latest",
  build: "yarn build:base && yarn build:client",
  "build:base":
    "rm -rf shared temp && tsup --config tsup.config.ts && rollup -c rollup.config.mjs",
  "build:client": "cd client && rm -rf .next temp && yarn build",
  test: "yarn test:scrape && yarn test:full && yarn test:cli",
  "test:cli":
    "yarn link && yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc' && yarn unlink",
  "test:scrape":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/other/scrape.spec.js",
  "test:spec":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/other/quick.spec.js",
  "test:full":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/runner.js",
  "test:audio":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/audio.js",
  "test:video":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/video.js",
  "test:mix":
    "rm -rf temp others && tsup --config tsup.config.ts core --outDir temp && node temp/__tests__/mix.js",
  postinstall:
    "node util/ffmpeg.mjs && node util/engine.mjs && chmod -R +x util/*",
  prepublishOnly: "yarn clean:deps",
};
function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
function runScript() {
  console.log(`${colors.red}=================================${colors.reset}`);
  console.log(
    `${colors.green}@system:${colors.reset} welcome to the ${colors.red}yt-dlp${colors.reset} dev-test-kit`
  );
  console.log(
    `${colors.green}@system:${colors.reset} os type: ${colors.red}${os.type()}${
      colors.reset
    }`
  );
  console.log(
    `${colors.green}@system:${colors.reset} cpu architecture: ${
      colors.red
    }${os.arch()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} total memory: ${
      colors.red
    }${formatBytes(os.totalmem())}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} home directory: ${
      colors.red
    }${os.homedir()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} hostname: ${
      colors.red
    }${os.hostname()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} release: ${
      colors.red
    }${os.release()}${colors.reset}`
  );
  console.log(`${colors.red}=================================${colors.reset}`);
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
  console.log(`${colors.red}=================================${colors.reset}`);
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
