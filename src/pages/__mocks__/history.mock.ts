import {
  TransactionHistory,
  Action,
  Status,
  Network,
} from "@/componenets/historyn/types";

export const historyData: TransactionHistory[] = [
  {
    action: Action.Withdraw,
    status: Status.Initial,
    blockTimestamp: "1697686103",
    inNetwork: Network.Mainnet,
    outNetwork: Network.Titan,
    tokenSymbol: "ETH",
    amount: "0.01234",
    transactionHash:
      "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  },
  {
    action: Action.Withdraw,
    status: Status.Rollup,
    blockTimestamp: "1697686103",
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    tokenSymbol: "TON",
    amount: "100.1234",
    transactionHash:
      "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  },
  {
    action: Action.Withdraw,
    status: Status.Finalized,
    blockTimestamp: "1697686103",
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    tokenSymbol: "ETH",
    amount: "0.01234",
    transactionHash:
      "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  },
  {
    action: Action.Withdraw,
    status: Status.Complete,
    blockTimestamp: "1697686103",
    inNetwork: Network.Mainnet,
    outNetwork: Network.Sepolia,
    tokenSymbol: "ETH",
    amount: "1.576943",
    transactionHash: "",
  },
  {
    action: Action.Deposit,
    status: Status.Initial,
    blockTimestamp: "1697686103",
    inNetwork: Network.TitanSepolia,
    outNetwork: Network.Sepolia,
    tokenSymbol: "TON",
    amount: "12029.12031293",
    transactionHash:
      "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  },
  {
    action: Action.Deposit,
    status: Status.Complete,
    blockTimestamp: "1697686103",
    inNetwork: Network.Titan,
    outNetwork: Network.Mainnet,
    tokenSymbol: "ETH",
    amount: "0.1238901290312903",
    transactionHash:
      "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
  },
];
