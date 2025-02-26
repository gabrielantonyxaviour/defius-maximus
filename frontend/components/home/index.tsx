"use client";

import Image from "next/image";
import { use, useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import Profile from "./profile";
import Chefs from "./chefs";
import Actions from "./actions";
import Mode from "./mode";
import Chef from "../chef/profile";
import { useRouter } from "next/navigation";
import Chat from "./chat";
import { createPublicClient, formatEther, http } from "viem";
import { arbitrumSepolia, avalancheFuji } from "viem/chains";

export default function Home() {
  const nav = [
    {
      id: 1,
      name: "Profile",
      image: "/home/money.png",
    },
    {
      id: 2,
      name: "Actions",
      image: "/home/actions.png",
    },
    {
      id: 3,
      name: "Chefs",
      image: "/home/chef.png",
    },
    {
      id: 4,
      name: "Mode",
      image: "/home/modes.png",
    },
    {
      id: 5,
      name: "Chat",
      image: "/home/chick.png",
    },
    {
      id: 6,
      name: "Chef",
      image: "/home/chef.png",
    },
  ];
  const { user, setTotalEquity } = useEnvironmentStore((store) => store);
  const [showWindows, setShowWindows] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const router = useRouter();
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedTradeId, setSelectedTradeId] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    console.log("SEARCH USERNAME");
    console.log(searchUsername);
  }, [searchUsername]);

  return user == undefined ? (
    <div></div>
  ) : (
    <div className="flex justify-between h-screen">
      <div className="flex flex-col h-full justify-center items-center space-y-8 xl:space-y-12  px-6">
        {(user?.mode == "BLUE PILL"
          ? [nav[0], nav[1], nav[3]]
          : [nav[0], nav[1], nav[2], nav[3]]
        ).map((i) => (
          <div
            key={i.id}
            className="relative bg-[#1F1F1F] xl:w-[125px] xl:h-[100px] w-[100px] h-[80px] rounded-sm"
          >
            <div
              onClick={() => {
                setShowWindows((prev) =>
                  prev.map((val, index) => (index === i.id - 1 ? !val : val))
                );
              }}
              className={`absolute flex flex-col justify-center items-center -top-[4px] -left-[4px] w-full h-full space-y-2 sen  rounded-sm text-sm border border-[2px] border-black p-2 cursor-pointer ${
                showWindows[i.id - 1]
                  ? "bg-[#1F1F1F] text-white font-bold"
                  : "bg-[#BF4317] text-white hover:bg-[#e6450d]"
              }`}
            >
              <img
                src={i.image}
                alt={i.name}
                className="w-[30px] h-[30px] xl:w-[50px] xl:h-[50px]"
              />
              <p className="lg:text-sm md:text-xs hidden md:block">{i.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex my-auto space-x-4 h-[80%] px-4">
        {showWindows[0] && (
          <Profile
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 0 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[1] && (
          <Actions
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 1 ? !val : val))
              );
            }}
            setSelectedTradeId={(tradeId) => {
              setSelectedTradeId(tradeId);
            }}
          />
        )}

        {showWindows[2] && (
          <Chefs
            setSearchUsername={setSearchUsername}
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 2 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[3] && (
          <Mode
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 3 ? !val : val))
              );
            }}
          />
        )}

        {selectedTradeId && (
          <Chat
            close={() => {
              setSelectedTradeId("");
            }}
            selectedTradeId={selectedTradeId}
          />
        )}
        {searchUsername && (
          <Chef
            chef_id={searchUsername}
            close={() => {
              setSearchUsername("");
            }}
          />
        )}
      </div>
    </div>
  );
}
