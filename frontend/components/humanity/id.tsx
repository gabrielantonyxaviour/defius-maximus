"use client";
import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { CircleDashedIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Cred } from "@/types";
export default function HumanityId({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Get the chef from the cred id
    // Pass the address to the api to get the creds and find the cred id
    // Display the cred
  }, []);
  return (
    <div className="w-screen h-screen flex flex-col justify-center pt-2">
      <div className="relative bg-[#1F1F1F] w-[100%] md:w-[700px] 2xl:h-[50%] h-[75%] sm:h-[60%] rounded-xl mx-auto">
        <div className="flex flex-col items-center w-full h-full py-6">
          <Image
            src={"/humanity.png"}
            alt="Humanity"
            width={180}
            height={180}
            className="rounded-xl pt-2 pb-4"
          />
        </div>
      </div>
    </div>
  );
}
