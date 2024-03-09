import * as fs from "fs";
import SpinClient from "spinnies";
import puppeteer from "puppeteer";

async function proTube({ videoUrl }) {
  const fsfile = "metadata.json";
  const spinner = new SpinClient();
  const vid = new URL(videoUrl).searchParams.get("v");
  spinner.add("proTube", { text: "browser spinning for " + vid });
  try {
    let payloadObject = {};
    if (fs.existsSync(fsfile)) {
      const existingPayload = fs.readFileSync(fsfile, "utf-8");
      payloadObject = JSON.parse(existingPayload);
      if (payloadObject[vid]) {
        spinner.succeed("proTube", {
          text: "payload already exists for " + vid,
        });
        return payloadObject[vid];
      }
    } else {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-zygote",
          "--incognito",
          "--no-sandbox",
          "--enable-automation",
          "--disable-dev-shm-usage",
        ],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
      );
      await page.goto(videoUrl);
      await page.waitForSelector("script");
      spinner.update("proTube", { text: "grabbing content for " + vid });
      const metaTube = await page.evaluate(() => {
        const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
        if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
          const streamingData = ytInitialPlayerResponse.streamingData;
          const formats = streamingData.formats || [];
          const pops = formats.concat(streamingData.adaptiveFormats || []);
          return pops.map((ipop) => ipop);
        } else return undefined;
      });
      if (page) await page.close();
      if (browser) await browser.close();
      if (metaTube) {
        spinner.update("proTube", { text: "preparing payload for " + vid });
        const { AudioStore, VideoStore } = procTube(metaTube);
        spinner.succeed("proTube", { text: "payload sent for " + vid });
        const payLoad = { AudioStore, VideoStore };
        payloadObject[vid] = payLoad;
        fs.writeFileSync(fsfile, JSON.stringify(payloadObject, null, 2));
        return payLoad;
      } else return undefined;
    }
  } catch (error) {
    spinner.fail("proTube", { text: error.message });
  }
}

function procTube(metaTube) {
  const AudioStore = [];
  const VideoStore = [];
  for (const Tube of metaTube) {
    if (Tube.mimeType && Tube.mimeType.includes("audio")) {
      const codec = Tube.mimeType
        ? Tube.mimeType.split(";")[1]?.trim()
        : undefined;
      AudioStore.push({
        ...Tube,
        codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : undefined,
        mimeType: Tube.mimeType
          ? Tube.mimeType.split(";")[0].trim()
          : undefined,
      });
    } else if (Tube.mimeType && Tube.mimeType.includes("video")) {
      const codec = Tube.mimeType
        ? Tube.mimeType.split(";")[1]?.trim()
        : undefined;
      VideoStore.push({
        ...Tube,
        codec: codec ? codec.split("=")[1].replace(/"/g, "").trim() : undefined,
        mimeType: Tube.mimeType
          ? Tube.mimeType.split(";")[0].trim()
          : undefined,
      });
    }
  }
  return { AudioStore, VideoStore };
}

(async () => {
  try {
    const metaTube = await proTube({
      videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    if (metaTube) console.log(metaTube);
    else process.exit(1);
  } catch (error) {
    console.error(error);
  }
})();
