export type SentMessage = {
  blockNumber: string;
  blockTimestamp: string;
  gasLimit: string;
  message: string;
  messageNonce: string;
  sender: string;
  target: string;
  transactionHash: string;
};

export type Erc20DepositInitiateds = {
  id: string;
  _l1Token: string;
  _l2Token: string;
  _from: string;
  _amount: string;
  _data: string;
  _to: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type Erc20WithdrawalFinalizeds = {
  id: string;
  _l1Token: string;
  _l2Token: string;
  _from: string;
  _amount: string;
  _data: string;
  _to: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type EthdepositInitiateds = {
  id: string;
  _from: string;
  _amount: string;
  _data: string;
  _to: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type EthwithdrawalFinalizeds = {
  id: string;
  _from: string;
  _amount: string;
  _data: string;
  _to: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
};
