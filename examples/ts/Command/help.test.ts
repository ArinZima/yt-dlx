import YouTube from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "help");
    await YouTube.info.help();
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
