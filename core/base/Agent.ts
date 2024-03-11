import type {
  TypeVideo,
  TypePlaylist,
  VideoInfoType,
  PlaylistInfoType,
} from "../web";
import web from "../web";
import colors from "colors";
import Engine from "./Engine";
import { spawn } from "child_process";
import YouTubeID from "../web/YouTubeId";
import { version } from "../../package.json";
import type EngineResult from "../interface/EngineResult";

export default async function Agent({
  query,
  proxy,
  verbose,
}: {
  query: string;
  proxy?: string;
  verbose?: boolean;
}): Promise<EngineResult> {
  try {
    let ipAddress: string | undefined = undefined;
    const child = spawn("sh", [
      "-c",
      "sudo systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com",
    ]);
    return new Promise((resolve) => {
      child.stdout.on("data", (data) => (ipAddress = data.toString()));
      child.on("close", async (code) => {
        if (code !== 0) throw new Error("internal server error");
        else if (!ipAddress) throw new Error("couldn't connect to tor");
        else {
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
              verbose,
              proxy,
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
                ipAddress,
                proxy,
              });
              resolve(respEngine);
            }
          } else {
            TubeBody = (await web.search.VideoInfo({
              verbose,
              proxy,
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
                ipAddress,
                proxy,
              });
              resolve(respEngine);
            }
          }
        }
      });
    });
  } catch (error: any) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("internal server error");
  }
}
