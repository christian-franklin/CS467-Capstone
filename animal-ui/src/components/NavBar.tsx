import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Image,
  Link,
} from "@chakra-ui/react";
import logo from "../assets/logo.png";
import ColorModeSwitch from "./ColorModeSwitch";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "~/hooks/useUsers";

interface Props {
  user: User | null;
}

export default function NavBar({ user }: Props) {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Link href="/">
              <Image src={logo} boxSize="60px" padding={1} />
            </Link>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {user?.Admin === "Y" && (
                <Button variant="ghost" colorScheme="teal">
                  <Link href="/create-animal/">Create Animal</Link>
                </Button>
              )}
              <ColorModeSwitch />

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} />
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <MenuItem>
                    <Link href="/user-favorites">Favorites</Link>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
