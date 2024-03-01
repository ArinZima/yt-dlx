import colors from "colors";
import web from "../../web";
import * as async from "async";
import { ZodError } from "zod";
import YouTubeID from "../../web/YouTubeId";
import type { PlaylistInfoType } from "../../web/";

export default async function get_playlist_info({
  playlistUrls,
}: {
  playlistUrls: string[];
}): Promise<PlaylistInfoType[]> {
  try {
    const proTubeArr: PlaylistInfoType[] = [];
    await async.eachSeries(playlistUrls, async (listLink) => {
      const query: string | undefined = await YouTubeID(listLink);
      if (query === undefined) {
        console.error(
          colors.bold.red("@error: "),
          "invalid youtube playlist url:",
          listLink
        );
        return;
      }
      const resp: PlaylistInfoType | undefined = await web.search.PlaylistInfo({
        query,
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
        proTubeArr.push(resp);
      }
    });
    console.log(
      colors.green("@info:"),
      "❣️ Thank you for using yt-dlx! If you enjoy the project, consider starring the GitHub repo: https://github.com/yt-dlx"
    );
    return proTubeArr;
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
