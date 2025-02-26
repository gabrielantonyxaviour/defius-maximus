// Types for our analysis system

import { ProcessedSentiment, SentimentPost } from "../types.js";
function calculateSentimentScore(posts: SentimentPost[]): number {
    return posts.reduce((score, post) =>
        score + (post.matchingScore * post.smartEngagementPoints) / 100, 0
    ) / posts.length;
}

async function processSentiment(searchTerms: string[]): Promise<ProcessedSentiment> {
    const posts: SentimentPost[] = []
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - 48 * 60 * 60 * 1000);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const currentDateString = formatDate(currentDate);
    const pastDateString = formatDate(pastDate);
    for (const term of searchTerms) {
        const response = await fetch(`https://api.cookie.fun/v1/hackathon/search/${term}?from=${pastDateString}&to=${currentDateString}`, {
            headers: {
                'x-api-key': process.env.COOKIE_API_KEY || ""
            }
        })
        const { ok } = await response.json() as { ok: SentimentPost[] };
        posts.push(...ok);
        console.log(response)
        // const response = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTO_PANIC_API_KEY}&currencies=${term}&public=true&panic_score=true&kind=news`)
        // const {results }=await response.json()
    }

    // Calculate weighted engagement score
    const engagementScores = posts.map(post => ({
        score: (post.engagementsCount * 0.4 +
            post.impressionsCount * 0.3 +
            post.smartEngagementPoints * 0.3) / 1000,
        username: post.authorUsername
    }));

    // Get top influencers by engagement
    const topInfluencers = engagementScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.username);

    // Extract key phrases (simplified version)
    const keyPhrases = posts
        .map(post => post.text)
        .slice(0, 5);


    return {
        overallSentiment: calculateSentimentScore(posts),
        engagementScore: engagementScores.reduce((sum, item) => sum + item.score, 0) / engagementScores.length,
        topInfluencers,
        keyPhrases
    };
}

export {
    processSentiment
}