import Link from "next/link";
import { MdAudioFile } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa6";
import { SiFirefoxbrowser } from "react-icons/si";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

export default function Documentation() {
  return (
    <section
      id="Documentation"
      className="flex flex-col items-center justify-center"
    >
      <div className="max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="max-w-screen-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
            Explore All Available Functions
          </h2>
          <p className="mt-4 text-white/80">
            YT-DLX accommodates various node.js coding flavours!{" "}
            <span className="text-red-600">
              (typescript), (commonjs) and (esm)
            </span>
            , ensuring 100% compatibility and comprehensive type safety
            coverage.
          </p>
        </div>
        {/* ========================[ AUDIO ONLY ]======================== */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 hover:bg-red-950/10 border-4 border-red-600 border-double rounded-3xl shadow-red-600 duration-500 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="table text-white/80">
              <thead>
                <tr>
                  <th className="text-red-600 text-lg">Function Category</th>
                  <th className="text-red-600 text-lg">Function Call</th>
                  <th className="text-red-600 text-lg">Brief Description</th>
                  <th className="text-red-600 text-lg">Usage & Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <MdAudioFile
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Only
                  </td>
                  <td>Audio.Single.Highest</td>
                  <td>
                    Downloads and processes the highest quality audio from a
                    single YouTube video.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Audio/AudioHighest" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <MdAudioFile
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Only
                  </td>
                  <td>Audio.Single.Lowest</td>
                  <td>
                    Downloads and processes the lowest quality audio from a
                    single YouTube video.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Audio/AudioLowest" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <MdAudioFile
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Only
                  </td>
                  <td>Audio.Single.Custom</td>
                  <td>
                    Downloads and processes a single YouTube video with audio
                    customization options.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Audio/AudioCustom" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                {/* ========================[ VIDEO ONLY ]======================== */}
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <FaFileVideo
                      size={18}
                      className="text-red-600 animate-pulse"
                    />
                    Video Only
                  </td>
                  <td>Video.Single.Highest</td>
                  <td>
                    Downloads the highest quality version of a YouTube video
                    with customization options.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Video/VideoHighest" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <FaFileVideo
                      size={18}
                      className="text-red-600 animate-pulse"
                    />
                    Video Only
                  </td>
                  <td>Video.Single.Lowest</td>
                  <td>
                    Downloads the lowest quality version of a YouTube video with
                    customization options.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Video/VideoLowest" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <FaFileVideo
                      size={18}
                      className="text-red-600 animate-pulse"
                    />
                    Video Only
                  </td>
                  <td>Video.Single.Custom</td>
                  <td>Downloads a YouTube video with customization options.</td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Video/VideoCustom" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                {/* ========================[ AUDIO VIDEO ]======================== */}
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <AiFillCodeSandboxCircle
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Video
                  </td>
                  <td>AudioVideo.Single.Highest</td>
                  <td>
                    Downloads audio and video from a YouTube video URL with the
                    highest available resolution.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/AudioVideo/AudioVideoHighest"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <AiFillCodeSandboxCircle
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Video
                  </td>
                  <td>AudioVideo.Single.Lowest</td>
                  <td>
                    Downloads audio and video from a YouTube video URL with the
                    lowest available resolution.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/AudioVideo/AudioVideoLowest"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <AiFillCodeSandboxCircle
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Audio Video
                  </td>
                  <td>AudioVideo.Single.Custom</td>
                  <td>
                    Downloads audio and video from a YouTube video URL with
                    customizable options.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/AudioVideo/AudioVideoCustom"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                {/* ========================[ YTSEARCH ]======================== */}
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <SiFirefoxbrowser
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    YouTube Search
                  </td>
                  <td>Video.Single</td>
                  <td>
                    Fetches data for a single YouTube video based on the video
                    ID or link.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Command/video_data" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <SiFirefoxbrowser
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    YouTube Search
                  </td>
                  <td>Video.Multiple</td>
                  <td>Searches for YouTube videos based on the query.</td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/Command/search_videos"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <SiFirefoxbrowser
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    YouTube Search
                  </td>
                  <td>Playlist.Single</td>
                  <td>Extracts metadata for videos in a YouTube playlist.</td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/Command/playlist_data"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <SiFirefoxbrowser
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    YouTube Search
                  </td>
                  <td>Playlist.Multiple</td>
                  <td>Searches for YouTube playlists based on the query.</td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/Command/search_playlist"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
                {/* ========================[ INFO GATHERER ]======================== */}
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <FaLightbulb
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Info Gatherer
                  </td>
                  <td>info.extract</td>
                  <td>Extracts metadata information from a YouTube video.</td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link href="/docs/Command/extract" className="font-bold">
                      click here!
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-red-600/20">
                  <td className="flex items-center justify-center gap-2">
                    <FaLightbulb
                      size={20}
                      className="text-red-600 animate-pulse"
                    />
                    Info Gatherer
                  </td>
                  <td>info.list_formats</td>
                  <td>
                    Lists the available formats and manifest information for a
                    YouTube video.
                  </td>
                  <td className="cursor-pointer hover:bg-red-800 hover:animate-pulse rounded-r-3xl text-white">
                    <Link
                      href="/docs/Command/list_formats"
                      className="font-bold"
                    >
                      click here!
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
