"use client";
import Link from "next/link";
import { TbBrandNpm } from "react-icons/tb";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";

export default function AwesomePackage() {
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
            yt-dlx
          </Link>
        </div>
      </nav>
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-6xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLX@5.5.0
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
                  <TbBrandNpm className="text-red-700" size={40} />
                  <p className="text-sm">
                    Latest Updated On{" "}
                    <span className="text-red-600">• recently</span>
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
                  <a rel="noopener noreferrer">
                    <span className="text-red-600">yarn</span> add yt-dlx |{" "}
                    <span className="text-red-600">yarn</span> global add yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer">
                    <span className="text-red-600">bun</span> add yt-dlx |{" "}
                    <span className="text-red-600">bun</span> add -g yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer">
                    <span className="text-red-600">npm</span> install yt-dlx |{" "}
                    <span className="text-red-600">npm</span> install -g yt-dlx
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer">
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
        <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Explore All Available Functions
            </h2>
            <p className="mt-4 text-gray-400">
              yt-dlx accommodates various Node.js coding styles, including
              <span className="text-red-600">
                {" "}
                (commonjs), (esm), (typescript)
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
                <h2 className="text-lg font-bold">
                  Audio().Single().Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio-Only:</span>
                <h2 className="text-lg font-bold">Audio().Single().Lowest()</h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <MdAudioFile size={30} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Audio-Only:</span>
                <h2 className="text-lg font-bold">Audio().Single().Custom()</h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={26} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">
                  Video().Single().Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={26} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">Video().Single().Lowest()</h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <FaFileVideo size={26} className="text-red-600 animate-pulse" />
                <span className="text-red-600 text-sm">Video-Only:</span>
                <h2 className="text-lg font-bold">Video().Single().Custom()</h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MdAudioFile
                    size={30}
                    className="text-red-600 animate-pulse"
                  />
                  <FaFileVideo
                    size={26}
                    className="text-red-600 animate-pulse"
                  />
                </div>
                <span className="text-red-600 text-sm">Audio + Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo().Single().Highest()
                </h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <MdAudioFile
                    size={30}
                    className="text-red-600 animate-pulse"
                  />
                  <FaFileVideo
                    size={26}
                    className="text-red-600 animate-pulse"
                  />
                </div>
                <span className="text-red-600 text-sm">Audio + Video:</span>
                <h2 className="text-lg font-bold">
                  AudioVideo().Single().Lowest()
                </h2>
                <p className="text-sm text-gray-400">
                  Aute velit aliqua eu mollit incididunt id sit reprehenderit
                  eiusmod pariatur magna aliqua enim aliqua. Aute duis labore
                  proident non aute in adipisicing amet aliqua consequat. Dolor
                  aliqua duis pariatur eiusmod esse dolor tempor nostrud amet
                  mollit elit et minim occaecat. Sunt velit veniam ea proident.
                </p>
              </div>
            </div>
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
