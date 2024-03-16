import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawn } from "child_process";
import { createWriteStream, existsSync, rmSync, renameSync } from "fs";

const downloadAndExtract = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const currentDir = dirname(__filename);
    const filepath = join(currentDir, "ffmpeg.tar.xz");
    let extractProcess;
    const ffmpegFolderName = "ffmpeg";
    const extractedFolderName = "ffmpeg-master-latest-linux64-gpl";
    const extractedFolder = join(currentDir, extractedFolderName);
    const newFolderName = join(currentDir, ffmpegFolderName);
    if (existsSync(newFolderName)) rmSync(newFolderName, { recursive: true });
    switch (true) {
      case existsSync(filepath):
        extractProcess = spawn("tar", ["xf", filepath, "-C", currentDir]);
        break;
      default:
        let url =
          "https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-";
        let dSize = 0;
        const arch = process.arch;
        const platform = process.platform;
        if (platform === "linux" && arch === "x64") url += "linux64-gpl.tar.xz";
        else if (platform === "linux" && arch === "arm64") {
          url += "linuxarm64-gpl.tar.xz";
        } else throw new Error("Unsupported platform or architecture");
        const response = await fetch(url);
        if (!response.ok) throw new Error("@error: " + response.statusText);
        const tSize = parseInt(response.headers.get("content-length"), 10);
        const writer = createWriteStream(filepath);
        response.body.on("data", (chunk) => {
          dSize += chunk.length;
          const progress = Math.round((dSize / tSize) * 100);
          process.stdout.write(`@download ffmpeg progress: ${progress}%\r`);
        });
        await new Promise((resolve, reject) => {
          response.body.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
        extractProcess = spawn("tar", ["xf", filepath, "-C", currentDir]);
    }

    extractProcess.on("exit", (code) => {
      if (code === 0) {
        renameSync(extractedFolder, newFolderName);
      } else throw new Error("@error: ffmpeg extraction failed");
    });
  } catch (error) {
    console.error("@error:", error.message);
  }
};

downloadAndExtract();
