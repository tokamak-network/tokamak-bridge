//history.mock.ts
import {
  TransactionHistory,
  Action,
  Status,
  Network,
} from "@/components/historyn/types";

export const historyData: TransactionHistory[] = [
  {
    action: Action.Withdraw,
    status: Status.Rollup,
    inNetwork: Network.Titan,
    outNetwork: Network.Mainnet,
    transactionHashes: {
      initialTransactionHash:
        "0xb01f1f5aa0cc6609b776746c791b77725bae46340953d989a7402095d297de2a",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717983025",
    },
    tokenSymbol: "ETH",
    amount: "0.01234",
  },
  {
    action: Action.Withdraw,
    status: Status.Rollup,
    inNetwork: Network.Titan,
    outNetwork: Network.Mainnet,
    transactionHashes: {
      // 위와 같지만 에러인 경우
      initialTransactionHash:
        "0xf3d7d8bbb647b0cce5f804f9fc7cdbe0d67c747643932ead849d7a3229578ed4",
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

    status: Status.Finalize,
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    transactionHashes: {
      initialTransactionHash:
        "0x0105c9c8fc3668304c2f0a182d51e366761941c57fbe6d6e0b36aea63dd8f7c6",
      rollupTransactionHash:
        "0x0105c9c8fc3668304c2f0a182d51e366761941c57fbe6d6e0b36aea63dd8f7c6",
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
    status: Status.Finalize,
    inNetwork: Network.Sepolia,
    outNetwork: Network.TitanSepolia,
    transactionHashes: {
      initialTransactionHash:
        "0xe0cd42db728f7c95ebf1771f05d36492864a77636f83f5acf8080b1c9f3ea63d ",
      rollupTransactionHash:
        "0xe0cd42db728f7c95ebf1771f05d36492864a77636f83f5acf8080b1c9f3ea63d ",
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
    inNetwork: Network.Titan,
    outNetwork: Network.Mainnet,
    transactionHashes: {
      // When Status is Completed and finalizedTransactionHash is present, finalized (claim) is complete
      initialTransactionHash:
        "0x9a580ad51941487603323df6b91a8d64be86b96ab93c05be05bb9e529b9c127e",
      rollupTransactionHash:
        "0x9a580ad51941487603323df6b91a8d64be86b96ab93c05be05bb9e529b9c127e",
      finalizedTransactionHash:
        "0x9a580ad51941487603323df6b91a8d64be86b96ab93c05be05bb9e529b9c127e",
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

    status: Status.Finalize,
    inNetwork: Network.TitanSepolia,
    outNetwork: Network.Sepolia,
    transactionHashes: {
      initialTransactionHash:
        "0x07811133692f29c3511151aba88a2c8b8f3995e91ff4013e1ba8f8bdf7c160ca",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717983025",
      finalizedCompletedTimestamp: undefined,
    },
    tokenSymbol: "TON",
    amount: "12029.12031293",
  },
  {
    action: Action.Deposit,
    status: Status.Completed,
    inNetwork: Network.Mainnet,
    outNetwork: Network.Titan,
    transactionHashes: {
      initialTransactionHash:
        "0x3a78133e444e5d6a0b005b6c4005d0b689e685c937a762f59d35fd3376b3ca07",
      finalizedTransactionHash:
        "0x3a78133e444e5d6a0b005b6c4005d0b689e685c937a762f59d35fd3376b3ca07",
    },
    blockTimestamps: {
      initialCompletedTimestamp: "1717315200",
      finalizedCompletedTimestamp: "1717322400",
    },
    tokenSymbol: "ETH",
    amount: "0.1238901290312903",
  },
];
