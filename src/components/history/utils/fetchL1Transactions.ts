import axios from "axios";

const getEventName = (event: string) => {
  switch (event) {
    case "erc20DepositInitiateds":
      return "ERC20DepositInitiated";

    case "erc20WithdrawalFinalizeds":
      return "ERC20WithdrawalFinalized";

    case "ethdepositInitiateds":
      return "ETHDepositInitiated";

    case "ethwithdrawalFinalizeds":
      return "ETHWithdrawalFinalized";
  }
};

export const fetchL1Transactions = async (account: string | undefined) => {
  if (account) {
    const res = await axios.post(
      "https://api.thegraph.com/subgraphs/name/lakmi94/bridge-subgraph",
      {
        query: `{
            erc20DepositInitiateds(
            where: {_from: "${account}"}
          ) {
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
          erc20WithdrawalFinalizeds(
            where: {_from: "${account}"}
          ) {
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
          
            ethdepositInitiateds(
              where: {_from: "${account}"}
            ) {
              _from
              _data
              _amount
              _to
              blockNumber
              blockTimestamp
              id
              transactionHash
            }
            ethwithdrawalFinalizeds(
              where: {_from: "${account}"}
            ) {
              _amount
              _data
              _from
              _to
              blockNumber
              blockTimestamp
              id
              transactionHash
        
          }}`,
        variables: null,
      }
    );

    const results = res.data.data;
console.log('results',results);

    const formattedResults = Object.keys(results).map((key: string) => {
      const data = results[key];
      const events = data.map((result: any) => {
        let copy = {
          ...result,
          event: getEventName(key),
          args: {
            _amount: result._amount,
            _data:result._data,
            _from: result._from,
            _l1Token: result._l1Token,
            _l2Token: result._l2Token,
            _to:result._to
          }
        };
        return copy;
      });
      return events;
    });

    const combinedResults = formattedResults.reduce(
      (acc: any[], arr) => acc.concat(arr),
      []
    );

console.log('combinedResults',combinedResults);

    return combinedResults;
  }
};
