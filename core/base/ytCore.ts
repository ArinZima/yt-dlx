import ytcprox from "./ytcprox";

export default async function ytCore(query: string) {
  try {
    const response = await ytcprox({
      query,
      route: "core",
      domain: "https://casual-insect-sunny.ngrok-free.app",
    });
    if (response !== null) return decodeURIComponent(response);
    else return null;
  } catch (error) {
    return null;
  }
}
