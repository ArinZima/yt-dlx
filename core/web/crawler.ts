import puppeteer, { Browser, Page } from "puppeteer";
import colors from "colors";
export let browser: Browser;
export let page: Page;

export default async function crawler(verbose?: boolean, proxy?: string) {
  try {
    if (proxy) {
      console.log(colors.green("@info:"), "using proxy", proxy);
      browser = await puppeteer.launch({
        headless: verbose ? false : true,
        userDataDir: "others",
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
      console.log(colors.yellow("@info:"), "not using proxy");
      browser = await puppeteer.launch({
        headless: verbose ? false : true,
        userDataDir: "others",
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
