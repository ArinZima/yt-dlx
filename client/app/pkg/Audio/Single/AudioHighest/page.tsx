"use client";
import Link from "next/link";
import io from "socket.io-client";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function AwesomePackage() {
  const [npm, setnpm] = useState<any>(null);
  const [isTS, setTS] = useState(true);
  const [isCJS, setCJS] = useState(true);
  const [isMJS, setMJS] = useState(true);

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
              Uncover an unparalleled solution for effortless audio and video
              downloads powered by YT-DLX - An advanced{" "}
              <span className="text-red-600">
                (command-line + Node.js + Streaming)
              </span>{" "}
              tool meticulously designed for avid enthusiasts. YT-DLX stands out
              as a feature-rich advanced package built upon the foundation of{" "}
              <span className="text-red-600">(Youtube-DL & Python yt-dlx)</span>
              , consistently evolving with state-of-the-art functionalities.
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
        <div className="max-w-screen-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-screen-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Viewing YtDlx.Audio.Single.Highest()
            </h2>
            <p className="mt-4 text-gray-400">
              yt-dlx accommodates various node.js coding flavours!{" "}
              <span className="text-red-600">(typescript), (commonjs),</span>{" "}
              and <span className="text-red-600">(esm)</span>, ensuring 100%
              compatibility and comprehensive type safety coverage.
            </p>
            <ul className="list-disc m-4">
              <li>
                Downloads and processes the highest quality audio from a single
                YouTube video.
              </li>
              <li>@param query - The YouTube video URL or ID.</li>
              <li>
                @param output - (optional) The output directory for the
                processed file.
              </li>
              <li>
                @param stream - (optional) Whether to stream the processed video
                or not.
              </li>
              <li>
                @param verbose - (optional) Whether to log verbose output or
                not.
              </li>
              <li>
                @param filter - (optional) The audio filter to apply. Available
                options: "echo", "slow", "speed", "phaser", "flanger",
                "panning", "reverse", "vibrato", "subboost", "surround",
                "bassboost", "nightcore", "superslow", "vaporwave",
                "superspeed".
              </li>
              <li>
                @param onionTor - (optional) Whether to use Tor for the download
                or not.
              </li>
              <li>
                @returns A Promise that resolves with either `void` (if `stream`
                is false) or an object containing the `ffmpeg` instance and the
                output filename (if `stream` is true).
              </li>
            </ul>
            <div className={`mt-8 ${isTS ? "hidden" : "block"}`}>
              <div className="text-gray-400 bg-black/40 shadow-2xl shadow-black/60 p-4 rounded-xl border border-blue-600/40">
                <SyntaxHighlighter language="typescript" style={gruvboxDark}>
                  {`import ytdlx from "yt-dlx";
import * as fs from "fs";

(async () => {
  try {
    console.log("@info: with stream: false");
    await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: false, // optional
    });

    console.log("@info: with stream: true");
    const result = await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: true, // optional
    });
    const { ffmpeg, filename } = result;
    ffmpeg.pipe(fs.createWriteStream(filename)); // use any fluent-ffmpeg based commands like pipe.
  } catch (error) {
    console.error(error);
  }
})();`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className={`mt-8 ${isMJS ? "hidden" : "block"}`}>
              <div className="text-gray-400 bg-black/40 shadow-2xl shadow-black/60 p-4 rounded-xl border border-lime-600/40">
                <SyntaxHighlighter language="typescript" style={gruvboxDark}>
                  {`import ytdlx from "yt-dlx";
import * as fs from "fs";
 
(async () => {
  try {
    console.log("@info: with stream: false");
    await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: false, // optional
    });

    console.log("@info: with stream: true");
    const result = await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: true, // optional
    });
    const { ffmpeg, filename } = result;
    ffmpeg.pipe(fs.createWriteStream(filename)); // use any fluent-ffmpeg based commands like pipe.
  } catch (error) {
    console.error(error);
  }
})();`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className={`mt-8 ${isCJS ? "hidden" : "block"}`}>
              <div className="text-gray-400 bg-black/40 shadow-2xl shadow-black/60 p-4 rounded-xl border border-yellow-600/40">
                <SyntaxHighlighter language="javascript" style={gruvboxDark}>
                  {`const ytdlx = require("yt-dlx");
const fs = require("fs");
 
(async () => {
  try {
    console.log("@info: with stream: false");
    await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: false, // optional
    });

    console.log("@info: with stream: true");
    const result = await ytdlx.Audio.Single.Highest({
      query: "video-link-or-video-name-or-video-id",
      filter: "flanger", // optional
      onionTor: false, // optional
      output: "audio", // optional
      verbose: false, // optional
      stream: true, // optional
    });
    const { ffmpeg, filename } = result;
    ffmpeg.pipe(fs.createWriteStream(filename)); // use any fluent-ffmpeg based commands like pipe.
  } catch (error) {
    console.error(error);
  }
})();`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setTS(!isTS)}
                className="mt-2 bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-800"
              >
                {isTS ? "View TypeScript Example" : "Hide TypeScript Example"}
              </button>
              <button
                onClick={() => setMJS(!isMJS)}
                className="mt-2 bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-lime-800 focus:outline-none focus:bg-lime-800"
              >
                {isMJS ? "View ECMAScript Example" : "Hide ECMAScript Example"}
              </button>
              <button
                onClick={() => setCJS(!isCJS)}
                className="mt-2 bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-yellow-800 focus:outline-none focus:bg-yellow-800"
              >
                {isCJS ? "View Commonjs Usage" : "Hide Commonjs Example"}
              </button>
            </div>
            {/*  */}
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
