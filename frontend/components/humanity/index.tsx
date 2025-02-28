"use client";
import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { CircleDashedIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Cred } from "@/types";
export default function Humanity() {
  const { chef, humanityRegistered, setHumanityRegistered, cred, setCred } =
    useEnvironmentStore((store) => store);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

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
          <div className="w-full h-full flex flex-col justify-center items-center sen text-white font-semibold">
            {loading ? (
              <div className="flex w-full justify-center space-x-2">
                <CircleDashedIcon className="animate-spin text-white" />
                <p className="text-white">Loading...</p>
              </div>
            ) : humanityRegistered ? (
              <>
                <p className="text-white text-center pb-6">
                  You own a valid Humanity ID
                </p>
                {cred ? (
                  <>
                    <div className="grid grid-cols-5 w-[75%] h-[200px] rounded-xl border-2 border-[#a3a3a3]">
                      <div className="col-span-2 rounded-l-xl">
                        <Image
                          src={"/son.png"}
                          alt="Humanity"
                          width={200}
                          height={200}
                          className="rounded-l-xl"
                        />
                      </div>
                      <div className="col-span-3 rounded-r-xl flex flex-col pl-3 justify-center">
                        <p>Id: {cred.id}</p>
                        <p>Address: {cred.address}</p>
                        <p>IP Account: {cred.ip}</p>
                        <p>Royalty: {cred.royalty}</p>
                        <p>Chef Score: {cred.chefScore}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=I%20am%20a%20Verified%20Chef%20on%20%40DefiusMaximus%20%28powered%20by%20%40Humanityprot%29.%20Come%20follow%20me%20and%20start%20making%20real%20gains.`,
                          "_blank"
                        );
                      }}
                      className="font-semibold "
                    >
                      Share on X
                    </Button>
                  </>
                ) : chef ? (
                  <>
                    <p>Create your chef credentials on Humanity</p>
                    <Button
                      disabled={creating}
                      onClick={async () => {
                        setCreating(true);
                        const customCred = {
                          chef_name: chef.name,
                          ip: chef.ip_address,
                          address: chef.user_id,
                          royalty: chef.royalty,
                          chefScore: Math.floor(Math.random() * 100),
                        };
                        const response = await fetch(
                          "/api/humanity/create?address=" + chef.user_id,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(customCred),
                          }
                        );
                        const { credId } = await response.json();

                        if (credId) {
                          setCred({ ...customCred, id: credId });
                        } else {
                          console.log("Error creating cred");
                        }
                        setCreating(false);
                      }}
                      className="font-semibold "
                    >
                      Mint now
                    </Button>
                    <div className="flex w-full justify-center space-x-2">
                      <CircleDashedIcon className="animate-spin text-white" />
                      <p className="text-white">Loading...</p>
                    </div>
                  </>
                ) : (
                  <p>
                    But sorry only chefs are eligible to mint Chef Credentials.
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-white text-center pb-6">
                  You don&apos;t have a valid Humanity ID
                  <br />
                  Required to use the app*
                </p>
                <Button
                  onClick={() => {
                    window.open(
                      "https://testnet.humanity.org/login?ref=gabrielaxy",
                      "_blank"
                    );
                  }}
                  className="font-semibold "
                >
                  Claim Humanity
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
