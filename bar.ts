import colors from "colors";
import readline from "readline";
import fluentffmpeg from "fluent-ffmpeg";

interface ProgressData {
  currentKbps: number;
  timemark: string;
  percent: number;
}

const progressBar = (prog: ProgressData) => {
  if (isNaN(prog.currentKbps)) return;
  if (prog.percent === undefined) return;
  readline.cursorTo(process.stdout, 0);
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round((width * prog.percent) / 100);
  let color = colors.green;
  if (prog.percent < 20) color = colors.red;
  else if (prog.percent < 80) color = colors.yellow;
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    color("PROG:") +
      " " +
      sprog +
      " " +
      prog.percent.toFixed(2) +
      "%" +
      color(" FFMPEG: ") +
      prog.currentKbps +
      "kbps " +
      color("TIMEMARK: ") +
      prog.timemark
  );
  if (prog.percent >= 99) process.stdout.write("\n");
};

const media = fluentffmpeg();
media.addInput(
  decodeURIComponent(
    "https://rr1---sn-gwpa-gq2z.googlevideo.com/videoplayback?expire=1708553853&ei=HSLWZbK3BaHPpgeEpq3oAg&ip=152.58.162.49&id=o-ACBxVpwIzU49Xi9FczTgMTG208LFTjXyR1WlqEfPc_rk&itag=251&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=OL&mm=31%2C29&mn=sn-gwpa-gq2z%2Csn-gwpa-qxay&ms=au%2Crdu&mv=m&mvi=1&pl=24&gcr=in&initcwndbps=150000&spc=UWF9f6XaNRjrf8-dvHnEeSBRjS8DRxjGL0mSXAcCMrDAMs8&vprv=1&svpuc=1&mime=audio%2Fwebm&gir=yes&clen=3623867&dur=219.241&lmt=1706177317940005&mt=1708531987&fvip=3&keepalive=yes&fexp=24007246&c=ANDROID&txp=4532434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cgcr%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRgIhANbBqJMqFWlg_MXS8H104s18-eoPlr82oZK7dvpYh3MuAiEA_B0KJdkdCecT3fLqqYNoCeb9p5JWhX9vHFvTGSkODGY%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=APTiJQcwRgIhAJa22QUTyAvf6D-ZxfGSa-cyFxITKvTs_oiwIdpXnl6bAiEAsbZY0SHsmGBt3QTkc2_TsjSDYrTV-zecgJMo9Ap62b8%3D"
  )
);
media.format("mp3");
media.on("start", () =>
  progressBar({ currentKbps: 0, timemark: "", percent: 0 })
);
media.on("end", () =>
  progressBar({ currentKbps: 0, timemark: "", percent: 100 })
);
media.on("close", () =>
  progressBar({ currentKbps: 0, timemark: "", percent: 100 })
);
media.on("progress", (prog) => {
  progressBar({
    currentKbps: prog.currentKbps,
    timemark: prog.timemark,
    percent: prog.percent,
  });
});

media.output("music.mp3");
media.run();
