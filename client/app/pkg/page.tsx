"use client";
import Link from "next/link";
import io from "socket.io-client";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import { TiCodeOutline } from "react-icons/ti";
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
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1a1919] scrollbar-track-[#1a1919] scrollbar-thumb-red-600">
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
            yt-dlx
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-screen-2xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLX@{npm?.LatestVersion}
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
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.Single.</span>Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically utilizes yt-dlx&apos;s search
                  algorithm to identify the optimal audio resolution for a given
                  YouTube video link. Employing ffmpeg alongside the best
                  available codecs and bitrate settings, it ensures the delivery
                  of superior audio resolution and saves the file in the (avi)
                  format.
                  <Link
                    href="/pkg/Audio/Single/AudioHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.Single.</span>Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function is automated and employs yt-dlx&apos;s search
                  algorithm to identify the lowest possible audio resolution for
                  a given YouTube video link. Utilizing ffmpeg with the lowest
                  available codecs and bitrate settings, it outputs the minimum
                  audio resolution and saves the file in (avi) format.
                  <Link
                    href="/pkg/Audio/Single/AudioLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.Single.</span>Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  Should you desire to download a specific audio resolution for
                  a given YouTube video link, this function has you covered.
                  Simply provide the available format for the custom resolution,
                  and yt-dlx along with ffmpeg will manage the rest. To identify
                  the available formats, utilize the (list_formats) function.
                  <Link
                    href="/pkg/Audio/Single/AudioCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            {/* ========================[ LIST AUDIO ONLY ]======================== */}
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.List.</span>Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically utilizes yt-dlx&apos;s search
                  algorithm to identify the optimal audio resolution for each
                  video in a a given YouTube Playlist link. Employing ffmpeg
                  alongside the best available codecs and bitrate settings, it
                  ensures the delivery of superior audio resolution and saves
                  each file in the (avi) format.
                  <Link
                    href="/pkg/Audio/List/AudioHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.List.</span>Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function is automated and employs yt-dlx&apos;s search
                  algorithm to identify the lowest possible audio resolution for
                  each video in a a given YouTube Playlist link.. Utilizing
                  ffmpeg with the lowest available codecs and bitrate settings,
                  it outputs the minimum audio resolution and saves each file in
                  (avi) format.
                  <Link
                    href="/pkg/Audio/List/AudioLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio Only:</span>
                <h2 className="text-lg font-bold">
                  Audio<span className="text-red-600">.List.</span>Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  Should you desire to download a specific audio resolution for
                  each video in a a given YouTube Playlist link, this function
                  has you covered. Simply provide the available format for the
                  custom resolution, and yt-dlx along with ffmpeg will manage
                  the rest. To identify the available formats, utilize the
                  (list_formats) function.
                  <Link
                    href="/pkg/Audio/List/AudioCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            {/* ========================[ VIDEO ONLY ]======================== */}
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.Single.</span>Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlx&apos;s search
                  algorithm to identify the optimal video resolution for a given
                  YouTube video link. Utilizing ffmpeg, along with the best
                  available codecs and bitrate settings, it ensures the delivery
                  of superior video resolution and saves the file in the (mkv)
                  format.
                  <Link
                    href="/pkg/Video/Single/VideoHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.Single.</span>Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlx&apos;s search
                  algorithm to identify the minimum achievable video resolution
                  for a given YouTube video link. Utilizing ffmpeg with the
                  lowest available codecs and bitrate settings, it produces the
                  video with the least possible resolution and saves the file in
                  the (mkv) format.
                  <Link
                    href="/pkg/Video/Single/VideoLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.Single.</span>Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  This function caters to your specific needs when it comes to
                  downloading a desired video resolution for a given YouTube
                  video link. Simply provide the available format for the custom
                  resolution, and yt-dlx along with ffmpeg will handle the rest.
                  To identify the available formats, use the (list_formats)
                  function.
                  <Link
                    href="/pkg/Video/Single/VideoCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            {/* ========================[ LIST VIDEO ONLY ]======================== */}
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.List.</span>Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlx&apos;s search
                  algorithm to identify the optimal video resolution for a given
                  YouTube Playlist link. Utilizing ffmpeg, along with the best
                  available codecs and bitrate settings, it ensures the delivery
                  of superior video resolution and saves each file in the (mkv)
                  format.
                  <Link
                    href="/pkg/Video/List/VideoHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.List.</span>Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlx&apos;s search
                  algorithm to identify the minimum achievable video resolution
                  for a given YouTube Playlist link. Utilizing ffmpeg with the
                  lowest available codecs and bitrate settings, it produces the
                  video with the least possible resolution and saves each file
                  in the (mkv) format.
                  <Link
                    href="/pkg/Video/List/VideoLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <FaFileVideo size={25} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video Only:</span>
                <h2 className="text-lg font-bold">
                  Video<span className="text-red-600">.List.</span>Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  This function caters to your specific needs when it comes to
                  downloading a desired video resolution for a given YouTube
                  Playlist link. Simply provide the available format for the
                  custom resolution, and yt-dlx along with ffmpeg will handle
                  the rest. To identify the available formats, use the
                  (list_formats) function.
                  <Link
                    href="/pkg/Video/List/VideoCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            {/* ========================[ AUDIO VIDEO ]======================== */}
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
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
                  the best available codecs and bitrate settings to produce the
                  highest resolution audio+video output, saving the file in
                  (mkv) format.
                  <Link
                    href="/pkg/AudioVideo/Single/AudioVideoHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
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
                  with the least resource-intensive codecs and bitrate settings,
                  it outputs the lowest possible audio+video resolution and
                  saves the file in (mkv) format.
                  <Link
                    href="/pkg/AudioVideo/Single/AudioVideoLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo<span className="text-red-600">.Single.</span>
                  Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  This function caters to your specific needs when it comes to
                  downloading a desired video resolution for a given YouTube
                  video link. Simply provide the available format for the custom
                  resolution, and yt-dlx along with ffmpeg will handle the rest.
                  To identify the available formats, use the (list_formats)
                  function.
                  <Link
                    href="/pkg/AudioVideo/Single/AudioVideoCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            {/* ========================[ LIST AUDIO VIDEO ]======================== */}
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo<span className="text-red-600">.List.</span>
                  Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically utilizes yt-dlx&apos;s search
                  algorithm to identify the optimal audio+video resolution for
                  any given YouTube Playlist link. It employs ffmpeg, leveraging
                  the best available codecs and bitrate settings to produce the
                  highest resolution audio+video output, saving each file in
                  (mkv) format.
                  <Link
                    href="/pkg/AudioVideo/List/AudioVideoHighest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo<span className="text-red-600">.List.</span>
                  Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  This function automatically employs yt-dlx&apos;s search
                  algorithm to identify the lowest possible audio+video
                  resolution for a given YouTube Playlist link. Utilizing ffmpeg
                  with the least resource-intensive codecs and bitrate settings,
                  it outputs the lowest possible audio+video resolution and
                  saves each file in (mkv) format.
                  <Link
                    href="/pkg/AudioVideo/List/AudioVideoLowest"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 rounded-2xl bg-black/20 hover:bg-black/80 hover:scale-105 cursor-pointer shadow-2xl shadow-black/60 hover:shadow-red-800/20 duration-300 border border-red-800/20 hover:border-red-800">
              <div>
                <AiFillCodeSandboxCircle
                  size={35}
                  className="text-red-600 animate-pulse"
                />
                <span className="text-red-600 text-sm">Audio Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo<span className="text-red-600">.List.</span>
                  Custom()
                </h2>
                <p className="text-sm text-gray-400">
                  This function caters to your specific needs when it comes to
                  downloading a desired video resolution for a given YouTube
                  Playlist link. Simply provide the available format for the
                  custom resolution, and yt-dlx along with ffmpeg will handle
                  the rest. To identify the available formats, use the
                  (list_formats) function.
                  <Link
                    href="/pkg/AudioVideo/List/AudioVideoCustom"
                    className="flex items-center animate-pulse cursor-pointer text-red-600 font-extrabold gap-1 mt-2"
                  >
                    <TiCodeOutline className="text-red-600 -mt-2" size={30} />
                    Go To Usage Examples
                  </Link>
                </p>
              </div>
            </div>
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
