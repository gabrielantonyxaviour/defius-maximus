"use client";

import Image from "next/image";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { Copy, Save } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
export default function Profile({ close }: { close: () => void }) {
  const { user, totalEquity, pnl, setUser, walletBalance } =
    useEnvironmentStore((store) => store);
  const [copiedEVM, setCopiedEVM] = useState<boolean>(false);
  const [copiedSOL, setCopiedSOL] = useState<boolean>(false);
  const [expectedPNL, setExpectedPNL] = useState(5);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [riskLevel, setRiskLevel] = useState(0);

  useEffect(() => {
    if (user) {
      setExpectedPNL(user.profit_goal ? user.profit_goal : 5);
      setEndDate(
        user.profit_timeline ? new Date(user.profit_timeline) : undefined
      );
    }
  }, [user]);

  const handleCopy = async (
    address: string | undefined,
    type: "EVM" | "SOL"
  ): Promise<void> => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      if (type === "EVM") {
        setCopiedEVM(true);
        setTimeout(() => setCopiedEVM(false), 2000);
      } else {
        setCopiedSOL(true);
        setTimeout(() => setCopiedSOL(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  useEffect(() => {
    if (!endDate) return;

    const today = new Date();
    const daysDifference = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Base risk calculation from PNL target
    // Logarithmic scaling for more gradual progression
    const pnlRisk = Math.log10(expectedPNL) * 20; // Scale factor of 20 makes it more gradual

    // Time factor: shorter time = higher risk
    // Using inverse log scale for time to make it more gradual
    const timeRisk = Math.max(0, 50 - Math.log10(daysDifference) * 15);

    // Combine risks with weights
    // 60% weight to PNL risk, 40% to time risk
    let riskScore = pnlRisk * 0.6 + timeRisk * 0.4;

    // Additional risk for very short timeframes with high PNL
    // But make it more gradual using a sliding scale
    if (daysDifference < 30) {
      const shortTermMultiplier =
        1 + ((30 - daysDifference) / 30) * (expectedPNL / 500);
      riskScore *= shortTermMultiplier;
    }

    // Normalize between 0 and 100 with a more gradual curve
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Smoothing function to make transitions more gradual
    const smoothedRisk = Math.pow(riskScore / 100, 0.7) * 100;

    setRiskLevel(smoothedRisk);
  }, [expectedPNL, endDate]);
  return (
    <div className="w-full max-w-md 2xl:max-w-lg bg-[#1F1F1F] rounded-sm relative">
      <div className="absolute inset-0 -top-1 -left-1 sen rounded-sm border-2 border-[#3A3A3A] bg-[#1F1F1F] text-white p-6">
        <ScrollArea className="h-full w-full">
          <div className="space-y-4">
            <div>
              <p className="text-3xl nouns">GM DEGEN 👽</p>
              <p>gains are calling, time to ape the next 10x!</p>
            </div>

            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <p className="font-semibold text-base pb-1">Total Equity</p>
                <p className="text-2xl nouns">
                  {totalEquity}{" "}
                  <span className="text-sm font-bold sen">USDT</span>
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-base pb-1">Average PNL</p>
                <p className="text-2xl nouns">
                  {pnl}% <span className="text-sm font-bold sen">(7 DAYS)</span>
                </p>
              </div>
              <div className="col-span-2 2xl:col-span-1 flex flex-col items-center">
                <h3 className="font-semibold text-base pb-1">Current Mode</h3>
                <div className="flex justify-start items-center space-x-1">
                  <img
                    src={user?.mode === "RED PILL" ? "/red.png" : "/blue.png"}
                    alt="mode"
                    className="w-[25px] h-[21px]"
                  />
                  <p className="nouns tracking-wide text-lg">{user?.mode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base">Wallet Address</h3>
                <button
                  onClick={() => handleCopy(user?.address || "", "EVM")}
                  className=" rounded transition-colors p-1"
                >
                  <Copy size={12} />
                </button>
                {copiedEVM && <span className="text-sm">Copied!</span>}
              </div>
              <p className="text-sm break-all">{user?.address}</p>
            </div>

            {/* <div className="space-y-1"> */}
            {/* <h3 className="font-semibold text-base">Balance</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/chains/story.png"
                    width={25}
                    height={25}
                    alt="arb"
                    className="rounded-full"
                  />
                  <p className="text-sm">
                    {parseFloat(walletBalance).toFixed(2)} IP
                  </p>
                </div> */}
            {/* <div className="flex items-center space-x-2">
                  <Image
                    src="/chains/avax.png"
                    width={25}
                    height={25}
                    alt="avax"
                  />
                  <p className="text-sm">
                    {parseFloat(avaxSafeBalance).toFixed(2)} AVAX
                  </p>
                </div> */}
            {/* </div>
            </div> */}

            {user?.mode === "RED PILL" && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-semibold text-sm">Expected PNL</p>
                    <p className="text-sm">{expectedPNL}%</p>
                  </div>
                  <Slider
                    value={[expectedPNL]}
                    onValueChange={(value) => setExpectedPNL(value[0])}
                    min={5}
                    max={500}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-2">Timeframe</p>
                    <div className="transform scale-75 origin-top-left">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md sen"
                      />
                    </div>
                  </div>

                  <div className="w-24">
                    <p className="font-semibold text-sm mb-2">Risk Meter</p>
                    <div className="relative h-48">
                      <Progress
                        value={riskLevel}
                        className="absolute top-1/2 left-1/2 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-90 border border-[#BF4317]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={async () => {
                      if (!user) return;
                      if (
                        user.profit_goal == expectedPNL &&
                        user.profit_timeline == endDate?.toISOString()
                      )
                        return;
                      if (expectedPNL == 0) return;
                      if (!endDate) return;

                      await fetch("/api/supabase/update-user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...user,
                          profit_goal: expectedPNL,
                          profit_timeline: endDate?.toISOString(),
                        }),
                      });

                      setUser({
                        ...user,
                        profit_goal: expectedPNL,
                        profit_timeline: endDate
                          ? endDate.getTime()
                          : undefined,
                      });
                    }}
                    className="group rounded-sm py-2 px-4 bg-[#BF4317] hover:bg-[#BF4317] hover:text-white border border-[#BF4317] flex items-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
