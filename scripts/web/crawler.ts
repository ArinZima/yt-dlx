import puppeteer, { Browser, Page } from "puppeteer";
import colors from "colors";
export let browser: Browser;
export let page: Page;

export default async function crawler() {
  try {
    browser = await puppeteer.launch({
      userDataDir: "TaskFile",
      headless: true,
      args: [
        "--no-zygote", // Disables the use of the zygote process for forking child processes
        "--incognito", // Launch Chrome in incognito mode to avoid cookies and cache interference
        "--no-sandbox", // Disable the sandbox mode (useful for running in Docker containers)
        "--enable-automation", // Enable automation in Chrome (e.g., for Selenium)
        "--disable-dev-shm-usage", // Disable /dev/shm usage (useful for running in Docker containers)
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
        throw new Error(colors.red("@error: ") + error.message);
      default:
        throw new Error(colors.red("@error: ") + "internal server error");
    }
  }
}
