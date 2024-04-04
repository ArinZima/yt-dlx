import proTube from "yt-dlx";

export async function GET(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    switch (true) {
      case !!"undefined":
        resolve(
          new Response("error", {
            status: 200,
          })
        );
        break;
      default:
        reject(
          new Response("error", {
            status: 200,
          })
        );
        break;
    }
  });
}

export async function POST(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    switch (true) {
      case !!"undefined":
        resolve(
          new Response("error", {
            status: 200,
          })
        );
        break;
      default:
        reject(
          new Response("error", {
            status: 200,
          })
        );
        break;
    }
  });
}
