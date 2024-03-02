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
  let respEngine: EngineResult | undefined = undefined;
  let videoId: string | undefined = await YouTubeID(query);
  let TubeBody: TypeVideo[] | VideoInfoType | TypePlaylist[] | PlaylistInfoType;
  console.log(colors.green("@info:"), `using yt-dlx version ${version}`);
  if (!videoId) {
    TubeBody = (await core.search.SearchVideos({
      type: "video",
      query,
    })) as TypeVideo[];
    if (!TubeBody[0]) {
      throw new Error(
        colors.red("@error: ") + "Unable to get response from YouTube..."
      );
    } else {
      console.log(
        colors.green("@info:"),
        `preparing payload for`,
        colors.green(TubeBody[0].title as string)
      );
      respEngine = await Engine(TubeBody[0].videoLink);
    }
  } else {
    TubeBody = (await core.search.VideoInfo({ query })) as VideoInfoType;
    if (!TubeBody) {
      throw new Error(
        colors.red("@error: ") + "Unable to get response from YouTube..."
      );
    } else {
      console.log(
        colors.green("@info:"),
        `preparing payload for`,
        colors.green(TubeBody.title)
      );
      respEngine = await Engine(TubeBody.videoLink);
    }
  }
  if (respEngine === undefined) {
    throw new Error(
      colors.red("@error: ") + "Unable to get response from YouTube..."
    );
  } else return respEngine;
}
