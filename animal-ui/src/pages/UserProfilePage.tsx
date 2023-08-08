import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import UserProfile from "../components/UserProfile";
import useUsers from "../hooks/useUsers";

const UserProfilePage = () => {
  const { user } = useUsers();

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "main main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar user={user} />
      </GridItem>
      <GridItem area="main">
        <UserProfile />
      </GridItem>
    </Grid>
  );
};

export default UserProfilePage;
