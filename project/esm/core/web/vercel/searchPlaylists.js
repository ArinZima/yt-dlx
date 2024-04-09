import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";
class Emitter extends EventEmitter {
}
export default async function searchPlaylists({ query }) {
    try {
        var youtube = new Client();
        var emitter = new Emitter();
        var searchPlaylists = await youtube.search(query, { type: "playlist" });
        var result = searchPlaylists.items.map((item) => ({
            id: item.id,
            title: item.title,
            videoCount: item.videoCount,
            thumbnails: item.thumbnails,
        }));
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
//# sourceMappingURL=searchPlaylists.js.map