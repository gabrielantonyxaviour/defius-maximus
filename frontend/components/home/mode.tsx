"use client";

import { CircleDashedIcon, X } from "lucide-react";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";

export default function Mode({ close }: { close: () => void }) {
  const { user, setUser } = useEnvironmentStore((store) => store);
  const [mode, setMode] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  useEffect(() => {
    if (user) {
      setMode(user.mode);
    }
  }, [user]);
  return (
    <div className="w-[600px] h-[400px] absolute top-[32%] left-[38%] bg-[#1F1F1F] rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute w-[600px] h-[400px] flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-[#3A3A3A] py-2 bg-[#1F1F1F] text-white`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 font-bold text-lg">Switch EGG Mode</p>
          <X className="cursor-pointer" onClick={close} />
        </div>
        <div className="flex space-x-4 pt-6">
          <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
            {" "}
            <div
              onClick={async () => {
                if (!user) return;
                if (transitioning) return;
                if (mode == "RED PILL") return;
                setTransitioning(true);
                setMode("RED PILL");
                await fetch(`/api/supabase/update-user`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...user,
                    mode: "RED PILL",
                  }),
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setTransitioning(false);
                setUser({
                  ...user,
                  mode: "RED PILL",
                });
              }}
              className={`absolute cursor-pointer w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm py-2 ${
                user?.mode == "RED PILL"
                  ? "bg-[#BF4317]  text-[#1F1F1F] border border-[1px] border-black"
                  : "bg-[#1F1F1F] border border-[2px] border-[#3A3A3A] text-white"
              }`}
            >
              <div className="flex space-x-1 items-center justify-center pt-2">
                <img
                  src={"/red.png"}
                  alt="chad"
                  className="w-[40px] h-[34px]"
                />
                <p className="nouns spacing-2 tracking-wide text-xl">
                  RED PILL
                </p>
              </div>

              <div className="px-4 mt-4 text-center">
                <p className="text-sm font-medium mb-2">
                  Custom Trading Strategy
                </p>
                <div className="space-y-2 text-xs">
                  <p>✓ Follow expert traders</p>
                  <p>✓ AI-assisted validation</p>
                  <p>✓ Custom risk controls</p>
                </div>
              </div>
              <div className="mt-auto mb-2">
                {user?.mode === "RED PILL" ? (
                  <p className="text-md font-semibold mb-2">
                    {">>> Enabled <<<"}
                  </p>
                ) : (
                  <div className="h-[24px]"></div>
                )}
              </div>
            </div>
          </div>
          <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
            <div
              onClick={async () => {
                if (!user) return;
                if (transitioning) return;
                if (mode == "BLUE PILL") return;
                setTransitioning(true);
                setMode("BLUE PILL");
                await fetch(`/api/supabase/update-user`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...user,
                    mode: "BLUE PILL",
                  }),
                });

                await new Promise((resolve) => setTimeout(resolve, 2000));
                setTransitioning(false);
                setUser({
                  ...user,
                  mode: "BLUE PILL",
                });
              }}
              className={`absolute cursor-pointer w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm  py-2 ${
                user?.mode == "BLUE PILL"
                  ? "bg-[#BF4317]  text-[#1F1F1F] border border-[1px] border-black"
                  : "bg-[#1F1F1F] border border-[2px] border-[#3A3A3A] text-white"
              }  `}
            >
              <div className="flex space-x-1 items-center justify-center pt-2">
                <img
                  src={"/blue.png"}
                  alt="chad"
                  className="w-[40px] h-[34px]"
                />
                <p className="nouns spacing-2 tracking-wide text-xl">
                  BLUE PILL
                </p>
              </div>

              <div className="px-4 mt-4 text-center">
                <p className="text-sm font-medium mb-2">
                  AI-Powered Autopilot Trading
                </p>
                <div className="space-y-2 text-xs">
                  <p>✓ No experience needed</p>
                  <p>✓ Fully automated</p>
                  <p>✓ AI-managed risks</p>
                </div>
              </div>

              <div className="mt-auto mb-2">
                {user?.mode === "BLUE PILL" ? (
                  <p className="text-md font-semibold mb-2">
                    {">>> Enabled <<<"}
                  </p>
                ) : (
                  <div className="h-[24px]"></div>
                )}
              </div>
            </div>
          </div>
        </div>
        {transitioning && (
          <div className="flex space-x-2 pt-4 items-center">
            <CircleDashedIcon className="h-6 w-6 animate-spin" />{" "}
            <p>Switching your mode... please wait.</p>{" "}
          </div>
        )}
      </div>
    </div>
  );
}
