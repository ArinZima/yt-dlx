import ytcprox from "./ytcprox";

export default async function scrape(query: string): Promise<string | null> {
  try {
    const response = await ytcprox({
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
