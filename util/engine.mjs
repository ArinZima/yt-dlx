import { dirname, join } from "path";
import { createWriteStream, existsSync } from "fs";

(async () => {
  try {
    const __dirname = dirname(__filename);
    const filepath = join(__dirname, "engine");
    switch (true) {
      case existsSync(filepath):
        break;
      default:
        const fetch = await import("node-fetch");
        let url =
          "https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp_linux";
        let dSize = 0;
        const response = await fetch.default(url);
        if (!response.ok) throw new Error("@error: " + response.statusText);
        const tSize = parseInt(response.headers.get("content-length"), 10);
        const writer = createWriteStream(filepath);
        response.body.on("data", (chunk) => {
          dSize += chunk.length;
          const progress = Math.round((dSize / tSize) * 100);
          process.stdout.write(`@download engine progress: ${progress}%\r`);
        });
        await new Promise((resolve, reject) => {
          response.body.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
    }
  } catch (error) {
    console.error("@error:", error.message);
  }
})();
