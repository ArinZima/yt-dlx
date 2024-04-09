import colors from "colors";
import { Client } from "youtubei";
import EventEmitter from "eventemitter3";
class Emitter extends EventEmitter {
}
export default async function relatedVideos({ videoId }) {
    try {
        var youtube = new Client();
        var emitter = new Emitter();
        var relatedVideos = await youtube.getVideo(videoId);
        var result = relatedVideos.related.items.map((item) => ({
            id: item.id,
            title: item.title,
            isLive: item.isLive,
            duration: item.duration,
            uploadDate: item.uploadDate,
            thumbnails: item.thumbnails,
        }));
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
//# sourceMappingURL=relatedVideos.js.map