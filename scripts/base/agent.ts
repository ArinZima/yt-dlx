import ytxc from "./ytxc";
import colors from "colors";
import YouTubeID from "../web/YouTubeId";
import ytdlx_web from "../web/ytdlx_web";
import { version } from "../../package.json";

export default async function Engine({
  query,
}: {
  query: string;
}): Promise<any | null> {
  let videoId: string | null, TubeDlp: any, TubeBody: any;
  console.log(
    colors.bold.green("@info: ") +
      `using yt-dlx version <(${version})>` +
      colors.reset("")
  );
  if (!query || query.trim() === "") {
    console.log(
      colors.bold.red("@error: ") + "'query' is required..." + colors.reset("")
    );
    return null;
  } else if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors.bold.red("@error: ") +
        "use extract_playlist_videos() for playlists..." +
        colors.reset("")
    );
    return null;
  } else if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors.bold.green("@info: ") +
        `fetching metadata for: <(${query})>` +
        colors.reset("")
    );
    videoId = await YouTubeID(query);
  } else videoId = await YouTubeID(query);
  switch (videoId) {
    case null:
      TubeBody = await ytdlx_web.SearchVideos({ query: query, type: "video" });
      if (TubeBody === null) {
        console.log(
          colors.bold.red("@error: ") +
            "no data returned from server..." +
            colors.reset("")
        );
        return null;
      }
      console.log(
        colors.bold.green("@info: ") +
          `preparing payload for <(${TubeBody[0].title} Author: ${TubeBody[0].author})>` +
          colors.reset("")
      );
      TubeDlp = await ytxc(TubeBody[0].videoLink);
      break;
    default:
      TubeBody = await ytdlx_web.VideoInfo({ query: query });
      if (TubeBody === null) {
        console.log(
          colors.bold.red("@error: ") +
            "no data returned from server..." +
            colors.reset("")
        );
        return null;
      }
      console.log(
        colors.bold.green("@info: ") +
          `preparing payload for <(${TubeBody.title} Author: ${TubeBody.author})>` +
          colors.reset("")
      );
      TubeDlp = await ytxc(TubeBody.videoLink);
      break;
  }
  switch (TubeDlp) {
    case null:
      console.log(
        colors.bold.red("@error: ") +
          "no data returned from server..." +
          colors.reset("")
      );
      return null;
    default:
      console.log(
        colors.bold.green("@info:"),
        "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/shovitdutta/yt-dlx"
      );
      return JSON.parse(TubeDlp);
  }
}
