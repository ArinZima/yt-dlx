"use client";
import react from "react";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import NavPackage from "@/pages/components/nav";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function AwesomePackage() {
  const QueryClient = useQueryClient();
  const [Query, setQuery] = react.useState<string>("");
  const [TubeSearch, setTubeSearch] = react.useState<any>(null);
  const [GeneralError, setGeneralError] = react.useState<string | any>(null);

  const ApiSearch = useMutation({
    mutationFn: async () => {
      const resp = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: Query,
        }),
      });
      if (resp.status === 200) setTubeSearch(await resp.json());
      else setGeneralError("Error fetching SearchData ...");
    },
    onError: (error) => setGeneralError(error.message),
    onMutate: () => console.log("ApiSearch started!"),
  });
  if (TubeSearch) console.log(TubeSearch);

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
      {/* ======================================================[ Introduction ]======================================================= */}
      <section className="flex flex-col items-center justify-center mt-20">
        <div className="max-w-screen-2xl px-6 py-16 mx-auto space-y-12">
          <article className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl text-red-600 font-bold lg:text-9xl">
                YT-DLX@8.2.0
              </h1>
            </div>
            <p className="text-white/80">
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
              <div className="flex flex-col items-start justify-between w-full md:flex-row md:items-center text-white/80">
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
              <ul className="ml-4 space-y-1 list-disc text-white/80">
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
      {/* ======================================================[ PLAYGROUND ]======================================================= */}
      <section className="flex flex-col items-center justify-center">
        <div className="max-w-screen-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-screen-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl text-red-600">
              Yt-Dlx PlayGround
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
          <section className="mt-8 grid grid-cols-1 gap-8 md:mt-16 hover:bg-red-950/10 border-4 border-red-600 border-double rounded-3xl shadow-red-600 duration-500 shadow-2xl">
            <div className="overflow-x-auto">
              <section className="grid grid-cols-1 gap-0 lg:grid-cols-12">
                <div className="w-full col-span-1 p-4 mx-auto mt-6 lg:col-span-8 xl:p-12 md:w-2/4">
                  <h1 className="mt-6 mb-4 text-3xl font-black text-left text-red-600">
                    Effortless Audio Video Downloader And Streamer!
                  </h1>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setTubeSearch(null);
                      ApiSearch.mutate();
                    }}
                    className="pb-1 space-y-4"
                  >
                    <label className="form-control w-full max-w-xs">
                      <div className="label">
                        <span className="label-text text-xs text-red-600 font-bold">
                          Provide Video Link!
                        </span>
                        <span className="label-text-alt text-red-600 font-bold">
                          Provide Video ID!
                        </span>
                      </div>
                      <input
                        required
                        type="text"
                        value={Query}
                        placeholder="required"
                        disabled={ApiSearch.isPending}
                        onChange={(e) => setQuery(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                      <div className="label">
                        <span className="label-text-alt text-red-600 font-bold">
                          Provide Video Name!
                        </span>
                        <span className="label-text-alt text-red-600 font-bold">
                          Copyright © 2024
                        </span>
                      </div>
                    </label>
                    <button
                      type="submit"
                      disabled={ApiSearch.isPending}
                      className="btn btn-wide bg-red-800 hover:bg-red-600 duration-500 text-white font-bold ml-4"
                    >
                      Search YouTube
                    </button>
                  </form>
                </div>
                <div className="col-span-1 lg:col-span-4">
                  <img
                    loading="lazy"
                    src="/yt-dlx.png"
                    alt="3 women looking at a laptop"
                    className="object-cover w-full h-64 min-h-full"
                  />
                </div>
              </section>
              {TubeSearch && (
                <react.Fragment>
                  <section className="px-4 py-24 mx-auto max-w-7xl">
                    <h2 className="pb-8 mb-12 text-2xl font-extrabold leading-tight text-red-600 border-b-4 border-double border-red-600 md:text-6xl">
                      YouTube Results
                    </h2>
                    <div className="w-full xl:w-4/6">
                      <div className="flex flex-col space-y-16">
                        {TubeSearch &&
                          TubeSearch.map((item: any, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-6 md:grid-cols-4"
                            >
                              <img
                                alt="Kutty"
                                loading="lazy"
                                src={item.thumbnails[0].url}
                                className="object-cover w-full h-40 col-span-1 bg-center rounded-3xl duration-300 shadow-black shadow-2xl border border-red-600"
                              />
                              <div className="col-span-1 md:col-span-3">
                                <h2 className="mb-2 text-2xl font-extrabold leading-snug text-red-600">
                                  {item.title}
                                </h2>
                                <ul className="mb-3 list-disc ml-4">
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @description:
                                    </span>{" "}
                                    {item.description}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @videoId:
                                    </span>{" "}
                                    {item.id}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @channelid:
                                    </span>{" "}
                                    {item.channelid}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @channelname:
                                    </span>{" "}
                                    {item.channelname}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @duration:
                                    </span>{" "}
                                    {item.duration}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @uploadDate:
                                    </span>{" "}
                                    {item.uploadDate}
                                  </li>
                                  <li>
                                    <span className="text-red-600 font-bold">
                                      @viewCount:
                                    </span>{" "}
                                    {item.viewCount}
                                  </li>
                                </ul>
                                <div className="flex items-left justify-left gap-2">
                                  <button className="btn bg-red-800 hover:bg-red-600 shadow-black shadow-2xl text-white font-bold btn-wide">
                                    stream now!
                                  </button>
                                  <button className="btn bg-red-800 hover:bg-red-600 shadow-black shadow-2xl text-white font-bold btn-wide">
                                    download!
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </section>
                </react.Fragment>
              )}
            </div>
          </section>
        </div>
      </section>
      {/* ======================================================[ Footer ]======================================================= */}
      <footer className="pt-20 pb-6 flex flex-wrap items-baseline justify-center">
        <span className="text-[#e73d75] text-3xl mr-2">
          Mixly <span className="text-[#C4C4C4] text-lg">&</span>{" "}
          <span className="text-red-600">Yt-Dlx</span>
        </span>
        <span className="mt-2 text-sm font-light text-[#C4C4C4]">
          Copyright © 2024
        </span>
      </footer>
    </main>
  );
}
