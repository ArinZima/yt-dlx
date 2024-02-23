import colors from "colors";
import { chromium } from "playwright";
import type { Browser } from "playwright";

async function ytcprox({ query, route, domain }: any) {
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
    const payLoad = await new Promise((resolve) => {
      page.on("requestfinished", async (request) => {
        if (request.url().includes("/" + route)) {
          const response = await request.response();
          resolve(await response?.json());
        } else resolve(null);
      });
    });
    console.log(colors.green("pass @url:"), host);
    return payLoad;
  } catch (error) {
    console.log(colors.red("ERROR:"), error);
    return null;
  } finally {
    await browser.close();
  }
}

async function runTests() {
  try {
    await ytcprox({
      route: "core",
      query: "wWR0VD6qgt8",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    await delay(2000);

    await ytcprox({
      route: "scrape",
      query: "angel numbers",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    await delay(2000);

    await ytcprox({
      route: "scrape",
      query: "wWR0VD6qgt8",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    await delay(2000);

    await ytcprox({
      route: "scrape",
      domain: "https://casual-insect-sunny.ngrok-free.app",
      query: "https://youtu.be/wWR0VD6qgt8?si=S8os0alEDZ6875lD",
    });
    await delay(2000);

    await ytcprox({
      route: "scrape",
      query: "PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    await delay(2000);

    await ytcprox({
      route: "scrape",
      domain: "https://casual-insect-sunny.ngrok-free.app",
      query:
        "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
    });
    await delay(2000);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
setTimeout(runTests, 4000);
