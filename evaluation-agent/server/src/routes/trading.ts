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
import { processSentimentCryptoPanic } from "../utils/cryptopanic.js";
import { LogType, createLog } from "../utils/pushLog.js";

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
  console.log("Received trade play request:", req.body);
  const { tradePlay, name } = req.body as {
    tradePlay: TradePlay;
    name: string;
  };

  const tradePlayId = tradePlay.id;
  try {
    await createLog(
      tradePlay.id,
      "Trade Play Initiated",
      `New trade play initiated for ${tradePlay.asset} (${tradePlay.direction}) by ${name}`,
      LogType.INFO
    );

    console.log(
      "Processing candles data for asset:",
      tradePlay.asset,
      "on chain:",
      tradePlay.chain
    );
    const proccessedCandlesData = await processCandles(
      tradePlay.trade_type || "perps",
      tradePlay.asset,
      tradePlay.chain || "arb"
    );
    await createLog(
      tradePlayId,
      "Processing Candle Stick Data",
      `Starting market data analysis for ${tradePlay.asset} on ${tradePlay.chain || "arbitrum"}`,
      LogType.INFO
    );

    console.log("Processed candles data:", proccessedCandlesData);
    await createLog(
      tradePlayId,
      "Candle Stick Data Analysis",
      JSON.stringify(proccessedCandlesData, null, 2),
      LogType.JSON
    );
    await createLog(
      tradePlayId,
      "Gathering Social Sentiment",
      `Fetching social sentiment data for ${tradePlay.asset}`,
      LogType.INFO
    );
    console.log("Processing social sentiment data for asset:", tradePlay.asset);
    // TODO: Disabled cookie.fun because of API Key termination
    // const processSocialSentimentData = await processSentiment([
    //     `%24${tradePlay.asset}%20news`,
    //     `%24${tradePlay.asset}%20analysis`,
    //     `%24${tradePlay.asset}%20processSocialSentimentData`,
    //     `%24${tradePlay.asset}%20forecast`,
    //     `%24${tradePlay.asset}%20degen`
    // ]);

    const processSocialSentimentData = await processSentimentCryptoPanic(
      tradePlay.asset
    );

    await createLog(
      tradePlayId,
      "Social Sentiment Results",
      JSON.stringify(processSocialSentimentData, null, 2),
      LogType.JSON
    );

    await createLog(
      tradePlayId,
      "Technical Analysis",
      "Generating technical analysis embeddings...",
      LogType.INFO
    );

    console.log("Generating embeddings for trade play");
    const processedTechincalAnalysis = await generateEmbeddings(
      tradePlay,
      proccessedCandlesData,
      processSocialSentimentData
    );
    await createLog(
      tradePlayId,
      "Technical Analysis Results",
      processedTechincalAnalysis,
      LogType.DETAILED
    );

    const chefAnalysis = await getChef(tradePlay.chef_id);
    await createLog(
      tradePlayId,
      "Chef Analysis",
      `Chef Analysis from ID ${tradePlay.chef_id}:\n\n${chefAnalysis}`,
      LogType.DETAILED
    );
    console.log("Generated technical analysis:", processedTechincalAnalysis);
    const playAnalysisData = {
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
      sentiment: processSocialSentimentData,
    };
    await createLog(
      tradePlayId,
      "AI Analysis Request",
      JSON.stringify(playAnalysisData, null, 2),
      LogType.JSON
    );
    await createLog(
      tradePlayId,
      "Requesting AI Analysis",
      "Sending data to AI for comprehensive trade analysis...",
      LogType.INFO
    );

    const systemPrompt = `You are an advanced crypto trade analyst and social sentiment expert. Your task is to evaluate a trading position and provide a structured risk assessment with numerical scores.`;

    const userPrompt = `Evaluate this trade opportunity:
${JSON.stringify(playAnalysisData, null, 2)}

Chef Analysis:
${chefAnalysis}

Technical Analysis:
${processedTechincalAnalysis}

Provide a risk assessment with scores from 0-100 in this exact JSON format:
{
    "risktoreward": 75,
    "longtermscore": 60,
    "marketstrength": 85,
    "chefreputation": 70,
    "equitypercent": 15,
    "explanation": "Your detailed analysis explanation goes here."
}

The values should be numbers, not strings. Do not include any text outside the JSON structure.`;

    // Log the exact prompts we're sending for debugging
    await createLog(
      tradePlayId,
      "AI Request Details",
      `System Prompt: ${systemPrompt}\n\nUser Prompt: ${userPrompt}`,
      LogType.DETAILED
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`https://api.ora.io/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ORA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();

      await createLog(
        tradePlayId,
        "AI Request Error",
        `HTTP Error ${response.status}: ${errorText}`,
        LogType.DETAILED
      );

      throw new Error(
        `AI request failed with status ${response.status}: ${errorText}`
      );
    }

    // Log the raw response headers for debugging
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      responseHeaders[name] = value;
    });

    await createLog(
      tradePlayId,
      "AI Response Headers",
      JSON.stringify(responseHeaders, null, 2),
      LogType.JSON
    );

    const repsonseData = await response.json();

    console.log("AI response:", repsonseData);

    const { choices, usage } = repsonseData as {
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

    await createLog(
      tradePlayId,
      "AI Message Content",
      JSON.stringify(parsedResponse, null, 2),
      LogType.DETAILED
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
    await createLog(
      tradePlayId,
      "AI Request Failed",
      `Error occurred during AI request: ${error.message}\n\nStack: ${error.stack}`,
      LogType.DETAILED
    );

    res.status(400).json({
      success: true,
      tradePlay,
      error,
    });
  }
});

export default router;
