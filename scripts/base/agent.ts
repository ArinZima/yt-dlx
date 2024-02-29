import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../web";

import core from "../web";
import ytxc from "./ytxc";
import colors from "colors";
import YouTubeID from "../web/YouTubeId";
import { version } from "../../package.json";

export default async function Engine({
  query,
}: {
  query: string;
}): Promise<any | null> {
  let videoId: string | null, TubeDlp: any;
  let TubeBody: TypeVideo[] | TypePlaylist[] | VideoInfoType | PlaylistInfoType;
  console.log(colors.bold.green("@info: ") + `using yt-dlx version ${version}`);
  if (!query || query.trim() === "") {
    console.log(colors.bold.red("@error: ") + "'query' is required...");
    return null;
  } else if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors.bold.red("@error: ") +
        "use extract_playlist_videos() for playlists..."
    );
    return null;
  } else if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors.bold.green("@info: ") + `fetching metadata for: ${query}`
    );
    videoId = await YouTubeID(query);
  } else videoId = await YouTubeID(query);
  switch (videoId) {
    case null:
      TubeBody = (await core.search.SearchVideos({
        query: query,
        type: "video",
      })) as TypeVideo[];
      if (!TubeBody || TubeBody.length === 0) {
        console.log(
          colors.bold.red("@error: ") + "no data returned from server..."
        );
        return null;
      } else if (TubeBody[0]) {
        console.log(
          colors.bold.green("@info: ") +
            `preparing payload for ${TubeBody[0].title}`
        );
        TubeDlp = await ytxc(TubeBody[0].videoLink);
      }
      break;
    default:
      TubeBody = (await core.search.VideoInfo({
        query: query,
      })) as VideoInfoType;
      if (!TubeBody) {
        console.log(
          colors.bold.red("@error: ") + "no data returned from server..."
        );
        return null;
      } else {
        console.log(
          colors.bold.green("@info: ") +
            `preparing payload for ${TubeBody.title}`
        );
        TubeDlp = await ytxc(TubeBody.videoLink);
      }
      break;
  }
  switch (TubeDlp) {
    case null:
      console.log(
        colors.bold.red("@error: ") + "no data returned from server..."
      );
      return null;
    default:
      console.log(
        colors.bold.green("@info:"),
        "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
      );
      return JSON.parse(TubeDlp);
  }
}
