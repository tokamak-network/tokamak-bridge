import { SupportedTokenSymbol } from "types/token/supportedToken";
import { BigNumberish } from "ethers";
import { Contract, ethers } from "ethers";

export type UserToken = {
  tokenName: SupportedTokenSymbol | string;
  tokenBalanceBN: BigNumberish;
  tokenBlanceFormatted: string;
};

class TokenBalance {
  erc20Contract: Contract;
  account: string;
  decimals?: number;
  tokenBalanceBN: Promise<string>;
  tokenBlanceFormatted: Promise<string>;

  constructor(erc20Contract: Contract, account: string, decimals?: number) {
    this.erc20Contract = erc20Contract;
    this.account = account;
    this.decimals = decimals ?? 18;

    this.tokenBalanceBN = this.fetchBalanceWei();
    this.tokenBlanceFormatted = this.fetchBalanceCommified();
  }

  private async fetchBalanceWei(): Promise<string> {
    const balanceBN = await this.erc20Contract.balanceOf(this.account);
    const balanceWei = ethers.utils.formatUnits(balanceBN, this.decimals);

    return balanceWei;
  }

  private async fetchBalanceCommified(): Promise<string> {
    const balanceBN = await this.erc20Contract.balanceOf(this.account);
    const balanceCommified = ethers.utils.formatEther(balanceBN);
    return balanceCommified;
  }

  async getBalanceBN() {
    return this.tokenBalanceBN;
  }
  async getTokenBlanceFormatted() {
    return this.tokenBlanceFormatted;
  }
}
