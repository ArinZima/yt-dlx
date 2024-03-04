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
  verbose,
  torproxy,
}: {
  query: string;
  verbose?: boolean;
  torproxy?: string;
}): Promise<EngineResult> {
  try {
    let respEngine: EngineResult | undefined = undefined;
    let videoId: string | undefined = await YouTubeID(query);
    let TubeBody:
      | TypeVideo[]
      | VideoInfoType
      | TypePlaylist[]
      | PlaylistInfoType;
    console.log(
      colors.green("@info:"),
      "using",
      colors.green("yt-dlx"),
      "version",
      colors.green(version)
    );
    if (!videoId) {
      TubeBody = (await core.search.SearchVideos({
        type: "video",
        verbose,
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
        respEngine = await Engine({ query: TubeBody[0].videoLink, torproxy });
      }
    } else {
      TubeBody = (await core.search.VideoInfo({
        verbose,
        query,
      })) as VideoInfoType;
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
        respEngine = await Engine({ query: TubeBody.videoLink, torproxy });
      }
    }
    if (respEngine === undefined) {
      throw new Error(
        colors.red("@error: ") + "Unable to get response from YouTube..."
      );
    } else return respEngine;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else {
      throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}
