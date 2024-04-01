import colors from "colors";
export default async function searchVideos({ query }) {
    try {
        const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/searchVideos?query=${query}`, {
            method: "POST",
        });
        const { result } = await response.json();
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
//# sourceMappingURL=searchVideos.js.map