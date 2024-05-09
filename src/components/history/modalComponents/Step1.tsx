import { Flex, Text, Link } from "@chakra-ui/react";
import Image from "next/image";
import checkDone from "assets/icons/check_done.svg";
import checkProgress from "assets/icons/check_progress.svg";
import checkTodo from "assets/icons/check_todo.svg";
import GasImgTodo from "assets/icons/gasStation.svg";
import GasImgDone from "assets/icons/gasStation_done.svg";
import GasImgProgress from "assets/icons/gasStation_progress.svg";
import { confirmWithdrawData } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import TxLinkIcon from "assets/icons/accountHistory/TxLink.svg";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { checkDocument } from "@apollo/client/utilities";

const Step1 = (props: { progress: string; check: any }) => {
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdrawData);
  const tx = withdraw.modalData;
  const providers = useGetTxLayers();
  const { gasCostUS } = useGasFee();
  const { check } = props;
  return (
    <Flex
      h="36px"
      justifyContent={"space-between"}
      alignItems={"center"}
      // border={"1px solid red"}
      w="100%"
    >
      <Flex>
        <Image src={check.check} alt="check" />
        <Text ml="8px" fontSize={"14px"} color={check.color}>
          Initiate withdraw
        </Text>
      </Flex>
      {tx ? (
        <Flex>
          <Link
            target="_blank"
            href={`${providers.l2BlockExplorer}/tx/${tx.l2txHash}`}
            textDecor={"none"}
            _hover={{ textDecor: "none" }}
            display={"flex"}
          >
            <Text mr="6px" fontSize={"14px"} color={"#FFFFFF"}>
              Transaction
            </Text>
            <Image src={TxLinkIcon} alt="gas station" />
          </Link>
        </Flex>
      ) : (
        <Flex>
          <Text
            mr="6px"
            fontSize={"14px"}
            color={gasCostUS ? check.color : "#A0A3AD"}
          >
            {gasCostUS
              ? Number(gasCostUS) < 0.01
                ? `< $0.01`
                : `~ $ ${gasCostUS}`
              : "NA"}
          </Text>
          {gasCostUS && <Image src={check.gas} alt="gas station" />}
        </Flex>
      )}
      {/* <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
          ${gasCostUS}
          </Text>
          <Image src={check(props.progress).gas} alt="gas station" />
        </Flex> */}
    </Flex>
  );
};

export default Step1;
