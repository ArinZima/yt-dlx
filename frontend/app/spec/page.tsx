"use client";
import Image from "next/image";
import NavPackage from "@/pages/components/nav";
import FootPackage from "@/pages/components/foot";

export default function home() {
  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
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
          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 bg-red-950/10 border-4 border-red-600 border-double rounded-3xl shadow-red-600 duration-500 shadow-2xl">
            <div className="overflow-x-auto">
              <section className="max-w-2xl px-6 py-8 mx-auto">
                <div className="mt-8">
                  <iframe
                    allowFullScreen
                    title="YouTube video player"
                    src="https://www.youtube.com/embed/zwf5MpcuKDM"
                    className="w-full h-64 my-10 rounded-3xl md:h-80 shadow-2xl shadow-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                  <h2 className="mt-6 text-4xl font-bold text-white/80">
                    Masego + FKJ - Tadow
                  </h2>
                  <p className="mt-2 leading-loose text-white/80 lowercase">
                    <span className="text-red-600 font-bold">
                      @description:{" "}
                    </span>
                    Laborum officia mollit reprehenderit aliqua voluptate tempor
                    incididunt sint in nisi tempor commodo laborum magna.
                    Voluptate consequat velit eiusmod ut elit do in excepteur.
                    Exercitation ullamco nulla id id. Velit sint fugiat magna
                    est veniam adipisicing. Excepteur magna quis est ad eu.
                  </p>
                  <ul className="mt-2 text-white/80 list-disc">
                    <li>
                      <span className="text-red-600 font-bold">@videoId:</span>{" "}
                      zwf5MpcuKDM
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">
                        @channelid:
                      </span>{" "}
                      UCmfMTajxmbEKe0A1rQJ4p0A
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">
                        @channelname:
                      </span>{" "}
                      Masego
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">@duration:</span>{" "}
                      302
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">
                        @uploadDate:
                      </span>{" "}
                      5 Oct 2017
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">
                        @viewCount:
                      </span>{" "}
                      46132383
                    </li>
                    <li>
                      <span className="text-red-600 font-bold">
                        @thumbnail:
                      </span>{" "}
                      https://i.ytimg.com/vi/zwf5MpcuKDM/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGkgaShpMA8=&rs=AOn4CLD9e9_GYozo2RCN_atWCoOXAH6hTQ
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <div className="mt-4 -mx-2">
                    <a className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm overflow-hidden text-white duration-300 bg-red-900 hover:bg-red-700 rounded-3xl shadow-black shadow-2xl hover:shadow-red-900 hover:scale-105 duration300 transition-transform sm:w-auto sm:mx-2 cursor-pointer">
                      <span className="mx-2 font-bold">
                        Get it as 'Audio Only'
                      </span>
                    </a>
                    <a className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm overflow-hidden text-white duration-300 bg-red-900 hover:bg-red-700 rounded-3xl shadow-black shadow-2xl hover:shadow-red-900 hover:scale-105 duration300 transition-transform sm:w-auto sm:mx-2 cursor-pointer">
                      <span className="mx-2 font-bold">
                        Get it as 'Video Only'
                      </span>
                    </a>
                    <a className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm overflow-hidden text-white duration-300 bg-red-900 hover:bg-red-700 rounded-3xl shadow-black shadow-2xl hover:shadow-red-900 hover:scale-105 duration300 transition-transform sm:w-auto sm:mx-2 cursor-pointer">
                      <span className="mx-2 font-bold">
                        Get it as 'Audio + Video'
                      </span>
                    </a>
                  </div>
                  <p className="mt-6 text-xs text-white/80 font-bold">
                    Everything Is Provided Free Of Cost To You With The Power Of
                    Yt-Dlx Copyright © 2024
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <FootPackage />
    </main>
  );
}
