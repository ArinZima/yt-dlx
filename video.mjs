import ffmpeg from "fluent-ffmpeg";
const fluent = ffmpeg();
fluent
  .input(
    "https://rr5---sn-gwpa-niaz.googlevideo.com/videoplayback?expire=1709629914&ei=eo3mZYL-CYXYjMwP6_-hEA&ip=2409%3A40e1%3Acf%3Ae95%3A903%3Adbfb%3A38a0%3Ad5e7&id=o-ADuZvzO2iN9pbxiruGeK_iLT4uSMmUd2HqmFfkcMB0LK&itag=598&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=UF&mm=31%2C29&mn=sn-gwpa-niaz%2Csn-qxaelney&ms=au%2Crdu&mv=m&mvi=5&pl=47&initcwndbps=502500&spc=UWF9f_ciRIJiacUJXADSo50aIZFfje4oKoFQsGgmDG_2fDo&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=609919&dur=192.567&lmt=1706262280258964&mt=1709607430&fvip=2&keepalive=yes&fexp=24007246&c=ANDROID&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhAJcJzoF68WQAw-DoA5XqjrBjdIES-0Guwc8A57hIUr6YAiEA-YTrB4znW0PHFutuS6_d8Uk1HGYNQaBG6jLyQrMArzM%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRAIgRWXxrr_0nJ2AoCeSyUmb2dkYkn8IzDkwdLuLCxEXjG4CIDeMNbc_H3mdAGX7SF0v0wG_QQ4iY04hEpQTPZ6qIAjs"
  )
  .input(
    "https://rr5---sn-gwpa-niaz.googlevideo.com/videoplayback?expire=1709629914&ei=eo3mZYL-CYXYjMwP6_-hEA&ip=2409%3A40e1%3Acf%3Ae95%3A903%3Adbfb%3A38a0%3Ad5e7&id=o-ADuZvzO2iN9pbxiruGeK_iLT4uSMmUd2HqmFfkcMB0LK&itag=599&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=UF&mm=31%2C29&mn=sn-gwpa-niaz%2Csn-qxaelney&ms=au%2Crdu&mv=m&mvi=5&pl=47&initcwndbps=502500&spc=UWF9f_ciRIJiacUJXADSo50aIZFfje4oKoFQsGgmDG_2fDo&vprv=1&svpuc=1&mime=audio%2Fmp4&gir=yes&clen=742799&dur=192.725&lmt=1706261512451383&mt=1709607430&fvip=2&keepalive=yes&fexp=24007246&c=ANDROID&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRQIgc3eao91_ADmXR6lRZIQ_oAuld1IGA747JEYOZpZhQoMCIQD9D63xtLMSWUozHv8sHaPHeLrBLL-AyShWJ4Zw9tUj2w%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRAIgRWXxrr_0nJ2AoCeSyUmb2dkYkn8IzDkwdLuLCxEXjG4CIDeMNbc_H3mdAGX7SF0v0wG_QQ4iY04hEpQTPZ6qIAjs"
  )
  .inputOptions("-map 0:v:0")
  .inputOptions("-map 1:a:0")
  .format("matroska")
  .output("mix.mkv")
  .run();
fluent.on("start", (command) => console.info(command));
fluent.on("progress", (prog) => console.info(prog.percent));
fluent.on("error", (error) => console.error(error.message));
fluent.on("end", () => console.log("Transcoding finished"));
// =======================================================================================
// import puppeteer from "puppeteer";
// const proTube = async (videoUrl) => {
// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// await page.goto(videoUrl);
// await page.waitForSelector("script");
// const videoSrc = await page.evaluate(() => {
// const ytInitialPlayerResponse = window.ytInitialPlayerResponse;
// if (ytInitialPlayerResponse && ytInitialPlayerResponse.streamingData) {
// const streamingData = ytInitialPlayerResponse.streamingData;
// const formats = streamingData.formats || [];
// const adaptiveFormats = streamingData.adaptiveFormats || [];
// const allFormats = formats.concat(adaptiveFormats);
// return allFormats.map((format) => decodeURIComponent(format.url));
// }
// return null;
// });
// if (videoSrc) console.log(videoSrc);
// else console.log("@error: failed to extract URLs.");
// if (page) await page.close();
// if (browser) await browser.close();
// };
// proTube("https://www.youtube.com/watch?v=AbFnsaDQMYQ");
