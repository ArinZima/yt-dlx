"use client";
import { useParams, useRouter } from "next/navigation";

export default function home({ param }: any) {
  const { push } = useRouter();
  const { item }: any = useParams();

  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      {JSON.stringify(param)}
    </main>
  );
}
