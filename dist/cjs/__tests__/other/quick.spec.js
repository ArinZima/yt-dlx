"use strict";
// console.clear();
// import AudioLowest from "../../routes/Audio/single/AudioLowest";
// import AudioHighest from "../../routes/Audio/single/AudioHighest";
// import VideoLowest from "../../routes/Video/single/VideoLowest";
// import VideoHighest from "../../routes/Video/single/VideoHighest";
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
// (async () => {
// try {
// await AudioLowest({
// verbose: true,
// onionTor: true,
// output: "public/audio",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// await AudioHighest({
// verbose: true,
// onionTor: true,
// output: "public/audio",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// await VideoLowest({
// verbose: true,
// onionTor: true,
// output: "public/video",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// await VideoHighest({
// verbose: true,
// onionTor: true,
// output: "public/video",
// query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
// });
// } catch (error) {
// console.error(error);
// }
// })();
// ===================================================================
console.clear();
const AudioCustom_1 = __importDefault(require("../../routes/Audio/single/AudioCustom"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resolutions = ["high", "medium", "low", "ultralow"];
        for (const resolution of resolutions) {
            try {
                yield (0, AudioCustom_1.default)({
                    resolution,
                    stream: false,
                    verbose: true,
                    onionTor: false,
                    query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
                });
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }
    catch (error) {
        console.error(error.message);
    }
}))();
