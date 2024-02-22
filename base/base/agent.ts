import colors from "colors";
import scrape from "./scrape";
import ytDlp from "./ytdlp";
import YouTubeID from "@shovit/ytid";
import { version } from "../../package.json";

export default async function Engine({
  query,
}: {
  query: string;
}): Promise<any | null> {
  let videoId: string | null, TubeDlp: any, TubeBody: any;
  console.log(
    colors.bold.green("\n\nINFO: ") +
      `⭕ using yt-dlp version <(${version})>` +
      colors.reset("")
  );
  if (!query || query.trim() === "") {
    console.log(
      colors.bold.red("ERROR: ") + "❗'query' is required..." + colors.reset("")
    );
    return null;
  } else if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors.bold.red("ERROR: ") +
        "❗use extract_playlist_videos() for playlists..." +
        colors.reset("")
    );
    return null;
  } else if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors.bold.green("INFO: ") +
        `🛰️ fetching metadata for: <(${query})>` +
        colors.reset("")
    );
    videoId = await YouTubeID(query);
  } else videoId = await YouTubeID(query);
  switch (videoId) {
    case null:
      TubeBody = await scrape(query);
      if (TubeBody === null) {
        console.log(
          colors.bold.red("ERROR: ") +
            "❗no data returned from server..." +
            colors.reset("")
        );
        return null;
      } else TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          `📡preparing payload for <(${TubeBody.Title} Author: ${TubeBody.Uploader})>` +
          colors.reset("")
      );
      TubeDlp = await ytDlp(TubeBody.Link);
      break;
    default:
      TubeBody = await scrape(videoId);
      if (TubeBody === null) {
        console.log(
          colors.bold.red("ERROR: ") +
            "❗no data returned from server..." +
            colors.reset("")
        );
        return null;
      } else TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          `📡preparing payload for <(${TubeBody[0].Title} Author: ${TubeBody[0].Uploader})>` +
          colors.reset("")
      );
      TubeDlp = await ytDlp(TubeBody[0].Link);
      break;
  }
  switch (TubeDlp) {
    case null:
      console.log(
        colors.bold.red("ERROR: ") +
          "❗no data returned from server..." +
          colors.reset("")
      );
      return null;
    default:
      console.log(
        colors.bold.green("INFO:"),
        "❣️ Thank you for using yt-dlp! If you enjoy the project, consider starring the GitHub repo: https://github.com/shovitdutta/yt-dlp"
      );
      return JSON.parse(TubeDlp);
  }
}
