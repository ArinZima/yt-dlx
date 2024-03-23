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
const YouTubeId_1 = __importDefault(require("../../web/YouTubeId"));
const web_1 = __importDefault(require("../../web"));
/**
 * Fetches data for a single YouTube video based on the video ID or link.
 *
 * @param query - The video ID or link.
 * @returns A Promise that resolves with the metadata for the single video.
 * @throws An error if the input is an incorrect video link or if unable to get a response.
 */
function video_data(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, }) {
        const videoId = yield (0, YouTubeId_1.default)(query);
        if (!videoId) {
            throw new Error(colors_1.default.red("@error: ") + "incorrect playlist link");
        }
        else {
            const metaData = yield web_1.default.browserLess.singleVideo({ videoId });
            if (!metaData) {
                throw new Error(colors_1.default.red("@error: ") + "Unable to get response!");
            }
            else
                return metaData;
        }
    });
}
exports.default = video_data;
