import { chromium, firefox, webkit } from "playwright";

async function Chromium() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("https://openai.com/blog/");
  await page.waitForLoadState("domcontentloaded");
  const articleTitles = await page.$$eval(".article-card h2", (elements) =>
    elements.map((element) => element.textContent.trim())
  );
  console.log("Article Titles:");
  articleTitles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  await browser.close();
}

async function Firefox() {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto("https://openai.com/blog/");
  await page.waitForLoadState("domcontentloaded");
  const articleTitles = await page.$$eval(".article-card h2", (elements) =>
    elements.map((element) => element.textContent.trim())
  );
  console.log("Article Titles:");
  articleTitles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  await browser.close();
}

async function Webkit() {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto("https://openai.com/blog/");
  await page.waitForLoadState("domcontentloaded");
  const articleTitles = await page.$$eval(".article-card h2", (elements) =>
    elements.map((element) => element.textContent.trim())
  );
  console.log("Article Titles:");
  articleTitles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  await browser.close();
}

(async () => {
  await Chromium().catch((error) => {
    console.error("Error during scraping:", error);
  });
  await Firefox().catch((error) => {
    console.error("Error during scraping:", error);
  });
  await Webkit().catch((error) => {
    console.error("Error during scraping:", error);
  });
})();
