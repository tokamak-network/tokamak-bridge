import axios from "axios";
import { L1TxType, SentMessages } from "@/types/activity/history";
import { MAINNET_CONTRACTS, SEPOLIA_CONTRACTS } from "@/constant/contracts";

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
    const L1Bridge = isConnectedToMainnet
      ? MAINNET_CONTRACTS.L1Bridge
      : SEPOLIA_CONTRACTS.L1Bridge;

    //gets transactions on L1
    const resTxs = await axios.post(
      `${"https://api.studio.thegraph.com/query/77358/tokamak-bridge-history/version/latest"}`,
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
      
        }
      
      }`,
        variables: null,
      }
    );

    //gets transactions on L2
    const withdrawTx = await axios.post(
      `${
        isConnectedToMainnet
          ? process.env.NEXT_PUBLIC_L2MESSENGER_TITAN
          : process.env.NEXT_PUBLIC_L2MESSENGER_TITAN_GOERLI
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

    const withdrawTxsL2 = withdrawTx.data.data.sentMessages; //filter the withdraw txs on L2
    const depositTxsL2 = withdrawTx.data.data.depositFinalizeds; //filter the deposit finalized txs on L2

    //add the event name to the withdraw txs
    const formattedWithdraw = withdrawTxsL2.map((tx: SentMessages) => {
      let copy = {
        ...tx,
        event: "withdraw",
      };
      return copy;
    });

    //add the even name to the deposit txs
    const formattedDeposit = depositTxsL2.map((tx: SentMessages) => {
      let copy = {
        ...tx,
        event: "deposit",
      };
      return copy;
    });

    //combine the erc20 deposits and eth deposits on L1
    const allDepL1Txs = [
      ...resTxs.data.data.erc20DepositInitiateds,
      ...resTxs.data.data.ethdepositInitiateds,
    ];

    //combine the erc20 withdraws and eth withdraws on L1
    const allWithL1Txs = [
      ...resTxs.data.data.erc20WithdrawalFinalizeds,
      ...resTxs.data.data.ethwithdrawalFinalizeds,
    ];

    const formattedL1DepositResultsUnfiltered =
      //combine the txs in sent messages and l1 deposit txs and add event name
      resTxs.data.data.sentMessages.map((result: SentMessages) => {
        //filter txs from all the l1 deposit txs where the user address occurs twice and the tx hash has a match in the sentMessages on L1
        const tx = allDepL1Txs.filter((tx: L1TxType) => {
          const regex = new RegExp(
            `${formattedAddress.toLocaleLowerCase()}`,
            "g"
          );
          const occurrence = result.message.match(regex)?.length;

          return (
            tx.transactionHash === result.transactionHash && occurrence === 2
          );
        })[0];

        let copy = {
          ...result,
          ...tx,
          event: "deposit",
        };
        if (tx !== undefined) {
          return copy;
        }
      });

    //filter out any undefined txs from the array of results from the above array
    const formattedL1DepositResults =
      formattedL1DepositResultsUnfiltered.filter((tx: any) => tx !== undefined);
    const formattedL1WithdrawResults = allWithL1Txs;

    return {
      formattedL1DepositResults,
      formattedL1WithdrawResults,
      formattedWithdraw,
      formattedDeposit,
    };
  }
};
