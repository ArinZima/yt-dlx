import chalk from "chalk";
import ytdlx from "yt-dlx";
import { Server } from "socket.io";
export var config = {
  api: {
    bodyParser: false,
  },
};

export default function ioSocket(req: any, res: any) {
  if (!res.socket.server.io) {
    var io = new Server(res.socket.server);
    io.on("connection", (socket) => {
      console.log(
        chalk.green("+user[socket.io<server>]:"),
        chalk.italic(socket.id)
      );
      socket.on("similar", async (param) => {
        console.log(chalk.green("📢 User:"), chalk.italic(param.user));
        var TubeBody = await ytdlx.ytSearch.Video.Multiple({
          query: param.query,
        });
        if (TubeBody) io.emit("similar", TubeBody);
        else io.emit("similar", []);
      });
      socket.on("disconnect", () => {
        console.log(
          chalk.cyanBright.bold("-user[socket.io<server>]: "),
          chalk.italic(socket.id)
        );
      });
    });
    res.socket.server.io = io;
  }
  res.end();
}
