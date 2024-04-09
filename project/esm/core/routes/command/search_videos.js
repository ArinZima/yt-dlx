import colors from "colors";
import EventEmitter from "eventemitter3";
import YouTubeID from "../../web/YouTubeId";
import web from "../../web";
/**
 * Searches for YouTube videos based on the query.
 *
 * @param query - The search query for videos.
 * @returns A Promise that resolves with the search results for videos.
 * @throws An error if the input is a video link (use video_data instead) or if unable to get a response.
 */
class Emitter extends EventEmitter {
}
export default async function search_videos({ query, }) {
    var emitter = new Emitter();
    var isID = await YouTubeID(query);
    if (isID) {
        throw new Error(colors.red("@error: ") + "use video_data() for video link!");
    }
    else {
        var metaData = await web.searchVideos({ query });
        if (!metaData) {
            throw new Error(colors.red("@error: ") + "Unable to get response!");
        }
        else
            return metaData;
    }
}
//# sourceMappingURL=search_videos.js.map