"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const web_1 = __importDefault(require("../../web"));
const async = __importStar(require("async"));
const Agent_1 = __importDefault(require("../../base/Agent"));
const YouTubeId_1 = __importDefault(require("../../web/YouTubeId"));
function extract_playlist_videos(_a) {
    return __awaiter(this, arguments, void 0, function* ({ playlistUrls, }) {
        let counter = 0;
        const metaTubeArr = [];
        yield async.eachSeries(playlistUrls, (listLink) => __awaiter(this, void 0, void 0, function* () {
            const query = yield (0, YouTubeId_1.default)(listLink);
            if (query === undefined) {
                console.error(colors_1.default.bold.red("@error: "), "invalid youtube playlist url:", listLink);
                return;
            }
            else {
                const playlistId = yield (0, YouTubeId_1.default)(query);
                if (!playlistId) {
                    console.error(colors_1.default.bold.red("@error: "), "incorrect playlist link.", query);
                    return;
                }
                const resp = yield web_1.default.browserLess.playlistVideos({
                    playlistId,
                });
                if (!resp) {
                    console.error(colors_1.default.bold.red("@error: "), "unable to get response from youtube for", query);
                    return;
                }
                else {
                    console.log(colors_1.default.green("@info:"), "total videos in playlist", colors_1.default.green(resp.playlistTitle), resp.playlistVideoCount);
                    yield async.eachSeries(resp.playlistVideos, (vid) => __awaiter(this, void 0, void 0, function* () {
                        const metaTube = yield (0, Agent_1.default)({
                            query: vid.videoLink,
                        });
                        counter++;
                        console.log(colors_1.default.green("@info:"), "added", counter + "/" + resp.playlistVideoCount);
                        metaTubeArr.push(metaTube);
                    }));
                }
            }
        }));
        console.log(colors_1.default.green("@info:"), "❣️ Thank you for using", colors_1.default.green("yt-dlx."), "Consider", colors_1.default.green("🌟starring"), "the github repo", colors_1.default.green("https://github.com/yt-dlx\n"));
        return metaTubeArr;
    });
}
exports.default = extract_playlist_videos;
