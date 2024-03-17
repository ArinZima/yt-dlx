import colors from "colors";
import web from "../../web";
import * as async from "async";
import ytdlx from "../../base/Agent";
import YouTubeID from "../../web/YouTubeId";
import type { PlaylistInfoType } from "../../web/";
import type EngineResult from "../../interface/EngineResult";

export default async function extract_playlist_videos({
  autoSocks5,
  playlistUrls,
}: {
  autoSocks5?: boolean;
  playlistUrls: string[];
}): Promise<EngineResult[]> {
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
      const resp: PlaylistInfoType | undefined = await web.search.PlaylistInfo({
        query,
        autoSocks5,
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
    "❣️ Thank you for using",
    colors.green("yt-dlx."),
    "Consider",
    colors.green("🌟starring"),
    "the github repo",
    colors.green("https://github.com/yt-dlx\n")
  );
  return metaTubeArr;
}
