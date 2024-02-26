import colors from "colors";
import { load } from "cheerio";
import retry from "async-retry";
import spinClient from "spinnies";
import puppeteer from "puppeteer";
import { randomUUID } from "crypto";
import YouTubeID from "./YouTubeId";

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
export interface webPlaylist {
  views: string;
  count: number;
  title: string;
  description: string;
  videos: YouTubePLVideos[];
}
export default async function webPlaylist({
  playlistLink,
}: {
  playlistLink: string;
}): Promise<webPlaylist | undefined> {
  const retryOptions = {
    maxTimeout: 2000,
    minTimeout: 1000,
    retries: 2,
  };
  const spin = randomUUID();
  try {
    const metaTube = await retry(async () => {
      const playlistData: any[] = [];
      const browser = await puppeteer.launch({
        headless: true,
      });
      spinnies.add(spin, {
        text: colors.green("@scrape: ") + "booting chromium...",
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      );
      await page.goto(playlistLink);
      spinnies.update(spin, {
        text: colors.yellow("@scrape: ") + "waiting for hydration...",
      });
      const content = await page.content();
      const $ = load(content);
      const playlistTitle = $(
        "yt-formatted-string.style-scope.yt-dynamic-sizing-formatted-string"
      )
        .text()
        .trim();
      const videoCountText: any = $("yt-formatted-string.byline-item").text();
      const videoCount = parseInt(videoCountText.match(/\d+/)[0]);
      const viewsText: any = $("yt-formatted-string.byline-item").eq(1).text();
      const views = viewsText.replace(/,/g, "").match(/\d+/)[0];
      let playlistDescription = $("span#plain-snippet-text").text();
      const VideoElements: any = $("ytd-playlist-video-renderer");
      VideoElements.each(async (_: any, vide: any) => {
        const title = $(vide).find("h3").text().trim();
        const url = "https://www.youtube.com" + $(vide).find("a").attr("href");
        const videoId = await YouTubeID(url);
        const author = $(vide)
          .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
          .text();
        const authorUrl =
          "https://www.youtube.com" +
          $(vide)
            .find(".yt-simple-endpoint.style-scope.yt-formatted-string")
            .attr("href");
        const views = $(vide)
          .find(".style-scope.ytd-video-meta-block span:first-child")
          .text();
        const ago = $(vide)
          .find(".style-scope.ytd-video-meta-block span:last-child")
          .text();
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
          authorUrl,
        });
      });
      await browser.close();
      return {
        views,
        count: videoCount,
        videos: playlistData,
        title: playlistTitle,
        description: playlistDescription.trim(),
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
