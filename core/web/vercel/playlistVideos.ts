import colors from "colors";
export interface playlistVideosType {
  id: string;
  title: string;
  videoCount: number;
  thumbnails: string[];
}
export default async function playlistVideos({
  playlistId,
}: {
  playlistId: string;
}) {
  try {
    const response = await fetch(
      `https://yt-dlx-scrape.vercel.app/api/playlistVideos?playlistId=${playlistId}`,
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
