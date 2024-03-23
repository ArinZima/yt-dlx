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
 * Searches for YouTube playlists based on the query.
 *
 * @param query - The search query for playlists.
 * @returns A Promise that resolves with the search results for playlists.
 * @throws An error if the input is a playlist link (use playlist_data instead) or if unable to get a response.
 */
export default function search_playlists(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, }) {
        const isID = yield YouTubeID(query);
        if (isID) {
            throw new Error(colors.red("@error: ") + "use playlist_data() for playlist link!");
        }
        else {
            const metaData = yield web.browserLess.searchPlaylists({ query });
            if (!metaData) {
                throw new Error(colors.red("@error: ") + "Unable to get response!");
            }
            else
                return metaData;
        }
    });
}
