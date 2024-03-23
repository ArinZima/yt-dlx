"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = __importDefault(require("../web"));
const colors_1 = __importDefault(require("colors"));
const niptor_1 = __importDefault(require("./niptor"));
const Engine_1 = __importDefault(require("./Engine"));
const YouTubeId_1 = __importDefault(require("../web/YouTubeId"));
/**
 * Fetches data for a YouTube video or search query using yt-dlx.
 *
 * @param query - The YouTube video ID, link, or search query.
 * @param verbose - Optional flag to enable verbose mode.
 * @param onionTor - Optional flag to use Tor network.
 * @returns A Promise that resolves with the engine output containing video metadata.
 * @throws An error if unable to get a response or encounter issues with Tor connection.
 */
async function Agent({ query, verbose, onionTor, }) {
    let nipTor;
    let ipAddress = undefined;
    nipTor = await (0, niptor_1.default)(["curl https://checkip.amazonaws.com --insecure"]);
    console.log(colors_1.default.green("@info:"), "system", colors_1.default.green("ipAddress"), nipTor.stdout.trim());
    ipAddress = nipTor.stdout.trim();
    if (onionTor) {
        nipTor = await (0, niptor_1.default)([
            "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
        ]);
        if (nipTor.stdout.trim().length > 0) {
            console.log(colors_1.default.green("@info:"), "socks5", colors_1.default.green("ipAddress"), nipTor.stdout.trim());
            ipAddress = nipTor.stdout.trim();
        }
        else
            throw new Error("Unable to connect to Tor.");
    }
    let TubeBody;
    let respEngine = undefined;
    let videoId = await (0, YouTubeId_1.default)(query);
    if (!videoId) {
        TubeBody = await web_1.default.browserLess.searchVideos({ query });
        if (!TubeBody[0])
            throw new Error("Unable to get response!");
        else {
            console.log(colors_1.default.green("@info:"), `preparing payload for`, colors_1.default.green(TubeBody[0].title));
            respEngine = await (0, Engine_1.default)({
                query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
                onionTor,
                ipAddress,
            });
            return respEngine;
        }
    }
    else {
        TubeBody = await web_1.default.browserLess.singleVideo({ videoId });
        if (!TubeBody)
            throw new Error("Unable to get response!");
        else {
            console.log(colors_1.default.green("@info:"), `preparing payload for`, colors_1.default.green(TubeBody.title));
            respEngine = await (0, Engine_1.default)({
                query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
                onionTor,
                ipAddress,
            });
            return respEngine;
        }
    }
}
exports.default = Agent;
//# sourceMappingURL=Agent.js.map