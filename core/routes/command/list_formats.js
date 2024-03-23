var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import colors from "colors";
import ytdlx from "../../base/Agent";
/**
 * Lists the available formats and manifest information for a YouTube video.
 *
 * @param query - The YouTube video URL for which to list formats and manifest.
 * @param verbose - (optional) Whether to log verbose output or not.
 * @param onionTor - (optional) Whether to use Tor for the extraction or not.
 * @returns A Promise that resolves after listing the formats and manifest information.
 * @throws An error if unable to get a response from YouTube.
 */
export default function list_formats(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, verbose, onionTor, }) {
        const metaBody = yield ytdlx({ query, verbose, onionTor });
        if (!metaBody) {
            throw new Error("@error: Unable to get response from YouTube.");
        }
        else {
            pTable("@AudioLow:", metaBody.AudioLow);
            pTable("@AudioLowDRC:", metaBody.AudioLowDRC);
            pTable("@AudioHigh:", metaBody.AudioHigh);
            pTable("@AudioHighDRC:", metaBody.AudioHighDRC);
            pTable("@VideoLow:", metaBody.VideoLow);
            pTable("@VideoLowHDR:", metaBody.VideoLowHDR);
            pTable("@VideoHigh:", metaBody.VideoHigh);
            pTable("@VideoHighHDR:", metaBody.VideoHighHDR);
            pManifestTable("@ManifestLow:", metaBody.ManifestLow);
            pManifestTable("@ManifestHigh:", metaBody.ManifestHigh);
        }
    });
}
function pTable(title, data) {
    console.log(colors.green(title));
    data.forEach((item) => {
        console.log(" ".repeat(4), item.filesizeP.padEnd(10), "|", item.format_note);
    });
    console.log("");
}
function pManifestTable(title, data) {
    console.log(colors.green(title));
    data.forEach((item) => {
        console.log(" ".repeat(4), item.format.padEnd(10), "|", item.tbr);
    });
    console.log("");
}
