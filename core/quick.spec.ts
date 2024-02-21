import * as fs from "fs";
import async from "async";
import colors from "colors";
import * as path from "path";
import ytCore from "./base/agent";
import { z, ZodError } from "zod";
import { randomUUID } from "crypto";
import bigEntry from "./base/bigEntry";
import fluentffmpeg from "fluent-ffmpeg";
import { Readable, Writable } from "stream";
import progressBar from "./base/progressBar";
import type ErrorResult from "./interface/ErrorResult";
import get_playlist from "./pipes/command/get_playlist";
import type StreamResult from "./interface/StreamResult";
import type AudioFilters from "./interface/AudioFilters";
import type SuccessResult from "./interface/SuccessResult";

const metaSpin = randomUUID().toString();
type AudioFormat = "mp3" | "ogg" | "flac" | "aiff";
interface metaVideo {
  title: string;
  description: string;
  url: string;
  timestamp: string;
  views: number;
  uploadDate: string;
  ago: string;
  image: string;
  thumbnail: string;
  authorName: string;
  authorUrl: string;
}
interface ListAudioHighestOC {
  stream?: boolean;
  verbose?: boolean;
  folderName?: string;
  playlistUrls: string[];
  outputFormat?: AudioFormat;
  filter?: keyof AudioFilters;
}
type ListAudioHighestType = SuccessResult | ErrorResult | StreamResult;

const ListAudioHighestInputSchema = z.object({
  filter: z.string().optional(),
  stream: z.boolean().optional(),
  verbose: z.boolean().optional(),
  folderName: z.string().optional(),
  playlistUrls: z.array(z.string()),
  outputFormat: z.enum(["mp3", "ogg", "flac", "aiff"]).optional(),
});

export default async function ListAudioHighest(
  input: ListAudioHighestOC
): Promise<ListAudioHighestType[]> {
  try {
    const {
      filter,
      stream,
      verbose,
      folderName,
      playlistUrls,
      outputFormat = "mp3",
    } = ListAudioHighestInputSchema.parse(input);
    const videos = await get_playlist({
      playlistUrls,
    });
    if (!videos) {
      return [
        {
          message: "Unable to get response from YouTube...",
          status: 500,
        },
      ];
    }
    const results: ListAudioHighestType[] = [];
    await async.eachSeries(videos as metaVideo[], async (video: metaVideo) => {
      try {
        const metaBody = await ytCore({ query: video.url });
        if (!metaBody) {
          throw new Error("Unable to get response from YouTube...");
        }
        let metaName: string = "";
        const title: string = metaBody.metaTube.title.replace(
          /[^a-zA-Z0-9_]+/g,
          "-"
        );
        const metaFold = folderName
          ? path.join(process.cwd(), folderName)
          : process.cwd();
        if (!fs.existsSync(metaFold))
          fs.mkdirSync(metaFold, { recursive: true });
        const metaEntry = bigEntry(metaBody.AudioTube);
        const ytc = fluentffmpeg();
        ytc.addInput(metaEntry.meta_dl.mediaurl);
        ytc.addInput(metaBody.metaTube.thumbnail);
        ytc.addOutputOption("-map", "1:0");
        ytc.addOutputOption("-map", "0:a:0");
        ytc.addOutputOption("-id3v2_version", "3");
        ytc.format(outputFormat);
        ytc.on("start", (cmd) => {
          if (verbose) console.log(cmd);
          progressBar(0, metaSpin);
        });
        ytc.on("end", () => progressBar(100, metaSpin));
        ytc.on("close", () => progressBar(100, metaSpin));
        ytc.on("progress", ({ percent }) => progressBar(percent, metaSpin));
        switch (filter) {
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
        if (stream) {
          const readStream = new Readable({
            read() {},
          });
          const writeStream = new Writable({
            write(chunk, _encoding, callback) {
              readStream.push(chunk);
              callback();
            },
            final(callback) {
              readStream.push(null);
              callback();
            },
          });
          ytc.pipe(writeStream, { end: true });
          results.push({
            stream: readStream,
            filename: folderName ? path.join(metaFold, metaName) : metaName,
          });
        } else {
          await new Promise<void>((resolve, reject) => {
            ytc
              .output(path.join(metaFold, metaName))
              .on("end", () => resolve())
              .on("error", reject)
              .run();
          });
        }
      } catch (error) {
        results.push({
          status: 500,
          message: colors.bold.red("ERROR: ") + video.title,
        });
      }
    });
    return results;
  } catch (error) {
    if (error instanceof ZodError) {
      return [
        {
          message:
            "Validation error: " +
            error.errors.map((e) => e.message).join(", "),
          status: 500,
        },
      ];
    } else if (error instanceof Error) {
      return [
        {
          message: error.message,
          status: 500,
        },
      ];
    } else {
      return [
        {
          message: "Internal server error",
          status: 500,
        },
      ];
    }
  }
}

const playlistUrls = [
  "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
];
(async () => {
  try {
    await async.auto({
      runTest: async () => {
        const metaTube = await ListAudioHighest({
          outputFormat: "mp3",
          folderName: "temp",
          stream: false,
          playlistUrls,
        });
        console.log(metaTube);
      },
    });
  } catch (metaError) {
    console.error(metaError);
    process.exit(1);
  }
})();

// =====================================[ scrapping ]===========================================
// console.clear();
// import colors from "colors";
// import Spinnies from "spinnies";
// import { randomUUID } from "crypto";
// import { chromium } from "playwright";

// const spinnies = new Spinnies();
// const metaSpin = randomUUID().toString();

// async function YouTubeScraper(query: string | number | boolean) {
// spinnies.add(metaSpin, { text: colors.yellow("Spinning Chromium...") });
// const browser = await chromium.launch({ headless: true });
// const context = await browser.newContext({ ignoreHTTPSErrors: true });
// const page = await context.newPage();
// const searchUrl =
// "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
// await page.goto(searchUrl);
// spinnies.update(metaSpin, {
// text: colors.yellow("Hydrating dynamic content..."),
// });
// let videos: string | any[] = [];
// while (videos.length < 100) {
// await page.waitForSelector(".ytd-video-renderer");
// const newVideos = await page.$$("ytd-video-renderer");
// videos = [...videos, ...newVideos];
// await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
// await page.waitForTimeout(4000);
// }
// const data = [];
// for (const vid of videos) {
// const title = await vid.$eval(
// "#video-title",
// (el: { textContent: string }) => el.textContent.trim()
// );
// const videoLink: any =
// "https://www.youtube.com" +
// (await vid.$eval("a", (el: { getAttribute: (arg0: string) => any }) =>
// el.getAttribute("href")
// ));
// const videoId = videoLink.match(
// /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&]+)/
// )[1];
// const authorContainer = await vid.$(".ytd-channel-name a");
// const author = await authorContainer
// .getProperty("textContent")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// const authorUrl = await authorContainer
// .getProperty("href")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// let description = "";
// const descriptionElement = await vid.$(".metadata-snippet-text");
// if (descriptionElement) {
// description = await descriptionElement
// .getProperty("innerText")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// }
// const viewsContainer = await vid.$(
// ".inline-metadata-item.style-scope.ytd-video-meta-block"
// );
// const views = await viewsContainer
// .getProperty("innerText")
// .then((property: { jsonValue: () => any }) => property.jsonValue());
// data.push({
// title,
// author,
// videoId,
// authorUrl,
// videoLink,
// thumbnailUrl:
// "https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg",
// description,
// views: views.replace(/ views/g, ""),
// });
// }
// await browser.close();
// spinnies.succeed(metaSpin, {
// text: colors.green("Total videos: ") + videos.length,
// });
// return data;
// }

// YouTubeScraper("ZULFAAN (Official Audio) SARRB | Starboy X")
// .then((data) => console.log(data))
// .catch((error) => console.error(error));
