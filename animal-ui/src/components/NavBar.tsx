import { HStack, Image } from "@chakra-ui/react";
import logo from "../assets/pet-logo.jpeg";
import ColorModeSwitch from "./ColorModeSwitch";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <HStack justifyContent={"space-between"} padding="10px">
      <Link to="/">
        <Image src={logo} boxSize="60px" padding={1} />
      </Link>
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
