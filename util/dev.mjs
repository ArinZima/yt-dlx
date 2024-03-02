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
  postinstall: "node util/ffmpeg.mjs && node util/engine.mjs && yarn run perm",
  remake:
    "yarn run clean && yarn run make && yarn run update && yarn run build",
  prepublishOnly:
    "yarn remake && rm -rf util/ffmpeg util/ffmpeg.tar.xz util/engine",
  upload:
    "yarn run remake && yarn run test && npm pkg fix && npm publish --access=public && yarn run update",
  perm: "chmod +x util/ffmpeg/bin/ffmpeg util/ffmpeg/bin/ffprobe util/ffmpeg/bin/ffplay util/engine",
  clean: "yarn run clean:base && yarn run clean:client",
  "clean:base": "rm -rf node_modules .temp shared others",
  "clean:client": "cd client && rm -rf node_modules .next",
  make: "yarn run make:deps && yarn run make:base && yarn run make:client",
  "make:base": "yarn install",
  "make:client": "cd client && yarn install",
  "make:deps": "chmod +x ./ytdlx-deps.sh && ./ytdlx-deps.sh",
  build: "yarn run build:base && yarn run build:client",
  "build:base":
    "rm -rf shared .temp && tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:client": "cd client && rm -rf .next .temp &&  npm run build",
  update: "yarn run update:base && yarn run update:client",
  "update:base": "yarn install && yarn upgrade --latest",
  "update:client": "cd client && yarn install && yarn upgrade --latest",
  cli: "yarn run link && yarn run test:cli && yarn run unlink",
  test: "yarn run test:web && yarn run test:full && yarn run test:cli",
  "test:cli":
    "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'",
  "test:full":
    "rm -rf .temp && tsup --config 'tsup.config.ts' 'core' --outDir '.temp' && node .temp/__tests__/runner.js",
  "test:web":
    "rm -rf .temp && tsup --config 'tsup.config.ts' 'core' --outDir '.temp' && node .temp/__tests__/web.spec.js",
  spec: "tsup --config 'tsup.config.ts' './core/__tests__/quick.spec.ts' --outDir '.temp' --clean && node .temp/quick.spec.js",
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
    `${colors.green}@system:${colors.reset} free memory: ${
      colors.red
    }${formatBytes(os.freemem())}${colors.reset}`
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
