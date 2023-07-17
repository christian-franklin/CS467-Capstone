import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import AnimalGrid from "../components/AnimalGrid";

const Animals = () => {
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
        <AnimalGrid />
      </GridItem>
    </Grid>
  );
};

export default Animals;
