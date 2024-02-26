import fs from "fs";
import async from "async";
import puppeteer from "puppeteer";

async function TypeTube(query, type = "TypeSearch") {
  const browser = await puppeteer.launch({
    userDataDir: "other",
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
  );
  let url;
  let screenshot;
  switch (type) {
    case "TypeVideo":
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query) +
        "&sp=EgIIAQ%253D%253D";
      await page.goto(url);
      screenshot = await page.screenshot({
        path: "TypeVideo.png",
      });
      fs.writeFileSync("TypeVideo.png", screenshot);
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
      await page.close();
      await browser.close();
      break;
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
    default:
      url =
        "https://www.youtube.com/results?search_query=" +
        decodeURIComponent(query);
      await page.goto(url);
      screenshot = await page.screenshot({
        path: "TypeSearch.png",
      });
      fs.writeFileSync("TypeSearch.png", screenshot);
      await page.close();
      await browser.close();
      break;
  }
}

async.eachSeries(
  ["", "TypeMovie", "TypeVideo", "TypeChannel", "TypePlaylist"],
  async (type) => await TypeTube("Angel Numbers", type)
);
