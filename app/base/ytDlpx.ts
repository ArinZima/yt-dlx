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
    const payLoad = await new Promise((resolve) => {
      page.on("requestfinished", async (request) => {
        if (request.url().includes("/" + route)) {
          const response = await request.response();
          if (!response) return resolve(null);
          else return resolve(await response.json());
        } else return resolve(null);
      });
    });
    return JSON.stringify(payLoad);
  } catch (error) {
    console.log(colors.red("@error:"), error);
    return null;
  } finally {
    await browser.close();
  }
}
