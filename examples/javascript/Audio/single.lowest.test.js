// ======================================[ DOCUMENTATION ]======================================
/**
 * Downloads and processes a single YouTube video with audio customization options.
 *
 * @param query - The YouTube video URL or ID or name.
 * @param output - (optional) The output directory for the processed file.
 * @param stream - (optional) Whether to stream the processed video or not.
 * @param filter - (optional) The audio filter to apply. Available options: "echo", "slow", "speed", "phaser", "flanger", "panning", "reverse", "vibrato", "subboost", "surround", "bassboost", "nightcore", "superslow", "vaporwave", "superspeed".
 * @param verbose - (optional) Whether to log verbose output or not.
 * @param onionTor - (optional) Whether to use Tor for the download or not.
 * @param resolution - The desired audio resolution. Available options: "high", "medium", "low", "ultralow".
 * @returns A Promise that resolves with either `void` (if `stream` is false) or an object containing the `ffmpeg` instance and the output filename (if `stream` is true).
 */
// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
const YouTube = require("yt-dlx");
const colors = require("colors");
(async () => {
  try {
    await YouTube.default.AudioOnly.Single.Lowest({
      stream: false,
      verbose: true,
      onionTor: false,
      output: "public/audio",
      query: "video-NAME/ID/URL",
    });
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ USING STREAMING TO SAVE THE FILE ]=============================
//
const fs = require("fs");
(async () => {
  try {
    const result = await YouTube.default.AudioOnly.Single.Lowest({
      stream: true,
      verbose: true,
      onionTor: false,
      output: "public/audio",
      query: "video-NAME/ID/URL",
    });
    if (result && result.filename && result.ffmpeg) {
      result.ffmpeg.pipe(fs.createWriteStream(result.filename), {
        end: true,
      });
    } else {
      console.error(colors.red("@error:"), "ffmpeg or filename not found!");
    }
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ USING STREAMING TO PIPE THE FILE ]=============================
//
const express = require("express");
(async () => {
  try {
    const server = express();
    server.get("/audio/:query", async (req, res) => {
      try {
        const queryParam = req.params.query;
        const result = await YouTube.default.AudioOnly.Single.Lowest({
          stream: true,
          verbose: true,
          onionTor: false,
          query: queryParam,
        });
        if (result && result.filename && result.ffmpeg) {
          result.ffmpeg.pipe(res, { end: true });
        } else res.status(404).send("ffmpeg or filename not found!");
      } catch (error) {
        res.status(500).send(error.message);
      }
    });
    server.listen(3000, () => {
      console.log(colors.blue("@server:"), "running on port 3000");
    });
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
//
// ========================================================================================
