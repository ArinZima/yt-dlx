"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
async function relatedVideos({ videoId }) {
    try {
        const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/relatedVideos?videoId=${videoId}`, {
            method: "POST",
        });
        const { result } = await response.json();
        return result;
    }
    catch (error) {
        throw new Error(colors_1.default.red("@error: ") + error.message);
    }
}
exports.default = relatedVideos;
