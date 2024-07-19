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
    }
  }
`;
