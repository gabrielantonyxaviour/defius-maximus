"use client";
import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { ArrowUpRightFromSquare, CircleDashedIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Cred } from "@/types";
import { shortenAddress } from "@/lib/utils";
export default function Humanity() {
  const { chef, humanityRegistered, cred, setCred } = useEnvironmentStore(
    (store) => store
  );
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
            ) : !chef ? (
              <p className="text-center">
                Credentials are only for Chefs. <br /> Create a chef profile to
                claim creds if you are a trader.
              </p>
            ) : humanityRegistered ? (
              <>
                <p className="text-white text-center">
                  {cred
                    ? "You hold a verified Trader Credential."
                    : "You own a valid Humanity ID"}
                </p>
                {cred && (
                  <p className="text-white text-center">
                    You can create trade plays now 🎉
                  </p>
                )}
                {cred ? (
                  <>
                    <div className="grid grid-cols-5 w-[75%] h-[200px] rounded-xl border-2 border-[#a3a3a3] mt-4">
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
                        <p>
                          Id:{" "}
                          <span className="font-normal">
                            {shortenAddress(cred.id)}
                          </span>
                        </p>
                        <p>
                          Name: <span className="font-normal">{cred.name}</span>
                        </p>
                        <p>
                          Address:{" "}
                          <span className="font-normal">
                            {shortenAddress(cred.address)}
                          </span>
                        </p>
                        <p>
                          IP Account:{" "}
                          <span className="font-normal">
                            {shortenAddress(cred.ip)}
                          </span>
                        </p>
                        <p>
                          Royalty:{" "}
                          <span className="font-normal">{cred.royalty}</span>
                        </p>
                        <p>
                          Chef Score:{" "}
                          <span className="font-normal">{cred.chef_score}</span>
                        </p>
                        <p>
                          Twitter:{" "}
                          <span className="font-normal">{cred.twitter}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        window.open(
                          `https://twitter.com/intent/tweet?text=👨‍🍳%20I%20am%20a%20Verified%20Chef%20on%20%40DefiusMaximus%20%28powered%20by%20%40Humanityprot%29.%20%F0%9F%94%A5%20Come%20follow%20me%20and%20start%20making%20real%20gains!%20%F0%9F%92%B0%20%F0%9F%93%88%20%0A%0ACheck%20out%20our%20app%3A%20https%3A%2F%2Fdefius-maximus.vercel.app%2F`,
                          "_blank"
                        );
                      }}
                      className="font-semibold mt-4"
                    >
                      Share on X <ArrowUpRightFromSquare />
                    </Button>
                  </>
                ) : chef ? (
                  <>
                    <p>Create your chef credentials on Humanity</p>
                    <Button
                      disabled={creating}
                      onClick={async () => {
                        try {
                          setCreating(true);

                          console.log("Creating cred for chef:", chef);
                          const customCred = {
                            name: chef.name,
                            ip: chef.ip_address,
                            address: chef.user_id,
                            royalty: chef.royalty,
                            chef_score: chef.chef_score,
                            twitter: chef.twitter,
                          };
                          const response = await fetch(
                            "/api/humanity/issue?address=" + chef.user_id,
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
                        } catch (e) {
                          console.log(e);
                          setCreating(false);
                        }
                      }}
                      className="font-semibold mt-4"
                    >
                      {creating ? (
                        <div className="flex w-full justify-center space-x-2">
                          <CircleDashedIcon className="animate-spin text-white" />
                          <p className="text-white">Loading...</p>
                        </div>
                      ) : (
                        <p>Mint Now</p>
                      )}
                    </Button>
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
