import puppeteer from "puppeteer";
const proTube = async (videoUrl) => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (req.url().includes("youtube.com/get_video_info")) req.abort();
    else req.continue();
  });
  await page.goto(videoUrl);
  const videoSrc = await page.evaluate(() => {
    const ytplayer = window.ytplayer;
    const config = ytplayer && ytplayer.config;
    const args = config && config.args;
    const playerResponse = args && args.player_response;
    const streamingData = playerResponse && playerResponse.streamingData;
    const formats = streamingData && streamingData.formats;
    return formats && formats.map((format) => format.url);
  });
  if (videoSrc) console.log(videoSrc);
  else console.log("@error: failed to extract URLs.");
  await page.close();
  await browser.close();
};
proTube("https://www.youtube.com/watch?v=AbFnsaDQMYQ");
