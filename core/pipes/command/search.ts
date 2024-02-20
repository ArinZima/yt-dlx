import scrape from "../../base/scrape";

export default async function search({ query }: { query: string }) {
  try {
    switch (true) {
      case !query || typeof query !== "string":
        return {
          message: "Invalid query parameter",
          status: 500,
        };
      default:
        return (await scrape(query)).stdout;
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
