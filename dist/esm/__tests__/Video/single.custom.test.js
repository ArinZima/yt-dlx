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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var resolutions, resolutions_1, resolutions_1_1, resolution, result, e_1_1, error_1;
    var e_1, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                resolutions = [
                    "144p",
                    "240p",
                    "360p",
                    "480p",
                    "720p",
                    "1080p",
                    "1440p",
                    "2160p",
                    "3072p",
                    "4320p",
                    "6480p",
                    "8640p",
                    "12000p",
                ];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, 8, 9]);
                resolutions_1 = __values(resolutions), resolutions_1_1 = resolutions_1.next();
                _b.label = 2;
            case 2:
                if (!!resolutions_1_1.done) return [3 /*break*/, 6];
                resolution = resolutions_1_1.value;
                console.log(colors.blue("@test:"), "Download Custom audio");
                return [4 /*yield*/, ytdlx.VideoOnly.Single.Custom({
                        resolution: resolution,
                        stream: false,
                        verbose: true,
                        onionTor: false,
                        output: "public/audio",
                        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
                    })];
            case 3:
                _b.sent();
                console.log(colors.blue("@test:"), "(stream) Download Custom audio");
                return [4 /*yield*/, ytdlx.VideoOnly.Single.Custom({
                        resolution: resolution,
                        stream: true,
                        verbose: true,
                        onionTor: false,
                        output: "public/audio",
                        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
                    })];
            case 4:
                result = _b.sent();
                if (result && result.filename && result.ffmpeg) {
                    result.ffmpeg.pipe(fs.createWriteStream(result.filename));
                }
                else {
                    console.error(colors.red("@error:"), "ffmpeg or filename not found!");
                }
                _b.label = 5;
            case 5:
                resolutions_1_1 = resolutions_1.next();
                return [3 /*break*/, 2];
            case 6: return [3 /*break*/, 9];
            case 7:
                e_1_1 = _b.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 9];
            case 8:
                try {
                    if (resolutions_1_1 && !resolutions_1_1.done && (_a = resolutions_1.return)) _a.call(resolutions_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _b.sent();
                console.error(colors.red(error_1.message));
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); })();
