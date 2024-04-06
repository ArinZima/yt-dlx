// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
import colors from "colors";
import YouTube from "../../";
(async () => {
  try {
    await YouTube.VideoOnly.Single.Lowest({
      stream: false,
      verbose: true,
      onionTor: false,
      output: "public/video",
      query: "video-NAME/ID/URL",
    });
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
//
// =============================[ CORE TESTER ]=============================
