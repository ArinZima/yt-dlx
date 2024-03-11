import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../web";
import web from "../web";
import colors from "colors";
import niptor from "./niptor";
import Engine from "./Engine";
import YouTubeID from "../web/YouTubeId";
import { version } from "../../package.json";
import type EngineResult from "../interface/EngineResult";

export default async function Agent({
  query,
  verbose,
  autoSocks5,
}: {
  query: string;
  verbose?: boolean;
  autoSocks5?: boolean;
}): Promise<EngineResult> {
  try {
    let nipTor;
    let ipAddress: string | undefined;
    switch (autoSocks5) {
      case true:
        nipTor = await niptor([
          "-c",
          "sudo systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com",
        ]);
        if (nipTor.stdout.trim().length > 0) {
          console.log(
            colors.green("@niptor:"),
            "new tor ip",
            nipTor.stdout.trim()
          );
          console.log(colors.green("@niptor:\n"), nipTor.stderr.trim());
          ipAddress = nipTor.stdout.trim();
        } else throw new Error("Unable to connect to Tor.");
        break;
      default:
        nipTor = await niptor(["-c", "curl https://checkip.amazonaws.com"]);
        ipAddress = nipTor.stdout.trim();
        break;
    }
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
      TubeBody = (await web.search.SearchVideos({
        type: "video",
        autoSocks5,
        verbose,
        query,
      })) as TypeVideo[];
      if (!TubeBody[0]) {
        throw new Error("Unable to get response from YouTube.");
      } else {
        console.log(
          colors.green("@info:"),
          `preparing payload for`,
          colors.green(TubeBody[0].title as string)
        );
        respEngine = await Engine({
          query: TubeBody[0].videoLink,
          autoSocks5,
          ipAddress,
        });
        return respEngine;
      }
    } else {
      TubeBody = (await web.search.VideoInfo({
        autoSocks5,
        verbose,
        query,
      })) as VideoInfoType;
      if (!TubeBody) {
        throw new Error("Unable to get response from YouTube.");
      } else {
        console.log(
          colors.green("@info:"),
          `preparing payload for`,
          colors.green(TubeBody.title)
        );
        respEngine = await Engine({
          query: TubeBody.videoLink,
          autoSocks5,
          ipAddress,
        });
        return respEngine;
      }
    }
  } catch (error: any) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("internal server error");
  }
}
