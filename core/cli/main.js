#!/usr/bin/env node
'use strict';

var colors17 = require('colors');
var playwright = require('playwright');
var YouTubeID = require('@shovit/ytid');
var z3 = require('zod');
var fs = require('fs');
var path = require('path');
var fluentffmpeg = require('fluent-ffmpeg');
var axios = require('axios');
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

var colors17__default = /*#__PURE__*/_interopDefault(colors17);
var YouTubeID__default = /*#__PURE__*/_interopDefault(YouTubeID);
var z3__namespace = /*#__PURE__*/_interopNamespace(z3);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var fluentffmpeg__default = /*#__PURE__*/_interopDefault(fluentffmpeg);
var axios__default = /*#__PURE__*/_interopDefault(axios);
var readline__default = /*#__PURE__*/_interopDefault(readline);
var minimist__default = /*#__PURE__*/_interopDefault(minimist);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a2, b) => (typeof require !== "undefined" ? require : a2)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
  }
});

// node_modules/yt-search/dist/yt-search.js
var require_yt_search = __commonJS({
  "node_modules/yt-search/dist/yt-search.js"(exports, module) {
    init_cjs_shims();
    (function(f) {
      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
      } else if (typeof define === "function" && define.amd) {
        define([], f);
      } else {
        var g;
        if (typeof window !== "undefined") {
          g = window;
        } else if (typeof global !== "undefined") {
          g = global;
        } else if (typeof self !== "undefined") {
          g = self;
        } else {
          g = this;
        }
        g.ytSearch = f();
      }
    })(function() {
      return (/* @__PURE__ */ function() {
        function r(e, n, t) {
          function o(i2, f) {
            if (!n[i2]) {
              if (!e[i2]) {
                var c = "function" == typeof __require && __require;
                if (!f && c)
                  return c(i2, true);
                if (u)
                  return u(i2, true);
                var a2 = new Error("Cannot find module '" + i2 + "'");
                throw a2.code = "MODULE_NOT_FOUND", a2;
              }
              var p = n[i2] = { exports: {} };
              e[i2][0].call(p.exports, function(r2) {
                var n2 = e[i2][1][r2];
                return o(n2 || r2);
              }, p, p.exports, r, e, n, t);
            }
            return n[i2].exports;
          }
          for (var u = "function" == typeof __require && __require, i = 0; i < t.length; i++)
            o(t[i]);
          return o;
        }
        return r;
      }())({ 1: [function(require2, module3, exports3) {
        function _typeof(obj) {
          "@babel/helpers - typeof";
          return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
            return typeof obj2;
          } : function(obj2) {
            return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          }, _typeof(obj);
        }
        var _cheerio = require2("cheerio");
        var _dasu = require2("dasu");
        require2("async.parallellimit");
        _dasu.follow = true;
        _dasu.debug = false;
        var _require = require2("./util.js"), _getScripts = _require._getScripts, _findLine = _require._findLine, _between = _require._between;
        var MAX_RETRY_ATTEMPTS = 3;
        var RETRY_INTERVAL = 333;
        var jpp = require2("jsonpath-plus").JSONPath;
        var _jp = {};
        _jp.query = function(json, path17) {
          var opts = {
            path: path17,
            json,
            resultType: "value"
          };
          return jpp(opts);
        };
        _jp.value = function(json, path17) {
          var opts = {
            path: path17,
            json,
            resultType: "value"
          };
          var r = jpp(opts)[0];
          return r;
        };
        var DEFAULT_USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (yt-search; https://www.npmjs.com/package/yt-search)";
        var _userAgent = DEFAULT_USER_AGENT;
        var _url = require2("url");
        var _envs = {};
        Object.keys(process.env).forEach(function(key) {
          var n = process.env[key];
          if (n == "0" || n == "false" || !n) {
            return _envs[key] = false;
          }
          _envs[key] = n;
        });
        var _debugging = _envs.debug;
        function debug() {
          if (!_debugging)
            return;
          console.log.apply(this, arguments);
        }
        var _querystring = require2("querystring");
        var _humanTime = require2("human-time");
        var TEMPLATES = {
          YT: "https://youtube.com",
          SEARCH_MOBILE: "https://m.youtube.com/results",
          SEARCH_DESKTOP: "https://www.youtube.com/results"
        };
        module3.exports = function(query, callback) {
          return search3(query, callback);
        };
        module3.exports.search = search3;
        module3.exports._parseSearchResultInitialData = _parseSearchResultInitialData;
        module3.exports._parseVideoInitialData = _parseVideoInitialData;
        module3.exports._parsePlaylistInitialData = _parsePlaylistInitialData;
        module3.exports._videoFilter = _videoFilter;
        module3.exports._playlistFilter = _playlistFilter;
        module3.exports._channelFilter = _channelFilter;
        module3.exports._liveFilter = _liveFilter;
        module3.exports._allFilter = _allFilter;
        module3.exports._parsePlaylistLastUpdateTime = _parsePlaylistLastUpdateTime;
        function search3(query, callback) {
          if (!callback) {
            return new Promise(function(resolve, reject2) {
              search3(query, function(err, data) {
                if (err)
                  return reject2(err);
                resolve(data);
              });
            });
          }
          var _options;
          if (typeof query === "string") {
            _options = {
              query
            };
          } else {
            _options = query;
          }
          _options._attempts = (_options._attempts || 0) + 1;
          var retryOptions = Object.assign({}, _options);
          function callback_with_retry(err, data) {
            if (err) {
              if (_options._attempts > MAX_RETRY_ATTEMPTS) {
                return callback(err, data);
              } else {
                debug(" === ");
                debug(" RETRYING: " + _options._attempts);
                debug(" === ");
                var n = _options._attempts;
                var wait_ms = Math.pow(2, n - 1) * RETRY_INTERVAL;
                setTimeout(function() {
                  search3(retryOptions, callback);
                }, wait_ms);
              }
            } else {
              return callback(err, data);
            }
          }
          if (_options.userAgent)
            _userAgent = _options.userAgent;
          _options.search = _options.query || _options.search;
          _options.original_search = _options.search;
          if (_options.videoId) {
            return getVideoMetaData(_options, callback_with_retry);
          }
          if (_options.listId) {
            return getPlaylistMetaData(_options, callback_with_retry);
          }
          if (!_options.search) {
            return callback(Error("yt-search: no query given"));
          }
          work();
          function work() {
            getSearchResults(_options, callback_with_retry);
          }
        }
        function _videoFilter(video, index2, videos) {
          if (video.type !== "video")
            return false;
          var videoId = video.videoId;
          var firstIndex = videos.findIndex(function(el) {
            return videoId === el.videoId;
          });
          return firstIndex === index2;
        }
        function _playlistFilter(result, index2, results) {
          if (result.type !== "list")
            return false;
          var id = result.listId;
          var firstIndex = results.findIndex(function(el) {
            return id === el.listId;
          });
          return firstIndex === index2;
        }
        function _channelFilter(result, index2, results) {
          if (result.type !== "channel")
            return false;
          var url = result.url;
          var firstIndex = results.findIndex(function(el) {
            return url === el.url;
          });
          return firstIndex === index2;
        }
        function _liveFilter(result, index2, results) {
          if (result.type !== "live")
            return false;
          var videoId = result.videoId;
          var firstIndex = results.findIndex(function(el) {
            return videoId === el.videoId;
          });
          return firstIndex === index2;
        }
        function _allFilter(result, index2, results) {
          switch (result.type) {
            case "video":
            case "list":
            case "channel":
            case "live":
              break;
            default:
              return false;
          }
          var url = result.url;
          var firstIndex = results.findIndex(function(el) {
            return url === el.url;
          });
          return firstIndex === index2;
        }
        function getSearchResults(_options, callback) {
          var q = _querystring.escape(_options.search).split(/\s+/);
          var hl = _options.hl || "en";
          var gl = _options.gl || "US";
          var category = _options.category || "";
          var pageStart = Number(_options.pageStart) || 1;
          var pageEnd = Number(_options.pageEnd) || Number(_options.pages) || 1;
          if (pageStart <= 0) {
            pageStart = 1;
            if (pageEnd >= 1) {
              pageEnd += 1;
            }
          }
          if (Number.isNaN(pageEnd)) {
            callback("error: pageEnd must be a number");
          }
          _options.pageStart = pageStart;
          _options.pageEnd = pageEnd;
          _options.currentPage = _options.currentPage || pageStart;
          var queryString = "?";
          queryString += "search_query=" + q.join("+");
          if (queryString.indexOf("&hl=") === -1) {
            queryString += "&hl=" + hl;
          }
          if (queryString.indexOf("&gl=") === -1) {
            queryString += "&gl=" + gl;
          }
          if (category) {
            queryString += "&category=" + category;
          }
          if (_options.sp) {
            queryString += "&sp=" + _options.sp;
          }
          var uri = TEMPLATES.SEARCH_DESKTOP + queryString;
          var params = _url.parse(uri);
          params.headers = {
            "user-agent": _userAgent,
            "accept": "text/html",
            "accept-encoding": "gzip",
            "accept-language": "en-US"
          };
          debug(params);
          debug("getting results: " + _options.currentPage);
          _dasu.req(params, function(err, res, body) {
            if (err) {
              callback(err);
            } else {
              if (res.status !== 200) {
                return callback("http status: " + res.status);
              }
              if (_debugging) {
                var fs17 = require2("fs");
                require2("path");
                fs17.writeFileSync("dasu.response", res.responseText, "utf8");
              }
              try {
                _parseSearchResultInitialData(body, function(err2, results) {
                  if (err2)
                    return callback(err2);
                  var list = results;
                  var videos = list.filter(_videoFilter);
                  var playlists = list.filter(_playlistFilter);
                  var channels = list.filter(_channelFilter);
                  var live = list.filter(_liveFilter);
                  var all = list.filter(_allFilter);
                  _options._data = _options._data || {};
                  _options._data.videos = _options._data.videos || [];
                  _options._data.playlists = _options._data.playlists || [];
                  _options._data.channels = _options._data.channels || [];
                  _options._data.live = _options._data.live || [];
                  _options._data.all = _options._data.all || [];
                  videos.forEach(function(item) {
                    _options._data.videos.push(item);
                  });
                  playlists.forEach(function(item) {
                    _options._data.playlists.push(item);
                  });
                  channels.forEach(function(item) {
                    _options._data.channels.push(item);
                  });
                  live.forEach(function(item) {
                    _options._data.live.push(item);
                  });
                  all.forEach(function(item) {
                    _options._data.all.push(item);
                  });
                  _options.currentPage++;
                  var getMoreResults = _options.currentPage <= _options.pageEnd;
                  if (getMoreResults && results._sp) {
                    _options.sp = results._sp;
                    setTimeout(function() {
                      getSearchResults(_options, callback);
                    }, 2500);
                  } else {
                    var _videos = _options._data.videos.filter(_videoFilter);
                    var _playlists = _options._data.playlists.filter(_playlistFilter);
                    var _channels = _options._data.channels.filter(_channelFilter);
                    var _live = _options._data.live.filter(_liveFilter);
                    var _all = _options._data.all.slice(_allFilter);
                    callback(null, {
                      all: _all,
                      videos: _videos,
                      live: _live,
                      playlists: _playlists,
                      lists: _playlists,
                      accounts: _channels,
                      channels: _channels
                    });
                  }
                });
              } catch (err2) {
                callback(err2);
              }
            }
          });
        }
        function _parseSearchResultInitialData(responseText, callback) {
          var re = /{.*}/;
          var $ = _cheerio.load(responseText);
          var initialData = $("div#initial-data").html() || "";
          initialData = re.exec(initialData) || "";
          if (!initialData) {
            var scripts = $("script");
            for (var i = 0; i < scripts.length; i++) {
              var script = $(scripts[i]).html();
              var lines = script.split("\n");
              lines.forEach(function(line) {
                var i2;
                while ((i2 = line.indexOf("ytInitialData")) >= 0) {
                  line = line.slice(i2 + "ytInitialData".length);
                  var match = re.exec(line);
                  if (match && match.length > initialData.length) {
                    initialData = match;
                  }
                }
              });
            }
          }
          if (!initialData) {
            return callback("could not find inital data in the html document");
          }
          var errors = [];
          var results = [];
          var json = JSON.parse(initialData[0]);
          var items = _jp.query(json, "$..itemSectionRenderer..contents.*");
          _jp.query(json, "$..primaryContents..contents.*").forEach(function(item2) {
            items.push(item2);
          });
          debug("items.length: " + items.length);
          for (var _i = 0; _i < items.length; _i++) {
            var item = items[_i];
            var result = void 0;
            var type = "unknown";
            var hasList = _jp.value(item, "$..compactPlaylistRenderer") || _jp.value(item, "$..playlistRenderer");
            var hasChannel = _jp.value(item, "$..compactChannelRenderer") || _jp.value(item, "$..channelRenderer");
            var hasVideo = _jp.value(item, "$..compactVideoRenderer") || _jp.value(item, "$..videoRenderer");
            var listId = hasList && _jp.value(item, "$..playlistId");
            var channelId = hasChannel && _jp.value(item, "$..channelId");
            var videoId = hasVideo && _jp.value(item, "$..videoId");
            var watchingLabel = _jp.query(item, "$..viewCountText..text").join("");
            var isUpcoming = (
              // if scheduled livestream (has not started yet)
              _jp.query(item, "$..thumbnailOverlayTimeStatusRenderer..style").join("").toUpperCase().trim() === "UPCOMING"
            );
            var isLive = watchingLabel.indexOf("watching") >= 0 || _jp.query(item, "$..badges..label").join("").toUpperCase().trim() === "LIVE NOW" || _jp.query(item, "$..thumbnailOverlayTimeStatusRenderer..text").join("").toUpperCase().trim() === "LIVE" || isUpcoming;
            if (videoId) {
              type = "video";
            }
            if (channelId) {
              type = "channel";
            }
            if (listId) {
              type = "list";
            }
            if (isLive) {
              type = "live";
            }
            try {
              switch (type) {
                case "video":
                  {
                    var thumbnail = _normalizeThumbnail(_jp.value(item, "$..thumbnail..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails"));
                    var title = _jp.value(item, "$..title..text") || _jp.value(item, "$..title..simpleText");
                    var author_name = _jp.value(item, "$..shortBylineText..text") || _jp.value(item, "$..longBylineText..text");
                    var author_url = _jp.value(item, "$..shortBylineText..url") || _jp.value(item, "$..longBylineText..url");
                    var agoText = _jp.value(item, "$..publishedTimeText..text") || _jp.value(item, "$..publishedTimeText..simpleText");
                    var viewCountText = _jp.value(item, "$..viewCountText..text") || _jp.value(item, "$..viewCountText..simpleText") || "0";
                    var viewsCount = Number(viewCountText.split(/\s+/)[0].split(/[,.]/).join("").trim());
                    var lengthText = _jp.value(item, "$..lengthText..text") || _jp.value(item, "$..lengthText..simpleText");
                    var duration = _parseDuration(lengthText || "0:00");
                    var description = _jp.query(item, "$..detailedMetadataSnippets..snippetText..text").join("") || _jp.query(item, "$..description..text").join("") || _jp.query(item, "$..descriptionSnippet..text").join("");
                    var url = TEMPLATES.YT + "/watch?v=" + videoId;
                    result = {
                      type: "video",
                      videoId,
                      url,
                      title: title.trim(),
                      description,
                      image: thumbnail,
                      thumbnail,
                      seconds: Number(duration.seconds),
                      timestamp: duration.timestamp,
                      duration,
                      ago: agoText,
                      views: Number(viewsCount),
                      author: {
                        name: author_name,
                        url: TEMPLATES.YT + author_url
                      }
                    };
                  }
                  break;
                case "list":
                  {
                    var _thumbnail = _normalizeThumbnail(_jp.value(item, "$..thumbnail..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails"));
                    var _title = _jp.value(item, "$..title..text") || _jp.value(item, "$..title..simpleText");
                    var _author_name = _jp.value(item, "$..shortBylineText..text") || _jp.value(item, "$..longBylineText..text") || _jp.value(item, "$..shortBylineText..simpleText") || _jp.value(item, "$..longBylineText..simpleTextn") || "YouTube";
                    var _author_url = _jp.value(item, "$..shortBylineText..url") || _jp.value(item, "$..longBylineText..url") || "";
                    var video_count = _jp.value(item, "$..videoCountShortText..text") || _jp.value(item, "$..videoCountText..text") || _jp.value(item, "$..videoCountShortText..simpleText") || _jp.value(item, "$..videoCountText..simpleText") || _jp.value(item, "$..thumbnailText..text") || _jp.value(item, "$..thumbnailText..simpleText");
                    var _url2 = TEMPLATES.YT + "/playlist?list=" + listId;
                    result = {
                      type: "list",
                      listId,
                      url: _url2,
                      title: _title.trim(),
                      image: _thumbnail,
                      thumbnail: _thumbnail,
                      videoCount: video_count,
                      author: {
                        name: _author_name,
                        url: TEMPLATES.YT + _author_url
                      }
                    };
                  }
                  break;
                case "channel":
                  {
                    var _thumbnail2 = _normalizeThumbnail(_jp.value(item, "$..thumbnail..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails"));
                    var _title2 = _jp.value(item, "$..title..text") || _jp.value(item, "$..title..simpleText") || _jp.value(item, "$..displayName..text");
                    var _author_name2 = _jp.value(item, "$..shortBylineText..text") || _jp.value(item, "$..longBylineText..text") || _jp.value(item, "$..displayName..text") || _jp.value(item, "$..displayName..simpleText");
                    var video_count_label = _jp.value(item, "$..videoCountText..simpleText") || _jp.value(item, "$..videoCountText..label") || _jp.value(item, "$..videoCountText..text") || "0";
                    var sub_count_label = _jp.value(item, "$..subscriberCountText..simpleText") || _jp.value(item, "$..subscriberCountText..text") || "0";
                    if (typeof sub_count_label === "string") {
                      if (sub_count_label.indexOf("subscribe") < 1) {
                        if (video_count_label.indexOf("subscribe") > 0) {
                          sub_count_label = video_count_label;
                          video_count_label = "-1";
                        }
                      }
                      sub_count_label = sub_count_label.split(/\s+/).filter(function(w) {
                        return w.match(/\d/);
                      })[0];
                    }
                    var _url3 = _jp.value(item, "$..navigationEndpoint..url") || "/user/" + _title2;
                    result = {
                      type: "channel",
                      name: _author_name2,
                      url: TEMPLATES.YT + _url3,
                      title: _title2.trim(),
                      image: _thumbnail2,
                      thumbnail: _thumbnail2,
                      videoCount: Number(_parseNumbers(video_count_label)[0]),
                      videoCountLabel: video_count_label,
                      subCount: _parseSubCountLabel(sub_count_label),
                      subCountLabel: sub_count_label
                    };
                  }
                  break;
                case "live":
                  {
                    var _thumbnail3 = _normalizeThumbnail(_jp.value(item, "$..thumbnail..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails..url")) || _normalizeThumbnail(_jp.value(item, "$..thumbnails"));
                    var _title3 = _jp.value(item, "$..title..text") || _jp.value(item, "$..title..simpleText");
                    var _author_name3 = _jp.value(item, "$..shortBylineText..text") || _jp.value(item, "$..longBylineText..text");
                    var _author_url2 = _jp.value(item, "$..shortBylineText..url") || _jp.value(item, "$..longBylineText..url");
                    var _watchingLabel = _jp.query(item, "$..viewCountText..text").join("") || _jp.query(item, "$..viewCountText..simpleText").join("") || "0";
                    var watchCount = Number(_watchingLabel.split(/\s+/)[0].split(/[,.]/).join("").trim());
                    var _description = _jp.query(item, "$..detailedMetadataSnippets..snippetText..text").join("") || _jp.query(item, "$..description..text").join("") || _jp.query(item, "$..descriptionSnippet..text").join("");
                    var scheduledEpochTime = _jp.value(item, "$..upcomingEventData..startTime");
                    var scheduledTime = Date.now() > scheduledEpochTime ? scheduledEpochTime * 1e3 : scheduledEpochTime;
                    var scheduledDateString = _toInternalDateString(scheduledTime);
                    var _url4 = TEMPLATES.YT + "/watch?v=" + videoId;
                    result = {
                      type: "live",
                      videoId,
                      url: _url4,
                      title: _title3.trim(),
                      description: _description,
                      image: _thumbnail3,
                      thumbnail: _thumbnail3,
                      watching: Number(watchCount),
                      author: {
                        name: _author_name3,
                        url: TEMPLATES.YT + _author_url2
                      }
                    };
                    if (scheduledTime) {
                      result.startTime = scheduledTime;
                      result.startDate = scheduledDateString;
                      result.status = "UPCOMING";
                    } else {
                      result.status = "LIVE";
                    }
                  }
                  break;
                default:
              }
              if (result) {
                results.push(result);
              }
            } catch (err) {
              debug(err);
              errors.push(err);
            }
          }
          var ctoken = _jp.value(json, "$..continuation");
          results._ctoken = ctoken;
          if (errors.length) {
            return callback(errors.pop(), results);
          }
          return callback(null, results);
        }
        function getVideoMetaData(opts, callback) {
          debug("fn: getVideoMetaData");
          var videoId;
          if (typeof opts === "string") {
            videoId = opts;
          }
          if (_typeof(opts) === "object") {
            videoId = opts.videoId;
          }
          var _opts$hl = opts.hl, hl = _opts$hl === void 0 ? "en" : _opts$hl, _opts$gl = opts.gl, gl = _opts$gl === void 0 ? "US" : _opts$gl;
          var uri = "https://www.youtube.com/watch?hl=".concat(hl, "&gl=").concat(gl, "&v=").concat(videoId);
          var params = _url.parse(uri);
          params.headers = {
            "user-agent": _userAgent,
            "accept": "text/html",
            "accept-encoding": "gzip",
            "accept-language": "".concat(hl, "-").concat(gl)
          };
          params.headers["user-agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15";
          _dasu.req(params, function(err, res, body) {
            if (err) {
              callback(err);
            } else {
              if (res.status !== 200) {
                return callback("http status: " + res.status);
              }
              if (_debugging) {
                var fs17 = require2("fs");
                require2("path");
                fs17.writeFileSync("dasu.response", res.responseText, "utf8");
              }
              try {
                _parseVideoInitialData(body, callback);
              } catch (err2) {
                callback(err2);
              }
            }
          });
        }
        function _parseVideoInitialData(responseText, callback) {
          debug("_parseVideoInitialData");
          responseText = _getScripts(responseText);
          var initialData = _between(_findLine(/ytInitialData.*=\s*{/, responseText), "{", "}");
          if (!initialData) {
            return callback("could not find inital data in the html document");
          }
          var initialPlayerData = _between(_findLine(/ytInitialPlayerResponse.*=\s*{/, responseText), "{", "}");
          if (!initialPlayerData) {
            return callback("could not find inital player data in the html document");
          }
          var idata = JSON.parse(initialData);
          var ipdata = JSON.parse(initialPlayerData);
          var videoId = _jp.value(idata, "$..currentVideoEndpoint..videoId");
          if (!videoId) {
            return callback("video unavailable");
          }
          if (_jp.value(ipdata, "$..status") === "ERROR" || _jp.value(ipdata, "$..reason") === "Video unavailable") {
            return callback("video unavailable");
          }
          var title = _parseVideoMeataDataTitle(idata);
          var description = _jp.query(idata, "$..description..text").join("") || _jp.query(ipdata, "$..description..simpleText").join("") || _jp.query(ipdata, "$..microformat..description..simpleText").join("") || _jp.query(ipdata, "$..videoDetails..shortDescription").join("");
          var author_name = _jp.value(idata, "$..owner..title..text") || _jp.value(idata, "$..owner..title..simpleText");
          var author_url = _jp.value(idata, "$..owner..navigationEndpoint..url") || _jp.value(idata, "$..owner..title..url");
          var thumbnailUrl = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
          var seconds = Number(_jp.value(ipdata, "$..videoDetails..lengthSeconds"));
          var timestamp = _msToTimestamp(seconds * 1e3);
          var duration = _parseDuration(timestamp);
          var uploadDate = _jp.value(idata, "$..uploadDate") || _jp.value(idata, "$..dateText..simpleText");
          var agoText = uploadDate && _humanTime(new Date(uploadDate)) || "";
          var video = {
            title,
            description,
            url: TEMPLATES.YT + "/watch?v=" + videoId,
            videoId,
            seconds: Number(duration.seconds),
            timestamp: duration.timestamp,
            duration,
            views: Number(_jp.value(ipdata, "$..videoDetails..viewCount")),
            genre: (_jp.value(ipdata, "$..category") || "").toLowerCase(),
            uploadDate: _toInternalDateString(uploadDate),
            ago: agoText,
            // ex: 10 years ago
            image: thumbnailUrl,
            thumbnail: thumbnailUrl,
            author: {
              name: author_name,
              url: TEMPLATES.YT + author_url
            }
          };
          callback(null, video);
        }
        function getPlaylistMetaData(opts, callback) {
          debug("fn: getPlaylistMetaData");
          var listId;
          if (typeof opts === "string") {
            listId = opts;
          }
          if (_typeof(opts) === "object") {
            listId = opts.listId || opts.playlistId;
          }
          var _opts$hl2 = opts.hl, hl = _opts$hl2 === void 0 ? "en" : _opts$hl2, _opts$gl2 = opts.gl, gl = _opts$gl2 === void 0 ? "US" : _opts$gl2;
          var uri = "https://www.youtube.com/playlist?hl=".concat(hl, "&gl=").concat(gl, "&list=").concat(listId);
          var params = _url.parse(uri);
          params.headers = {
            "user-agent": _userAgent,
            "accept": "text/html",
            "accept-encoding": "gzip",
            "accept-language": "".concat(hl, "-").concat(gl)
          };
          _dasu.req(params, function(err, res, body) {
            if (err) {
              callback(err);
            } else {
              if (res.status !== 200) {
                return callback("http status: " + res.status);
              }
              if (_debugging) {
                var fs17 = require2("fs");
                require2("path");
                fs17.writeFileSync("dasu.response", res.responseText, "utf8");
              }
              try {
                _parsePlaylistInitialData(body, callback);
              } catch (err2) {
                callback(err2);
              }
            }
          });
        }
        function _parsePlaylistInitialData(responseText, callback) {
          debug("fn: parsePlaylistBody");
          responseText = _getScripts(responseText);
          var jsonString = responseText.match(/ytInitialData.*=\s*({.*});/)[1];
          if (!jsonString) {
            throw new Error("failed to parse ytInitialData json data");
          }
          var json = JSON.parse(jsonString);
          var plerr = _jp.value(json, "$..alerts..alertRenderer");
          if (plerr && typeof plerr.type === "string" && plerr.type.toLowerCase() === "error") {
            var plerrtext = "playlist error, not found?";
            if (_typeof(plerr.text) === "object") {
              plerrtext = _jp.query(plerr.text, "$..text").join("");
            }
            if (typeof plerr.text === "string") {
              plerrtext = plerr.text;
            }
            throw new Error("playlist error: " + plerrtext);
          }
          var alertInfo = "";
          _jp.query(json, "$..alerts..text").forEach(function(val) {
            if (typeof val === "string")
              alertInfo += val;
            if (_typeof(val) === "object") {
              var simpleText = _jp.value(val, "$..simpleText");
              if (simpleText)
                alertInfo += simpleText;
            }
          });
          var listId = _jp.value(json, "$..microformat..urlCanonical").split("=")[1];
          var viewCount = 0;
          try {
            var viewCountLabel = _jp.value(json, "$..sidebar.playlistSidebarRenderer.items[0]..stats[1].simpleText");
            if (viewCountLabel.toLowerCase() === "no views") {
              viewCount = 0;
            } else {
              viewCount = viewCountLabel.match(/\d+/g).join("");
            }
          } catch (err) {
          }
          var size = (_jp.value(json, "$..sidebar.playlistSidebarRenderer.items[0]..stats[0].simpleText") || _jp.query(json, "$..sidebar.playlistSidebarRenderer.items[0]..stats[0]..text").join("")).match(/\d+/g).join("");
          var list = _jp.query(json, "$..playlistVideoListRenderer..contents")[0];
          _typeof(list[list.length - 1].continuationItemRenderer) === "object";
          var videos = [];
          list.forEach(function(item) {
            if (!item.playlistVideoRenderer)
              return;
            var json2 = item;
            var duration = _parseDuration(_jp.value(json2, "$..lengthText..simpleText") || _jp.value(json2, "$..thumbnailOverlayTimeStatusRenderer..simpleText") || _jp.query(json2, "$..lengthText..text").join("") || _jp.query(json2, "$..thumbnailOverlayTimeStatusRenderer..text").join(""));
            var video = {
              title: _jp.value(json2, "$..title..simpleText") || _jp.value(json2, "$..title..text") || _jp.query(json2, "$..title..text").join(""),
              videoId: _jp.value(json2, "$..videoId"),
              listId,
              thumbnail: _normalizeThumbnail(_jp.value(json2, "$..thumbnail..url")) || _normalizeThumbnail(_jp.value(json2, "$..thumbnails..url")) || _normalizeThumbnail(_jp.value(json2, "$..thumbnails")),
              // ref: issue #35 https://github.com/talmobi/yt-search/issues/35
              duration,
              author: {
                name: _jp.value(json2, "$..shortBylineText..runs[0]..text"),
                url: "https://youtube.com" + _jp.value(json2, "$..shortBylineText..runs[0]..url")
              }
            };
            videos.push(video);
          });
          var plthumbnail = _normalizeThumbnail(_jp.value(json, "$..microformat..thumbnail..url")) || _normalizeThumbnail(_jp.value(json, "$..microformat..thumbnails..url")) || _normalizeThumbnail(_jp.value(json, "$..microformat..thumbnails"));
          var playlist = {
            title: _jp.value(json, "$..microformat..title"),
            listId,
            url: "https://youtube.com/playlist?list=" + listId,
            size: Number(size),
            views: Number(viewCount),
            // lastUpdate: lastUpdate,
            date: _parsePlaylistLastUpdateTime(_jp.value(json, "$..sidebar.playlistSidebarRenderer.items[0]..stats[2]..simpleText") || _jp.query(json, "$..sidebar.playlistSidebarRenderer.items[0]..stats[2]..text").join("") || ""),
            image: plthumbnail || videos[0].thumbnail,
            thumbnail: plthumbnail || videos[0].thumbnail,
            // playlist items/videos
            videos,
            alertInfo,
            author: {
              name: _jp.value(json, "$..videoOwner..title..runs[0]..text"),
              url: "https://youtube.com" + _jp.value(json, "$..videoOwner..navigationEndpoint..url")
            }
          };
          callback && callback(null, playlist);
        }
        function _parsePlaylistLastUpdateTime(lastUpdateLabel) {
          debug("fn: _parsePlaylistLastUpdateTime");
          var DAY_IN_MS = 1e3 * 60 * 60 * 24;
          try {
            var words = lastUpdateLabel.toLowerCase().trim().split(/[\s.-]+/);
            if (words.length > 0) {
              var lastWord = words[words.length - 1].toLowerCase();
              if (lastWord === "yesterday") {
                var ms = Date.now() - DAY_IN_MS;
                var d = new Date(ms);
                if (d.toString() !== "Invalid Date")
                  return _toInternalDateString(d);
              }
            }
            if (words.length >= 2) {
              if (words[0] === "updated" && words[2].slice(0, 3) === "day") {
                var _ms = Date.now() - DAY_IN_MS * words[1];
                var _d = new Date(_ms);
                if (_d.toString() !== "Invalid Date")
                  return _toInternalDateString(_d);
              }
            }
            for (var i = 0; i < words.length; i++) {
              var slice = words.slice(i);
              var t = slice.join(" ");
              var r = slice.reverse().join(" ");
              var _a = new Date(t);
              var b = new Date(r);
              if (_a.toString() !== "Invalid Date")
                return _toInternalDateString(_a);
              if (b.toString() !== "Invalid Date")
                return _toInternalDateString(b);
            }
            return "";
          } catch (err) {
            return "";
          }
        }
        function _toInternalDateString(date) {
          date = new Date(date);
          debug("fn: _toInternalDateString");
          return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + // january gives 0
          date.getDate();
        }
        function _parseDuration(timestampText) {
          var a2 = timestampText.split(/\s+/);
          var lastword = a2[a2.length - 1];
          var timestamp = lastword.replace(/[^:.\d]/g, "");
          if (!timestamp)
            return {
              toString: function toString() {
                return a2[0];
              },
              seconds: 0,
              timestamp: 0
            };
          while (timestamp[timestamp.length - 1].match(/\D/)) {
            timestamp = timestamp.slice(0, -1);
          }
          timestamp = timestamp.replace(/\./g, ":");
          var t = timestamp.split(/[:.]/);
          var seconds = 0;
          var exp = 0;
          for (var i = t.length - 1; i >= 0; i--) {
            if (t[i].length <= 0)
              continue;
            var number = t[i].replace(/\D/g, "");
            seconds += parseInt(number) * (exp > 0 ? Math.pow(60, exp) : 1);
            exp++;
            if (exp > 2)
              break;
          }
          return {
            toString: function toString() {
              return seconds + " seconds (" + timestamp + ")";
            },
            seconds,
            timestamp
          };
        }
        function _parseSubCountLabel(subCountLabel) {
          if (!subCountLabel)
            return void 0;
          var label = subCountLabel.split(/\s+/).filter(function(w) {
            return w.match(/\d/);
          })[0].toLowerCase();
          var m = label.match(/\d+(\.\d+)?/);
          if (m && m[0]) ; else {
            return;
          }
          var num = Number(m[0]);
          var THOUSAND = 1e3;
          var MILLION = THOUSAND * THOUSAND;
          if (label.indexOf("m") >= 0)
            return MILLION * num;
          if (label.indexOf("k") >= 0)
            return THOUSAND * num;
          return num;
        }
        function _parseNumbers(label) {
          if (!label)
            return [];
          var nums = label.split(/\s+/).filter(function(w) {
            return w.match(/\d/);
          }).map(function(l) {
            return l.toLowerCase();
          });
          var results = [];
          nums.forEach(function(n) {
            var m = n.match(/[-]?\d+(\.\d+)?/);
            if (m && m[0]) ; else {
              return;
            }
            var num = Number(m[0]);
            var THOUSAND = 1e3;
            var MILLION = THOUSAND * THOUSAND;
            if (n.indexOf("m") >= 0)
              num = MILLION * num;
            if (n.indexOf("k") >= 0)
              num = THOUSAND * num;
            results.push(num);
          });
          return results;
        }
        function _normalizeThumbnail(thumbnails) {
          var t;
          if (typeof thumbnails === "string") {
            t = thumbnails;
          } else {
            if (thumbnails.length) {
              t = thumbnails[0];
              return _normalizeThumbnail(t);
            }
            return void 0;
          }
          t = t.split("?")[0];
          t = t.split("/default.jpg").join("/hqdefault.jpg");
          t = t.split("/default.jpeg").join("/hqdefault.jpeg");
          if (t.indexOf("//") === 0) {
            return "https://" + t.slice(2);
          }
          return t.split("http://").join("https://");
        }
        function _msToTimestamp(ms) {
          var t = "";
          var MS_HOUR = 1e3 * 60 * 60;
          var MS_MINUTE = 1e3 * 60;
          var MS_SECOND = 1e3;
          var h = Math.floor(ms / MS_HOUR);
          var m = Math.floor(ms / MS_MINUTE) % 60;
          var s = Math.floor(ms / MS_SECOND) % 60;
          if (h)
            t += h + ":";
          if (h && String(m).length < 2)
            t += "0";
          t += m + ":";
          if (String(s).length < 2)
            t += "0";
          t += s;
          return t;
        }
        function _parseVideoMeataDataTitle(idata) {
          var t = _jp.query(idata, "$..videoPrimaryInfoRenderer.title..text").join("") || _jp.query(idata, "$..videoPrimaryInfoRenderer.title..simpleText").join("") || _jp.query(idata, "$..videoPrimaryRenderer.title..text").join("") || _jp.query(idata, "$..videoPrimaryRenderer.title..simpleText").join("") || _jp.value(idata, "$..title..text") || _jp.value(idata, "$..title..simpleText");
          return t.replace(/[\u0000-\u001F\u007F-\u009F\u200b]/g, "");
        }
        if (require2.main === module3) {
          test("\u738B\u83F2 Faye Wong");
        }
        function test(query) {
          console.log("test: doing list search");
          var opts = {
            query,
            pageEnd: 1
          };
          search3(opts, function(error, r) {
            if (error)
              throw error;
            var videos = r.videos;
            var playlists = r.playlists;
            var channels = r.channels;
            var topChannel = channels[0];
            console.log("videos: " + videos.length);
            console.log("playlists: " + playlists.length);
            console.log("channels: " + channels.length);
            console.log("topChannel name: " + topChannel.name);
            console.log("topChannel.videoCount: " + topChannel.videoCount);
            console.log("topChannel.subCount: " + topChannel.subCount);
            console.log("topChannel.subCountLabel: " + topChannel.subCountLabel);
          });
        }
      }, { "./util.js": 2, "async.parallellimit": void 0, "cheerio": void 0, "dasu": void 0, "fs": void 0, "human-time": void 0, "jsonpath-plus": void 0, "path": void 0, "querystring": void 0, "url": void 0 }], 2: [function(require2, module3, exports3) {
        var _cheerio = require2("cheerio");
        var util = {};
        module3.exports = util;
        util._getScripts = _getScripts;
        util._findLine = _findLine;
        util._between = _between;
        function _getScripts(text) {
          var $ = _cheerio.load(text);
          var scripts = $("script");
          var buffer = "";
          for (var i = 0; i < scripts.length; i++) {
            var el = scripts[i];
            var child = el && el.children[0];
            var data = child && child.data;
            if (data) {
              buffer += data + "\n";
            }
          }
          return buffer;
        }
        function _findLine(regex, text) {
          var cache = _findLine.cache || {};
          _findLine.cache = cache;
          cache[text] = cache[text] || {};
          var lines = cache[text].lines || text.split("\n");
          cache[text].lines = lines;
          clearTimeout(cache[text].timeout);
          cache[text].timeout = setTimeout(function() {
            delete cache[text];
          }, 100);
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (regex.test(line))
              return line;
          }
          return "";
        }
        function _between(text, start, end) {
          var i = text.indexOf(start);
          var j = text.lastIndexOf(end);
          if (i < 0)
            return "";
          if (j < 0)
            return "";
          return text.slice(i, j + 1);
        }
      }, { "cheerio": void 0 }] }, {}, [1])(1);
    });
  }
});

// app/cli/main.ts
init_cjs_shims();

// app/index.ts
init_cjs_shims();

// app/pipes/command/help.ts
init_cjs_shims();
function help() {
  return Promise.resolve(
    colors17__default.default.bold.white(`
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
\u2503               \u2503   bun add yt-dlp                                                                           \u2503
\u2503               \u2503   yarn add yt-dlp                                                                          \u2503
\u2503               \u2503   npm install yt-dlp                                                                       \u2503
\u2503               \u2503   pnpm install yt-dlp                                                                      \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D GLOBALLY: \u275E                                                                               \u2503
\u2503               \u2503   yarn global add yt-dlp                                                   (use cli)       \u2503
\u2503               \u2503   npm install --global yt-dlp                                              (use cli)       \u2503
\u2503               \u2503   pnpm install --global yt-dlp                                             (use cli)       \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503    FILTERS    \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   bassboost                  echo                                                           \u2503
\u2503               \u2503   flanger                    nightdlp                                                      \u2503
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
\u2503               \u2503   yt-dlp version                                                             (alias: v)    \u2503
\u2503               \u2503   yt-dlp help                                                                (alias: h)    \u2503
\u2503               \u2503   yt-dlp extract --query="video/url"                                         (alias: e)    \u2503
\u2503               \u2503   yt-dlp search-yt --query="video/url"                                       (alias: s)    \u2503
\u2503               \u2503   yt-dlp list-formats --query="video/url"                                    (alias: f)    \u2503 
\u2503               \u2503   yt-dlp get-video-data --query="video/url"                                  (alias: gvd)  \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   yt-dlp audio-lowest --query="video/url"                                    (alias: al)   \u2503
\u2503               \u2503   yt-dlp audio-highest --query="video/url"                                   (alias: ah)   \u2503
\u2503               \u2503   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    (alias: aqc)  \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                        \u2503
\u2503               \u2503   yt-dlp audio-lowest --query="video/url" --filter="valid-filter"            (filter)      \u2503
\u2503               \u2503   yt-dlp audio-highest --query="video/url" --filter="valid-filter"           (filter)      \u2503
\u2503               \u2503   yt-dlp audio-quality-custom --query="video/url" --format="valid-format"    ........      \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D VIDEO ONLY: \u275E                                                                             \u2503
\u2503               \u2503   yt-dlp video-lowest --query="video/url"                                    (alias: vl)   \u2503
\u2503               \u2503   yt-dlp video-highest --query="video/url"                                   (alias: vh)   \u2503
\u2503               \u2503   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    (alias: vqc)  \u2503
\u2503               \u2503       \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500                        \u2503
\u2503               \u2503   yt-dlp video-lowest --query="video/url" --filter="valid-filter"            (filter)      \u2503
\u2503               \u2503   yt-dlp video-highest --query="video/url" --filter="valid-filter"           (filter)      \u2503
\u2503               \u2503   yt-dlp video-quality-custom --query="video/url" --format="valid-format"    ........      \u2503
\u2503               \u2503                                                   --filter="valid-filter"    (filter)       \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503                                                                                             \u2503
\u2503               \u2503 \u275D AUDIO + VIDEO MIX: \u275E                                                                      \u2503
\u2503               \u2503   yt-dlp audio-video-lowest --query="video/url"                              (alias: avl)  \u2503
\u2503               \u2503   yt-dlp audio-video-highest --query="video/url"                             (alias: avh)  \u2503
\u2503               \u2503\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2503
\u2503   IMPORTING   \u2503   import ytdlp from "yt-dlp";                                            TypeScript (ts)   \u2503
\u2503               \u2503   import ytdlp from "yt-dlp";                                            ECMAScript (esm)  \u2503
\u2503               \u2503   const ytdlp = require("yt-dlp");                                       CommonJS   (cjs)  \u2503
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

// app/pipes/command/search.ts
init_cjs_shims();

// app/base/scrape.ts
init_cjs_shims();

// app/base/ytcprox.ts
init_cjs_shims();
async function ytcprox({
  query,
  route,
  domain
}) {
  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const host = `${domain}/${route}?query=${decodeURIComponent(query)}`;
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(host);
    await page.waitForSelector("button[class*=ring-blue-600]", {
      timeout: 1e4
    });
    await page.click("button[class*=ring-blue-600]");
    const payLoad = await new Promise((resolve) => {
      page.on("requestfinished", async (request) => {
        if (request.url().includes("/" + route)) {
          const response = await request.response();
          if (!response)
            return resolve(null);
          else
            return resolve(await response.json());
        } else
          return resolve(null);
      });
    });
    return JSON.stringify(payLoad);
  } catch (error) {
    console.log(colors17__default.default.red("ERROR:"), error);
    return null;
  } finally {
    await browser.close();
  }
}

// app/base/scrape.ts
async function scrape(query) {
  try {
    const response = await ytcprox({
      query,
      route: "scrape",
      domain: "https://casual-insect-sunny.ngrok-free.app"
    });
    if (response !== null)
      return decodeURIComponent(response);
    else
      return null;
  } catch (error) {
    return null;
  }
}

// app/pipes/command/search.ts
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

// app/pipes/command/extract.ts
init_cjs_shims();

// app/base/agent.ts
init_cjs_shims();

// app/base/ytdlp.ts
init_cjs_shims();
async function ytdlp(query) {
  try {
    const response = await ytcprox({
      query,
      route: "core",
      domain: "https://casual-insect-sunny.ngrok-free.app"
    });
    if (response !== null)
      return decodeURIComponent(response);
    else
      return null;
  } catch (error) {
    return null;
  }
}

// package.json
var version = "20.1.0";

// app/base/agent.ts
async function Engine({
  query
}) {
  let videoId, TubeDlp, TubeBody;
  console.log(
    colors17__default.default.bold.green("\n\nINFO: ") + `\u2B55 using yt-dlp version <(${version})>` + colors17__default.default.reset("")
  );
  if (!query || query.trim() === "") {
    console.log(
      colors17__default.default.bold.red("ERROR: ") + "\u2757'query' is required..." + colors17__default.default.reset("")
    );
    return null;
  } else if (/https/i.test(query) && /list/i.test(query)) {
    console.log(
      colors17__default.default.bold.red("ERROR: ") + "\u2757use extract_playlist_videos() for playlists..." + colors17__default.default.reset("")
    );
    return null;
  } else if (/https/i.test(query) && !/list/i.test(query)) {
    console.log(
      colors17__default.default.bold.green("INFO: ") + `\u{1F6F0}\uFE0F fetching metadata for: <(${query})>` + colors17__default.default.reset("")
    );
    videoId = await YouTubeID__default.default(query);
  } else
    videoId = await YouTubeID__default.default(query);
  switch (videoId) {
    case null:
      TubeBody = await scrape(query);
      if (TubeBody === null) {
        console.log(
          colors17__default.default.bold.red("ERROR: ") + "\u2757no data returned from server..." + colors17__default.default.reset("")
        );
        return null;
      } else
        TubeBody = JSON.parse(TubeBody);
      console.log(
        colors17__default.default.bold.green("INFO: ") + `\u{1F4E1}preparing payload for <(${TubeBody.Title} Author: ${TubeBody.Uploader})>` + colors17__default.default.reset("")
      );
      TubeDlp = await ytdlp(TubeBody.Link);
      break;
    default:
      TubeBody = await scrape(videoId);
      if (TubeBody === null) {
        console.log(
          colors17__default.default.bold.red("ERROR: ") + "\u2757no data returned from server..." + colors17__default.default.reset("")
        );
        return null;
      } else
        TubeBody = JSON.parse(TubeBody);
      console.log(
        colors17__default.default.bold.green("INFO: ") + `\u{1F4E1}preparing payload for <(${TubeBody[0].Title} Author: ${TubeBody[0].Uploader})>` + colors17__default.default.reset("")
      );
      TubeDlp = await ytdlp(TubeBody[0].Link);
      break;
  }
  switch (TubeDlp) {
    case null:
      console.log(
        colors17__default.default.bold.red("ERROR: ") + "\u2757no data returned from server..." + colors17__default.default.reset("")
      );
      return null;
    default:
      console.log(
        colors17__default.default.bold.green("INFO:"),
        "\u2763\uFE0F Thank you for using yt-dlp! If you enjoy the project, consider starring the GitHub repo: https://github.com/shovitdutta/yt-dlp"
      );
      return JSON.parse(TubeDlp);
  }
}

// app/pipes/command/extract.ts
async function extract({ query }) {
  try {
    let calculateUploadAgo2 = function(days) {
      const years = Math.floor(days / 365);
      const months = Math.floor(days % 365 / 30);
      const remainingDays = days % 30;
      const formattedString = `${years > 0 ? years + " years, " : ""}${months > 0 ? months + " months, " : ""}${remainingDays} days`;
      return { years, months, days: remainingDays, formatted: formattedString };
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
    const metaBody = await Engine({ query });
    if (!metaBody) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const uploadDate = new Date(
      metaBody.metaTube.upload_date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
    );
    const currentDate = /* @__PURE__ */ new Date();
    const daysAgo = Math.floor(
      (currentDate.getTime() - uploadDate.getTime()) / (1e3 * 60 * 60 * 24)
    );
    const prettyDate = uploadDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const uploadAgoObject = calculateUploadAgo2(daysAgo);
    const videoTimeInSeconds = metaBody.metaTube.duration;
    const videoDuration = calculateVideoDuration2(videoTimeInSeconds);
    const viewCountFormatted = formatCount2(metaBody.metaTube.view_count);
    const likeCountFormatted = formatCount2(metaBody.metaTube.like_count);
    const payload = {
      audio_data: metaBody.AudioTube,
      video_data: metaBody.VideoTube,
      hdrvideo_data: metaBody.HDRVideoTube,
      meta_data: {
        id: metaBody.metaTube.id,
        original_url: metaBody.metaTube.original_url,
        webpage_url: metaBody.metaTube.webpage_url,
        title: metaBody.metaTube.title,
        view_count: metaBody.metaTube.view_count,
        like_count: metaBody.metaTube.like_count,
        view_count_formatted: viewCountFormatted,
        like_count_formatted: likeCountFormatted,
        full_title: metaBody.metaTube.Fulltitle,
        uploader: metaBody.metaTube.uploader,
        uploader_id: metaBody.metaTube.uploader_id,
        uploader_url: metaBody.metaTube.uploader_url,
        thumbnail: metaBody.metaTube.thumbnail,
        categories: metaBody.metaTube.categories,
        time: videoTimeInSeconds,
        duration: videoDuration,
        age_limit: metaBody.metaTube.age_limit,
        live_status: metaBody.metaTube.live_status,
        description: metaBody.metaTube.description,
        full_description: metaBody.metaTube.description,
        upload_date: prettyDate,
        upload_ago: daysAgo,
        upload_ago_formatted: uploadAgoObject,
        comment_count: metaBody.metaTube.comment_count,
        comment_count_formatted: formatCount2(metaBody.metaTube.comment_count),
        channel_id: metaBody.metaTube.channel_id,
        channel_name: metaBody.metaTube.channel,
        channel_url: metaBody.metaTube.channel_url,
        channel_follower_count: metaBody.metaTube.channel_follower_count,
        channel_follower_count_formatted: formatCount2(
          metaBody.metaTube.channel_follower_count
        )
      }
    };
    return payload;
  } catch (error) {
    return {
      message: error.message || "An unexpected error occurred",
      status: 500
    };
  }
}

// app/pipes/command/get_playlist.ts
init_cjs_shims();
var import_yt_search = __toESM(require_yt_search());
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
          colors17__default.default.bold.red("ERROR: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp = await (0, import_yt_search.default)({ listId: ispUrl[1] });
      if (!resp) {
        console.error(
          colors17__default.default.bold.red("ERROR: "),
          "Invalid Data Found For:",
          ispUrl[1]
        );
        continue;
      }
      for (let i = 0; i < resp.videos.length; i++) {
        try {
          const videoId = resp.videos[i].videoId;
          const metaTube = await (0, import_yt_search.default)({ videoId });
          console.log(
            colors17__default.default.bold.green("INFO:"),
            colors17__default.default.bold.green("<("),
            metaTube.title,
            colors17__default.default.bold.green("by"),
            metaTube.author.name,
            colors17__default.default.bold.green(")>")
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
          console.error(colors17__default.default.bold.red("ERROR: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z3__namespace.ZodError ? error.errors : error;
  }
}

// app/pipes/command/list_formats.ts
init_cjs_shims();
function list_formats({
  query
}) {
  return new Promise(async (resolve, reject2) => {
    try {
      const zval = z3__namespace.object({
        query: z3__namespace.string()
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
      reject2(error instanceof z3__namespace.ZodError ? error.errors : error);
    }
  });
}

// app/pipes/command/get_video_data.ts
init_cjs_shims();
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
        z3__namespace;
      };
      var calculateUploadAgo = calculateUploadAgo2, calculateVideoDuration = calculateVideoDuration2, formatCount = formatCount2;
      const zval = z3__namespace.object({
        query: z3__namespace.string()
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
      reject2(error instanceof z3__namespace.ZodError ? error.errors : error);
    }
  });
}

// app/pipes/command/extract_playlist_videos.ts
init_cjs_shims();
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
          colors17__default.default.bold.red("ERROR: "),
          "Invalid YouTube Playlist URL:",
          url
        );
        continue;
      }
      const resp = await scrape(ispUrl[1]);
      if (!resp) {
        console.error(
          colors17__default.default.bold.red("ERROR: "),
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
          console.error(colors17__default.default.bold.red("ERROR: "), error);
        }
      }
    }
    return proTubeArr;
  } catch (error) {
    return error instanceof z3__namespace.ZodError ? error.errors : error;
  }
}

// app/pipes/audio/AudioLowest.ts
init_cjs_shims();

// app/base/lowEntry.ts
init_cjs_shims();
async function checkUrl(url) {
  try {
    const response = await axios__default.default.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
async function bigEntry(metaBody) {
  switch (true) {
    case (!metaBody || metaBody.length === 0):
      console.log(
        colors17__default.default.bold.red("ERROR:"),
        "\u2757sorry no downloadable data found"
      );
      return null;
    default:
      const sortedByFileSize = [...metaBody].sort(
        (a2, b) => a2.meta_info.filesizebytes - b.meta_info.filesizebytes
      );
      for (const item of sortedByFileSize) {
        const { mediaurl } = item.meta_dl;
        if (mediaurl && await checkUrl(mediaurl))
          return item;
      }
      console.log(
        colors17__default.default.bold.red("ERROR:"),
        "\u2757sorry no downloadable data found"
      );
      return null;
  }
}

// app/base/progressBar.ts
init_cjs_shims();
var progressBar = (prog) => {
  if (prog.percent === void 0)
    return;
  if (prog.timemark === void 0)
    return;
  if (prog.currentKbps === void 0)
    return;
  if (prog.percent > 98)
    prog.percent = 100;
  readline__default.default.cursorTo(process.stdout, 0);
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round(width * prog.percent / 100);
  let color = colors17__default.default.green;
  if (prog.percent < 20)
    color = colors17__default.default.red;
  else if (prog.percent < 80)
    color = colors17__default.default.yellow;
  const sprog = color("\u2501").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    color("PROG: ") + sprog + " " + prog.percent.toFixed(2) + "% " + color("NETWORK: ") + prog.currentKbps + "kbps " + color("TIMEMARK: ") + prog.timemark
  );
  if (prog.percent >= 99)
    process.stdout.write("\n");
};
var progressBar_default = progressBar;

// app/pipes/audio/AudioLowest.ts
var AudioLowestInputSchema = z3.z.object({
  query: z3.z.string(),
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioLowest(input) {
  try {
    const {
      query,
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp3"
    } = AudioLowestInputSchema.parse(input);
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
    const metaEntry = await bigEntry(metaBody.AudioTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.addInput(metaBody.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.format(outputFormat);
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    ytc.on("error", (error) => {
      return error;
    });
    switch (filter2) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        ytc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/audio/AudioHighest.ts
init_cjs_shims();

// app/base/bigEntry.ts
init_cjs_shims();
async function checkUrl2(url) {
  try {
    const response = await axios__default.default.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
async function bigEntry2(metaBody) {
  switch (true) {
    case (!metaBody || metaBody.length === 0):
      console.log(
        colors17__default.default.bold.red("ERROR:"),
        "\u2757sorry no downloadable data found"
      );
      return null;
    default:
      const sortedByFileSize = [...metaBody].sort(
        (a2, b) => b.meta_info.filesizebytes - a2.meta_info.filesizebytes
      );
      for (const item of sortedByFileSize) {
        const { mediaurl } = item.meta_dl;
        if (mediaurl && await checkUrl2(mediaurl))
          return item;
      }
      console.log(
        colors17__default.default.bold.red("ERROR:"),
        "\u2757sorry no downloadable data found"
      );
      return null;
  }
}
var AudioHighestInputSchema = z3.z.object({
  query: z3.z.string(),
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioHighest(input) {
  try {
    const {
      query,
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp3"
    } = AudioHighestInputSchema.parse(input);
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
    const metaEntry = await bigEntry2(metaBody.AudioTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.addInput(metaBody.metaTube.thumbnail);
    ytc.addOutputOption("-map", "1:0");
    ytc.addOutputOption("-map", "0:a:0");
    ytc.addOutputOption("-id3v2_version", "3");
    ytc.format(outputFormat);
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
    ytc.on("error", (error) => {
      return error;
    });
    switch (filter2) {
      case "bassboost":
        ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
        metaName = `yt-dlp-(AudioHighest_bassboost)-${title}.${outputFormat}`;
        break;
      case "echo":
        ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
        metaName = `yt-dlp-(AudioHighest_echo)-${title}.${outputFormat}`;
        break;
      case "flanger":
        ytc.withAudioFilter(["flanger"]);
        metaName = `yt-dlp-(AudioHighest_flanger)-${title}.${outputFormat}`;
        break;
      case "nightcore":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
        metaName = `yt-dlp-(AudioHighest_nightcore)-${title}.${outputFormat}`;
        break;
      case "panning":
        ytc.withAudioFilter(["apulsator=hz=0.08"]);
        metaName = `yt-dlp-(AudioHighest_panning)-${title}.${outputFormat}`;
        break;
      case "phaser":
        ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
        metaName = `yt-dlp-(AudioHighest_phaser)-${title}.${outputFormat}`;
        break;
      case "reverse":
        ytc.withAudioFilter(["areverse"]);
        metaName = `yt-dlp-(AudioHighest_reverse)-${title}.${outputFormat}`;
        break;
      case "slow":
        ytc.withAudioFilter(["atempo=0.8"]);
        metaName = `yt-dlp-(AudioHighest_slow)-${title}.${outputFormat}`;
        break;
      case "speed":
        ytc.withAudioFilter(["atempo=2"]);
        metaName = `yt-dlp-(AudioHighest_speed)-${title}.${outputFormat}`;
        break;
      case "subboost":
        ytc.withAudioFilter(["asubboost"]);
        metaName = `yt-dlp-(AudioHighest_subboost)-${title}.${outputFormat}`;
        break;
      case "superslow":
        ytc.withAudioFilter(["atempo=0.5"]);
        metaName = `yt-dlp-(AudioHighest_superslow)-${title}.${outputFormat}`;
        break;
      case "superspeed":
        ytc.withAudioFilter(["atempo=3"]);
        metaName = `yt-dlp-(AudioHighest_superspeed)-${title}.${outputFormat}`;
        break;
      case "surround":
        ytc.withAudioFilter(["surround"]);
        metaName = `yt-dlp-(AudioHighest_surround)-${title}.${outputFormat}`;
        break;
      case "vaporwave":
        ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
        metaName = `yt-dlp-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
        break;
      case "vibrato":
        ytc.withAudioFilter(["vibrato=f=6.5"]);
        metaName = `yt-dlp-(AudioHighest_vibrato)-${title}.${outputFormat}`;
        break;
      default:
        ytc.withAudioFilter([]);
        metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/video/VideoLowest.ts
init_cjs_shims();
var VideoLowestInputSchema = z3.z.object({
  query: z3.z.string(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  filter: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function VideoLowest(input) {
  try {
    const {
      query,
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = VideoLowestInputSchema.parse(input);
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
    const metaEntry = await bigEntry(metaBody.VideoTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter2) {
      case "grayscale":
        ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/video/VideoHighest.ts
init_cjs_shims();
var VideoHighestInputSchema = z3.z.object({
  query: z3.z.string(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z3.z.string().optional()
});
async function VideoHighest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4",
      filter: filter2
    } = VideoHighestInputSchema.parse(input);
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
    let metaName = "";
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const metaEntry = await bigEntry2(metaBody.VideoTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter2) {
      case "grayscale":
        ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/mix/AudioVideoLowest.ts
init_cjs_shims();
var AudioVideoLowestInputSchema = z3.z.object({
  query: z3.z.string(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function AudioVideoLowest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = AudioVideoLowestInputSchema.parse(input);
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
    const metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg__default.default();
    const AmetaEntry = await bigEntry(metaBody.AudioTube);
    const VmetaEntry = await bigEntry(metaBody.VideoTube);
    if (AmetaEntry === null || VmetaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    ytc.addInput(VmetaEntry.meta_dl.mediaurl);
    ytc.addInput(AmetaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/mix/AudioVideoHighest.ts
init_cjs_shims();
var AudioVideoHighestInputSchema = z3.z.object({
  query: z3.z.string(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function AudioVideoHighest(input) {
  try {
    const {
      query,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = AudioVideoHighestInputSchema.parse(input);
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
    const metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
    const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
    if (!fs__namespace.existsSync(metaFold))
      fs__namespace.mkdirSync(metaFold, { recursive: true });
    const ytc = fluentffmpeg__default.default();
    const AmetaEntry = await bigEntry2(metaBody.AudioTube);
    const VmetaEntry = await bigEntry2(metaBody.VideoTube);
    if (AmetaEntry === null || VmetaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    ytc.addInput(VmetaEntry.meta_dl.mediaurl);
    ytc.addInput(AmetaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/audio/AudioQualityCustom.ts
init_cjs_shims();
var AudioQualityCustomInputSchema = z3.z.object({
  query: z3.z.string(),
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  quality: z3.z.enum(["high", "medium", "low", "ultralow"]),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function AudioQualityCustom(input) {
  try {
    const {
      query,
      filter: filter2,
      stream: stream$1,
      verbose,
      quality,
      folderName,
      outputFormat = "mp3"
    } = AudioQualityCustomInputSchema.parse(input);
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
    const metaEntry = await bigEntry2(metaBody);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.addInput(metaResp.metaTube.thumbnail);
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
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
        filename: folderName ? path__namespace.join(metaFold, `yt-dlp-(${quality})-${title}.${outputFormat}`) : `yt-dlp-(${quality})-${title}.${outputFormat}`
      };
    } else {
      await new Promise((resolve, reject2) => {
        ytc.output(
          path__namespace.join(metaFold, `yt-dlp-(${quality})-${title}.${outputFormat}`)
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/video/VideoQualityCustom.ts
init_cjs_shims();
var VideoLowestInputSchema2 = z3.z.object({
  query: z3.z.string(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  filter: z3.z.string().optional(),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function VideoLowest2(input) {
  try {
    const {
      query,
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      outputFormat = "mp4"
    } = VideoLowestInputSchema2.parse(input);
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
    const metaEntry = await bigEntry2(metaBody.VideoTube);
    if (metaEntry === null) {
      return {
        message: "Unable to get response from YouTube...",
        status: 500
      };
    }
    const ytc = fluentffmpeg__default.default();
    ytc.addInput(metaEntry.meta_dl.mediaurl);
    ytc.format(outputFormat);
    switch (filter2) {
      case "grayscale":
        ytc.withVideoFilter("colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3");
        metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
        break;
      case "invert":
        ytc.withVideoFilter("negate");
        metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
        break;
      case "rotate90":
        ytc.withVideoFilter("rotate=PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
        break;
      case "rotate180":
        ytc.withVideoFilter("rotate=PI");
        metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
        break;
      case "rotate270":
        ytc.withVideoFilter("rotate=3*PI/2");
        metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
        break;
      case "flipHorizontal":
        ytc.withVideoFilter("hflip");
        metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
        break;
      case "flipVertical":
        ytc.withVideoFilter("vflip");
        metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
        break;
      default:
        metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
    }
    ytc.on("start", (command) => {
      if (verbose)
        console.log(command);
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("end", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("close", () => {
      progressBar_default({
        currentKbps: void 0,
        timemark: void 0,
        percent: void 0
      });
    });
    ytc.on("progress", (prog) => {
      progressBar_default({
        currentKbps: prog.currentKbps,
        timemark: prog.timemark,
        percent: prog.percent
      });
    });
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
    if (error instanceof z3.ZodError) {
      return {
        message: error.errors.map((err) => err.message).join(", "),
        status: 500
      };
    } else if (error instanceof Error) {
      return {
        message: error.message,
        status: 500
      };
    } else {
      return {
        message: "Internal server error",
        status: 500
      };
    }
  }
}

// app/pipes/video/ListVideoLowest.ts
init_cjs_shims();
var ListVideoLowestInputSchema = z3.z.object({
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function ListVideoLowest(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4"
    } = ListVideoLowestInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry(metaBody.VideoTube);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "grayscale":
          ytc.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          metaName = `yt-dlp_(VideoLowest-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter("negate");
          metaName = `yt-dlp_(VideoLowest-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter("rotate=PI/2");
          metaName = `yt-dlp_(VideoLowest-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter("rotate=PI");
          metaName = `yt-dlp_(VideoLowest-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter("rotate=3*PI/2");
          metaName = `yt-dlp_(VideoLowest-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter("hflip");
          metaName = `yt-dlp_(VideoLowest-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter("vflip");
          metaName = `yt-dlp_(VideoLowest-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          metaName = `yt-dlp_(VideoLowest)_${title}.${outputFormat}`;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/video/ListVideoHighest.ts
init_cjs_shims();
var ListVideoHighestInputSchema = z3.z.object({
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function ListVideoHighest(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4"
    } = ListVideoHighestInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry2(metaBody.VideoTube);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "grayscale":
          ytc.withVideoFilter(
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          );
          metaName = `yt-dlp_(VideoHighest-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter("negate");
          metaName = `yt-dlp_(VideoHighest-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter("rotate=PI/2");
          metaName = `yt-dlp_(VideoHighest-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter("rotate=PI");
          metaName = `yt-dlp_(VideoHighest-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter("rotate=3*PI/2");
          metaName = `yt-dlp_(VideoHighest-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter("hflip");
          metaName = `yt-dlp_(VideoHighest-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter("vflip");
          metaName = `yt-dlp_(VideoHighest-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          metaName = `yt-dlp_(VideoHighest)_${title}.${outputFormat}`;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/video/ListVideoQualityCustom.ts
init_cjs_shims();
var ListVideoQualityCustomInputSchema = z3.z.object({
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  quality: z3.z.enum([
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "1440p",
    "2160p",
    "2880p",
    "4320p",
    "5760p",
    "8640p",
    "12000p"
  ]),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional(),
  filter: z3.z.string().optional()
});
async function ListVideoQualityCustom(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      quality,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4"
    } = ListVideoQualityCustomInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const newBody = metaBody.VideoTube.filter(
        (op) => op.meta_dl.formatnote === quality
      );
      if (!newBody || newBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry2(newBody);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "grayscale":
          ytc.withVideoFilter([
            "colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"
          ]);
          metaName = `yt-dlp_(VideoQualityCustom-grayscale)_${title}.${outputFormat}`;
          break;
        case "invert":
          ytc.withVideoFilter(["negate"]);
          metaName = `yt-dlp_(VideoQualityCustom-invert)_${title}.${outputFormat}`;
          break;
        case "rotate90":
          ytc.withVideoFilter(["rotate=PI/2"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate90)_${title}.${outputFormat}`;
          break;
        case "rotate180":
          ytc.withVideoFilter(["rotate=PI"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate180)_${title}.${outputFormat}`;
          break;
        case "rotate270":
          ytc.withVideoFilter(["rotate=3*PI/2"]);
          metaName = `yt-dlp_(VideoQualityCustom-rotate270)_${title}.${outputFormat}`;
          break;
        case "flipHorizontal":
          ytc.withVideoFilter(["hflip"]);
          metaName = `yt-dlp_(VideoQualityCustom-flipHorizontal)_${title}.${outputFormat}`;
          break;
        case "flipVertical":
          ytc.withVideoFilter(["vflip"]);
          metaName = `yt-dlp_(VideoQualityCustom-flipVertical)_${title}.${outputFormat}`;
          break;
        default:
          ytc.withVideoFilter([]);
          metaName = `yt-dlp_(VideoQualityCustom)_${title}.${outputFormat}`;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/audio/ListAudioLowest.ts
init_cjs_shims();
var ListAudioLowestInputSchema = z3.z.object({
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
  filter: z3.z.string().optional()
});
async function ListAudioLowest(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3"
    } = ListAudioLowestInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry(metaBody.AudioTube);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.addInput(metaBody.metaTube.thumbnail);
      ytc.addOutputOption("-map", "1:0");
      ytc.addOutputOption("-map", "0:a:0");
      ytc.addOutputOption("-id3v2_version", "3");
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "bassboost":
          ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          metaName = `yt-dlp-(AudioLowest_bassboost)-${title}.${outputFormat}`;
          break;
        case "echo":
          ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          metaName = `yt-dlp-(AudioLowest_echo)-${title}.${outputFormat}`;
          break;
        case "flanger":
          ytc.withAudioFilter(["flanger"]);
          metaName = `yt-dlp-(AudioLowest_flanger)-${title}.${outputFormat}`;
          break;
        case "nightcore":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          metaName = `yt-dlp-(AudioLowest_nightcore)-${title}.${outputFormat}`;
          break;
        case "panning":
          ytc.withAudioFilter(["apulsator=hz=0.08"]);
          metaName = `yt-dlp-(AudioLowest_panning)-${title}.${outputFormat}`;
          break;
        case "phaser":
          ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
          metaName = `yt-dlp-(AudioLowest_phaser)-${title}.${outputFormat}`;
          break;
        case "reverse":
          ytc.withAudioFilter(["areverse"]);
          metaName = `yt-dlp-(AudioLowest_reverse)-${title}.${outputFormat}`;
          break;
        case "slow":
          ytc.withAudioFilter(["atempo=0.8"]);
          metaName = `yt-dlp-(AudioLowest_slow)-${title}.${outputFormat}`;
          break;
        case "speed":
          ytc.withAudioFilter(["atempo=2"]);
          metaName = `yt-dlp-(AudioLowest_speed)-${title}.${outputFormat}`;
          break;
        case "subboost":
          ytc.withAudioFilter(["asubboost"]);
          metaName = `yt-dlp-(AudioLowest_subboost)-${title}.${outputFormat}`;
          break;
        case "superslow":
          ytc.withAudioFilter(["atempo=0.5"]);
          metaName = `yt-dlp-(AudioLowest_superslow)-${title}.${outputFormat}`;
          break;
        case "superspeed":
          ytc.withAudioFilter(["atempo=3"]);
          metaName = `yt-dlp-(AudioLowest_superspeed)-${title}.${outputFormat}`;
          break;
        case "surround":
          ytc.withAudioFilter(["surround"]);
          metaName = `yt-dlp-(AudioLowest_surround)-${title}.${outputFormat}`;
          break;
        case "vaporwave":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          metaName = `yt-dlp-(AudioLowest_vaporwave)-${title}.${outputFormat}`;
          break;
        case "vibrato":
          ytc.withAudioFilter(["vibrato=f=6.5"]);
          metaName = `yt-dlp-(AudioLowest_vibrato)-${title}.${outputFormat}`;
          break;
        default:
          ytc.withAudioFilter([]);
          metaName = `yt-dlp-(AudioLowest)-${title}.${outputFormat}`;
          break;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/audio/ListAudioHighest.ts
init_cjs_shims();
var ListAudioHighestInputSchema = z3.z.object({
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
  filter: z3.z.string().optional()
});
async function ListAudioHighest(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3"
    } = ListAudioHighestInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry2(metaBody.AudioTube);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.addInput(metaBody.metaTube.thumbnail);
      ytc.addOutputOption("-map", "1:0");
      ytc.addOutputOption("-map", "0:a:0");
      ytc.addOutputOption("-id3v2_version", "3");
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "bassboost":
          ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          metaName = `yt-dlp-(AudioHighest_bassboost)-${title}.${outputFormat}`;
          break;
        case "echo":
          ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          metaName = `yt-dlp-(AudioHighest_echo)-${title}.${outputFormat}`;
          break;
        case "flanger":
          ytc.withAudioFilter(["flanger"]);
          metaName = `yt-dlp-(AudioHighest_flanger)-${title}.${outputFormat}`;
          break;
        case "nightcore":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          metaName = `yt-dlp-(AudioHighest_nightcore)-${title}.${outputFormat}`;
          break;
        case "panning":
          ytc.withAudioFilter(["apulsator=hz=0.08"]);
          metaName = `yt-dlp-(AudioHighest_panning)-${title}.${outputFormat}`;
          break;
        case "phaser":
          ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
          metaName = `yt-dlp-(AudioHighest_phaser)-${title}.${outputFormat}`;
          break;
        case "reverse":
          ytc.withAudioFilter(["areverse"]);
          metaName = `yt-dlp-(AudioHighest_reverse)-${title}.${outputFormat}`;
          break;
        case "slow":
          ytc.withAudioFilter(["atempo=0.8"]);
          metaName = `yt-dlp-(AudioHighest_slow)-${title}.${outputFormat}`;
          break;
        case "speed":
          ytc.withAudioFilter(["atempo=2"]);
          metaName = `yt-dlp-(AudioHighest_speed)-${title}.${outputFormat}`;
          break;
        case "subboost":
          ytc.withAudioFilter(["asubboost"]);
          metaName = `yt-dlp-(AudioHighest_subboost)-${title}.${outputFormat}`;
          break;
        case "superslow":
          ytc.withAudioFilter(["atempo=0.5"]);
          metaName = `yt-dlp-(AudioHighest_superslow)-${title}.${outputFormat}`;
          break;
        case "superspeed":
          ytc.withAudioFilter(["atempo=3"]);
          metaName = `yt-dlp-(AudioHighest_superspeed)-${title}.${outputFormat}`;
          break;
        case "surround":
          ytc.withAudioFilter(["surround"]);
          metaName = `yt-dlp-(AudioHighest_surround)-${title}.${outputFormat}`;
          break;
        case "vaporwave":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          metaName = `yt-dlp-(AudioHighest_vaporwave)-${title}.${outputFormat}`;
          break;
        case "vibrato":
          ytc.withAudioFilter(["vibrato=f=6.5"]);
          metaName = `yt-dlp-(AudioHighest_vibrato)-${title}.${outputFormat}`;
          break;
        default:
          ytc.withAudioFilter([]);
          metaName = `yt-dlp-(AudioHighest)-${title}.${outputFormat}`;
          break;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/audio/ListAudioQualityCustom.ts
init_cjs_shims();
var ListAudioQualityCustomInputSchema = z3.z.object({
  filter: z3.z.string().optional(),
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  quality: z3.z.enum(["high", "medium", "low", "ultralow"]),
  outputFormat: z3.z.enum(["mp3", "ogg", "flac", "aiff"]).optional()
});
async function ListAudioQualityCustom(input) {
  try {
    const {
      filter: filter2,
      stream: stream$1,
      quality,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3"
    } = ListAudioQualityCustomInputSchema.parse(input);
    let parseList = [];
    let metaName = "";
    let results = [];
    const uniqueVideoIds = /* @__PURE__ */ new Set();
    for (const url of playlistUrls) {
      const metaList = await scrape(url);
      if (metaList === null || !metaList) {
        return {
          message: "Unable to get response from YouTube...",
          status: 500
        };
      }
      const parsedMetaList = await JSON.parse(metaList);
      const uniqueVideos = parsedMetaList.Videos.filter(
        (video) => !uniqueVideoIds.has(video.id)
      );
      parseList.push(...uniqueVideos);
      uniqueVideos.forEach(
        (video) => uniqueVideoIds.add(video.id)
      );
    }
    console.log(
      colors17__default.default.bold.green("INFO:"),
      "\u{1F381}Total Unique Videos:",
      parseList.length
    );
    for (const i of parseList) {
      const TubeBody = await scrape(i.videoId);
      if (TubeBody === null)
        continue;
      const parseTube = await JSON.parse(TubeBody);
      const metaBody = await Engine({
        query: parseTube.Link
      });
      if (metaBody === null)
        continue;
      const newBody = metaBody.AudioTube.filter(
        (op) => op.meta_dl.formatnote === quality
      );
      if (!newBody || newBody === null)
        continue;
      const title = metaBody.metaTube.title.replace(
        /[^a-zA-Z0-9_]+/g,
        "-"
      );
      const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
      if (!fs__namespace.existsSync(metaFold))
        fs__namespace.mkdirSync(metaFold, { recursive: true });
      const metaEntry = await bigEntry2(newBody);
      if (metaEntry === null)
        continue;
      const ytc = fluentffmpeg__default.default();
      ytc.addInput(metaEntry.meta_dl.mediaurl);
      ytc.addInput(metaBody.metaTube.thumbnail);
      ytc.addOutputOption("-map", "1:0");
      ytc.addOutputOption("-map", "0:a:0");
      ytc.addOutputOption("-id3v2_version", "3");
      ytc.format(outputFormat);
      ytc.on("start", (command) => {
        if (verbose)
          console.log(command);
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("end", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("close", () => {
        progressBar_default({
          currentKbps: void 0,
          timemark: void 0,
          percent: void 0
        });
      });
      ytc.on("progress", (prog) => {
        progressBar_default({
          currentKbps: prog.currentKbps,
          timemark: prog.timemark,
          percent: prog.percent
        });
      });
      switch (filter2) {
        case "bassboost":
          ytc.withAudioFilter(["bass=g=10,dynaudnorm=f=150"]);
          metaName = `yt-dlp-(AudioQualityCustom_bassboost)-${title}.${outputFormat}`;
          break;
        case "echo":
          ytc.withAudioFilter(["aecho=0.8:0.9:1000:0.3"]);
          metaName = `yt-dlp-(AudioQualityCustom_echo)-${title}.${outputFormat}`;
          break;
        case "flanger":
          ytc.withAudioFilter(["flanger"]);
          metaName = `yt-dlp-(AudioQualityCustom_flanger)-${title}.${outputFormat}`;
          break;
        case "nightcore":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*1.25"]);
          metaName = `yt-dlp-(AudioQualityCustom_nightcore)-${title}.${outputFormat}`;
          break;
        case "panning":
          ytc.withAudioFilter(["apulsator=hz=0.08"]);
          metaName = `yt-dlp-(AudioQualityCustom_panning)-${title}.${outputFormat}`;
          break;
        case "phaser":
          ytc.withAudioFilter(["aphaser=in_gain=0.4"]);
          metaName = `yt-dlp-(AudioQualityCustom_phaser)-${title}.${outputFormat}`;
          break;
        case "reverse":
          ytc.withAudioFilter(["areverse"]);
          metaName = `yt-dlp-(AudioQualityCustom_reverse)-${title}.${outputFormat}`;
          break;
        case "slow":
          ytc.withAudioFilter(["atempo=0.8"]);
          metaName = `yt-dlp-(AudioQualityCustom_slow)-${title}.${outputFormat}`;
          break;
        case "speed":
          ytc.withAudioFilter(["atempo=2"]);
          metaName = `yt-dlp-(AudioQualityCustom_speed)-${title}.${outputFormat}`;
          break;
        case "subboost":
          ytc.withAudioFilter(["asubboost"]);
          metaName = `yt-dlp-(AudioQualityCustom_subboost)-${title}.${outputFormat}`;
          break;
        case "superslow":
          ytc.withAudioFilter(["atempo=0.5"]);
          metaName = `yt-dlp-(AudioQualityCustom_superslow)-${title}.${outputFormat}`;
          break;
        case "superspeed":
          ytc.withAudioFilter(["atempo=3"]);
          metaName = `yt-dlp-(AudioQualityCustom_superspeed)-${title}.${outputFormat}`;
          break;
        case "surround":
          ytc.withAudioFilter(["surround"]);
          metaName = `yt-dlp-(AudioQualityCustom_surround)-${title}.${outputFormat}`;
          break;
        case "vaporwave":
          ytc.withAudioFilter(["aresample=48000,asetrate=48000*0.8"]);
          metaName = `yt-dlp-(AudioQualityCustom_vaporwave)-${title}.${outputFormat}`;
          break;
        case "vibrato":
          ytc.withAudioFilter(["vibrato=f=6.5"]);
          metaName = `yt-dlp-(AudioQualityCustom_vibrato)-${title}.${outputFormat}`;
          break;
        default:
          ytc.withAudioFilter([]);
          metaName = `yt-dlp-(AudioQualityCustom)-${title}.${outputFormat}`;
          break;
      }
      switch (true) {
        case stream$1:
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
          break;
        default:
          await new Promise((resolve, reject2) => {
            ytc.output(path__namespace.join(metaFold, metaName)).on("end", () => resolve()).on("error", reject2).run();
          });
          break;
      }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/mix/ListAudioVideoLowest.ts
init_cjs_shims();

// node_modules/async/dist/async.mjs
init_cjs_shims();
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
function stripComments(string3) {
  let stripped = "";
  let index2 = 0;
  let endBlockComment = string3.indexOf("*/");
  while (index2 < string3.length) {
    if (string3[index2] === "/" && string3[index2 + 1] === "/") {
      let endIndex = string3.indexOf("\n", index2);
      index2 = endIndex === -1 ? string3.length : endIndex;
    } else if (endBlockComment !== -1 && string3[index2] === "/" && string3[index2 + 1] === "*") {
      let endIndex = string3.indexOf("*/", index2);
      if (endIndex !== -1) {
        index2 = endIndex + 2;
        endBlockComment = string3.indexOf("*/", index2);
      } else {
        stripped += string3[index2];
        index2++;
      }
    } else {
      stripped += string3[index2];
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
    callback(null, results.sort((a2, b) => a2.index - b.index).map((v) => v.value));
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
    var a2 = left.criteria, b = right.criteria;
    return a2 < b ? -1 : a2 > b ? 1 : 0;
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
var ListAudioVideoLowestInputSchema = z3.z.object({
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function ListAudioVideoLowest(input) {
  try {
    const {
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4"
    } = ListAudioVideoLowestInputSchema.parse(input);
    switch (true) {
      case playlistUrls.length === 0:
        return [
          {
            message: "playlistUrls parameter cannot be empty",
            status: 500
          }
        ];
      case !Array.isArray(playlistUrls):
        return [
          {
            message: "playlistUrls parameter must be an array",
            status: 500
          }
        ];
      case !playlistUrls.every(
        (url) => typeof url === "string" && url.trim().length > 0
      ):
        return [
          {
            message: "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.",
            status: 500
          }
        ];
      default:
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
                let metaName = `yt-dlp_(AudioVideoLowest)_${title}.${outputFormat}`;
                const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
                if (!fs__namespace.existsSync(metaFold))
                  fs__namespace.mkdirSync(metaFold, { recursive: true });
                const ytc = fluentffmpeg__default.default();
                const AmetaEntry = await bigEntry(metaBody.AudioTube);
                const VmetaEntry = await bigEntry(metaBody.VideoTube);
                if (AmetaEntry === null || VmetaEntry === null)
                  return;
                ytc.addInput(VmetaEntry.meta_dl.mediaurl);
                ytc.addInput(AmetaEntry.meta_dl.mediaurl);
                ytc.format(outputFormat);
                ytc.on("start", (command) => {
                  if (verbose)
                    console.log(command);
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("end", () => {
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("close", () => {
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("progress", (prog) => {
                  progressBar_default({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent
                  });
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
                  message: colors17__default.default.bold.red("ERROR: ") + video.title
                });
              }
            }
          );
          return results;
        }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/pipes/mix/ListAudioVideoHighest.ts
init_cjs_shims();
var ListAudioVideoHighestInputSchema = z3.z.object({
  stream: z3.z.boolean().optional(),
  verbose: z3.z.boolean().optional(),
  folderName: z3.z.string().optional(),
  playlistUrls: z3.z.array(z3.z.string()),
  outputFormat: z3.z.enum(["mp4", "avi", "mov"]).optional()
});
async function ListAudioVideoHighest(input) {
  try {
    const {
      stream: stream$1,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp4"
    } = ListAudioVideoHighestInputSchema.parse(input);
    switch (true) {
      case playlistUrls.length === 0:
        return [
          {
            message: "playlistUrls parameter cannot be empty",
            status: 500
          }
        ];
      case !Array.isArray(playlistUrls):
        return [
          {
            message: "playlistUrls parameter must be an array",
            status: 500
          }
        ];
      case !playlistUrls.every(
        (url) => typeof url === "string" && url.trim().length > 0
      ):
        return [
          {
            message: "Invalid playlistUrls[] parameter. Expecting a non-empty array of strings.",
            status: 500
          }
        ];
      default:
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
                let metaName = `yt-dlp_(AudioVideoHighest)_${title}.${outputFormat}`;
                const metaFold = folderName ? path__namespace.join(process.cwd(), folderName) : process.cwd();
                if (!fs__namespace.existsSync(metaFold))
                  fs__namespace.mkdirSync(metaFold, { recursive: true });
                const ytc = fluentffmpeg__default.default();
                const AmetaEntry = await bigEntry2(metaBody.AudioTube);
                const VmetaEntry = await bigEntry2(metaBody.VideoTube);
                if (AmetaEntry === null || VmetaEntry === null)
                  return;
                ytc.addInput(VmetaEntry.meta_dl.mediaurl);
                ytc.addInput(AmetaEntry.meta_dl.mediaurl);
                ytc.format(outputFormat);
                ytc.on("start", (command) => {
                  if (verbose)
                    console.log(command);
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("end", () => {
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("close", () => {
                  progressBar_default({
                    currentKbps: void 0,
                    timemark: void 0,
                    percent: void 0
                  });
                });
                ytc.on("progress", (prog) => {
                  progressBar_default({
                    currentKbps: prog.currentKbps,
                    timemark: prog.timemark,
                    percent: prog.percent
                  });
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
                  message: colors17__default.default.bold.red("ERROR: ") + video.title
                });
              }
            }
          );
          return results;
        }
    }
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return [
        {
          message: "Validation error: " + error.errors.map((e) => e.message).join(", "),
          status: 500
        }
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500
        }
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500
        }
      ];
    }
  }
}

// app/index.ts
var ytdlp2 = {
  info: {
    help,
    search,
    extract,
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
      custom: VideoLowest2
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
var app_default = ytdlp2;
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
      console.error(colors17__default.default.green("Installed Version: yt-dlp@" + version));
      break;
    case "help":
    case "h":
      app_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors17__default.default.red(error));
        process.exit();
      });
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.info.extract({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "search-yt":
    case "s":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.info.search({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "list-formats":
    case "f":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.info.list_formats({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "get-video-data":
    case "vi":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.info.get_video_data({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.audio.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.audio.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.audio_video.single.highest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      } else
        app_default.audio_video.single.lowest({
          query: proTube.query
        }).then((data) => {
          console.log(data);
          process.exit();
        }).catch((error) => {
          console.error(colors17__default.default.red(error));
          process.exit();
        });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors17__default.default.red("error: no format"));
      }
      app_default.audio.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors17__default.default.red(error));
        process.exit();
      });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors17__default.default.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors17__default.default.red("error: no format"));
      }
      app_default.video.single.custom({
        query: proTube.query,
        quality: proTube.format
      }).then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors17__default.default.red(error));
        process.exit();
      });
      break;
    default:
      app_default.info.help().then((data) => {
        console.log(data);
        process.exit();
      }).catch((error) => {
        console.error(colors17__default.default.red(error));
        process.exit();
      });
      break;
  }
};
if (!proTube._[0]) {
  app_default.info.help().then((data) => {
    console.log(data);
    process.exit();
  }).catch((error) => {
    console.error(colors17__default.default.red(error));
    process.exit();
  });
} else
  program();
