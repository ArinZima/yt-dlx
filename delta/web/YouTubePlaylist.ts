import colors from "colors";
import retry from "async-retry";
import spinClient from "spinnies";
import { randomUUID } from "crypto";
import { chromium } from "playwright";

const spinnies = new spinClient();

export interface YouTubePLVideos {
  ago: string;
  url: string;
  title: string;
  views: string;
  author: string;
  videoId: string;
  authorUrl: string;
  thumbnailUrls: string[];
}
export interface YouTubePlaylist {
  views: string;
  count: number;
  title: string;
  description: string;
  videos: YouTubePLVideos[];
}
export default async function YouTubePlaylist({
  playlistLink,
}: {
  playlistLink: string;
}): Promise<YouTubePlaylist | undefined> {
  const retryOptions = {
    maxTimeout: 4000,
    minTimeout: 2000,
    retries: 4,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const playlistData = [];
      const browser = await chromium.launch({
        headless: true,
      });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "started chromium...",
      });
      const context = await browser.newContext({
        ignoreHTTPSErrors: true,
        serviceWorkers: "allow",
        bypassCSP: true,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
      });
      const page = await context.newPage();
      await page.goto(playlistLink);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      const titleElement: any = await page.$(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      );
      const playlistTitle = await titleElement.textContent();
      const videoCountElement: any = await page.$(
        "yt-formatted-string.byline-item"
      );
      const videoCountText = await videoCountElement.textContent();
      const videoCount = parseInt(videoCountText.match(/\d+/)[0]);
      const viewsElement: any = await page.$$(
        "yt-formatted-string.byline-item"
      );
      const viewsText = await viewsElement[1].textContent();
      const views = viewsText.replace(/,/g, "").match(/\d+/)[0];
      const descriptionElement: any = await page.$("span#plain-snippet-text");
      let playlistDescription = await descriptionElement.textContent();
      const VideoElements = await page.$$("ytd-playlist-video-renderer");
      for (const vide of VideoElements) {
        const TitleElement: any = await vide.$("h3");
        let title = await TitleElement.textContent();
        title = title.trim();
        const urlElement: any = await vide.$("a");
        const url: any =
          "https://www.youtube.com" + (await urlElement.getAttribute("href"));
        const videoId = url.match(/(?<=v=)[^&\s]+/)[0];
        const AuthorElement: any = await vide.$(
          ".yt-simple-endpoint.style-scope.yt-formatted-string"
        );
        const author = await AuthorElement.textContent();
        const authorUrl = await AuthorElement.getAttribute("href");
        const ViewsElement: any = await vide.$(
          ".style-scope.ytd-video-meta-block span:first-child"
        );
        const views = await ViewsElement.textContent();
        const AgoElement: any = await vide.$(
          ".style-scope.ytd-video-meta-block span:last-child"
        );
        const ago = await AgoElement.textContent();
        const thumbnailUrls = [
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`,
        ];
        playlistData.push({
          ago,
          url,
          title,
          author,
          videoId,
          thumbnailUrls,
          views: views.replace(/ views/g, ""),
          authorUrl: "https://www.youtube.com" + authorUrl,
        });
      }
      await browser.close();
      return {
        views,
        count: videoCount,
        title: playlistTitle,
        description: playlistDescription.trim(),
        videos: playlistData,
      };
    }, retryOptions);
    spinnies.succeed(spin, {
      text: colors.yellow("@info: ") + "scrapping done...",
    });
    return metaTube;
  } catch (error: any) {
    spinnies.fail(spin, {
      text: colors.red("@error: ") + error.message,
    });
    return undefined;
  }
}
