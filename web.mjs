import fs from "fs";
import async from "async";
import puppeteer from "puppeteer";

async function TypeTube(query, type = "FilterTypeSearch") {
  let fileName = "";
  let urlSuffix = "";
  switch (type) {
    case "FilterTypeVideo":
      urlSuffix = "EgIIAQ%253D%253D";
      fileName = "FilterTypeVideo.png";
      break;
    case "FilterTypeChannel":
      urlSuffix = "EgIQAg%253D%253D";
      fileName = "FilterTypeChannel.png";
      break;
    case "FilterTypePlaylist":
      urlSuffix = "EgIQAw%253D%253D";
      fileName = "FilterTypePlaylist.png";
      break;
    case "FilterTypeMovie":
      urlSuffix = "EgIQBA%253D%253D";
      fileName = "FilterTypeMovie.png";
      break;
    default:
      urlSuffix = "";
      fileName = "FilterTypeSearch.png";
      break;
  }
  const browser = await puppeteer.launch({
    userDataDir: "other",
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  );
  const url =
    "https://www.youtube.com/results?search_query=" +
    decodeURIComponent(query) +
    "&sp=" +
    urlSuffix;
  await page.goto(url);
  const screenshot = await page.screenshot({
    path: fileName,
  });
  fs.writeFileSync(fileName, screenshot);
  await page.close();
  await browser.close();
}
async.eachSeries(
  [
    "",
    "FilterTypeMovie",
    "FilterTypeVideo",
    "FilterTypeChannel",
    "FilterTypePlaylist",
  ],
  async (type) => await TypeTube("Angel Numbers", type)
);
