import express from "express";
import ngrok from "@ngrok/ngrok";

const app = express();
const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
  console.log(colors.green("express @port:"), port);
  const ng = await ngrok.connect({
    addr: port,
    domain: "possible-willingly-yeti.ngrok-free.app",
    authtoken: "2ckx63TtY6U2VWZ9hPLLF3Uw2zJ_7vA1a9mHRFKDEvQAT8YNg",
  });
  console.log(colors.green("proxy @url:"), ng.url());
});
async function handleSIGINT() {
  await new Promise((resolve) => {
    server.close(resolve);
    ngrok.disconnect();
  });
  process.exit(0);
}
process.on("SIGINT", handleSIGINT);
