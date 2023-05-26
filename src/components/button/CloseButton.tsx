import CloseIcon from "assets/icons/close.svg";
import Image from "next/image";

export default function CloseButton(props: { onClick: () => void }) {
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
