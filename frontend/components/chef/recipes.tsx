"use client";

import { ArrowUpRightFromSquare, CircleDashedIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { CountdownTimer } from "../countdown-timer";

export default function Recipes({
  setOpenDetailedRecipe,
  close,
}: {
  setOpenDetailedRecipe: (id: string) => void;
  close: () => void;
}) {
  const { chef, recipes, setRecipes } = useEnvironmentStore((store) => store);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (chef == undefined) return;

    console.log(`Fetching recipes for chef: ${chef.name}`);

    (async () => {
      try {
        const response = await fetch(
          `/api/supabase/get-recipes?chef=${chef.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { recipes: fetchedRecipes, error } = await response.json();

        if (error) {
          console.error(`Error fetching recipes: ${error.message}`);
          return;
        }
        setRecipes(fetchedRecipes);
        console.log("Data fetched successfully:", fetchedRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    })();
  }, [chef]);
  return (
    <div className="2xl:relative absolute 2xl:top-[0%] 2xl:left-[0%] left-[16%] w-[80%] 2xl:h-full h-[600px] bg-[#1F1F1F] rounded-sm">
      <div className="absolute w-full h-full flex flex-col -top-[0.5%] -left-[0.5%] space-y-2 sen rounded-sm text-sm border-2 border-white py-2 bg-[#1F1F1F] text-white">
        <div className="flex justify-between items-center px-4">
          <h2 className="text-xl font-bold">Your Recipes</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[450px] px-6">
          <table className="w-full h-full">
            <thead>
              <tr className="text-left border-b-[1px] border-white sticky top-0 bg-[#1F1F1F]">
                <th className="py-3 font-bold text-center">Id</th>
                <th className="py-3 font-bold text-center">Chain</th>
                <th className="py-3 font-bold text-center">Asset</th>
                <th className="py-3 font-bold text-center">Direction </th>
                <th className="py-3 font-bold text-center">Timeframe </th>
                <th className="py-3 font-bold text-center">Trade Type</th>
                <th className="py-3 font-bold text-center">Status</th>
                <th className="py-3 font-bold text-center">PNL %</th>
                <th className="py-3 font-bold text-center">xPNL %</th>
                <th className="py-3 font-bold text-center">View</th>
              </tr>
            </thead>

            <tbody>
              {recipes.map((item, id) => (
                <tr
                  key={id}
                  className="border-b border-black/20 hover:bg-[#1F1F1F]/5"
                >
                  <td className="py-4 text-center pl-3">{id + 1}</td>
                  <td className="py-4 text-center">
                    <img
                      src={`/chains/${item.chain}.png`}
                      alt={item.asset}
                      className="w-6 h-6 mx-auto my-auto"
                    />
                  </td>
                  <td className="py-4 text-center">{item.asset}</td>
                  <td className="py-4 text-center">{item.direction}</td>
                  <td className="py-4 text-center">
                    {" "}
                    <CountdownTimer
                      createdAt={
                        item.created_at
                          ? item.created_at
                          : new Date().toISOString()
                      }
                      timeframe={item.timeframe ? parseInt(item.timeframe) : 0}
                    />
                  </td>
                  <td className="py-4 text-center">{item.trade_type}</td>
                  <td className="py-4 text-center">{item.status}</td>
                  <td className="py-4 text-center">
                    {item.pnl_percentage ? item.pnl_percentage : "N/A"}
                  </td>
                  <td className="py-4 text-center">{item.expected_pnl}</td>
                  <td className="py-4 text-center font-bold ">
                    <ArrowUpRightFromSquare
                      className="cursor-pointer hover:text-gray-700 mx-auto"
                      width={16}
                      onClick={() => {
                        if (!item || !item.id) return;
                        setOpenDetailedRecipe(item.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <CircleDashedIcon className="animate-spin" />
            </div>
          ) : (
            recipes.length == 0 && (
              <div className="w-full flex justify-center pt-12">
                <p className="text-md font-semibold text-gray-500">
                  No recipes found
                </p>
              </div>
            )
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
