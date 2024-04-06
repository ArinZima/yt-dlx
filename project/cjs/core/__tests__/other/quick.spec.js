"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Agent_1 = __importDefault(require("../../base/Agent"));
// console.clear();
// import AudioLowest from "../../routes/Audio/single/AudioLowest";
// import AudioHighest from "../../routes/Audio/single/AudioHighest";
// import VideoLowest from "../../routes/Video/single/VideoLowest";
// import VideoHighest from "../../routes/Video/single/VideoHighest";
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
(async () => {
    try {
        const body = await (0, Agent_1.default)({
            verbose: true,
            onionTor: false,
            query: "https://youtu.be/pRLOXUlIUG0?si=dRXm_fVwubFrd4eI",
        });
        console.log(body);
    }
    catch (error) {
        console.error(error.message);
    }
})();
//# sourceMappingURL=quick.spec.js.map