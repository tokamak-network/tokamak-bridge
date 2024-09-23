import { Box, Flex, Input} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  searchTokenStatus,
  IsSearchToken,
  isInputTokenAmount,
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";
import { Overlay_Index } from "@/types/style/overlayIndex";
import useMediaView from "@/hooks/mediaView/useMediaView";
import {
  selectedInTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import CloseIcon from "assets/icons/close.svg";
import SearchIcon from "assets/icons/search.svg";
import CancelIcon from "assets/icons/close.svg";

export const SearchCardToken = () => {
  const { onCloseTokenModal } = useTokenModal();
  const [, setSearchToken] = useRecoilState(searchTokenStatus);
  const { mobileView, pcView } = useMediaView();

  const { connectedChainId } = useConnectedNetwork();
  const ref = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [, setTokenSearch] = useRecoilState(IsSearchToken);
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const [selectedInToken] = useRecoilState(selectedInTokenStatus);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.blur();
      if (selectedInToken?.amountBN) {
        setIsInputAmount(true);
      }
    }, 20);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleFocus = () => {
    setTokenSearch(true);
    setIsInputAmount(false);
  }

  const handleBlur = () => {
    setTokenSearch(false);
  }

  const onKeyDown = (e: any) => {
    if (e.key === "Enter" && mobileView) {
      ref?.current?.blur();
    }
  }

  useEffect(() => {
    if (searchValue === "") {
      return setSearchToken(null);
    }
    if (connectedChainId) {
      return setSearchToken({ nameOrAdd: searchValue, chainId: connectedChainId });
    }
  }, [searchValue])

  return (
    <Flex
      w={"100%"}
      justifyContent={"center"}
      pos={"relative"}
      zIndex={Overlay_Index.BelowHeader}
      border={"1px solid transparent"}
      _hover={{ border: mobileView ? "1px solid #313442" : "" }}
      rounded={{ base: "8px", lg: "21.5px" }}
      bgColor={{ base: "#0F0F12", lg: "transparent" }}
    >
      <Input
        w={{ base: "100%", lg: "430px" }}
        h={"42px"}
        borderRadius={{ base: "8px", lg: "21.5px" }}
        placeholder={"Search token name or address"}
        _placeholder={{ color: "#8E8E92", fontWeight: 500 }}
        boxShadow={"none !important"}
        border={{}}
        bgColor={"#0F0F12"}
        _focus={{}}
        _active={{}}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        ref={ref}
        value={searchValue}
      ></Input>

      {mobileView && (
        <Image
          src={searchValue ? CancelIcon : SearchIcon}
          alt={"close"}
          style={{ cursor: "pointer", marginRight: "10px" }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => { setSearchValue("") }}
        />
      )}

      {pcView && (
        <Box pos={"absolute"} right={"69px"}>
          <Image
            src={CloseIcon}
            alt={"close"}
            style={{ cursor: "pointer" }}
            onClick={() => onCloseTokenModal()}
          />
        </Box>
      )}
    </Flex>
  );
};