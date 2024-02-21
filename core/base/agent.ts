import colors from "colors";
import scrape from "./scrape";
import ytCore from "./ytCore";
import YouTubeID from "@shovit/ytid";
import { version } from "../../package.json";

export default async function Engine({
  query,
}: {
  query: string;
}): Promise<any> {
  let videoId: string | null, TubeCore: any, TubeBody;
  console.log(
    colors.bold.green("\n\nINFO: ") +
      `⭕ using yt-core version <(${version})>` +
      colors.reset("")
  );

  if (!query || query.trim() === "") {
    console.log(
      colors.bold.red("ERROR: ") +
        "❗ 'query' is required..." +
        colors.reset("")
    );
    return;
  }

  if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors.bold.red("ERROR: ") +
        "❗ use extract_playlist_videos() for playlists..." +
        colors.reset("")
    );
    return;
  } else if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors.bold.green("INFO: ") +
        `⭕ fetching metadata for: <(${query})>` +
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
            "❗ no data returned from server..." +
            colors.reset("")
        );
        return;
      }
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          `📡 preparing payload for <(${TubeBody[0].Title} Author: ${TubeBody[0].Uploader})>` +
          colors.reset("")
      );
      TubeCore = await ytCore(TubeBody[0].Link);
      break;
    default:
      TubeBody = await scrape(videoId);
      if (TubeBody === null) {
        console.log(
          colors.bold.red("ERROR: ") +
            "❗ no data returned from server..." +
            colors.reset("")
        );
        return;
      }
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          `📡 preparing payload for <(${TubeBody.Title} Author: ${TubeBody.Uploader})>` +
          colors.reset("")
      );
      TubeCore = await ytCore(TubeBody.Link);
      break;
  }

  switch (TubeCore) {
    case null:
      console.log(
        colors.bold.red("ERROR: ") +
          "❗ no data returned from server..." +
          colors.reset("")
      );
      break;
    default:
      console.log(
        colors.bold.green("INFO:"),
        "❣️ Thank you for using yt-core! If you enjoy the project, consider starring the GitHub repo: https://github.com/shovitdutta/yt-core"
      );
      return JSON.parse(TubeCore);
  }
}
