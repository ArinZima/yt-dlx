import colors from "colors";
import YouTubeID from "../../web/YouTubeId";
import web, { playlistVideosType } from "../../web";

interface ipop {
  query: string;
}
export default async function playlist_data({
  query,
}: ipop): Promise<playlistVideosType> {
  const playlistId = await YouTubeID(query);
  if (!playlistId) {
    throw new Error(colors.red("@error: ") + "incorrect playlist link");
  } else {
    const metaData = await web.browserLess.playlistVideos({ playlistId });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
