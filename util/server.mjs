import * as bun from "bun";
import colors from "colors";
import cron from "node-cron";

let counter = 0;
cron.schedule("*/20 * * * *", async () => {
  try {
    const ipop =
      await bun.$`yarn global add yt-dlx@latest && yarn global remove yt-dlx@latest`.text();
    console.log(colors.green("@info:"), "re-installing iteration", counter);
    console.log(colors.yellow("@debug:"), ipop);
    counter++;
  } catch (error) {
    console.error(colors.red("@error:"), error.message);
  }
});

console.log(colors.green("@bun:"), "server started");
bun.serve({
  port: process.env.PORT || 8000,
  development: true,
  async fetch(req) {
    const url = new URL(req.url);
    const query = decodeURIComponent(url.searchParams.get("query"));
    if (url.pathname === "/") {
      const result =
        await bun.$`util/Engine --dump-json ytsearch:${query}`.text();
      const pubip = await bun.$`curl ipinfo.io/ip`.text();
      const responseData = {
        result: result.trim(),
        pubip: pubip.trim(),
      };
      return new Response(JSON.stringify(responseData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else return new Response("404!", { status: 404 });
  },
});
