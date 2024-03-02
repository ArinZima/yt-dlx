import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWriteStream, existsSync, renameSync } from "fs";

const downloadAndExtract = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const filepath = join(dirname(__filename), "yt-dlp_linux");
    const newFilePath = join(dirname(__filename), "engine");
    switch (true) {
      case existsSync(newFilePath):
        break;
      case existsSync(filepath):
        renameSync(filepath, newFilePath);
        break;
      default:
        let url =
          "https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/download/2024.02.29.232658/yt-dlp_linux";
        let dSize = 0;
        const response = await fetch(url);
        if (!response.ok) throw new Error("@error: " + response.statusText);
        const tSize = parseInt(response.headers.get("content-length"), 10);
        const writer = createWriteStream(filepath);
        response.body.on("data", (chunk) => {
          dSize += chunk.length;
          const progress = Math.round((dSize / tSize) * 100);
          process.stdout.write(`@download progress: ${progress}%\r`);
        });
        await new Promise((resolve, reject) => {
          response.body.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
        renameSync(filepath, newFilePath);
    }
  } catch (error) {
    console.error("@error:", error.message);
  }
};

downloadAndExtract();
