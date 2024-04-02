import { spawn } from "child_process";
import { type, arch, totalmem, homedir, hostname, release } from "os";
import { createInterface } from "readline";

console.clear();

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[1;31m",
  green: "\x1b[1;32m",
};

const core = {
  remake: "yarn clean && yarn make && yarn update && yarn build",
  postinstall: "run-s download-files setup-permissions install-chrome",
  prepublishOnly: "yarn clean:deps",
  "setup-permissions": "chmod -R +x util/*",
  "download-files": "node util/cprobe.mjs",
  "install-chrome": "npx puppeteer browsers install chrome",
  "browser:dev": "cd cluster/browser && yarn dev",
  "browser:lint": "cd cluster/browser && yarn lint",
  "browser:build": "cd cluster/browser && yarn build",
  "browser:start": "cd cluster/browser && yarn start",
  "browser:clean": "cd cluster/browser && yarn clean",
  "client:dev": "cd cluster/client && yarn dev",
  "client:lint": "cd cluster/client && yarn lint",
  "client:build": "cd cluster/client && yarn build",
  "client:start": "cd cluster/client && yarn start",
  "client:clean": "cd cluster/client && yarn clean",
  clean:
    "yarn clean:pkg && yarn clean:base && yarn clean:client && yarn clean:browser && yarn clean:deps",
  "clean:pkg": "cd pkg && rm -rf node_modules",
  "clean:base": "rm -rf node_modules temp dist others",
  "clean:client": "cd cluster/client && yarn clean",
  "clean:browser": "cd cluster/browser && yarn clean",
  "clean:deps": "rm -rf util/ffmpeg.tar.xz util/ffmpeg util/cprobe",
  make: "yarn make:base && yarn make:pkg && yarn make:client && yarn make:browser",
  "make:base": "yarn install",
  "make:pkg": "cd pkg && yarn install",
  "make:client": "cd cluster/client && yarn install",
  "make:browser": "cd cluster/browser && yarn install",
  update:
    "yarn update:base && yarn update:pkg && yarn update:client && yarn update:browser",
  "update:base": "yarn upgrade --latest",
  "update:pkg": "cd pkg && yarn upgrade --latest",
  "update:client": "cd cluster/client && yarn upgrade --latest",
  "update:browser": "cd cluster/browser && yarn upgrade --latest",
  build: "yarn build:base && yarn build:client && yarn build:browser",
  "build:esm": "tsc -p ./config/esm.json",
  "build:cjs": "tsc -p ./config/cjs.json",
  "build:types": "tsc -p ./config/types.json",
  "build:client": "cd cluster/client && yarn clean && yarn build",
  "build:browser": "cd cluster/browser && yarn clean && yarn build",
  "build:base":
    "rm -rf dist temp && yarn build:cjs && yarn build:esm && yarn build:types",
  spec: "rm -rf temp && tsup core/__tests__/other/quick.spec.ts --outDir temp && node temp/quick.spec.js",
  test: "rm -rf temp && yarn test:pkg && yarn test:scrape && yarn test:mix && yarn test:video && yarn test:audio && yarn test:command && yarn test:cli",
  "test:pkg": "cd pkg && yarn test",
  "test:mix":
    "rm -rf temp && tsup core --outDir temp && node temp/__tests__/mix.js",
  "test:video":
    "rm -rf temp && tsup core --outDir temp && node temp/__tests__/video.js",
  "test:audio":
    "rm -rf temp && tsup core --outDir temp && node temp/__tests__/audio.js",
  "test:command":
    "rm -rf temp && tsup core --outDir temp && node temp/__tests__/command.js",
  "test:scrape":
    "rm -rf temp && tsup core/__tests__/other/scrape.spec.ts --outDir temp && node temp/scrape.spec.js",
  "test:cli":
    "yarn link && yt-dlx audio-lowest --query PERSONAL BY PLAZA && yt-dlx al --query SuaeRys5tTc && yarn unlink",
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
    `${colors.green}@system:${colors.reset} os type: ${colors.red}${type()}${
      colors.reset
    }`
  );
  console.log(
    `${colors.green}@system:${colors.reset} cpu architecture: ${
      colors.red
    }${arch()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} total memory: ${
      colors.red
    }${formatBytes(totalmem())}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} home directory: ${
      colors.red
    }${homedir()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} hostname: ${
      colors.red
    }${hostname()}${colors.reset}`
  );
  console.log(
    `${colors.green}@system:${colors.reset} release: ${colors.red}${release()}${
      colors.reset
    }`
  );
  console.log(`${colors.red}=================================${colors.reset}`);
  const rl = createInterface({
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
