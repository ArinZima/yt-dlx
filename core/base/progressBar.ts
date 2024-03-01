import colors from "colors";
import readline from "readline";

interface ProgressData {
  timemark: string | undefined;
  percent: number | undefined;
}

const progressBar = (prog: ProgressData) => {
  if (prog.percent === undefined) return;
  if (prog.timemark === undefined) return;
  let color = colors.green;
  if (prog.percent >= 98) prog.percent = 100;
  readline.cursorTo(process.stdout, 0);
  const width = Math.floor(process.stdout.columns / 3);
  const scomp = Math.round((width * prog.percent) / 100);
  if (prog.percent < 20) color = colors.red;
  else if (prog.percent < 80) color = colors.yellow;
  const sprog = color("━").repeat(scomp) + color(" ").repeat(width - scomp);
  process.stdout.write(
    color("@prog: ") +
      sprog +
      " " +
      prog.percent.toFixed(2) +
      "% " +
      color("@timemark: ") +
      prog.timemark
  );
  if (prog.percent >= 99) process.stdout.write("\n");
};

export default progressBar;
