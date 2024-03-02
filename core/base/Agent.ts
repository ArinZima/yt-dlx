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
    let videoId: string | undefined;
    let respEngine: EngineResult | undefined = undefined;
    let TubeBody:
      | TypeVideo[]
      | TypePlaylist[]
      | VideoInfoType
      | PlaylistInfoType;
    console.log(colors.green("@info:"), `using yt-dlx version ${version}`);
    switch (true) {
      case !query || query.trim() === "":
        throw new Error(colors.red("@error: ") + "'query' is required.");
      case /https/i.test(query) && /list/i.test(query):
        throw new Error(
          colors.red("@error: ") + "use extract_playlist_videos()."
        );
      case /https/i.test(query) && !/list/i.test(query):
        videoId = await YouTubeID(query);
        break;
      default:
        videoId = await YouTubeID(query);
    }
    switch (videoId) {
      case undefined:
        TubeBody = (await core.search.SearchVideos({
          query: query,
          type: "video",
        })) as TypeVideo[];
        if (!TubeBody[0]) {
          throw new Error(
            colors.red("@error: ") + "no data returned from server."
          );
        } else {
          console.log(
            colors.green("@info:"),
            `preparing payload for`,
            colors.green(TubeBody[0].title as string)
          );
          respEngine = await Engine(TubeBody[0].videoLink);
        }
        break;
      default:
        TubeBody = (await core.search.VideoInfo({
          query: query,
        })) as VideoInfoType;
        if (!TubeBody) {
          throw new Error(
            colors.red("@error: ") + "no data returned from server."
          );
        } else {
          console.log(
            colors.green("@info:"),
            `preparing payload for`,
            colors.green(TubeBody.title)
          );
          respEngine = await Engine(TubeBody.videoLink);
        }
        break;
    }
    if (respEngine === undefined) {
      throw new Error(colors.red("@error: ") + "no data returned from server.");
    } else return respEngine;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else throw new Error(colors.red("@error: ") + "internal server error");
  }
}
