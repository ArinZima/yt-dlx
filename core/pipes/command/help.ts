import colors from "colors";

export default function help(): Promise<string> {
  return Promise.resolve(
    colors.bold.white(`
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    ┃
┃                                            (License: MIT)                                                   ┃
┃                                         [Owner: ShovitDutta]                                                ┃
┃                                       { Web: rebrand.ly/mixly }                                             ┃
┃                                                                                                             ┃
┃                               Supports both async/await and promise.then()                                  ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    ┃
┃─────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INSTALLATION  ┃ ❝ LOCALLY: ❞                                                                                ┃
┃               ┃   bun add yt-core                                                                           ┃
┃               ┃   yarn add yt-core                                                                          ┃
┃               ┃   npm install yt-core                                                                       ┃
┃               ┃   pnpm install yt-core                                                                      ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                               ┃
┃               ┃   yarn global add yt-core                                                   (use cli)       ┃
┃               ┃   npm install --global yt-core                                              (use cli)       ┃
┃               ┃   pnpm install --global yt-core                                             (use cli)       ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃    FILTERS    ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   bassboost                  echo                                                           ┃
┃               ┃   flanger                    nightcore                                                      ┃
┃               ┃   panning                    phaser                                                         ┃
┃               ┃   reverse                    slow                                                           ┃
┃               ┃   speed                      subboost                                                       ┃
┃               ┃   superslow                  superspeed                                                     ┃
┃               ┃   surround                   vaporwave                                                      ┃
┃               ┃   vibrato                                                                                   ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   grayscale                                                                                 ┃
┃               ┃   invert                                                                                    ┃
┃               ┃   rotate90                                                                                  ┃
┃               ┃   rotate180                                                                                 ┃
┃               ┃   rotate270                                                                                 ┃
┃               ┃   flipHorizontal                                                                            ┃
┃               ┃   flipVertical                                                                              ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃   CLI USAGE   ┃ ❝ INFO GRABBERS: ❞                                                                          ┃
┃               ┃   yt-core version                                                             (alias: v)    ┃
┃               ┃   yt-core help                                                                (alias: h)    ┃
┃               ┃   yt-core extract --query="video/url"                                         (alias: e)    ┃
┃               ┃   yt-core search-yt --query="video/url"                                       (alias: s)    ┃
┃               ┃   yt-core list-formats --query="video/url"                                    (alias: f)    ┃ 
┃               ┃   yt-core get-video-data --query="video/url"                                  (alias: gvd)  ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   yt-core audio-lowest --query="video/url"                                    (alias: al)   ┃
┃               ┃   yt-core audio-highest --query="video/url"                                   (alias: ah)   ┃
┃               ┃   yt-core audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-core audio-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-core audio-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-core audio-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   yt-core video-lowest --query="video/url"                                    (alias: vl)   ┃
┃               ┃   yt-core video-highest --query="video/url"                                   (alias: vh)   ┃
┃               ┃   yt-core video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)  ┃
┃               ┃       ──────────────────────────────────────────────────────────────                        ┃
┃               ┃   yt-core video-lowest --query="video/url" --filter="valid-filter"            (filter)      ┃
┃               ┃   yt-core video-highest --query="video/url" --filter="valid-filter"           (filter)      ┃
┃               ┃   yt-core video-quality-custom --query="video/url" --format="valid-format"    ........      ┃
┃               ┃                                                   --filter="valid-filter"    (filter)       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   yt-core audio-video-lowest --query="video/url"                              (alias: avl)  ┃
┃               ┃   yt-core audio-video-highest --query="video/url"                             (alias: avh)  ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlp from "yt-core";                                            TypeScript (ts)   ┃
┃               ┃   import ytdlp from "yt-core";                                            ECMAScript (esm)  ┃
┃               ┃   const ytdlp = require("yt-core");                                       CommonJS   (cjs)  ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INFO GRABBERS ┃   ytdlp.info.help();                                                                        ┃
┃               ┃   ytdlp.info.search({ query: "" });                                                         ┃
┃               ┃   ytdlp.info.extract({ query: "" });                                                        ┃
┃               ┃   ytdlp.info.list_formats({ query: "" });                                                   ┃
┃               ┃   ytdlp.info.get_video_data({ query: "" });                                                 ┃
┃               ┃   ytdlp.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                        ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃  DOWNLOADERS  ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.audio.download.lowest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.audio.download.highest({ query: "", filter: "" });                                  ┃
┃               ┃   ytdlp.audio.download.custom({ query: "", format: "", filter: "" });                       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.video.download.lowest({ query: "", filter: "" });                                   ┃
┃               ┃   ytdlp.video.download.highest({ query: "", filter: "" });                                  ┃
┃               ┃   ytdlp.video.download.custom({ query: "", filter: "" });                                   ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   ytdlp.audio_video.download.lowest({ query: "" });                                         ┃
┃               ┃   ytdlp.audio_video.download.highest({ query: "" });                                        ┃
┃               ┃─────────────────────────────────────────────────────────────────────────────────────────────┃
┃  MEDIA PIPE   ┃ ❝ AUDIO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.audio.pipe.lowest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.audio.pipe.highest({ query: "", filter: "" });                                      ┃
┃               ┃   ytdlp.audio.pipe.custom({ query: "", format: "", filter: "" });                           ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                             ┃
┃               ┃   ytdlp.video.pipe.lowest({ query: "", filter: "" });                                       ┃
┃               ┃   ytdlp.video.pipe.highest({ query: "", filter: "" });                                      ┃
┃               ┃   ytdlp.video.pipe.custom({ query: "", filter: "" });                                       ┃
┃               ┃                                                                                             ┃
┃               ┃                                                                                             ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                      ┃
┃               ┃   ytdlp.audio_video.pipe.lowest({ query: "" });                                             ┃
┃               ┃   ytdlp.audio_video.pipe.highest({ query: "" });                                            ┃
┃─────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    ┃
┃                                            (License: MIT)                                                   ┃
┃                                         [Owner: ShovitDutta]                                                ┃
┃                                       { Web: rebrand.ly/mixly }                                             ┃
┃                                                                                                             ┃
┃                               Supports both async/await and promise.then()                                  ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    ┃
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕`)
  );
}
