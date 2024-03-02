const { spawn } = require("child_process");

const url =
  "https://rr2---sn-gwpa-niad.googlevideo.com/videoplayback?expire=1709384369&ei=Uc7iZYaWA67BrtoP76OQgAY&ip=2409%3A40e1%3Aa%3Abdd4%3A13db%3A5d5a%3Ad07b%3A72ae&id=o-AK5H9-i-gU2YK_F4qo8dQgTOOu9h5NiGSvwnmRGm6Ftg&itag=137&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Ny&mm=31%2C29&mn=sn-gwpa-niad%2Csn-qxaelned&ms=au%2Crdu&mv=m&mvi=2&pcm2cms=yes&pl=36&gcr=in&initcwndbps=480000&vprv=1&svpuc=1&mime=video%2Fmp4&gir=yes&clen=59629419&dur=194.110&lmt=1706319416857349&mt=1709362148&fvip=4&keepalive=yes&fexp=24007246&c=IOS&txp=453C434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhALnFchG73wBsCWToO5eh-7xIrO-QARchhtPmfUrNzK0LAiEAzm98CAuFLAWKsKqP74S8YVcPiKxxgOMY8boQ-vt_MDY%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRgIhAO4Mf1vQsl0As0K1AR09s8yLVpMt_IgbAVZWZ0QJOTdbAiEAsWrruHbTsgtXZc9koxqJQDjFAOH7jtgFSTCQXjvSJ2E%3D";

const ffmpegProcess = spawn("ffmpeg", [
  "-i",
  url,
  "-c",
  "copy",
  "-bsf:a",
  "aac_adtstoasc",
  "output.mp4",
]);

ffmpegProcess.stdout.on("data", (data) => {
  console.log(data.toString());
});

ffmpegProcess.stderr.on("data", (data) => {
  console.error(data.toString());
});
