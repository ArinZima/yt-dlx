"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// =============================[ USING YT-DLX'S DOWNLOAD MACHANISM ]=============================
//
const __1 = __importDefault(require("../.."));
const colors_1 = __importDefault(require("colors"));
(async () => {
    try {
        await __1.default.VideoOnly.Single.Lowest({
            stream: false,
            verbose: true,
            onionTor: false,
            output: "public/video",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//
// =============================[ USING STREAMING TO SAVE THE FILE ]=============================
//
const fs = __importStar(require("fs"));
(async () => {
    try {
        const result = await __1.default.VideoOnly.Single.Lowest({
            stream: true,
            verbose: true,
            onionTor: false,
            output: "public/video",
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        if (result && result.filename && result.ffmpeg) {
            result.ffmpeg.pipe(fs.createWriteStream(result.filename), {
                end: true,
            });
        }
        else {
            console.error(colors_1.default.red("@error:"), "ffmpeg or filename not found!");
        }
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//
// =============================[ USING STREAMING TO PIPE THE FILE ]=============================
//
const express_1 = __importDefault(require("express"));
(async () => {
    try {
        const server = (0, express_1.default)();
        server.get("/video/:query", async (req, res) => {
            try {
                const queryParam = req.params.query;
                const result = await __1.default.VideoOnly.Single.Lowest({
                    stream: true,
                    verbose: true,
                    onionTor: false,
                    query: queryParam,
                });
                if (result && result.filename && result.ffmpeg) {
                    result.ffmpeg.pipe(res, { end: true });
                }
                else
                    res.status(404).send("ffmpeg or filename not found!");
            }
            catch (error) {
                res.status(500).send(error.message);
            }
        });
        server.listen(3000, () => {
            console.log(colors_1.default.blue("@server:"), "running on port 3000");
        });
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
})();
//
// ========================================================================================
//# sourceMappingURL=single.lowest.test.js.map