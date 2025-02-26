import { ProcessedMarketData, ProcessedSentiment, TradePlay } from "../types.js";

function generateEmbeddingsPrompt(
    tradePlay: TradePlay,
    marketData: ProcessedMarketData,
    sentiment: ProcessedSentiment
): string {
    return `Analyze trading opportunity for ${tradePlay.asset}:

Market Context:
- Current Price: ${marketData.currentPrice}
- 24h Change: ${(marketData.priceChange24h * 100).toFixed(2)}%
- Volatility: ${(marketData.volatility24h * 100).toFixed(2)}%
- Trend: ${marketData.trendMetrics.direction} (Strength: ${marketData.trendMetrics.strength})

Trade Setup:
- Direction: ${tradePlay.direction}
- Entry: ${tradePlay.entry_price}
- Timeframe: ${tradePlay.timeframe}
- Type: ${tradePlay.trade_type}
- Leverage: ${tradePlay.leverage}

Social Sentiment:
- Overall Score: ${sentiment.overallSentiment}
- Key Influencers: ${sentiment.topInfluencers.join(', ')}
- Recent Narratives: ${sentiment.keyPhrases.slice(0, 2).join(' | ')}

Analyze for:
1. Pattern confirmation
2. Risk levels
3. Market psychology
4. Position sizing
5. Exit strategy optimization`;
}


export async function generateEmbeddings(
    tradePlay: TradePlay,
    marketData: ProcessedMarketData,
    sentiment: ProcessedSentiment
): Promise<string> {
    const prompt = generateEmbeddingsPrompt(tradePlay, marketData, sentiment);
    const file_ids = ["40f0b3c7-8b2d-4071-a066-a92cfa13ee05", "4d164884-4eb4-4f44-a4f8-755270d4736e", "6d3c84e9-3c16-4487-95e8-a3941a956bf8", "fa2e52c2-cb56-4491-b0b0-bde9e0a9607d", "94c868e2-262e-45ab-be23-47be5028361d", "284c006d-fbba-43df-8ef7-4c2bbfa856af"]

    const response = await fetch("https://api.supavec.com/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: process.env.SUPAVEC_API_KEY || "",
        },
        body: JSON.stringify({ query: prompt, file_ids }),
    });
    let formattedEmbeddings = "Technical Anlaysis Report:\n\n"

    const { success, documents } = await response.json() as { success: boolean; documents: { content: string; file_id: string; score: string; }[] };
    if (success) {
        documents.forEach(({ content, file_id, score }, index) => {
            console.log(file_id)
            formattedEmbeddings += `Report ${index + 1}\nScore: ${score}\n`
            formattedEmbeddings += `${content}\n`

        })
    } else {
        console.error("Failed to generate retrieval embeddings");
        return ""
    }

    return formattedEmbeddings + "\n";
}


