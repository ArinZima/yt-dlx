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
console.clear();
const AudioLowest_1 = __importDefault(require("../../pipes/Audio/single/AudioLowest"));
const AudioHighest_1 = __importDefault(require("../../pipes/Audio/single/AudioHighest"));
const VideoLowest_1 = __importDefault(require("../../pipes/Video/single/VideoLowest"));
const VideoHighest_1 = __importDefault(require("../../pipes/Video/single/VideoHighest"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, AudioLowest_1.default)({
            verbose: true,
            onionTor: true,
            output: "public/audio",
            query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
        });
        yield (0, AudioHighest_1.default)({
            verbose: true,
            onionTor: true,
            output: "public/audio",
            query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
        });
        yield (0, VideoLowest_1.default)({
            verbose: true,
            onionTor: true,
            output: "public/video",
            query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
        });
        yield (0, VideoHighest_1.default)({
            verbose: true,
            onionTor: true,
            output: "public/video",
            query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
        });
    }
    catch (error) {
        console.error(error);
    }
}))();
