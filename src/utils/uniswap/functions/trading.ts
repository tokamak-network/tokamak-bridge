import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import {
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import JSBI from "jsbi";

import { CurrentConfig } from "../config";
import ERC20_ABI from "../../../constant/abis/erc20.json";

import {
  L1_UniswapContracts,
  L2_UniswapContracts,
} from "../../../constant/contracts/uniswap";
import { getPoolInfo } from "./pool";
import {
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from "../libs/provider";
import { fromReadableAmount } from "../libs/converstion";
import { getL1Provider } from "@/config/l1Provider";
import { quote } from "./quote";

export type TokenTrade = Trade<Token, Token, TradeType>;

// const { QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS } = L1_UniswapContracts;
const { QUOTER_CONTRACT_ADDRESS, SWAP_ROUTER_ADDRESS } = L2_UniswapContracts;

const MAX_FEE_PER_GAS = 100000000000;
const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
const TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER = 2000;

// Trading Functions
export async function createTrade(): Promise<TokenTrade> {
  const poolInfo = await getPoolInfo();

  console.log("**poolInfo**");
  console.log(poolInfo);

  const pool = new Pool(
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out,
    CurrentConfig.tokens.poolFee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  console.log("**pool**");
  console.log(pool);

  const swapRoute = new Route(
    [pool],
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out
  );

  console.log("**swapRoute**");
  console.log(swapRoute);

  // const amountOut = await getOutputQuote(swapRoute);
  const amountOut = await quote();

  console.log("**amountOut**");
  console.log(amountOut);

  // const precision = 18; // Specify the desired precision (number of decimal places)
  // const integerNumber = Math.floor(Number(amountOut) * Math.pow(10, precision));

  // console.log(integerNumber);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.out,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}

export async function executeTrade(
  trade: TokenTrade
): Promise<TransactionState> {
  const walletAddress = getWalletAddress();
  const provider = getL1Provider();

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in);

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed;
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress as string,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  //@ts-ignore
  const res = await sendTransaction(tx);

  return res;
}

// Helper Quoting and Pool Functions

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = getL1Provider();

  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    TradeType.EXACT_INPUT
    // {
    //   useQuoterV2: true,
    // }
  );

  console.log("**calldata**");
  console.log(calldata);

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  console.log("**quoteCallReturnData**");
  console.log(quoteCallReturnData);

  return ethers.utils.defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
}

export async function getTokenTransferApproval(
  token: Token
): Promise<TransactionState> {
  const provider = getL1Provider();
  const address = "0x8c595DA827F4182bC0E3917BccA8e654DF8223E1";
  // getWalletAddress();
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI.abi,
      provider
    );

    const transaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_ADDRESS,
      fromReadableAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals
      ).toString()
    );

    return sendTransaction({
      ...transaction,
      from: address,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
