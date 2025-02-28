import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chain } from "viem";
import { sepolia } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const humanityTestnet: Chain = {
  id: 1942999413,
  name: "Humanity Testnet",
  nativeCurrency: { name: "Test Humanity", symbol: "tHP", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.humanity.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "explorer.testnet.humanity.org",
      apiUrl: "explorer.testnet.humanity.org/api",
    },
  },
  testnet: true,
};

export function formattedNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "m";
  } else if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "k";
  } else {
    return num.toString();
  }
}
export function shortenAddress(address: string): string {
  console.log("[shorten address]");
  console.log(address);
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function shortenNullifier(nullifier: string): string {
  return `${nullifier.slice(0, 10)}...${nullifier.slice(-8)}`;
}

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";

export function formatDate(isoString: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(isoString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

export function timeAgo(isoTimestamp: string): string {
  const now = new Date();
  const date = new Date(isoTimestamp);
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60)
    return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`;

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60)
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12)
    return `${monthsAgo} month${monthsAgo !== 1 ? "s" : ""} ago`;

  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} year${yearsAgo !== 1 ? "s" : ""} ago`;
}
