#!/usr/bin/env node
'use strict';

var colors14 = require('colors');
var axios = require('axios');
var z4 = require('zod');
var YouTubeID = require('@shovit/ytid');
var search2 = require('yt-search');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var fluentffmpeg = require('fluent-ffmpeg');
var stream = require('stream');
var readline = require('readline');
var minimist = require('minimist');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var colors14__default = /*#__PURE__*/_interopDefault(colors14);
var axios__default = /*#__PURE__*/_interopDefault(axios);
var z4__namespace = /*#__PURE__*/_interopNamespace(z4);
var YouTubeID__default = /*#__PURE__*/_interopDefault(YouTubeID);
var search2__default = /*#__PURE__*/_interopDefault(search2);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var fluentffmpeg__default = /*#__PURE__*/_interopDefault(fluentffmpeg);
var readline__default = /*#__PURE__*/_interopDefault(readline);
var minimist__default = /*#__PURE__*/_interopDefault(minimist);

function help() {
  return Promise.resolve(
    colors14__default.default.bold.white(`
\u2715\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2715
\u2503                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    \u2503
\u2503                                            (License: MIT)                                                   \u2503
\u2503                                         [Owner: ShovitDutta]                                                \u2503
\u2503                                       { Web: rebrand.ly/mixly }                                             \u2503
\u2503                                                                                                             \u2503
\u2503                               Supports both async/await and promise.then()                                  \u2503
\u2503                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    \u2503
\u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503 INSTALLATION  \u2503 \u275D LOCALLY: \u275E                                                                                \u2503
\u2503               \u2503   bun add yt-core                                                                           \u2503
\u2503               \u2503   yarn add yt-core                                                                          \u2503
\u2503               \u2503   npm install yt-core                                                                       \u2503
\u2503               \u2503   pnpm install yt-core                                                                      \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D GLOBALLY: \u275E                                                                               \u2503
\u2503               \u2503   yarn global add yt-core                                                   (use cli)       \u2503
\u2503               \u2503   npm install --global yt-core                                              (use cli)       \u2503
\u2503               \u2503   pnpm install --global yt-core                                             (use cli)       \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503    FILTERS    \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   bassboost                  echo                                                           \u2503
\u2503               \u2503   flanger                    nightcore                                                      \u2503
\u2503               \u2503   panning                    phaser                                                         \u2503
\u2503               \u2503   reverse                    slow                                                           \u2503
\u2503               \u2503   speed                      subboost                                                       \u2503
\u2503               \u2503   superslow                  superspeed                                                     \u2503
\u2503               \u2503   surround                   vaporwave                                                      \u2503
\u2503               \u2503   vibrato                                                                                   \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   grayscale                                                                                 \u2503
\u2503               \u2503   invert                                                                                    \u2503
\u2503               \u2503   rotate90                                                                                  \u2503
\u2503               \u2503   rotate180                                                                                 \u2503
\u2503               \u2503   rotate270                                                                                 \u2503
\u2503               \u2503   flipHorizontal                                                                            \u2503
\u2503               \u2503   flipVertical                                                                              \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503   CLI USAGE   \u2503 \u275D INFO GRABBERS: \u275E                                                                          \u2503
\u2503               \u2503   yt-core version                                                             (alias: v)    \u2503
\u2503               \u2503   yt-core help                                                                (alias: h)    \u2503
\u2503               \u2503   yt-core extract --query="video/url"                                         (alias: e)    \u2503
\u2503               \u2503   yt-core search-yt --query="video/url"                                       (alias: s)    \u2503
\u2503               \u2503   yt-core list-formats --query="video/url"                                    (alias: f)    \u2503 
\u2503               \u2503   yt-core get-video-data --query="video/url"                                  (alias: gvd)  \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   yt-core audio-lowest --query="video/url"                                    (alias: al)   \u2503
\u2503               \u2503   yt-core audio-highest --query="video/url"                                   (alias: ah)   \u2503
\u2503               \u2503   yt-core audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)  \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                        \u2503
\u2503               \u2503   yt-core audio-lowest --query="video/url" --filter="valid-filter"            (filter)      \u2503
\u2503               \u2503   yt-core audio-highest --query="video/url" --filter="valid-filter"           (filter)      \u2503
\u2503               \u2503   yt-core audio-quality-custom --query="video/url" --format="valid-format"    ........      \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   yt-core video-lowest --query="video/url"                                    (alias: vl)   \u2503
\u2503               \u2503   yt-core video-highest --query="video/url"                                   (alias: vh)   \u2503
\u2503               \u2503   yt-core video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)  \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                        \u2503
\u2503               \u2503   yt-core video-lowest --query="video/url" --filter="valid-filter"            (filter)      \u2503
\u2503               \u2503   yt-core video-highest --query="video/url" --filter="valid-filter"           (filter)      \u2503
\u2503               \u2503   yt-core video-quality-custom --query="video/url" --format="valid-format"    ........      \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                      \u2503
\u2503               \u2503   yt-core audio-video-lowest --query="video/url"                              (alias: avl)  \u2503
\u2503               \u2503   yt-core audio-video-highest --query="video/url"                             (alias: avh)  \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503   IMPORTING   \u2503   import ytdlp from "yt-core";                                            TypeScript (ts)   \u2503
\u2503               \u2503   import ytdlp from "yt-core";                                            ECMAScript (esm)  \u2503
\u2503               \u2503   const ytdlp = require("yt-core");                                       CommonJS   (cjs)  \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503 INFO GRABBERS \u2503   ytdlp.info.help();                                                                        \u2503
\u2503               \u2503   ytdlp.info.search({ query: "" });                                                         \u2503
\u2503               \u2503   ytdlp.info.extract({ query: "" });                                                        \u2503
\u2503               \u2503   ytdlp.info.list_formats({ query: "" });                                                   \u2503
\u2503               \u2503   ytdlp.info.get_video_data({ query: "" });                                                 \u2503
\u2503               \u2503   ytdlp.extract_playlist_videos({ playlistUrls: ["", "", "", ""] });                        \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503  DOWNLOADERS  \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   ytdlp.audio.download.lowest({ query: "", filter: "" });                                   \u2503
\u2503               \u2503   ytdlp.audio.download.highest({ query: "", filter: "" });                                  \u2503
\u2503               \u2503   ytdlp.audio.download.custom({ query: "", format: "", filter: "" });                       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   ytdlp.video.download.lowest({ query: "", filter: "" });                                   \u2503
\u2503               \u2503   ytdlp.video.download.highest({ query: "", filter: "" });                                  \u2503
\u2503               \u2503   ytdlp.video.download.custom({ query: "", filter: "" });                                   \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                      \u2503
\u2503               \u2503   ytdlp.audio_video.download.lowest({ query: "" });                                         \u2503
\u2503               \u2503   ytdlp.audio_video.download.highest({ query: "" });                                        \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503  MEDIA PIPE   \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   ytdlp.audio.pipe.lowest({ query: "", filter: "" });                                       \u2503
\u2503               \u2503   ytdlp.audio.pipe.highest({ query: "", filter: "" });                                      \u2503
\u2503               \u2503   ytdlp.audio.pipe.custom({ query: "", format: "", filter: "" });                           \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   ytdlp.video.pipe.lowest({ query: "", filter: "" });                                       \u2503
\u2503               \u2503   ytdlp.video.pipe.highest({ query: "", filter: "" });                                      \u2503
\u2503               \u2503   ytdlp.video.pipe.custom({ query: "", filter: "" });                                       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                      \u2503
\u2503               \u2503   ytdlp.audio_video.pipe.lowest({ query: "" });                                             \u2503
\u2503               \u2503   ytdlp.audio_video.pipe.highest({ query: "" });                                            \u2503
\u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503                                     YOUTUBE DOWNLOADER CORE <( YT-CORE /)>                                    \u2503
\u2503                                            (License: MIT)                                                   \u2503
\u2503                                         [Owner: ShovitDutta]                                                \u2503
\u2503                                       { Web: rebrand.ly/mixly }                                             \u2503
\u2503                                                                                                             \u2503
\u2503                               Supports both async/await and promise.then()                                  \u2503
\u2503                   Full support for CommonJS (CJS), ECMAScript (ESM), and TypeScript (TS)                    \u2503
\u2715\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2715`)
  );
}
async function scrape(query) {
  try {
    const host = "https://ill-blue-bass-wear.cyclic.app/scrape";
    const response = await axios__default.default.get(
      host + "?query=" + encodeURIComponent(query)
    );
    if (response.data !== null)
      return decodeURIComponent(response.data);
    else
      return null;
  } catch (error) {
    return null;
  }
}

// core/pipes/command/search.ts
async function search({ query }) {
  try {
    switch (true) {
      case (!query || typeof query !== "string"):
        return {
          message: "Invalid query parameter",
          status: 500
        };
      default:
        return await scrape(query);
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
async function ytCore(query) {
  const host = "https://ill-blue-bass-wear.cyclic.app/core";
  try {
    const response = await axios__default.default.get(
      host + "?query=" + encodeURIComponent(query)
    );
    if (response.data !== null)
      return decodeURIComponent(response.data);
    else
      return null;
  } catch (error) {
    return null;
  }
}

// package.json
var version = "4.5.0";

// core/base/agent.ts
async function Engine({
  query
}) {
  let videoId, TubeCore, TubeBody;
  console.log(
    colors14__default.default.bold.green("INFO: ") + "\u2B55 using yt-core version <(" + version + ")>" + colors14__default.default.reset("")
  );
  if (!query || query.trim() === "") {
    console.log(
      colors14__default.default.bold.red("ERROR: ") + "\u274C 'query' is required..." + colors14__default.default.reset("")
    );
    return;
  }
  if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors14__default.default.bold.red("ERROR: ") + "\u274C use extract_playlist_videos() for playlists..." + colors14__default.default.reset("")
    );
    return;
  }
  if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors14__default.default.bold.green("INFO: ") + "\u2B55 fetching metadata for: <(" + query + ")>" + colors14__default.default.reset("")
    );
    videoId = await YouTubeID__default.default(query);
  } else {
    let isYouTubeID2 = function(input) {
      const regex = /^[a-zA-Z0-9_-]{11}$/;
      const match = input.match(regex);
      if (match)
        return match[0];
      else
        return null;
    };
    videoId = isYouTubeID2(query);
  }
  if (videoId) {
    TubeBody = await scrape(videoId);
    if (TubeBody === null) {
      console.log(
        colors14__default.default.bold.red("ERROR: ") + "\u274C no data returned from server..." + colors14__default.default.reset("")
      );
      return;
    } else {
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors14__default.default.bold.green("INFO: ") + "\u{1F4E1} preparing payload for <(" + TubeBody.Title + "Author:" + TubeBody.Uploader + ")>" + colors14__default.default.reset("")
      );
      TubeCore = await ytCore(TubeBody.Link);
    }
  } else {
    TubeBody = await scrape(query);
    if (TubeBody === null) {
      console.log(
        colors14__default.default.bold.red("ERROR: ") + "\u274C no data returned from server..." + colors14__default.default.reset("")
      );
      return;
    } else {
      TubeBody = JSON.parse(TubeBody);
      console.log(
        colors14__default.default.bold.green("INFO: ") + "\u{1F4E1} preparing payload for <(" + TubeBody.Title + "Author:" + TubeBody.Uploader + ")>" + colors14__default.default.reset("")
      );
      TubeCore = await ytCore(TubeBody.Link);
    }
  }
  if (TubeCore === null) {
    console.log(
      colors14__default.default.bold.red("ERROR: ") + "\u274C please try again later..." + colors14__default.default.reset("")
    );
    return Promise.resolve(null);
  } else {
    console.log(
      colors14__default.default.bold.green("INFO: ") + "\u2763\uFE0F Thank you for using yt-core! If you enjoy the project, consider Staring the GitHub repo https://github.com/shovitdutta/mixly/yt-core." + colors14__default.default.reset("")
    );
    return Promise.resolve(JSON.parse(TubeCore));
  }
}

// core/pipes/command/extract.ts
function extract({ query }) {
  return new Promise(async (resolve, reject2) => {
    try {
      let calculateUploadAgo2 = function(days) {
        const years = Math.floor(days / 365);
        const months = Math.floor(days % 365 / 30);
        const remainingDays = days % 30;
        const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
        return {
          years,
          months,
          days: remainingDays,
          formatted: formattedString
        };
      }, calculateVideoDuration2 = function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const remainingSeconds = seconds % 60;
        const formattedString = `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${remainingSeconds} seconds`;
        return {
          hours,
          minutes,
          seconds: remainingSeconds,
          formatted: formattedString
        };
      }, formatCount2 = function(count) {
        const abbreviations = ["K", "M", "B", "T"];
        for (let i = abbreviations.length - 1; i >= 0; i--) {
          const size = Math.pow(10, (i + 1) * 3);
          if (size <= count) {
            const formattedCount = Math.round(count / size * 10) / 10;
            return `${formattedCount}${abbreviations[i]}`;
          }
        }
        return `${count}`;
      };
      var calculateUploadAgo = calculateUploadAgo2, calculateVideoDuration = calculateVideoDuration2, formatCount = formatCount2;
      const zval = z4__namespace.object({
        query: z4__namespace.string()
      }).parse({ query });
      const EnResp = await Engine(zval);
      if (!EnResp)
        return reject2("Unable to get response from YouTube...");
      const uploadDate = EnResp.metaTube.upload_date;
      const uploadDateFormatted = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      );
      const currentDate = /* @__PURE__ */ new Date();
      const daysAgo = Math.floor(
        (currentDate.getTime() - uploadDateFormatted.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const prettyDate = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const uploadAgoObject = calculateUploadAgo2(daysAgo);
      const videoTimeInSeconds = EnResp.metaTube.duration;
      const videoDuration = calculateVideoDuration2(videoTimeInSeconds);
      const viewCountFormatted = formatCount2(EnResp.metaTube.view_count);
      const likeCountFormatted = formatCount2(EnResp.metaTube.like_count);
      const payload = {
        audio_data: EnResp.AudioTube,
        video_data: EnResp.VideoTube,
        hdrvideo_data: EnResp.HDRVideoTube,
        meta_data: {
          id: EnResp.metaTube.id,
          original_url: EnResp.metaTube.original_url,
          webpage_url: EnResp.metaTube.webpage_url,
          title: EnResp.metaTube.title,
          view_count: EnResp.metaTube.view_count,
          like_count: EnResp.metaTube.like_count,
          view_count_formatted: viewCountFormatted,
          like_count_formatted: likeCountFormatted,
          full_title: EnResp.metaTube.Fulltitle,
          uploader: EnResp.metaTube.uploader,
          uploader_id: EnResp.metaTube.uploader_id,
          uploader_url: EnResp.metaTube.uploader_url,
          thumbnail: EnResp.metaTube.thumbnail,
          categories: EnResp.metaTube.categories,
          time: videoTimeInSeconds,
          duration: videoDuration,
          age_limit: EnResp.metaTube.age_limit,
          live_status: EnResp.metaTube.live_status,
          description: EnResp.metaTube.description,
          full_description: EnResp.metaTube.description,
          upload_date: prettyDate,
          upload_ago: daysAgo,
          upload_ago_formatted: uploadAgoObject,
          comment_count: EnResp.metaTube.comment_count,
          comment_count_formatted: formatCount2(EnResp.metaTube.comment_count),
          channel_id: EnResp.metaTube.channel_id,
          channel_name: EnResp.metaTube.channel,
          channel_url: EnResp.metaTube.channel_url,
          channel_follower_count: EnResp.metaTube.channel_follower_count,
          channel_follower_count_formatted: formatCount2(
            EnResp.metaTube.channel_follower_count
          )
        }
      };
      resolve(payload);
    } catch (error) {
      reject2(error instanceof z4__namespace.ZodError ? error.errors : error);
    }
  });
}
async function get_playlist({
  playlistUrls
}) {
  try {
    const proTubeArr = [];
    const preTube = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const ispUrl = url.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors14__default.default.bold.red("ERROR: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp = await search2__default.default({ listId: ispUrl[1] });
      if (!resp) {
        console.error(
          colors14__default.default.bold.red("ERROR: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.videos.length; i++) {
        try {
          const videoId = resp.videos[i].videoId;
          const metaTube = await search2__default.default({ videoId });
          console.log(
            colors14__default.default.bold.green("INFO:"),
            colors14__default.default.bold.green("<("),
            metaTube.title,
            colors14__default.default.bold.green("by"),
            metaTube.author.name,
            colors14__default.default.bold.green(")>")
          );
          if (preTube.has(metaTube.videoId))
            continue;
          else {
            const {
              author: { name: authorName, url: authorUrl },
              duration,
              seconds,
              genre,
              ...newTube
            } = metaTube;
            proTubeArr.push({ ...newTube, authorName, authorUrl });
          }
        } catch (error) {
          console.error(colors14__default.default.bold.red("ERROR: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z4__namespace.ZodError ? error.errors : error;
  }
}
function list_formats({
  query
}) {
  return new Promise(async (resolve, reject2) => {
    try {
      const zval = z4__namespace.object({
        query: z4__namespace.string()
      }).parse({ query });
      const EnResp = await Engine(zval);
      if (!EnResp)
        return reject2("Unable to get response from YouTube...");
      const fprem = (data) => data.filter(
        (out) => !out.meta_dl.originalformat.includes("Premium")
      );
      const EnBody = {
        AudioFormatsData: fprem(EnResp.AudioTube).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted
        ]),
        VideoFormatsData: fprem(EnResp.VideoTube).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted
        ]),
        HdrVideoFormatsData: fprem(EnResp.HDRVideoTube).map((out) => [
          out.meta_dl.originalformat,
          out.meta_info.filesizebytes,
          out.meta_info.filesizeformatted
        ])
      };
      resolve(EnBody);
    } catch (error) {
      reject2(error instanceof z4__namespace.ZodError ? error.errors : error);
    }
  });
}
function get_video_data({
  query
}) {
  return new Promise(async (resolve, reject2) => {
    try {
      let calculateUploadAgo2 = function(days) {
        const years = Math.floor(days / 365);
        const months = Math.floor(days % 365 / 30);
        const remainingDays = days % 30;
        const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
        return {
          years,
          months,
          days: remainingDays,
          formatted: formattedString
        };
      }, calculateVideoDuration2 = function(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds % 3600 / 60);
        const remainingSeconds = seconds % 60;
        const formattedString = `${hours > 0 ? hours + " hours, " : ""}${minutes > 0 ? minutes + " minutes, " : ""}${remainingSeconds} seconds`;
        return {
          hours,
          minutes,
          seconds: remainingSeconds,
          formatted: formattedString
        };
      }, formatCount2 = function(count) {
        const abbreviations = ["K", "M", "B", "T"];
        for (let i = abbreviations.length - 1; i >= 0; i--) {
          const size = Math.pow(10, (i + 1) * 3);
          if (size <= count) {
            const formattedCount = Math.round(count / size * 10) / 10;
            return `${formattedCount}${abbreviations[i]}`;
          }
        }
        return `${count}`;
        z4__namespace;
      };
      var calculateUploadAgo = calculateUploadAgo2, calculateVideoDuration = calculateVideoDuration2, formatCount = formatCount2;
      const zval = z4__namespace.object({
        query: z4__namespace.string()
      }).parse({ query });
      const EnResp = await Engine(zval);
      if (!EnResp)
        return reject2("Unable to get response from YouTube...");
      const uploadDate = EnResp.metaTube.upload_date;
      const uploadDateFormatted = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      );
      const currentDate = /* @__PURE__ */ new Date();
      const daysAgo = Math.floor(
        (currentDate.getTime() - uploadDateFormatted.getTime()) / (1e3 * 60 * 60 * 24)
      );
      const prettyDate = new Date(
        uploadDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const uploadAgoObject = calculateUploadAgo2(daysAgo);
      const videoTimeInSeconds = EnResp.metaTube.duration;
      const videoDuration = calculateVideoDuration2(videoTimeInSeconds);
      const viewCountFormatted = formatCount2(EnResp.metaTube.view_count);
      const likeCountFormatted = formatCount2(EnResp.metaTube.like_count);
      resolve({
        id: EnResp.metaTube.id,
        original_url: EnResp.metaTube.original_url,
        webpage_url: EnResp.metaTube.webpage_url,
        title: EnResp.metaTube.title,
        view_count: EnResp.metaTube.view_count,
        like_count: EnResp.metaTube.like_count,
        view_count_formatted: viewCountFormatted,
        like_count_formatted: likeCountFormatted,
        uploader: EnResp.metaTube.uploader,
        uploader_id: EnResp.metaTube.uploader_id,
        uploader_url: EnResp.metaTube.uploader_url,
        thumbnail: EnResp.metaTube.thumbnail,
        categories: EnResp.metaTube.categories,
        time: videoTimeInSeconds,
        duration: videoDuration,
        age_limit: EnResp.metaTube.age_limit,
        live_status: EnResp.metaTube.live_status,
        description: EnResp.metaTube.description,
        full_description: EnResp.metaTube.description,
        upload_date: prettyDate,
        upload_ago: daysAgo,
        upload_ago_formatted: uploadAgoObject,
        comment_count: EnResp.metaTube.comment_count,
        comment_count_formatted: formatCount2(EnResp.metaTube.comment_count),
        channel_id: EnResp.metaTube.channel_id,
        channel_name: EnResp.metaTube.channel,
        channel_url: EnResp.metaTube.channel_url,
        channel_follower_count: EnResp.metaTube.channel_follower_count,
        channel_follower_count_formatted: formatCount2(
          EnResp.metaTube.channel_follower_count
        )
      });
    } catch (error) {
      reject2(error instanceof z4__namespace.ZodError ? error.errors : error);
    }
  });
}
async function extract_playlist_videos({
  playlistUrls
}) {
  try {
    const proTubeArr = [];
    const processedVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const ispUrl = url.match(/list=([a-zA-Z0-9_-]+)/);
      if (!ispUrl) {
        console.error(
          colors14__default.default.bold.red("ERROR: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp = await scrape(ispUrl[1]);
      if (!resp) {
        console.error(
          colors14__default.default.bold.red("ERROR: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.videos.length; i++) {
        try {
          const videoId = resp.videos[i].videoId;
          if (processedVideoIds.has(videoId))
            continue;
          const data = await Engine({ query: videoId });
          if (data instanceof Array)
            proTubeArr.push(...data);
          else
            proTubeArr.push(data);
          processedVideoIds.add(videoId);
        } catch (error) {
          console.error(colors14__default.default.bold.red("ERROR: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z4__namespace.ZodError ? error.errors : error;
  }
}

// core/base/lowEntry.ts
function lowEntry(out) {
  if (!out || out.length === 0)
    return null;
  return out.reduce(
    (prev, curr) => prev.meta_info.filesizebytes < curr.meta_info.filesizebytes ? prev : curr,
    out[0]
  );
}
var termwidth = process.stdout.columns;
var progressBar = (percent, _metaSpin) => {
  if (percent === void 0)
    return;
  const width = Math.floor(termwidth / 2);
  const scomp = Math.round(width * percent / 100);
  let color = colors14__default.default.green;
  if (percent < 20)
    color = colors14__default.default.red;
  else if (percent < 80)
    color = colors14__default.default.yellow;
  const sprog = color("\u2587").repeat(scomp) + color("\u2501").repeat(width - scomp);
  const sbar = color("PROG: ") + `${sprog} ${percent.toFixed(2)}%`;
  readline__default.default.cursorTo(process.stdout, 0);
  process.stdout.write(sbar);
};
var progressBar_default = progressBar;

// core/pipes/audio/AudioLowest.ts
var metaSpin = crypto.randomUUID().toString();
async function AudioLowest({
  query,
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp3"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = lowEntry(metaBody.AudioTube);
    const ytc = fluentffmpeg__default.default();
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.input(metaBody.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.format(outputFormat);
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin));
    ytc.on("close", () => progressBar_default(100, metaSpin));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin));
    ytc.on("error", (error) => {
      return error;
    });
    switch (filter2) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-core-(AudioLowest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-core-(AudioLowest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        metaName = `yt-core-(AudioLowest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-core-(AudioLowest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-core-(AudioLowest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-core-(AudioLowest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        metaName = `yt-core-(AudioLowest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-core-(AudioLowest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        metaName = `yt-core-(AudioLowest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        metaName = `yt-core-(AudioLowest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-core-(AudioLowest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        metaName = `yt-core-(AudioLowest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        metaName = `yt-core-(AudioLowest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-core-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-core-(AudioLowest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        ytc.withAudioFilter([]);
        metaName = `yt-core-(AudioLowest)-${title}.${outputFormat}`;
        break;
    }
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(null);
          callback();
        }
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
          resolve();
          return {
            status: 200,
            message: "process ended..."
          };
        }).run();
      });
      return {
        status: 200,
        message: "process ended..."
      };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}

// core/base/bigEntry.ts
function bigEntry(out) {
  if (!out || out.length === 0)
    return null;
  return out.reduce(
    (prev, curr) => prev.meta_info.filesizebytes > curr.meta_info.filesizebytes ? prev : curr,
    out[0]
  );
}
var metaSpin2 = crypto.randomUUID().toString();
async function AudioHighest({
  query,
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp3"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = bigEntry(metaBody.AudioTube);
    const ytc = fluentffmpeg__default.default();
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.input(metaBody.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.format(outputFormat);
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin2);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin2));
    ytc.on("close", () => progressBar_default(100, metaSpin2));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin2));
    ytc.on("error", (error) => {
      return error;
    });
    switch (filter2) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-core-(AudioHighest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-core-(AudioHighest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        metaName = `yt-core-(AudioHighest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-core-(AudioHighest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-core-(AudioHighest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-core-(AudioHighest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        metaName = `yt-core-(AudioHighest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-core-(AudioHighest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        metaName = `yt-core-(AudioHighest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        metaName = `yt-core-(AudioHighest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-core-(AudioHighest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        metaName = `yt-core-(AudioHighest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        metaName = `yt-core-(AudioHighest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-core-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-core-(AudioHighest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        ytc.withAudioFilter([]);
        metaName = `yt-core-(AudioHighest)-${title}.${outputFormat}`;
        break;
    }
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(null);
          callback();
        }
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
          resolve();
          return {
            status: 200,
            message: "process ended..."
          };
        }).run();
      });
      return {
        status: 200,
        message: "process ended..."
      };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin3 = crypto.randomUUID().toString();
async function VideoLowest({
  query,
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp4"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = lowEntry(metaBody.VideoTube);
    const ytc = fluentffmpeg__default.default();
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter2) {
      case "grayscale":
        ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-core_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.videoFilters("negate");
        metaName = `yt-core_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.videoFilters("rotate=PI/2");
        metaName = `yt-core_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.videoFilters("rotate=PI");
        metaName = `yt-core_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.videoFilters("rotate=3*PI/2");
        metaName = `yt-core_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.videoFilters("hflip");
        metaName = `yt-core_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.videoFilters("vflip");
        metaName = `yt-core_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-core_(VideoLowest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin3);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin3));
    ytc.on("close", () => progressBar_default(100, metaSpin3));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin3));
    ytc.on("error", (error) => {
      return error;
    });
    switch (stream$1) {
      case true:
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(null);
            callback();
          }
        });
        ytc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
        };
      default:
        await new Promise((resolve, reject2) => {
          ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
            resolve();
          }).run();
        });
        return {
          message: "process ended...",
          status: 200
        };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin4 = crypto.randomUUID().toString();
async function VideoHighest({
  query,
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp4"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    let metaName = "";
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = bigEntry(metaBody.VideoTube);
    const ytc = fluentffmpeg__default.default();
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter2) {
      case "grayscale":
        ytc.videoFilters("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.videoFilters("negate");
        metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.videoFilters("rotate=PI/2");
        metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.videoFilters("rotate=PI");
        metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.videoFilters("rotate=3*PI/2");
        metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.videoFilters("hflip");
        metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.videoFilters("vflip");
        metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin4);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin4));
    ytc.on("close", () => progressBar_default(100, metaSpin4));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin4));
    ytc.on("error", (error) => {
      return error;
    });
    switch (stream$1) {
      case true:
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(null);
            callback();
          }
        });
        ytc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
        };
      default:
        await new Promise((resolve, reject2) => {
          ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
            resolve();
          }).run();
        });
        return {
          message: "process ended...",
          status: 200
        };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin5 = crypto.randomUUID().toString();
async function AudioVideoLowest({
  query,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp4"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    let metaName = `yt-core_(AudioVideoLowest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(lowEntry(metaBody.VideoTube).meta_dl.mediaurl);
    ytc.addInput(lowEntry(metaBody.AudioTube).meta_dl.mediaurl);
    ytc.format(outputFormat);
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin5);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin5));
    ytc.on("close", () => progressBar_default(100, metaSpin5));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin5));
    ytc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(null);
          callback();
        }
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
          resolve();
          return {
            status: 200,
            message: "process ended..."
          };
        }).run();
      });
      return {
        status: 200,
        message: "process ended..."
      };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin6 = crypto.randomUUID().toString();
async function AudioVideoHighest({
  query,
  stream: stream$1,
  verbose,
  folderName,
  outputFormat = "mp4"
}) {
  try {
    if (!query || typeof query !== "string") {
      return {
        message: "Invalid query parameter",
        status: 500
      };
    }
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const title = metaBody.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    let metaName = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(bigEntry(metaBody.VideoTube).meta_dl.mediaurl);
    ytc.addInput(bigEntry(metaBody.AudioTube).meta_dl.mediaurl);
    ytc.format(outputFormat);
    ytc.on("start", (cmd) => {
      if (verbose)
        console.log(cmd);
      progressBar_default(0, metaSpin6);
    });
    ytc.on("end", () => progressBar_default(100, metaSpin6));
    ytc.on("close", () => progressBar_default(100, metaSpin6));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin6));
    ytc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(null);
          callback();
        }
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(path__namespace.join(metaFold, metaName)).on("error", reject2).on("end", () => {
          resolve();
          return {
            status: 200,
            message: "process ended..."
          };
        }).run();
      });
      return {
        status: 200,
        message: "process ended..."
      };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin7 = crypto.randomUUID().toString();
async function AudioQualityCustom({
  query,
  filter: filter2,
  quality,
  stream: stream$1,
  folderName,
  outputFormat = "mp3"
}) {
  try {
    if (!query || typeof query !== "string" || !quality || typeof quality !== "string") {
      return {
        message: "Invalid query or quality parameter",
        status: 500
      };
    }
    const metaResp = await Engine({ query });
    if (!metaResp) {
      return {
        message: "The specified quality was not found...",
        status: 500
      };
    }
    const metaBody = metaResp.AudioTube.filter(
      (op) => op.meta_dl.formatnote === quality
    );
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const title = metaResp.metaTube.title.replace(
      /[^a-zA-Z0-9_]+/g,
      "-"
    );
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg__default.default();
    const metaEntry = bigEntry(metaBody);
    ytc.input(metaEntry.meta_dl.mediaurl);
    ytc.input(metaResp.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.withAudioBitrate(metaEntry.meta_audio.bitrate);
    ytc.withAudioChannels(metaEntry.meta_audio.channels);
    ytc.format(outputFormat);
    switch (filter2) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        break;
      default:
        ytc.withAudioFilter([]);
        break;
    }
    ytc.on("start", () => progressBar_default(0, metaSpin7));
    ytc.on("end", () => progressBar_default(100, metaSpin7));
    ytc.on("close", () => progressBar_default(100, metaSpin7));
    ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin7));
    ytc.on("error", (error) => {
      return error;
    });
    if (stream$1) {
      const readStream = new stream.Readable({
        read() {
        }
      });
      const writeStream = new stream.Writable({
        write(chunk, _encoding, callback) {
          readStream.push(chunk);
          callback();
        },
        final(callback) {
          readStream.push(null);
          callback();
        }
      });
      ytc.pipe(writeStream, { end: true });
      return {
        stream: readStream,
        filename: folderName ? path__namespace.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`) : `yt-core-(${quality})-${title}.${outputFormat}`
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(
          path__namespace.join(metaFold, `yt-core-(${quality})-${title}.${outputFormat}`)
        ).on("error", reject2).on("end", () => {
          resolve();
        }).run();
      });
      return {
        message: "process ended...",
        status: 200
      };
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}
var metaSpin8 = crypto.randomUUID().toString();
async function VideoQualityCustom({
  query,
  filter: filter2,
  quality,
  stream: stream$1,
  folderName,
  outputFormat = "mp4"
}) {
  try {
    if (!query || typeof query !== "string" || !quality || typeof quality !== "string") {
      return {
        message: "Invalid query or quality parameter",
        status: 500
      };
    }
    const EnResp = await Engine({ query });
    if (!EnResp) {
      return {
        message: "The specified quality was not found...",
        status: 500
      };
    }
    const YSBody = EnResp.VideoTube.filter(
      (op) => op.meta_dl.formatnote === quality
    );
    if (!YSBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    } else {
      let ipop = "";
      const title = EnResp.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const opfol = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(opfol))
        fs__namespace.mkdirSync(opfol, { recursive: true });
      const ytc = fluentffmpeg__default.default();
      const metaEntry = bigEntry(YSBody);
      ytc.input(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      switch (filter2) {
        case "grayscale":
          ytc.withVideoFilter([
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          ]);
          ipop = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter(["negate"]);
          ipop = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter(["rotate=PI/2"]);
          ipop = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter(["rotate=PI"]);
          ipop = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter(["rotate=3*PI/2"]);
          ipop = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter(["hflip"]);
          ipop = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter(["vflip"]);
          ipop = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          ytc.withVideoFilter([]);
          ipop = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
      }
      ytc.on("start", () => {
        progressBar_default(0, metaSpin8);
      });
      ytc.on("end", () => progressBar_default(100, metaSpin8));
      ytc.on("close", () => progressBar_default(100, metaSpin8));
      ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin8));
      ytc.on("error", (error) => {
        return error;
      });
      if (stream$1) {
        const readStream = new stream.Readable({
          read() {
          }
        });
        const writeStream = new stream.Writable({
          write(chunk, _encoding, callback) {
            readStream.push(chunk);
            callback();
          },
          final(callback) {
            readStream.push(null);
            callback();
          }
        });
        ytc.pipe(writeStream, { end: true });
        return {
          stream: readStream,
          filename: folderName ? path__namespace.join(opfol, ipop) : ipop
        };
      } else {
        await new Promise((resolve, reject2) => {
          ytc.output(path__namespace.join(opfol, ipop)).on("error", reject2).on("end", () => {
            resolve();
          }).run();
        });
        return {
          message: "process ended...",
          status: 200
        };
      }
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500
        };
      default:
        return {
          message: "Internal server error",
          status: 500
        };
    }
  }
}

// node_modules/async/dist/async.mjs
function apply(fn, ...args) {
  return (...callArgs) => fn(...args, ...callArgs);
}
function initialParams(fn) {
  return function(...args) {
    var callback = args.pop();
    return fn.call(this, args, callback);
  };
}
var hasQueueMicrotask = typeof queueMicrotask === "function" && queueMicrotask;
var hasSetImmediate = typeof setImmediate === "function" && setImmediate;
var hasNextTick = typeof process === "object" && typeof process.nextTick === "function";
function fallback(fn) {
  setTimeout(fn, 0);
}
function wrap(defer) {
  return (fn, ...args) => defer(() => fn(...args));
}
var _defer$1;
if (hasQueueMicrotask) {
  _defer$1 = queueMicrotask;
} else if (hasSetImmediate) {
  _defer$1 = setImmediate;
} else if (hasNextTick) {
  _defer$1 = process.nextTick;
} else {
  _defer$1 = fallback;
}
var setImmediate$1 = wrap(_defer$1);
function asyncify(func) {
  if (isAsync(func)) {
    return function(...args) {
      const callback = args.pop();
      const promise = func.apply(this, args);
      return handlePromise(promise, callback);
    };
  }
  return initialParams(function(args, callback) {
    var result;
    try {
      result = func.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result && typeof result.then === "function") {
      return handlePromise(result, callback);
    } else {
      callback(null, result);
    }
  });
}
function handlePromise(promise, callback) {
  return promise.then((value) => {
    invokeCallback(callback, null, value);
  }, (err) => {
    invokeCallback(callback, err && (err instanceof Error || err.message) ? err : new Error(err));
  });
}
function invokeCallback(callback, error, value) {
  try {
    callback(error, value);
  } catch (err) {
    setImmediate$1((e) => {
      throw e;
    }, err);
  }
}
function isAsync(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}
function isAsyncGenerator(fn) {
  return fn[Symbol.toStringTag] === "AsyncGenerator";
}
function isAsyncIterable(obj) {
  return typeof obj[Symbol.asyncIterator] === "function";
}
function wrapAsync(asyncFn) {
  if (typeof asyncFn !== "function")
    throw new Error("expected a function");
  return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
}
function awaitify(asyncFn, arity) {
  if (!arity)
    arity = asyncFn.length;
  if (!arity)
    throw new Error("arity is undefined");
  function awaitable(...args) {
    if (typeof args[arity - 1] === "function") {
      return asyncFn.apply(this, args);
    }
    return new Promise((resolve, reject2) => {
      args[arity - 1] = (err, ...cbArgs) => {
        if (err)
          return reject2(err);
        resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
      };
      asyncFn.apply(this, args);
    });
  }
  return awaitable;
}
function applyEach$1(eachfn) {
  return function applyEach2(fns, ...callArgs) {
    const go = awaitify(function(callback) {
      var that = this;
      return eachfn(fns, (fn, cb) => {
        wrapAsync(fn).apply(that, callArgs.concat(cb));
      }, callback);
    });
    return go;
  };
}
function _asyncMap(eachfn, arr, iteratee, callback) {
  arr = arr || [];
  var results = [];
  var counter = 0;
  var _iteratee = wrapAsync(iteratee);
  return eachfn(arr, (value, _, iterCb) => {
    var index2 = counter++;
    _iteratee(value, (err, v) => {
      results[index2] = v;
      iterCb(err);
    });
  }, (err) => {
    callback(err, results);
  });
}
function isArrayLike(value) {
  return value && typeof value.length === "number" && value.length >= 0 && value.length % 1 === 0;
}
var breakLoop = {};
var breakLoop$1 = breakLoop;
function once(fn) {
  function wrapper(...args) {
    if (fn === null)
      return;
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  }
  Object.assign(wrapper, fn);
  return wrapper;
}
function getIterator(coll) {
  return coll[Symbol.iterator] && coll[Symbol.iterator]();
}
function createArrayIterator(coll) {
  var i = -1;
  var len = coll.length;
  return function next() {
    return ++i < len ? { value: coll[i], key: i } : null;
  };
}
function createES2015Iterator(iterator) {
  var i = -1;
  return function next() {
    var item = iterator.next();
    if (item.done)
      return null;
    i++;
    return { value: item.value, key: i };
  };
}
function createObjectIterator(obj) {
  var okeys = obj ? Object.keys(obj) : [];
  var i = -1;
  var len = okeys.length;
  return function next() {
    var key = okeys[++i];
    if (key === "__proto__") {
      return next();
    }
    return i < len ? { value: obj[key], key } : null;
  };
}
function createIterator(coll) {
  if (isArrayLike(coll)) {
    return createArrayIterator(coll);
  }
  var iterator = getIterator(coll);
  return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
function onlyOnce(fn) {
  return function(...args) {
    if (fn === null)
      throw new Error("Callback was already called.");
    var callFn = fn;
    fn = null;
    callFn.apply(this, args);
  };
}
function asyncEachOfLimit(generator, limit, iteratee, callback) {
  let done = false;
  let canceled = false;
  let awaiting = false;
  let running = 0;
  let idx = 0;
  function replenish() {
    if (running >= limit || awaiting || done)
      return;
    awaiting = true;
    generator.next().then(({ value, done: iterDone }) => {
      if (canceled || done)
        return;
      awaiting = false;
      if (iterDone) {
        done = true;
        if (running <= 0) {
          callback(null);
        }
        return;
      }
      running++;
      iteratee(value, idx, iterateeCallback);
      idx++;
      replenish();
    }).catch(handleError);
  }
  function iterateeCallback(err, result) {
    running -= 1;
    if (canceled)
      return;
    if (err)
      return handleError(err);
    if (err === false) {
      done = true;
      canceled = true;
      return;
    }
    if (result === breakLoop$1 || done && running <= 0) {
      done = true;
      return callback(null);
    }
    replenish();
  }
  function handleError(err) {
    if (canceled)
      return;
    awaiting = false;
    done = true;
    callback(err);
  }
  replenish();
}
var eachOfLimit$2 = (limit) => {
  return (obj, iteratee, callback) => {
    callback = once(callback);
    if (limit <= 0) {
      throw new RangeError("concurrency limit cannot be less than 1");
    }
    if (!obj) {
      return callback(null);
    }
    if (isAsyncGenerator(obj)) {
      return asyncEachOfLimit(obj, limit, iteratee, callback);
    }
    if (isAsyncIterable(obj)) {
      return asyncEachOfLimit(obj[Symbol.asyncIterator](), limit, iteratee, callback);
    }
    var nextElem = createIterator(obj);
    var done = false;
    var canceled = false;
    var running = 0;
    var looping = false;
    function iterateeCallback(err, value) {
      if (canceled)
        return;
      running -= 1;
      if (err) {
        done = true;
        callback(err);
      } else if (err === false) {
        done = true;
        canceled = true;
      } else if (value === breakLoop$1 || done && running <= 0) {
        done = true;
        return callback(null);
      } else if (!looping) {
        replenish();
      }
    }
    function replenish() {
      looping = true;
      while (running < limit && !done) {
        var elem = nextElem();
        if (elem === null) {
          done = true;
          if (running <= 0) {
            callback(null);
          }
          return;
        }
        running += 1;
        iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      }
      looping = false;
    }
    replenish();
  };
};
function eachOfLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, wrapAsync(iteratee), callback);
}
var eachOfLimit$1 = awaitify(eachOfLimit, 4);
function eachOfArrayLike(coll, iteratee, callback) {
  callback = once(callback);
  var index2 = 0, completed = 0, { length } = coll, canceled = false;
  if (length === 0) {
    callback(null);
  }
  function iteratorCallback(err, value) {
    if (err === false) {
      canceled = true;
    }
    if (canceled === true)
      return;
    if (err) {
      callback(err);
    } else if (++completed === length || value === breakLoop$1) {
      callback(null);
    }
  }
  for (; index2 < length; index2++) {
    iteratee(coll[index2], index2, onlyOnce(iteratorCallback));
  }
}
function eachOfGeneric(coll, iteratee, callback) {
  return eachOfLimit$1(coll, Infinity, iteratee, callback);
}
function eachOf(coll, iteratee, callback) {
  var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
  return eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
var eachOf$1 = awaitify(eachOf, 3);
function map(coll, iteratee, callback) {
  return _asyncMap(eachOf$1, coll, iteratee, callback);
}
var map$1 = awaitify(map, 3);
var applyEach = applyEach$1(map$1);
function eachOfSeries(coll, iteratee, callback) {
  return eachOfLimit$1(coll, 1, iteratee, callback);
}
var eachOfSeries$1 = awaitify(eachOfSeries, 3);
function mapSeries(coll, iteratee, callback) {
  return _asyncMap(eachOfSeries$1, coll, iteratee, callback);
}
var mapSeries$1 = awaitify(mapSeries, 3);
var applyEachSeries = applyEach$1(mapSeries$1);
var PROMISE_SYMBOL = Symbol("promiseCallback");
function promiseCallback() {
  let resolve, reject2;
  function callback(err, ...args) {
    if (err)
      return reject2(err);
    resolve(args.length > 1 ? args : args[0]);
  }
  callback[PROMISE_SYMBOL] = new Promise((res, rej) => {
    resolve = res, reject2 = rej;
  });
  return callback;
}
function auto(tasks, concurrency, callback) {
  if (typeof concurrency !== "number") {
    callback = concurrency;
    concurrency = null;
  }
  callback = once(callback || promiseCallback());
  var numTasks = Object.keys(tasks).length;
  if (!numTasks) {
    return callback(null);
  }
  if (!concurrency) {
    concurrency = numTasks;
  }
  var results = {};
  var runningTasks = 0;
  var canceled = false;
  var hasError = false;
  var listeners = /* @__PURE__ */ Object.create(null);
  var readyTasks = [];
  var readyToCheck = [];
  var uncheckedDependencies = {};
  Object.keys(tasks).forEach((key) => {
    var task = tasks[key];
    if (!Array.isArray(task)) {
      enqueueTask(key, [task]);
      readyToCheck.push(key);
      return;
    }
    var dependencies = task.slice(0, task.length - 1);
    var remainingDependencies = dependencies.length;
    if (remainingDependencies === 0) {
      enqueueTask(key, task);
      readyToCheck.push(key);
      return;
    }
    uncheckedDependencies[key] = remainingDependencies;
    dependencies.forEach((dependencyName) => {
      if (!tasks[dependencyName]) {
        throw new Error("async.auto task `" + key + "` has a non-existent dependency `" + dependencyName + "` in " + dependencies.join(", "));
      }
      addListener(dependencyName, () => {
        remainingDependencies--;
        if (remainingDependencies === 0) {
          enqueueTask(key, task);
        }
      });
    });
  });
  checkForDeadlocks();
  processQueue();
  function enqueueTask(key, task) {
    readyTasks.push(() => runTask(key, task));
  }
  function processQueue() {
    if (canceled)
      return;
    if (readyTasks.length === 0 && runningTasks === 0) {
      return callback(null, results);
    }
    while (readyTasks.length && runningTasks < concurrency) {
      var run = readyTasks.shift();
      run();
    }
  }
  function addListener(taskName, fn) {
    var taskListeners = listeners[taskName];
    if (!taskListeners) {
      taskListeners = listeners[taskName] = [];
    }
    taskListeners.push(fn);
  }
  function taskComplete(taskName) {
    var taskListeners = listeners[taskName] || [];
    taskListeners.forEach((fn) => fn());
    processQueue();
  }
  function runTask(key, task) {
    if (hasError)
      return;
    var taskCallback = onlyOnce((err, ...result) => {
      runningTasks--;
      if (err === false) {
        canceled = true;
        return;
      }
      if (result.length < 2) {
        [result] = result;
      }
      if (err) {
        var safeResults = {};
        Object.keys(results).forEach((rkey) => {
          safeResults[rkey] = results[rkey];
        });
        safeResults[key] = result;
        hasError = true;
        listeners = /* @__PURE__ */ Object.create(null);
        if (canceled)
          return;
        callback(err, safeResults);
      } else {
        results[key] = result;
        taskComplete(key);
      }
    });
    runningTasks++;
    var taskFn = wrapAsync(task[task.length - 1]);
    if (task.length > 1) {
      taskFn(results, taskCallback);
    } else {
      taskFn(taskCallback);
    }
  }
  function checkForDeadlocks() {
    var currentTask;
    var counter = 0;
    while (readyToCheck.length) {
      currentTask = readyToCheck.pop();
      counter++;
      getDependents(currentTask).forEach((dependent) => {
        if (--uncheckedDependencies[dependent] === 0) {
          readyToCheck.push(dependent);
        }
      });
    }
    if (counter !== numTasks) {
      throw new Error(
        "async.auto cannot execute tasks due to a recursive dependency"
      );
    }
  }
  function getDependents(taskName) {
    var result = [];
    Object.keys(tasks).forEach((key) => {
      const task = tasks[key];
      if (Array.isArray(task) && task.indexOf(taskName) >= 0) {
        result.push(key);
      }
    });
    return result;
  }
  return callback[PROMISE_SYMBOL];
}
var FN_ARGS = /^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;
var ARROW_FN_ARGS = /^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
function stripComments(string4) {
  let stripped = "";
  let index2 = 0;
  let endBlockComment = string4.indexOf("*/");
  while (index2 < string4.length) {
    if (string4[index2] === "/" && string4[index2 + 1] === "/") {
      let endIndex = string4.indexOf("\n", index2);
      index2 = endIndex === -1 ? string4.length : endIndex;
    } else if (endBlockComment !== -1 && string4[index2] === "/" && string4[index2 + 1] === "*") {
      let endIndex = string4.indexOf("*/", index2);
      if (endIndex !== -1) {
        index2 = endIndex + 2;
        endBlockComment = string4.indexOf("*/", index2);
      } else {
        stripped += string4[index2];
        index2++;
      }
    } else {
      stripped += string4[index2];
      index2++;
    }
  }
  return stripped;
}
function parseParams(func) {
  const src = stripComments(func.toString());
  let match = src.match(FN_ARGS);
  if (!match) {
    match = src.match(ARROW_FN_ARGS);
  }
  if (!match)
    throw new Error("could not parse args in autoInject\nSource:\n" + src);
  let [, args] = match;
  return args.replace(/\s/g, "").split(FN_ARG_SPLIT).map((arg) => arg.replace(FN_ARG, "").trim());
}
function autoInject(tasks, callback) {
  var newTasks = {};
  Object.keys(tasks).forEach((key) => {
    var taskFn = tasks[key];
    var params;
    var fnIsAsync = isAsync(taskFn);
    var hasNoDeps = !fnIsAsync && taskFn.length === 1 || fnIsAsync && taskFn.length === 0;
    if (Array.isArray(taskFn)) {
      params = [...taskFn];
      taskFn = params.pop();
      newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
    } else if (hasNoDeps) {
      newTasks[key] = taskFn;
    } else {
      params = parseParams(taskFn);
      if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
        throw new Error("autoInject task functions require explicit parameters.");
      }
      if (!fnIsAsync)
        params.pop();
      newTasks[key] = params.concat(newTask);
    }
    function newTask(results, taskCb) {
      var newArgs = params.map((name) => results[name]);
      newArgs.push(taskCb);
      wrapAsync(taskFn)(...newArgs);
    }
  });
  return auto(newTasks, callback);
}
var DLL = class {
  constructor() {
    this.head = this.tail = null;
    this.length = 0;
  }
  removeLink(node) {
    if (node.prev)
      node.prev.next = node.next;
    else
      this.head = node.next;
    if (node.next)
      node.next.prev = node.prev;
    else
      this.tail = node.prev;
    node.prev = node.next = null;
    this.length -= 1;
    return node;
  }
  empty() {
    while (this.head)
      this.shift();
    return this;
  }
  insertAfter(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next)
      node.next.prev = newNode;
    else
      this.tail = newNode;
    node.next = newNode;
    this.length += 1;
  }
  insertBefore(node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev)
      node.prev.next = newNode;
    else
      this.head = newNode;
    node.prev = newNode;
    this.length += 1;
  }
  unshift(node) {
    if (this.head)
      this.insertBefore(this.head, node);
    else
      setInitial(this, node);
  }
  push(node) {
    if (this.tail)
      this.insertAfter(this.tail, node);
    else
      setInitial(this, node);
  }
  shift() {
    return this.head && this.removeLink(this.head);
  }
  pop() {
    return this.tail && this.removeLink(this.tail);
  }
  toArray() {
    return [...this];
  }
  *[Symbol.iterator]() {
    var cur = this.head;
    while (cur) {
      yield cur.data;
      cur = cur.next;
    }
  }
  remove(testFn) {
    var curr = this.head;
    while (curr) {
      var { next } = curr;
      if (testFn(curr)) {
        this.removeLink(curr);
      }
      curr = next;
    }
    return this;
  }
};
function setInitial(dll, node) {
  dll.length = 1;
  dll.head = dll.tail = node;
}
function queue$1(worker, concurrency, payload) {
  if (concurrency == null) {
    concurrency = 1;
  } else if (concurrency === 0) {
    throw new RangeError("Concurrency must not be zero");
  }
  var _worker = wrapAsync(worker);
  var numRunning = 0;
  var workersList = [];
  const events = {
    error: [],
    drain: [],
    saturated: [],
    unsaturated: [],
    empty: []
  };
  function on(event, handler) {
    events[event].push(handler);
  }
  function once2(event, handler) {
    const handleAndRemove = (...args) => {
      off(event, handleAndRemove);
      handler(...args);
    };
    events[event].push(handleAndRemove);
  }
  function off(event, handler) {
    if (!event)
      return Object.keys(events).forEach((ev) => events[ev] = []);
    if (!handler)
      return events[event] = [];
    events[event] = events[event].filter((ev) => ev !== handler);
  }
  function trigger(event, ...args) {
    events[event].forEach((handler) => handler(...args));
  }
  var processingScheduled = false;
  function _insert(data, insertAtFront, rejectOnError, callback) {
    if (callback != null && typeof callback !== "function") {
      throw new Error("task callback must be a function");
    }
    q.started = true;
    var res, rej;
    function promiseCallback2(err, ...args) {
      if (err)
        return rejectOnError ? rej(err) : res();
      if (args.length <= 1)
        return res(args[0]);
      res(args);
    }
    var item = q._createTaskItem(
      data,
      rejectOnError ? promiseCallback2 : callback || promiseCallback2
    );
    if (insertAtFront) {
      q._tasks.unshift(item);
    } else {
      q._tasks.push(item);
    }
    if (!processingScheduled) {
      processingScheduled = true;
      setImmediate$1(() => {
        processingScheduled = false;
        q.process();
      });
    }
    if (rejectOnError || !callback) {
      return new Promise((resolve, reject2) => {
        res = resolve;
        rej = reject2;
      });
    }
  }
  function _createCB(tasks) {
    return function(err, ...args) {
      numRunning -= 1;
      for (var i = 0, l = tasks.length; i < l; i++) {
        var task = tasks[i];
        var index2 = workersList.indexOf(task);
        if (index2 === 0) {
          workersList.shift();
        } else if (index2 > 0) {
          workersList.splice(index2, 1);
        }
        task.callback(err, ...args);
        if (err != null) {
          trigger("error", err, task.data);
        }
      }
      if (numRunning <= q.concurrency - q.buffer) {
        trigger("unsaturated");
      }
      if (q.idle()) {
        trigger("drain");
      }
      q.process();
    };
  }
  function _maybeDrain(data) {
    if (data.length === 0 && q.idle()) {
      setImmediate$1(() => trigger("drain"));
      return true;
    }
    return false;
  }
  const eventMethod = (name) => (handler) => {
    if (!handler) {
      return new Promise((resolve, reject2) => {
        once2(name, (err, data) => {
          if (err)
            return reject2(err);
          resolve(data);
        });
      });
    }
    off(name);
    on(name, handler);
  };
  var isProcessing = false;
  var q = {
    _tasks: new DLL(),
    _createTaskItem(data, callback) {
      return {
        data,
        callback
      };
    },
    *[Symbol.iterator]() {
      yield* q._tasks[Symbol.iterator]();
    },
    concurrency,
    payload,
    buffer: concurrency / 4,
    started: false,
    paused: false,
    push(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, false, false, callback));
      }
      return _insert(data, false, false, callback);
    },
    pushAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, false, true, callback));
      }
      return _insert(data, false, true, callback);
    },
    kill() {
      off();
      q._tasks.empty();
    },
    unshift(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, true, false, callback));
      }
      return _insert(data, true, false, callback);
    },
    unshiftAsync(data, callback) {
      if (Array.isArray(data)) {
        if (_maybeDrain(data))
          return;
        return data.map((datum) => _insert(datum, true, true, callback));
      }
      return _insert(data, true, true, callback);
    },
    remove(testFn) {
      q._tasks.remove(testFn);
    },
    process() {
      if (isProcessing) {
        return;
      }
      isProcessing = true;
      while (!q.paused && numRunning < q.concurrency && q._tasks.length) {
        var tasks = [], data = [];
        var l = q._tasks.length;
        if (q.payload)
          l = Math.min(l, q.payload);
        for (var i = 0; i < l; i++) {
          var node = q._tasks.shift();
          tasks.push(node);
          workersList.push(node);
          data.push(node.data);
        }
        numRunning += 1;
        if (q._tasks.length === 0) {
          trigger("empty");
        }
        if (numRunning === q.concurrency) {
          trigger("saturated");
        }
        var cb = onlyOnce(_createCB(tasks));
        _worker(data, cb);
      }
      isProcessing = false;
    },
    length() {
      return q._tasks.length;
    },
    running() {
      return numRunning;
    },
    workersList() {
      return workersList;
    },
    idle() {
      return q._tasks.length + numRunning === 0;
    },
    pause() {
      q.paused = true;
    },
    resume() {
      if (q.paused === false) {
        return;
      }
      q.paused = false;
      setImmediate$1(q.process);
    }
  };
  Object.defineProperties(q, {
    saturated: {
      writable: false,
      value: eventMethod("saturated")
    },
    unsaturated: {
      writable: false,
      value: eventMethod("unsaturated")
    },
    empty: {
      writable: false,
      value: eventMethod("empty")
    },
    drain: {
      writable: false,
      value: eventMethod("drain")
    },
    error: {
      writable: false,
      value: eventMethod("error")
    }
  });
  return q;
}
function cargo$1(worker, payload) {
  return queue$1(worker, 1, payload);
}
function cargo(worker, concurrency, payload) {
  return queue$1(worker, concurrency, payload);
}
function reduce(coll, memo, iteratee, callback) {
  callback = once(callback);
  var _iteratee = wrapAsync(iteratee);
  return eachOfSeries$1(coll, (x, i, iterCb) => {
    _iteratee(memo, x, (err, v) => {
      memo = v;
      iterCb(err);
    });
  }, (err) => callback(err, memo));
}
var reduce$1 = awaitify(reduce, 4);
function seq(...functions) {
  var _functions = functions.map(wrapAsync);
  return function(...args) {
    var that = this;
    var cb = args[args.length - 1];
    if (typeof cb == "function") {
      args.pop();
    } else {
      cb = promiseCallback();
    }
    reduce$1(
      _functions,
      args,
      (newargs, fn, iterCb) => {
        fn.apply(that, newargs.concat((err, ...nextargs) => {
          iterCb(err, nextargs);
        }));
      },
      (err, results) => cb(err, ...results)
    );
    return cb[PROMISE_SYMBOL];
  };
}
function compose(...args) {
  return seq(...args.reverse());
}
function mapLimit(coll, limit, iteratee, callback) {
  return _asyncMap(eachOfLimit$2(limit), coll, iteratee, callback);
}
var mapLimit$1 = awaitify(mapLimit, 4);
function concatLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, ...args) => {
      if (err)
        return iterCb(err);
      return iterCb(err, args);
    });
  }, (err, mapResults) => {
    var result = [];
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        result = result.concat(...mapResults[i]);
      }
    }
    return callback(err, result);
  });
}
var concatLimit$1 = awaitify(concatLimit, 4);
function concat(coll, iteratee, callback) {
  return concatLimit$1(coll, Infinity, iteratee, callback);
}
var concat$1 = awaitify(concat, 3);
function concatSeries(coll, iteratee, callback) {
  return concatLimit$1(coll, 1, iteratee, callback);
}
var concatSeries$1 = awaitify(concatSeries, 3);
function constant$1(...args) {
  return function(...ignoredArgs) {
    var callback = ignoredArgs.pop();
    return callback(null, ...args);
  };
}
function _createTester(check, getResult) {
  return (eachfn, arr, _iteratee, cb) => {
    var testPassed = false;
    var testResult;
    const iteratee = wrapAsync(_iteratee);
    eachfn(arr, (value, _, callback) => {
      iteratee(value, (err, result) => {
        if (err || err === false)
          return callback(err);
        if (check(result) && !testResult) {
          testPassed = true;
          testResult = getResult(true, value);
          return callback(null, breakLoop$1);
        }
        callback();
      });
    }, (err) => {
      if (err)
        return cb(err);
      cb(null, testPassed ? testResult : getResult(false));
    });
  };
}
function detect(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOf$1, coll, iteratee, callback);
}
var detect$1 = awaitify(detect, 3);
function detectLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(limit), coll, iteratee, callback);
}
var detectLimit$1 = awaitify(detectLimit, 4);
function detectSeries(coll, iteratee, callback) {
  return _createTester((bool) => bool, (res, item) => item)(eachOfLimit$2(1), coll, iteratee, callback);
}
var detectSeries$1 = awaitify(detectSeries, 3);
function consoleFunc(name) {
  return (fn, ...args) => wrapAsync(fn)(...args, (err, ...resultArgs) => {
    if (typeof console === "object") {
      if (err) {
        if (console.error) {
          console.error(err);
        }
      } else if (console[name]) {
        resultArgs.forEach((x) => console[name](x));
      }
    }
  });
}
var dir = consoleFunc("dir");
function doWhilst(iteratee, test, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results;
  function next(err, ...args) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    results = args;
    _test(...args, check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return check(null, true);
}
var doWhilst$1 = awaitify(doWhilst, 3);
function doUntil(iteratee, test, callback) {
  const _test = wrapAsync(test);
  return doWhilst$1(iteratee, (...args) => {
    const cb = args.pop();
    _test(...args, (err, truth) => cb(err, !truth));
  }, callback);
}
function _withoutIndex(iteratee) {
  return (value, index2, callback) => iteratee(value, callback);
}
function eachLimit$2(coll, iteratee, callback) {
  return eachOf$1(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var each = awaitify(eachLimit$2, 3);
function eachLimit(coll, limit, iteratee, callback) {
  return eachOfLimit$2(limit)(coll, _withoutIndex(wrapAsync(iteratee)), callback);
}
var eachLimit$1 = awaitify(eachLimit, 4);
function eachSeries(coll, iteratee, callback) {
  return eachLimit$1(coll, 1, iteratee, callback);
}
var eachSeries$1 = awaitify(eachSeries, 3);
function ensureAsync(fn) {
  if (isAsync(fn))
    return fn;
  return function(...args) {
    var callback = args.pop();
    var sync = true;
    args.push((...innerArgs) => {
      if (sync) {
        setImmediate$1(() => callback(...innerArgs));
      } else {
        callback(...innerArgs);
      }
    });
    fn.apply(this, args);
    sync = false;
  };
}
function every(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOf$1, coll, iteratee, callback);
}
var every$1 = awaitify(every, 3);
function everyLimit(coll, limit, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
var everyLimit$1 = awaitify(everyLimit, 4);
function everySeries(coll, iteratee, callback) {
  return _createTester((bool) => !bool, (res) => !res)(eachOfSeries$1, coll, iteratee, callback);
}
var everySeries$1 = awaitify(everySeries, 3);
function filterArray(eachfn, arr, iteratee, callback) {
  var truthValues = new Array(arr.length);
  eachfn(arr, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      truthValues[index2] = !!v;
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    var results = [];
    for (var i = 0; i < arr.length; i++) {
      if (truthValues[i])
        results.push(arr[i]);
    }
    callback(null, results);
  });
}
function filterGeneric(eachfn, coll, iteratee, callback) {
  var results = [];
  eachfn(coll, (x, index2, iterCb) => {
    iteratee(x, (err, v) => {
      if (err)
        return iterCb(err);
      if (v) {
        results.push({ index: index2, value: x });
      }
      iterCb(err);
    });
  }, (err) => {
    if (err)
      return callback(err);
    callback(null, results.sort((a, b) => a.index - b.index).map((v) => v.value));
  });
}
function _filter(eachfn, coll, iteratee, callback) {
  var filter2 = isArrayLike(coll) ? filterArray : filterGeneric;
  return filter2(eachfn, coll, wrapAsync(iteratee), callback);
}
function filter(coll, iteratee, callback) {
  return _filter(eachOf$1, coll, iteratee, callback);
}
var filter$1 = awaitify(filter, 3);
function filterLimit(coll, limit, iteratee, callback) {
  return _filter(eachOfLimit$2(limit), coll, iteratee, callback);
}
var filterLimit$1 = awaitify(filterLimit, 4);
function filterSeries(coll, iteratee, callback) {
  return _filter(eachOfSeries$1, coll, iteratee, callback);
}
var filterSeries$1 = awaitify(filterSeries, 3);
function forever(fn, errback) {
  var done = onlyOnce(errback);
  var task = wrapAsync(ensureAsync(fn));
  function next(err) {
    if (err)
      return done(err);
    if (err === false)
      return;
    task(next);
  }
  return next();
}
var forever$1 = awaitify(forever, 2);
function groupByLimit(coll, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(coll, limit, (val, iterCb) => {
    _iteratee(val, (err, key) => {
      if (err)
        return iterCb(err);
      return iterCb(err, { key, val });
    });
  }, (err, mapResults) => {
    var result = {};
    var { hasOwnProperty } = Object.prototype;
    for (var i = 0; i < mapResults.length; i++) {
      if (mapResults[i]) {
        var { key } = mapResults[i];
        var { val } = mapResults[i];
        if (hasOwnProperty.call(result, key)) {
          result[key].push(val);
        } else {
          result[key] = [val];
        }
      }
    }
    return callback(err, result);
  });
}
var groupByLimit$1 = awaitify(groupByLimit, 4);
function groupBy(coll, iteratee, callback) {
  return groupByLimit$1(coll, Infinity, iteratee, callback);
}
function groupBySeries(coll, iteratee, callback) {
  return groupByLimit$1(coll, 1, iteratee, callback);
}
var log = consoleFunc("log");
function mapValuesLimit(obj, limit, iteratee, callback) {
  callback = once(callback);
  var newObj = {};
  var _iteratee = wrapAsync(iteratee);
  return eachOfLimit$2(limit)(obj, (val, key, next) => {
    _iteratee(val, key, (err, result) => {
      if (err)
        return next(err);
      newObj[key] = result;
      next(err);
    });
  }, (err) => callback(err, newObj));
}
var mapValuesLimit$1 = awaitify(mapValuesLimit, 4);
function mapValues(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, Infinity, iteratee, callback);
}
function mapValuesSeries(obj, iteratee, callback) {
  return mapValuesLimit$1(obj, 1, iteratee, callback);
}
function memoize(fn, hasher = (v) => v) {
  var memo = /* @__PURE__ */ Object.create(null);
  var queues = /* @__PURE__ */ Object.create(null);
  var _fn = wrapAsync(fn);
  var memoized = initialParams((args, callback) => {
    var key = hasher(...args);
    if (key in memo) {
      setImmediate$1(() => callback(null, ...memo[key]));
    } else if (key in queues) {
      queues[key].push(callback);
    } else {
      queues[key] = [callback];
      _fn(...args, (err, ...resultArgs) => {
        if (!err) {
          memo[key] = resultArgs;
        }
        var q = queues[key];
        delete queues[key];
        for (var i = 0, l = q.length; i < l; i++) {
          q[i](err, ...resultArgs);
        }
      });
    }
  });
  memoized.memo = memo;
  memoized.unmemoized = fn;
  return memoized;
}
var _defer;
if (hasNextTick) {
  _defer = process.nextTick;
} else if (hasSetImmediate) {
  _defer = setImmediate;
} else {
  _defer = fallback;
}
var nextTick = wrap(_defer);
var _parallel = awaitify((eachfn, tasks, callback) => {
  var results = isArrayLike(tasks) ? [] : {};
  eachfn(tasks, (task, key, taskCb) => {
    wrapAsync(task)((err, ...result) => {
      if (result.length < 2) {
        [result] = result;
      }
      results[key] = result;
      taskCb(err);
    });
  }, (err) => callback(err, results));
}, 3);
function parallel(tasks, callback) {
  return _parallel(eachOf$1, tasks, callback);
}
function parallelLimit(tasks, limit, callback) {
  return _parallel(eachOfLimit$2(limit), tasks, callback);
}
function queue(worker, concurrency) {
  var _worker = wrapAsync(worker);
  return queue$1((items, cb) => {
    _worker(items[0], cb);
  }, concurrency, 1);
}
var Heap = class {
  constructor() {
    this.heap = [];
    this.pushCount = Number.MIN_SAFE_INTEGER;
  }
  get length() {
    return this.heap.length;
  }
  empty() {
    this.heap = [];
    return this;
  }
  percUp(index2) {
    let p;
    while (index2 > 0 && smaller(this.heap[index2], this.heap[p = parent(index2)])) {
      let t = this.heap[index2];
      this.heap[index2] = this.heap[p];
      this.heap[p] = t;
      index2 = p;
    }
  }
  percDown(index2) {
    let l;
    while ((l = leftChi(index2)) < this.heap.length) {
      if (l + 1 < this.heap.length && smaller(this.heap[l + 1], this.heap[l])) {
        l = l + 1;
      }
      if (smaller(this.heap[index2], this.heap[l])) {
        break;
      }
      let t = this.heap[index2];
      this.heap[index2] = this.heap[l];
      this.heap[l] = t;
      index2 = l;
    }
  }
  push(node) {
    node.pushCount = ++this.pushCount;
    this.heap.push(node);
    this.percUp(this.heap.length - 1);
  }
  unshift(node) {
    return this.heap.push(node);
  }
  shift() {
    let [top] = this.heap;
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.percDown(0);
    return top;
  }
  toArray() {
    return [...this];
  }
  *[Symbol.iterator]() {
    for (let i = 0; i < this.heap.length; i++) {
      yield this.heap[i].data;
    }
  }
  remove(testFn) {
    let j = 0;
    for (let i = 0; i < this.heap.length; i++) {
      if (!testFn(this.heap[i])) {
        this.heap[j] = this.heap[i];
        j++;
      }
    }
    this.heap.splice(j);
    for (let i = parent(this.heap.length - 1); i >= 0; i--) {
      this.percDown(i);
    }
    return this;
  }
};
function leftChi(i) {
  return (i << 1) + 1;
}
function parent(i) {
  return (i + 1 >> 1) - 1;
}
function smaller(x, y) {
  if (x.priority !== y.priority) {
    return x.priority < y.priority;
  } else {
    return x.pushCount < y.pushCount;
  }
}
function priorityQueue(worker, concurrency) {
  var q = queue(worker, concurrency);
  var {
    push,
    pushAsync
  } = q;
  q._tasks = new Heap();
  q._createTaskItem = ({ data, priority }, callback) => {
    return {
      data,
      priority,
      callback
    };
  };
  function createDataItems(tasks, priority) {
    if (!Array.isArray(tasks)) {
      return { data: tasks, priority };
    }
    return tasks.map((data) => {
      return { data, priority };
    });
  }
  q.push = function(data, priority = 0, callback) {
    return push(createDataItems(data, priority), callback);
  };
  q.pushAsync = function(data, priority = 0, callback) {
    return pushAsync(createDataItems(data, priority), callback);
  };
  delete q.unshift;
  delete q.unshiftAsync;
  return q;
}
function race(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new TypeError("First argument to race must be an array of functions"));
  if (!tasks.length)
    return callback();
  for (var i = 0, l = tasks.length; i < l; i++) {
    wrapAsync(tasks[i])(callback);
  }
}
var race$1 = awaitify(race, 2);
function reduceRight(array, memo, iteratee, callback) {
  var reversed = [...array].reverse();
  return reduce$1(reversed, memo, iteratee, callback);
}
function reflect(fn) {
  var _fn = wrapAsync(fn);
  return initialParams(function reflectOn(args, reflectCallback) {
    args.push((error, ...cbArgs) => {
      let retVal = {};
      if (error) {
        retVal.error = error;
      }
      if (cbArgs.length > 0) {
        var value = cbArgs;
        if (cbArgs.length <= 1) {
          [value] = cbArgs;
        }
        retVal.value = value;
      }
      reflectCallback(null, retVal);
    });
    return _fn.apply(this, args);
  });
}
function reflectAll(tasks) {
  var results;
  if (Array.isArray(tasks)) {
    results = tasks.map(reflect);
  } else {
    results = {};
    Object.keys(tasks).forEach((key) => {
      results[key] = reflect.call(this, tasks[key]);
    });
  }
  return results;
}
function reject$2(eachfn, arr, _iteratee, callback) {
  const iteratee = wrapAsync(_iteratee);
  return _filter(eachfn, arr, (value, cb) => {
    iteratee(value, (err, v) => {
      cb(err, !v);
    });
  }, callback);
}
function reject(coll, iteratee, callback) {
  return reject$2(eachOf$1, coll, iteratee, callback);
}
var reject$1 = awaitify(reject, 3);
function rejectLimit(coll, limit, iteratee, callback) {
  return reject$2(eachOfLimit$2(limit), coll, iteratee, callback);
}
var rejectLimit$1 = awaitify(rejectLimit, 4);
function rejectSeries(coll, iteratee, callback) {
  return reject$2(eachOfSeries$1, coll, iteratee, callback);
}
var rejectSeries$1 = awaitify(rejectSeries, 3);
function constant(value) {
  return function() {
    return value;
  };
}
var DEFAULT_TIMES = 5;
var DEFAULT_INTERVAL = 0;
function retry(opts, task, callback) {
  var options = {
    times: DEFAULT_TIMES,
    intervalFunc: constant(DEFAULT_INTERVAL)
  };
  if (arguments.length < 3 && typeof opts === "function") {
    callback = task || promiseCallback();
    task = opts;
  } else {
    parseTimes(options, opts);
    callback = callback || promiseCallback();
  }
  if (typeof task !== "function") {
    throw new Error("Invalid arguments for async.retry");
  }
  var _task = wrapAsync(task);
  var attempt = 1;
  function retryAttempt() {
    _task((err, ...args) => {
      if (err === false)
        return;
      if (err && attempt++ < options.times && (typeof options.errorFilter != "function" || options.errorFilter(err))) {
        setTimeout(retryAttempt, options.intervalFunc(attempt - 1));
      } else {
        callback(err, ...args);
      }
    });
  }
  retryAttempt();
  return callback[PROMISE_SYMBOL];
}
function parseTimes(acc, t) {
  if (typeof t === "object") {
    acc.times = +t.times || DEFAULT_TIMES;
    acc.intervalFunc = typeof t.interval === "function" ? t.interval : constant(+t.interval || DEFAULT_INTERVAL);
    acc.errorFilter = t.errorFilter;
  } else if (typeof t === "number" || typeof t === "string") {
    acc.times = +t || DEFAULT_TIMES;
  } else {
    throw new Error("Invalid arguments for async.retry");
  }
}
function retryable(opts, task) {
  if (!task) {
    task = opts;
    opts = null;
  }
  let arity = opts && opts.arity || task.length;
  if (isAsync(task)) {
    arity += 1;
  }
  var _task = wrapAsync(task);
  return initialParams((args, callback) => {
    if (args.length < arity - 1 || callback == null) {
      args.push(callback);
      callback = promiseCallback();
    }
    function taskFn(cb) {
      _task(...args, cb);
    }
    if (opts)
      retry(opts, taskFn, callback);
    else
      retry(taskFn, callback);
    return callback[PROMISE_SYMBOL];
  });
}
function series(tasks, callback) {
  return _parallel(eachOfSeries$1, tasks, callback);
}
function some(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOf$1, coll, iteratee, callback);
}
var some$1 = awaitify(some, 3);
function someLimit(coll, limit, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfLimit$2(limit), coll, iteratee, callback);
}
var someLimit$1 = awaitify(someLimit, 4);
function someSeries(coll, iteratee, callback) {
  return _createTester(Boolean, (res) => res)(eachOfSeries$1, coll, iteratee, callback);
}
var someSeries$1 = awaitify(someSeries, 3);
function sortBy(coll, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return map$1(coll, (x, iterCb) => {
    _iteratee(x, (err, criteria) => {
      if (err)
        return iterCb(err);
      iterCb(err, { value: x, criteria });
    });
  }, (err, results) => {
    if (err)
      return callback(err);
    callback(null, results.sort(comparator).map((v) => v.value));
  });
  function comparator(left, right) {
    var a = left.criteria, b = right.criteria;
    return a < b ? -1 : a > b ? 1 : 0;
  }
}
var sortBy$1 = awaitify(sortBy, 3);
function timeout(asyncFn, milliseconds, info) {
  var fn = wrapAsync(asyncFn);
  return initialParams((args, callback) => {
    var timedOut = false;
    var timer;
    function timeoutCallback() {
      var name = asyncFn.name || "anonymous";
      var error = new Error('Callback function "' + name + '" timed out.');
      error.code = "ETIMEDOUT";
      if (info) {
        error.info = info;
      }
      timedOut = true;
      callback(error);
    }
    args.push((...cbArgs) => {
      if (!timedOut) {
        callback(...cbArgs);
        clearTimeout(timer);
      }
    });
    timer = setTimeout(timeoutCallback, milliseconds);
    fn(...args);
  });
}
function range(size) {
  var result = Array(size);
  while (size--) {
    result[size] = size;
  }
  return result;
}
function timesLimit(count, limit, iteratee, callback) {
  var _iteratee = wrapAsync(iteratee);
  return mapLimit$1(range(count), limit, _iteratee, callback);
}
function times(n, iteratee, callback) {
  return timesLimit(n, Infinity, iteratee, callback);
}
function timesSeries(n, iteratee, callback) {
  return timesLimit(n, 1, iteratee, callback);
}
function transform(coll, accumulator, iteratee, callback) {
  if (arguments.length <= 3 && typeof accumulator === "function") {
    callback = iteratee;
    iteratee = accumulator;
    accumulator = Array.isArray(coll) ? [] : {};
  }
  callback = once(callback || promiseCallback());
  var _iteratee = wrapAsync(iteratee);
  eachOf$1(coll, (v, k, cb) => {
    _iteratee(accumulator, v, k, cb);
  }, (err) => callback(err, accumulator));
  return callback[PROMISE_SYMBOL];
}
function tryEach(tasks, callback) {
  var error = null;
  var result;
  return eachSeries$1(tasks, (task, taskCb) => {
    wrapAsync(task)((err, ...args) => {
      if (err === false)
        return taskCb(err);
      if (args.length < 2) {
        [result] = args;
      } else {
        result = args;
      }
      error = err;
      taskCb(err ? null : {});
    });
  }, () => callback(error, result));
}
var tryEach$1 = awaitify(tryEach);
function unmemoize(fn) {
  return (...args) => {
    return (fn.unmemoized || fn)(...args);
  };
}
function whilst(test, iteratee, callback) {
  callback = onlyOnce(callback);
  var _fn = wrapAsync(iteratee);
  var _test = wrapAsync(test);
  var results = [];
  function next(err, ...rest) {
    if (err)
      return callback(err);
    results = rest;
    if (err === false)
      return;
    _test(check);
  }
  function check(err, truth) {
    if (err)
      return callback(err);
    if (err === false)
      return;
    if (!truth)
      return callback(null, ...results);
    _fn(next);
  }
  return _test(check);
}
var whilst$1 = awaitify(whilst, 3);
function until(test, iteratee, callback) {
  const _test = wrapAsync(test);
  return whilst$1((cb) => _test((err, truth) => cb(err, !truth)), iteratee, callback);
}
function waterfall(tasks, callback) {
  callback = once(callback);
  if (!Array.isArray(tasks))
    return callback(new Error("First argument to waterfall must be an array of functions"));
  if (!tasks.length)
    return callback();
  var taskIndex = 0;
  function nextTask(args) {
    var task = wrapAsync(tasks[taskIndex++]);
    task(...args, onlyOnce(next));
  }
  function next(err, ...args) {
    if (err === false)
      return;
    if (err || taskIndex === tasks.length) {
      return callback(err, ...args);
    }
    nextTask(args);
  }
  nextTask([]);
}
var waterfall$1 = awaitify(waterfall);
var index = {
  apply,
  applyEach,
  applyEachSeries,
  asyncify,
  auto,
  autoInject,
  cargo: cargo$1,
  cargoQueue: cargo,
  compose,
  concat: concat$1,
  concatLimit: concatLimit$1,
  concatSeries: concatSeries$1,
  constant: constant$1,
  detect: detect$1,
  detectLimit: detectLimit$1,
  detectSeries: detectSeries$1,
  dir,
  doUntil,
  doWhilst: doWhilst$1,
  each,
  eachLimit: eachLimit$1,
  eachOf: eachOf$1,
  eachOfLimit: eachOfLimit$1,
  eachOfSeries: eachOfSeries$1,
  eachSeries: eachSeries$1,
  ensureAsync,
  every: every$1,
  everyLimit: everyLimit$1,
  everySeries: everySeries$1,
  filter: filter$1,
  filterLimit: filterLimit$1,
  filterSeries: filterSeries$1,
  forever: forever$1,
  groupBy,
  groupByLimit: groupByLimit$1,
  groupBySeries,
  log,
  map: map$1,
  mapLimit: mapLimit$1,
  mapSeries: mapSeries$1,
  mapValues,
  mapValuesLimit: mapValuesLimit$1,
  mapValuesSeries,
  memoize,
  nextTick,
  parallel,
  parallelLimit,
  priorityQueue,
  queue,
  race: race$1,
  reduce: reduce$1,
  reduceRight,
  reflect,
  reflectAll,
  reject: reject$1,
  rejectLimit: rejectLimit$1,
  rejectSeries: rejectSeries$1,
  retry,
  retryable,
  seq,
  series,
  setImmediate: setImmediate$1,
  some: some$1,
  someLimit: someLimit$1,
  someSeries: someSeries$1,
  sortBy: sortBy$1,
  timeout,
  times,
  timesLimit,
  timesSeries,
  transform,
  tryEach: tryEach$1,
  unmemoize,
  until,
  waterfall: waterfall$1,
  whilst: whilst$1,
  // aliases
  all: every$1,
  allLimit: everyLimit$1,
  allSeries: everySeries$1,
  any: some$1,
  anyLimit: someLimit$1,
  anySeries: someSeries$1,
  find: detect$1,
  findLimit: detectLimit$1,
  findSeries: detectSeries$1,
  flatMap: concat$1,
  flatMapLimit: concatLimit$1,
  flatMapSeries: concatSeries$1,
  forEach: each,
  forEachSeries: eachSeries$1,
  forEachLimit: eachLimit$1,
  forEachOf: eachOf$1,
  forEachOfSeries: eachOfSeries$1,
  forEachOfLimit: eachOfLimit$1,
  inject: reduce$1,
  foldl: reduce$1,
  foldr: reduceRight,
  select: filter$1,
  selectLimit: filterLimit$1,
  selectSeries: filterSeries$1,
  wrapSync: asyncify,
  during: whilst$1,
  doDuring: doWhilst$1
};
var metaSpin9 = crypto.randomUUID().toString();
async function ListVideoLowest({
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            let metaName = "";
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = lowEntry(metaBody.VideoTube);
            const ytc = fluentffmpeg__default.default();
            ytc.input(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin9);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin9));
            ytc.on("close", () => progressBar_default(100, metaSpin9));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin9));
            switch (filter2) {
              case "grayscale":
                ytc.videoFilters(
                  "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
                );
                metaName = `yt-core_(VideoLowest-grayscale)_${title}.${outputFormat}`;
                break;
              case "invert":
                ytc.videoFilters("negate");
                metaName = `yt-core_(VideoLowest-invert)_${title}.${outputFormat}`;
                break;
              case "rotate90":
                ytc.videoFilters("rotate=PI/2");
                metaName = `yt-core_(VideoLowest-rotate90)_${title}.${outputFormat}`;
                break;
              case "rotate180":
                ytc.videoFilters("rotate=PI");
                metaName = `yt-core_(VideoLowest-rotate180)_${title}.${outputFormat}`;
                break;
              case "rotate270":
                ytc.videoFilters("rotate=3*PI/2");
                metaName = `yt-core_(VideoLowest-rotate270)_${title}.${outputFormat}`;
                break;
              case "flipHorizontal":
                ytc.videoFilters("hflip");
                metaName = `yt-core_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
                break;
              case "flipVertical":
                ytc.videoFilters("vflip");
                metaName = `yt-core_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
                break;
              default:
                metaName = `yt-core_(VideoLowest)_${title}.${outputFormat}`;
            }
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin10 = crypto.randomUUID().toString();
async function ListVideoHighest({
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            let metaName = "";
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = bigEntry(metaBody.VideoTube);
            const ytc = fluentffmpeg__default.default();
            ytc.input(metaEntry.meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin10);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin10));
            ytc.on("close", () => progressBar_default(100, metaSpin10));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin10));
            switch (filter2) {
              case "grayscale":
                ytc.videoFilters(
                  "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
                );
                metaName = `yt-core_(VideoHighest-grayscale)_${title}.${outputFormat}`;
                break;
              case "invert":
                ytc.videoFilters("negate");
                metaName = `yt-core_(VideoHighest-invert)_${title}.${outputFormat}`;
                break;
              case "rotate90":
                ytc.videoFilters("rotate=PI/2");
                metaName = `yt-core_(VideoHighest-rotate90)_${title}.${outputFormat}`;
                break;
              case "rotate180":
                ytc.videoFilters("rotate=PI");
                metaName = `yt-core_(VideoHighest-rotate180)_${title}.${outputFormat}`;
                break;
              case "rotate270":
                ytc.videoFilters("rotate=3*PI/2");
                metaName = `yt-core_(VideoHighest-rotate270)_${title}.${outputFormat}`;
                break;
              case "flipHorizontal":
                ytc.videoFilters("hflip");
                metaName = `yt-core_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
                break;
              case "flipVertical":
                ytc.videoFilters("vflip");
                metaName = `yt-core_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
                break;
              default:
                metaName = `yt-core_(VideoHighest)_${title}.${outputFormat}`;
            }
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin11 = crypto.randomUUID().toString();
async function ListVideoQualityCustom({
  filter: filter2,
  stream: stream$1,
  quality,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            let metaBody;
            metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              results.push({
                message: "Unable to get response from YouTube...",
                status: 500
              });
            } else {
              metaBody = metaBody.VideoTube.filter(
                (op) => op.meta_dl.formatnote === quality
              );
              if (!metaBody) {
                results.push({
                  message: "Unable to get response from YouTube...",
                  status: 500
                });
              } else {
                let metaName = "";
                const title = metaBody.metaTube.title.replace(
                  /[^a-zA-Z0-9_]+/g,
                  "-"
                );
                const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
                if (!fs__namespace.existsSync(metaFold))
                  fs__namespace.mkdirSync(metaFold, { recursive: true });
                const metaEntry = bigEntry(metaBody.VideoTube);
                const ytc = fluentffmpeg__default.default();
                ytc.input(metaEntry.meta_dl.mediaurl);
                ytc.format(outputFormat);
                ytc.on("start", (cmd) => {
                  if (verbose)
                    console.log(cmd);
                  progressBar_default(0, metaSpin11);
                });
                ytc.on("end", () => progressBar_default(100, metaSpin11));
                ytc.on("close", () => progressBar_default(100, metaSpin11));
                ytc.on(
                  "progress",
                  ({ percent }) => progressBar_default(percent, metaSpin11)
                );
                switch (filter2) {
                  case "grayscale":
                    ytc.withVideoFilter([
                      "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
                    ]);
                    metaName = `yt-core_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
                    break;
                  case "invert":
                    ytc.withVideoFilter(["negate"]);
                    metaName = `yt-core_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
                    break;
                  case "rotate90":
                    ytc.withVideoFilter(["rotate=PI/2"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
                    break;
                  case "rotate180":
                    ytc.withVideoFilter(["rotate=PI"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
                    break;
                  case "rotate270":
                    ytc.withVideoFilter(["rotate=3*PI/2"]);
                    metaName = `yt-core_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
                    break;
                  case "flipHorizontal":
                    ytc.withVideoFilter(["hflip"]);
                    metaName = `yt-core_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
                    break;
                  case "flipVertical":
                    ytc.withVideoFilter(["vflip"]);
                    metaName = `yt-core_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
                    break;
                  default:
                    ytc.withVideoFilter([]);
                    metaName = `yt-core_(VideoQualityCustom)_${title}.${outputFormat}`;
                }
                if (stream$1) {
                  const readStream = new stream.Readable({
                    read() {
                    }
                  });
                  const writeStream = new stream.Writable({
                    write(chunk, _encoding, callback) {
                      readStream.push(chunk);
                      callback();
                    },
                    final(callback) {
                      readStream.push(null);
                      callback();
                    }
                  });
                  ytc.pipe(writeStream, { end: true });
                  results.push({
                    stream: readStream,
                    filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
                  });
                } else {
                  await new Promise((resolve, reject2) => {
                    ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
                  });
                }
              }
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin12 = crypto.randomUUID().toString();
async function ListAudioLowest({
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp3"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            let metaName = "";
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = lowEntry(metaBody.AudioTube);
            const ytc = fluentffmpeg__default.default();
            ytc.input(metaEntry.meta_dl.mediaurl);
            ytc.input(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin12);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin12));
            ytc.on("close", () => progressBar_default(100, metaSpin12));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin12));
            switch (filter2) {
              case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-core-(AudioLowest_bassboost)-${title}.${outputFormat}`;
                break;
              case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-core-(AudioLowest_echo)-${title}.${outputFormat}`;
                break;
              case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-core-(AudioLowest_flanger)-${title}.${outputFormat}`;
                break;
              case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-core-(AudioLowest_nightcore)-${title}.${outputFormat}`;
                break;
              case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-core-(AudioLowest_panning)-${title}.${outputFormat}`;
                break;
              case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-core-(AudioLowest_phaser)-${title}.${outputFormat}`;
                break;
              case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-core-(AudioLowest_reverse)-${title}.${outputFormat}`;
                break;
              case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-core-(AudioLowest_slow)-${title}.${outputFormat}`;
                break;
              case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-core-(AudioLowest_speed)-${title}.${outputFormat}`;
                break;
              case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-core-(AudioLowest_subboost)-${title}.${outputFormat}`;
                break;
              case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-core-(AudioLowest_superslow)-${title}.${outputFormat}`;
                break;
              case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-core-(AudioLowest_superspeed)-${title}.${outputFormat}`;
                break;
              case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-core-(AudioLowest_surround)-${title}.${outputFormat}`;
                break;
              case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-core-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
                break;
              case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-core-(AudioLowest_vibrato)-${title}.${outputFormat}`;
                break;
              default:
                ytc.withAudioFilter([]);
                metaName = `yt-core-(AudioLowest)-${title}.${outputFormat}`;
                break;
            }
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin13 = crypto.randomUUID().toString();
async function ListAudioHighest({
  filter: filter2,
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp3"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            let metaName = "";
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const metaEntry = bigEntry(metaBody.AudioTube);
            const ytc = fluentffmpeg__default.default();
            ytc.input(metaEntry.meta_dl.mediaurl);
            ytc.input(metaBody.metaTube.thumbnail);
            ytc.addOutputOption("-map", "1:0");
            ytc.addOutputOption("-map", "0:a:0");
            ytc.addOutputOption("-id3v2_version", "3");
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin13);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin13));
            ytc.on("close", () => progressBar_default(100, metaSpin13));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin13));
            switch (filter2) {
              case "bassboost":
                ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                metaName = `yt-core-(AudioHighest_bassboost)-${title}.${outputFormat}`;
                break;
              case "echo":
                ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                metaName = `yt-core-(AudioHighest_echo)-${title}.${outputFormat}`;
                break;
              case "flanger":
                ytc.withAudioFilter(["flanger"]);
                metaName = `yt-core-(AudioHighest_flanger)-${title}.${outputFormat}`;
                break;
              case "nightcore":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
                metaName = `yt-core-(AudioHighest_nightcore)-${title}.${outputFormat}`;
                break;
              case "panning":
                ytc.withAudioFilter(["apulsator=hz=0.08"]);
                metaName = `yt-core-(AudioHighest_panning)-${title}.${outputFormat}`;
                break;
              case "phaser":
                ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                metaName = `yt-core-(AudioHighest_phaser)-${title}.${outputFormat}`;
                break;
              case "reverse":
                ytc.withAudioFilter(["areverse"]);
                metaName = `yt-core-(AudioHighest_reverse)-${title}.${outputFormat}`;
                break;
              case "slow":
                ytc.withAudioFilter(["atempo=0.8"]);
                metaName = `yt-core-(AudioHighest_slow)-${title}.${outputFormat}`;
                break;
              case "speed":
                ytc.withAudioFilter(["atempo=2"]);
                metaName = `yt-core-(AudioHighest_speed)-${title}.${outputFormat}`;
                break;
              case "subboost":
                ytc.withAudioFilter(["asubboost"]);
                metaName = `yt-core-(AudioHighest_subboost)-${title}.${outputFormat}`;
                break;
              case "superslow":
                ytc.withAudioFilter(["atempo=0.5"]);
                metaName = `yt-core-(AudioHighest_superslow)-${title}.${outputFormat}`;
                break;
              case "superspeed":
                ytc.withAudioFilter(["atempo=3"]);
                metaName = `yt-core-(AudioHighest_superspeed)-${title}.${outputFormat}`;
                break;
              case "surround":
                ytc.withAudioFilter(["surround"]);
                metaName = `yt-core-(AudioHighest_surround)-${title}.${outputFormat}`;
                break;
              case "vaporwave":
                ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                metaName = `yt-core-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
                break;
              case "vibrato":
                ytc.withAudioFilter(["vibrato=f=6.5"]);
                metaName = `yt-core-(AudioHighest_vibrato)-${title}.${outputFormat}`;
                break;
              default:
                ytc.withAudioFilter([]);
                metaName = `yt-core-(AudioHighest)-${title}.${outputFormat}`;
                break;
            }
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin14 = crypto.randomUUID().toString();
async function ListAudioQualityCustom({
  filter: filter2,
  stream: stream$1,
  quality,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp3"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            let metaBody;
            metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              results.push({
                message: "Unable to get response from YouTube...",
                status: 500
              });
            } else {
              metaBody = metaBody.AudioTube.filter(
                (op) => op.meta_dl.formatnote === quality
              );
              if (!metaBody) {
                results.push({
                  message: "Unable to get response from YouTube...",
                  status: 500
                });
              } else {
                let metaName = "";
                const title = metaBody.metaTube.title.replace(
                  /[^a-zA-Z0-9_]+/g,
                  "-"
                );
                const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
                if (!fs__namespace.existsSync(metaFold))
                  fs__namespace.mkdirSync(metaFold, { recursive: true });
                const metaEntry = bigEntry(metaBody.AudioTube);
                const ytc = fluentffmpeg__default.default();
                ytc.input(metaEntry.meta_dl.mediaurl);
                ytc.input(metaBody.metaTube.thumbnail);
                ytc.addOutputOption("-map", "1:0");
                ytc.addOutputOption("-map", "0:a:0");
                ytc.addOutputOption("-id3v2_version", "3");
                ytc.format(outputFormat);
                ytc.on("start", (cmd) => {
                  if (verbose)
                    console.log(cmd);
                  progressBar_default(0, metaSpin14);
                });
                ytc.on("end", () => progressBar_default(100, metaSpin14));
                ytc.on("close", () => progressBar_default(100, metaSpin14));
                ytc.on(
                  "progress",
                  ({ percent }) => progressBar_default(percent, metaSpin14)
                );
                switch (filter2) {
                  case "bassboost":
                    ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
                    metaName = `yt-core-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
                    break;
                  case "echo":
                    ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
                    metaName = `yt-core-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
                    break;
                  case "flanger":
                    ytc.withAudioFilter(["flanger"]);
                    metaName = `yt-core-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
                    break;
                  case "nightcore":
                    ytc.withAudioFilter([
                      "aresample=48000,asetrate=48000*1.25"
                    ]);
                    metaName = `yt-core-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
                    break;
                  case "panning":
                    ytc.withAudioFilter(["apulsator=hz=0.08"]);
                    metaName = `yt-core-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
                    break;
                  case "phaser":
                    ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
                    metaName = `yt-core-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
                    break;
                  case "reverse":
                    ytc.withAudioFilter(["areverse"]);
                    metaName = `yt-core-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
                    break;
                  case "slow":
                    ytc.withAudioFilter(["atempo=0.8"]);
                    metaName = `yt-core-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
                    break;
                  case "speed":
                    ytc.withAudioFilter(["atempo=2"]);
                    metaName = `yt-core-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
                    break;
                  case "subboost":
                    ytc.withAudioFilter(["asubboost"]);
                    metaName = `yt-core-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
                    break;
                  case "superslow":
                    ytc.withAudioFilter(["atempo=0.5"]);
                    metaName = `yt-core-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
                    break;
                  case "superspeed":
                    ytc.withAudioFilter(["atempo=3"]);
                    metaName = `yt-core-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
                    break;
                  case "surround":
                    ytc.withAudioFilter(["surround"]);
                    metaName = `yt-core-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
                    break;
                  case "vaporwave":
                    ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
                    metaName = `yt-core-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
                    break;
                  case "vibrato":
                    ytc.withAudioFilter(["vibrato=f=6.5"]);
                    metaName = `yt-core-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
                    break;
                  default:
                    ytc.withAudioFilter([]);
                    metaName = `yt-core-(AudioQualityCustom)-${title}.${outputFormat}`;
                    break;
                }
                if (stream$1) {
                  const readStream = new stream.Readable({
                    read() {
                    }
                  });
                  const writeStream = new stream.Writable({
                    write(chunk, _encoding, callback) {
                      readStream.push(chunk);
                      callback();
                    },
                    final(callback) {
                      readStream.push(null);
                      callback();
                    }
                  });
                  ytc.pipe(writeStream, { end: true });
                  results.push({
                    stream: readStream,
                    filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
                  });
                } else {
                  await new Promise((resolve, reject2) => {
                    ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
                  });
                }
              }
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin15 = crypto.randomUUID().toString();
async function ListAudioVideoLowest({
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            let metaName = `yt-core_(AudioVideoLowest)_${title}.${outputFormat}`;
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const ytc = fluentffmpeg__default.default();
            ytc.addInput(lowEntry(metaBody.VideoTube).meta_dl.mediaurl);
            ytc.addInput(lowEntry(metaBody.AudioTube).meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin15);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin15));
            ytc.on("close", () => progressBar_default(100, metaSpin15));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin15));
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}
var metaSpin16 = crypto.randomUUID().toString();
async function ListAudioVideoHighest({
  stream: stream$1,
  verbose,
  folderName,
  playlistUrls,
  outputFormat = "mp4"
}) {
  try {
    if (!Array.isArray(playlistUrls) || !playlistUrls.every((url) => typeof url === "string")) {
      return [
        {
          message: "Invalid playlistUrls[] parameter. Expecting an array of strings.",
          status: 500
        }
      ];
    }
    const videos = await get_playlist({
      playlistUrls
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500
        }
      ];
    } else {
      const results = [];
      await index.eachSeries(
        videos,
        async (video) => {
          try {
            const metaBody = await Engine({ query: video.url });
            if (!metaBody) {
              throw new Error("Unable to get response from YouTube...");
            }
            const title = metaBody.metaTube.title.replace(
              /[^a-zA-Z0-9_]+/g,
              "-"
            );
            let metaName = `yt-core_(AudioVideoHighest)_${title}.${outputFormat}`;
            const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
            if (!fs__namespace.existsSync(metaFold))
              fs__namespace.mkdirSync(metaFold, { recursive: true });
            const ytc = fluentffmpeg__default.default();
            ytc.addInput(bigEntry(metaBody.VideoTube).meta_dl.mediaurl);
            ytc.addInput(bigEntry(metaBody.AudioTube).meta_dl.mediaurl);
            ytc.format(outputFormat);
            ytc.on("start", (cmd) => {
              if (verbose)
                console.log(cmd);
              progressBar_default(0, metaSpin16);
            });
            ytc.on("end", () => progressBar_default(100, metaSpin16));
            ytc.on("close", () => progressBar_default(100, metaSpin16));
            ytc.on("progress", ({ percent }) => progressBar_default(percent, metaSpin16));
            if (stream$1) {
              const readStream = new stream.Readable({
                read() {
                }
              });
              const writeStream = new stream.Writable({
                write(chunk, _encoding, callback) {
                  readStream.push(chunk);
                  callback();
                },
                final(callback) {
                  readStream.push(null);
                  callback();
                }
              });
              ytc.pipe(writeStream, { end: true });
              results.push({
                stream: readStream,
                filename: folderName ? path__namespace.join(metaFold, metaName) : metaName
              });
            } else {
              await new Promise((resolve, reject2) => {
                ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
              });
            }
          } catch (error) {
            results.push({
              status: 500,
              message: colors14__default.default.bold.red("ERROR: ") + video.title
            });
          }
        }
      );
      return results;
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return [
          {
            message: error.message,
            status: 500
          }
        ];
      default:
        return [
          {
            message: "Internal server error",
            status: 500
          }
        ];
    }
  }
}

// core/index.ts
var ytCore2 = {
  info: {
    help,
    extract,
    search,
    list_formats,
    get_playlist,
    get_video_data,
    extract_playlist_videos
  },
  audio: {
    single: {
      lowest: AudioLowest,
      highest: AudioHighest,
      custom: AudioQualityCustom
    },
    playlist: {
      lowest: ListAudioLowest,
      highest: ListAudioHighest,
      custom: ListAudioQualityCustom
    }
  },
  video: {
    single: {
      lowest: VideoLowest,
      highest: VideoHighest,
      custom: VideoQualityCustom
    },
    playlist: {
      lowest: ListVideoLowest,
      highest: ListVideoHighest,
      custom: ListVideoQualityCustom
    }
  },
  audio_video: {
    single: {
      lowest: AudioVideoLowest,
      highest: AudioVideoHighest
    },
    playlist: { lowest: ListAudioVideoLowest, highest: ListAudioVideoHighest }
  }
};
var core_default = ytCore2;
var proTube = minimist__default.default(process.argv.slice(2), {
  string: ["query", "format"],
  alias: {
    h: "help",
    e: "extract",
    v: "version",
    s: "search-yt",
    f: "list-formats",
    vl: "video-lowest",
    al: "audio-lowest",
    vh: "video_highest",
    ah: "audio-highest",
    vi: "get-video-data",
    avl: "audio-video-lowest",
    avh: "audio-video-highest",
    aqc: "audio-quality-custom",
    vqc: "video-quality-custom"
  }
});
var program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "version":
    case "v":
      console.error(colors14__default.default.green("Installed Version: yt-core@" + version));
      break;
    case "help":
    case "h":
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors14__default.default.red(error));
        process.exit();
      });
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.info.extract({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "search-yt":
    case "s":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.info.search({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "list-formats":
    case "f":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.info.list_formats({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "get-video-data":
    case "vi":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.info.get_video_data({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.audio.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.audio.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.audio_video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      } else
        core_default.audio_video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors14__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors14__default.default.red("error: no format"));
      }
      core_default.audio.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors14__default.default.red(error));
        process.exit();
      });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors14__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors14__default.default.red("error: no format"));
      }
      core_default.video.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors14__default.default.red(error));
        process.exit();
      });
      break;
    default:
      core_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors14__default.default.red(error));
        process.exit();
      });
      break;
  }
};
if (!proTube._[0]) {
  core_default.info.help().then((data) => {
    console.log(data);
    process.exit();
  }).catch((error) => {
    console.error(colors14__default.default.red(error));
    process.exit();
  });
} else
  program();
