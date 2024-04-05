"use client";
import Link from "next/link";
import React, { useState } from "react";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import NavPackage from "@/pages/components/nav";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

export default function AwesomePackage() {
  const [fd, setfd] = useState({
    audioVideo: false,
    videoOnly: false,
    audioOnly: false,
    highest: false,
    lowest: false,
    videoId: "",
  });
  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setfd((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleForm = (event: any) => {
    event.preventDefault();
    console.log(fd);
  };

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
      {/* ======================================================[ Introduction ]======================================================= */}
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-screen-2xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLX@8.1.0
              </h1>
            </div>
            <p className="text-red-200/80">
              Yt-Dlx Is A Robust Multimedia Downloading Tool Meticulously
              Crafted To Elevate Your Media Consumption Experience. With Its
              Advanced Capabilities, It Offers An All-Encompassing Solution For
              Effortlessly Acquiring Audio And Video Content From Diverse
              Sources. Drawing Inspiration From Renowned Projects Such As
              Python-Yt-Dlp And Python-Youtube-Dl, Yt-Dlx Combines Cutting-Edge
              Features With Real-Time Data Acquisition Facilitated By Puppeteer
              Technologies. Whether You Seek To Enrich Your Audio Library Or
              Curate A Collection Of High-Quality Videos, Yt-Dlx Stands As Your
              Indispensable Companion, Ensuring Seamless And Efficient Media
              Acquisition.
            </p>
          </article>
          <div>
            <div className="flex flex-wrap py-2 gap-2 border-b border-red-600 border-dashed">
              <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-red-200/80">
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
                Install Now Using Any Package Manager Of Your Choice!
              </p>
              <ul className="ml-4 space-y-1 list-disc text-red-200/80">
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
      {/* ======================================================[ PlayGround ]======================================================= */}
      <section className="flex items-center justify-center">
        <div className="justify-center mx-auto text-left align-bottom transition-all transform bg-neutral-900 rounded-3xl max-w-screen-xl max-screen-w-4xl border-8 border-double border-red-600 shadow-red-600/60 shadow-2xl hover:shadow-red-600 duration-300">
          <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-3xl">
            <div className="w-full px-6 py-3">
              <div className="mt-3 text-left sm:mt-5">
                <div className="inline-flex items-center w-full">
                  <h3 className="text-lg font-bold text-red-600 leading-6 lg:text-5xl">
                    Yt-Dlx PlayGround
                    <span className="text-sm gap-2">(GUI mode)</span>
                  </h3>
                </div>
                <div className="mt-4 text-base text-red-600">
                  <p>
                    please make sure to read the documentation for proper usage.
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <form onSubmit={(event) => handleForm(event)}>
                  <div>
                    <label htmlFor="videoId" className="sr-only">
                      YouTube Video-Id/Link/Name
                    </label>
                    <input
                      required
                      type="text"
                      id="videoId"
                      name="videoId"
                      value={fd.videoId}
                      onChange={handleChange}
                      className="block w-full px-5 py-3 text-base text-red-600 placeholder-neutral-500 transition duration-600 ease-in-out transform border border-transparent rounded-lg bg-neutral-800 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-red-800 focus:ring-offset-2 focus:ring-offset-red-600"
                      placeholder="YouTube Video-Id/Link/Name"
                    />
                  </div>
                  <div className="flex space-x-2 items-center mt-2">
                    <input
                      type="checkbox"
                      onChange={() => (fd.audioOnly = !fd.audioOnly)}
                      className="checkbox checkbox-xs checkbox-error"
                    />
                    <label
                      htmlFor="audioOnly"
                      className="text-red-600 font-bold text-sm lowercase"
                    >
                      Audio Only
                    </label>
                    <input
                      type="checkbox"
                      onChange={() => (fd.videoOnly = !fd.videoOnly)}
                      className="checkbox checkbox-xs checkbox-error"
                    />
                    <label
                      htmlFor="videoOnly"
                      className="text-red-600 font-bold text-sm lowercase"
                    >
                      Video Only
                    </label>
                    <input
                      type="checkbox"
                      onChange={() => (fd.audioVideo = !fd.audioVideo)}
                      className="checkbox checkbox-xs checkbox-error"
                    />
                    <label
                      htmlFor="audioVideo"
                      className="text-red-600 font-bold text-sm lowercase"
                    >
                      Audio & Video
                    </label>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="checkbox"
                      onChange={() => (fd.highest = !fd.highest)}
                      className="checkbox checkbox-xs checkbox-error"
                    />
                    <label
                      htmlFor="highest"
                      className="text-red-600 font-bold text-sm lowercase"
                    >
                      Highest
                    </label>
                    <input
                      type="checkbox"
                      onChange={() => (fd.lowest = !fd.lowest)}
                      className="checkbox checkbox-xs checkbox-error"
                    />
                    <label
                      htmlFor="lowest"
                      className="text-red-600 font-bold text-sm lowercase"
                    >
                      Lowest
                    </label>
                  </div>
                  <div className="mt-4">
                    <input
                      type="submit"
                      value="Submit"
                      className="py-2 px-6 bg-red-800 text-white rounded-md text-lg font-semibold hover:bg-red-600 shadow-red-600/20 shadow-2xl transition duration-300"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="order-first hidden w-full lg:block">
              <img
                alt=""
                src="/yt-dlx.png"
                className="object-cover h-full bg-cover"
              />
            </div>
          </div>
        </div>
      </section>
      {/* ======================================================[ Documentation ]======================================================= */}
      <section className="flex flex-col items-center justify-center">
        <div className="max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-screen-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Explore All Available Functions
            </h2>
            <p className="mt-4 text-red-200/80">
              YT-DLX accommodates various node.js coding flavours!{" "}
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
                  <p className="text-sm text-red-200/80">
                    Should You Desire To Download A Specific Audio Resolution
                    For A Given Youtube Video Link, This Function Has You
                    Covered. Simply Provide The Available Format For The Custom
                    Resolution, And Yt-Dlx Along With Ffmpeg Will Manage The
                    Rest. To Identify The Available Formats, Utilize The
                    (list_formats) Function.
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
                  <p className="text-sm text-red-200/80">
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
      {/* ======================================================[ Footer ]======================================================= */}
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
