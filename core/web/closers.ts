import colors from "colors";
import { Browser, Page } from "puppeteer";

export default async function closers(browser: Browser) {
  try {
    const pages = await browser.pages();
    await Promise.all(pages.map((page: Page) => page.close()));
    await browser.close();
  } catch (error) {
    console.error(colors.red("@error:"), error);
  }
}
