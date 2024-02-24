import retry from "async-retry";
import express from "express";
import helmet from "helmet";
import chalk from "chalk";
import cors from "cors";

async function autoScroll(page, number) {
  await page.evaluate(async (number) => {
    await new Promise((resolve) => {
      let count = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const videosCount =
          document.querySelectorAll("ytd-video-renderer").length;
        if (videosCount >= number) {
          clearInterval(timer);
          resolve();
        } else {
          window.scrollBy(0, distance);
          count++;
          if (count >= 1000) {
            clearInterval(timer);
            resolve();
          }
        }
      }, 200);
    });
  }, number);
}
export default async function getTube({ query, number = 10 }) {
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
      try {
        await page.goto(
          "https://www.youtube.com/results?search_query=" +
            encodeURIComponent(query)
        );
        let TVideos = [];
        while (TVideos.length < number) {
          await page.waitForSelector("ytd-video-renderer");
          const initialCount = TVideos.length;
          await autoScroll(page, number);
          const NVideos = await page.evaluate(() => {
            const vCards = document.querySelectorAll("ytd-video-renderer");
            const videos = [];
            vCards.forEach((card) => {
              const titleElement = card.querySelector("#video-title");
              const videoUrl = card.querySelector("#thumbnail").href;
              const videoId = new URL(videoUrl).searchParams.get("v");
              const viewsElement = card.querySelector(
                ".inline-metadata-item.style-scope.ytd-video-meta-block"
              );
              const uploadedOnElement = card.querySelectorAll(
                ".inline-metadata-item.style-scope.ytd-video-meta-block"
              )[1];
              const authorNameElement = card.querySelector(
                ".yt-simple-endpoint.style-scope.yt-formatted-string"
              );
              const authorImageElement = card.querySelector(
                ".style-scope.yt-img-shadow"
              );
              const descriptionElement = card.querySelector(
                ".metadata-snippet-text.style-scope.ytd-video-renderer"
              );
              const views = viewsElement
                ? viewsElement.textContent.trim()
                : undefined;
              const uploadOn = uploadedOnElement
                ? uploadedOnElement.textContent.trim()
                : undefined;
              const authorName = authorNameElement
                ? authorNameElement.textContent.trim()
                : undefined;
              const authorImage = authorImageElement
                ? authorImageElement.src
                : undefined;
              const description = descriptionElement
                ? descriptionElement.textContent.trim()
                : undefined;
              const authorUrl = authorNameElement
                ? authorNameElement.href
                : undefined;
              const thumbnails = [
                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                `https://img.youtube.com/vi/${videoId}/default.jpg`,
              ];
              if (views.includes("watching")) return;
              if (videoUrl.includes("shorts")) return;
              videos.push({
                videoId,
                authorUrl,
                uploadOn,
                authorName,
                authorImage,
                description,
                thumbnails,
                views: views.replace(/ views/g, ""),
                title: titleElement.textContent.trim(),
                videoUrl: "https://www.youtube.com/watch?v=" + videoId,
              });
            });
            return videos;
          });
          TVideos = TVideos.concat(NVideos.slice(initialCount));
        }
        await page.close();
        return TVideos.slice(0, number);
      } catch (error) {
        console.error(error.message);
        await page.close();
        return undefined;
      }
    }, retryOptions);
    return results;
  } catch (error) {
    console.error(error.message);
    return undefined;
  } finally {
    if (browser) await browser.close();
  }
}

const app = express();
app.use(helmet());
app.use(cors());
app.get("/", async (req, res) => {
  try {
    console.log(chalk.blue("@query:"), req.query.query);
    console.log(chalk.blue("@number:"), req.query.number);
    const info = await getTube({
      number: req.query.number,
      query: req.query.query,
    });
    res.json(info);
  } catch (error) {
    res.json(error);
  }
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(chalk.blue("@server:"), `http://localhost:${port}`);
});
