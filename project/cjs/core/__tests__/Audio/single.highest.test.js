"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
const colors_1 = __importDefault(require("colors"));
const __1 = __importDefault(require("../../"));
(async () => {
    try {
        await __1.default.AudioOnly.Single.Highest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/audio",
            query: "video-NAME/ID/URL",
        });
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//
// =============================[ CORE TESTER ]=============================
//# sourceMappingURL=single.highest.test.js.map