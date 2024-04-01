import colors from "colors";
export default async function searchPlaylists({ query }) {
    try {
        const response = await fetch(`https://yt-dlx-scrape.vercel.app/api/searchPlaylists?query=${query}`, {
            method: "POST",
        });
        const { result } = await response.json();
        return result;
    }
    catch (error) {
        throw new Error(colors.red("@error: ") + error.message);
    }
}
//# sourceMappingURL=searchPlaylists.js.map