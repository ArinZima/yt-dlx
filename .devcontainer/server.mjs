import colors from "colors";
import * as bun from "bun";

const port = process.env.PORT || 8000;
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
  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let counter = 1;
  while (true) {
    try {
      console.clear();
      console.log(colors.green("@info:"), "re-installing iteration", counter);
      console.log(colors.blue("@server:"), "running on port", port);
      await bun.$`bun add yt-dlx@latest && bun remove yt-dlx`.quiet();
      counter++;
      await sleep(2000);
    } catch (error) {
      console.error(colors.red("@error:"), error.message);
      process.exit(1);
    }
  }
})();
