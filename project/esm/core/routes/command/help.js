import colors from "colors";
import EventEmitter from "eventemitter3";
class Emitter extends EventEmitter {
}
export default function help() {
    var emitter = new Emitter();
    console.log(colors.green("@info:"), "❣️ Thank you for using", colors.green("yt-dlx."), "Consider", colors.green("🌟starring"), "the github repo", colors.green("https://github.com/yt-dlx\n"));
    return Promise.resolve(colors.bold.white(`@help: visit https://yt-dlx-shovit.koyeb.app`));
}
//# sourceMappingURL=help.js.map