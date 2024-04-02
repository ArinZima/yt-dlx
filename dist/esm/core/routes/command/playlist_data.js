import colors from "colors";
import web from "../../web";
import YouTubeID from "../../web/YouTubeId";
/**
 * Extracts metadata for videos in a YouTube playlist.
 *
 * @param query - The YouTube playlist URL or ID for which to extract metadata.
 * @returns A Promise that resolves with the metadata of videos in the playlist.
 * @throws An error if the playlist link is incorrect or if unable to get a response.
 */
export default async function playlist_data({ query, }) {
    const playlistId = await YouTubeID(query);
    if (!playlistId) {
        throw new Error(colors.red("@error: ") + "incorrect playlist link");
    }
    else {
        const metaData = await web.browserLess.playlistVideos({ playlistId });
        if (!metaData) {
            throw new Error(colors.red("@error: ") + "Unable to get response!");
        }
        else
            return metaData;
    }
}
//# sourceMappingURL=playlist_data.js.map