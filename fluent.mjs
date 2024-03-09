// import puppeteer from "puppeteer";

// async function proTube({ videoUrl }) {
// const browser = await puppeteer.launch({
// headless: false,
// args: [
// "--no-zygote",
// "--incognito",
// "--no-sandbox",
// "--enable-automation",
// "--disable-dev-shm-usage",
// ],
// });
// const page = await browser.newPage();
// await page.setUserAgent(
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
// );
// await page.goto(videoUrl);
// await page.waitForSelector("script");
// const metaTube = await page.evaluate((window) => {
// const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
// if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
// const streamingData = ytInitialPlayerResponse.streamingData;
// const formats = streamingData.formats || [];
// const pops = formats.concat(streamingData.adaptiveFormats || []);
// return pops.map((ipop) => ipop);
// } else return null;
// });
// if (page) await page.close();
// if (browser) await browser.close();
// if (metaTube) {
// const AudioStore = [];
// const VideoStore = [];
// for (const p of metaTube) {
// if (p.mimeType && p.mimeType.includes("audio")) AudioStore.push(p);
// else if (p.mimeType && p.mimeType.includes("video")) VideoStore.push(p);
// }
// return { AudioStore, VideoStore };
// } else return undefined;
// }

// (async () => {
// const metaTube = await proTube({
// videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
// });
// console.log(metaTube.VideoStore);
// console.log(metaTube.AudioStore);
// })();
// ======================================================================
console.clear();
import * as path from "path";
import { promisify } from "util";
import { pipeline } from "stream";
import * as fs from "fs/promises";
import puppeteer from "puppeteer";
const streamPipeline = promisify(pipeline);

const extractAdaptiveFormats = (pageContent, mimeTypeFilter) => {
  const regex = /(?<="adaptiveFormats":\[).+?(?=\])/;
  const match = pageContent.match(regex);
  if (!match) return [];
  const formats = JSON.parse(`[${match[0]}]`);
  return formats
    .filter((format) => format.mimeType.includes(mimeTypeFilter))
    .map((format) => format.url);
};

const scrapeYouTubeVideo = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
    const videoTitle = await page.$eval("#info h1", (node) => node.textContent);
    const pageContent = await page.content();
    const audioSources = extractAdaptiveFormats(pageContent, "audio/");
    const videoSources = extractAdaptiveFormats(pageContent, "video/");
    return { videoTitle, audioSources, videoSources };
  } catch (error) {
    console.error("Error scraping YouTube video:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

const saveResultToFile = async (result, filePath) => {
  const formattedResult = JSON.stringify(result, null, 2);
  await fs.writeFile(filePath, formattedResult);
};

const downloadSources = async (sources, outputDir) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    for (const sourceUrl of sources) {
      await page.goto(sourceUrl, { waitUntil: "networkidle0" });
      const buffer = await page.buffer();
      const fileName = path.basename(new URL(sourceUrl).pathname);
      const filePath = path.join(outputDir, fileName);
      await streamPipeline(buffer, fs.createWriteStream(filePath));
      console.log(`Downloaded ${filePath}`);
    }
  } catch (error) {
    console.error("Error downloading sources:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

const main = async () => {
  const videoUrl = "https://www.youtube.com/watch?v=AbFnsaDQMYQ";
  const outputDir = path.join("output");
  const outputFilePath = path.join(outputDir, "output.json");
  try {
    const result = await scrapeYouTubeVideo(videoUrl);
    await fs.mkdir(outputDir, { recursive: true });
    await saveResultToFile(result, outputFilePath);
    console.log(`Results saved to ${outputFilePath}`);
    await downloadSources(result.audioSources, outputDir);
    await downloadSources(result.videoSources, outputDir);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
