const urls = [
  {
    filename: "233 - audio only (Default).m4a",
    url: "https://manifest.googlevideo.com/api/manifest/hls_playlist/expire/1710709815/ei/1wf3ZfHCE8up3LUP3vW76As/ip/2409:40e6:10:aa94:c3d9:b285:5a83:f387/id/c83d17b49c56ec29/itag/233/source/youtube/requiressl/yes/ratebypass/yes/pfa/1/goi/133/sgoap/clen%3D7645679%3Bdur%3D1253.691%3Bgir%3Dyes%3Bitag%3D139%3Blmt%3D1710029106293675/rqh/1/hls_chunk_host/rr2---sn-gwpa-nia6.googlevideo.com/xpc/EgVo2aDSNQ%3D%3D/mh/ex/mm/31,29/mn/sn-gwpa-nia6,sn-qxaelned/ms/au,rdu/mv/m/mvi/2/pl/46/initcwndbps/553750/vprv/1/playlist_type/DVR/dover/13/txp/5402434/mt/1710687908/fvip/5/short_key/1/keepalive/yes/sparams/expire,ei,ip,id,itag,source,requiressl,ratebypass,pfa,goi,sgoap,rqh,xpc,vprv,playlist_type/sig/AJfQdSswRQIhAI0bYFeXjC0UtPnBQ2aIkl3E9MJ7QLsgolChqSxK19DjAiAG7OuD---_-qBnNFZD-TBsdeb0TYZqv0X7hnO6RVVkaQ%3D%3D/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pl,initcwndbps/lsig/ALClDIEwRgIhALHtkV_672IGz2JYJlty1fiKFZW1wHZsL_MqBdkQxqtvAiEAyXZFMvQEzDiCEvE9dkEHWs7ZRti37vyq8AsFkzaETlA%3D/playlist/index.m3u8",
  },
  {
    filename: "140 - audio only (medium).m4a",
    url: "https://rr2---sn-gwpa-nia6.googlevideo.com/videoplayback?expire=1710709815&ei=1wf3ZfHCE8up3LUP3vW76As&ip=2409%3A40e6%3A10%3Aaa94%3Ac3d9%3Ab285%3A5a83%3Af387&id=o-APDtfYcLuPSz9DXVelvkXyOs_xYSdP1WylmIOBmuoalX&itag=140&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=ex&mm=31%2C29&mn=sn-gwpa-nia6%2Csn-qxaelned&ms=au%2Crdu&mv=m&mvi=2&pl=46&initcwndbps=553750&vprv=1&svpuc=1&mime=audio%2Fmp4&gir=yes&clen=20289495&dur=1253.622&lmt=1710029108644984&mt=1710687908&fvip=5&keepalive=yes&c=IOS&txp=5402434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhANpLwdcQQ-rx-yY4A5Yi3MWAbiMDloRGv13TEwdFbE3pAiEA7Y-FoJdgEmURErtbmcKhoROGbbWAEXRqCJGYDmO66WI%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIgGhR3JH6gKgsmEPnDLrK8QRElC-4yYRPEk1bvAO4NToUCIQD8rDJlXd4V2Vg2J0iV6REBUyp4zhhgEv6P7omdIZnJTw%3D%3D",
  },
];

import ffmpeg from "fluent-ffmpeg";

async function downloadAndMerge(urlObj, outputFilePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const { filename, url } = urlObj;
      const ff = ffmpeg(url);
      ff.outputOptions("-c copy");
      ff.output(`${outputFilePath}/${filename}`);
      ff.on("start", (command) => {
        console.log("@command:", command);
      });
      ff.on("progress", ({ percent }) => {
        if (isNaN(percent)) return;
        process.stdout.write(
          `\r@progress: ${filename} | ${percent.toFixed(2)}%`
        );
      });
      ff.on("end", () => {
        process.stdout.write("\n\n");
        resolve(`${outputFilePath}/${filename}`);
      });
      ff.on("error", (error) => reject(error));
      ff.run();
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  for (const urlObj of urls) {
    try {
      await downloadAndMerge(urlObj, "temp");
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
})();
