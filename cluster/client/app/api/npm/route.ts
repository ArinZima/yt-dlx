import colors from "colors";
import { exec } from "child_process";

export async function GET(request: Request): Promise<Response> {
  return new Promise((resolve, reject) => {
    exec("npm show yt-dlx version", (error, stdout, stderr) => {
      switch (true) {
        case !!error:
          console.error(
            colors.red("@error:"),
            "in",
            process.cwd(),
            error.message
          );
          reject(
            new Response(
              JSON.stringify({
                error:
                  "An unexpected error occurred while processing the GET request.",
              }),
              {
                status: 500,
              }
            )
          );
          break;
        case !!stderr:
          console.error(colors.red("@error:"), "in", process.cwd(), stderr);
          reject(
            new Response(
              JSON.stringify({
                error:
                  "An unexpected error occurred while processing the GET request.",
              }),
              {
                status: 500,
              }
            )
          );
          break;
        default:
          resolve(
            new Response(stdout.trim().toString(), {
              status: 200,
            })
          );
          break;
      }
    });
  });
}
