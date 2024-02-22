import colors from "colors";
import { chromium } from "playwright";
import type { Browser } from "playwright";

interface ytcprox {
  domain: string;
  query: string;
  route: string;
}
export default async function ytcprox({
  query,
  route,
  domain,
}: ytcprox): Promise<string | null> {
  const browser: Browser = await chromium.launch({ headless: true });
  try {
    const proxy: string = "proxy";
    const host: string = `${domain}/${route}?query=${decodeURIComponent(
      query
    )}&proxy=${proxy}`;
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
    console.log(colors.red("ERROR:"), error);
    return null;
  } finally {
    await browser.close();
  }
}
