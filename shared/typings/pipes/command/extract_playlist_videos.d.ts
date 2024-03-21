import type { EngineOutput } from "../../base/Engine";
export default function extract_playlist_videos({ playlistUrls, }: {
    playlistUrls: string[];
}): Promise<EngineOutput[]>;
