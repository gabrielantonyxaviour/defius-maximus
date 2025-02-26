"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEnvironmentStore } from "./context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { shortenAddress } from "@/lib/utils";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import generateKeypairs from "@/lib/gen-wallet";
import { User } from "@/types";
import { useBalance } from "wagmi";
import { storyAeneid } from "viem/chains";
import { createPublicClient, formatEther, http } from "viem";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { data: session, status } = useSession();
  const {
    user,
    setUser,
    setUserFollows,
    setActions,
    balance,
    setBalance,
    walletBalance,
    setWalletBalance,
  } = useEnvironmentStore((store) => store);
  const router = useRouter();
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    (async () => {
      console.log(
        "useEffect triggered with isConnected:",
        isConnected,
        "address:",
        address
      );

      if (isConnected && address && user == null) {
        const publicClient = createPublicClient({
          chain: storyAeneid,
          transport: http("https://aeneid.storyrpc.io"),
        });
        console.log(
          "User is not set, fetching user data for address:",
          address
        );
        const response = await fetch(
          `/api/supabase/get-user?username=${address}`
        );
        const { user: data } = await response.json();
        console.log("DATA", data);
        if (data) {
          console.log("User data found:", data);
          console.log("Fetching user follows for:", address);
          const responseFollows = await fetch(
            `/api/supabase/get-follows?username=${address}`
          );
          const { follows, error } = await responseFollows.json();
          if (error) {
            console.error("Error fetching user follows:", error);
          }
          console.log("Fetched user follows:", follows);
          setUserFollows(follows);

          console.log("Fetching user trades for:", address);
          const { trades } = await fetch(
            `/api/supabase/get-executed-trades?username=${address}`
          ).then((res) => res.json());
          console.log("Fetched user trades:", trades);
          setActions(trades);

          console.log("Setting user data:", data);
          setUser(data);
          const fetchedWalletBalance = await publicClient.getBalance({
            address: data.address as `0x${string}`,
          });
          setWalletBalance(formatEther(fetchedWalletBalance));
        } else {
          console.log("No user data found, generating new keypairs");
          const { evm } = await generateKeypairs();
          const newUser: User = {
            id: address,
            name: "Random Nibba",
            paused: false,
            address: evm.address,
            pkey: evm.privateKey,
            mode: "BLUE PILL",
            profit_timeline: null,
            profit_goal: null,
          };

          console.log("Creating new user:", newUser);
          const response = await fetch("/api/supabase/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });
          const { user: data } = await response.json();
          console.log("Setting user data:", data);
          setUser(data);
          const fetchedWalletBalance = await publicClient.getBalance({
            address: data.address as `0x${string}`,
          });
          setWalletBalance(formatEther(fetchedWalletBalance));
        }

        const fetchedBalance = await publicClient.getBalance({
          address: address as `0x${string}`,
        });
        setBalance(formatEther(fetchedBalance));
      } else {
        console.log("User is already set or not connected");
      }
    })();
  }, [isConnected, address]);

  return (
    <div className="min-h-screen w-full">
      <div className="fixed w-full flex flex-col sm:flex-row justify-end items-end sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 sen">
        {user && (
          <>
            <div className="relative w-[150px] bg-[#1F1F1F] h-10 rounded-sm">
              <Button
                onClick={() => {}}
                className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#BF4317] hover:bg-[#BF4317] border border-black"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={"/chains/story.png"}
                    width={25}
                    height={25}
                    alt="arbitrum"
                    className="rounded-full"
                  />
                  <p className="text-xs md:text-sm font-semibold">
                    {parseFloat(balance).toFixed(4)} {"IP"}
                  </p>
                </div>
              </Button>
            </div>
            {
              // <div className="relative w-[150px] bg-[#1F1F1F] h-10 rounded-sm">
              //   <Button
              //     onClick={() => {
              //       // window.open(
              //       //   "https://testnet.snowtrace.io/address/" +
              //       //     currentAccount?.ethAddress,
              //       //   "_blank"
              //       // );
              //     }}
              //     className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#BF4317] hover:bg-[#BF4317] border-black"
              //   >
              //     <div className="flex items-center gap-2">
              //       <Image
              //         src={"/chains/avax.png"}
              //         width={25}
              //         height={25}
              //         alt="arbitrum"
              //         className="rounded-full"
              //       />
              //       {/* <p className="text-xs md:text-sm font-semibold">
              //       {parseFloat(avaxPkpBalance).toFixed(4)} {"AVAX"}
              //     </p> */}
              //     </div>
              //   </Button>
              // </div>
            }
          </>
        )}
        <div className="relative bg-[#1F1F1F] w-[180px] h-10 rounded-sm">
          {user ? (
            <Button
              onClick={() => {
                disconnect();
                setUser(null);
                router.push("/");
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#BF4317] hover:bg-[#e6450d] hover:text-white border border-black"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={"/son.png"}
                  width={30}
                  height={30}
                  alt="lit"
                  onError={(e) => {
                    e.currentTarget.src = "/son.png";
                  }}
                  className="rounded-full"
                />
                <p className="text-sm pl-1 font-semibold">
                  {shortenAddress(user.id)}
                </p>
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                open();
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#BF4317] hover:bg-[#e6450d] hover:text-white border border-black"
            >
              <div className="flex items-center gap-2">
                <p className="sen text-sm sm:text-base">Connect Wallet</p>
              </div>
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
