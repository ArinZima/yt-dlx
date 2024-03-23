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
const __1 = require("../..");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(colors_1.default.blue("@test:"), "ytSearch video single");
        const result = yield __1.ytdlx.ytSearch.video.single({
            query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
        });
        console.log(result);
    }
    catch (error) {
        console.error(colors_1.default.red(error.message));
    }
}))();
