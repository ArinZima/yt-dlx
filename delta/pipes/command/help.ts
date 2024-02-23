import colors from "colors";

export default function help(): Promise<string> {
  return Promise.resolve(
    colors.bold.white(`
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕
┃                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
┃──────────────────────────────────────────────────────────────────────────────────────────────────────────────┃
┃ INSTALLATION  ┃ ❝ LOCALLY: ❞                                                                                 ┃
┃               ┃   bun add yt-dlx                                                                             ┃
┃               ┃   yarn add yt-dlx                                                                            ┃
┃               ┃   npm install yt-dlx                                                                         ┃
┃               ┃   pnpm install yt-dlx                                                                        ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ GLOBALLY: ❞                                                                                ┃
┃               ┃   yarn global add yt-dlx                                                   (use cli)         ┃
┃               ┃   npm install --global yt-dlx                                              (use cli)         ┃
┃               ┃   pnpm install --global yt-dlx                                             (use cli)         ┃
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
┃               ┃   yt-dlx version                                                             (alias: v)      ┃
┃               ┃   yt-dlx help                                                                (alias: h)      ┃
┃               ┃   yt-dlx extract --query="video/url"                                         (alias: e)      ┃
┃               ┃   yt-dlx search-yt --query="video/url"                                       (alias: s)      ┃
┃               ┃   yt-dlx list-formats --query="video/url"                                    (alias: f)      ┃ 
┃               ┃   yt-dlx get-video-data --query="video/url"                                  (alias: gvd)    ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlx audio-lowest --query="video/url"                                    (alias: al)     ┃
┃               ┃   yt-dlx audio-highest --query="video/url"                                   (alias: ah)     ┃
┃               ┃   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlx audio-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlx audio-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlx audio-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ VIDEO ONLY: ❞                                                                              ┃
┃               ┃   yt-dlx video-lowest --query="video/url"                                    (alias: vl)     ┃
┃               ┃   yt-dlx video-highest --query="video/url"                                   (alias: vh)     ┃
┃               ┃   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)    ┃
┃               ┃       ──────────────────────────────────────────────────────────────                         ┃
┃               ┃   yt-dlx video-lowest --query="video/url" --filter="valid-filter"            (filter)        ┃
┃               ┃   yt-dlx video-highest --query="video/url" --filter="valid-filter"           (filter)        ┃
┃               ┃   yt-dlx video-quality-custom --query="video/url" --format="valid-format"    ........        ┃
┃               ┃                                                   --filter="valid-filter"    (filter)        ┃
┃               ┃                                                                                              ┃
┃               ┃                                                                                              ┃
┃               ┃ ❝ AUDIO + VIDEO MIX: ❞                                                                       ┃
┃               ┃   yt-dlx audio-video-lowest --query="video/url"                              (alias: avl)    ┃
┃               ┃   yt-dlx audio-video-highest --query="video/url"                             (alias: avh)    ┃
┃               ┃──────────────────────────────────────────────────────────────────────────────────────────────┃
┃   IMPORTING   ┃   import ytdlp from "yt-dlx";                                            TypeScript (ts)     ┃
┃               ┃   import ytdlp from "yt-dlx";                                            ECMAScript (esm)    ┃
┃               ┃   const ytdlp = require("yt-dlx");                                       CommonJS   (cjs)    ┃
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
┃                                     YOUTUBE DOWNLOADER DLX <( YT-DLX /)>                                   ┃
┃                                            (License: MIT)                                                    ┃
┃                                         [Owner: ShovitDutta]                                                 ┃
┃                                       { Web: rebrand.ly/mixly }                                              ┃
┃                                                                                                              ┃
┃                               Supports both async/await and promise.then()                                   ┃
┃                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                     ┃
✕─────────────────────────────────────────────────────────────────────────────────────────────────────────────✕`)
  );
}
