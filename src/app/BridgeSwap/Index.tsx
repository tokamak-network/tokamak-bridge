import { Flex } from "@chakra-ui/layout";
import Swap from "./Swap";
import TransactionDetail from "./TransactionDetail";
import {
  SelectCardButton,
  SelectCardModal,
} from "@/components/card/SelectCard";
import ActionButton from "./components/ActionButton";
import Modals from "./Modals";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import ApproveToken from "./ApproveToken";
import { useApprove } from "@/hooks/token/useApproval";

export default function BridgeSwap() {
  const { mode } = useRecoilValue(actionMode);
  const { isApproved } = useApprove();

  return (
    <Flex flexDir={"column"} w={"496px"} h={"100%"}>
      {/* <Flex mb={"auto"}>
        <SelectCardButton field="OUTPUT" />
      </Flex> */}
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100%"}
        h={"100%"}
      >
        <Swap />
        <Flex flexDir={"column"} w={"100%"} mt={"24px"} rowGap={"10px"}>
          {mode !== null && (
            <Flex w={"100%"} flexDir={"column"} rowGap={"10px"}>
              <TransactionDetail />
              {isApproved === false && <ApproveToken />}
            </Flex>
          )}
          <ActionButton />
        </Flex>
      </Flex>
      {/* <Flex mt={"auto"}>
        <SelectCardButton field="INPUT" />
      </Flex> */}
      <Modals />
    </Flex>
  );
}
