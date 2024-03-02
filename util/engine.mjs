import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWriteStream } from "fs";

const downloadAndRename = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const destinationPath = join(dirname(__filename), "engine");
    const url =
      "https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/download/2024.02.29.232658/yt-dlp_linux";
    const response = await fetch(url);
    if (!response.ok) throw new Error(`@error: ${response.statusText}`);
    const writer = createWriteStream(destinationPath);
    response.body.pipe(writer);
    writer.on("finish", () => {
      console.log("@success: Download completed");
    });
    writer.on("error", (err) => {
      throw new Error(`@error: ${err.message}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

downloadAndRename();
