"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const __1 = __importDefault(require("../.."));
(async () => {
    try {
        console.log(colors_1.default.blue("@test:"), "ytSearch video single");
        const result = await __1.default.ytSearch.video.single({
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(result);
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//# sourceMappingURL=video_data.test.js.map