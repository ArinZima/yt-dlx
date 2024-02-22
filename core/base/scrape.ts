import axios from "axios";

export default async function scrape(query: string): Promise<string | null> {
  try {
    const host = "https://multiply-ample-hornet.ngrok-free.app/scrape";
    const response = await axios.get(
      host + "?query=" + encodeURIComponent(query)
    );
    if (response.data !== null) return decodeURIComponent(response.data);
    else return null;
  } catch (error) {
    return null;
  }
}
