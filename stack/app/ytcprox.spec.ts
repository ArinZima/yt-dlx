import colors from "colors";
import { chromium } from "playwright";
import type { Browser } from "playwright";

async function ytDlpx({ query, route, domain }: any) {
  const browser: Browser = await chromium.launch({ headless: false });
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
    const payLoadPromise = new Promise((resolve) => {
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
          console.log(colors.red("Error handling response:"), error);
          resolve(null);
        }
      });
    });
    const payLoad = await payLoadPromise;
    if (payLoad) {
      console.log(colors.green("pass @url:"), host);
      return payLoad;
    } else {
      console.log(colors.red("fail @url:"), host);
      return null;
    }
  } catch (error) {
    console.log(colors.red("ERROR:"), error);
    return null;
  } finally {
    // Close the context and browser properly
    await browser.close();
  }
}

async function runTests() {
  try {
    await ytDlpx({
      route: "core",
      query: "wWR0VD6qgt8",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
    });
    await delay(2000);

    await ytDlpx({
      route: "scrape",
      query: "angel numbers",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
    });
    await delay(2000);

    await ytDlpx({
      route: "scrape",
      query: "wWR0VD6qgt8",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
    });
    await delay(2000);

    await ytDlpx({
      route: "scrape",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
      query: "https://youtu.be/wWR0VD6qgt8?si=S8os0alEDZ6875lD",
    });
    await delay(2000);

    await ytDlpx({
      route: "scrape",
      query: "PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
    });
    await delay(2000);

    await ytDlpx({
      route: "scrape",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
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
