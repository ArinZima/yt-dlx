// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
  try {
    await YouTube.AudioVideo.Single.Highest({
      stream: false,
      verbose: true,
      onionTor: false,
      output: "public/mix",
      query: "video-NAME/ID/URL",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ CORE TESTER ]=============================
