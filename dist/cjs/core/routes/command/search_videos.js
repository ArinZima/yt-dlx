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
const colors_1 = __importDefault(require("colors"));
const web_1 = __importDefault(require("../../web"));
const YouTubeId_1 = __importDefault(require("../../web/YouTubeId"));
function search_videos(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, }) {
        const isID = yield (0, YouTubeId_1.default)(query);
        if (isID) {
            throw new Error(colors_1.default.red("@error: ") + "use video_data() for video link!");
        }
        else {
            const metaData = yield web_1.default.browserLess.searchVideos({ query });
            if (!metaData) {
                throw new Error(colors_1.default.red("@error: ") + "Unable to get response!");
            }
            else
                return metaData;
        }
    });
}
exports.default = search_videos;
