import * as bun from "bun";
const port = process.env.PORT || 8000;

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
