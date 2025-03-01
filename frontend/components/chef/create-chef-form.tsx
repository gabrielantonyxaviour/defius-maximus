"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { toast } from "sonner";
import { createSpgNftCollection } from "@/lib/story";
import { storeImage } from "@/lib/supabase";
import { uploadImageToWalrus } from "@/lib/walrus";
export default function CreateChefForm() {
  const { user, setChef, storyClient } = useEnvironmentStore((store) => store);
  const [name, setName] = useState("Gabriel Antony Xaviour");
  const [bio, setBio] = useState("I am the one who calls");
  const [twitter, setTwitter] = useState("gabrielaxyeth");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [niches, setNiches] = useState<string[]>(["spot", "perps"]);
  const [error, setError] = useState("");
  const [isPaidSubscription, setIsPaidSubscription] = useState(false);
  const [subFee, setSubFee] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [royaltyFee, setRoyaltyFee] = useState(10);
  const [nftName, setNftName] = useState("Gabriel");
  const [nftSymbol, setNftSymbol] = useState("GB");

  const nicheOptions = [
    { id: "spot", label: "Spot Trading" },
    { id: "perps", label: "Perps Trading" },
    { id: "memecoins", label: "Memecoins" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if image is square
      const img = new Image();
      img.onload = () => {
        if (img.width !== img.height) {
          setError("Please upload a square image");
          setImage(null);
          setImagePreview("");
          return;
        }
        setError("");
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (niches.length === 0) {
      setError("Please select at least one trading niche");
      setLoading(false);
      return;
    }
    if (!image) {
      setError("Please upload a profile image");
      setLoading(false);
      return;
    }
    if (!storyClient) {
      setError("Story client is not initialized");
      setLoading(false);
      return;
    }
    if (!user) {
      setError("User is not logged in");
      setLoading(false);
      return;
    }
    // Handle form submission here
    console.log({ name, bio, image, niches });

    try {
      toast("Deploying Story IP Collection", {
        description:
          "Creating a NFT collection to mint your trade plays as IP assets..",
      });

      toast("Uploading Profile to Walrus", {
        description: "Waiting for confirmation...",
      });
      const imageUrl = await uploadImageToWalrus(image);

      toast("Profile uploaded successfully", {
        description: "View your trade image on Walrus",
        action: {
          label: "View",
          onClick: () => {
            window.open(imageUrl, "_blank");
          },
        },
      });
      toast("Creating Story IP Collection", {
        description: "Waiting for confirmation...",
      });
      const { txHash, spgNftContract } = await createSpgNftCollection(
        storyClient,
        nftName,
        nftSymbol,
        imageUrl,
        user.address as string
      );

      toast("Story IP Collection Deployed", {
        description: `Creating your account. Finishing up...`,
        action: {
          label: "View Tx",
          onClick: () => {
            window.open(`https://aeneid.storyscan.xyz/tx/${txHash}`, "_blank");
          },
        },
      });

      const formData = new FormData();
      formData.append("name", name);
      formData.append("user_id", user?.id || "");
      formData.append("bio", bio);
      formData.append("image_url", imageUrl);
      formData.append("niches", JSON.stringify(niches));
      formData.append("subFee", subFee);
      formData.append("ip_address", spgNftContract as string);
      formData.append("nft_name", nftName);
      formData.append("nft_symbol", nftSymbol);
      formData.append("twitter", twitter);
      formData.append("royalty", royaltyFee.toString());
      formData.append(
        "chef_score",
        Math.floor(70 + Math.random() * 30).toString()
      );

      console.log("FormData");
      console.log(formData);
      const response = await fetch("/api/supabase/create-chef", {
        method: "POST",
        body: formData,
      });

      const { chef, error } = await response.json();

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      setChef(chef);
      setLoading(false);
      toast("Chef Profile Created", {
        description: `You are all set!`,
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="w-[600px] h-[700px] absolute top-[22%] left-[32%] bg-[#1F1F1F] rounded-sm">
      <div
        className={`absolute w-[600px] h-[700px] flex flex-col items-center -top-[1%] px-6 -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-[#3A3A3A] py-2 bg-[#1F1F1F] text-white`}
      >
        <div className="flex justify-between items-center w-full ">
          <p className=" font-bold text-lg">Create Chef</p>
        </div>
        <ScrollArea className="w-full h-full">
          <form onSubmit={handleSubmit} className="px-2 w-full space-y-8 py-6">
            {/* Section 1: Trader Profile */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">1 | Trader Profile</h2>
              </div>

              <div className="flex">
                <div className="w-1/2 space-y-2 pr-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-300 text-black"
                  />
                </div>
                <div className="space-y-2 w-1/2 pl-1">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    required
                    className="bg-gray-300 text-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  className="h-32 bg-gray-300 text-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">
                  Profile Image (Square format only)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageChange}
                  className="bg-gray-300"
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

              <div className="space-y-3">
                <Label>Trading Niches (Select at least one)</Label>
                <div className="space-y-2">
                  {nicheOptions.map((niche) => (
                    <div key={niche.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={niche.id}
                        checked={niches.includes(niche.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNiches([...niches, niche.id]);
                          } else {
                            setNiches(niches.filter((n) => n !== niche.id));
                          }
                        }}
                      />
                      <Label htmlFor={niche.id}>{niche.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: IP Configuration */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">2 | IP Configuration</h2>
              </div>

              <div className="flex">
                <div className="w-1/2 space-y-2 pr-1">
                  <Label htmlFor="nftName">NFT Name</Label>
                  <Input
                    id="nftName"
                    value={nftName}
                    onChange={(e) => setNftName(e.target.value)}
                    required
                    className="bg-gray-300 text-black"
                  />
                </div>
                <div className="space-y-2 w-1/2 pl-1">
                  <Label htmlFor="nftSymbol">NFT Symbol</Label>
                  <Input
                    id="nftSymbol"
                    value={nftSymbol}
                    onChange={(e) => setNftSymbol(e.target.value)}
                    required
                    className="bg-gray-300 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Subscription Settings */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">
                  3 | Subscription Settings
                </h2>
              </div>

              <div className="space-y-3">
                <Label htmlFor="isPaid">Subscription Type</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPaid"
                    checked={isPaidSubscription}
                    onCheckedChange={(checked) => {
                      setIsPaidSubscription(!!checked);
                      if (!checked) setSubFee("0");
                    }}
                  />
                  <p>Paid</p>
                  <Checkbox
                    id="isNotPaid"
                    checked={!isPaidSubscription}
                    onCheckedChange={(checked) => {
                      setIsPaidSubscription(!checked);
                      if (checked) setSubFee("0");
                    }}
                  />
                  <p>Free</p>
                </div>

                {isPaidSubscription && (
                  <div className="space-y-2">
                    <Label htmlFor="subFee">Subscription Fee (USDT)</Label>
                    <Input
                      id="subFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={subFee}
                      onChange={(e) => setSubFee(e.target.value)}
                      className="bg-gray-300 text-black"
                      required={isPaidSubscription}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="royaltyFee">Royalty Fee (%)</Label>
                <Input
                  id="royaltyFee"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={royaltyFee}
                  onChange={(e) => setRoyaltyFee(parseInt(e.target.value))}
                  className="bg-gray-300 text-black"
                  required
                />
                <p className="text-sm text-gray-500">
                  Enter a value between 0 and 50%
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full hover:bg-[#BF4317] bg-[#BF4317] text-white"
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
          <ScrollBar
            orientation="vertical"
            className="w-1 h-full bg-transparent"
          />
        </ScrollArea>
      </div>
    </div>
  );
}
