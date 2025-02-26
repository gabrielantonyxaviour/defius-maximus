/* eslint-disable @typescript-eslint/no-explicit-any */

import { resolve } from "path";
const __dirname = new URL(".", import.meta.url).pathname;
import { config } from "dotenv";
config();

export type AnyType = any;
export const chainMap: Record<string, string> = {
    arbSepolia: "421614",
    arb: "42161",
    avax: "43114",
    avaxFuji: "43113"
};

export const getTokenMetadataPath = () => {
    const path = resolve(
        __dirname,
        "..",
        "..",
        process.env.TOKEN_DETAILS_PATH || "token_metadata.example.jsonc"
    );
    console.log("tokenMetadataPath:", path);
    return path;
};

export interface TokenMetadata {
    name: string;
    symbol: string;
    description: string;
    websiteLink: string;
    twitter: string;
    discord: string;
    telegram: string;
    nsfw: boolean;
    image: string;
}

export interface MintResponse {
    response: {
        contract: {
            fungible: {
                object: string;
                name: string;
                symbol: string;
                media: string | null;
                address: string;
                decimals: number;
            };
        };
    };
}

export const getCollablandApiUrl = () => {
    return (
        process.env.COLLABLAND_API_URL || "https://api-qa.collab.land/accountkit/v1"
    );
};

export const getCardHTML = (botUsername: string, claimURL: string) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="twitter:card" content="player" />
	<meta name="twitter:site" content="@${botUsername}" />
	<meta name="twitter:title" content="AI Agent Starter Kit" />
	<meta name="twitter:description"
		content="This is a sample card for claiming airdrops with the AI Agent Starter Kit" />
	<meta name="twitter:image" content="https://assets.collab.land/collabland-logo.png" />
	<meta name="twitter:player" content="${claimURL}" />
	<meta name="twitter:player:width" content="480" />
	<meta name="twitter:player:height" content="480" />
</head>

<body>
	<title>Claim token airdrop.</title>
</body>

</html>`;
};


export function parseJSONObjectFromText(
    text: string
): Record<string, any> | null {
    let jsonData = null;
    const jsonBlockMatch = text.match(jsonBlockPattern);

    if (jsonBlockMatch) {
        const parsingText = normalizeJsonString(jsonBlockMatch[1]);
        try {
            jsonData = JSON.parse(parsingText);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.error("Text is not JSON", text);
            return extractAttributes(parsingText);
        }
    } else {
        const objectPattern = /{[\s\S]*?}/;
        const objectMatch = text.match(objectPattern);

        if (objectMatch) {
            const parsingText = normalizeJsonString(objectMatch[0]);
            try {
                jsonData = JSON.parse(parsingText);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.error("Text is not JSON", text);
                return extractAttributes(parsingText);
            }
        }
    }

    if (
        typeof jsonData === "object" &&
        jsonData !== null &&
        !Array.isArray(jsonData)
    ) {
        return jsonData;
    } else if (typeof jsonData === "object" && Array.isArray(jsonData)) {
        return parseJsonArrayFromText(text);
    } else {
        return null;
    }
}
const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;


export function parseJsonArrayFromText(text: string) {
    let jsonData = null;

    // First try to parse with the original JSON format
    const jsonBlockMatch = text.match(jsonBlockPattern);

    if (jsonBlockMatch) {
        try {
            // Only replace quotes that are actually being used for string delimitation
            const normalizedJson = jsonBlockMatch[1].replace(
                /(?<!\\)'([^']*)'(?=\s*[,}\]])/g,
                '"$1"'
            );
            jsonData = JSON.parse(normalizedJson);
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.error("Failed parsing text:", jsonBlockMatch[1]);
        }
    }

    // If that fails, try to find an array pattern
    if (!jsonData) {
        const arrayPattern = /\[\s*(['"])(.*?)\1\s*\]/;
        const arrayMatch = text.match(arrayPattern);

        if (arrayMatch) {
            try {
                // Only replace quotes that are actually being used for string delimitation
                const normalizedJson = arrayMatch[0].replace(
                    /(?<!\\)'([^']*)'(?=\s*[,}\]])/g,
                    '"$1"'
                );
                jsonData = JSON.parse(normalizedJson);
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.error("Failed parsing text:", arrayMatch[0]);
            }
        }
    }

    if (Array.isArray(jsonData)) {
        return jsonData;
    }

    return null;
}

const normalizeJsonString = (str: string) => {
    // Remove extra spaces after '{' and before '}'
    str = str.replace(/\{\s+/, '{').replace(/\s+\}/, '}').trim();

    // "key": unquotedValue → "key": "unquotedValue"
    str = str.replace(
        /("[\w\d_-]+")\s*: \s*(?!"|\[)([\s\S]+?)(?=(,\s*"|\}$))/g,
        '$1: "$2"',
    );

    // "key": 'value' → "key": "value"
    str = str.replace(
        /"([^"]+)"\s*:\s*'([^']*)'/g,
        (_, key, value) => `"${key}": "${value}"`,
    );

    // "key": someWord → "key": "someWord"
    str = str.replace(/("[\w\d_-]+")\s*:\s*([A-Za-z_]+)(?!["\w])/g, '$1: "$2"');

    // Replace adjacent quote pairs with a single double quote
    str = str.replace(/(?:"')|(?:'")/g, '"');
    return str;
};

export function extractAttributes(
    response: string,
    attributesToExtract?: string[]
): { [key: string]: string | undefined } {
    const attributes: { [key: string]: string | undefined } = {};

    if (!attributesToExtract || attributesToExtract.length === 0) {
        // Extract all attributes if no specific attributes are provided
        const matches = response.matchAll(/"([^"]+)"\s*:\s*"([^"]*)"/g);
        for (const match of matches) {
            attributes[match[1]] = match[2];
        }
    } else {
        // Extract only specified attributes
        attributesToExtract.forEach((attribute) => {
            const match = response.match(
                new RegExp(`"${attribute}"\\s*:\\s*"([^"]*)"`, "i")
            );
            if (match) {
                attributes[attribute] = match[1];
            }
        });
    }

    return attributes;
}