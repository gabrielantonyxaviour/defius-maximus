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
import { storyAeneid } from "viem/chains";
import { formatEther, Hex } from "viem";
import { setupStoryClient } from "@/lib/story";
import { getChainBalance, getMultichainBalance, getPrice } from "@/lib/balance";
import { useWalletClient } from "wagmi";
import { ArrowUpRight } from "lucide-react";

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
    walletBalance,
    setWalletBalance,
    humanityRegistered,
    setHumanityRegistered,
    setChef,
    setStoryClient,
    setTotalEquity,
    setCred,
  } = useEnvironmentStore((store) => store);
  const router = useRouter();
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { data: wallet } = useWalletClient();

  useEffect(() => {
    if (!isConnected) {
      setUser(null);
      setChef(null);
      router.push("/");
    }
  }, [isConnected]);

  // useEffect(() => {
  //   console.log("WALLET FROM WAGMI: ", wallet);
  // }, [wallet]);

  useEffect(() => {
    (async () => {
      console.log(
        "useEffect triggered with isConnected:",
        isConnected,
        "address:",
        address
      );
      if (!wallet) {
        console.log("Wallet is not available yet");
        return;
      }
      if (isConnected && address && wallet && user == null) {
        setStoryClient(await setupStoryClient(wallet));

        console.log(
          "User is not set, fetching user data for address:",
          address
        );
        const response = await fetch(
          `/api/supabase/get-user?user_id=${address}`
        );
        const { user: data } = await response.json();
        console.log("DATA", data);
        if (data) {
          console.log("User data found:", data);
          console.log("Fetching user follows for:", address);
          const responseFollows = await fetch(
            `/api/supabase/get-follows?user_id=${address}`
          );
          const { follows, error } = await responseFollows.json();
          if (error) {
            console.error("Error fetching user follows:", error);
          }
          console.log("Fetched user follows:", follows);
          setUserFollows(follows);

          console.log("Fetching user trades for:", address);
          const { trades } = await fetch(
            `/api/supabase/get-executed-trades?user_id=${address}`
          ).then((res) => res.json());
          console.log("Fetched user trades:", trades);
          setActions(trades);

          console.log("Setting user data:", data);
          setUser(data);
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
        }
      } else {
        console.log("User is already set or not connected");
      }
    })();
  }, [isConnected, address, wallet]);

  useEffect(() => {
    if (user && wallet) {
      (async function () {
        console.log("Fetching Balances");
        const fetchedWalletBalance = await getChainBalance(
          storyAeneid,
          address as Hex
        );
        setWalletBalance(formatEther(fetchedWalletBalance));
        const { arb, avax, base } = await getMultichainBalance(address as Hex);
        console.log("Arbitrum balance:", arb);
        console.log("Avalanche balance:", avax);
        console.log("Base balance:", base);
        const { ethPrice, avaxPrice } = await getPrice();
        console.log("ETH Price:", ethPrice);
        console.log("AVAX Price:", avaxPrice);
        console.log(
          parseFloat(formatEther(arb)) * parseFloat(ethPrice) +
            parseFloat(formatEther(avax)) * parseFloat(avaxPrice) +
            parseFloat(formatEther(base)) * parseFloat(ethPrice)
        );
        setTotalEquity(
          parseFloat(formatEther(arb)) * parseFloat(ethPrice) +
            parseFloat(formatEther(avax)) * parseFloat(avaxPrice) +
            parseFloat(formatEther(base)) * parseFloat(ethPrice)
        );
      })();
    }
  }, [wallet, user]);

  useEffect(() => {
    if (!address) return;
    (async function () {
      console.log("Fetching chef data for address:", address);
      const response = await fetch("/api/supabase/get-chef?user_id=" + address);
      const { chef } = await response.json();
      console.log("Fetched chef data:", chef);
      setChef(chef);

      if (chef && !humanityRegistered) {
        console.log("Checking humanity registration for chef:", chef.user_id);
        const response = await fetch(
          "/api/humanity/check?address=" + chef.user_id
        );
        const responseData = await response.json();

        console.log("Humanity registration status:", responseData);
        setHumanityRegistered(responseData);

        if (responseData && chef.cred_id != null) {
          console.log("Fetching credential for cred_id:", chef.cred_id);
          const response = await fetch(
            `/api/humanity/owns?address=${chef.user_id}&credId=${chef.cred_id}`
          );
          const { cred } = await response.json();
          console.log("Fetched credential:", cred);
          setCred(cred);
        }
      } else {
        console.log("Chef is not set or humanity is already registered");
      }
    })();
  }, [address]);

  return (
    <div className="min-h-screen w-full">
      <div className="fixed w-full flex flex-col sm:flex-row justify-end items-end sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 sen">
        {isConnected && (
          <>
            <div
              className="pr-2 flex space-x-1 hover:font-semibold items-center cursor-pointer"
              onClick={() => {
                router.push("/humanity");
              }}
            >
              <Image
                src={"/uhm.png"}
                width={25}
                height={25}
                alt="whm"
                className="rounded-full "
              />
              <p className="sen text-white pl-2 ">Mint Credentials</p>
              <ArrowUpRight className="text-white h-5 w-5" />
            </div>
            <div className="relative w-[150px] bg-[#1F1F1F] h-10 rounded-sm">
              <Button
                onClick={() => {}}
                className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#BF4317] hover:bg-[#BF4317] border border-[#3A3A3A]"
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
                    {parseFloat(walletBalance).toFixed(2)} {"IP"}
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
              //     className="absolute -top-1 -left-1 w-full h-full flex items-center justify-center space-x-2 bg-[#BF4317] hover:bg-[#BF4317] border-[#3A3A3A]"
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
              //       {parseFloat(avaxPkpBalance).toFixed(2)} {"AVAX"}
              //     </p> */}
              //     </div>
              //   </Button>
              // </div>
            }
          </>
        )}
        <div className="relative bg-[#1F1F1F] w-[180px] h-10 rounded-sm">
          {isConnected ? (
            <Button
              onClick={() => {
                open();
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#BF4317] hover:bg-[#e6450d] hover:text-white border border-[#3A3A3A]"
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
                  {shortenAddress(address as Hex)}
                </p>
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => {
                open();
              }}
              className="group absolute -top-1 -left-1 rounded-sm w-full h-full flex items-center justify-center bg-[#BF4317] hover:bg-[#e6450d] hover:text-white border border-[#3A3A3A]"
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
