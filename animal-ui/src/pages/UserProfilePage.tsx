import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import UserProfile from "../components/UserProfile";

const UserProfilePage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "main main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <GridItem area="main">
        <UserProfile />
      </GridItem>
    </Grid>
  );
};

export default UserProfilePage;
