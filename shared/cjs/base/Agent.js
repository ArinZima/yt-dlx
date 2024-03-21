"use strict";
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
const web_1 = __importDefault(require("../web"));
const colors_1 = __importDefault(require("colors"));
const niptor_1 = __importDefault(require("./niptor"));
const Engine_1 = __importDefault(require("./Engine"));
const YouTubeId_1 = __importDefault(require("../web/YouTubeId"));
function Agent(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, verbose, onionTor, }) {
        // console.log(
        // colors.green("@info:"),
        // "using",
        // colors.green("yt-dlx"),
        // "version",
        // colors.green(version)
        // );
        verbose;
        let nipTor;
        let ipAddress = undefined;
        nipTor = yield (0, niptor_1.default)(["curl https://checkip.amazonaws.com --insecure"]);
        console.log(colors_1.default.green("@info:"), "system", colors_1.default.green("ipAddress"), nipTor.stdout.trim());
        ipAddress = nipTor.stdout.trim();
        if (onionTor) {
            nipTor = yield (0, niptor_1.default)([
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
        let videoId = yield (0, YouTubeId_1.default)(query);
        if (!videoId) {
            TubeBody = yield web_1.default.browserLess.searchVideos({ query });
            if (!TubeBody[0])
                throw new Error("Unable to get response!");
            else {
                console.log(colors_1.default.green("@info:"), `preparing payload for`, colors_1.default.green(TubeBody[0].title));
                respEngine = yield (0, Engine_1.default)({
                    query: `https://www.youtube.com/watch?v=${TubeBody[0].id}`,
                    onionTor,
                    ipAddress,
                });
                return respEngine;
            }
        }
        else {
            TubeBody = yield web_1.default.browserLess.singleVideo({ videoId });
            if (!TubeBody)
                throw new Error("Unable to get response!");
            else {
                console.log(colors_1.default.green("@info:"), `preparing payload for`, colors_1.default.green(TubeBody.title));
                respEngine = yield (0, Engine_1.default)({
                    query: `https://www.youtube.com/watch?v=${TubeBody.id}`,
                    onionTor,
                    ipAddress,
                });
                return respEngine;
            }
        }
    });
}
exports.default = Agent;
