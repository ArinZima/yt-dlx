"use client";
import Link from "next/link";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import NavPackage from "@/pages/components/nav";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

export default function AwesomePackage() {
  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-screen-2xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLX@8.1.0
              </h1>
            </div>
            <p className="text-gray-400">
              YT-DLX is a robust multimedia downloading tool meticulously
              crafted to elevate your media consumption experience. With its
              advanced capabilities, it offers an all-encompassing solution for
              effortlessly acquiring audio and video content from diverse
              sources. Drawing inspiration from renowned projects such as
              python-yt-dlp and python-youtube-dl, YT-DLX combines cutting-edge
              features with real-time data acquisition facilitated by Puppeteer
              technologies. Whether you seek to enrich your audio library or
              curate a collection of high-quality videos, YT-DLX stands as your
              indispensable companion, ensuring seamless and efficient media
              acquisition.
            </p>
          </article>
          <div>
            <div className="flex flex-wrap py-2 gap-2 border-b border-red-600 border-dashed">
              <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-gray-400">
                <div className="flex items-center gap-2 md:space-x-2">
                  <TbBrandNpm className="text-red-600" size={50} />
                  <FaYarn className="text-red-600" size={30} />
                  <SiPnpm className="text-red-600" size={30} />
                  <SiBun className="text-red-600" size={30} />
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-8">
              <p className="text-2xl font-semibold text-red-600">
                Install now using any package manager of your choice!
              </p>
              <ul className="ml-4 space-y-1 list-disc text-gray-400">
                <li>
                  <a rel="noopener noreferrer" className="cursor-pointer">
                    <span className="text-red-600">yarn</span> add yt-dlx |{" "}
                    <span className="text-red-600">yarn</span> global add yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" className="cursor-pointer">
                    <span className="text-red-600">bun</span> add yt-dlx |{" "}
                    <span className="text-red-600">bun</span> add -g yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" className="cursor-pointer">
                    <span className="text-red-600">npm</span> install yt-dlx |{" "}
                    <span className="text-red-600">npm</span> install -g yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" className="cursor-pointer">
                    <span className="text-red-600">pnpm</span> install yt-dlx |{" "}
                    <span className="text-red-600">pnpm</span> install -g yt-dlx
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center">
        <div className="max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-screen-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Explore All Available Functions
            </h2>
            <p className="mt-4 text-gray-400">
              yt-dlx accommodates various node.js coding flavours!{" "}
              <span className="text-red-600">
                (typescript), (commonjs) and (esm)
              </span>
              , ensuring 100% compatibility and comprehensive type safety
              coverage.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            {/* ========================[ AUDIO ONLY ]======================== */}
            <Link
              href="/docs/Audio/AudioCustom"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <MdAudioFile
                    size={30}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Audio Only:</span>
                  <h2 className="text-lg font-bold">
                    Audio<span className="text-red-600">.Single.</span>
                    Custom()
                  </h2>
                  <p className="text-sm text-gray-400">
                    Should you desire to download a specific audio resolution
                    for a given YouTube video link, this function has you
                    covered. Simply provide the available format for the custom
                    resolution, and yt-dlx along with ffmpeg will manage the
                    rest. To identify the available formats, utilize the
                    (list_formats) function.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/Audio/AudioHighest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <MdAudioFile
                    size={30}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Audio Only:</span>
                  <h2 className="text-lg font-bold">
                    Audio<span className="text-red-600">.Single.</span>
                    Highest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function automatically utilizes yt-dlx&apos;s search
                    algorithm to identify the optimal audio resolution for a
                    given YouTube video link. Employing ffmpeg alongside the
                    best available codecs and bitrate settings, it ensures the
                    delivery of superior audio resolution and saves the file in
                    the (avi) format.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/Audio/AudioLowest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <MdAudioFile
                    size={30}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Audio Only:</span>
                  <h2 className="text-lg font-bold">
                    Audio<span className="text-red-600">.Single.</span>
                    Lowest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function is automated and employs yt-dlx&apos;s search
                    algorithm to identify the lowest possible audio resolution
                    for a given YouTube video link. Utilizing ffmpeg with the
                    lowest available codecs and bitrate settings, it outputs the
                    minimum audio resolution and saves the file in (avi) format.
                  </p>
                </div>
              </div>
            </Link>
            {/* ========================[ VIDEO ONLY ]======================== */}
            <Link
              href="/docs/Video/VideoCustom"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <FaFileVideo
                    size={25}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Video Only:</span>
                  <h2 className="text-lg font-bold">
                    Video<span className="text-red-600">.Single.</span>
                    Custom()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function caters to your specific needs when it comes to
                    downloading a desired video resolution for a given YouTube
                    video link. Simply provide the available format for the
                    custom resolution, and yt-dlx along with ffmpeg will handle
                    the rest. To identify the available formats, use the
                    (list_formats) function.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/Video/VideoHighest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <FaFileVideo
                    size={25}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Video Only:</span>
                  <h2 className="text-lg font-bold">
                    Video<span className="text-red-600">.Single.</span>
                    Highest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function automatically employs yt-dlx&apos;s search
                    algorithm to identify the optimal video resolution for a
                    given YouTube video link. Utilizing ffmpeg, along with the
                    best available codecs and bitrate settings, it ensures the
                    delivery of superior video resolution and saves the file in
                    the (mkv) format.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/Video/VideoLowest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <FaFileVideo
                    size={25}
                    className="text-red-600 animate-pulse"
                  />
                  <span className="text-red-600 text-sm">Video Only:</span>
                  <h2 className="text-lg font-bold">
                    Video<span className="text-red-600">.Single.</span>
                    Lowest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function automatically employs yt-dlx&apos;s search
                    algorithm to identify the minimum achievable video
                    resolution for a given YouTube video link. Utilizing ffmpeg
                    with the lowest available codecs and bitrate settings, it
                    produces the video with the least possible resolution and
                    saves the file in the (mkv) format.
                  </p>
                </div>
              </div>
            </Link>
            {/* ========================[ AUDIO VIDEO ]======================== */}
            <Link
              href="/docs/AudioVideo/AudioVideoCustom"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <AiFillCodeSandboxCircle
                    size={35}
                    className="text-red-600 animate-spin"
                  />
                  <span className="text-red-600 text-sm">Audio Video:</span>
                  <h2 className="text-lg font-bold">
                    AudioVideo<span className="text-red-600">.Single.</span>
                    Custom()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function caters to your specific needs when it comes to
                    downloading a desired video resolution for a given YouTube
                    video link. Simply provide the available format for the
                    custom resolution, and yt-dlx along with ffmpeg will handle
                    the rest. To identify the available formats, use the
                    (list_formats) function.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/AudioVideo/AudioVideoHighest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <AiFillCodeSandboxCircle
                    size={35}
                    className="text-red-600 animate-spin"
                  />
                  <span className="text-red-600 text-sm">Audio Video:</span>
                  <h2 className="text-lg font-bold">
                    AudioVideo<span className="text-red-600">.Single.</span>
                    Highest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function automatically utilizes yt-dlx&apos;s search
                    algorithm to identify the optimal audio+video resolution for
                    any given YouTube video link. It employs ffmpeg, leveraging
                    the best available codecs and bitrate settings to produce
                    the highest resolution audio+video output, saving the file
                    in (mkv) format.
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/docs/AudioVideo/AudioVideoLowest"
              className="flex items-center hover:animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
            >
              <div className="flex items-start gap-1 p-2 rounded-2xl bg-red-950/10 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
                <div>
                  <AiFillCodeSandboxCircle
                    size={35}
                    className="text-red-600 animate-spin"
                  />
                  <span className="text-red-600 text-sm">Audio Video:</span>
                  <h2 className="text-lg font-bold">
                    AudioVideo<span className="text-red-600">.Single.</span>
                    Lowest()
                  </h2>
                  <p className="text-sm text-gray-400">
                    This function automatically employs yt-dlx&apos;s search
                    algorithm to identify the lowest possible audio+video
                    resolution for a given YouTube video link. Utilizing ffmpeg
                    with the least resource-intensive codecs and bitrate
                    settings, it outputs the lowest possible audio+video
                    resolution and saves the file in (mkv) format.
                  </p>
                </div>
              </div>
            </Link>
            {/* ========================[ GENERAL ]======================== */}
          </div>
        </div>
      </section>
      <footer className="pt-20 pb-6 flex flex-wrap items-baseline justify-center">
        <span className="text-[#e73d75] text-3xl mr-2">
          Mixly <span className="text-[#C4C4C4] text-lg">&</span>{" "}
          <span className="text-red-600">Yt-Dlx</span>
        </span>
        <span className="mt-2 text-sm font-light text-[#C4C4C4]">
          Copyright © 2023
        </span>
      </footer>
    </main>
  );
}
