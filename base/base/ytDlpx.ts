import colors from "colors";
import { chromium } from "playwright";
import type { Browser } from "playwright";

interface ytDlpx {
  domain: string;
  query: string;
  route: string;
}
export default async function ytDlpx({
  query,
  route,
  domain,
}: ytDlpx): Promise<string | null> {
  const browser: Browser = await chromium.launch({ headless: true });
  try {
    const item: string = "query=" + decodeURIComponent(query);
    const host: string = `${domain}/${route}?${item}`;
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
      await browser.close();
      return JSON.stringify(payLoad);
    } else {
      console.log(colors.red("fail @query:"), query);
      await browser.close();
      return null;
    }
  } catch (error) {
    console.log(colors.red("@error:"), error);
    return null;
  } finally {
    await browser.close();
  }
}
