import { FullWithTx } from "@/types/activity/history";
import { Flex } from "@chakra-ui/react";
import Step2 from "./Step2";
import Step1 from "./Step1";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Dots from "./Dots";
import checkDone from "assets/icons/check_done.svg";
import checkProgress from "assets/icons/check_progress.svg";
import checkTodo from "assets/icons/check_todo.svg";
import GasImgTodo from "assets/icons/gasStation.svg";
import GasImgDone from "assets/icons/gasStation_done.svg";
import GasImgProgress from "assets/icons/gasStation_progress.svg";

type TxType = FullWithTx & {
  inTokenAmount: string;
  inTokenSymbol: string;
};

export default function TimelineComponent(props: { tx: TxType }) {
  const { tx } = props;

  const check = (progress: string) => {
    switch (progress) {
      case "inProgress":
        return { check: checkProgress, color: "#FFF", gas: GasImgProgress };
      case "done":
        return { check: checkDone, color: "#007AFF", gas: GasImgDone };

      case "todo":
        return { check: checkTodo, color: "#A0A3AD", gas: GasImgTodo };
      default:
        return { check: checkTodo, color: "#A0A3AD", gas: GasImgTodo };
    }
  };

  return (
    <Flex
      flexDir={"column"}
      bg="#15161D"
      borderRadius={"8px"}
      w={{ base: "full", lg: "364px" }}
      h="218px"
      px="12px"
      py="8px"
    >
      <Step1
        progress={
          props.tx === undefined || props.tx === null ? "inProgress" : "done"
        }
        check={check(
          props.tx === undefined || props.tx === null ? "inProgress" : "done"
        )}
      />
      <Dots
        progress={!props.tx ? "inProgress" : "done"}
        color={check(!props.tx ? "inProgress" : "done").color}
      />
      <Step2
        progress={
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 2
            ? "inProgress"
            : props.tx.currentStatus > 2
            ? "done"
            : "todo"
        }
        check={check(
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 2
            ? "inProgress"
            : props.tx.currentStatus > 2
            ? "done"
            : "todo"
        )}
        timeStamp={tx ? Number(tx.l2timeStamp) : undefined}
      />
      <Dots
        progress={
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 2
            ? "inProgress"
            : props.tx.currentStatus > 2
            ? "done"
            : "todo"
        }
        color={
          check(
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 2
              ? "inProgress"
              : props.tx.currentStatus > 2
              ? "done"
              : "todo"
          ).color
        }
      />
      <Step3
        progress={
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 4
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
        }
        timeStamp={tx ? Number(tx.timeReadyForRelay) : 0}
        check={check(
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 4
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
        )}
      />
      <Dots
        progress={
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 4
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
        }
        color={
          check(
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 4
              ? "inProgress"
              : props.tx.currentStatus > 4
              ? "done"
              : "todo"
          ).color
        }
      />
      <Step4
        progress={
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 5
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
        }
        check={check(
          !props.tx
            ? "todo"
            : props.tx.currentStatus === 5
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
        )}
      />
    </Flex>
  );
}
