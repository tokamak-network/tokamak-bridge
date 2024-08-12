import { gql } from "@apollo/client";

export const FETCH_PROVIDE_LIST_L1 = gql`
  query GetProvideCTs {
    editCTs(orderBy: blockTimestamp, orderDirection: desc) { 
      _saleCount
      _requester
      _ctAmount
      blockTimestamp
      blockNumber
      transactionHash
    }
      provideCTs (orderBy: blockTimestamp, orderDirection: desc) { 
      _l1token
      _l2token
      _saleCount
      _requester
      _provider
      _totalAmount
      _ctAmount
      _l2chainId
      blockNumber
      blockTimestamp
      transactionHash
    }
  } 
`;

export const FETCH_PROVIDE_LIST_L1_ACCOUNT = gql`
  query GetProvideCTs($account: String!) {
    editCTs(orderBy: blockTimestamp, orderDirection: desc, where: {_requester: $account}) { 
      _saleCount
      _requester
      _ctAmount
      blockTimestamp
      blockNumber
      transactionHash
    }
    provideCTs (orderBy: blockTimestamp, orderDirection: desc, where: {_provider: $account}) { 
      _l1token
      _l2token
      _saleCount
      _requester
      _provider
      _totalAmount
      _ctAmount
      _l2chainId
      blockNumber
      blockTimestamp
      transactionHash
    }
  } 
`;

export const FETCH_REQUEST_LIST_L2 = gql`
  query GetRequestCTs {
    requestCTs(orderBy: blockTimestamp, orderDirection: desc) { 
    _l1token 
    _l2token 
    _requester 
    _totalAmount 
    _ctAmount 
    _saleCount 
    _hashValue 
    _l2chainId
    blockTimestamp 
    transactionHash
    }
    cancelCTs 
    {
      _saleCount
      blockTimestamp 
      transactionHash
    }
    providerClaimCTs 
    {
      _saleCount
      _provider
      blockTimestamp 
      transactionHash
    }
  }
`;

export const FETCH_REQUEST_LIST_L2_ACCOUNT = gql`
  query GetRequestHistory($account: String!) {
    requestCTs(orderBy: blockTimestamp, orderDirection: desc, where: {_requester: $account}) { 
    _l1token 
    _l2token 
    _requester 
    _totalAmount 
    _ctAmount 
    _saleCount 
    _hashValue 
    _l2chainId
    blockTimestamp 
    transactionHash
    }
    cancelCTs 
    {
      _saleCount
      blockTimestamp 
      transactionHash
    }
    providerClaimCTs(where: {_provider: $account})
    {
      _saleCount
      _provider
      blockTimestamp 
      transactionHash
    }
  }
`;
