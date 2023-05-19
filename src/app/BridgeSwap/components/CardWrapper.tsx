import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function CardWrapper(ChildrenNode: ReactNode) {
  return <Flex className="card-wrapper">{ChildrenNode}</Flex>;
}
