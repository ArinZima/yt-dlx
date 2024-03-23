var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import colors from "colors";
import YouTubeID from "../../web/YouTubeId";
import web from "../../web";
/**
 * Extracts metadata for videos in a YouTube playlist.
 *
 * @param query - The YouTube playlist URL or ID for which to extract metadata.
 * @returns A Promise that resolves with the metadata of videos in the playlist.
 * @throws An error if the playlist link is incorrect or if unable to get a response.
 */
export default function playlist_data(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, }) {
        const playlistId = yield YouTubeID(query);
        if (!playlistId) {
            throw new Error(colors.red("@error: ") + "incorrect playlist link");
        }
        else {
            const metaData = yield web.browserLess.playlistVideos({ playlistId });
            if (!metaData) {
                throw new Error(colors.red("@error: ") + "Unable to get response!");
            }
            else
                return metaData;
        }
    });
}
