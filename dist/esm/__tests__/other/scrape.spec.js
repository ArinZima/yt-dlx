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
console.clear();
import web from "../../web";
import colors from "colors";
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var Tube, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                Tube = void 0;
                return [4 /*yield*/, web.browser.SearchVideos({
                        query: "PERSONAL BY PLAZA",
                        screenshot: false,
                        onionTor: true,
                        verbose: false,
                        type: "video",
                    })];
            case 1:
                Tube = (_c.sent());
                console.log(colors.green("@pass:"), "video search results received");
                return [4 /*yield*/, web.browser.VideoInfo({
                        query: (_a = Tube[0]) === null || _a === void 0 ? void 0 : _a.videoLink,
                        screenshot: false,
                        onionTor: true,
                        verbose: false,
                    })];
            case 2:
                Tube = (_c.sent());
                console.log(colors.green("@pass:"), "single video data received");
                return [4 /*yield*/, web.browser.SearchVideos({
                        query: Tube.title,
                        screenshot: false,
                        onionTor: true,
                        type: "playlist",
                        verbose: false,
                    })];
            case 3:
                Tube = (_c.sent());
                console.log(colors.green("@pass:"), "playlist search results received");
                return [4 /*yield*/, web.browser.PlaylistInfo({
                        query: (_b = Tube[0]) === null || _b === void 0 ? void 0 : _b.playlistLink,
                        screenshot: false,
                        onionTor: true,
                        verbose: false,
                    })];
            case 4:
                Tube = (_c.sent());
                console.log(colors.green("@pass:"), "single playlist data received");
                return [4 /*yield*/, web.browserLess.searchVideos({ query: "weeknd" })];
            case 5:
                Tube = _c.sent();
                console.log(colors.green("searchVideos"), Tube[0]);
                return [4 /*yield*/, web.browserLess.searchPlaylists({ query: Tube[0].title })];
            case 6:
                Tube = _c.sent();
                console.log(colors.green("searchPlaylists"), Tube[0]);
                return [4 /*yield*/, web.browserLess.playlistVideos({ playlistId: Tube[0].id })];
            case 7:
                Tube = _c.sent();
                console.log(colors.green("playlistVideos"), Tube[0]);
                return [4 /*yield*/, web.browserLess.relatedVideos({ videoId: Tube[0].id })];
            case 8:
                Tube = _c.sent();
                console.log(colors.green("relatedVideos"), Tube[0]);
                return [4 /*yield*/, web.browserLess.singleVideo({ videoId: Tube[0].id })];
            case 9:
                Tube = _c.sent();
                console.log(colors.green("singleVideo"), Tube);
                return [3 /*break*/, 11];
            case 10:
                error_1 = _c.sent();
                console.error(colors.red("@error:"), error_1.message);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); })();
// =======================================================================
