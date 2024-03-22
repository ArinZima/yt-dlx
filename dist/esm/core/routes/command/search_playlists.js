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
    return __awaiter(this, arguments, void 0, function (_b) {
        var isID, metaData;
        var query = _b.query;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, YouTubeID(query)];
                case 1:
                    isID = _c.sent();
                    if (!isID) return [3 /*break*/, 2];
                    throw new Error(colors.red("@error: ") + "use playlist_data() for playlist link!");
                case 2: return [4 /*yield*/, web.browserLess.searchPlaylists({ query: query })];
                case 3:
                    metaData = _c.sent();
                    if (!metaData) {
                        throw new Error(colors.red("@error: ") + "Unable to get response!");
                    }
                    else
                        return [2 /*return*/, metaData];
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
