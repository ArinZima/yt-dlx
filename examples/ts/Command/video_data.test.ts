import YouTube from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await YouTube.ytSearch.Video.Single({
      query: "video-NAME/ID/URL",
    });
    console.log(result);
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
