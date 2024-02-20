import colors from "colors";
import readline from "readline";

const termwidth = process.stdout.columns;
const progressBar = (percent: number | undefined, _metaSpin: string) => {
  if (percent === undefined) return;
  const width = Math.floor(termwidth / 2);
  const scomp = Math.round((width * percent) / 100);
  let color = colors.green;
  if (percent < 20) color = colors.red;
  else if (percent < 80) color = colors.yellow;
  const sprog = color("▇").repeat(scomp) + color("━").repeat(width - scomp);
  const sbar = color("PROG: ") + `${sprog} ${percent.toFixed(2)}%`;
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(sbar);
  // if (percent >= 100) process.stdout.write("\n");
};

export default progressBar;
