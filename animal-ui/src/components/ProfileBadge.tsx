import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";

const ProfileBadge = () => {
  return (
    <Menu>
      <MenuButton as={CgProfile} size="24px" />
      <MenuList>
        <MenuItem>View Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileBadge;
