import ytDlpx from "./ytDlpx";

export default async function ytdlp(query: string): Promise<string | null> {
  try {
    const response = await ytDlpx({
      query,
      route: "core",
      domain: "https://stirring-physically-piglet.ngrok-free.app",
    });
    if (response !== null) return decodeURIComponent(response);
    else return null;
  } catch (error) {
    return null;
  }
}
