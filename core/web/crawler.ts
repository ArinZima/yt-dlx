import puppeteer, { Browser, Page } from "puppeteer";
export let browser: Browser;
export let page: Page;

export default async function crawler(verbose?: boolean, autoSocks5?: boolean) {
  if (autoSocks5) {
    browser = await puppeteer.launch({
      headless: verbose ? false : true,
      ignoreHTTPSErrors: true,
      args: [
        "--no-zygote",
        "--incognito",
        "--no-sandbox",
        "--lang=en-US",
        "--enable-automation",
        "--disable-dev-shm-usage",
        "--ignore-certificate-errors",
        "--allow-running-insecure-content",
        // "--proxy-server=socks5://127.0.0.1:9050",
      ],
    });
  } else {
    browser = await puppeteer.launch({
      headless: verbose ? false : true,
      ignoreHTTPSErrors: true,
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
}
