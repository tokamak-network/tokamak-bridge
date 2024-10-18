import { Icon } from "@chakra-ui/react";
import { createIcon } from "@chakra-ui/icons";

export default function CheckCustomIcon(props: any) {
  const { isChecked, ...rest } = props;

  const d =
    "M9.7071 3.07023L4.43168 8.34528C4.04103 8.73601 3.40733 8.73601 3.01631 8.34528L0.293099 5.62188C-0.0976998 5.23115 -0.0976998 4.59738 0.293099 4.20658C0.683973 3.81571 1.31762 3.81571 1.70832 4.20643L3.7242 6.22234L8.29165 1.65486C8.68253 1.26399 9.31622 1.26428 9.70695 1.65486C10.0977 2.04566 10.0977 2.67921 9.7071 3.07023Z";

  return (
    <>
      {isChecked ? (
        <Icon viewBox="0 0 10 10" {...rest}>
          <path fill="currentColor" d={d} />
        </Icon>
      ) : null}
    </>
  );
}
