export const arbDeployments = {
    exchangeRouter: "",

}

export const avaxDeployments = {
    exchangeRouter: "",

}

export const arbSepoliaDeployments = {
    exchangeRouter: "",

}


export const avaxFujiDeployments = {
    exchangeRouter: "",
}

export const EXCHANGE_ROUTER_ABI = [
    "function multicall(bytes[] calldata data) external payable returns (bytes[] memory)",
    "function sendWnt(address receiver, uint256 amount) external payable",
    "function createDeposit((address receiver, address callbackContract, address uiFeeReceiver, address market, address initialLongToken, address initialShortToken, address[] longTokenSwapPath, address[] shortTokenSwapPath, uint256 minMarketTokens, bool shouldUnwrapNativeToken, uint256 executionFee, uint256 callbackGasLimit) params) external returns (bytes32)",
    "function createOrder((address[] addresses, uint256[] numbers, uint8 orderType, uint8 decreasePositionSwapType, bool isLong, bool shouldUnwrapNativeToken, bytes32 referralCode) params) external returns (bytes32)"
];