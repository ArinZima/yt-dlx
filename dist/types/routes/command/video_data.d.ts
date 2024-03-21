import { singleVideoType } from "../../web";
interface ipop {
    query: string;
}
export default function video_data({ query, }: ipop): Promise<singleVideoType>;
export {};
