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
  remake:
    "pnpm run clean && pnpm run make && pnpm run update && pnpm run build",
  postinstall: "run-s download-files setup-permissions install-chrome",
  prepublishOnly: "pnpm run clean:deps",
  "setup-permissions": "chmod -R +x util/*",
  "download-files": "node util/cprobe.mjs",
  "install-chrome": "npx puppeteer browsers install chrome",
  "frontend:dev": "cd frontend && pnpm run dev",
  "frontend:lint": "cd frontend && pnpm run lint",
  "frontend:build": "cd frontend && pnpm run build",
  "frontend:start": "cd frontend && pnpm run start",
  "frontend:clean": "cd frontend && pnpm run clean",
  clean:
    "pnpm run clean:base && pnpm run clean:frontend && pnpm run clean:deps",
  "clean:base": "rm -rf node_modules temp project others",
  "clean:frontend": "cd frontend && pnpm run clean",
  "clean:deps": "rm -rf util/ffmpeg.tar.xz util/ffmpeg util/cprobe",
  make: "pnpm run make:base && pnpm run make:frontend",
  "make:base": "pnpm install",
  "make:frontend": "cd frontend && pnpm install",
  update: "pnpm run update:base && pnpm run update:frontend",
  "update:base": "pnpm up --latest",
  "update:frontend": "cd frontend && pnpm up --latest",
  build: "pnpm run build:base && pnpm run build:frontend",
  "build:frontend": "cd frontend && pnpm run clean && pnpm run build",
  "build:base":
    "rm -rf project temp && tsc -p ./config/cjs.json && tsc -p ./config/esm.json && tsc -p ./config/types.json",
  spec: "rm -rf temp && tsup core/__tests__/other/quick.spec.ts --outDir temp && node temp/quick.spec.js",
  test: "rm -rf temp && pnpm run test:scrape && pnpm run test:mix && pnpm run test:video && pnpm run test:audio && pnpm run test:command && pnpm run test:cli",
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
    "pnpm run link && yt-dlx audio-lowest --query PERSONAL BY PLAZA && yt-dlx al --query SuaeRys5tTc && pnpm run unlink",
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
