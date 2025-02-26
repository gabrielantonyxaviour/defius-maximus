"use client";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { useEnvironmentStore } from "../context";

export default function Landing() {
  const { user } = useEnvironmentStore((store) => store);
  return (
    <div className="w-screen h-screen flex flex-col justify-center pt-2">
      <div className="relative bg-[#1F1F1F] w-[100%] md:w-[700px] 2xl:h-[50%] h-[75%] sm:h-[60%] rounded-xl mx-auto">
        <div className="absolute flex flex-col justify-center -top-[4px] -left-[4px] bg-[#1F1F1F]  w-[100%] md:w-[700px] mx-auto h-full rounded-xl border-[1px] border-[#3A3A3A]">
          <div className="flex justify-between items-center p-2"></div>
          <div className="bg-[#1F1F1F] w-full flex justify-center items-center rounded-xl py-4 md:py-8 xl:py-12">
            <img
              src="/defius.png"
              alt="hero"
              className="w-[150px] h-[120px] xl:w-[200px] xl:h-[155px] "
            />
          </div>
          <p className="text-center pt-2 font-bold text-xl sen tracking-wide text-white">
            Defius Maximus
          </p>
          <p className="text-center text-xs sen px-4 pt-2 md:pt-0 text-white">
            An autonomous AI agent that prints you money by clicking a button.
          </p>
          <div className="flex flex-col md:flex-row justify-center py-4 space-x-0 md:space-x-2 space-y-2 md:space-y-0 px-4 md:px-0">
            <Link
              href={user ? `/home` : "#"}
              className={`${buttonVariants({
                variant: "outline",
              })} ${
                user
                  ? "hover:border-2 hover:border-[#3A3A3A] hover:font-bold"
                  : "opacity-50 cursor-not-allowed"
              } sen rounded-sm bg-transparent border-0 hover:bg-transparent text-white hover:text-white hover:border-[#3A3A3A] hover:border-[1px]`}
            >
              Get Started
            </Link>
            <Link
              href={user ? `/chef` : "#"}
              className={`${buttonVariants({
                variant: "default",
              })} ${
                user
                  ? " border-0 bg-[#BF4317] hover:bg-[#e6450d]"
                  : "opacity-50 cursor-not-allowed border-0 bg-[#BF4317] hover:bg-[#1F1F1F]"
              } sen rounded-sm text-white`}
            >
              Chef Mode
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
