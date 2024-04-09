import colors from "colors";
import EventEmitter from "eventemitter3";
import YouTubeID from "../../web/YouTubeId";
import web, { singleVideoType } from "../../web";

/**
 * Fetches data for a single YouTube video based on the video ID or link.
 *
 * @param query - The video ID or link.
 */
class Emitter extends EventEmitter {}
export default async function video_data({
  query,
}: {
  query: string;
}): Promise<singleVideoType> {
  var emitter = new Emitter();
  var videoId = await YouTubeID(query);
  if (!videoId) {
    throw new Error(colors.red("@error: ") + "incorrect playlist link");
  } else {
    var metaData = await web.singleVideo({ videoId });
    if (!metaData) {
      throw new Error(colors.red("@error: ") + "Unable to get response!");
    } else return metaData;
  }
}
