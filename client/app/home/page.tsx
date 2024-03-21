"use client";
import Link from "next/link";
import Image from "next/image";
import { TiPlus } from "react-icons/ti";
import { FaLink } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { MdAudiotrack } from "react-icons/md";
import { LuSearchCode } from "react-icons/lu";
import { FaAddressCard } from "react-icons/fa6";
import { MdPermIdentity } from "react-icons/md";
import { TbDiamondFilled } from "react-icons/tb";
import { MdFamilyRestroom } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function Component() {
  const QueryClient = useQueryClient();
  const [Query, setQuery] = useState<string>("");
  const [Tube, setTube] = useState<object | any>(null);
  const [TubeSearch, setTubeSearch] = useState<object | any>(null);
  const [GeneralError, setGeneralError] = useState<string | any>(null);

  const ApiSearch = useMutation({
    mutationFn: async () => {
      const resp = await fetch("/api/util/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Query,
        }),
      });
      setTubeSearch(null);
      if (resp.status === 200) setTubeSearch(await resp.json());
      else setGeneralError("Error fetching SearchData ...");
    },
    onError: (error) => setGeneralError(error.message),
    onMutate: () => console.log("ApiSearch started!"),
  });

  const getTube = useMutation({
    mutationFn: async (yturl) => {
      const resp = await fetch("/api/util/EnResp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yturl,
        }),
      });
      setTube(null);
      if (resp.status === 200) setTube(await resp.json());
      else setGeneralError("Error fetching AudioData ...");
    },
    onError: (error) => setGeneralError(error.message),
    onMutate: () => console.log("getTube started!"),
  });

  useEffect(() => {
    if (TubeSearch && ApiSearch.isSuccess) {
      const searchSelect = document.getElementById("TubeSearch()");
      if (searchSelect) searchSelect.scrollIntoView({ behavior: "smooth" });
    }
  }, [TubeSearch, ApiSearch.isSuccess]);

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#101318] scrollbar-track-[#101318] scrollbar-thumb-pink-600">
      <nav className="navbar bg-[#611952]/10 text-gray-400 backdrop-blur-md fixed z-50 top-0">
        <div className="flex flex-wrap items-baseline justify-center">
          <Link href="/" className="text-pink-600 cursor-pointer text-3xl mr-2">
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
      <section className="relative flex flex-col items-center justify-center h-screen py-20 p-2">
        {GeneralError && (
          <span className="text-red-600 bg-red-900/20 mb-2 rounded-2xl p-1 border border-red-600/40">
            {GeneralError}
          </span>
        )}
        <div className="relative items-center w-full px-5 pb-12 mx-auto">
          <div className="relative h-full flex flex-col items-center justify-center text-center text-[#C4C4C4]">
            <Link
              href="/pkg"
              className="flex items-center justify-center px-4 -mb-14 text-sm gap-2 p-1 italic text-pink-600 bg-red-900/20 rounded-xl"
            >
              powered by
              <TbDiamondFilled size={20} />
              <span className="font-bold not-italic text-red-600">yt-dlp</span>
            </Link>
            <h1 className="text-[180px] xl:text-[300px] font-bold animate-pulse text-shadow-lg shadow-pink-600 font-AspireDemibold text-transparent bg-clip-text bg-gradient-to-r from-[#c7595e] via-fuchsia-700 to-violet-700">
              Mixly
            </h1>
            <p className="max-w-6xl -mt-10 mx-auto text-sm xl:text-lg">
              Discover the limitless rhythm of Mixly: your go-to platform for
              free, unlimited streaming and downloading of music and videos.
              Immerse yourself in a diverse collection of tunes, from classics
              to the latest hits. Elevate your experience by syncing playlists
              and playing music together with multiple listeners. Mixly is not
              just a service; it&apos;s a shared symphony of sound. Enjoy the
              freedom to explore, connect, and create unforgettable moments—all
              at your fingertips. Mixly, where the beat never stops, and the
              experience is always in tune with your passion for music and
              videos.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                ApiSearch.mutate();
              }}
              className="flex justify-center mt-8"
            >
              <label className="form-control w-full max-w-4xl">
                <div className="label gap-12">
                  <span className="label-text text-[#C4C4C4] flex items-center gap-2">
                    <MdDriveFileRenameOutline
                      className="text-pink-600"
                      size={20}
                    />
                    Query: video name
                  </span>
                  <span className="label-text text-[#C4C4C4] flex items-center gap-2">
                    Query: video link
                    <FaLink className="text-pink-600" size={18} />
                  </span>
                </div>
                <input
                  required
                  type="text"
                  value={Query}
                  disabled={ApiSearch.isPending}
                  placeholder="video name"
                  onChange={(e) => setQuery(e.target.value)}
                  className="input max-w-6xl rounded-xl border hover:border-pink-600 border-neutral-600 bg-[#101318]"
                />
                <div className="flex gap-1 justify-center">
                  <button
                    type="submit"
                    disabled={ApiSearch.isPending}
                    className={`text-sm hover:bg-neutral-900 p-2 mt-0.5 w-36 border hover:border-pink-600 border-neutral-600 rounded-b-xl hover:text-pink-600 text-[#C4C4C4] flex items-center gap-2 transition-transform transform duration-500 hover:scale-105 ${
                      ApiSearch.isPending ? " cursor-not-allowed" : ""
                    }`}
                  >
                    {ApiSearch.isPending ? (
                      <>
                        <AiOutlineLoading
                          className="text-pink-600 animate-spin"
                          size={18}
                        />
                        Fetching
                      </>
                    ) : (
                      <>
                        <LuSearchCode className="text-pink-600" size={18} />
                        Search Videos
                      </>
                    )}
                  </button>
                  <Link
                    href="/chat"
                    className="text-sm hover:bg-neutral-900 p-2 mt-0.5 w-36 border hover:border-pink-600 border-neutral-600 rounded-b-xl hover:text-pink-600 text-[#C4C4C4] flex items-center gap-2 transition-transform transform duration-500 hover:scale-105"
                  >
                    Listen Together
                    <MdFamilyRestroom className="text-pink-600" size={18} />
                  </Link>
                </div>
                <div className="label">
                  <span className="label-text text-[#C4C4C4] flex items-center gap-2">
                    <FaAddressCard className="text-pink-600" size={15} />
                    Query: video id
                  </span>
                  <span className="label-text text-[#C4C4C4] flex items-center gap-2">
                    Query: genre or artist
                    <MdPermIdentity className="text-pink-600" size={20} />
                  </span>
                </div>
              </label>
            </form>
          </div>
        </div>
        {TubeSearch && TubeSearch.length > 0 && (
          <Link href="#mixly-disp">
            <FaAngleDoubleDown
              size={80}
              className="animate-bounce text-[#e73d76]"
            />
          </Link>
        )}
      </section>
      {TubeSearch && (
        <section
          id="TubeSearch()"
          className="relative items-center w-full mx-auto md:px-12 lg:px-24 max-w-9xl"
        >
          <div className="grid w-full grid-cols-1 px-4 gap-6 mx-auto xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
            {TubeSearch.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-0.5 rounded-xl border ${
                  Tube && Tube.TubeUrl === item.url
                    ? "border-pink-600 shadow-pink-600"
                    : "border-pink-600/30 hover:shadow-pink-600"
                }  shadow-2xl shadow-black hover:border-pink-600`}
              >
                <Image
                  width={400}
                  height={400}
                  alt="500x500"
                  src={item.thumbnail}
                  className="object-cover objecjt-center w-full lg:h-48 md:h-36 rounded-t-xl"
                />
                {getTube.isPending ? (
                  <div className="p-2 text-sm w-full flex text-pink-600 items-center justify-center gap-2 shadow-2xl mt-0.5 shadow-black rounded bg-pink-600/10 cursor-not-allowed">
                    <AiOutlineLoading3Quarters
                      className="animate-spin text-pink-600"
                      size={15}
                    />
                    Fetching metaData .....
                  </div>
                ) : (
                  <>
                    {Tube && Tube.TubeUrl === item.url ? (
                      <div className="flex flex-col">
                        <Link
                          href="/pkg"
                          className="flex items-center justify-center p-2 bg-pink-700/50 hover:bg-pink-700/60 text-white/90 mt-0.5 w-full text-sm gap-1 rounded"
                        >
                          powered by <TbDiamondFilled size={20} /> yt-dlp{" "}
                        </Link>
                        {/* <audio
controls
autoPlay
autoFocus
id="AudioStreamer"
src={
"/api/saudio?url=" +
encodeURIComponent(Tube.TubeUrl)
}
className="w-full bg-[#18181b] shadow-2xl shadow-pink-600"
/> */}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            setTube(null);
                            getTube.mutate(item.url);
                          }}
                          className="p-0.5 mt-1 w-full text-sm flex text-white/90 items-center gap-2 justify-center bg-pink-600/40 hover:bg-pink-700/60 hover:animate-pulse"
                        >
                          Checkout Streaming <TiPlus size={30} /> Downloading
                          Options
                        </button>
                      </div>
                    )}
                  </>
                )}
                {Tube && Tube.TubeUrl === item.url && (
                  <div className="p-1 text-white/90">
                    <details className="collapse rounded cursor-pointer scale-100 bg-pink-600/10 text-pink-600">
                      <summary className="collapse m-1">
                        <span className="flex items-center text-sm justify-center hover:text-white/90">
                          AUDIO <MdAudiotrack size={25} className="ml-2" /> only
                          download
                        </span>
                      </summary>
                      <div className="collapse-content">
                        <ul className="list-decimal pl-2">
                          {Tube.EnBody.AudioFormatsData.map(
                            (format: any, index: number) => (
                              <li
                                key={index}
                                onClick={() => {
                                  window.location.href =
                                    "/api/audio?url=" +
                                    encodeURIComponent(Tube.TubeUrl) +
                                    "&format=" +
                                    encodeURIComponent(format[0]);
                                }}
                                className="mb-2 space-x-2 text-xs hover:bg-pink-600/10 text-white/80 p-2 rounded-lg cursor-pointer"
                              >
                                <span className="text-pink-600 mr-1">
                                  Format:
                                </span>
                                {format[0]}
                                <span className="text-pink-600 mr-1">
                                  Size:
                                </span>{" "}
                                {format[2]}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </details>
                    <details className="collapse rounded cursor-pointer scale-100 bg-pink-600/10 text-pink-600 mt-1">
                      <summary className="collapse m-2">
                        <span className="flex items-center text-sm justify-center hover:text-white/90">
                          VIDEO
                          <IoVideocam size={20} className="ml-2 mr-2" /> only
                          download
                        </span>
                      </summary>
                      <div className="collapse-content">
                        <ul className="list-decimal pl-2">
                          {Tube.EnBody.VideoFormatsData.map(
                            (format: any, index: number) => (
                              <li
                                key={index}
                                onClick={() => {
                                  window.location.href =
                                    "/api/video?url=" +
                                    encodeURIComponent(Tube.TubeUrl) +
                                    "&format=" +
                                    encodeURIComponent(format[0]);
                                }}
                                className="mb-2 space-x-2 text-xs hover:bg-pink-600/10 text-white/80 p-2 rounded-lg cursor-pointer"
                              >
                                <span className="text-pink-600 mr-1">
                                  Format:
                                </span>
                                {format[0]}
                                <span className="text-pink-600 mr-1">
                                  Size:
                                </span>{" "}
                                {format[2]}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </details>
                  </div>
                )}
                <ul className="ml-2 list-disc p-4 text-sm rounded-xl text-pink-500 overflow-hidden whitespace-break-spaces">
                  <li>
                    Title:
                    <span className="ml-1 text-xs text-white/90">
                      {item.title}
                    </span>
                  </li>
                  <li>
                    Duration:
                    <span className="ml-1 text-xs text-white/90">
                      {item.timestamp} mins
                    </span>
                  </li>
                  <li>
                    Posted On:
                    <span className="ml-1 text-xs text-white/90">
                      {item.ago}
                    </span>
                  </li>
                  <li>
                    Owner:
                    <span className="ml-1 text-xs text-white/90">
                      {item.author.name}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      <footer className="pt-20 pb-6 flex flex-wrap items-baseline justify-center">
        <span className="text-pink-600 text-3xl mr-2">
          Mixly <span className="text-[#C4C4C4] text-lg">&</span>{" "}
          <span className="text-red-600">yt-dlp</span>
        </span>
        <span className="mt-2 text-sm font-light text-[#C4C4C4]">
          Copyright © 2023
        </span>
      </footer>
    </main>
  );
}
