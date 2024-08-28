import { gql } from "@apollo/client";

export const FETCH_USER_TRANSACTIONS_L1_TITAN = gql`
  query FetchUserTransactions(
    $formattedAddress: String!
    $L1Bridge: String!
    $account: String!
  ) {
    sentMessages(
      where: {
        message_contains: $formattedAddress
        sender: $L1Bridge
        target: "0x4200000000000000000000000000000000000010"
      }
    ) {
      blockNumber
      blockTimestamp
      gasLimit
      message
      messageNonce
      sender
      target
      transactionHash
    }
    erc20DepositInitiateds(where: { _from: $account }) {
      id
      _l1Token
      _l2Token
      _from
      _amount
      _data
      _to
      blockNumber
      blockTimestamp
      transactionHash
    }
    erc20WithdrawalFinalizeds(where: { _from: $account }) {
      id
      _l1Token
      _l2Token
      _from
      _amount
      _data
      _to
      blockNumber
      blockTimestamp
      transactionHash
    }
    ethdepositInitiateds(where: { _from: $account }) {
      _from
      _data
      _amount
      _to
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    ethwithdrawalFinalizeds(where: { _from: $account }) {
      _amount
      _data
      _from
      _to
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    sentMessages(
      where: {
        message_contains: $formattedAddress
        target: $L1Bridge
        sender: "0x4200000000000000000000000000000000000010"
      }
    ) {
      blockNumber
      blockTimestamp
      gasLimit
      message
      messageNonce
      sender
      target
      transactionHash
    }
  }
`;

export const FETCH_USER_TRANSACTIONS_L1_THANOS = gql`
  query FetchUserTransactions(
    $formattedAddress: String!
    $L1Bridge: String!
    $account: String!
  ) {
    sentMessages(
      where: {
        message_contains: $formattedAddress
        sender: $L1Bridge
        target: "0x4200000000000000000000000000000000000010"
      }
    ) {
      blockNumber
      blockTimestamp
      gasLimit
      message
      messageNonce
      sender
      target
      transactionHash
    }
    erc20DepositInitiateds(where: { from: $account }) {
      id
      l1Token
      l2Token
      from
      amount
      extraData
      to
      blockNumber
      blockTimestamp
      transactionHash
    }
    erc20WithdrawalFinalizeds(where: { from: $account }) {
      id
      l1Token
      l2Token
      from
      amount
      extraData
      to
      blockNumber
      blockTimestamp
      transactionHash
    }
    ethdepositInitiateds(where: { from: $account }) {
      from
      extraData
      amount
      to
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    ethwithdrawalFinalizeds(where: { from: $account }) {
      amount
      extraData
      from
      to
      blockNumber
      blockTimestamp
      id
      transactionHash
    }
    sentMessages(
      where: {
        message_contains: $formattedAddress
        target: $L1Bridge
        sender: "0x4200000000000000000000000000000000000010"
      }
    ) {
      blockNumber
      blockTimestamp
      gasLimit
      message
      messageNonce
      sender
      target
      transactionHash
    }
  }
`;

export const FETCH_USER_TRANSACTIONS_L2 = gql`
  query FetchUserTransactions(
    $formattedAddress: String!
    $L1Bridge: String!
    $account: String!
  ) {
    sentMessages(
      where: {
        message_contains: $formattedAddress
        target: $L1Bridge
        sender: "0x4200000000000000000000000000000000000010"
      }
    ) {
      blockNumber
      blockTimestamp
      gasLimit
      message
      messageNonce
      sender
      target
      transactionHash
    }
    depositFinalizeds(where: { _from: $account }) {
      id
      _l1Token
      _l2Token
      _from
      _amount
      _data
      _to
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;
