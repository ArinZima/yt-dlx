import colors from "colors";
import { chromium } from "playwright";
import type { Browser } from "playwright";

async function ytdlx({ query, route, domain }: any) {
  const browser: Browser = await chromium.launch({ headless: true });
  try {
    const host = `${domain}/${route}?query=${decodeURIComponent(query)}`;
    console.log(colors.blue("testing @url:"), host);
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(host);
    await page.waitForSelector("button[class*=ring-blue-600]", {
      timeout: 10000,
    });
    await page.click("button[class*=ring-blue-600]");

    const requestFinished = new Promise((resolve) => {
      page.on("requestfinished", async (request) => {
        try {
          if (request.url().includes("/" + route)) {
            const response = await request.response();
            if (response) {
              const json = await response.json();
              resolve(json);
            } else resolve(null);
          }
        } catch (error) {
          console.log(colors.red("response @error:"), error);
          resolve(null);
        }
      });
    });

    const payLoad = await requestFinished;
    if (payLoad) {
      console.log(colors.green("pass @url:"), host);
      await browser.close();
      return payLoad;
    } else {
      console.log(colors.red("fail @url:"), host);
      await browser.close();
      return null;
    }
  } catch (error) {
    console.log(colors.red("ERROR:"), error);
    return null;
  }
}

async function runTests() {
  try {
    console.log(colors.yellow("testing @topic:"), "with video name");
    await ytdlx({
      route: "scrape",
      query: "angel numbers",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
    });
    console.log(colors.yellow("testing @topic:"), "with videoid");
    await ytdlx({
      route: "core",
      query: "wWR0VD6qgt8",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
    });
    console.log(colors.yellow("testing @topic:"), "with video link");
    await ytdlx({
      route: "scrape",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
      query: "https://youtu.be/wWR0VD6qgt8?si=S8os0alEDZ6875lD",
    });
    console.log(colors.yellow("testing @topic:"), "with playlist id");
    await ytdlx({
      route: "scrape",
      query: "PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
    });
    console.log(colors.yellow("testing @topic:"), "with playlist link");
    await ytdlx({
      route: "scrape",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
      query:
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

runTests();
