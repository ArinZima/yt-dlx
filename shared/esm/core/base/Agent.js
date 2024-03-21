var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import web from "../web";
import colors from "colors";
import niptor from "./niptor";
import Engine from "./Engine";
import YouTubeID from "../web/YouTubeId";
import { version } from "../../package.json";
export default function Agent(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var nipTor, ipAddress, TubeBody, respEngine, videoId;
        var query = _b.query, verbose = _b.verbose, onionTor = _b.onionTor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log(colors.green("@info:"), "using", colors.green("yt-dlx"), "version", colors.green(version));
                    verbose;
                    ipAddress = undefined;
                    return [4 /*yield*/, niptor(["curl https://checkip.amazonaws.com --insecure"])];
                case 1:
                    nipTor = _c.sent();
                    console.log(colors.green("@info:"), "system", colors.green("ipAddress"), nipTor.stdout.trim());
                    ipAddress = nipTor.stdout.trim();
                    if (!onionTor) return [3 /*break*/, 3];
                    return [4 /*yield*/, niptor([
                            "systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com --insecure",
                        ])];
                case 2:
                    nipTor = _c.sent();
                    if (nipTor.stdout.trim().length > 0) {
                        console.log(colors.green("@info:"), "socks5", colors.green("ipAddress"), nipTor.stdout.trim());
                        ipAddress = nipTor.stdout.trim();
                    }
                    else
                        throw new Error("Unable to connect to Tor.");
                    _c.label = 3;
                case 3:
                    respEngine = undefined;
                    return [4 /*yield*/, YouTubeID(query)];
                case 4:
                    videoId = _c.sent();
                    if (!!videoId) return [3 /*break*/, 9];
                    return [4 /*yield*/, web.browserLess.searchVideos({ query: query })];
                case 5:
                    TubeBody = _c.sent();
                    if (!!TubeBody[0]) return [3 /*break*/, 6];
                    throw new Error("Unable to get response!");
                case 6:
                    console.log(colors.green("@info:"), "preparing payload for", colors.green(TubeBody[0].title));
                    return [4 /*yield*/, Engine({
                            query: "https://www.youtube.com/watch?v=".concat(TubeBody[0].id),
                            onionTor: onionTor,
                            ipAddress: ipAddress,
                        })];
                case 7:
                    respEngine = _c.sent();
                    return [2 /*return*/, respEngine];
                case 8: return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, web.browserLess.singleVideo({ videoId: videoId })];
                case 10:
                    TubeBody = _c.sent();
                    if (!!TubeBody) return [3 /*break*/, 11];
                    throw new Error("Unable to get response!");
                case 11:
                    console.log(colors.green("@info:"), "preparing payload for", colors.green(TubeBody.title));
                    return [4 /*yield*/, Engine({
                            query: "https://www.youtube.com/watch?v=".concat(TubeBody.id),
                            onionTor: onionTor,
                            ipAddress: ipAddress,
                        })];
                case 12:
                    respEngine = _c.sent();
                    return [2 /*return*/, respEngine];
                case 13: return [2 /*return*/];
            }
        });
    });
}
