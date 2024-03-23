var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import web from "../web";
import colors from "colors";
import niptor from "./niptor";
import Engine from "./Engine";
import YouTubeID from "../web/YouTubeId";
/**
 * Fetches data for a YouTube video or search query using yt-dlx.
 *
 * @param query - The YouTube video ID, link, or search query.
 * @param verbose - Optional flag to enable verbose mode.
 * @param onionTor - Optional flag to use Tor network.
 * @returns A Promise that resolves with the engine output containing video metadata.
 * @throws An error if unable to get a response or encounter issues with Tor connection.
 */
export default function Agent(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, verbose, onionTor, }) {
        let nipTor;
        let ipAddress = undefined;
        nipTor = yield niptor(["curl https://checkip.amazonaws.com --insecure"]);
        console.log(colors.green("@info:"), "system", colors.green("ipAddress"), nipTor.stdout.trim());
        ipAddress = nipTor.stdout.trim();
        if (onionTor) {
            nipTor = yield niptor([
                "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
            ]);
            if (nipTor.stdout.trim().length > 0) {
                console.log(colors.green("@info:"), "socks5", colors.green("ipAddress"), nipTor.stdout.trim());
                ipAddress = nipTor.stdout.trim();
            }
            else
                throw new Error("Unable to connect to Tor.");
        }
        let TubeBody;
        let respEngine = undefined;
        let videoId = yield YouTubeID(query);
        if (!videoId) {
            TubeBody = yield web.browserLess.searchVideos({ query });
            if (!TubeBody[0])
                throw new Error("Unable to get response!");
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody[0].title));
                respEngine = yield Engine({
                    query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
                    onionTor,
                    ipAddress,
                });
                return respEngine;
            }
        }
        else {
            TubeBody = yield web.browserLess.singleVideo({ videoId });
            if (!TubeBody)
                throw new Error("Unable to get response!");
            else {
                console.log(colors.green("@info:"), `preparing payload for`, colors.green(TubeBody.title));
                respEngine = yield Engine({
                    query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
                    onionTor,
                    ipAddress,
                });
                return respEngine;
            }
        }
    });
}
