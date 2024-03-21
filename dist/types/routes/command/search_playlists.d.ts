import { searchPlaylistsType } from "../../web";
interface ipop {
    query: string;
}
export default function search_playlists({ query, }: ipop): Promise<searchPlaylistsType>;
export {};
