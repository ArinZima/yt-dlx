import ytdlx from "yt-dlx";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "ytSearch video single");
    const result = await ytdlx.ytSearch.Video.Single({
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    console.log(result);
  } catch (error) {
    console.error(colors.red(error.message));
  }
})();
