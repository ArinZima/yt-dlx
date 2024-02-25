import ytdlx_web from "../../web/ytdlx_web";

export default async function search({
  query,
  number,
}: {
  query: string;
  number: number;
}) {
  try {
    switch (true) {
      case !query || typeof query !== "string":
        return {
          message: "Invalid query parameter",
          status: 500,
        };
      case !number || typeof number !== "number":
        return {
          message: "Invalid number parameter",
          status: 500,
        };
      default:
        return await ytdlx_web.webSearch({ query, number });
    }
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          message: error.message,
          status: 500,
        };
      default:
        return {
          message: "Internal server error",
          status: 500,
        };
    }
  }
}
