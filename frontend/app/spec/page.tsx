"use client";
import NavPackage from "@/pages/components/nav";
import FootPackage from "@/pages/components/foot";

export default function home() {
  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />

      <FootPackage />
    </main>
  );
}
