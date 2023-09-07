import axios from "axios";
import useConnectedNetwork from "@/hooks/network";
import { L1TxType, SentMessages } from "@/types/activity/history";
const formatAddress = (address: string) => {
  const formattedAddress = address.substring(2);
  return formattedAddress;
};

export const fetchUserTransactions = async (
  account: string | undefined,
  isConnectedToMainnet: boolean
) => {
  if (account) {
    // const acc = "0x24884B9A47049B7663aEdaC7c7C91afd406EA09e";
    const formattedAddress = formatAddress(account);
    const L1Bridge = isConnectedToMainnet
      ? "0x59aa194798Ba87D26Ba6bEF80B85ec465F4bbcfD"
      : "0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD";
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
          where: {message_contains: "${formattedAddress}", sender: "${L1Bridge}", target: "0x4200000000000000000000000000000000000010"}
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
          where: {message_contains: "${formattedAddress}", target: "${L1Bridge}", sender: "0x4200000000000000000000000000000000000010"}
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
        depositFinalizeds(
          where: {_from: "${account}"}
        )
      {
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

      }}`,
        variables: null,
      }
    );    

    const withdrawTxsL2 = withdrawTx.data.data.sentMessages;
    const depositTcxsL2 = withdrawTx.data.data.depositFinalizeds
    const formattedWithdraw = withdrawTxsL2.map((tx: SentMessages) => {
      let copy = {
        ...tx,
        event: "withdraw",
      };
      return copy;
    });

    const formattedDeposit = depositTcxsL2.map((tx: SentMessages) => {
      let copy = {
        ...tx,
        event: "deposit",
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
      (result: SentMessages) => {
        const tx = allDepL1Txs.filter(
          (tx: L1TxType) => tx.transactionHash === result.transactionHash
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
      formattedDeposit:formattedDeposit
    };
  }
};
