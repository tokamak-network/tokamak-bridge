import { TOKAMAK_CONTRACTS } from "@/constant/contracts";
import { providers, utils } from "ethers";

const ERC20_ABI = [
  "event ERC20DepositInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)",
];
const ETH_ABI = [
  "event ETHDepositInitiated(address indexed, address indexed, uint256, bytes)",
];

/**
 * Description placeholder
 *
 * @param {boolean} isErc20Deposit
 * @param {providers.Log} log
 * @returns {{
 *   l1Token: string;
 *   l2Token: string;
 *   amount: string;
 * }}
 */
export const getDecodeLog = (
  isErc20Deposit: boolean,
  log: providers.Log,
): {
  l1TokenAddress: string;
  l2TokenAddress: string;
  amount: string;
} => {
  if (isErc20Deposit) {
    const iface = new utils.Interface(ERC20_ABI);
    const decodedLog = iface.decodeEventLog(
      "ERC20DepositInitiated",
      log.data,
      log.topics,
    );
    const { _l1Token, _l2Token, _amount } = decodedLog;
    return {
      l1TokenAddress: _l1Token,
      l2TokenAddress: _l2Token,
      amount: _amount.toString(),
    };
  }
  const iface = new utils.Interface(ETH_ABI);
  const decodedLog = iface.decodeEventLog(
    "ETHDepositInitiated",
    log.data,
    log.topics,
  );
  /**
     * decodedLog example
     * [
      "0xceB2196aDdf345F68d1F536DdAA49FE54BcBDDAD",
      "0xceB2196aDdf345F68d1F536DdAA49FE54BcBDDAD",
      {
        type: "BigNumber",
        hex: "0x02c68af0bb140000",
      },
      "0x",
    ];
     */

  return {
    l1TokenAddress: "",
    l2TokenAddress: TOKAMAK_CONTRACTS.OVM_ETH,
    amount: decodedLog[2].toString(),
  };
};
