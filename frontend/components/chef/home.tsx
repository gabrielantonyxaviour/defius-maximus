"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useEnvironmentStore } from "../context";
import { useRouter } from "next/navigation";
import Chef from "./profile";
import Recipes from "./recipes";
import CreateRecipe from "./create";

export default function ChefHome() {
  const nav = [
    {
      id: 1,
      name: "Profile",
      image: "/chef/profile.png",
    },
    {
      id: 2,
      name: "Recipes",
      image: "/chef/recipe.png",
    },
    {
      id: 3,
      name: "Play",
      image: "/chef/create.png",
    },
  ];
  const { user, chef } = useEnvironmentStore((store) => store);
  const [openDetailedRecipe, setOpenDetailedRecipe] = useState("");
  const [showWindows, setShowWindows] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const router = useRouter();

  useEffect(() => {
    if (user == undefined || chef == undefined) router.push("/");
  }, [user]);

  return user == undefined || chef == undefined ? (
    <div></div>
  ) : (
    <div className="flex justify-between h-screen">
      <div className="flex flex-col h-full justify-center space-y-8 xl:space-y-12  px-6">
        {nav.map((i) => (
          <div
            key={i.id}
            className="relative bg-[#1F1F1F] xl:w-[125px] xl:h-[100px] w-[100px] h-[80px] rounded-sm"
          >
            <div
              onClick={() => {
                setShowWindows((prev) =>
                  prev.map((val, index) => (index === i.id - 1 ? !val : val))
                );
              }}
              className={`absolute flex flex-col items-center -top-[4px] -left-[4px] w-full h-full space-y-2 sen  rounded-sm text-sm border border-[2px] border-black p-2 cursor-pointer ${
                showWindows[i.id - 1]
                  ? "bg-[#1F1F1F] text-white font-bold"
                  : "bg-[#BF4317] hover:bg-[#e6450d] text-white"
              }`}
            >
              <img
                src={i.image}
                alt={i.name}
                className="w-[30px] h-[30px] xl:w-[50px] xl:h-[50px]"
              />
              <p className="lg:text-sm md:text-xs hidden md:block">{i.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex my-auto space-x-4 h-[80%] px-4">
        {showWindows[2] && (
          <CreateRecipe
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 2 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[1] && (
          <Recipes
            setOpenDetailedRecipe={setOpenDetailedRecipe}
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 1 ? !val : val))
              );
            }}
          />
        )}
        {showWindows[0] && (
          <Chef
            chef_id={user.id}
            close={() => {
              setShowWindows((prev) =>
                prev.map((val, index) => (index === 0 ? !val : val))
              );
            }}
          />
        )}
      </div>
    </div>
  );
}
