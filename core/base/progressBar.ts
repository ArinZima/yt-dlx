import colors from "colors";
import readline from "readline";

let color = colors.green;

const progressBar = (prog: { timemark: any; percent: any }) => {
  if (prog.timemark === undefined || prog.percent === undefined) return;
  readline.cursorTo(process.stdout, 0);
  if (prog.percent < 30) color = colors.red;
  else if (prog.percent < 60) color = colors.yellow;
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round((width * prog.percent) / 100);
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    `${color("@prog: ")}${sprog} ${prog.percent.toFixed(2)}% ${color(
      "@timemark: "
    )}${prog.timemark}`
  );
};

export default progressBar;
