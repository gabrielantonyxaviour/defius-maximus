"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useEnvironmentStore } from "../context";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export default function CreateChefForm() {
  const { user, setChef } = useEnvironmentStore((store) => store);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [niches, setNiches] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [isPaidSubscription, setIsPaidSubscription] = useState(false);
  const [subFee, setSubFee] = useState<string>("0");
  const [loading, setLoading] = useState(false);

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
      return;
    }
    if (!image) {
      setError("Please upload a profile image");
      return;
    }
    // Handle form submission here
    console.log({ name, bio, image, niches });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("user_id", user?.id || "");
    formData.append("bio", bio);
    formData.append("image", image);
    formData.append("niches", JSON.stringify(niches));
    formData.append("subFee", subFee);

    console.log("FormData");
    console.log(formData);
    const response = await fetch("/api/supabase/create-chef", {
      method: "POST",
      body: formData,
    });
    const { chef, error } = await response.json();

    if (error) {
      setError(error);
      return;
    }
    setChef(chef);
    setLoading(false);
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
          <form onSubmit={handleSubmit} className="px-2 w-full space-y-6 py-6">
            <div className=" flex">
              <div className="w-1/2 space-y-2 pr-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white text-black"
                />
              </div>
              <div className="space-y-2 w-1/2 pl-1">
                <Label htmlFor="name">User Id</Label>
                <Input
                  id="user_id"
                  value={user?.id}
                  disabled
                  required
                  className="bg-white"
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
                className="h-32 bg-white text-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image (Square format only)</Label>
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
            <div className="space-y-3">
              <Label htmlFor="isPaid">Paid Subscription</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={isPaidSubscription}
                  onCheckedChange={(checked) => {
                    setIsPaidSubscription(!!checked);
                    if (!checked) setSubFee("0");
                  }}
                />
                <p>Yes</p>
                <Checkbox
                  id="isNotPaid"
                  checked={!isPaidSubscription}
                  onCheckedChange={(checked) => {
                    setIsPaidSubscription(!checked);
                    if (!checked) setSubFee("0");
                  }}
                />
                <p>No</p>
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
                    className="bg-white text-black"
                    required={isPaidSubscription}
                  />
                </div>
              )}
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
