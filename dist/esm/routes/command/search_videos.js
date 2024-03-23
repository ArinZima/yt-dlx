import colors from "colors";
import web from "../../web";
import YouTubeID from "../../web/YouTubeId";
/**
 * Searches for YouTube videos based on the query.
 *
 * @param query - The search query for videos.
 * @returns A Promise that resolves with the search results for videos.
 * @throws An error if the input is a video link (use video_data instead) or if unable to get a response.
 */
export default async function search_videos({ query, }) {
    const isID = await YouTubeID(query);
    if (isID) {
        throw new Error(colors.red("@error: ") + "use video_data() for video link!");
    }
    else {
        const metaData = await web.browserLess.searchVideos({ query });
        if (!metaData) {
            throw new Error(colors.red("@error: ") + "Unable to get response!");
        }
        else
            return metaData;
    }
}
