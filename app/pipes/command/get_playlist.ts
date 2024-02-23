import * as z from "zod";
import colors from "colors";
import search from "yt-search";

interface get_playlistOC {
  playlistUrls: string[];
}
interface metaVideo {
  title: string;
  description: string;
  url: string;
  timestamp: string;
  views: number;
  uploadDate: string;
  ago: string;
  image: string;
  thumbnail: string;
  authorName: string;
  authorUrl: string;
}
export default async function get_playlist({
  playlistUrls,
}: get_playlistOC): Promise<any> {
  try {
    const proTubeArr: metaVideo[] = [];
    const preTube = new Set<string>();
    for (const url of playlistUrls) {
      const ispUrl: any = url.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors.bold.red("@error: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp: any = await search({ listId: ispUrl[1] });
      if (!resp) {
        console.error(
          colors.bold.red("@error: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.videos.length; i++) {
        try {
          const videoId = resp.videos[i].videoId;
          const metaTube = await search({ videoId: videoId });
          console.log(
            colors.bold.green("INFO:"),
            colors.bold.green("<("),
            metaTube.title,
            colors.bold.green("by"),
            metaTube.author.name,
            colors.bold.green(")>")
          );
          if (preTube.has(metaTube.videoId)) continue;
          else {
            const {
              author: { name: authorName, url: authorUrl },
              duration,
              seconds,
              genre,
              ...newTube
            } = metaTube;
            proTubeArr.push({ ...newTube, authorName, authorUrl });
          }
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
