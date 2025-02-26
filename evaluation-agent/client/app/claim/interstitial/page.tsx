'use client'
import dynamic from "next/dynamic";

const InterstitialPage = dynamic(() => import("@/components/interstitial"), {
  ssr: false,
});

export default InterstitialPage;
