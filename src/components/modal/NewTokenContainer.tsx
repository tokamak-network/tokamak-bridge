import Image from "next/image";
import { TokenSymbol } from "../image/TokenSymbol";
import {
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { trimAmount } from "@/utils/trim";

import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import ARROW from "assets/icons/arrow.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";

const NewTokenContainer = ({ tx, token }: any) => {
  const { inToken } = useInOutTokens();
  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: tx ? (token?.name as string) : (inToken?.tokenName as string),
    amount: Number(
      tx ? tx._amount : inToken?.parsedAmount?.replaceAll(",", "")
    ),
  });

  return (
    <Box pos={"relative"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        p={"6px 12px"}
        border={"1px solid #313442"}
        bgColor={"#0F0F12"}
        rounded={"8px"}
      >
        <Flex columnGap={2} align={"center"}>
          <TokenSymbol
            tokenType={
              tx ? (tx.inTokenSymbol || "ETH") : (inToken?.tokenSymbol as string)
            }
            w={24}
            h={24}
          />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              {tx ? tx.inTokenSymbol || "ETH" : inToken?.tokenSymbol}
            </Text>
            <Flex align={"center"}>
              <Text fontSize={16} fontWeight={600}>
                {trimAmount(
                  tx
                    ? ethers.utils.formatUnits(
                        tx._amount.toString(),
                        token?.decimals
                      )
                    : inToken?.parsedAmount,
                  8
                )}
              </Text>
              <Text ml={"6px"} fontSize={12} fontWeight={400} color={"#A0A3AD"}>
                ${inTokenWithPrice || "0"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify={"space-between"} align={"center"} columnGap={"6px"}>
          <Image alt="eth" src={Titan} width={24} height={24} />
          <Image alt="eth" src={ARROW} width={16} height={16} />
          <Image alt="eth" src={Ethereum} width={24} height={24} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default NewTokenContainer;