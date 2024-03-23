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
        console.log(colors.blue("@test:"), "Download Lowest audio");
        yield ytdlx.AudioOnly.Single.Lowest({
            stream: false,
            verbose: true,
            onionTor: true,
            output: "public/audio",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(colors.blue("@test:"), "(stream) Download Lowest audio");
        const result = yield ytdlx.AudioOnly.Single.Lowest({
            stream: true,
            verbose: true,
            onionTor: true,
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
    catch (error) {
        console.error(colors.red(error.message));
    }
}))();
