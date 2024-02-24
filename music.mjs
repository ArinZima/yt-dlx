import getTube from "./backend/getTube.mjs";
import { chromium } from "playwright";
import retry from "async-retry";
import colors from "colors";

export async function getVideo({ videoUrl }) {
  const retryOptions = {
    minTimeout: 2000,
    maxTimeout: 4000,
    retries: 4,
  };
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
    });
    const context = await browser.newContext();
    const results = await retry(async () => {
      const page = await context.newPage();
      await page.goto(videoUrl);
      const videoData = await page.evaluate(() => {
        const titleElement = document.querySelector(
          ".title.style-scope.ytd-video-primary-info-renderer"
        );
        const agoMatch = document.body.textContent.match(/(\d+\s\w+\sago)/);
        const ago = agoMatch ? agoMatch[0] : undefined;
        const viewsMatch = document.body.textContent.match(/(\d+\s\w+\sviews)/);
        const views = viewsMatch ? viewsMatch[0] : undefined;
        const title = titleElement
          ? titleElement.textContent.trim()
          : undefined;
        return {
          ago,
          views,
          title,
        };
      });
      await browser.close();
      return videoData;
    }, retryOptions);
    return results;
  } catch (error) {
    console.error(error.message);
    if (browser) await browser.close();
    return undefined;
  }
}

(async () => {
  let metaTube;
  metaTube = await getTube({
    query: "Ed Sheeran Perfect",
    number: 1,
  });
  console.log(metaTube[0]);
  console.log(colors.green("@videos:"), metaTube.length);
  console.log(colors.green("@videoUrl:"), metaTube[0].videoUrl);
  metaTube = await getVideo({ videoUrl: metaTube[0].videoUrl });
  console.log(metaTube);
})();
