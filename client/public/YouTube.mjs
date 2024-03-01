var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) =>
      x.done
        ? resolve(x.value)
        : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

import os from "os";
import fs from "fs";
import fs2 from "fs";
import path from "path";
import ytdl from "ytdl-core";
import process from "process";
import NodeID3 from "node-id3";
import cp from "child_process";
import readline from "readline";
import ffmpeg from "ffmpeg-static";

function removeParenthesizedText(s) {
  return s.replace(/\s*[([].*?[)\]]\s*/g, "");
}
function isDirectory(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}
function userInput(prompt, defaultInput) {
  return __async(this, null, function* () {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve, reject) => {
      rl.question(prompt, (response) => {
        rl.close();
        if (response) {
          resolve(response);
        } else {
          reject(new YtdlMp3Error("Invalid response: " + response));
        }
      });
      rl.write(defaultInput || "");
    });
  });
}
var YtdlMp3Error = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "YtdlMp3Error";
  }
};

// src/FormatConverter.ts
var FormatConverter = class {
  constructor() {
    if (!ffmpeg) throw new YtdlMp3Error("Failed to resolve ffmpeg binary");
    this.ffmpegBinary = ffmpeg;
  }
  videoToAudio(videoData, outputFile) {
    if (fs2.existsSync(outputFile)) {
      throw new YtdlMp3Error(`Output file already exists: ${outputFile}`);
    }
    cp.execSync(
      `${this.ffmpegBinary} -loglevel 24 -i pipe:0 -vn -sn -c:a mp3 -ab 192k ${outputFile}`,
      {
        input: videoData,
      }
    );
  }
};

// src/SongTagsSearch.ts
import axios from "axios";
var SongTagsSearch = class {
  constructor(videoDetails) {
    this.searchTerm = removeParenthesizedText(videoDetails.title);
    this.url = new URL("https://itunes.apple.com/search?");
    this.url.searchParams.set("media", "music");
    this.url.searchParams.set("term", this.searchTerm);
  }
  search(verify = false) {
    return __async(this, null, function* () {
      console.log(
        `Attempting to query iTunes API with the following search term: ${this.searchTerm}`
      );
      const searchResults = yield this.fetchResults();
      const result = verify
        ? yield this.getVerifiedResult(searchResults)
        : searchResults[0];
      const artworkUrl = result.artworkUrl100.replace(
        "100x100bb.jpg",
        "600x600bb.jpg"
      );
      const albumArt = yield this.fetchAlbumArt(artworkUrl);
      return {
        title: result.trackName,
        artist: result.artistName,
        image: {
          mime: "image/png",
          type: {
            id: 3,
            name: "front cover",
          },
          description: "Album Art",
          imageBuffer: albumArt,
        },
      };
    });
  }
  fetchResults() {
    return __async(this, null, function* () {
      const response = yield axios.get(this.url.href).catch((error) => {
        var _a;
        if ((_a = error.response) == null ? void 0 : _a.status) {
          throw new YtdlMp3Error(
            `Call to iTunes API returned status code ${error.response.status}`
          );
        }
        throw new YtdlMp3Error(
          "Call to iTunes API failed and did not return a status"
        );
      });
      if (response.data.resultCount === 0) {
        throw new YtdlMp3Error("Call to iTunes API did not return any results");
      }
      return response.data.results;
    });
  }
  getVerifiedResult(searchResults) {
    return __async(this, null, function* () {
      for (const result of searchResults) {
        console.log("The following tags were extracted from iTunes:");
        console.log("Title: " + result.trackName);
        console.log("Artist: " + result.artistName);
        const validResponses = ["Y", "YES", "N", "NO"];
        let userSelection = (yield userInput(
          "Please verify (Y/N): "
        )).toUpperCase();
        while (!validResponses.includes(userSelection)) {
          console.error("Invalid selection, try again!");
          userSelection = (yield userInput(
            "Please verify (Y/N): "
          )).toUpperCase();
        }
        if (userSelection === "Y" || userSelection === "YES") {
          return result;
        }
      }
      throw new YtdlMp3Error("End of results");
    });
  }
  fetchAlbumArt(url) {
    return __async(this, null, function* () {
      return axios
        .get(url, { responseType: "arraybuffer" })
        .then((response) => Buffer.from(response.data, "binary"))
        .catch(() => {
          throw new YtdlMp3Error(
            "Failed to fetch album art from endpoint: " + url
          );
        });
    });
  }
};

// src/Downloader.ts
var _Downloader = class _Downloader {
  constructor({ outputDir, getTags, verifyTags }) {
    this.outputDir =
      outputDir != null ? outputDir : _Downloader.defaultDownloadsDir;
    this.getTags = Boolean(getTags);
    this.verifyTags = Boolean(verifyTags);
  }
  downloadSong(url) {
    return __async(this, null, function* () {
      if (!isDirectory(this.outputDir)) {
        throw new YtdlMp3Error(`Not a directory: ${this.outputDir}`);
      }
      const videoInfo = yield ytdl.getInfo(url).catch((error) => {
        throw new YtdlMp3Error(
          `Failed to fetch info for video with URL: ${url}`,
          {
            cause: error,
          }
        );
      });
      const formatConverter = new FormatConverter();
      const songTagsSearch = new SongTagsSearch(videoInfo.videoDetails);
      const outputFile = this.getOutputFile(videoInfo.videoDetails.title);
      const videoData = yield this.downloadVideo(videoInfo);
      formatConverter.videoToAudio(videoData, outputFile);
      if (this.getTags) {
        const songTags = yield songTagsSearch.search(this.verifyTags);
        NodeID3.write(songTags, outputFile);
      }
      console.log(`Done! Output file: ${outputFile}`);
      return outputFile;
    });
  }
  /** Returns the content from the video as a buffer */
  downloadVideo(videoInfo) {
    return __async(this, null, function* () {
      const buffers = [];
      const stream = ytdl.downloadFromInfo(videoInfo, {
        quality: "highestaudio",
      });
      return new Promise((resolve, reject) => {
        stream.on("data", (chunk) => {
          buffers.push(chunk);
        });
        stream.on("end", () => {
          resolve(Buffer.concat(buffers));
        });
        stream.on("error", (err) => {
          reject(err);
        });
      });
    });
  }
  /** Returns the absolute path to the audio file to be downloaded */
  getOutputFile(videoTitle) {
    const baseFileName = removeParenthesizedText(videoTitle)
      .replace(/[^a-z0-9]/gi, "_")
      .split("_")
      .filter((element) => element)
      .join("_")
      .toLowerCase();
    return path.join(this.outputDir, baseFileName + ".mp3");
  }
};
_Downloader.defaultDownloadsDir = path.join(os.homedir(), "Downloads");
var Downloader = _Downloader;
export { Downloader, FormatConverter, SongTagsSearch, YtdlMp3Error };

async function downloadAndTagSong(
  url,
  outputDir = process.cwd(),
  getTags = true,
  verifyTags = true
) {
  try {
    const downloader = new Downloader({ outputDir, getTags, verifyTags });
    const outputFile = await downloader.downloadSong(url);
    console.log(
      `Song downloaded and tagged successfully! Output file: ${outputFile}`
    );
  } catch (error) {
    console.error(`Error downloading and tagging song: ${error.message}`);
  }
}

downloadAndTagSong("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
