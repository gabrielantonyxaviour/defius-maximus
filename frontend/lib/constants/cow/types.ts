// Types for your token data
export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI?: string
    extensions?: any
    id: string
    [key: string]: any
}

// This is for individual chain mappings (e.g., content of 42161.json)
export type ChainTokenMapping = {
    [symbol: string]: Token
}

export type TokenMapping = Record<ChainShortName, ChainTokenMapping>

// For the token lists
export type TokenList = Token[]
export type ChainShortName = 'eth' | 'arb' | 'gnosis' | 'base'
export type ChainId = 1 | 42161 | 100 | 8453
export interface AggregatedToken {
    name: string
    symbol: string
    chains: ChainShortName[]
}