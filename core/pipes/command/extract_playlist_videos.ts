import colors from "colors";
import web from "../../web";
import * as async from "async";
import { ZodError } from "zod";
import YouTubeID from "../../web/YouTubeId";
import type { PlaylistInfoType } from "../../web/";

export default async function extract_playlist_videos({
  playlistUrls,
}: {
  playlistUrls: string[];
}): Promise<PlaylistInfoType[]> {
  try {
    const proTubeArr: PlaylistInfoType[] = [];
    await async.eachSeries(playlistUrls, async (videoLink) => {
      const query: string | undefined = await YouTubeID(videoLink);
      if (query === undefined) {
        console.error(
          colors.bold.red("@error: "),
          "invalid youtube playlist url:",
          videoLink
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
      }
      proTubeArr.push(resp);
    });
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
