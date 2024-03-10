import colors from "colors";
import web from "../../web";
import * as async from "async";
import { ZodError } from "zod";
import ytdlx from "../../base/Agent";
import YouTubeID from "../../web/YouTubeId";
import type { PlaylistInfoType } from "../../web/";
import type EngineResult from "../../interface/EngineResult";

export default async function extract_playlist_videos({
  torproxy,
  playlistUrls,
}: {
  torproxy?: string;
  playlistUrls: string[];
}): Promise<EngineResult[]> {
  try {
    let counter = 0;
    const metaTubeArr: EngineResult[] = [];
    await async.eachSeries(playlistUrls, async (listLink) => {
      const query: string | undefined = await YouTubeID(listLink);
      if (query === undefined) {
        console.error(
          colors.bold.red("@error: "),
          "invalid youtube playlist url:",
          listLink
        );
        return;
      } else {
        const resp: PlaylistInfoType | undefined =
          await web.search.PlaylistInfo({
            query,
            torproxy,
          });
        if (resp === undefined) {
          console.error(
            colors.bold.red("@error: "),
            "unable to get response from youtube for",
            query
          );
          return;
        } else {
          console.log(
            colors.green("@info:"),
            "total videos in playlist",
            colors.green(resp.playlistTitle),
            resp.playlistVideoCount
          );
          await async.eachSeries(resp.playlistVideos, async (vid) => {
            const metaTube = await ytdlx({
              query: vid.videoLink,
            });
            counter++;
            console.log(
              colors.green("@info:"),
              "added",
              counter + "/" + resp.playlistVideoCount
            );
            metaTubeArr.push(metaTube);
          });
        }
      }
    });
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    return metaTubeArr;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        colors.red("@error: ") +
          error.errors.map((error) => error.message).join(", ")
      );
    } else if (error instanceof Error) {
      throw new Error(colors.red("@error: ") + error.message);
    } else throw new Error(colors.red("@error: ") + "internal server error");
  }
}
