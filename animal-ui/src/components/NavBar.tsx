import { HStack, Image } from "@chakra-ui/react";
import logo from "../assets/pet-logo.jpeg";

const NavBar = () => {
  return (
    <HStack>
      <Image src={logo} boxSize="60px" padding={1} />
    </HStack>
  );
};

export default NavBar;
