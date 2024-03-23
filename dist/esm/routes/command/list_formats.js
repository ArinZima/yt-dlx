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
import ytdlx from "../../base/Agent";
/**
 * Lists the available formats and manifest information for a YouTube video.
 *
 * @param query - The YouTube video URL for which to list formats and manifest.
 * @param verbose - (optional) Whether to log verbose output or not.
 * @param onionTor - (optional) Whether to use Tor for the extraction or not.
 * @returns A Promise that resolves after listing the formats and manifest information.
 * @throws An error if unable to get a response from YouTube.
 */
export default function list_formats(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var metaBody;
        var query = _b.query, verbose = _b.verbose, onionTor = _b.onionTor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ytdlx({ query: query, verbose: verbose, onionTor: onionTor })];
                case 1:
                    metaBody = _c.sent();
                    if (!metaBody) {
                        throw new Error("@error: Unable to get response from YouTube.");
                    }
                    else {
                        pTable("@AudioLow:", metaBody.AudioLow);
                        pTable("@AudioLowDRC:", metaBody.AudioLowDRC);
                        pTable("@AudioHigh:", metaBody.AudioHigh);
                        pTable("@AudioHighDRC:", metaBody.AudioHighDRC);
                        pTable("@VideoLow:", metaBody.VideoLow);
                        pTable("@VideoLowHDR:", metaBody.VideoLowHDR);
                        pTable("@VideoHigh:", metaBody.VideoHigh);
                        pTable("@VideoHighHDR:", metaBody.VideoHighHDR);
                        pManifestTable("@ManifestLow:", metaBody.ManifestLow);
                        pManifestTable("@ManifestHigh:", metaBody.ManifestHigh);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function pTable(title, data) {
    console.log(colors.green(title));
    data.forEach(function (item) {
        console.log(" ".repeat(4), item.filesizeP.padEnd(10), "|", item.format_note);
    });
    console.log("");
}
function pManifestTable(title, data) {
    console.log(colors.green(title));
    data.forEach(function (item) {
        console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
    });
    console.log("");
}
