import ytDlpx from "./ytDlpx";

export default async function scrape(query: string): Promise<string | null> {
  try {
    const response = await ytDlpx({
      query,
      route: "scrape",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    if (response !== null) return decodeURIComponent(response);
    else return null;
  } catch (error) {
    return null;
  }
}
