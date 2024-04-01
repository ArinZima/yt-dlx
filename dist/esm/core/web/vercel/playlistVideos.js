import colors from "colors";
export default async function playlistVideos({ playlistId, }) {
    try {
        const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/playlistVideos?playlistId=${playlistId}`, {
            method: "POST",
        });
        const { result } = await response.json();
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
//# sourceMappingURL=playlistVideos.js.map