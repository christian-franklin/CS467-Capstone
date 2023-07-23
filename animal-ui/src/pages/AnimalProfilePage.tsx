import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AnimalProfile from "../components/AnimalProfile";

const AnimalProfilePage = () => {
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
        <AnimalProfile />
      </GridItem>
    </Grid>
  );
};

export default AnimalProfilePage;
