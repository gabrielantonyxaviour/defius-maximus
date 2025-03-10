import React, { useEffect, useState } from "react";
import {
  X,
  Plus,
  Check,
  Smile,
  Trash2,
  CalendarIcon,
  ChevronLeft,
  Sparkle,
  CircleDashedIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format, set } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DCA, TakeProfit } from "@/types";
import {
  assets,
  circuitTokenList,
  exchanges,
  IS_TESTNET,
  kittyTokenList,
  perpExchanges,
  spotExchanges,
  sushiTokenList,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useEnvironmentStore } from "../context";
import OverlappingCircles from "../ui/overlapping-circles";
import { uploadImageToWalrus, uploadJsonToWalrus } from "@/lib/walrus";
import { createHash } from "crypto";
import { mintAndRegisterIp, mintAndRegisterDerivativeIp } from "@/lib/story";
import { Hex } from "viem";

interface CreateRecipeProps {
  close: () => void;
  setTradePlayId: (analyzing: string) => void;
}
type TradeType = "Choose" | "Spot" | "Perps" | "Memecoins" | "Stocks";

type PerpsDex = "gmx";

type SpotDex = "sushi" | "circuit" | "kitty";

const tradeTemplates = [
  {
    entryPrice: 2628,
    leverage: 3,
    stopLoss: 2500,
    takeProfits: [
      { price: "2750", percentage: "30" },
      { price: "2850", percentage: "100" },
    ],
    dcaPoints: [
      { price: "2628", percentage: "30" },
      { price: "2600", percentage: "30" },
      { price: "2575", percentage: "40" },
    ],
    selectedAsset: "ETH",
    selectedChain: "Ethereum",
    direction: "buy_long",
    selectedDate: new Date(),
    selectedTime: "22:00",
    expectedPnl: "12",
    researchDescription:
      "Taking a long position on ETH at $2628 because technical indicators show bullish momentum with MACD crossover and RSI at 60. " +
      "On-chain metrics indicate growing network activity, with transaction volume up 15% to 5.2M ETH and active addresses increasing by 7% to 1.1M. " +
      "Recent whale accumulation of 120K ETH and improving liquidity suggest strong upside potential. The main risk is macroeconomic uncertainty, " +
      "but current price level offers an attractive risk/reward ratio for a long entry.",
  },
  {
    entryPrice: 83000,
    leverage: 5,
    stopLoss: 80000,
    takeProfits: [
      { price: "86000", percentage: "40" },
      { price: "88000", percentage: "100" },
    ],
    dcaPoints: [
      { price: "83000", percentage: "30" },
      { price: "81500", percentage: "30" },
      { price: "80000", percentage: "40" },
    ],
    selectedAsset: "WBTC",
    selectedChain: "Ethereum",
    direction: "buy_long",
    selectedDate: new Date(),
    selectedTime: "22:00",
    expectedPnl: "12",
    researchDescription:
      "Taking a long position on WBTC at $83,000 due to strong technical and on-chain indicators. BTC's price is holding above key support, and RSI remains in a bullish range at 65. " +
      "On-chain metrics show an increase in exchange outflows, signaling long-term accumulation. Institutional demand is rising, with BTC ETFs seeing record inflows. " +
      "Additionally, network hash rate is at an all-time high, indicating strong miner confidence. The main risk is potential macroeconomic events, but the setup offers a solid risk/reward ratio.",
  },
  {
    entryPrice: 140,
    leverage: 4,
    stopLoss: 130,
    takeProfits: [
      { price: "155", percentage: "50" },
      { price: "165", percentage: "100" },
    ],
    dcaPoints: [
      { price: "140", percentage: "30" },
      { price: "135", percentage: "30" },
      { price: "130", percentage: "40" },
    ],
    selectedAsset: "SOL",
    selectedChain: "Solana",
    direction: "buy_long",
    selectedDate: new Date(),
    selectedTime: "22:00",
    expectedPnl: "14",
    researchDescription:
      "Taking a long position on SOL at $140 due to strong bullish momentum. SOL is trading above key moving averages, and RSI is at 68, indicating strength. " +
      "On-chain activity remains high, with daily active addresses exceeding 1.2M and total value locked (TVL) rising 10% in the past week. " +
      "Institutional interest is growing, with large funds increasing SOL allocations. The main risk is potential network congestion, but current price levels offer a solid long setup.",
  },
];

const selectedTrade = tradeTemplates[1];

const CreateRecipe: React.FC<CreateRecipeProps> = ({
  close,
  setTradePlayId,
}) => {
  const { chef, setRecipe, user, storyClient } = useEnvironmentStore(
    (store) => store
  );
  const [entryPrice, setEntryPrice] = useState<number>(
    selectedTrade.entryPrice
  ); // Entry price for ETH
  const [leverage, setLeverage] = useState<number>(selectedTrade.leverage); // Adjusted leverage for ETH
  const [stopLoss, setStopLoss] = useState<number>(selectedTrade.stopLoss); // Stop loss below entry
  const [takeProfits, setTakeProfits] = useState<TakeProfit[]>(
    selectedTrade.takeProfits
  );
  const [dcaPoints, setDcaPoints] = useState<DCA[]>(selectedTrade.dcaPoints);
  const [selectedAsset, setSelectedAsset] = useState<string>(""); // Asset name
  const [selectedChain, setSelectedChain] = useState<string>(""); // Blockchain network
  const [direction, setDirection] = useState<"buy_long" | "sell_short">(
    "buy_long"
  ); // Position type
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Trade date
  const [selectedTime, setSelectedTime] = useState<string>("22:00"); // Trade time
  const [expectedPnl, setExpectedPnl] = useState<string>(
    selectedTrade.expectedPnl
  ); // Expected profit & loss
  const [researchDescription, setResearchDescription] = useState<string>(
    selectedTrade.researchDescription
  );

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(0);
  const [selectedType, setSelectedType] = useState<TradeType>("Choose");
  const [selectedDex, setSelectedDex] = useState<PerpsDex | SpotDex | null>(
    null
  );
  const [error, setError] = useState<string>("");

  const [prompt, setPrompt] = useState<string>("");
  const [promptStatus, setPromptStatus] = useState<
    "waiting" | "pending" | "completed"
  >("waiting");
  // Sample asset data - replace with your actual data

  const handleAddTakeProfit = () => {
    if (takeProfits.length < 3) {
      setTakeProfits([...takeProfits, { price: "", percentage: "" }]);
    }
  };

  const handleSubTakeProfit = () => {
    if (takeProfits.length > 1) {
      setTakeProfits(takeProfits.slice(0, takeProfits.length - 1));
    }
  };

  const handleAddDCA = () => {
    if (dcaPoints.length < 3) {
      setDcaPoints([...dcaPoints, { price: "", percentage: "" }]);
    }
  };

  const handleSubDCA = () => {
    if (dcaPoints.length > 1) {
      setDcaPoints(dcaPoints.slice(0, dcaPoints.length - 1));
    }
  };

  const handleAssetChange = (asset: string) => {
    setSelectedAsset(asset);
    const chains =
      selectedType == "Spot"
        ? [spotExchanges.filter((e) => e.id == selectedDex)[0].chain]
        : Object.keys(assets[asset]);
    if (chains.length === 1) {
      setSelectedChain(chains[0]);
    } else {
      setSelectedChain("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully");
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      };
      img.onerror = () => {
        console.error("Failed to load image");
      };
      img.src = URL.createObjectURL(file);
    } else {
      console.log("No file selected");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted");
    setLoading(1);
    console.log(image);
    if (!image) {
      setError("Please upload a profile image");
      setLoading(0);
      return;
    }
    if (!storyClient) {
      setError("Story Client is not set");
      setLoading(0);
      return;
    }

    toast("Minting an IP for your recipe", {
      description: "Storing on Walrus and publishing on chain...",
    });

    toast("Uploading Trade Image to Walrus", {
      description: "Waiting for confirmation...",
    });
    const tradeImage = await uploadImageToWalrus(image);

    toast("Trade Image uploaded successfully", {
      description: "View your trade image on Walrus",
      action: {
        label: "View",
        onClick: () => {
          window.open(tradeImage, "_blank");
        },
      },
    });
    const ipMetadata = {
      title: chef?.nft_name,
      description: chef?.bio,
      image: tradeImage,
      imageHash: createHash("sha256")
        .update(tradeImage || "image")
        .digest("hex"),
      mediaUrl: tradeImage,
      mediaHash: createHash("sha256")
        .update(tradeImage || "image")
        .digest("hex"),
      mediaType: "image/png",
      creators: [
        {
          name: chef?.name,
          address: user?.address,
          description: chef?.bio,
          contributionPercent: 100,
          socialMedia: [
            {
              platform: "Twitter",
              url: "http://x.com/" + chef?.twitter,
            },
          ],
        },
      ],
    };

    const nftMetadata = {
      name: chef?.nft_name,
      description: chef?.bio,
      image: tradeImage,
      external_url: "https://x.com/DefiusMaximus",
      attributes: [
        {
          trait_type: "Creator",
          value: chef?.name,
        },
        {
          trait_type: "Creator Address",
          value: user?.address,
        },
        {
          trait_type: "Creator X",
          value: "http://x.com/" + chef?.twitter,
        },
      ],
      properties: {
        files: [
          {
            uri: tradeImage,
            type: "image/png",
          },
        ],
        category: "image",
        creators: [
          {
            address: user?.address,
            share: 100,
          },
        ],
        socials: {
          twitter: chef?.twitter,
        },
      },
    };

    toast("Uploading IP Metadata to Walrus", {
      description: "Waiting for confirmation...",
    });
    const { uri: ipMetadataUri, hash: ipMetadataHash } =
      await uploadJsonToWalrus(`ip-${chef?.id}-${Date.now()}`, ipMetadata);

    toast("IP Metadata uploaded successfully", {
      description: "View your IP metadata on Walrus",
      action: {
        label: "View",
        onClick: () => {
          window.open(ipMetadataUri, "_blank");
        },
      },
    });
    console.log("IPFS Upload successful");
    toast("Uploading NFT Metadata to Walrus", {
      description: "Waiting for confirmation...",
    });

    const { uri: nftMetadataUri, hash: nftMetadataHash } =
      await uploadJsonToWalrus(`nft-${chef?.id}-${Date.now()}`, nftMetadata);

    console.log("IPFS Upload successful");
    toast("NFT Metadata uploaded successfully", {
      description: "View your NFT metadata on Walrus",
      action: {
        label: "View",
        onClick: () => {
          window.open(nftMetadataUri, "_blank");
        },
      },
    });

    console.log("INPUT");
    console.log({
      nftAddress: chef?.ip_address as Hex,
      ipMetadata: {
        ipMetadataUri,
        ipMetadataHash: ("0x" + ipMetadataHash) as Hex,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash: ("0x" + nftMetadataHash) as Hex,
      },
    });

    toast("Minting IP on Story", {
      description: "Waiting for confirmation...",
    });

    const { txHash, ipId, tokenId } = await mintAndRegisterIp(storyClient, {
      nftAddress: chef?.ip_address as Hex,
      ipMetadata: {
        ipMetadataUri,
        ipMetadataHash: ("0x" + ipMetadataHash) as Hex,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash: ("0x" + nftMetadataHash) as Hex,
      },
    });

    console.log("IP minted successfully");
    console.log("IP ID:", ipId);
    console.log("Token ID:", tokenId);
    console.log("Transaction Hash:", txHash);
    toast("Successfully minted your IP", {
      description: "Submitted your recipe for AI evaluation.",
      action: {
        label: "View IP",
        onClick: () => {
          window.open(
            `https://${
              IS_TESTNET ? "aeneid." : ""
            }explorer.story.foundation/ipa/${ipId}`,
            "_blank"
          );
        },
      },
    });
    const randomId = crypto.randomUUID();
    setTradePlayId(randomId);
    // Handle form submission here
    console.log({
      id: randomId,
      takeProfits,
      dcaPoints,
      selectedAsset,
      selectedChain,
      direction,
      selectedDate,
      entryPrice,
      leverage,
      stopLoss,
      researchDescription,
      image,
      imagePreview,
      selectedTime,
      expectedPnl,
    });

    const targetDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    targetDateTime.setHours(hours, minutes, 0, 0);

    const currentDate = new Date();
    const timeFrame = Math.floor(
      (targetDateTime.getTime() - currentDate.getTime()) / 1000
    );

    console.log(timeFrame);
    const formData = new FormData();
    formData.append("id", randomId);
    formData.append("chef_id", chef?.id || "");
    formData.append("username", chef?.user_id || "");
    formData.append("asset", selectedAsset);
    formData.append("direction", direction);
    formData.append("chain", selectedChain);
    formData.append("entry_price", entryPrice.toString());
    formData.append("stop_loss", stopLoss.toString());
    formData.append("leverage", leverage.toString());
    formData.append("timeframe", timeFrame.toString());
    formData.append("research_description", researchDescription);
    formData.append("dex", (selectedDex || "gmx").toUpperCase());
    formData.append("image_url", tradeImage);
    formData.append("take_profit", JSON.stringify(takeProfits));
    formData.append("dca", JSON.stringify(dcaPoints));
    formData.append("trade_type", selectedType.toLowerCase());
    formData.append("expected_pnl", expectedPnl.length > 0 ? expectedPnl : "0");
    console.log("FormData");
    console.log(formData);

    try {
      const response = await fetch("/api/supabase/create-play", {
        method: "POST",
        body: formData,
      });
      const { data, error } = await response.json();

      if (error) {
        console.log(error);
        setError(error);
        setLoading(0);
        return;
      }

      console.log("Successfully created play");
      setLoading(2);
      setRecipe(data);
    } catch (e) {
      setLoading(3);
    }
  };

  //   useEffect(() => {
  //     const channel = supabase
  //         .channel("realtime-table")
  //         .on("postgres_changes",
  //             { event: "INSERT", schema: "public", table: "your_table" },
  //             (payload) => {
  //                 console.log("New row inserted:", payload);
  //                 setMessages((prev) => [...prev, payload.new]); // Update state
  //             }
  //         )
  //         .subscribe();

  //     return () => {
  //         supabase.removeChannel(channel); // Clean up on unmount
  //     };
  // }, []);

  return (
    <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] left-[16%] xl:w-[38%] w-[70%] 2xl:h-full h-[600px] bg-[#1F1F1F] rounded-sm">
      <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-[#3A3A3A] py-2 bg-[#1F1F1F] text-white">
        <div className="flex justify-between items-center px-4">
          <div className="flex space-x-2 items-center">
            {selectedType != "Choose" && (
              <ChevronLeft
                className="h-5 mt-[2px] font-bold w-5 cursor-pointer"
                onClick={() => {
                  setSelectedType("Choose");

                  setSelectedDex(null);
                  setSelectedAsset("");
                  setSelectedChain("");
                }}
              />
            )}
            <h2 className="text-xl font-bold">
              Create {selectedType != "Choose" && selectedType} Trade Play
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="max-h-[calc(100vh-100px)] w-full">
          {selectedType == "Choose" ? (
            <div className="flex justify-center w-full mt-6">
              <div className="inline-grid grid-cols-2 gap-4 auto-cols-max">
                <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
                  <div
                    onClick={() => {
                      setSelectedType("Spot");
                    }}
                    className={`absolute cursor-pointer w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-[#3A3A3A] py-2  bg-[#1F1F1F] text-white  `}
                  >
                    <div className="flex space-x-1 items-center justify-center pt-2">
                      <p className="nouns spacing-2 tracking-wide text-xl">
                        Spot Trading
                      </p>
                    </div>
                    <OverlappingCircles
                      images={["/sushi.png", "circuit.png", "kitty.png"]}
                    />
                    <div className="px-4 mt-4 text-center">
                      <p className="text-sm font-medium mb-2">
                        Execute immediate trades or set limit orders for precise
                        control over your positions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
                  <div
                    onClick={() => {
                      setSelectedType("Perps");
                    }}
                    className={`absolute cursor-pointer w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-[#3A3A3A] py-2  bg-[#1F1F1F] text-white  `}
                  >
                    <div className="flex space-x-1 items-center justify-center pt-2">
                      <p className="nouns spacing-2 tracking-wide text-xl">
                        Perpetual Trading
                      </p>
                    </div>
                    <OverlappingCircles images={["/gmx.png", "/hype.png"]} />
                    <div className="px-4 mt-4 text-center">
                      <p className="text-sm font-medium mb-2">
                        Post Trade derivatives with leverage for enhanced
                        potential returns and hedging.
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
                  <div
                    onClick={() => {
                      setSelectedType("Memecoins");
                    }}
                    className={`absolute cursor-not-allowed w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm text-stone-400 bg-[#3A3A3A] py-2   `}
                  >
                    <div className="flex flex-col space-x-1 items-center justify-center pt-2">
                      <p className="nouns spacing-2 tracking-wide text-xl">
                        Memecoins
                      </p>
                      <p className=" spacing-2 tracking-wide text-xs italic">
                        (Coming soon)
                      </p>
                    </div>

                    <div className="px-4 mt-4 text-center">
                      <p className="text-sm font-medium mb-2">
                        Create high-risk, high-reward trade play opportunities
                        in the volatile world of Memecoins.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-[250px] h-[250px] relative bg-[#1F1F1F] rounded-sm">
                  <div
                    onClick={() => {
                      setSelectedType("Stocks");
                    }}
                    className={`absolute cursor-not-allowed w-[250px] h-[250px] flex flex-col justify-between items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm py-2  text-stone-400 bg-[#3A3A3A] `}
                  >
                    <div className="flex flex-col space-x-1 items-center justify-center pt-2">
                      <p className="nouns spacing-2 tracking-wide text-xl">
                        Stock Trading
                      </p>
                      <p className=" spacing-2 tracking-wide text-xs italic">
                        (Coming soon)
                      </p>
                    </div>

                    <div className="px-4 mt-4 text-center">
                      <p className="text-sm font-medium mb-2">
                        Post strategies to trade Stocks in today&apos;s market.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : promptStatus != "completed" ? (
            <div className="flex flex-col justify-center items-center px-6 h-[500px] sen">
              <Label className="pb-4 flex space-x-2 items-center">
                <p>Generate Play with AI </p>
                <Sparkle className="h-3 w-3" />
              </Label>
              <Textarea
                className="h-32 resize-none text-black bg-gray-300"
                placeholder="Enter your prompt..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
              />
              <div className="flex justify-end space-x-3 pt-4 w-full">
                <Button
                  variant={"ghost"}
                  disabled={promptStatus == "pending"}
                  className="hover:bg-transparent border-2 border-[#1F1F1F] hover:border-gray-500 hover:text-white rounded-md"
                  onClick={() => {
                    setPromptStatus("completed");
                  }}
                >
                  Manual Mode
                </Button>
                <Button
                  className="rounded-md hover:bg-[#e6450d] rounded-md"
                  disabled={promptStatus == "pending"}
                  onClick={async () => {
                    if (prompt.length == 0) {
                      setError("Please enter a prompt");
                      return;
                    }
                    setPromptStatus("pending");
                    setError("");

                    try {
                      const response = await fetch("/api/gen-trade", {
                        method: "POST",
                        body: JSON.stringify({
                          prompt,
                          tradeType: selectedType.toLowerCase(),
                        }),
                      });

                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                          errorData.error || "Failed to generate trade data"
                        );
                      }

                      const data = await response.json();

                      // Handle state updates based on trade type
                      if (selectedType === "Spot") {
                        // Update spot trade state
                        setEntryPrice(data.entryPrice);
                        setStopLoss(data.stopLoss);
                        setTakeProfits(data.takeProfits || takeProfits);
                        setDcaPoints(data.dcaPoints || dcaPoints);
                        setSelectedAsset(data.selectedAsset || selectedAsset);
                        setSelectedChain(data.selectedChain || selectedChain);
                        setSelectedDate(
                          data.selectedDate
                            ? new Date(data.selectedDate)
                            : selectedDate
                        );
                        setSelectedTime(data.selectedTime || selectedTime);
                        setExpectedPnl(data.expectedPnl || expectedPnl);
                        setResearchDescription(
                          data.researchDescription || researchDescription
                        );
                      } else if (selectedType === "Perps") {
                        setEntryPrice(data.entryPrice);
                        setLeverage(data.leverage || leverage);
                        setStopLoss(data.stopLoss || stopLoss);
                        setTakeProfits(data.takeProfits || takeProfits);
                        setDcaPoints(data.dcaPoints || dcaPoints);
                        setSelectedAsset(data.selectedAsset || selectedAsset);
                        setDirection(data.direction || "buy_long");
                        setSelectedDate(
                          data.selectedDate
                            ? new Date(data.selectedDate)
                            : selectedDate
                        );
                        setSelectedTime(data.selectedTime || selectedTime);
                        setExpectedPnl(data.expectedPnl || expectedPnl);
                        setResearchDescription(
                          data.researchDescription || researchDescription
                        );
                      }

                      toast("Trade setup auto generated!", {
                        description: "You can manually change it accordingly.",
                      });
                      setPromptStatus("completed");
                    } catch (e) {
                      toast("Trade setup auto generated!", {
                        description: "You can manually change it accordingly.",
                      });
                      console.log(e);
                      setPromptStatus("completed");
                    }
                  }}
                >
                  {promptStatus == "waiting" ? (
                    <p>Auto Generate</p>
                  ) : (
                    <div className=" flex justify-center items-center space-x-2">
                      <CircleDashedIcon className="h-6 w-6 animate-spin text-white" />
                      <p className="sen text-white">Loading</p>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4 p-4 overflow-y-auto "
              onSubmit={handleSubmit}
            >
              {/* Top Row: DEX, Asset, Chain */}
              <div className="flex gap-4 items-start">
                {/* DEX Selection */}
                <div className="flex-none w-32">
                  <Label>DEX</Label>
                  <Popover>
                    <PopoverTrigger asChild className="bg-gray-300">
                      <Button
                        variant="outline"
                        className="w-full mt-2 hover:bg-[#BF4317] text-black hover:text-white"
                      >
                        {selectedDex && (
                          <img
                            src={`/${selectedDex}.png`}
                            className="rounded-full w-[24px] h-[24px]"
                            alt={selectedDex || "hj"}
                          />
                        )}
                        <p className="group-hover:text-white">
                          {selectedDex
                            ? exchanges.filter((e) => e.id == selectedDex)[0]
                                .name
                            : "Select DEX"}
                        </p>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 sen bg-gray-300"
                      align="start"
                    >
                      <Command>
                        <CommandList className="bg-gray-300">
                          <CommandGroup>
                            <CommandItem
                              value="any"
                              onSelect={() => {
                                setSelectedDex(null);

                                setSelectedAsset("");
                                setSelectedChain("");
                              }}
                              className="font-semibold group cursor-pointer"
                            >
                              <p className="group-hover:text-white ">
                                Select Dex
                              </p>
                              {selectedDex == null && (
                                <Check className="ml-auto h-4 w-4 group-hover:text-white" />
                              )}
                            </CommandItem>
                            {(selectedType == "Spot"
                              ? spotExchanges
                              : perpExchanges
                            ).map((exch, idx) => (
                              <CommandItem
                                key={idx}
                                value={exch.id}
                                onSelect={() => {
                                  setSelectedDex(exch.id as any);
                                  setSelectedAsset("");
                                  setSelectedChain("");
                                }}
                                className="font-semibold group cursor-pointer"
                              >
                                <img
                                  src={`/${exch.id}.png`}
                                  className="rounded-full w-[24px] h-[24px]"
                                  alt={exch.id}
                                />
                                <p className="group-hover:text-white">
                                  {exch.name}
                                </p>
                                {selectedDex === exch.id && (
                                  <Check className="ml-auto h-4 w-4 group-hover:text-white" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Asset Selection */}
                <div className="flex-1">
                  <Label>Asset</Label>
                  <Popover>
                    <PopoverTrigger asChild className="bg-gray-300">
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-between hover:bg-[#BF4317] text-black hover:text-white"
                        disabled={selectedDex == null}
                      >
                        <div className="ml-2 flex w-full items-center space-x-2">
                          <p className="sen font-semibold ">
                            {selectedAsset
                              ? `${selectedAsset}/USD`
                              : "Select Asset"}
                          </p>
                          {selectedAsset && (
                            <div className="flex space-x-1 flex-1 justify-end">
                              {(selectedType == "Spot"
                                ? [
                                    spotExchanges.filter(
                                      (e) => e.id == selectedDex
                                    )[0].chain,
                                  ]
                                : Object.keys(assets[selectedAsset]).filter(
                                    (chain: string) =>
                                      assets[selectedAsset][
                                        chain as "arb" | "avax"
                                      ] != ""
                                  )
                              ).map((chain: string) => (
                                <img
                                  key={chain}
                                  src={`/chains/${chain}.png`}
                                  className="rounded-full w-[24px] h-[24px]"
                                  alt={chain}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command className="bg-gray-300">
                        <CommandInput
                          placeholder="Search assets..."
                          className="sen "
                        />
                        <CommandList className="bg-gray-300">
                          <CommandEmpty className="sen p-4 text-sm text-center">
                            No assets found.
                          </CommandEmpty>
                          <CommandGroup>
                            {selectedType == "Spot"
                              ? (selectedDex == "sushi"
                                  ? sushiTokenList
                                  : selectedDex == "kitty"
                                  ? kittyTokenList
                                  : circuitTokenList
                                ).map(
                                  (
                                    asset: {
                                      address: string;
                                      chainId: number;
                                      decimals: number;
                                      logoURI: string;
                                      name: string;
                                      symbol: string;
                                    },
                                    idx: number
                                  ) => (
                                    <CommandItem
                                      key={asset.symbol}
                                      value={asset.symbol}
                                      onSelect={() =>
                                        handleAssetChange(asset.symbol)
                                      }
                                      className="w-full hover:bg-[#BF4317] cursor-pointer hover:text-white"
                                    >
                                      <div className="ml-2 flex w-full items-center space-x-2">
                                        <p className="sen font-semibold ">
                                          {asset.symbol}/USD
                                        </p>
                                        {selectedAsset === asset.symbol && (
                                          <Check className=" h-4 w-4" />
                                        )}
                                        <div className="flex space-x-1 flex-1 justify-end">
                                          {[
                                            selectedDex == "sushi"
                                              ? "base"
                                              : selectedDex == "kitty"
                                              ? "flow"
                                              : "zircuit",
                                          ].map((chain: string) => (
                                            <img
                                              key={chain}
                                              src={`/chains/${chain}.png`}
                                              className="rounded-full w-[24px] h-[24px]"
                                              alt={chain}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  )
                                )
                              : Object.entries(assets).map(
                                  ([asset, chains]) => (
                                    <CommandItem
                                      key={asset}
                                      value={asset}
                                      onSelect={() => handleAssetChange(asset)}
                                      className="group w-full hover:bg-[#BF4317] cursor-pointer hover:text-white"
                                    >
                                      <div className="ml-2 flex w-full items-center space-x-2">
                                        <p className="sen font-semibold group-hover:text-white">
                                          {asset}/USD
                                        </p>
                                        {selectedAsset === asset && (
                                          <Check className=" h-4 w-4 group-hover:text-white" />
                                        )}
                                        <div className="flex space-x-1 flex-1 justify-end">
                                          {Object.keys(chains)
                                            .filter(
                                              (chain: string) =>
                                                chains[
                                                  chain as "arb" | "avax"
                                                ] != ""
                                            )
                                            .map((chain: string) => (
                                              <img
                                                key={chain}
                                                src={`/chains/${chain}.png`}
                                                className="rounded-full w-[24px] h-[24px]"
                                                alt={chain}
                                              />
                                            ))}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  )
                                )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Chain Selection */}
                <div className="flex-1">
                  <Label>Chain</Label>
                  <Popover>
                    <PopoverTrigger asChild className="bg-gray-300">
                      <Button
                        variant="outline"
                        className="w-full mt-2 hover:bg-[#BF4317] text-black hover:text-white font-semibold"
                        disabled={
                          !selectedAsset ||
                          Object.keys(assets[selectedAsset] || {}).length === 1
                        }
                      >
                        {selectedChain != "" && (
                          <img
                            src={`/chains/${selectedChain}.png`}
                            className="rounded-full w-[24px] h-[24px]"
                            alt={selectedChain}
                          />
                        )}
                        {selectedChain
                          ? selectedChain.toUpperCase()
                          : "Select Chain"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 sen" align="start">
                      <Command>
                        <CommandList className="bg-gray-300">
                          <CommandGroup>
                            {selectedAsset &&
                              (selectedType == "Spot"
                                ? [
                                    spotExchanges.filter(
                                      (e) => e.id == selectedDex
                                    )[0].chain,
                                  ]
                                : Object.values(assets[selectedAsset]).filter(
                                    (address) => address != ""
                                  )
                              ).length > 1 && (
                                <CommandItem
                                  value="any"
                                  onSelect={() => setSelectedChain("")}
                                  className="hover:text-white"
                                >
                                  Any
                                  {selectedChain === "" && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              )}
                            {selectedAsset &&
                              (selectedType == "Spot"
                                ? [
                                    spotExchanges.filter(
                                      (e) => e.id == selectedDex
                                    )[0].chain,
                                  ]
                                : Object.keys(assets[selectedAsset]).filter(
                                    (chain) =>
                                      assets[selectedAsset][
                                        chain as "arb" | "avax"
                                      ] != ""
                                  )
                              ).map((chain) => (
                                <CommandItem
                                  key={chain}
                                  value={chain}
                                  onSelect={() => setSelectedChain(chain)}
                                  className="group font-semibold cursor-pointer"
                                >
                                  <img
                                    src={`/chains/${chain}.png`}
                                    className="rounded-full w-[24px] h-[24px]"
                                    alt={chain}
                                  />
                                  <p className="group-hover:text-white">
                                    {chain.toUpperCase()}
                                  </p>
                                  {selectedChain === chain && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Direction Radio Group */}
              {selectedType == "Perps" && (
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <RadioGroup
                    defaultValue="buy_long"
                    onValueChange={(value) =>
                      setDirection(value as "buy_long" | "sell_short")
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy_long" id="buy_long" />
                      <Label htmlFor="buy_long">Buy Long</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell_short" id="sell_short" />
                      <Label htmlFor="sell_short">Sell Short</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Entry Price */}
              <div className="space-y-2">
                <Label>Entry Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={entryPrice}
                  className="text-black bg-gray-300"
                  onChange={(e) => {
                    setEntryPrice(Number(e.target.value));
                  }}
                />
              </div>

              {/* Take Profit Points */}
              <div className="space-y-2">
                <Label>Take Profit Points</Label>
                {takeProfits.map((tp, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      className="text-black bg-gray-300"
                      value={tp.price}
                      onChange={(e) => {
                        const newTakeProfits = [...takeProfits];
                        newTakeProfits[index].price = e.target.value;
                        setTakeProfits(newTakeProfits);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Percentage"
                      step="0.1"
                      className="text-black bg-gray-300"
                      value={tp.percentage}
                      onChange={(e) => {
                        const newTakeProfits = [...takeProfits];
                        newTakeProfits[index].percentage = e.target.value;
                        setTakeProfits(newTakeProfits);
                      }}
                    />
                  </div>
                ))}
                <div className="flex space-x-2">
                  {" "}
                  {takeProfits.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTakeProfit}
                      className="flex items-center gap-1 hover:bg-black text-black hover:text-white bg-gray-300"
                    >
                      <Plus className="h-4 w-4" /> Add Take Profit
                    </Button>
                  )}
                  {takeProfits.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleSubTakeProfit}
                      className="flex items-center gap-1 bg-[#BF4317] hover:bg-[#BF4317]"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* DCA Points */}
              <div className="space-y-2">
                <Label>DCA Points</Label>
                {dcaPoints.map((dca, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={dca.price}
                      className="text-black bg-gray-300"
                      onChange={(e) => {
                        const newDcaPoints = [...dcaPoints];
                        newDcaPoints[index].price = e.target.value;
                        setDcaPoints(newDcaPoints);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Percentage"
                      step="0.1"
                      className="text-black bg-gray-300"
                      value={dca.percentage}
                      onChange={(e) => {
                        const newDcaPoints = [...dcaPoints];
                        newDcaPoints[index].percentage = e.target.value;
                        setDcaPoints(newDcaPoints);
                      }}
                    />
                  </div>
                ))}
                <div className="flex space-x-2">
                  {" "}
                  {dcaPoints.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddDCA}
                      className="flex items-center gap-1 hover:bg-black text-black hover:text-white bg-gray-300"
                    >
                      <Plus className="h-4 w-4" /> Add DCA points
                    </Button>
                  )}
                  {dcaPoints.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleSubDCA}
                      className="flex items-center gap-1 bg-[#BF4317] hover:bg-[#BF4317]"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Other Fields */}
              <div className="space-y-2">
                <Label>Stop Loss</Label>
                <Input
                  type="number"
                  step="0.01"
                  className="text-black bg-gray-300"
                  value={stopLoss}
                  onChange={(e) => {
                    setStopLoss(Number(e.target.value));
                  }}
                />
              </div>

              {selectedType == "Perps" && (
                <div className="space-y-2">
                  <Label>Leverage (1-20)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    className="text-black bg-gray-300"
                    step="1 "
                    value={leverage}
                    onChange={(e) => {
                      setLeverage(Number(e.target.value));
                    }}
                  />
                </div>
              )}

              <div className=" flex flex-col space-y-2">
                <Label>Timeframe</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild className="bg-gray-300">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal hover:bg-[#BF4317] text-black hover:text-white",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        className="sen bg-gray-300"
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    className={cn(
                      "h-10 px-3 py-2 rounded-md border border-gray-200",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "hover:border-gray-300",
                      "text-gray-900 placeholder:text-gray-400",
                      "transition-colors duration-200 w-[120px] bg-gray-300"
                    )}
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expected PNL (%)</Label>
                <Input
                  id="subFee"
                  type="number"
                  step="0.05"
                  min="1"
                  className="text-black bg-gray-300"
                  value={expectedPnl}
                  onChange={(e) => {
                    setExpectedPnl(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Research Description</Label>
                <Textarea
                  className="h-32 resize-none text-black bg-gray-300"
                  placeholder="Enter your research description..."
                  value={researchDescription}
                  onChange={(e) => {
                    setResearchDescription(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  className="bg-white"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md bg-gray-300"
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading != 0 && loading != 3}
              >
                {loading == 1
                  ? "Loading"
                  : loading == 2
                  ? "Successfully posted play ✅"
                  : loading == 3
                  ? "Something went wrong"
                  : "Create Trade Play"}
              </Button>
            </form>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreateRecipe;
