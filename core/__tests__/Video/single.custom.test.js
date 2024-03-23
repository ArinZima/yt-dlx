var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import colors from "colors";
import { ytdlx } from "../..";
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resolutions = [
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
        for (const resolution of resolutions) {
            console.log(colors.blue("@test:"), "Download Custom audio");
            yield ytdlx.VideoOnly.Single.Custom({
                resolution,
                stream: false,
                verbose: true,
                onionTor: false,
                output: "public/audio",
                query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
            });
            console.log(colors.blue("@test:"), "(stream) Download Custom audio");
            const result = yield ytdlx.VideoOnly.Single.Custom({
                resolution,
                stream: true,
                verbose: true,
                onionTor: false,
                output: "public/audio",
                query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
            });
            if (result && result.filename && result.ffmpeg) {
                result.ffmpeg.pipe(fs.createWriteStream(result.filename));
            }
            else {
                console.error(colors.red("@error:"), "ffmpeg or filename not found!");
            }
        }
    }
    catch (error) {
        console.error(colors.red(error.message));
    }
}))();
