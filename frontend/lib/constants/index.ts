import { AssetData } from "@/types";
import { defineChain } from "viem";
export const COLOR_1 = "#e6450d"; // BRIGHT ORANGE
export const COLOR_2 = "#1F1F1F"; // BLACK
export const COLOR_3 = "#ffffff"; // WHITE
export const COLOR_4 = "#BF4317"; // DIM ORANGE

export const toolIpfsCids = [
  "QmW5KMbaKLVgh2oLegtWVSyY6rBkPCdJJHTGSF3q2qE4fr",
  "QmZJovPgBBBmuLKRtdVwdV47opNSmLiV2AZCNTtWzeog1Q",
];

export const assets: AssetData = {
  AAVE: {
    arb: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
    avax: "",
  },
  ADA: {
    arb: "0x53186c8419BEB83fE4Da74F7875041a1287337ED",
    avax: "",
  },
  AI16Z: {
    arb: "0xBb69bd9dc152C2c0F083507641a46193d2B61EBb",
    avax: "",
  },
  ANIME: {
    arb: "0x37a645648dF29205C6261289983FB04ECD70b4B3",
    avax: "",
  },
  APE: {
    arb: "0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98",
    avax: "",
  },
  APT: {
    arb: "0x3f8f0dCE4dCE4d0D1d0871941e79CDA82cA50d0B",
    avax: "",
  },
  ARB: {
    arb: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    avax: "",
  },
  ATOM: {
    arb: "0x7D7F1765aCbaF847b9A1f7137FE8Ed4931FbfEbA",
    avax: "",
  },
  AVAX: {
    arb: "0x565609fAF65B92F7be02468acF86f8979423e514",
    avax: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  },
  BCH: {
    arb: "0xc33D9C096e74aa4f571E9417b69a19C4A1e72ef2",
    avax: "",
  },
  BNB: {
    arb: "0xa9004A5421372E1D83fB1f85b0fc986c912f91f3",
    avax: "",
  },
  BOME: {
    arb: "0x3Eea56A1ccCdbfB70A26aD381C71Ee17E4c8A15F",
    avax: "",
  },
  BONK: {
    arb: "0x1FD10E767187A92f0AB2ABDEEF4505e319cA06B2",
    avax: "",
  },
  BTC: {
    arb: "0x47904963fc8b2340414262125aF798B9655E58Cd",
    avax: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
  },
  DAI: {
    arb: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    avax: "",
  },
  "DAI.e": {
    arb: "",
    avax: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  },
  DOGE: {
    arb: "0xC4da4c24fd591125c3F47b340b6f4f76111883d8",
    avax: "0xC301E6fe31062C557aEE806cc6A841aE989A3ac6",
  },
  DOT: {
    arb: "0xE958f107b467d5172573F761d26931D658C1b436",
    avax: "",
  },
  DYDX: {
    arb: "0x0739Ad7AeA69aD36EdEb91b0e55cAC140427c632",
    avax: "",
  },
  EIGEN: {
    arb: "0x606C3e5075e5555e79Aa15F1E9FACB776F96C248",
    avax: "",
  },
  ENA: {
    arb: "0xfe1Aac2CD9C5cC77b58EeCfE75981866ed0c8b7a",
    avax: "",
  },
  ETH: {
    arb: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    avax: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  },
  FARTCOIN: {
    arb: "0xaca341E61aB6177B0b0Df46a612e4311F8a7605f",
    avax: "",
  },
  FIL: {
    arb: "0x3AeBb98f57081DcBEb0B8EA823Cf84900A31e5D8",
    avax: "",
  },
  FLOKI: {
    arb: "0x6792c5B8962ffbDD020c6b6FD0Be7b182e0e33a3",
    avax: "",
  },
  GMX: {
    arb: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    avax: "0x62edc0692BD897D2295872a9FFCac5425011c661",
  },
  ICP: {
    arb: "0xdaf0A71608938F762e37eC5F72F670Cc44703454",
    avax: "",
  },
  INJ: {
    arb: "0xfdE73EddbE6c5712A12B72c470F8FE5c77A7fF17",
    avax: "",
  },
  LINK: {
    arb: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    avax: "0x5947BB275c521040051D82396192181b413227A3",
  },
  LTC: {
    arb: "0xB46A094Bc4B0adBD801E14b9DB95e05E28962764",
    avax: "0x8E9C35235C38C44b5a53B56A41eaf6dB9a430cD6",
  },
  MELANIA: {
    arb: "0xfa4F8E582214eBCe1A08eB2a65e08082053E441F",
    avax: "0xd42C991a4FAb293C57a7bf25C2E2ec5aE1dB1714",
  },
  MEME: {
    arb: "0xaF770F03518686a365300ab35AD860e99967B2f0",
    avax: "",
  },
  MEW: {
    arb: "0x5503CF72f54b6d692d36BBCD391516A7dE068687",
    avax: "",
  },
  NEAR: {
    arb: "0x1FF7F3EFBb9481Cbd7db4F932cBCD4467144237C",
    avax: "",
  },
  OP: {
    arb: "0xaC800FD6159c2a2CB8fC31EF74621eB430287a5A",
    avax: "",
  },
  ORDI: {
    arb: "0x1E15d08f3CA46853B692EE28AE9C7a0b88a9c994",
    avax: "",
  },
  PENDLE: {
    arb: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
    avax: "",
  },
  PEPE: {
    arb: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00",
    avax: "",
  },
  POL: {
    arb: "0x9c74772b713a1B032aEB173E28683D937E51921c",
    avax: "",
  },
  RENDER: {
    arb: "0x82BB89fcc64c5d4016C5Ed1AB016bB0D1C20D6C3",
    avax: "",
  },
  SATS: {
    arb: "0x2cD2eB61D17b78239Fcd19aafF72981B5D5eF319",
    avax: "",
  },
  SEI: {
    arb: "0x55e85A147a1029b985384822c0B2262dF8023452",
    avax: "",
  },
  SHIB: {
    arb: "0x3E57D02f9d196873e55727382974b02EdebE6bfd",
    avax: "",
  },
  SOL: {
    arb: "0x2bcC6D6CdBbDC0a4071e48bb3B969b06B3330c07",
    avax: "0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F",
  },
  STX: {
    arb: "0xBaf07cF91D413C0aCB2b7444B9Bf13b4e03c9D71",
    avax: "",
  },
  SUI: {
    arb: "0x197aa2DE1313c7AD50184234490E12409B2a1f95",
    avax: "",
  },
  TAO: {
    arb: "0x938aef36CAaFbcB37815251B602168087eC14648",
    avax: "",
  },
  tBTC: {
    arb: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
    avax: "",
  },
  TIA: {
    arb: "0x38676f62d166f5CE7De8433F51c6B3D6D9d66C19",
    avax: "",
  },
  TON: {
    arb: "0xB2f7cefaeEb08Aa347705ac829a7b8bE2FB560f3",
    avax: "",
  },
  TRX: {
    arb: "0xb06aa7E4af937C130dDade66f6ed7642716fe07A",
    avax: "",
  },
  TRUMP: {
    arb: "0x30021aFA4767Ad66aA52A06dF8a5AB3acA9371fD",
    avax: "0x2f6d7be53fab5538065a226BA091015d422a7528",
  },
  UNI: {
    arb: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    avax: "",
  },
  USDC: {
    arb: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    avax: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  },
  "USDC.e": {
    arb: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    avax: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
  },
  USDe: {
    arb: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
    avax: "",
  },
  USDT: {
    arb: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    avax: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  },
  "USDT.e": {
    arb: "",
    avax: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
  },
  "WBTC.b": {
    arb: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    avax: "",
  },
  WIF: {
    arb: "0xA1b91fe9FD52141Ff8cac388Ce3F10BFDc1dE79d",
    avax: "",
  },
  WLD: {
    arb: "0x75B9AdD873641b253718810E6c65dB6d72311FD0",
    avax: "",
  },
  XLM: {
    arb: "0xc5dbD52Ae5a927Cf585B884011d0C7631C9974c6",
    avax: "",
  },
  XRP: {
    arb: "0xc14e065b0067dE91534e032868f5Ac6ecf2c6868",
    avax: "0x34B2885D617cE2ddeD4F60cCB49809fc17bb58Af",
  },
  wstETH: {
    arb: "0x5979D7b546E38E414F7E9822514be443A4800529",
    avax: "",
  },
};

export const litDevnet = defineChain({
  id: 175188,
  name: "Chronicle Yellowstone - Lit Protocol Testnet",
  nativeCurrency: { name: "tstLPX", symbol: "tstLPX", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://yellowstone-rpc.litprotocol.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Yellowstone Explorer",
      url: "https://yellowstone-explorer.litprotocol.com",
    },
  },
  testnet: true,
});

export const perpExchanges = [
  {
    id: "gmx",
    name: "GMX",
    image: "/gmx.png",
  },
];

export const spotExchanges = [
  {
    id: "sushi",
    name: "Sushi Swap",
    image: "/sushi.png",
    chain: "base",
  },
  {
    id: "circuit",
    name: "Circuit Money",
    image: "/circuit.png",
    chain: "zircuit",
  },
  {
    id: "kitty",
    name: "Kitty Punch",
    image: "/kitty.png",
    chain: "flow",
  },
];

export const exchanges = [...perpExchanges, ...spotExchanges];

export const sushiTokenList = [
  {
    address: "0x18A8BD1fe17A1BB9FFB39eCD83E9489cfD17a022",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x18A8BD1fe17A1BB9FFB39eCD83E9489cfD17a022.jpg",
    name: "Andy",
    symbol: "ANDY",
  },
  {
    address: "0xF9569cFb8FD265e91aa478d86ae8c78b8AF55Df4",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xF9569cFb8FD265e91aa478d86ae8c78b8AF55Df4.jpg",
    name: "Auki Token",
    symbol: "AUKI",
  },
  {
    address: "0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f",
    chainId: 8453,
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f.jpg",
    name: "Axelar",
    symbol: "AXL",
  },
  {
    address: "0x5C7e299CF531eb66f2A1dF637d37AbB78e6200C7",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x5C7e299CF531eb66f2A1dF637d37AbB78e6200C7.jpg",
    name: "Axelar Wrapped DAI",
    symbol: "axlDAI",
  },
  {
    address: "0xEB466342C4d449BC9f53A865D5Cb90586f405215",
    chainId: 8453,
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0xEB466342C4d449BC9f53A865D5Cb90586f405215.jpg",
    name: "Axelar Wrapped USDC",
    symbol: "axlUSDC",
  },
  {
    address: "0x7ED613AB8b2b4c6A781DDC97eA98a666c6437511",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x7ED613AB8b2b4c6A781DDC97eA98a666c6437511.jpg",
    name: "All Your Base",
    symbol: "AYB",
  },
  {
    address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2.jpg",
    name: "Balancer",
    symbol: "BAL",
  },
  {
    address: "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8.jpg",
    name: "Bald",
    symbol: "BALD",
  },
  {
    address: "0x1443Cbca252D1ffAE56b4ee4cc904e9554E2F6aD",
    chainId: 8453,
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x1443Cbca252D1ffAE56b4ee4cc904e9554E2F6aD.jpg",
    name: "Baldcat",
    symbol: "baldcat",
  },
  {
    address: "0xBC45647eA894030a4E9801Ec03479739FA2485F0",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xBC45647eA894030a4E9801Ec03479739FA2485F0.jpg",
    name: "Basenji",
    symbol: "BENJI",
  },
  {
    address: "0x4e496c0256FB9D4CC7Ba2fdF931bC9CbB7731660",
    chainId: 8453,
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x4e496c0256FB9D4CC7Ba2fdF931bC9CbB7731660.jpg",
    name: "Boge",
    symbol: "BOGE",
  },
  {
    address: "0xB310C7D7428B95aD1B86ba4191704576150429B6",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xB310C7D7428B95aD1B86ba4191704576150429B6.jpg",
    name: "BasedBomb",
    symbol: "BOMB",
  },
  {
    address: "0x09DeB3CF353186E7A84aBfD7434BF643f77eB686",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x09DeB3CF353186E7A84aBfD7434BF643f77eB686.jpg",
    name: "BASE BOT",
    symbol: "BOT",
  },
  {
    address: "0xDa761A290e01c69325D12D82AC402E5a73D62E81",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xDa761A290e01c69325D12D82AC402E5a73D62E81.jpg",
    name: "Base Pro Shops",
    symbol: "BPS",
  },
  {
    address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x532f27101965dd16442E59d40670FaF5eBB142E4.jpg",
    name: "Brett",
    symbol: "BRETT",
  },
  {
    address: "0xfEA9DcDc9E23a9068bF557AD5b186675C61d33eA",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xfEA9DcDc9E23a9068bF557AD5b186675C61d33eA.jpg",
    name: "Based Shiba Inu",
    symbol: "BSHIB",
  },
  {
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22.jpg",
    name: "Coinbase Wrapped Staked ETH",
    symbol: "cbETH",
  },
  {
    address: "0xecaF81Eb42cd30014EB44130b89Bcd6d4Ad98B92",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xecaF81Eb42cd30014EB44130b89Bcd6d4Ad98B92.jpg",
    name: "Based Chad",
    symbol: "CHAD",
  },
  {
    address: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x9e1028F5F1D5eDE59748FFceE5532509976840E0.jpg",
    name: "Compound",
    symbol: "COMP",
  },
  {
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb.jpg",
    name: "Dai Stablecoin",
    symbol: "DAI",
  },
  {
    address: "0x85E90a5430AF45776548ADB82eE4cD9E33B08077",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x85E90a5430AF45776548ADB82eE4cD9E33B08077.jpg",
    name: "DINO",
    symbol: "DINO",
  },
  {
    address: "0x9D8a9aEc7aDcb2b203D285b9c6F91ABbcDF1D7e4",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x9D8a9aEc7aDcb2b203D285b9c6F91ABbcDF1D7e4.jpg",
    name: "Dolp",
    symbol: "DOLP",
  },
  {
    address: "0xD08a2917653d4E460893203471f0000826fb4034",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xD08a2917653d4E460893203471f0000826fb4034.jpg",
    name: "FARM Reward Token",
    symbol: "FARM",
  },
  {
    address: "0x122A3f185655847980639E8EdF0F0f66cd91C5fE",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x122A3f185655847980639E8EdF0F0f66cd91C5fE.jpg",
    name: "FELLA",
    symbol: "FELLA",
  },
  {
    address: "0xFF0C532FDB8Cd566Ae169C1CB157ff2Bdc83E105",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xFF0C532FDB8Cd566Ae169C1CB157ff2Bdc83E105.jpg",
    name: "Fren Pet",
    symbol: "Fren Pet",
  },
  {
    address: "0xd3a61a3A9b8E0dD8160C9bF5Ea79159e3E2452B8",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xd3a61a3A9b8E0dD8160C9bF5Ea79159e3E2452B8.jpg",
    name: "HAM",
    symbol: "HAM",
  },
  {
    address: "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3.jpg",
    name: "HanChain",
    symbol: "HAN",
  },
  {
    address: "0x3e7eF8f50246f725885102E8238CBba33F276747",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x3e7eF8f50246f725885102E8238CBba33F276747.jpg",
    name: "HANePlatform",
    symbol: "HANeP",
  },
  {
    address: "0x4d25E94291FE8dcFBfA572cbB2aAa7B755087c91",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x4d25E94291FE8dcFBfA572cbB2aAa7B755087c91.jpg",
    name: "High",
    symbol: "HIGH",
  },
  {
    address: "0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea.jpg",
    name: "iFARM",
    symbol: "iFARM",
  },
  {
    address: "0xeA930c80d8eac45993d127055E718555e7155fB1",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xeA930c80d8eac45993d127055E718555e7155fB1.jpg",
    name: "Infinite",
    symbol: "INF",
  },
  {
    address: "0x895A26F67a8375D0419Cb7E4bd1109aC139ab741",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x895A26F67a8375D0419Cb7E4bd1109aC139ab741.jpg",
    name: "Jelly",
    symbol: "JELLY",
  },
  {
    address: "0x64cc19A52f4D631eF5BE07947CABA14aE00c52Eb",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x64cc19A52f4D631eF5BE07947CABA14aE00c52Eb.jpg",
    name: "Kibble",
    symbol: "KIBBLE",
  },
  {
    address: "0xbE3111856e4acA828593274eA6872f27968C8DD6",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0xbE3111856e4acA828593274eA6872f27968C8DD6.jpg",
    name: "KRAV",
    symbol: "KRAV",
  },
  {
    address: "0x8Fbd0648971d56f1f2c35Fa075Ff5Bc75fb0e39D",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x8Fbd0648971d56f1f2c35Fa075Ff5Bc75fb0e39D.jpg",
    name: "MBS",
    symbol: "MBS",
  },
  {
    address: "0xe1f9ac62a2f34881f6Fe0F84322dE9d7024C2b8E",
    chainId: 8453,
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xe1f9ac62a2f34881f6Fe0F84322dE9d7024C2b8E.jpg",
    name: "Mochi",
    symbol: "MOCHI",
  },
  {
    address: "0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50.jpg",
    name: "Mochi",
    symbol: "MOCHI",
  },
  {
    address: "0x2228363213E6E16e8ccC556Aa270a05f1F1A4E02",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x2228363213E6E16e8ccC556Aa270a05f1F1A4E02.jpg",
    name: "Mochi and Toshi",
    symbol: "MOCHITOSHI",
  },
  {
    address: "0x7771450EcE9C61430953D2646f995E33a06C91F5",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x7771450EcE9C61430953D2646f995E33a06C91F5.jpg",
    name: "Monke",
    symbol: "MONKE",
  },
  {
    address: "0x2CcbEcc47D83eE80e27fd09c8e757B82F1fFad4C",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x2CcbEcc47D83eE80e27fd09c8e757B82F1fFad4C.jpg",
    name: "Base Balloons",
    symbol: "NANG",
  },
  {
    address: "0xc2106ca72996e49bBADcB836eeC52B765977fd20",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xc2106ca72996e49bBADcB836eeC52B765977fd20.jpg",
    name: "NFTEarthOFT",
    symbol: "NFTE",
  },
  {
    address: "0x47b464eDB8Dc9BC67b5CD4C9310BB87b773845bD",
    chainId: 8453,
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x47b464eDB8Dc9BC67b5CD4C9310BB87b773845bD.jpg",
    name: "Normie",
    symbol: "NORMIE",
  },
  {
    address: "0xB166E8B140D35D9D8226E40C09f757BAC5A4d87d",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xB166E8B140D35D9D8226E40C09f757BAC5A4d87d.jpg",
    name: "Non-Playable Coin",
    symbol: "NPC",
  },
  {
    address: "0x137A61B3311E967b0D1e79d5546167C9DC9E6B5B",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x137A61B3311E967b0D1e79d5546167C9DC9E6B5B.jpg",
    name: "Pleasure Coin",
    symbol: "NSFW",
  },
  {
    address: "0xC48E605c7b722a57277e087a6170B9E227e5AC0A",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xC48E605c7b722a57277e087a6170B9E227e5AC0A.jpg",
    name: "OmniCat",
    symbol: "OMNI",
  },
  {
    address: "0xbFd5206962267c7b4b4A8B3D76AC2E1b2A5c4d5e",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xbFd5206962267c7b4b4A8B3D76AC2E1b2A5c4d5e.jpg",
    name: "Osaka Protocol",
    symbol: "OSAK",
  },
  {
    address: "0xba0Dda8762C24dA9487f5FA026a9B64b695A07Ea",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xba0Dda8762C24dA9487f5FA026a9B64b695A07Ea.jpg",
    name: "OX Coin",
    symbol: "OX",
  },
  {
    address: "0x40468be13c4388D2AB68a09F56973fa95DB5bca0",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x40468be13c4388D2AB68a09F56973fa95DB5bca0.jpg",
    name: "Pizza",
    symbol: "PIZZA",
  },
  {
    address: "0xC702b80a1bEBac118cab22Ce6F2978ef59563b3F",
    chainId: 8453,
    decimals: 8,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xC702b80a1bEBac118cab22Ce6F2978ef59563b3F.jpg",
    name: "RAFL",
    symbol: "RAFL",
  },
  {
    address: "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85.jpg",
    name: "Seamless",
    symbol: "SEAM",
  },
  {
    address: "0xBa5B9B2D2d06a9021EB3190ea5Fb0e02160839A4",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xBa5B9B2D2d06a9021EB3190ea5Fb0e02160839A4.jpg",
    name: "Sendit",
    symbol: "Sendit",
  },
  {
    address: "0xD1917629B3E6A72E6772Aab5dBe58Eb7FA3C2F33",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xD1917629B3E6A72E6772Aab5dBe58Eb7FA3C2F33.jpg",
    name: "Settled ETHXY Token",
    symbol: "SEXY",
  },
  {
    address: "0x22DC834C3Ff3e45f484bF24B9B07b851B981900f",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x22DC834C3Ff3e45f484bF24B9B07b851B981900f.jpg",
    name: "Smudge Cat",
    symbol: "SMUDCAT",
  },
  {
    address: "0x3124678D62D2aa1f615B54525310fbfDa6DcF7AE",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x3124678D62D2aa1f615B54525310fbfDa6DcF7AE.jpg",
    name: "Sensay",
    symbol: "SNSY",
  },
  {
    address: "0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA.jpg",
    name: "SushiToken",
    symbol: "SUSHI",
  },
  {
    address: "0xb8D98a102b0079B69FFbc760C8d857A31653e56e",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xb8D98a102b0079B69FFbc760C8d857A31653e56e.jpg",
    name: "toby",
    symbol: "toby",
  },
  {
    address: "0x8544FE9D190fD7EC52860abBf45088E81Ee24a8c",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x8544FE9D190fD7EC52860abBf45088E81Ee24a8c.jpg",
    name: "Toshi",
    symbol: "TOSHI",
  },
  {
    address: "0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4.jpg",
    name: "Toshi",
    symbol: "TOSHI",
  },
  {
    address: "0xf7C1CEfCf7E1dd8161e00099facD3E1Db9e528ee",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xf7C1CEfCf7E1dd8161e00099facD3E1Db9e528ee.jpg",
    name: "TOWER",
    symbol: "TOWER",
  },
  {
    address: "0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE.jpg",
    name: "Base God",
    symbol: "TYBG",
  },
  {
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    chainId: 8453,
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA.jpg",
    name: "USD Base Coin",
    symbol: "USDbc",
  },
  {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    chainId: 8453,
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913.jpg",
    name: "USD Coin",
    symbol: "USDC",
  },
  {
    address: "0x5A76A56ad937335168b30dF3AA1327277421C6Ae",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x5A76A56ad937335168b30dF3AA1327277421C6Ae.jpg",
    name: "Vela Token",
    symbol: "VELA",
  },
  {
    address: "0x10c1B6f768e13c624A4A23337f1a5bA5c9BE0E4B",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x10c1B6f768e13c624A4A23337f1a5bA5c9BE0E4B.jpg",
    name: "Warpie",
    symbol: "WARPIE",
  },
  {
    address: "0x4200000000000000000000000000000000000006",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x4200000000000000000000000000000000000006.jpg",
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  {
    address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452.jpg",
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
  },
  {
    address: "0x981D41C115a2d48Cb1215D13Bda8f989d407c9c5",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x981D41C115a2d48Cb1215D13Bda8f989d407c9c5.jpg",
    name: "Xena",
    symbol: "XEN",
  },
  {
    address: "0x0FA70E156Cd3B03aC4080bfe55BD8AB50f5Bcb98",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x0FA70E156Cd3B03aC4080bfe55BD8AB50f5Bcb98.jpg",
    name: "Youcoin",
    symbol: "YOU",
  },
  {
    address: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/token-logos/network/base/0x6985884C4392D348587B19cb9eAAf157F13271cd.jpg",
    name: "LayerZero",
    symbol: "ZRO",
  },
  {
    address: "0x3bB4445D30AC020a84c1b5A8A2C6248ebC9779D0",
    chainId: 8453,
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/sushiswap/list/master/logos/network/base/0x3bB4445D30AC020a84c1b5A8A2C6248ebC9779D0.jpg",
    name: "0x Protocol Token",
    symbol: "ZRX",
  },
];

export const circuitTokenList = [];

export const kittyTokenList = [];
