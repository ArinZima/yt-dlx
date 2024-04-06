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
const YouTube = require("yt-dlx");
const colors = require("colors");

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await YouTube.default.ytSearch.Video.Single({
      query: "video-NAME/ID/URL",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
