import { TokenInfo } from "@/types/token/supportedToken";
import { ethers } from "ethers";

export function convertNumber(
  amount: bigint | string,
  decimals: TokenInfo["decimals"]
) {
  const parsedAmount = ethers.utils.formatUnits(String(amount), decimals);
  return parsedAmount;
}

/**
 * A function that takes a number and slices it to the specified number of decimal places.
 * @param {number | string} amount - The input number.
 * @param {number} decimals - The number of decimal places to keep.
 * @returns {string} - The number string limited to the specified decimal places.
 */
export function limitDecimals(
  amount: number | string,
  decimals: number | undefined
): string | undefined {
  if (decimals === undefined || isNaN(Number(amount))) return undefined;
  // 문자열로 변환
  let amountStr = String(amount);

  // 소수점 위치 찾기
  const decimalIndex = amountStr.indexOf(".");

  if (decimalIndex !== -1) {
    // 소수점 이하 자릿수 계산
    const fractionalPart = amountStr.slice(decimalIndex + 1);

    // 소수점 이하 자릿수가 decimals보다 큰 경우 자르기
    if (fractionalPart.length > decimals) {
      amountStr = amountStr.slice(0, decimalIndex + decimals + 1);
    }
  }

  return amountStr;
}

export function toParseNumber(amount: bigint | string, decimals: number) {
  if (isNaN(Number(amount.toString()))) return undefined;
  const amountWithLimitedDecimals = limitDecimals(amount.toString(), decimals);
  if (amountWithLimitedDecimals)
    return ethers.utils.parseUnits(amountWithLimitedDecimals, decimals);
}

export function formatUnits(amount?: string, decimals?: number) {
  if (amount === undefined || decimals === undefined) return "0";
  return ethers.utils.formatUnits(amount, decimals);
}
