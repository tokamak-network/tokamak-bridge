import { NetworkSymbol } from "@/components/image/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { Token } from "@uniswap/sdk-core";
import CloseButton from "../button/CloseButton";
import Add from "assets/icons/addIcon.svg";
import Arrow from "assets/icons/arrow.svg";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil";
import useGetTransaction from "@/hooks/user/useGetTransaction";
import { supportedTokens } from "@/types/token/supportedToken";

// export default function TxToast(props: {
//   onClose: () => void;
//   funcName: string;
//   functSub?: string;
//   token0: any;
//   token1?: any;
//   type?: string;
// }) {
//   const { onClose, funcName, functSub, token0, token1, type } = props;
//   const toast = useToast();

function CustomToastComponent(props: {
  funcName: string;
  functSub?: string;
  token0: any;
  token1?: any;
  type?: string;
}) {
  const { funcName, functSub, token0, token1, type } = props;
  const [isOpen, setIsOpen] = useState<boolean>(true);

  function close() {
    setIsOpen(false);
  }

  return (
    <Flex
      h="84px"
      w="340px"
      border={"1px solid #313442"}
      bg="#1F2128"
      borderRadius={"8px"}
      transition={"none"}
      position={"absolute"}
      top={"80px"}
      right={"38px"}
      flexDir={"column"}
      justifyContent={"flex-start"}
      p="8px"
      display={isOpen ? "flex" : "none"}
    >
      <Flex w="100%" justifyContent={"flex-end"}>
        <Flex h="16px" w="16px">
          <CloseButton onClick={close} />
        </Flex>
      </Flex>

      <Flex position={"relative"} top={"-8px"}>
        <Flex
          ml="12px"
          flexDir={"column"}
          justifyContent={"center"}
          h="44px"
          w="92px"
        >
          <Text fontSize={"14px"} color={"#FFFFFF"}>
            {funcName}
          </Text>
          <Text fontSize={"10px"} color={"#A0A3AD"}>
            ({functSub})
          </Text>
        </Flex>
        <Flex mt={"-2px"} justifyContent="center" alignItems={"center"}>
          <Flex
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box zIndex={100}>
              <TokenSymbol
                tokenType={token0?.tokenSymbol as string}
                w={32}
                h={32}
              />
              <Box pos={"relative"} top={"-14px"} left={"23px"}>
                <NetworkSymbol
                  network={token0?.chainId}
                  w={14}
                  h={14}
                  style={{
                    borderRadius: "4px",
                    position: "absolute",
                    right: 0,
                  }}
                />
              </Box>
            </Box>
            <Text fontSize={"11px"} mt={"-8px"}>
              48,438.085... ETH
            </Text>
          </Flex>
          {type && (
            <>
              <Flex h="14px" w="14px" mx={"7px"} mt={"-8px"}>
                <Image src={type === "arrow" ? Arrow : Add} alt="Add" />
              </Flex>
              <Flex
                flexDir={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box>
                  <TokenSymbol
                    tokenType={token1?.tokenSymbol as string}
                    w={32}
                    h={32}
                  />
                  <Box pos={"relative"} top={"-14px"} left={"23px"}>
                    <NetworkSymbol
                      network={token1?.chainId}
                      w={14}
                      h={14}
                      style={{
                        borderRadius: "4px",
                        position: "absolute",
                        right: 0,
                      }}
                    />
                  </Box>
                </Box>
                <Text fontSize={"11px"} mt={"-8px"}>
                  48,438.085... ETH
                </Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function TxToast() {
  const toast = useToast();
  const { isLoading, isSuccess } = useGetTransaction();
  
  const callToast = () => {
    try {
      if (isSuccess === 1) {
        toast({
          position: "top-right",
          variant: "solid",
          isClosable: false,
          id: "xx",
          duration: 2000,
          render: () => (
            <CustomToastComponent
              funcName="Add"
              functSub="Swap"
              token0={supportedTokens[0]}
              token1={supportedTokens[1]}
              type="add"
            />
          ),
        });
      }
    } finally {
    }
  };
  return <>{callToast()}</>;
}

export default TxToast;
