import fs from "fs";
import async from "async";
import colors from "colors";
import { load } from "cheerio";
import getId from "get-video-id";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";

const spinnies = new spinClient();
async function TypeTube(query, type = "TypeSearch") {
  const browser = await puppeteer.launch({
    userDataDir: "other",
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  );
  let TypeVideoData = [];
  let TypeSearchData = [];
  let url, screenshot, content, $, videoElements;
  const spin = randomUUID();
  switch (type) {
    case "TypeMovie":
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query) +
        "&sp=EgIQBA%253D%253D";
      await page.goto(url);
      screenshot = await page.screenshot({
        path: "TypeMovie.png",
      });
      fs.writeFileSync("TypeMovie.png", screenshot);
      await page.close();
      await browser.close();
      break;
    case "TypeChannel":
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query) +
        "&sp=EgIQAg%253D%253D";
      await page.goto(url);
      screenshot = await page.screenshot({
        path: "TypeChannel.png",
      });
      fs.writeFileSync("TypeChannel.png", screenshot);
      await page.close();
      await browser.close();
      break;
    case "TypeVideo":
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "booting chromium...",
      });
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query) +
        "&sp=EgIIAQ%253D%253D";
      await page.goto(url);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      screenshot = await page.screenshot({
        path: "TypeVideo.png",
      });
      fs.writeFileSync("TypeVideo.png", screenshot);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "took screenshot...",
      });
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      content = await page.content();
      $ = load(content);
      videoElements = $(
        "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
      );
      videoElements.each(async (_, vide) => {
        const videoId = getId(
          "https://www.youtube.com" + $(vide).find("a").attr("href")
        ).id;
        const authorContainer = $(vide).find(".ytd-channel-name a");
        const uploadedOnElement = $(vide).find(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        TypeVideoData.push({
          title: $(vide).find("#video-title").text().trim() || undefined,
          views:
            $(vide)
              .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
              .filter((_, vide) => $(vide).text().includes("views"))
              .text()
              .trim()
              .replace(/ views/g, "") || undefined,
          author: authorContainer.text().trim() || undefined,
          videoId,
          uploadOn:
            uploadedOnElement.length >= 2
              ? $(uploadedOnElement[1]).text().trim()
              : undefined,
          authorUrl:
            "https://www.youtube.com" + authorContainer.attr("href") ||
            undefined,
          videoLink: "https://www.youtube.com/watch?v=" + videoId,
          thumbnailUrls: [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/default.jpg`,
          ],
          description:
            $(vide).find(".metadata-snippet-text").text().trim() || undefined,
        });
      });
      console.log(TypeSearchData);
      spinnies.succeed(spin, {
        text:
          colors.yellow("@info: ") +
          colors.white("scrapping done, total videos " + TypeSearchData.length),
      });
      await page.close();
      await browser.close();
      break;
    case "TypePlaylist":
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query) +
        "&sp=EgIQAw%253D%253D";
      await page.goto(url);
      screenshot = await page.screenshot({
        path: "TypePlaylist.png",
      });
      fs.writeFileSync("TypePlaylist.png", screenshot);
      let playlistData = [];
      const playlistElements = await page.$$("ytd-playlist-renderer");
      for (const playlist of playlistElements) {
        const title = await playlist.$eval(
          ".style-scope.ytd-playlist-renderer #video-title",
          (element) => element.innerText.trim()
        );
        const videoCount = await playlist.$eval(
          ".style-scope.ytd-playlist-renderer",
          (element) => element.innerText.trim()
        );
        const author = await playlist.$eval(
          ".yt-simple-endpoint.style-scope.yt-formatted-string",
          (element) => element.innerText
        );
        const authorUrl = await playlist.$eval(
          ".yt-simple-endpoint.style-scope.yt-formatted-string",
          (element) => element.getAttribute("href")
        );
        const playlistLink = await playlist.$eval(
          ".style-scope.ytd-playlist-renderer #view-more a",
          (element) => element.getAttribute("href")
        );
        playlistData.push({
          title: title || undefined,
          author: author || undefined,
          playlistId: playlistLink.split("list=")[1],
          playlistLink: "https://www.youtube.com" + playlistLink,
          authorUrl: "https://www.youtube.com" + authorUrl || undefined,
          videoCount:
            parseInt(videoCount.replace(/ videos\nNOW PLAYING/g, "")) ||
            undefined,
        });
      }
      console.log(playlistData);
      await page.close();
      await browser.close();
      break;
    case "TypeSearch":
    default:
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "booting chromium...",
      });
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query);
      await page.goto(url);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      screenshot = await page.screenshot({
        path: "TypeSearch.png",
      });
      fs.writeFileSync("TypeSearch.png", screenshot);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "took screenshot...",
      });
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      }
      content = await page.content();
      $ = load(content);
      videoElements = $(
        "ytd-video-renderer:not([class*='ytd-rich-grid-video-renderer'])"
      );
      videoElements.each(async (_, vide) => {
        const videoId = getId(
          "https://www.youtube.com" + $(vide).find("a").attr("href")
        ).id;
        const authorContainer = $(vide).find(".ytd-channel-name a");
        const uploadedOnElement = $(vide).find(
          ".inline-metadata-item.style-scope.ytd-video-meta-block"
        );
        TypeSearchData.push({
          title: $(vide).find("#video-title").text().trim() || undefined,
          views:
            $(vide)
              .find(".inline-metadata-item.style-scope.ytd-video-meta-block")
              .filter((_, vide) => $(vide).text().includes("views"))
              .text()
              .trim()
              .replace(/ views/g, "") || undefined,
          author: authorContainer.text().trim() || undefined,
          videoId,
          uploadOn:
            uploadedOnElement.length >= 2
              ? $(uploadedOnElement[1]).text().trim()
              : undefined,
          authorUrl:
            "https://www.youtube.com" + authorContainer.attr("href") ||
            undefined,
          videoLink: "https://www.youtube.com/watch?v=" + videoId,
          thumbnailUrls: [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/default.jpg`,
          ],
          description:
            $(vide).find(".metadata-snippet-text").text().trim() || undefined,
        });
      });
      console.log(TypeSearchData);
      spinnies.succeed(spin, {
        text:
          colors.yellow("@info: ") +
          colors.white("scrapping done, total videos " + TypeSearchData.length),
      });
      await page.close();
      await browser.close();
      break;
  }
}

async.eachSeries(
  ["", "TypeSearch", "TypeVideo", "TypePlaylist", "TypeMovie", "TypeChannel"],
  async (type) => await TypeTube("Angel Numbers", type)
);
