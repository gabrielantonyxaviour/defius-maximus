import { TokenList, TokenMapping, ChainTokenMapping, AggregatedToken, ChainId, ChainShortName } from './types'

import arbitrumTokens from './lists/42161.json'
import baseTokens from './lists/8453.json'
import mainnetTokens from './lists/1.json'
import gnosisTokens from './lists/100.json'

import arbitrumMapping from './mappings/42161.json'
import baseMapping from './mappings/8453.json'
import mainnetMapping from './mappings/1.json'
import gnosisMapping from './mappings/100.json'

export const CHAIN_TOKEN_LISTS: Record<ChainShortName, TokenList> = {
  'arb': arbitrumTokens,
  'base': baseTokens,
  'eth': mainnetTokens,
  'gnosis': gnosisTokens
}

export const CHAIN_TOKEN_MAPPINGS: TokenMapping = {
  'arb': arbitrumMapping,
  'base': baseMapping,
  'eth': mainnetMapping,
  'gnosis': gnosisMapping
}
const CHAIN_TO_SHORT_NAME: Record<ChainId, ChainShortName> = {
  1: 'eth',
  42161: 'arb',
  100: 'gnosis',
  8453: 'base'
}
export const COW_SWAP_ASSETS = (() => {
  const tokenMap = new Map<string, AggregatedToken>();

  // Process each chain's tokens
  Object.entries(CHAIN_TOKEN_LISTS).forEach(([chainId, tokens]) => {

    tokens.forEach(token => {
      const existingToken = tokenMap.get(token.symbol);

      if (existingToken) {
        // Token already exists, just add the chain if not present
        if (!existingToken.chains.includes(chainId as ChainShortName)) {
          existingToken.chains.push(chainId as ChainShortName);
        }
      } else {
        // Create new token entry
        tokenMap.set(token.symbol, {
          name: token.name,
          symbol: token.symbol,
          chains: [chainId as ChainShortName]
        });
      }
    });
  });

  // Convert map to array and sort by symbol
  return Array.from(tokenMap.values()).sort((a, b) =>
    a.symbol.localeCompare(b.symbol)
  );
})()