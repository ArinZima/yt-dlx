import os from "os";
import fs from "fs";
import fs2 from "fs";
import path from "path";
import axios from "axios";
import ytdl from "ytdl-core";
import process from "process";
import NodeID3 from "node-id3";
import cp from "child_process";
import ffmpeg from "ffmpeg-static";

function removeParenthesizedText(s) {
  return s.replace(/\s*[([].*?[)\]]\s*/g, "");
}

function isDirectory(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

function getFormatConverter() {
  if (!ffmpeg) throw new YtdlMp3Error("Failed to resolve ffmpeg binary");
  const ffmpegBinary = ffmpeg;
  function videoToAudio(videoData, outputFile) {
    if (fs2.existsSync(outputFile)) {
      throw new YtdlMp3Error(`Output file already exists: ${outputFile}`);
    }
    cp.execSync(
      `${ffmpegBinary} -loglevel 24 -i pipe:0 -vn -sn -c:a mp3 -ab 192k ${outputFile}`,
      {
        input: videoData,
      }
    );
  }
  return {
    videoToAudio,
  };
}

function getSongTagsSearch(videoDetails) {
  const searchTerm = removeParenthesizedText(videoDetails.title);
  const url = new URL("https://itunes.apple.com/search?");
  url.searchParams.set("media", "music");
  url.searchParams.set("term", searchTerm);
  console.log(url);

  async function search() {
    console.log(
      `Attempting to query iTunes API with the following search term: ${searchTerm}`
    );
    const searchResults = await fetchResults();
    const result = searchResults[0];

    const artworkUrl = result.artworkUrl100.replace(
      "100x100bb.jpg",
      "600x600bb.jpg"
    );
    const albumArt = await fetchAlbumArt(artworkUrl);

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
  }

  async function fetchResults() {
    const response = await axios.get(url.href).catch((error) => {
      if (error.response?.status) {
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
  }

  async function fetchAlbumArt(url) {
    console.log(url);
    return axios
      .get(url, { responseType: "arraybuffer" })
      .then((response) => Buffer.from(response.data, "binary"))
      .catch(() => {
        throw new YtdlMp3Error(
          "Failed to fetch album art from endpoint: " + url
        );
      });
  }

  return {
    search,
  };
}

function getDownloader({ outputDir, getTags, verifyTags }) {
  const defaultDownloadsDir = path.join(os.homedir(), "Downloads");
  outputDir = outputDir != null ? outputDir : defaultDownloadsDir;
  getTags = Boolean(getTags);
  verifyTags = Boolean(verifyTags);
  async function downloadSong(url) {
    if (!isDirectory(outputDir)) {
      throw new YtdlMp3Error(`Not a directory: ${outputDir}`);
    }
    const videoInfo = await ytdl.getInfo(url).catch((error) => {
      throw new YtdlMp3Error(
        `Failed to fetch info for video with URL: ${url}`,
        {
          cause: error,
        }
      );
    });
    const formatConverter = getFormatConverter();
    const songTagsSearch = getSongTagsSearch(videoInfo.videoDetails);
    const outputFile = getOutputFile(videoInfo.videoDetails.title);
    const videoData = await downloadVideo(videoInfo);
    formatConverter.videoToAudio(videoData, outputFile);
    if (getTags) {
      const songTags = await songTagsSearch.search(verifyTags);
      NodeID3.write(songTags, outputFile);
    }
    console.log(`Done! Output file: ${outputFile}`);
    return outputFile;
  }
  function downloadVideo(videoInfo) {
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
  }

  function getOutputFile(videoTitle) {
    const baseFileName = removeParenthesizedText(videoTitle)
      .replace(/[^a-z0-9]/gi, "_")
      .split("_")
      .filter((element) => element)
      .join("_")
      .toLowerCase();

    return path.join(outputDir, baseFileName + ".mp3");
  }

  return {
    downloadSong,
  };
}

async function downloadAndTagSong(
  url,
  outputDir = process.cwd(),
  getTags = true,
  verifyTags = true
) {
  try {
    const downloader = getDownloader({ outputDir, getTags, verifyTags });
    const outputFile = await downloader.downloadSong(url);
    console.log(
      `Song downloaded and tagged successfully! Output file: ${outputFile}`
    );
  } catch (error) {
    console.error(`Error downloading and tagging song: ${error.message}`);
  }
}

downloadAndTagSong("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
