import colors from "colors";
export interface searchPlaylistsType {
  id: string;
  title: string;
  videoCount: number;
  thumbnails: string[];
}
export default async function searchPlaylists({ query }: { query: string }) {
  try {
    const response = await fetch(
      `https://yt-dlx-scrape.vercel.app/api/searchPlaylists?query=${query}`,
      {
        method: "POST",
      }
    );
    const { result } = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(colors.red("@error: ") + error.message);
  }
}
