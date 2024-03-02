// const { spawn } = require("child_process");
// const fs = require("fs");
// const url =
// "https://rr5---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709392729&ei=-e7iZZToI6Du2roP2a-YoAE&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-AEGrn5OrXil3vJuEWAjonrZYL4-laPKE9cAAQe86orxA&itag=271&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=bQ&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaeen7l&ms=au%2Crdu&mv=m&mvi=5&pl=36&initcwndbps=407500&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=539424&dur=183.983&lmt=1705829926354675&mt=1709370539&fvip=2&keepalive=yes&fexp=24007246&c=IOS&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgQmtpc3i0qwFDQGhIVEGw5eWFoh0OV3Hrgw4ekuAiq1YCIBmGa9ioejkPidqe4jAm0fr4cIbmGVctrZH2v55m5dbG&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhAP6pejw6csuCBAvAlKAA4hoj69w7WMAd4_c6mscpx5b_AiBl54HNI7SICP-kC-6ku35nO3qKSYmKF5MpIzaeAaw4Vw%3D%3D";

// const formats = [
// { name: "Matroska", extension: "mkv" },
// { name: "MPEG-4", extension: "mp4" },
// { name: "WebM", extension: "webm" },
// { name: "AVI", extension: "avi" },
// ];

// formats.forEach(({ name, extension }) => {
// const ffmpeg = spawn("ffmpeg", [
// "-i",
// url,
// "-c",
// "copy",
// "-f",
// extension,
// "pipe:1",
// ]);
// ffmpeg.stderr.on("data", (data) => console.error(data.toString()));
// ffmpeg.stdout.pipe(fs.createWriteStream(`video.${extension}`));
// ffmpeg.on("close", (code) => {
// if (code === 0) console.log(`Video successfully converted to ${name}`);
// else console.error(`Error converting video to ${name}`);
// });
// });

const fs = require("fs");
const fluentffmpeg = require("fluent-ffmpeg");
const url =
  "https://rr5---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709392729&ei=-e7iZZToI6Du2roP2a-YoAE&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-AEGrn5OrXil3vJuEWAjonrZYL4-laPKE9cAAQe86orxA&itag=271&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=bQ&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaeen7l&ms=au%2Crdu&mv=m&mvi=5&pl=36&initcwndbps=407500&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=539424&dur=183.983&lmt=1705829926354675&mt=1709370539&fvip=2&keepalive=yes&fexp=24007246&c=IOS&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgQmtpc3i0qwFDQGhIVEGw5eWFoh0OV3Hrgw4ekuAiq1YCIBmGa9ioejkPidqe4jAm0fr4cIbmGVctrZH2v55m5dbG&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRQIhAP6pejw6csuCBAvAlKAA4hoj69w7WMAd4_c6mscpx5b_AiBl54HNI7SICP-kC-6ku35nO3qKSYmKF5MpIzaeAaw4Vw%3D%3D";
fluentffmpeg()
  .input(url)
  .outputFormat("webm")
  .on("progress", (prog) => console.log(prog))
  .pipe(fs.createWriteStream("video.webm"), { end: true });
