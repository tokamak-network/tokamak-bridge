import { Box, Flex } from "@chakra-ui/react";
import SpinnerImage from "assets/image/spinner.svg";
import SlimSpinnerImage from "assets/image/slimSpinner.svg";
import Image from "next/image";

export const LoadingCircleSpinner = (props: {
  width?: number;
  height?: number;
  containerHeight?: number | string;
  isSlim?: boolean;
}) => {
  return (
    <Flex
      w={"100%"}
      h={props.containerHeight ?? "180px"}
      justifyContent={"center"}
      alignItems={"center"}
      pos={"relative"}
      alignContent={"center"}
      justify={"center"}
    >
      <Box animation={"spinner 1.2s linear infinite"}>
        <Image
          src={props.isSlim ? SlimSpinnerImage : SpinnerImage}
          alt={"SpinnerImage"}
          width={props.width ?? 40}
          height={props.height ?? 40}
        />
      </Box>
    </Flex>
  );
};
