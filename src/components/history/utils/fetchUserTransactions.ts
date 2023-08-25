import axios from "axios";
import useConnectedNetwork from "@/hooks/network";

const formatAddress = (address: string) => {
  const formattedAddress = address.substring(2);
  return formattedAddress;
};

export const fetchUserTransactions = async (
  account: string | undefined,
  isConnectedToMainnet: boolean
) => {
  if (account) {
    const formattedAddress = formatAddress(account);
    const resTxs = await axios.post(
      `${
        isConnectedToMainnet
          ? process.env.NEXT_PUBLIC_L1BRIDGE_MAINNET
          : process.env.NEXT_PUBLIC_L1BRIDGE_GOERLI
      }`,
      {
        query: `
        {
          sentMessages(
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
        }
        
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
      `${
        isConnectedToMainnet
          ? process.env.NEXT_PUBLIC_L2MESSENGER_MAINNET
          : process.env.NEXT_PUBLIC_L2MESSENGER_GOERLI
      }`,
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
    const formattedWithdraw = withdrawTxs.map((tx: any) => {
      let copy = {
        ...tx,
        event: "withdraw",
      };
      return copy;
    });

    const allDepL1Txs = [
      ...resTxs.data.data.erc20DepositInitiateds,
      ...resTxs.data.data.ethdepositInitiateds,
    ];

    const allWithL1Txs = [
      ...resTxs.data.data.erc20WithdrawalFinalizeds,
      ...resTxs.data.data.ethwithdrawalFinalizeds,
    ];

    const formattedL1DepositResults = resTxs.data.data.sentMessages.map(
      (result: any) => {
        const tx = allDepL1Txs.filter(
          (tx: any) => tx.transactionHash === result.transactionHash
        )[0];
        let copy = {
          ...result,
          ...tx,
          event: "deposit",
        };
        return copy;
      }
    );

    const formattedL1WithdrawResults = allWithL1Txs;
    return {
      formattedL1DepositResults: formattedL1DepositResults,
      formattedL1WithdrawResults: formattedL1WithdrawResults,
      formattedWithdraw: formattedWithdraw,
    };
  }
};
