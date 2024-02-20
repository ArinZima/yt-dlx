import * as z from "zod";
import colors from "colors";
import Engine from "../../base/agent";
import scrape from "../../base/scrape";

interface extract_playlist_videosOC {
  playlistUrls: string[];
}

export default async function extract_playlist_videos({
  playlistUrls,
}: extract_playlist_videosOC): Promise<any> {
  try {
    const proTubeArr: any = [];
    const processedVideoIds = new Set();
    for (const url of playlistUrls) {
      const ispUrl: any = url.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors.bold.red("ERROR: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp: any = (await scrape(ispUrl[1])).stdout;
      if (!resp) {
        console.error(
          colors.bold.red("ERROR: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.videos.length; i++) {
        try {
          const videoId = resp.videos[i].videoId;
          if (processedVideoIds.has(videoId)) continue;
          const data = await Engine({ query: videoId });
          if (data instanceof Array) proTubeArr.push(...data);
          else proTubeArr.push(data);
          processedVideoIds.add(videoId);
        } catch (error) {
          console.error(colors.bold.red("ERROR: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z.ZodError ? error.errors : error;
  }
}
