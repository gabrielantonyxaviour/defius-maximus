export interface IAccountInfo {
  pkpAddress: string;
  evm: {
    chainId: number;
    address: string;
  }[];
  solana: {
    network: string;
    address: string;
  }[];
}

export interface IExecuteUserOpRequest {
  target: string;
  value: string;
  calldata: string;
}

export interface IExecuteUserOpResponse {
  userOperationHash: string;
  chainId: number;
}

export interface ITransactionReceipt {
  transactionHash?: string;
  transactionIndex?: number;
  blockHash?: string;
  blockNumber?: number;
  from?: string;
  to?: string;
  cumulativeGasUsed?: number;
  status?: string;
  gasUsed?: number;
  contractAddress?: string | null;
  logsBloom?: string;
  effectiveGasPrice?: number;
}

export interface ILog {
  data?: string;
  blockNumber?: number;
  blockHash?: string;
  transactionHash?: string;
  logIndex?: number;
  transactionIndex?: number;
  address?: string;
  topics?: string[];
}

export interface IUserOperationReceipt {
  userOpHash?: string;
  entryPoint?: string;
  sender?: string;
  nonce?: number;
  paymaster?: string;
  actualGasUsed?: number;
  actualGasCost?: number;
  success?: boolean;
  receipt?: ITransactionReceipt;
  logs?: ILog[];
}

export type RawCandle = [number, number, number, number, number]; // [timestamp, open, high, low, close]

export type ProcessedCandle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};
export type ProcessedMarketData = {
  currentPrice: number;
  priceChange24h: number;
  volatility24h: number;
  volumeProfile: {
    averageVolume: number;
    volumeSpikes: number[];
  };
  trendMetrics: {
    direction: "bullish" | "bearish" | "sideways";
    strength: number;
    keyLevels: {
      support: number[];
      resistance: number[];
    };
  };
};

export type SentimentPost = {
  authorUsername: string;
  createdAt: string;
  engagementsCount: number;
  impressionsCount: number;
  likesCount: number;
  quotesCount: number;
  repliesCount: number;
  retweetsCount: number;
  smartEngagementPoints: number;
  text: string;
  matchingScore: number;
};

export type ProcessedSentiment = {
  overallSentiment: number;
  engagementScore: number;
  topInfluencers: string[];
  keyPhrases: string[];
};
export type TakeProfit = {
  price: string;
  percentage: string;
};

export type DCA = {
  price: string;
  percentage: string;
};

export type TradePlay = {
  id: string;
  created_at: string;
  chef_id: string;
  dex: string | null;
  asset: string;
  chain: string | null;
  direction: string;
  entry_price: string;
  trade_type: "spot" | "perps" | null;
  take_profit: TakeProfit[] | null;
  stop_loss: string;
  dca: DCA[] | null;
  timeframe: string; // Note: This is numeric in DB but string in TS
  leverage: string; // Note: This is numeric in DB but string in TS
  image: string | null;
  status: "pending" | "ongoing" | "completed" | null;
  pnl_percentage?: string | null;
  expected_pnl: string | null;
  research_description: string | null;
  analysis?: Analysis | null;
};
export type Analysis = {
  risktoreward: string;
  longtermscore: string;
  marketstrength: string;
  chefreputation: string;
  equitypercent: string;
  explanation: string;
};

interface SentimentScore {
  score: number; // Range from -1 to 1
  engagement: number; // Total interactions
  controversy: number; // Ratio of opposing reactions
}
export type CryptoPanicPost = {
  text: string;
  sentiment: SentimentScore;
};
