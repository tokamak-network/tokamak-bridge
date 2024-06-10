import { Resolved } from "@/types/activity/history";
import {
  makeMerkleTreeProof,
  makeStateTrieProof,
} from "@tokamak-network/titan-sdk";
import { BigNumber, Bytes, Contract, ethers } from "ethers";
import {
  remove0x,
  toHexString,
  encodeCrossDomainMessageV0,
} from "@eth-optimism/core-utils";
import StateCommitmentChainAbi from "constant/abis/StateCommitmentChain.json";
import { predeploys } from "@eth-optimism/contracts";
import * as RLP from "@ethersproject/rlp";

/**
 * https://www.notion.so/tokamak/New-bridge-history-logic-fa37475899de433f983d74a8b83477f3
 * @param hash
 */
export const getWithdarwCalldata = async (params: {
  hash: string;
  provider: ethers.providers.JsonRpcProvider;
  l2Provider: ethers.providers.JsonRpcProvider;
  stateBatchAppendedEvent: {
    blockNumber: BigInt | number;
    _batchIndex: BigInt | number;
    _batchRoot: Bytes;
    _batchSize: BigInt | number;
    _prevTotalElements: number;
    _extraData: Bytes;
  };
  sentMessageEvent: Resolved & { blockNumber: number };
  l2BlcokNumber: number;
}) => {
  const {
    hash,
    provider,
    l2Provider,
    sentMessageEvent,
    stateBatchAppendedEvent,
    l2BlcokNumber,
  } = params;
  const hashData = await provider.getTransaction(hash);
  const StateCommitmentChain_CONTRACT = new Contract(
    "0x66b9f45E84A0aD7fE3983c97556798352a8E0a56",
    StateCommitmentChainAbi,
    provider
  );

  //step 2
  const [stateRoots] =
    StateCommitmentChain_CONTRACT.interface.decodeFunctionData(
      "appendStateBatch",
      hashData.data
    );

  const stateRootBatch = {
    blockNumber: stateBatchAppendedEvent.blockNumber,
    stateRoots,
    header: {
      batchIndex: stateBatchAppendedEvent._batchIndex,
      batchRoot: stateBatchAppendedEvent._batchRoot,
      batchSize: stateBatchAppendedEvent._batchSize,
      prevTotalElements: stateBatchAppendedEvent._prevTotalElements,
      extraData: stateBatchAppendedEvent._extraData,
    },
  };

  //step3
  const messageSlot = ethers.utils.keccak256(
    ethers.utils.keccak256(
      encodeCrossDomainMessageV0(
        sentMessageEvent.target,
        sentMessageEvent.sender,
        sentMessageEvent.message,
        BigNumber.from(sentMessageEvent.messageNonce)
      ) + remove0x(predeploys.L2CrossDomainMessenger)
    ) + "00".repeat(32)
  );

  //step4
  const stateTrieProof = await makeStateTrieProof(
    l2Provider as ethers.providers.JsonRpcProvider,
    Number(l2BlcokNumber),
    predeploys.OVM_L2ToL1MessagePasser,
    messageSlot
  );

  const messageTxIndex = l2BlcokNumber - 1;
  //step5
  const indexInBatch =
    messageTxIndex - stateBatchAppendedEvent._prevTotalElements;
  // Just a sanity check.
  if (stateRootBatch.stateRoots.length <= indexInBatch) {
    // Should never happen!
    throw new Error(`state root does not exist in batch`);
  }
  const stateRoot = {
    stateRoot: stateRootBatch.stateRoots[indexInBatch],
    stateRootIndexInBatch: indexInBatch,
    batch: stateRootBatch,
  };

  //step6
  const proof = {
    stateRoot: stateRoot.stateRoot,
    stateRootBatchHeader: stateRoot.batch.header,
    stateRootProof: {
      index: stateRoot.stateRootIndexInBatch,
      siblings: makeMerkleTreeProof(
        stateRoot.batch.stateRoots,
        stateRoot.stateRootIndexInBatch
      ),
    },
    stateTrieWitness: toHexString(RLP.encode(stateTrieProof.accountProof)),
    storageTrieWitness: toHexString(RLP.encode(stateTrieProof.storageProof)),
  };

  return proof;
};
