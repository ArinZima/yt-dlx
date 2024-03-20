"use client";
import Link from "next/link";
import io from "socket.io-client";
import { TbBrandNpm } from "react-icons/tb";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import { RiSettings3Fill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

export default function AwesomePackage() {
  const [npm, setnpm] = useState<any>(null);
  useEffect(() => {
    fetch("/ioSocket").finally(() => {
      let ioSocket = io();
      ioSocket.emit("npm[meta(req)]");
      const handleNpm = (data: any) => setnpm(data);
      ioSocket.on("npm[meta(resp)]", handleNpm);
      return () => {
        ioSocket.off("npm[meta(resp)]", handleNpm);
        ioSocket.disconnect();
      };
    });
  }, []);

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#101318] scrollbar-track-[#101318] scrollbar-thumb-red-600">
      <nav className="navbar bg-red-500/10 text-gray-400 backdrop-blur-md fixed z-50 top-0">
        <div className="flex flex-wrap items-baseline justify-center">
          <Link
            href="/"
            className="text-[#e73d75] cursor-pointer text-3xl mr-2"
          >
            mixly
          </Link>
          <span className="animate-pulse mr-2">with</span>
          <Link
            href="/pkg"
            className="text-red-600 cursor-pointer text-3xl mr-2"
          >
            yt-dlp
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-6xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLP@{npm?.LatestVersion}
              </h1>
            </div>
            <p className="text-gray-400">
              Uncover an unparalleled solution for effortless audio and video
              downloads powered by YT-DLP - An advanced{" "}
              <span className="text-red-600">
                (command-line + Node.js + Streaming)
              </span>{" "}
              tool meticulously designed for avid enthusiasts. YT-DLP stands out
              as a feature-rich advanced package built upon the foundation of{" "}
              <span className="text-red-600">(Youtube-DL & Python yt-dlp)</span>
              , consistently evolving with state-of-the-art functionalities.
            </p>
          </article>
          <div>
            <div className="flex flex-wrap py-2 gap-2 border-b border-red-600 border-dashed">
              <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-gray-400">
                <div className="flex items-center gap-2 md:space-x-2">
                  <TbBrandNpm className="text-red-700" size={40} />
                  <p className="text-sm">
                    Latest Uploaded On{" "}
                    <span className="text-red-600">• July 19th, 2024</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-8">
              <p className="text-2xl font-semibold text-red-600">
                Install now using any package manager of your choice!
              </p>
              <ul className="ml-4 space-y-1 list-disc text-gray-400">
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="hover:underline"
                  >
                    <span className="text-red-600">yarn</span> add yt-dlp |{" "}
                    <span className="text-red-600">yarn</span> global add yt-dlp
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="hover:underline"
                  >
                    <span className="text-red-600">bun</span> add yt-dlp |{" "}
                    <span className="text-red-600">bun</span> global add yt-dlp
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="hover:underline"
                  >
                    <span className="text-red-600">npm</span> install yt-dlp |{" "}
                    <span className="text-red-600">npm</span> install -g yt-dlp
                  </a>
                </li>
                <li>
                  <a
                    rel="noopener noreferrer"
                    href="#"
                    className="hover:underline"
                  >
                    <span className="text-red-600">pnpm</span> install yt-dlp |{" "}
                    <span className="text-red-600">pnpm</span> install -g yt-dlp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center">
        <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Explore All Available Functions
            </h2>
            <p className="mt-4 text-gray-400">
              yt-dlp accommodates various Node.js coding styles, including
              <span className="text-red-600">
                (commonjs.js), (esm.mjs), (typescript.ts)
              </span>
              , ensuring 100% compatibility and comprehensive type safety
              coverage.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio-Only:</span>
                <h2 className="text-lg font-bold">AudioHighest()</h2>
                <p className="text-sm text-gray-400">
                  This function automatically utilizes yt-dlp&apos;s search
                  algorithm to identify the optimal audio quality for a given
                  YouTube video link. Employing ffmpeg alongside the best
                  available codecs and bitrate settings, it ensures the delivery
                  of superior audio quality and saves the file in the .mp3
                  format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio-Only:</span>
                <h2 className="text-lg font-bold">AudioLowest()</h2>
                <p className="text-sm text-gray-400">
                  This function is automated and employs yt-dlp&apos;s search
                  algorithm to identify the lowest possible audio quality for a
                  given YouTube video link. Utilizing ffmpeg with the lowest
                  available codecs and bitrate settings, it outputs the minimum
                  audio quality and saves the file in .mp3 format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio-Only:</span>
                <h2 className="text-lg font-bold">AudioCustomQuality()</h2>
                <p className="text-sm text-gray-400">
                  Should you desire to download a specific audio quality for a
                  given YouTube video link, this function has you covered.
                  Simply provide the available format for the custom quality,
                  and yt-dlp along with ffmpeg will manage the rest. To identify
                  the available formats, utilize the getFormats() function.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">VideoHighest()</h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlp&apos;s search
                  algorithm to identify the optimal video quality for a given
                  YouTube video link. Utilizing ffmpeg, along with the best
                  available codecs and bitrate settings, it ensures the delivery
                  of superior video quality and saves the file in the .mp4
                  format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">VideoLowest()</h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlp&apos;s search
                  algorithm to identify the minimum achievable video quality for
                  a given YouTube video link. Utilizing ffmpeg with the lowest
                  available codecs and bitrate settings, it produces the video
                  with the least possible quality and saves the file in the .mp4
                  format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">VideoCustomQuality()</h2>
                <p className="text-sm text-gray-400">
                  This function caters to your specific needs when it comes to
                  downloading a desired video quality for a given YouTube video
                  link. Simply provide the available format for the custom
                  quality, and yt-dlp along with ffmpeg will handle the rest. To
                  identify the available formats, use the getFormats() function.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio + Video:</span>
                <h2 className="text-lg font-bold">AudioVideoHighest()</h2>
                <p className="text-sm text-gray-400">
                  This automated function utilizes yt-dlp&apos;s search
                  algorithm to identify the optimal audio+video quality for any
                  given YouTube video link. It employs ffmpeg, leveraging the
                  best available codecs and bitrate settings to produce the
                  highest quality audio+video output, saving the file in .mp4
                  format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio + Video:</span>
                <h2 className="text-lg font-bold">AudioVideoLowest()</h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlp&apos;s search
                  algorithm to identify the lowest possible audio+video quality
                  for a given YouTube video link. Utilizing ffmpeg with the
                  least resource-intensive codecs and bitrate settings, it
                  outputs the lowest possible audio+video quality and saves the
                  file in .mp4 format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <RiSettings3Fill
                  size={35}
                  className="text-red-600 animate-spin"
                />
                <span className="text-red-600 text-sm">
                  Information Retrieval:
                </span>
                <h2 className="text-lg font-bold">getHelp()</h2>
                <p className="text-sm text-gray-400">
                  Utilize this function to access comprehensive information
                  about all available functions and their basic details. This
                  function requires no arguments.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <RiSettings3Fill
                  size={35}
                  className="text-red-600 animate-spin"
                />
                <span className="text-red-600 text-sm">
                  Information Retrieval:
                </span>
                <h2 className="text-lg font-bold">getFormats()</h2>
                <p className="text-sm text-gray-400">
                  This function serves to identify all potential formats
                  associated with a video. Utilize this functionality to obtain
                  comprehensive information about available video formats.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <RiSettings3Fill
                  size={35}
                  className="text-red-600 animate-spin"
                />
                <span className="text-red-600 text-sm">
                  Information Retrieval:
                </span>
                <h2 className="text-lg font-bold">getVideoInfo()</h2>
                <p className="text-sm text-gray-400">
                  Utilize this function to retrieve comprehensive video metadata
                  information.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <RiSettings3Fill
                  size={35}
                  className="text-red-600 animate-spin"
                />
                <span className="text-red-600 text-sm">
                  Information Retrieval:
                </span>
                <h2 className="text-lg font-bold">getRaw()</h2>
                <p className="text-sm text-gray-400">
                  This advanced function leverages yt-dlp&apos;s engine to
                  generate comprehensive JSON data, providing detailed
                  information about the content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="pt-20 pb-6 flex flex-wrap items-baseline justify-center">
        <span className="text-[#e73d75] text-3xl mr-2">
          Mixly <span className="text-[#C4C4C4] text-lg">&</span>{" "}
          <span className="text-red-600">Yt-Dlp</span>
        </span>
        <span className="mt-2 text-sm font-light text-[#C4C4C4]">
          Copyright © 2023
        </span>
      </footer>
    </main>
  );
}
