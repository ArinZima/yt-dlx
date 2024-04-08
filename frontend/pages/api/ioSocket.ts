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
      socket.on("similar", async (param) => {
        console.log(chalk.green("📢 User:"), chalk.italic(param.user));
        console.log(param.query);
        var TubeBody = await ytdlx.ytSearch.Video.Multiple({
          query: param.query,
        });
        console.log(TubeBody);
        if (TubeBody) io.emit("similar", TubeBody);
        else io.emit("similar", []);
      });
    });
    res.socket.server.io = io;
  }
  res.end();
}
