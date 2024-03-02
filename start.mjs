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
    "rm -rf shared .temp && tsup --config 'tsup.config.ts' && rollup -c 'rollup.config.mjs'",
  "build:client": "cd client && rm -rf .next .temp &&  npm run build",
  update: "bun update:base && bun update:client",
  "update:base": "bun install --latest && bun update --latest",
  "update:client": "cd client && bun install --latest && bun update --latest",
  cli: "bun link && bun test:cli && bun unlink",
  test: "bun test:bun && bun test:cli",
  "test:cli":
    "yt version && yt-dlx audio-lowest --query 'PERSONAL BY PLAZA' && yt-dlx al --query 'SuaeRys5tTc'",
  "test:full":
    "rm -rf .temp && tsup --config 'tsup.config.ts' 'core' --outDir '.temp' && node .temp/__tests__/runner.js",
  "test:web":
    "rm -rf .temp && tsup --config 'tsup.config.ts' 'core' --outDir '.temp' && node .temp/__tests__/web.spec.js",
  "test:spec":
    "tsup --config 'tsup.config.ts' './core/__tests__/quick.spec.ts' --outDir '.temp' --clean && node .temp/quick.spec.js",
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
    `${colors.green}@system:${colors.reset} welcome to the ${colors.red}yt-dlp${colors.reset} dev-startup kit`
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
