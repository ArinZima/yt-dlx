import * as z from "zod";
import colors from "colors";
import web from "../../web";
import Engine from "../../base/agent";

interface extract_playlist_videosOC {
  playlistUrls: string[];
}

export default async function extract_playlist_videos({
  playlistUrls,
}: extract_playlist_videosOC): Promise<any> {
  try {
    const proTubeArr: any = [];
    const processedVideoIds = new Set();
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
      const resp = await web.search.PlaylistInfo({
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
          const videoId = resp.playlistVideos[i]?.videoId;
          if (videoId === undefined) continue;
          if (processedVideoIds.has(videoId)) continue;
          const data = await Engine({ query: videoId });
          if (data instanceof Array) proTubeArr.push(...data);
          else proTubeArr.push(data);
          processedVideoIds.add(videoId);
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
