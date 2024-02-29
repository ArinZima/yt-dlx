import { createInterface } from "readline";
import { chromium } from "playwright";

(async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = (query) =>
    new Promise((resolve) => rl.question(query, resolve));
  const searchQuery = await question("Enter your search query: ");
  const encodedSearchQuery = encodeURIComponent(searchQuery.trim());
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://duckduckgo.com/");
  await page.fill("#searchbox_input__bEGm3", encodedSearchQuery);
  await page.keyboard.press("Enter");
  await page.waitForSelector("#links", { timeout: 5000 });
  const searchResults = await page.$$("#links .result__a");
  const titles = [];
  for (let i = 0; i < Math.min(10, searchResults.length); i++) {
    const title = await searchResults[i].innerText();
    titles.push(title);
  }
  console.log("Search Results:");
  console.log(titles);
  await browser.close();
  rl.close();
})();
