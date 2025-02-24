"use client";

import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Chef } from "@/types";

export default function Chefs({
  setSearchUsername,
  close,
}: {
  setSearchUsername: (u: string) => void;
  close: () => void;
}) {
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => {
    (async function () {
      const res = await fetch("/api/supabase/get-all-chefs");
      const { chefs: fetchedChefs, error } = await res.json();
      setChefs(fetchedChefs);
    })();
  }, []);

  return (
    <div className="w-[700px] h-[600px] absolute top-[18%] 2xl:top-[26%] left-[32%] bg-[#1F1F1F] rounded-sm">
      <div
        onClick={() => {}}
        className={`absolute w-full h-full flex flex-col items-center -top-[1%] -left-[1%] w-full h-full space-y-2 sen rounded-sm text-sm border border-[2px] border-white py-2 bg-[#1F1F1F] text-white`}
      >
        <div className="flex justify-between items-center w-full px-2">
          <p className="px-4 py-1 font-bold text-lg">Explore Chefs</p>
          <X className="cursor-pointer" onClick={close} />
        </div>

        <ScrollArea className="h-full px-6 w-full">
          <div className="space-y-4 py-2">
            {chefs.map((chef) => (
              <div
                key={chef.user_id}
                className={`w-[90%] relative bg-[#1F1F1F] rounded-sm`}
              >
                <div
                  className={`group cursor-pointer flex flex-col p-6 sen rounded-sm text-sm border border-[2px] border-white bg-[#BF4317] hover:bg-[#1F1F1F] text-[#1F1F1F] hover:text-white`}
                  onClick={() => setSearchUsername(chef.user_id)}
                >
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={chef.image || "/red.png"}
                        alt={chef.name || ""}
                      />
                      <AvatarFallback>{chef.name}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{chef.name}</h3>
                          <p className="text-sm text-gray-200 group-hover:text-gray-600">
                            @{chef.user_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {chef.sub_fee === 0
                              ? "Free"
                              : `$${chef.sub_fee}/month`}
                          </p>
                          <p className="text-sm text-gray-200 group-hover:text-gray-600">
                            {chef.total_subscribers} subs
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5 ">
                        {chef.niche.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="group-hover:bg-[#BF4317] group-hover:text-white"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-1.5 text-sm text-gray-200 group-hover:text-gray-600">
                        <p>Avg. PnL: {chef.avg_pnl_percentage.toFixed(2)}%</p>
                        <p>
                          Avg. Calls/Day: {chef.avg_calls_per_day.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
