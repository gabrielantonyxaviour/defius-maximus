import React, { useEffect, useState } from "react";
import {
  X,
  Plus,
  Check,
  Smile,
  Trash2,
  CalendarIcon,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
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
import { mintAndRegisterIp } from "@/lib/story";
import { Hex } from "viem";

interface CreateRecipeProps {
  close: () => void;
}
type TradeType = "Choose" | "Spot" | "Perps" | "Memecoins" | "Stocks";

type PerpsDex = "gmx";

type SpotDex = "sushi" | "circuit" | "kitty";

const CreateRecipe: React.FC<CreateRecipeProps> = ({ close }) => {
  const { chef, setRecipe, user, storyClient } = useEnvironmentStore(
    (store) => store
  );
  const [entryPrice, setEntryPrice] = useState<number>(2628); // Entry price for ETH
  const [leverage, setLeverage] = useState<number>(3); // Adjusted leverage for ETH
  const [stopLoss, setStopLoss] = useState<number>(2500); // Stop loss below entry

  const [takeProfits, setTakeProfits] = useState<TakeProfit[]>([
    { price: "2750", percentage: "30" }, // Take profit above entry
    { price: "2850", percentage: "100" }, // Another take profit level
  ]);

  const [dcaPoints, setDcaPoints] = useState<DCA[]>([
    { price: "2628", percentage: "30" }, // DCA below entry
    { price: "2600", percentage: "30" }, // Another DCA level
    { price: "2575", percentage: "40" }, // Another DCA level
  ]);

  const [selectedAsset, setSelectedAsset] = useState<string>(""); // Asset name
  const [selectedChain, setSelectedChain] = useState<string>(""); // Blockchain network
  const [direction, setDirection] = useState<"buy_long" | "sell_short">(
    "buy_long"
  ); // Position type
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Trade date
  const [selectedTime, setSelectedTime] = useState<string>("19:00"); // Trade time
  const [expectedPnl, setExpectedPnl] = useState<string>("12"); // Expected profit & loss
  const [selectedType, setSelectedType] = useState<TradeType>("Choose");
  const [selectedDex, setSelectedDex] = useState<PerpsDex | SpotDex | null>(
    null
  );

  const [researchDescription, setResearchDescription] = useState<string>(
    "Taking a long position on ETH at $2628 because technical indicators show bullish momentum with MACD crossover and RSI at 60. " +
      "On-chain metrics indicate growing network activity, with transaction volume up 15% to 5.2M ETH and active addresses increasing by 7% to 1.1M. " +
      "Recent whale accumulation of 120K ETH and improving liquidity suggest strong upside potential. The main risk is macroeconomic uncertainty, " +
      "but current price level offers an attractive risk/reward ratio for a long entry."
  );

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState<string>("");
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
            `https://aeneid.explorer.story.foundation/ipa/${ipId}`,
            "_blank"
          );
        },
      },
    });

    // Handle form submission here
    console.log({
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
      const { play, error } = await response.json();

      if (error) {
        console.log(error);
        setError(error);
        setLoading(0);
        return;
      }

      console.log("Successfully created play");
      console.log(play);
      setLoading(2);
      setRecipe(play);
    } catch (e) {
      setLoading(3);
    }
  };

  return (
    <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] left-[16%] xl:w-[48%] w-[80%] 2xl:h-full h-[600px] bg-[#1F1F1F] rounded-sm">
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
                    <PopoverTrigger asChild>
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
                    <PopoverContent className="p-0 sen" align="start">
                      <Command>
                        <CommandList>
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
                    <PopoverTrigger asChild>
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
                      <Command>
                        <CommandInput
                          placeholder="Search assets..."
                          className="sen"
                        />
                        <CommandList>
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
                                            spotExchanges.filter(
                                              (e) => e.id == selectedDex
                                            )[0].chain,
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
                    <PopoverTrigger asChild>
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
                        <CommandList>
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
                  className="text-black"
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
                      className="text-black"
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
                      className="text-black"
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
                      className="flex items-center gap-1 hover:bg-black text-black hover:text-white"
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
                      className="text-black"
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
                      className="text-black"
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
                      className="flex items-center gap-1 hover:bg-black text-black hover:text-white"
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
                  className="text-black"
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
                    className="text-black"
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
                    <PopoverTrigger asChild>
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
                        className="sen"
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
                      "transition-colors duration-200 w-[120px]"
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
                  className="text-black"
                  value={expectedPnl}
                  onChange={(e) => {
                    setExpectedPnl(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Research Description</Label>
                <Textarea
                  className="h-32 resize-none text-black"
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
                      className="w-32 h-32 object-cover rounded-md"
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
