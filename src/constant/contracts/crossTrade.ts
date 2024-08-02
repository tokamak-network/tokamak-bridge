/**
 * deployed contract addresses: https://www.notion.so/tokamak/Deploy-Setting-the-CrossTradeContract-on-Sepolia-Titan-Sepolia-38730da2c5a143ee8a93b30ceb962b3f
 * contract action flow : https://www.notion.so/tokamak/Function-flow-and-code-for-FrontEnd-Titan-e10af31755234e7dbc294da23795ee33
 */

type L1_SEPOLIA_CT = {
  L1CrossTradeProxy: "0x17985dc326661c7F43Dd79d216D4027f453704F7";
};
type L2_TITAN_SEPOLIA_CT = {
  L2CrossTradeProxy: "0xBD20Cd677066ced4099A479feBD2A416686917BB";
};

export const L1_ETHEREUM_CT: L1_SEPOLIA_CT = {
  L1CrossTradeProxy: "0x17985dc326661c7F43Dd79d216D4027f453704F7",
};
export const L1_SEPOLIA_CT: L1_SEPOLIA_CT = {
  L1CrossTradeProxy: "0x17985dc326661c7F43Dd79d216D4027f453704F7",
};
export const L2_TITAN_SEPOLIA_CT: L2_TITAN_SEPOLIA_CT = {
  L2CrossTradeProxy: "0xBD20Cd677066ced4099A479feBD2A416686917BB",
};
export const L2_TITAN_CT: L2_TITAN_SEPOLIA_CT = {
  L2CrossTradeProxy: "0xBD20Cd677066ced4099A479feBD2A416686917BB",
};

// export const UniswapContractByChainId: Record<
//   number,
//   | L1_UniswapContracts
//   | L1_SEPOLIA_UniswapContracts
//   | L2_UniswapContracts
//   | L2_THANOS_SEPOLIA_UniswapContracts
//   | L2_TITAN_SEPOLIA_UniswapContracts
// > = {
//   [SupportedChainId.MAINNET]: L1_UniswapContracts,
//   [SupportedChainId.TITAN]: L2_UniswapContracts,
//   [SupportedChainId.SEPOLIA]: L1_SEPOLIA_UniswapContracts,
//   [SupportedChainId.THANOS_SEPOLIA]: L2_THANOS_SEPOLIA_UniswapContracts,
//   [SupportedChainId.TITAN_SEPOLIA]: L2_TITAN_SEPOLIA_UniswapContracts,
// };

// export function getUniswapByChainId(chainId: number | undefined) {
//   if (!chainId) return undefined;
//   return UniswapContractByChainId[chainId];
// }
