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
    colors.bold.green("INFO: ") +
      "⭕ using yt-core version <(" +
      version +
      ")>" +
      colors.reset("")
  );

  if (!query || query.trim() === "") {
    console.log(
      colors.bold.red("ERROR: ") +
        "❌ 'query' is required..." +
        colors.reset("")
    );
    return;
  }
  if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors.bold.red("ERROR: ") +
        "❌ use extract_playlist_videos() for playlists..." +
        colors.reset("")
    );
    return;
  }
  if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors.bold.green("INFO: ") +
        "⭕ fetching metadata for: <(" +
        query +
        ")>" +
        colors.reset("")
    );
    videoId = await YouTubeID(query);
  } else {
    function isYouTubeID(input: string): string | null {
      const regex = /^[a-zA-Z0-9_-]{11}$/;
      const match = input.match(regex);
      if (match) return match[0];
      else return null;
    }
    videoId = isYouTubeID(query);
  }
  if (videoId) {
    TubeBody = await scrape(videoId);
    if (TubeBody === null) {
      console.log(
        colors.bold.red("ERROR: ") +
          "❌ no data returned from server..." +
          colors.reset("")
      );
      return;
    } else {
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          "📡 preparing payload for <(" +
          TubeBody.Title +
          "Author:" +
          TubeBody.Uploader +
          ")>" +
          colors.reset("")
      );
      TubeCore = await ytCore(TubeBody.Link);
    }
  } else {
    TubeBody = await scrape(query);
    if (TubeBody === null) {
      console.log(
        colors.bold.red("ERROR: ") +
          "❌ no data returned from server..." +
          colors.reset("")
      );
      return;
    } else {
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors.bold.green("INFO: ") +
          "📡 preparing payload for <(" +
          TubeBody.Title +
          "Author:" +
          TubeBody.Uploader +
          ")>" +
          colors.reset("")
      );
      TubeCore = await ytCore(TubeBody.Link);
    }
  }
  if (TubeCore === null) {
    console.log(
      colors.bold.red("ERROR: ") +
        "❌ please try again later..." +
        colors.reset("")
    );
    return Promise.resolve(null);
  } else {
    console.log(
      colors.bold.green("INFO: ") +
        "❣️ Thank you for using yt-core! If you enjoy the project, consider Staring the GitHub repo https://github.com/shovitdutta/mixly/yt-core." +
        colors.reset("")
    );
    return Promise.resolve(JSON.parse(TubeCore));
  }
}
