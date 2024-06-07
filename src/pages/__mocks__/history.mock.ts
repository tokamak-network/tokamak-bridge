//history.mock.ts
import {
  TransactionHistory,
  Action,
  Status,
  Network,
} from "@/componenets/historyn/types";

export const historyData: TransactionHistory[] = [
  {
    action: Action.Withdraw,
    status: Status.Rollup,
    inNetwork: Network.Mainnet,
    outNetwork: Network.Titan,
    transactionHashes: {
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717749288",
    },
    tokenSymbol: "ETH",
    amount: "0.01234",
  },
  {
    action: Action.Withdraw,
    status: Status.Rollup,
    inNetwork: Network.Mainnet,
    outNetwork: Network.Titan,
    transactionHashes: {
      // 위와 같지만 에러인 경우
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717749999",
    },
    tokenSymbol: "ETH",
    amount: "0.01234",
    errorMessage: "Initial Error!",
  },
  {
    action: Action.Withdraw,
    status: Status.Finalized,
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    transactionHashes: {
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
      rollupTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717315200",
      rollupCompletedTimestamp: "1717738013",
    },
    tokenSymbol: "TON",
    amount: "100.1234",
  },
  {
    //파이널라이즈는 애러가 없다. 헤딩 mock은 추후 시간을 조정해서 claim버튼이 나오도록(7일 지난 걸로 하는 데이터로 한다.)
    action: Action.Withdraw,
    status: Status.Finalized,
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    transactionHashes: {
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
      rollupTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1716614035",
      rollupCompletedTimestamp: "1717046035",
    },
    tokenSymbol: "ETH",
    amount: "0.01234",
  },
  {
    action: Action.Withdraw,
    status: Status.Completed,
    inNetwork: Network.Mainnet,
    outNetwork: Network.Titan,
    transactionHashes: {
      // When Status is Completed and finalizedTransactionHash is present, finalized (claim) is complete
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
      rollupTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
      finalizedTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717315200",
      rollupCompletedTimestamp: "1717321000",
      finalizedCompletedTimestamp: "1717322400",
    },
    tokenSymbol: "ETH",
    amount: "1.576943",
  },
  {
    action: Action.Deposit,
    status: Status.Finalized,
    inNetwork: Network.TitanSepolia,
    outNetwork: Network.Sepolia,
    transactionHashes: {
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717743200",
      finalizedCompletedTimestamp: undefined,
    },
    tokenSymbol: "TON",
    amount: "12029.12031293",
  },
  {
    action: Action.Deposit,
    status: Status.Completed,
    inNetwork: Network.Titan,
    outNetwork: Network.Mainnet,
    transactionHashes: {
      initialTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
      finalizedTransactionHash:
        "0x5de0a5f7af71e9c76cbb18f3184a188bea5241d0d405f6f964022a99202e77b3",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717315200",
      finalizedCompletedTimestamp: "1717322400",
    },
    tokenSymbol: "ETH",
    amount: "0.1238901290312903",
  },
];
