import puppeteer from "puppeteer";
import retry from "async-retry";
import express from "express";
import helmet from "helmet";
import chalk from "chalk";
import cors from "cors";

async function autoScroll(page, number) {
  await page.evaluate(async () => {
    await new Promise((resolve, _reject) => {
      let height = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const sheight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        height += distance;
        if (
          height >= sheight ||
          document.querySelectorAll("ytd-video-renderer").length >= number
        ) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

export default async function getTube({ query, number = 10 }) {
  const retryOptions = {
    minTimeout: 2000,
    maxTimeout: 4000,
    retries: 4,
  };
  let browser;
  try {
    browser = await puppeteer.launch({
      userDataDir: "other",
      headless: true,
      args: [
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
      ],
    });
    const results = await retry(async () => {
      const page = await browser.newPage();
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
              const linkElement = card.querySelector("#thumbnail");
              const link = linkElement ? linkElement.href : undefined;
              const videoId = new URL(link).searchParams.get("v");
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
              const timeStampElement = card.querySelector(
                "#text.style-scope.ytd-thumbnail-overlay-time-status-renderer"
              );
              const isShorts = card.querySelector(
                ".style-scope.ytd-thumbnail-overlay-time-status-renderer[aria-label='Shorts']"
              );
              const views = viewsElement
                ? viewsElement.textContent.trim()
                : undefined;
              const uploadedOn = uploadedOnElement
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
              const timeStamp = timeStampElement
                ? timeStampElement.textContent.trim()
                : undefined;
              const authorUrl = authorNameElement
                ? authorNameElement.href
                : undefined;
              videos.push({
                link,
                videoId,
                authorUrl,
                timeStamp,
                uploadedOn,
                authorName,
                authorImage,
                description,
                views: views.replace(/ views/g, ""),
                type: isShorts ? "shorts" : "video",
                title: titleElement.textContent.trim(),
                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
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
