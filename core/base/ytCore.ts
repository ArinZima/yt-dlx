import axios from "axios";

export default async function ytCore(query: string) {
  const host = "https://ill-blue-bass-wear.cyclic.app/core";
  try {
    const response = await axios.get(
      host + "?query=" + encodeURIComponent(query)
    );
    if (response.data !== null) return decodeURIComponent(response.data);
    else return null;
  } catch (error) {
    return null;
  }
}
