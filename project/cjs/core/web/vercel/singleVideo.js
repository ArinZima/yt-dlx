"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const youtubei_1 = require("youtubei");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class Emitter extends eventemitter3_1.default {
}
async function singleVideo({ videoId }) {
    try {
        var youtube = new youtubei_1.Client();
        var emitter = new Emitter();
        var singleVideo = await youtube.getVideo(videoId);
        return {
            id: singleVideo.id,
            title: singleVideo.title,
            thumbnails: singleVideo.thumbnails,
            uploadDate: singleVideo.uploadDate,
            description: singleVideo.description,
            duration: singleVideo.duration,
            isLive: singleVideo.isLiveContent,
            viewCount: singleVideo.viewCount,
            channelid: singleVideo.channel.id,
            channelname: singleVideo.channel.name,
            tags: singleVideo.tags,
            likeCount: singleVideo.likeCount,
        };
    }
    catch (error) {
        throw new Error(colors_1.default.red("@error: ") + error.message);
    }
}
exports.default = singleVideo;
//# sourceMappingURL=singleVideo.js.map