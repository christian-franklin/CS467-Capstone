import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AnimalProfile from "../components/AnimalProfile";
import useUsers from "../hooks/useUsers";

const AnimalProfilePage = () => {
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
        <AnimalProfile />
      </GridItem>
    </Grid>
  );
};

export default AnimalProfilePage;
