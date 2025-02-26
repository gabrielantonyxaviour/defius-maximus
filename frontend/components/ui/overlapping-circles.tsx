"use client";

import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface OverlappingCirclesProps {
  images: string[];
}

const OverlappingCircles = ({ images = [] }: OverlappingCirclesProps) => {
  return (
    <div className="flex flex-row items-center">
      {images.map((imagePath, index) => (
        <Avatar
          key={index}
          className={`h-16 w-16 ${
            index > 0 ? "-ml-4" : ""
          } rounded-full border-2 border-[#3A3A3A] bg-background shadow-sm hover:z-10 transition-transform hover:scale-110`}
        >
          <AvatarImage
            src={imagePath}
            alt={`Image ${index + 1}`}
            className="rounded-full object-cover"
          />
        </Avatar>
      ))}
    </div>
  );
};

export default OverlappingCircles;
