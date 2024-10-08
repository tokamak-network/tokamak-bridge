export const tokenColor = (symbol?: String) => {
  switch (symbol) {
    case "ETH":
      return "#627EEA";
    case "WETH":
      return "#393939";
    case "TON":
      return "#007AFF";
    case "WTON":
      return "#007AFF";
    case "USDC":
      return "#2775CA";
    case "USDT":
      return "#50AF95";
    default:
      return "#9e9e9e";
  }
};
