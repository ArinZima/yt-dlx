import { searchVideosType } from "../../web";
interface ipop {
    query: string;
}
export default function search_videos({ query, }: ipop): Promise<searchVideosType>;
export {};
