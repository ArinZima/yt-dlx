"use client";
import react from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLightbulb } from "react-icons/fa";
import { MdAudioFile } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa6";
import { SiFirefoxbrowser } from "react-icons/si";
import { AiFillCodeSandboxCircle } from "react-icons/ai";
import { SiBun } from "react-icons/si";
import { FaYarn } from "react-icons/fa";
import { SiPnpm } from "react-icons/si";
import { TbBrandNpm } from "react-icons/tb";
import NavPackage from "@/pages/components/nav";
import FootPackage from "@/pages/components/foot";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function home() {
  const { push } = useRouter();
  const { videoId }: any = useParams();
  const QueryClient = useQueryClient();
  const [TubeSearch, setTubeSearch] = react.useState<any>(null);
  const ApiSearch = useMutation({
    mutationFn: async () => {
      const resp = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });
      if (resp.status === 200) setTubeSearch(await resp.json());
    },
    onMutate: () => console.log("ApiSearch started!"),
  });
  react.useEffect(() => {
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) push("/");
    else ApiSearch.mutate();
  }, [videoId]);

  const Introduction = () => {
    return (
      <section
        id="Introduction"
        className="flex flex-col items-center justify-center mt-20"
      >
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
    );
  };

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
      <Introduction />
      {TubeSearch && (
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
                    <Image
                      width={1920}
                      height={1080}
                      alt="thumbnail"
                      className="object-cover w-full h-56 rounded-lg shadow-md md:h-72"
                      src={`${
                        TubeSearch.thumbnails[TubeSearch.thumbnails.length - 1]
                          .url
                      }`}
                    />
                    <h2 className="mt-6 text-2xl font-medium text-red-600">
                      {TubeSearch.title}
                    </h2>
                    <p className="mt-2 leading-loose text-red-600">
                      {TubeSearch.description}
                    </p>
                    <ul className="mt-2 text-red-600 list-disc">
                      <li>
                        <span className="text-red-600 font-bold">
                          @videoId:
                        </span>{" "}
                        {TubeSearch.id}
                      </li>
                      <li>
                        <span className="text-red-600 font-bold">
                          @channelid:
                        </span>{" "}
                        {TubeSearch.channelid}
                      </li>
                      <li>
                        <span className="text-red-600 font-bold">
                          @channelname:
                        </span>{" "}
                        {TubeSearch.channelname}
                      </li>
                      <li>
                        <span className="text-red-600 font-bold">
                          @duration:
                        </span>{" "}
                        {TubeSearch.duration}
                      </li>
                      <li>
                        <span className="text-red-600 font-bold">
                          @uploadDate:
                        </span>{" "}
                        {TubeSearch.uploadDate}
                      </li>
                      <li>
                        <span className="text-red-600 font-bold">
                          @viewCount:
                        </span>{" "}
                        {TubeSearch.viewCount}
                      </li>
                    </ul>
                    <a className="inline-flex items-center px-6 py-2 mt-6 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg gap-x-2 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80">
                      <span>Download 3.0</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 rtl:rotate-180"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-medium text-red-800">
                      Download the app
                    </h3>
                    <p className="mt-2 text-red-500">
                      Get the most of Meraki UI by installing our new mobile
                      app.
                    </p>

                    <div className="mt-4 -mx-2">
                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm overflow-hidden text-white transition-colors duration-300 bg-red-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-red-700 focus:ring-red-300 focus:ring-opacity-80"
                      >
                        <svg
                          className="w-5 h-5 mx-2 fill-current"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                        >
                          <g>
                            <g>
                              <path d="M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302c41.355,0,75,33.645,75,75V407z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498C306.487,136.719,307.375,129.981,305.646,123.531z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z"></path>
                            </g>
                          </g>
                          <g>
                            <g>
                              <path d="M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z"></path>
                            </g>
                          </g>
                        </svg>

                        <span className="mx-2"> Get it on the App Store </span>
                      </a>

                      <a
                        href="#"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 text-sm overflow-hidden text-white transition-colors duration-300 bg-red-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-red-500 focus:ring focus:ring-red-300 focus:ring-opacity-80"
                      >
                        <svg
                          className="w-5 h-5 mx-2 fill-current"
                          viewBox="-28 0 512 512.00075"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="m432.320312 215.121094-361.515624-208.722656c-14.777344-8.53125-32.421876-8.53125-47.203126 0-.121093.070312-.230468.148437-.351562.21875-.210938.125-.421875.253906-.628906.390624-14.175782 8.636719-22.621094 23.59375-22.621094 40.269532v417.445312c0 17.066406 8.824219 32.347656 23.601562 40.878906 7.390626 4.265626 15.496094 6.398438 23.601563 6.398438s16.214844-2.132812 23.601563-6.398438l361.519531-208.722656c14.777343-8.53125 23.601562-23.8125 23.601562-40.878906s-8.824219-32.347656-23.605469-40.878906zm-401.941406 253.152344c-.21875-1.097657-.351562-2.273438-.351562-3.550782v-417.445312c0-2.246094.378906-4.203125.984375-5.90625l204.324219 213.121094zm43.824219-425.242188 234.21875 135.226562-52.285156 54.539063zm-6.480469 429.679688 188.410156-196.527344 54.152344 56.484375zm349.585938-201.835938-80.25 46.332031-60.125-62.714843 58.261718-60.773438 82.113282 47.40625c7.75 4.476562 8.589844 11.894531 8.589844 14.875s-.839844 10.398438-8.589844 14.875zm0 0"></path>
                        </svg>

                        <span className="mx-2"> Get it on Google Play </span>
                      </a>
                    </div>

                    <p className="mt-6 text-red-500">
                      This email was sent to
                      <a
                        href="#"
                        className="text-red-600 hover:underline"
                        target="_blank"
                      >
                        contact@merakiui.com
                      </a>
                      . If you'd rather not receive this kind of email, you can
                      <a href="#" className="text-red-600 hover:underline">
                        unsubscribe
                      </a>
                      or
                      <a href="#" className="text-red-600 hover:underline">
                        manage your email preferences
                      </a>
                      .
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      )}
      <FootPackage />
    </main>
  );
}
