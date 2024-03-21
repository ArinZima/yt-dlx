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
function searchVideos(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query }) {
        try {
            const response = yield fetch(`https://yt-dlx-scrape.vercel.app/api/searchVideos?query=${query}`, {
                method: "POST",
            });
            const { result } = yield response.json();
            return result;
        }
        catch (error) {
            throw new Error(colors_1.default.red("@error: ") + error.message);
        }
    });
}
exports.default = searchVideos;
