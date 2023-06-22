import CloseIcon from "assets/icons/close.svg";
import Image from "next/image";
import { CSSProperties } from "react";

export default function CloseButton(props: {
  onClick: () => void;
  style?: CSSProperties;
}) {
  const { onClick } = props;
  return (
    <Image
      src={CloseIcon}
      alt={"CloseIcon"}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
}
