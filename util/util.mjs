import { extract } from "tar";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pipeline } from "stream/promises";
import { createWriteStream, existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);

const downloadAndExtract = async () => {
  try {
    const filePath = join(dirname(__filename), "ffmpeg.tar.xz");
    if (existsSync(filePath)) {
      await extract({ file: filePath, cwd: dirname(__filename) });
      return;
    }
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
    if (!response.ok) throw new Error(`@reason: ${response.statusText}`);
    const tSize = parseInt(response.headers.get("content-length"), 10);
    const writer = createWriteStream(filePath);
    response.body.on("data", (chunk) => {
      dSize += chunk.length;
      const progress = Math.round((dSize / tSize) * 100);
      process.stdout.write(`@download: ${progress}%\r`);
    });
    await pipeline(response.body, writer);
    await extract({ file: filePath, cwd: dirname(__filename) });
    console.log("\nExtraction completed.");
  } catch (error) {
    console.error("Error:", error.message);
  }
};

downloadAndExtract();
