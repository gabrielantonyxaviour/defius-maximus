import { Router, Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { Analysis, TradePlay } from "../types.js";
import { processCandles } from "../utils/candle.js";
// import { processSentiment } from "../utils/cookie.js";
import { parseJSONObjectFromText } from "../utils/index.js";
import { generateEmbeddings } from "../utils/supavec.js";
import { getChef } from "../utils/chef.js";
import { createPlay } from "../utils/createPlay.js";
// import { processSentimentCryptoPanic } from "../utils/cryptopanic.js";

const isProd = JSON.parse(process.env.IS_PROD || "false");

declare module "express" {
  export interface Request {
    user?: JwtPayload; // Modify this type based on the actual JWT payload structure
    tradePlay?: TradePlay;
  }
}

const router = Router();
const client = jwksClient({
  jwksUri:
    "https://auth.privy.io/api/v1/apps/cm6sxwdpg00d7fe5wlubpqfzn/jwks.json",
});

async function getSigningKey(kid: string): Promise<string> {
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
}

export async function verifyPrivyToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log(isProd);
  if (!isProd) {
    next();
  } else {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" }); // ❌ Don't return inside `async` functions
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.decode(token, { complete: true }) as {
        header: { kid: string };
      } | null;
      if (!decoded || !decoded.header.kid) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      const key = await getSigningKey(decoded.header.kid);

      const verified = jwt.verify(token, key, {
        algorithms: ["RS256"],
      }) as JwtPayload;

      (req as any).user = verified; // ✅ Fix TypeScript error

      next();
      return;
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
  }
}

export function verifyTradeUsername(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(isProd);
  if (!isProd) {
    next();
  } else {
    if (!req.body) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const { username, tradePlay } = req.body as {
      tradePlay: TradePlay;
      username: string;
    };
    // Basic validation of required fields
    if (!username || !tradePlay.chef_id || !tradePlay.asset) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Get the authenticated username from Privy JWT
    const authenticatedUsername = req.user.telegram?.username;

    if (!authenticatedUsername) {
      res
        .status(401)
        .json({ error: "No telegram username found in authentication token" });
      return;
    }

    // Verify username matches
    if (username !== authenticatedUsername) {
      res.status(403).json({
        error: "Username mismatch",
        message: "The provided username does not match the authenticated user",
      });
      return;
    }

    // Store validated trade play in request for later use
    req.tradePlay = tradePlay;
    next();
  }
}
router.post("/play", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Received trade play request:", req.body);
    const { tradePlay } = req.body as {
      tradePlay: TradePlay;
      username: string;
    };

    console.log(
      "Processing candles data for asset:",
      tradePlay.asset,
      "on chain:",
      tradePlay.chain
    );
    const proccessedCandlesData = await processCandles(
      tradePlay.trade_type || "perps",
      tradePlay.asset,
      tradePlay.chain || "arbitrum"
    );
    console.log("Processed candles data:", proccessedCandlesData);

    console.log("Processing social sentiment data for asset:", tradePlay.asset);
    // const processSocialSentimentData = await processSentiment([
    //     `%24${tradePlay.asset}%20news`,
    //     `%24${tradePlay.asset}%20analysis`,
    //     `%24${tradePlay.asset}%20processSocialSentimentData`,
    //     `%24${tradePlay.asset}%20forecast`,
    //     `%24${tradePlay.asset}%20degen`
    // ]);

    // const processSocialSentimentData = await processSentimentCryptoPanic(
    //   tradePlay.asset
    // );
    const processSocialSentimentData = {
      overallSentiment: 74,
      engagementScore: 54,
      topInfluencers: ["elonmusk", "vitalikbuterin"],
      keyPhrases: ["ethereum", "bullish", "bearish"],
    };
    console.log("Processed social sentiment data:", {
      overallSentiment: 74,
      engagementScore: 54,
      topInfluencers: ["elonmusk", "vitalikbuterin"],
      keyPhrases: ["ethereum", "bullish", "bearish"],
    });

    console.log("Generating embeddings for trade play");
    const processedTechincalAnalysis = await generateEmbeddings(
      tradePlay,
      proccessedCandlesData,
      {
        overallSentiment: 74,
        engagementScore: 54,
        topInfluencers: ["elonmusk", "vitalikbuterin"],
        keyPhrases: ["ethereum", "bullish", "bearish"],
      }
    );
    console.log("Generated technical analysis:", processedTechincalAnalysis);

    const eggAiSystemPrompt = `
        You are an advanced crypto trade analyst and social sentiment expert. You have been asked to evaluate a future trading position for a user.`;

    const chefAnalysis = getChef(tradePlay.chef_id);

    const playAnalysisPrompt = `
Evaluate trade opportunity:
${JSON.stringify(
  {
    setup: {
      asset: tradePlay.asset,
      direction: tradePlay.direction,
      entry: tradePlay.entry_price,
      targets: tradePlay.take_profit,
      stopLoss: tradePlay.stop_loss,
    },
    market: {
      price: proccessedCandlesData.currentPrice,
      change24h: proccessedCandlesData.priceChange24h,
      volatility: proccessedCandlesData.volatility24h,
      trend: proccessedCandlesData.trendMetrics,
    },
    sentiment: {
      score: processSocialSentimentData.overallSentiment,
      engagement: processSocialSentimentData.engagementScore,
      narrative: processSocialSentimentData.keyPhrases[0],
    },
  },
  null,
  2
)}

${chefAnalysis}

${processedTechincalAnalysis}

Please provide a risk assessment with these scores (0-100):
\`\`\`json
{
    "risktoreward": "number" // Based on TP/SL ratio, market volatility, and trend alignment
    "longtermscore": "number" // Consider trend strength, social processSocialSentimentData, and macro factors
    "marketstrength": "number" // Evaluate momentum, volume profile, and price action
    "chefreputation": "number" // Based on historical accuracy and analysis quality
    "equitypercent": "number" // Recommended position size considering all risk factors between 5% to 20%
    "explanation": "string" // Your explanation for the your anlaysis
}
\`\`\`
`;

    console.log(
      "Sending request to AI endpoint:",
      "https://llm-gateway.heurist.xyz/v1/chat/completions"
    );
    const analysisResponse = await fetch(
      `https://llm-gateway.heurist.xyz/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${process.env.HEURIST_AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct",
          messages: [
            {
              role: "system",
              content: eggAiSystemPrompt,
            },
            {
              role: "user",
              content: playAnalysisPrompt,
            },
          ],
        }),
      }
    );

    const { choices, usage } = (await analysisResponse.json()) as {
      choices: {
        index: number;
        message: {
          content: string;
          role: string;
        };
        finish_reason: string;
        logprobs: null;
      }[];
      usage: {
        prompt_tokens: string;
        completion_tokens: string;
        total_tokens: string;
      };
    };

    const parsedResponse = parseJSONObjectFromText(
      choices[0].message.content
    ) as Analysis;

    console.log("Parsed Response:", parsedResponse);
    console.log(
      "Usage Report:\nPrompt Tokens:",
      usage.prompt_tokens,
      "\nCompletion Tokens:",
      usage.completion_tokens,
      "\nTotal Tokens:",
      usage.total_tokens
    );

    const { error } = await createPlay({
      ...tradePlay,
      analysis: parsedResponse,
    });

    if (error) {
      res.status(500).json({ error: "Failed to create trade play" });
      return;
    }
    console.log({
      data: { ...tradePlay, analysis: parsedResponse },
    });
    res.json({
      data: { ...tradePlay, analysis: parsedResponse },
    });
  } catch (error) {
    console.error("Error processing trade play request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
