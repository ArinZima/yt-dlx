import colors from "colors";
import YouTubeID from "../../web/YouTubeId";
import web, { singleVideoType } from "../../web";

interface ipop {
  query: string;
}
export default async function video_data({
  query,
}: ipop): Promise<singleVideoType> {
  const videoId = await YouTubeID(query);
  if (!videoId) {
    throw new Error(colors.red("@error: ") + "incorrect playlist link");
  } else {
    const metaData = await web.browserLess.singleVideo({ videoId });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
