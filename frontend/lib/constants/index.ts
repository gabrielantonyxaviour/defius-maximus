import { AssetData } from "@/types";
import { defineChain } from "viem";

export const COLOR_1 = "#faefe0"; // Light Brown
export const COLOR_2 = '#c49963' // Brown
export const COLOR_3 = '#d74b1a' // Red
export const COLOR_4 = '#568428' // Green
export const COLOR_5 = '#e0be1a' // Yellow

export const toolIpfsCids = ["QmW5KMbaKLVgh2oLegtWVSyY6rBkPCdJJHTGSF3q2qE4fr", "QmZJovPgBBBmuLKRtdVwdV47opNSmLiV2AZCNTtWzeog1Q"]

export const assets: AssetData = {
    "AAVE": {
        "arb": "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
        "avax": ""
    },
    "ADA": {
        "arb": "0x53186c8419BEB83fE4Da74F7875041a1287337ED",
        "avax": ""
    },
    "AI16Z": {
        "arb": "0xBb69bd9dc152C2c0F083507641a46193d2B61EBb",
        "avax": ""
    },
    "ANIME": {
        "arb": "0x37a645648dF29205C6261289983FB04ECD70b4B3",
        "avax": ""
    },
    "APE": {
        "arb": "0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98",
        "avax": ""
    },
    "APT": {
        "arb": "0x3f8f0dCE4dCE4d0D1d0871941e79CDA82cA50d0B",
        "avax": ""
    },
    "ARB": {
        "arb": "0x912CE59144191C1204E64559FE8253a0e49E6548",
        "avax": ""
    },
    "ATOM": {
        "arb": "0x7D7F1765aCbaF847b9A1f7137FE8Ed4931FbfEbA",
        "avax": ""
    },
    "AVAX": {
        "arb": "0x565609fAF65B92F7be02468acF86f8979423e514",
        "avax": "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
    },
    "BCH": {
        "arb": "0xc33D9C096e74aa4f571E9417b69a19C4A1e72ef2",
        "avax": ""
    },
    "BNB": {
        "arb": "0xa9004A5421372E1D83fB1f85b0fc986c912f91f3",
        "avax": ""
    },
    "BOME": {
        "arb": "0x3Eea56A1ccCdbfB70A26aD381C71Ee17E4c8A15F",
        "avax": ""
    },
    "BONK": {
        "arb": "0x1FD10E767187A92f0AB2ABDEEF4505e319cA06B2",
        "avax": ""
    },
    "BTC": {
        "arb": "0x47904963fc8b2340414262125aF798B9655E58Cd",
        "avax": "0x152b9d0FdC40C096757F570A51E494bd4b943E50"
    },
    "DAI": {
        "arb": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        "avax": ""
    },
    "DAI.e": {
        "arb": "",
        "avax": "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70"
    },
    "DOGE": {
        "arb": "0xC4da4c24fd591125c3F47b340b6f4f76111883d8",
        "avax": "0xC301E6fe31062C557aEE806cc6A841aE989A3ac6"
    },
    "DOT": {
        "arb": "0xE958f107b467d5172573F761d26931D658C1b436",
        "avax": ""
    },
    "DYDX": {
        "arb": "0x0739Ad7AeA69aD36EdEb91b0e55cAC140427c632",
        "avax": ""
    },
    "EIGEN": {
        "arb": "0x606C3e5075e5555e79Aa15F1E9FACB776F96C248",
        "avax": ""
    },
    "ENA": {
        "arb": "0xfe1Aac2CD9C5cC77b58EeCfE75981866ed0c8b7a",
        "avax": ""
    },
    "ETH": {
        "arb": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        "avax": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB"
    },
    "FARTCOIN": {
        "arb": "0xaca341E61aB6177B0b0Df46a612e4311F8a7605f",
        "avax": ""
    },
    "FIL": {
        "arb": "0x3AeBb98f57081DcBEb0B8EA823Cf84900A31e5D8",
        "avax": ""
    },
    "FLOKI": {
        "arb": "0x6792c5B8962ffbDD020c6b6FD0Be7b182e0e33a3",
        "avax": ""
    },
    "GMX": {
        "arb": "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        "avax": "0x62edc0692BD897D2295872a9FFCac5425011c661"
    },
    "ICP": {
        "arb": "0xdaf0A71608938F762e37eC5F72F670Cc44703454",
        "avax": ""
    },
    "INJ": {
        "arb": "0xfdE73EddbE6c5712A12B72c470F8FE5c77A7fF17",
        "avax": ""
    },
    "LINK": {
        "arb": "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
        "avax": "0x5947BB275c521040051D82396192181b413227A3"
    },
    "LTC": {
        "arb": "0xB46A094Bc4B0adBD801E14b9DB95e05E28962764",
        "avax": "0x8E9C35235C38C44b5a53B56A41eaf6dB9a430cD6"
    },
    "MELANIA": {
        "arb": "0xfa4F8E582214eBCe1A08eB2a65e08082053E441F",
        "avax": "0xd42C991a4FAb293C57a7bf25C2E2ec5aE1dB1714"
    },
    "MEME": {
        "arb": "0xaF770F03518686a365300ab35AD860e99967B2f0",
        "avax": ""
    },
    "MEW": {
        "arb": "0x5503CF72f54b6d692d36BBCD391516A7dE068687",
        "avax": ""
    },
    "NEAR": {
        "arb": "0x1FF7F3EFBb9481Cbd7db4F932cBCD4467144237C",
        "avax": ""
    },
    "OP": {
        "arb": "0xaC800FD6159c2a2CB8fC31EF74621eB430287a5A",
        "avax": ""
    },
    "ORDI": {
        "arb": "0x1E15d08f3CA46853B692EE28AE9C7a0b88a9c994",
        "avax": ""
    },
    "PENDLE": {
        "arb": "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
        "avax": ""
    },
    "PEPE": {
        "arb": "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00",
        "avax": ""
    },
    "POL": {
        "arb": "0x9c74772b713a1B032aEB173E28683D937E51921c",
        "avax": ""
    },
    "RENDER": {
        "arb": "0x82BB89fcc64c5d4016C5Ed1AB016bB0D1C20D6C3",
        "avax": ""
    },
    "SATS": {
        "arb": "0x2cD2eB61D17b78239Fcd19aafF72981B5D5eF319",
        "avax": ""
    },
    "SEI": {
        "arb": "0x55e85A147a1029b985384822c0B2262dF8023452",
        "avax": ""
    },
    "SHIB": {
        "arb": "0x3E57D02f9d196873e55727382974b02EdebE6bfd",
        "avax": ""
    },
    "SOL": {
        "arb": "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07",
        "avax": "0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F"
    },
    "STX": {
        "arb": "0xBaf07cF91D413C0aCB2b7444B9Bf13b4e03c9D71",
        "avax": ""
    },
    "SUI": {
        "arb": "0x197aa2DE1313c7AD50184234490E12409B2a1f95",
        "avax": ""
    },
    "TAO": {
        "arb": "0x938aef36CAaFbcB37815251B602168087eC14648",
        "avax": ""
    },
    "tBTC": {
        "arb": "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        "avax": ""
    },
    "TIA": {
        "arb": "0x38676f62d166f5CE7De8433F51c6B3D6D9d66C19",
        "avax": ""
    },
    "TON": {
        "arb": "0xB2f7cefaeEb08Aa347705ac829a7b8bE2FB560f3",
        "avax": ""
    },
    "TRX": {
        "arb": "0xb06aa7E4af937C130dDade66f6ed7642716fe07A",
        "avax": ""
    },
    "TRUMP": {
        "arb": "0x30021aFA4767Ad66aA52A06dF8a5AB3acA9371fD",
        "avax": "0x2f6d7be53fab5538065a226BA091015d422a7528"
    },
    "UNI": {
        "arb": "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
        "avax": ""
    },
    "USDC": {
        "arb": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        "avax": "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
    },
    "USDC.e": {
        "arb": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        "avax": "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"
    },
    "USDe": {
        "arb": "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
        "avax": ""
    },
    "USDT": {
        "arb": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        "avax": "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7"
    },
    "USDT.e": {
        "arb": "",
        "avax": "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"
    },
    "WBTC.b": {
        "arb": "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        "avax": ""
    },
    "WIF": {
        "arb": "0xA1b91fe9FD52141Ff8cac388Ce3F10BFDc1dE79d",
        "avax": ""
    },
    "WLD": {
        "arb": "0x75B9AdD873641b253718810E6c65dB6d72311FD0",
        "avax": ""
    },
    "XLM": {
        "arb": "0xc5dbD52Ae5a927Cf585B884011d0C7631C9974c6",
        "avax": ""
    },
    "XRP": {
        "arb": "0xc14e065b0067dE91534e032868f5Ac6ecf2c6868",
        "avax": "0x34B2885D617cE2ddeD4F60cCB49809fc17bb58Af"
    },
    "wstETH": {
        "arb": "0x5979D7b546E38E414F7E9822514be443A4800529",
        "avax": ""
    }
}



export const litDevnet = defineChain({
    id: 175188,
    name: 'Chronicle Yellowstone - Lit Protocol Testnet',
    nativeCurrency: { name: 'tstLPX', symbol: 'tstLPX', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://yellowstone-rpc.litprotocol.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Yellowstone Explorer',
            url: 'https://yellowstone-explorer.litprotocol.com',
        },
    },
    testnet: true,
})



export const perpExchanges = [{
    id: 'gmx',
    name: "GMX",
    image: "/gmx.png",
}]

export const spotExchanges = [{
    id: 'cow',
    name: "CoW Swap",
    image: "/cow.png",
}]

export const exchanges = [...perpExchanges, ...spotExchanges]
