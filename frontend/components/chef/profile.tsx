import {
  CircleDashedIcon,
  X,
  TrendingUp,
  Users,
  BarChart,
  Save,
  Zap,
  Check,
  ArrowUpRightFromSquare,
} from "lucide-react";
import { useEnvironmentStore } from "../context";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Chef } from "@/types";
import Image from "next/image";

export default function ChefProfile({
  chef_id,
  close,
}: {
  chef_id: string;
  close: () => void;
}) {
  const { user, chef, user_follows, setUserFollow } = useEnvironmentStore(
    (store) => store
  );
  const [chefData, setChefData] = useState<Chef | null>(null);
  const [isYourProfile, setIsYourProfile] = useState(false);
  const [loading, setLoading] = useState(0);
  useEffect(() => {
    console.log("useEffect triggered with chef_id:", chef_id);
    if (chef != undefined && chef_id === chef.id) {
      console.log("Setting chef data from store.");
      setIsYourProfile(true);
      setChefData(chef);
      return;
    }

    (async () => {
      console.log("Fetching chef data from API.");
      const response = await fetch(
        `/api/supabase/get-chef?username=${chef_id}`
      );
      const { chef, error } = await response.json();
      if (error) {
        console.error("Failed to fetch chef data:", error);
        return;
      }
      console.log("Fetched chef data:", chef);
      setChefData(chef);
    })();
  }, [chef_id]);

  return (
    <div className=" w-[600px] h-[400px] xl:h-[500px] absolute top-[18%] lg:top-[22%] left-[24%] lg:left-[32%] bg-[#1F1F1F] rounded-sm">
      <div className="absolute w-full h-full flex flex-col -top-[1%] -left-[1%] space-y-6 sen rounded-sm text-sm border-2 border-[#3A3A3A] p-6 bg-[#1F1F1F] text-white overflow-y-auto">
        {/* Header */}
        {!chefData || !user ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircleDashedIcon className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center w-full">
              <p className="font-bold text-lg">
                {chefData.id == chef?.id ? "Your Profile" : "Chef Profile"}
              </p>
              <X className="cursor-pointer hover:text-white" onClick={close} />
            </div>

            <Separator className="bg-[#1F1F1F]" />

            {/* Profile Header */}
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={chefData.image || ""} />
                <AvatarFallback>
                  {chefData.name?.charAt(0) || chefData.user_id.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div>
                  <h2 className="text-2xl font-bold">
                    {chefData.name || chefData.user_id}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 mt-1.5 ">
                  {chefData.niche.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#BF4317] text-white hover:bg-[#BF4317] hover:text-white"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {chefData.bio && (
                  <p className="text-sm text-gray-300 max-w-md">
                    {chefData.bio}
                  </p>
                )}
              </div>
            </div>

            <Separator className="bg-[#1F1F1F]" />

            {/* Stats */}
            <div className="grid grid-cols-3 w-full gap-6 pl-6">
              <div className="space-y-1">
                <div className="flex  items-center gap-2 text-white">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Avg. PNL</span>
                </div>
                <p className="text-2xl font-bold">
                  {chefData.avg_pnl_percentage.toFixed(2)}%
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Subscribers</span>
                </div>
                <p className="text-2xl font-bold">
                  {chefData.total_subscribers}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white">
                  <BarChart className="h-4 w-4" />
                  <span className="text-sm">Calls/Day</span>
                </div>
                <p className="text-2xl font-bold">
                  {chefData.avg_calls_per_day.toFixed(2)}
                </p>
              </div>
            </div>

            {/* <Separator className="bg-[#1F1F1F]" /> */}
            <div className="flex space-x-3">
              <Image
                src={"/chains/story.png"}
                width={25}
                height={25}
                alt="arbitrum"
                className="rounded-full"
              />
              <p className="text-sm text-gray-300">IP Account</p>
              <div
                className="group flex space-x-1 cursor-pointer"
                onClick={() => {
                  // win
                }}
              >
                <p className="group-hover:text-white text-gray-300">
                  {chef?.ip_address}
                </p>
                <ArrowUpRightFromSquare className="h-4 w-4" />
              </div>
            </div>

            {/* Subscription */}
            {chefData.id != chef?.id && (
              <div className="flex flex-col items-center space-y-1">
                <div className="relative bg-[#1F1F1F] w-[200px] h-[34px] rounded-sm mx-auto">
                  {" "}
                  <Button
                    disabled={
                      loading == 1 ||
                      loading == 3 ||
                      user_follows.includes(chefData.id)
                    }
                    onClick={async (e) => {
                      setLoading(1);
                      const followResponse = await fetch(
                        "/api/supabase/follow-chef",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            username: user.id,
                            chef_id: chefData.id,
                            confidence_level: 80,
                          }),
                        }
                      );

                      const { success, error } = await followResponse.json();
                      if (error) {
                        console.error("Failed to follow chef:", error);
                        setLoading(2);
                        return;
                      }
                      console.log("Followed chef:", success);
                      setUserFollow(chefData.id);
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      setLoading(3);
                    }}
                    className="group absolute -top-[4px] -left-[2px] rounded-sm w-full h-[36px] flex py-4 px-6 bg-[#BF4317] hover:bg-[#BF4317] hover:text-white border-[1px] border-[#3A3A3A] mr-[2px]"
                  >
                    {loading == 1 ? (
                      <>
                        <CircleDashedIcon className="animate-spin" />
                        <p>Following...</p>
                      </>
                    ) : loading == 2 ? (
                      <>
                        <X />
                        <p>Error </p>
                      </>
                    ) : user_follows.includes(chefData.id) || loading == 3 ? (
                      <>
                        <Check className="h-6 w-6" />
                        <p>Subscribed</p>
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6" />
                        <p>Follow</p>
                      </>
                    )}
                  </Button>
                </div>

                {!user_follows.includes(chefData.id) && (
                  <p className="text-xs">at {chefData.sub_fee} USDT/month</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
