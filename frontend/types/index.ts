import { Hex } from "viem";

export type User = {
  id: string;
  name: string;
  paused: boolean;
  mode: "BLUE PILL" | "RED PILL";
  address: string;
  pkey: string;
  profit_goal?: number | null;
  agent_url?: string;
  profit_timeline?: number | null;
  email?: string | null;
};

export type Chef = {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  image: string;
  sub_fee: number;
  niche: string[];
  total_subscribers: number;
  avg_pnl_percentage: number;
  avg_calls_per_day: number;
};
export interface AssetData {
  [ticker: string]: {
    arb: string | null;
    avax: string | null;
  };
}
export type TradePlay = {
  id?: string;
  created_at: string;
  chef_id: string;
  chef?: Chef;
  dex: string;
  asset: string;
  chain: string;
  direction: string;
  entry_price: string;
  trade_type: "spot" | "perps";
  take_profit: TakeProfit[];
  stop_loss: string;
  dca: DCA[];
  timeframe: string;
  leverage: string;
  image: string;
  status: "pending" | "ongoing" | "completed";
  pnl_percentage?: string;
  expected_pnl: string;
  research_description: string;
  analysis?: Analysis;
};

export type Analysis = {
  risktoreward: string;
  longtermscore: string;
  marketstrength: string;
  chefreputation: string;
  equitypercent: string;
  explanation: string;
};

export type TakeProfit = {
  price: string;
  percentage: string;
};

export type DCA = {
  price: string;
  percentage: string;
};

export type ExecutedTrade = {
  id: string;
  trade_play_id: string;
  trade_play: TradePlay;
  created_at: string;
  user_id: string;
  amount: number;
  pnl_usdt: number;
  tx_hash: string;
  status: "ongoing" | "completed";
};

export type NFTMetadata = {};

export type IPMetadata = {
  ipMetadataUri: string;
  ipMetadataHash: Hex;
  nftMetadataURI: string;
  nftMetadataHash: Hex;
};

export type CreateChefFormInput = {
  name: string;
  bio: string;
  twitter: string;
  website: string;
};

export type MintIpInputParams = {
  nftAddress: `0x${string}`;
  ipMetadata: IPMetadata;
};
