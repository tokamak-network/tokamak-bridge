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

const formatAddress = (address: string) => {
  const formattedAddress = address.substring(2);
  return formattedAddress;
};

export const fetchUserTransactions = async (account: string | undefined) => {
  if (account) {
    const formattedAddress = formatAddress(account);

    const resMessages = await axios.post(
      "https://api.thegraph.com/subgraphs/name/lakmi94/bridge-subgraph",
      {
        query: `{sentMessages(
          where: {message_contains: "${formattedAddress}", sender: "0x7377f3d0f64d7a54cf367193eb74a052ff8578fd", target: "0x4200000000000000000000000000000000000010"}
        ) {
          blockNumber
          blockTimestamp
          gasLimit
          message
          messageNonce
          sender
          target
          transactionHash
        }}`,
        variables: null,
      }
    );

    const resTxs = await axios.post(
      "https://api.thegraph.com/subgraphs/name/lakmi94/standardbridge",
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

    const withdrawTx = await axios.post(
      "https://thegraph.titan-goerli.tokamak.network/subgraphs/name/tokamak/L2Messenger",
      {
        query: `{sentMessages(
          where: {message_contains: "${formattedAddress}", target: "0x7377f3d0f64d7a54cf367193eb74a052ff8578fd", sender: "0x4200000000000000000000000000000000000010"}
        ) {
          blockNumber
          blockTimestamp
          gasLimit
          message
          messageNonce
          sender
          target
          transactionHash
        }}`,
        variables: null,
      }
    );    


    const withdrawTxs = withdrawTx.data.data.sentMessages;
    const formattedWithdraw = withdrawTxs.map((tx:any) => {
      let copy = {
        ...tx,
        event: 'withdraw'
      }
      return copy
    }) 

    const allDepL1Txs = [
      ...resTxs.data.data.erc20DepositInitiateds,
      ...resTxs.data.data.ethdepositInitiateds,
    ];

    const allWithL1Txs = [...resTxs.data.data.erc20WithdrawalFinalizeds, ...resTxs.data.data.ethwithdrawalFinalizeds]
    const results = resMessages.data.data;
    const formattedL1DepositResults = Object.keys(results).map((key: string) => {
      const data = results[key];
      const events = data.map((result: any) => {
        const tx = allDepL1Txs.filter(
          (tx: any) => tx.transactionHash === result.transactionHash
        )[0];

        let copy = {
          ...result,
          ...tx,
          event: "deposit",
        };
        return copy;
      });
      return events;
    })[0];

    const formattedL1WithdrawResults = allWithL1Txs
    return {formattedL1DepositResults:formattedL1DepositResults,formattedL1WithdrawResults:formattedL1WithdrawResults, formattedWithdraw:formattedWithdraw};
  }
};
