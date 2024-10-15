import Image from "next/image";
import betaIconImage from "assets/icons/crosstrade/betaIcon.svg";

export function BetaIcon(style?: React.CSSProperties) {
  return <Image src={betaIconImage} alt={"betaIconImage"} style={style} />;
}
