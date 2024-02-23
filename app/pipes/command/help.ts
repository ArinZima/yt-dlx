import colors from "colors";

export default function help(): Promise<string> {
  return Promise.resolve(
    colors.bold.white(`
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
┃──────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INSTALLATION  ┃ ❝ LOCALLY: ❞                                                                                 ┃
┃               ┃   bun add yt-dlp                                                                             ┃
┃               ┃   yarn add yt-dlp                                                                            ┃
┃               ┃   npm install yt-dlp                                                                         ┃
┃               ┃   pnpm install yt-dlp                                                                        ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                                ┃
┃               ┃   yarn global add yt-dlp                                                   (use cli)         ┃
┃               ┃   npm install --global yt-dlp                                              (use cli)         ┃
┃               ┃   pnpm install --global yt-dlp                                             (use cli)         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃    FILTERS    ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   bassboost                  echo                                                            ┃
┃               ┃   flanger                    nightdlp                                                        ┃
┃               ┃   panning                    phaser                                                          ┃
┃               ┃   reverse                    slow                                                            ┃
┃               ┃   speed                      subboost                                                        ┃
┃               ┃   superslow                  superspeed                                                      ┃
┃               ┃   surround                   vaporwave                                                       ┃
┃               ┃   vibrato                                                                                    ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   grayscale                                                                                  ┃
┃               ┃   invert                                                                                     ┃
┃               ┃   rotate90                                                                                   ┃
┃               ┃   rotate180                                                                                  ┃
┃               ┃   rotate270                                                                                  ┃
┃               ┃   flipHorizontal                                                                             ┃
┃               ┃   flipVertical                                                                               ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃   CLI USAGE   ┃ ❝ INFO GRABBERS: ❞                                                                           ┃
┃               ┃   yt-dlp version                                                             (alias: v)      ┃
┃               ┃   yt-dlp help                                                                (alias: h)      ┃
┃               ┃   yt-dlp extract --query="video/url"                                         (alias: e)      ┃
┃               ┃   yt-dlp search-yt --query="video/url"                                       (alias: s)      ┃
┃               ┃   yt-dlp list-formats --query="video/url"                                    (alias: f)      ┃ 
┃               ┃   yt-dlp get-video-data --query="video/url"                                  (alias: gvd)    ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlp audio-lowest --query="video/url"                                    (alias: al)     ┃
┃               ┃   yt-dlp audio-highest --query="video/url"                                   (alias: ah)     ┃
┃               ┃   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlp audio-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlp audio-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlp video-lowest --query="video/url"                                    (alias: vl)     ┃
┃               ┃   yt-dlp video-highest --query="video/url"                                   (alias: vh)     ┃
┃               ┃   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlp video-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlp video-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   yt-dlp audio-video-lowest --query="video/url"                              (alias: avl)    ┃
┃               ┃   yt-dlp audio-video-highest --query="video/url"                             (alias: avh)    ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlp from "yt-dlp";                                            TypeScript (ts)     ┃
┃               ┃   import ytdlp from "yt-dlp";                                            ECMAScript (esm)    ┃
┃               ┃   const ytdlp = require("yt-dlp");                                       CommonJS   (cjs)    ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INFO GRABBERS ┃   ytdlp.info.help();                                                                         ┃
┃               ┃   ytdlp.info.search({ query: "" });                                                          ┃
┃               ┃   ytdlp.info.extract({ query: "" });                                                         ┃
┃               ┃   ytdlp.info.list_formats({ query: "" });                                                    ┃
┃               ┃   ytdlp.info.get_video_data({ query: "" });                                                  ┃
┃               ┃   ytdlp.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃  DOWNLOADERS  ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   ytdlp.audio.download.lowest({ query: "", filter: "" });                                    ┃
┃               ┃   ytdlp.audio.download.highest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.audio.download.custom({ query: "", format: "", filter: "" });                        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   ytdlp.video.download.lowest({ query: "", filter: "" });                                    ┃
┃               ┃   ytdlp.video.download.highest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.video.download.custom({ query: "", filter: "" });                                    ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   ytdlp.audio_video.download.lowest({ query: "" });                                          ┃
┃               ┃   ytdlp.audio_video.download.highest({ query: "" });                                         ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃  MEDIA PIPE   ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   ytdlp.audio.pipe.lowest({ query: "", filter: "" });                                        ┃
┃               ┃   ytdlp.audio.pipe.highest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.audio.pipe.custom({ query: "", format: "", filter: "" });                            ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   ytdlp.video.pipe.lowest({ query: "", filter: "" });                                        ┃
┃               ┃   ytdlp.video.pipe.highest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.video.pipe.custom({ query: "", filter: "" });                                        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   ytdlp.audio_video.pipe.lowest({ query: "" });                                              ┃
┃               ┃   ytdlp.audio_video.pipe.highest({ query: "" });                                             ┃
┃──────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕`)
  );
}
