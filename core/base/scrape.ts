import axios from "axios";

export interface ScrapeResult {
  stdout: string | null;
  stderr: string | null;
  status: number;
}

export default async function scrape(query: string): Promise<ScrapeResult> {
  try {
    const host = "https://ill-blue-bass-wear.cyclic.app/scrape";
    const response = await axios.get(
      host + "?query=" + encodeURIComponent(query)
    );
    return {
      stdout: response.data.stdout || null,
      stderr: response.data.stderr || null,
      status: response.data.status || null,
    };
  } catch (error) {
    switch (true) {
      case error instanceof Error:
        return {
          stderr: error.message,
          stdout: null,
          status: 500,
        };
      default:
        return {
          stderr: "Internal server error",
          stdout: null,
          status: 500,
        };
    }
  }
}
