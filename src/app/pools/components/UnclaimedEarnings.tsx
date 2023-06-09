import { Flex, Box, Text, Button, Divider } from "@chakra-ui/react";
import TokenNetwork from "@/components/ui/TokenNetwork";

interface UnclaimedEarningsProps {
  titleText?: string;
  openModal: () => void;
  //   value: number;
  //   onClickAdd: () => void;
  //   onClickRemove: () => void;
  //   onChange: (value: any) => void;
}

export default function UnclaimedEarnings(props: UnclaimedEarningsProps) {
  const { titleText, openModal } = props;

  return (
    <Box
      bg="#1F2128"
      w="384px"
      //   h="163px"
      h="121px"
      py="14px"
      px="20px"
      borderRadius={"12px"}
      mb={"16px"}
      mt={"16px"}
      alignItems="center"
    >
      <Flex alignItems={"left"} flexDir={"column"}>
        <Text>Unclaimed earnings</Text>
        <Text fontSize={"24px"} as="b" mt={"6px"}>
          $0.20
        </Text>
        <Flex mb={"8px"}>
          <Text fontSize={"12px"} color="#A0A3AD">
            0.00005669 LYDA
          </Text>{" "}
          +
          <Text fontSize={"12px"} color="#A0A3AD">
            0.00005669 ETH
          </Text>
        </Flex>
        <Flex position={"relative"} style={{ left: "247px", top: "-66px" }}>
          <Button
            bgColor={"#007AFF"}
            _hover={{ bgColor: "#007AFF" }}
            onClick={openModal}
          >
            Collect
          </Button>
        </Flex>
      </Flex>
      {/* If In Range */}
      {/* <Divider style={{ border: "1px solid #313442" }} /> */}
      {/* <Flex mt={"15px"} justifyContent={"space-between"}>
        <Flex>Collect as WETH</Flex>
        <Flex top={"56px"}>
          <Flex position={"relative"}>
            <Button bgColor={"#007AFF"} _hover={{ bgColor: "#007AFF" }}>
              Collect
            </Button>
          </Flex>
        </Flex>
      </Flex> */}
    </Box>
  );
}
