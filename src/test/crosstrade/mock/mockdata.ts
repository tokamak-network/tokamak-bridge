export const mock_cancelRequest = {
  L2_subgraphData: {
    blockTimestamp: "1725425942",
    transactionHash:
      "0xece1a37f48b4222e8ae8e1ce98a03bfcba4c99472dd86ae0b43add017da76d38",
    __typename: "RequestCT",
    _ctAmount: "98909589999465033200",
    _hashValue:
      "0x874b45fa6aa20168c2017386b54a9fc47d87a14d88a55f4a92509d45df8f42ce",
    _l1token: "0xa30fe40285b8f5c0457dbc3b7c8a280373c40044",
    _l2chainId: "55007",
    _l2token: "0x7c6b91d9be155a6db01f749217d76ff02a7227f2",
    _requester: "0x24884b9a47049b7663aedac7c7c91afd406ea09e",
    _saleCount: "80",
    _totalAmount: "100000000000000000000",
  },
  action: 0,
  blockTimestamps: {
    cancelRequest: Math.floor(Date.now() / 1000),
    refund: undefined,
    request: 1725425942,
  },
  category: 1,
  errorMessage: undefined,
  hasMultipleUpdateFees: false,
  inNetwork: 55007,
  inToken: {
    address: "0xa30fe40285b8f5c0457dbc3b7c8a280373c40044",
    amount: "100000000000000000000",
    decimals: 18,
    name: "Tokamak Network",
    symbol: "TON",
  },
  isCanceled: true,
  isUpdateFee: false,
  outNetwork: 11155111,
  outToken: {
    address: "0xa30fe40285b8f5c0457dbc3b7c8a280373c40044",
    amount: "98909589999465033200",
    decimals: 18,
    name: "Tokamak Network",
    symbol: "TON",
  },
  serviceFee: 1090410000534966800,
  status: "CT_REQ_REFUND",
  transactionHashes: {
    request:
      "0xece1a37f48b4222e8ae8e1ce98a03bfcba4c99472dd86ae0b43add017da76d38",
    cancelRequest:
      "0xf0f4c75de1b0227fecfdf5c3749af882b58523a332d4cdb8e964458fce00180f",
    refund: "0x",
  },
};
