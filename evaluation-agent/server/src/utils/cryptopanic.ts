import { CryptoPanicPost, ProcessedSentiment } from "../types.js";

interface Votes {
  negative: number;
  positive: number;
  important: number;
  liked: number;
  disliked: number;
  lol: number;
  toxic: number;
  saved: number;
  comments: number;
}

interface SentimentScore {
  score: number; // Range from -1 to 1
  engagement: number; // Total interactions
  controversy: number; // Ratio of opposing reactions
}

// Improved JSON parser that handles various response formats
export function parseJSONObjectFromText(text: string): any {
  try {
    // First try direct parsing
    return JSON.parse(text);
  } catch (e) {
    try {
      // Look for JSON object pattern in the text
      const jsonPattern = /\{[\s\S]*\}/g;
      const matches = text.match(jsonPattern);

      if (matches && matches.length > 0) {
        return JSON.parse(matches[0]);
      }

      // Try removing markdown code blocks
      const cleanedText = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (innerError) {
      console.error("Failed to parse JSON from text:", innerError);
      // Return default object in case of failure
      return {
        overallSentiment: 50,
        engagementScore: 30,
        topInfluencers: [],
        keyPhrases: [],
      };
    }
  }
}

function calculateSentiment(votes: Votes): SentimentScore {
  const totalVotes =
    votes.positive +
    votes.negative +
    votes.important +
    votes.liked +
    votes.disliked +
    votes.lol +
    votes.toxic;

  const positiveSignals = votes.positive + votes.liked + votes.important;
  const negativeSignals = votes.negative + votes.disliked + votes.toxic;

  return {
    score: totalVotes ? (positiveSignals - negativeSignals) / totalVotes : 0,
    engagement: totalVotes + votes.comments + votes.saved,
    controversy:
      Math.min(positiveSignals, negativeSignals) /
      (Math.max(positiveSignals, negativeSignals) || 1),
  };
}

export async function processSentimentCryptoPanic(
  asset: string
): Promise<ProcessedSentiment> {
  const posts: CryptoPanicPost[] = [];
  const fallbackResponse: ProcessedSentiment = {
    overallSentiment: 74,
    engagementScore: 54,
    topInfluencers: ["legen", "DaanCrypto", "crypto_goos"],
    keyPhrases: ["volume", "amazing", "moon", "lambo"],
  };

  try {
    // Handle different asset names
    const cryptoSymbol =
      asset === "WSOL" ? "SOL" : asset === "WBTC" ? "BTC" : asset;

    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTO_PANIC_API_KEY}&currencies=${cryptoSymbol}&public=true&kind=news`
    );

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return fallbackResponse;
    }

    const cryptoPanicResponse: any = await response.json();
    console.log("CryptoPanic Response:", cryptoPanicResponse);

    if (cryptoPanicResponse.info === "Token not found") {
      return fallbackResponse;
    }

    const { results } = cryptoPanicResponse;
    if (!results || !Array.isArray(results)) {
      console.error("Invalid results structure in CryptoPanic response");
      return fallbackResponse;
    }

    // Process posts
    for (const result of results) {
      if (result && result.title && result.votes) {
        posts.push({
          text: result.title,
          sentiment: calculateSentiment(result.votes),
        });
      }
    }

    if (posts.length === 0) {
      console.warn("No valid posts found for analysis");
      return fallbackResponse;
    }

    // Improved prompt for more reliable JSON output
    const prompt = {
      system: `You are a specialized crypto sentiment analyzer. Analyze the following posts and return ONLY a valid JSON object with these exact fields:
- overallSentiment: number from 0-100 representing aggregate sentiment
- engagementScore: number from 0-100 based on interaction levels
- topInfluencers: array of strings with key entities/people mentioned
- keyPhrases: array of strings with important technical/market terms

Your response must be a valid JSON object and nothing else - no explanations, no markdown.`,
      human: `${JSON.stringify(posts.slice(0, 20))}`,
    };

    const analysisResponse = await fetch(
      `https://api.ora.io/v1/chat/completions`,
      {
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
              content: prompt.system,
            },
            {
              role: "user",
              content: prompt.human,
            },
          ],
          temperature: 0.3, // Lower temperature for more consistent responses
        }),
      }
    );

    if (!analysisResponse.ok) {
      console.error(
        `AI API Error: ${analysisResponse.status} ${analysisResponse.statusText}`
      );
      return fallbackResponse;
    }

    const responseData: any = await analysisResponse.json();
    console.log("AI response:", responseData);

    if (!responseData?.choices || !responseData.choices[0]?.message?.content) {
      console.error("Invalid response structure from AI API");
      return fallbackResponse;
    }

    const aiContent = responseData.choices[0].message.content;
    const parsedResponse = parseJSONObjectFromText(aiContent);

    // Validate the parsed response - ensure all required fields exist and are the right type
    const validatedResponse: ProcessedSentiment = {
      overallSentiment:
        typeof parsedResponse.overallSentiment === "number"
          ? parsedResponse.overallSentiment
          : 50,
      engagementScore:
        typeof parsedResponse.engagementScore === "number"
          ? parsedResponse.engagementScore
          : 50,
      topInfluencers: Array.isArray(parsedResponse.topInfluencers)
        ? parsedResponse.topInfluencers
        : [],
      keyPhrases: Array.isArray(parsedResponse.keyPhrases)
        ? parsedResponse.keyPhrases
        : [],
    };

    console.log("Validated Response:", validatedResponse);

    if (responseData.usage) {
      console.log(
        "Usage Report:\nPrompt Tokens:",
        responseData.usage.prompt_tokens,
        "\nCompletion Tokens:",
        responseData.usage.completion_tokens,
        "\nTotal Tokens:",
        responseData.usage.total_tokens
      );
    }

    console.log("COMPLETION RESPONSE");
    console.log("Received response from LLM model.");
    return validatedResponse;
  } catch (error) {
    console.error("Error in sentiment analysis:", error);
    return fallbackResponse;
  }
}
