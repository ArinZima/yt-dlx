import * as z from "zod";
import core from "../../";
import colors from "colors";

interface get_playlistOC {
  playlistUrls: string[];
}
interface metaVideo {
  thumbnailUrls: string[];
  videoLink: string;
  uploadOn: string;
  videoId: string;
  author: string;
  title: string;
  views: string;
}
export default async function get_playlist({
  playlistUrls,
}: get_playlistOC): Promise<any> {
  try {
    const proTubeArr: metaVideo[] = [];
    const preTube = new Set<string>();
    for (const videoLink of playlistUrls) {
      const ispUrl: any = videoLink.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors.bold.red("@error: "),
          "Invalid YouTube Playlist URL:",
          videoLink
        );
        continue;
      }
      const resp = await core.search.PlaylistInfo({
        query: ispUrl[1],
      });
      if (resp === undefined) {
        console.error(
          colors.bold.red("@error: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.playlistVideos.length; i++) {
        try {
          const videoLink = resp.playlistVideos[i]?.videoLink;
          if (videoLink === undefined) continue;
          const metaTube = await core.search.VideoInfo({ query: videoLink });
          if (metaTube === undefined) continue;
          console.log(
            colors.bold.green("INFO:"),
            colors.bold.green("<("),
            metaTube.title,
            colors.bold.green("by"),
            metaTube.author,
            colors.bold.green(")>")
          );
          if (preTube.has(metaTube.videoId)) continue;
          proTubeArr.push({ ...metaTube });
        } catch (error) {
          console.error(colors.bold.red("@error: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z.ZodError ? error.errors : error;
  }
}
