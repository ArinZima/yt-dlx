import proTube from "yt-dlx";

export async function GET(request: Request): Promise<Response> {
  return new Promise(async (resolve, reject) => {
    const url = new URL(request.url);
    const formdata = url.searchParams.get("formdata");
    console.log(formdata);
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
