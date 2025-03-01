// app/api/generate-trade/route.ts
import { NextRequest, NextResponse } from "next/server";

// Define type for trade data
type TakeProfit = {
  price: string;
  percentage: string;
};

type DCA = {
  price: string;
  percentage: string;
};

type SpotTradeData = {
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfits: TakeProfit[];
  dcaPoints: DCA[];
  selectedAsset: string;
  selectedChain: string;
  selectedDate: string;
  selectedTime: string;
  expectedPnl: string;
  researchDescription: string;
};

type PerpTradeData = SpotTradeData & {
  leverage: number | null;
  direction: "buy_long" | "sell_short" | "";
};

// POST handler for the API route
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { prompt, tradeType } = body;

    // Validate input parameters
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!tradeType || (tradeType !== "spot" && tradeType !== "perps")) {
      return NextResponse.json(
        { error: "Valid tradeType (spot or perps) is required" },
        { status: 400 }
      );
    }

    // Select system prompt based on trade type
    const systemPrompt =
      tradeType === "spot"
        ? getSpotTradeSystemPrompt()
        : getPerpTradeSystemPrompt();

    // Call the AI provider
    const aiResponse = await callAiProvider(systemPrompt, prompt);

    // Return the parsed response
    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error("Error generating trade data:", error);
    return NextResponse.json(
      {
        error: "Failed to generate trade data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Function to get spot trade system prompt
function getSpotTradeSystemPrompt(): string {
  return `Generate a detailed spot trade JSON for cryptocurrency trading based on my description. If my input lacks sufficient details for a complete trade setup, generate reasonable values to create a complete trade setup.

Format the response as a complete, valid JSON object with the following structure:
{
  "entryPrice": [number or null],
  "stopLoss": [number or null],
  "takeProfits": [
    {"price": "[string]", "percentage": "[string]"},
    {"price": "[string]", "percentage": "[string]"}
  ],
  "dcaPoints": [
    {"price": "[string]", "percentage": "[string]"},
    {"price": "[string]", "percentage": "[string]"}
  ],
  "selectedAsset": "[string or empty string]",
  "selectedChain": "[string or empty string]",
  "selectedDate": "[YYYY-MM-DD or empty string]",
  "selectedTime": "[HH:MM or empty string]",
  "expectedPnl": "[string or empty string]",
  "researchDescription": "[detailed analysis - NEVER empty]"
}

Follow these specific requirements:
1. researchDescription must NEVER be empty - if not provided in the input, generate a reasonable trading rationale in about 200 characters.
2. Always include at least 2 take profit levels and 2 DCA points, even if not specified in the input.
3. Percentages for takeProfits must sum to exactly 100% (e.g., 30% and 70%, or 25%, 25%, and 50%).
4. Percentages for dcaPoints must sum to exactly 100% (e.g., 50% and 50%, or 30%, 40%, and 30%).
5. If take profits or DCA points are provided without percentages, distribute the percentages evenly or reasonably to total 100%.
6. All generated values should be realistic for the specified cryptocurrency.

IMPORTANT: Your entire response must be a valid, parseable JSON object with no additional text or explanations.`;
}

// Function to get perp trade system prompt
function getPerpTradeSystemPrompt(): string {
  return `Generate a detailed perpetual futures (perps) trade JSON for cryptocurrency trading based on my description. If my input lacks sufficient details for a complete trade setup, generate reasonable values to create a complete trade setup.

Format the response as a complete, valid JSON object with the following structure:
{
  "entryPrice": [number or null],
  "leverage": [number or null],
  "stopLoss": [number or null],
  "takeProfits": [
    {"price": "[string]", "percentage": "[string]"},
    {"price": "[string]", "percentage": "[string]"}
  ],
  "dcaPoints": [
    {"price": "[string]", "percentage": "[string]"},
    {"price": "[string]", "percentage": "[string]"}
  ],
  "selectedAsset": "[string or empty string]",
  "direction": "[buy_long or sell_short or empty string]",
  "selectedDate": "[YYYY-MM-DD or empty string]",
  "selectedTime": "[HH:MM or empty string]",
  "expectedPnl": "[string or empty string]",
  "researchDescription": "[detailed analysis - NEVER empty]"
}

Follow these specific requirements:
1. researchDescription must NEVER be empty - if not provided in the input, generate a reasonable trading rationale in about 200 characters.
2. Always include at least 2 take profit levels and 2 DCA points, even if not specified in the input.
3. Percentages for takeProfits must sum to exactly 100% (e.g., 30% and 70%, or 25%, 25%, and 50%).
4. Percentages for dcaPoints must sum to exactly 100% (e.g., 50% and 50%, or 30%, 40%, and 30%).
5. If take profits or DCA points are provided without percentages, distribute the percentages evenly or reasonably to total 100%.
6. All generated values should be realistic for the specified cryptocurrency.
7. If leverage is not specified, provide a reasonable default value between 1 and 10.
8. If direction is not specified, default to "buy_long".

IMPORTANT: Your entire response must be a valid, parseable JSON object with no additional text or explanations.`;
}

// Function to call the AI provider
async function callAiProvider(systemPrompt: string, userPrompt: string) {
  try {
    console.log(process.env.ORA_API_KEY);
    const response = await fetch(`https://api.ora.io/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();

    console.log("AI response:", responseData);

    const { choices } = responseData;

    if (!choices || choices.length === 0) {
      throw new Error("No choices returned from AI provider");
    }

    // Extract the content from the AI response
    const content = choices[0].message.content;

    // Parse the JSON content
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      throw new Error("AI response is not valid JSON");
    }
  } catch (error) {
    console.error("Error calling AI provider:", error);
    throw error;
  }
}
