import ytdlx from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "help");
    await ytdlx.info.help();
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
