import { playlistVideosType } from "../../web";
interface ipop {
    query: string;
}
export default function playlist_data({ query, }: ipop): Promise<playlistVideosType>;
export {};
