import { Switch, FormControl, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import "@/css/pools/toggle.css"; // Import the custom CSS file

type ToggleButtonProps = {
  inToken: string;
  outToken: string;
};

export default function ToggleSwitch(props: ToggleButtonProps) {
  const { inToken, outToken } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <FormControl display="flex" alignItems="center">
      <Switch
        id="toggle-switch"
        size="lg"
        isChecked={isChecked}
        onChange={handleToggle}
        className={isChecked ? "switch-on" : ""}
      />
      <FormLabel htmlFor="toggle-switch" mb="0" className="switch-label">
        {isChecked ? `${inToken}` : `${outToken}`}
      </FormLabel>
    </FormControl>
  );
}
