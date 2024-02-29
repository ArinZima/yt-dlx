import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../web";
import core from "../web";
import colors from "colors";
import Engine from "./Engine";
import YouTubeID from "../web/YouTubeId";
import { version } from "../../package.json";
import type EngineResult from "../interface/EngineResult";

export default async function Agent({
  query,
}: {
  query: string;
}): Promise<EngineResult> {
  try {
    let videoId: string | null;
    let respEngine: EngineResult | null = null;
    let TubeBody:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;
    console.log(
      colors.bold.green("@info: ") + `using yt-dlx version ${version}`
    );
    switch (true) {
      case !query || query.trim() === "":
        throw new Error(colors.bold.red("@error: ") + "'query' is required.");
      case /https/i.test(query) && /list/i.test(query):
        throw new Error(
          colors.bold.red("@error: ") + "use extract_playlist_videos()."
        );
      case /https/i.test(query) && !/list/i.test(query):
        videoId = await YouTubeID(query);
        break;
      default:
        videoId = await YouTubeID(query);
    }
    console.log(
      colors.bold.green("@info: ") + `fetching metadata for ${query}`
    );
    switch (videoId) {
      case null:
        TubeBody = (await core.search.SearchVideos({
          query: query,
          type: "video",
        })) as TypeVideo[];
        if (!TubeBody || TubeBody.length === 0) {
          throw new Error(
            colors.bold.red("@error: ") + "no data returned from server."
          );
        } else if (TubeBody[0]) {
          console.log(
            colors.bold.green("@info: ") +
              `preparing payload for ${TubeBody[0].title}`
          );
          respEngine = await Engine(TubeBody[0].videoLink);
        } else {
          throw new Error(
            colors.bold.red("@error: ") + "no data returned from server."
          );
        }
        break;
      default:
        TubeBody = (await core.search.VideoInfo({
          query: query,
        })) as VideoInfoType;
        if (!TubeBody) {
          throw new Error(
            colors.bold.red("@error: ") + "no data returned from server."
          );
        }
        console.log(
          colors.bold.green("@info: ") +
            `preparing payload for ${TubeBody.title}`
        );
        respEngine = await Engine(TubeBody.videoLink);
        break;
    }
    switch (respEngine) {
      case null:
        throw new Error(
          colors.bold.red("@error: ") + "no data returned from server."
        );
      default:
        console.log(
          colors.bold.green("@info:"),
          "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
        );
        return respEngine;
    }
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else {
      throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}
