import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AnimalProfile from "../components/AnimalProfile";

const AnimalProfilePage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>
      <Show above="lg">
        <GridItem area="aside">Side bar</GridItem>
      </Show>
      <GridItem area="main">
        <AnimalProfile />
      </GridItem>
    </Grid>
  );
};

export default AnimalProfilePage;
