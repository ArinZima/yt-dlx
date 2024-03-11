import puppeteer, { Browser, Page } from "puppeteer";
export let browser: Browser;
export let page: Page;

export default async function crawler(verbose?: boolean, autoSocks5?: boolean) {
  try {
    if (autoSocks5) {
      browser = await puppeteer.launch({
        headless: verbose ? false : true,
        args: [
          "--no-zygote",
          "--incognito",
          "--no-sandbox",
          "--lang=en-US",
          "--enable-automation",
          "--disable-dev-shm-usage",
          "--ignore-certificate-errors",
          "--allow-running-insecure-content",
          "--proxy-server=socks5://127.0.0.1:9050",
        ],
      });
    } else {
      browser = await puppeteer.launch({
        headless: verbose ? false : true,
        args: [
          "--no-zygote",
          "--incognito",
          "--no-sandbox",
          "--lang=en-US",
          "--enable-automation",
          "--disable-dev-shm-usage",
          "--ignore-certificate-errors",
          "--allow-running-insecure-content",
        ],
      });
    }
    page = await browser.newPage();
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
