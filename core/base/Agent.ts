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
  verbose,
  torproxy,
}: {
  query: string;
  verbose?: boolean;
  torproxy?: string;
}): Promise<EngineResult> {
  try {
    const child = spawn("sh", [
      "-c",
      "sudo systemctl restart tor && sleep 2 && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com",
    ]);
    return new Promise((resolve, reject) => {
      child.stdout.on("data", (data) => {
        console.log(colors.green("@info:"), data.toString());
      });
      child.on("close", async (code) => {
        if (code !== 0) throw new Error("internal server error");
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
            torproxy,
            verbose,
            query,
          })) as TypeVideo[];
          if (!TubeBody[0]) {
            reject(new Error("Unable to get response from YouTube..."));
          } else {
            console.log(
              colors.green("@info:"),
              `preparing payload for`,
              colors.green(TubeBody[0].title as string)
            );
            respEngine = await Engine({
              query: TubeBody[0].videoLink,
              torproxy,
            });
            resolve(respEngine);
          }
        } else {
          TubeBody = (await web.search.VideoInfo({
            torproxy,
            verbose,
            query,
          })) as VideoInfoType;
          if (!TubeBody) {
            reject(new Error("Unable to get response from YouTube..."));
          } else {
            console.log(
              colors.green("@info:"),
              `preparing payload for`,
              colors.green(TubeBody.title)
            );
            respEngine = await Engine({
              query: TubeBody.videoLink,
              torproxy,
            });
            resolve(respEngine);
          }
        }
      });
    });
  } catch (error: any) {
    if (error instanceof Error) throw new Error(error.message);
    else throw new Error("internal server error");
  }
}
