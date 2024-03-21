var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import colors from "colors";
import ytdlx from "../../base/Agent";
export default function extract(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function calculateUploadAgo(days) {
            var years = Math.floor(days / 365);
            var months = Math.floor((days % 365) / 30);
            var remainingDays = days % 30;
            var formattedString = "".concat(years > 0 ? years + " years, " : "").concat(months > 0 ? months + " months, " : "").concat(remainingDays, " days");
            return { years: years, months: months, days: remainingDays, formatted: formattedString };
        }
        function calculateVideoDuration(seconds) {
            var hours = Math.floor(seconds / 3600);
            var minutes = Math.floor((seconds % 3600) / 60);
            var remainingSeconds = seconds % 60;
            var formattedString = "".concat(hours > 0 ? hours + " hours, " : "").concat(minutes > 0 ? minutes + " minutes, " : "").concat(remainingSeconds, " seconds");
            return {
                hours: hours,
                minutes: minutes,
                seconds: remainingSeconds,
                formatted: formattedString,
            };
        }
        function formatCount(count) {
            var abbreviations = ["K", "M", "B", "T"];
            for (var i = abbreviations.length - 1; i >= 0; i--) {
                var size = Math.pow(10, (i + 1) * 3);
                if (size <= count) {
                    var formattedCount = Math.round((count / size) * 10) / 10;
                    return "".concat(formattedCount).concat(abbreviations[i]);
                }
            }
            return "".concat(count);
        }
        var metaBody, uploadDate, currentDate, daysAgo, prettyDate, uploadAgoObject, videoTimeInSeconds, videoDuration, viewCountFormatted, likeCountFormatted, payload;
        var query = _b.query, verbose = _b.verbose, onionTor = _b.onionTor;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ytdlx({ query: query, verbose: verbose, onionTor: onionTor })];
                case 1:
                    metaBody = _c.sent();
                    if (!metaBody) {
                        return [2 /*return*/, {
                                message: "Unable to get response from YouTube...",
                                status: 500,
                            }];
                    }
                    uploadDate = new Date(metaBody.metaData.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
                    currentDate = new Date();
                    daysAgo = Math.floor((currentDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
                    prettyDate = uploadDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    uploadAgoObject = calculateUploadAgo(daysAgo);
                    videoTimeInSeconds = metaBody.metaData.duration;
                    videoDuration = calculateVideoDuration(videoTimeInSeconds);
                    viewCountFormatted = formatCount(metaBody.metaData.view_count);
                    likeCountFormatted = formatCount(metaBody.metaData.like_count);
                    payload = {
                        ipAddress: metaBody.ipAddress,
                        AudioLowF: metaBody.AudioLowF,
                        AudioHighF: metaBody.AudioHighF,
                        VideoLowF: metaBody.VideoLowF,
                        VideoHighF: metaBody.VideoHighF,
                        AudioLowDRC: metaBody.AudioLowDRC,
                        AudioHighDRC: metaBody.AudioHighDRC,
                        AudioLow: metaBody.AudioLow,
                        AudioHigh: metaBody.AudioHigh,
                        VideoLowHDR: metaBody.VideoLowHDR,
                        VideoHighHDR: metaBody.VideoHighHDR,
                        VideoLow: metaBody.VideoLow,
                        VideoHigh: metaBody.VideoHigh,
                        ManifestLow: metaBody.ManifestLow,
                        ManifestHigh: metaBody.ManifestHigh,
                        meta_data: {
                            id: metaBody.metaData.id,
                            original_url: metaBody.metaData.original_url,
                            webpage_url: metaBody.metaData.webpage_url,
                            title: metaBody.metaData.title,
                            view_count: metaBody.metaData.view_count,
                            like_count: metaBody.metaData.like_count,
                            view_count_formatted: viewCountFormatted,
                            like_count_formatted: likeCountFormatted,
                            uploader: metaBody.metaData.uploader,
                            uploader_id: metaBody.metaData.uploader_id,
                            uploader_url: metaBody.metaData.uploader_url,
                            thumbnail: metaBody.metaData.thumbnail,
                            categories: metaBody.metaData.categories,
                            time: videoTimeInSeconds,
                            duration: videoDuration,
                            age_limit: metaBody.metaData.age_limit,
                            live_status: metaBody.metaData.live_status,
                            description: metaBody.metaData.description,
                            full_description: metaBody.metaData.description,
                            upload_date: prettyDate,
                            upload_ago: daysAgo,
                            upload_ago_formatted: uploadAgoObject,
                            comment_count: metaBody.metaData.comment_count,
                            comment_count_formatted: formatCount(metaBody.metaData.comment_count),
                            channel_id: metaBody.metaData.channel_id,
                            channel_name: metaBody.metaData.channel,
                            channel_url: metaBody.metaData.channel_url,
                            channel_follower_count: metaBody.metaData.channel_follower_count,
                            channel_follower_count_formatted: formatCount(metaBody.metaData.channel_follower_count),
                        },
                    };
                    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
                    return [2 /*return*/, payload];
            }
        });
    });
}
