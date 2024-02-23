import grabber from "./grabber";

export default async function scrape(query: string): Promise<string | null> {
  try {
    const response = await grabber({
      query,
      route: "scrape",
      domain: "https://possible-willingly-yeti.ngrok-free.app",
    });
    if (response !== null) return decodeURIComponent(response);
    else return null;
  } catch (error) {
    return null;
  }
}
