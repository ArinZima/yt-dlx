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
import web from "../../web";
import YouTubeID from "../../web/YouTubeId";
/**
 * Searches for YouTube videos based on the query.
 *
 * @param query - The search query for videos.
 * @returns A Promise that resolves with the search results for videos.
 * @throws An error if the input is a video link (use video_data instead) or if unable to get a response.
 */
export default function search_videos(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, }) {
        const isID = yield YouTubeID(query);
        if (isID) {
            throw new Error(colors.red("@error: ") + "use video_data() for video link!");
        }
        else {
            const metaData = yield web.browserLess.searchVideos({ query });
            if (!metaData) {
                throw new Error(colors.red("@error: ") + "Unable to get response!");
            }
            else
                return metaData;
        }
    });
}
