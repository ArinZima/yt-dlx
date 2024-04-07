import NavPackage from "@/pages/components/nav";
import FootPackage from "@/pages/components/foot";
import Introduction from "@/pages/components/home/Introduction";
import Playground from "@/pages/components/home/Playground";
import Documentation from "@/pages/components/home/Documentation";

export default function AwesomePackage() {
  return (
    <main className="overflow-x-hidden max-h-screen scrollbar-thin bg-[#1A1A1C] scrollbar-track-[#1A1A1C] scrollbar-thumb-red-600">
      <NavPackage />
      <Introduction />
      <Playground />
      <Documentation />
      <FootPackage />
    </main>
  );
}
