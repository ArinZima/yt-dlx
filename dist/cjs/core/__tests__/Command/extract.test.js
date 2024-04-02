"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const __1 = __importDefault(require("../.."));
(async () => {
    try {
        console.log(colors_1.default.blue("@test:"), "Extract");
        await __1.default.info.extract({
            verbose: true,
            onionTor: true,
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//# sourceMappingURL=extract.test.js.map