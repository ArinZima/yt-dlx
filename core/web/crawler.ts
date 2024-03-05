import puppeteer, { Browser, Page } from "puppeteer";
export let browser: Browser;
export let page: Page;

export default async function crawler(verbose?: boolean, torproxy?: string) {
  try {
    browser = await puppeteer.launch({
      headless: verbose ? false : true,
      userDataDir: "others",
      args: [
        "--no-zygote",
        "--incognito",
        "--no-sandbox",
        "--enable-automation",
        "--disable-dev-shm-usage",
        `--proxy-server=${torproxy}`,
      ],
    });
    page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
    );
  } catch (error) {
    if (page) await page.close();
    if (browser) await browser.close();
    switch (true) {
      case error instanceof Error:
        throw new Error(error.message);
      default:
        throw new Error("internal server error");
    }
  }
}
