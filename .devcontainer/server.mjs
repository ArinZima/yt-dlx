import colors from "colors";
import * as bun from "bun";
import cron from "node-cron";

const port = process.env.PORT || 8000;

async function reinstallProcess() {
  try {
    console.clear();
    console.log(colors.green("@info:"), "re-installing iteration", counter);
    console.log(colors.blue("@server:"), "running on port", port);
    await bun.$`bun add yt-dlx@latest && bun remove yt-dlx`.quiet();
    counter++;
  } catch (error) {
    console.error(colors.red("@error:"), error.message);
    process.exit(1);
  }
}

cron.schedule("*/10 * * * *", async () => {
  await reinstallProcess();
});

(async () => {
  bun.serve({
    development: true,
    port: port,
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
})();
