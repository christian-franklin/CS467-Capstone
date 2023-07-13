import { HStack, Switch, useColorMode } from "@chakra-ui/react";
import { MoonIcon } from "@chakra-ui/icons";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <HStack>
      <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
      <MoonIcon />
    </HStack>
  );
};

export default ColorModeSwitch;
