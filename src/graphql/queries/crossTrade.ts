import { gql } from "@apollo/client";

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
    }
    providerClaimCTs 
    {
    _saleCount
    }
  }
`;

export const FETCH_REQUEST_HISTORY_ACCOUNT = gql`
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
    }
  }
`;
