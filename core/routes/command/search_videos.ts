import colors from "colors";
import web, { searchVideosType } from "../../web";
import YouTubeID from "../../web/YouTubeId";

interface ipop {
  query: string;
}
export default async function search_videos({
  query,
}: ipop): Promise<searchVideosType> {
  const isID = await YouTubeID(query);
  if (isID) {
    throw new Error(
      colors.red("@error: ") + "use video_data() for video link!"
    );
  } else {
    const metaData = await web.browserLess.searchVideos({ query });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
