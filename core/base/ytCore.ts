import axios from "axios";

export default async function ytCore(query: string) {
  const host = "https://creepy-fly-kimono.cyclic.app/";
  try {
    const response = await axios.get(
      host + "?query=" + encodeURIComponent(query)
    );
    if (response.data.status === 200) return response.data.stdout;
    else return null;
  } catch (error) {
    return null;
  }
}
